create table departments(
                            dept_id varchar(20) PRIMARY KEY comment '科室 ID',
                            dept_name varchar(50) NOT NULL comment '科室名称,如 "内科"、"外科',
                            dept_desc varchar(200) comment '科室描述',
                            dept_head varchar(50) comment '科室负责人 ID',
                            dept_status tinyint DEFAULT 1 comment '科室状态,0: 停用 1: 启用（默认）',
                            create_time datetime comment '创建时间 '
)comment '科室表';

create table doctors(
                        doctor_id varchar(50) PRIMARY KEY comment '医生 ID',
                        doctor_name varchar(50) comment '医生姓名',
                        doctor_gender tinyint not null comment ' 1: 男 2: 女',
                        doctor_title varchar(50) comment '职称',
                        doctor_dept_id varchar(20) comment '所属科室 ID',
                        doctor_specialty varchar(100) comment '擅长领域',
                        doctor_status tinyint comment '状态,0: 休假 1: 正常出诊',
                        create_time datetime comment '创建时间',
                        FOREIGN KEY (`doctor_dept_id`) REFERENCES departments(`dept_id`)
)comment '医生表';

-- 预约与排班管理
CREATE TABLE schedules (
                           schedule_id int AUTO_INCREMENT PRIMARY KEY COMMENT '排班ID（主键），自增',
                           doctor_id int,  -- 修改为int类型
                           schedule_date date COMMENT '排班日期',
                           schedule_time varchar(20) COMMENT '时间段,如 "上午"、"下午"、"晚上"',
                           max_patients int DEFAULT 30 COMMENT '最大预约数,默认30人',
                           current_patients int DEFAULT 0 COMMENT '已预约数,默认0',
                           schedule_status tinyint DEFAULT 1 COMMENT '排班状态,0: 取消 1: 正常（默认）',
                           create_time datetime COMMENT '创建时间',
                           FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
)comment '排班表';
-- 医生科室变更历史表
CREATE TABLE doctor_dept_history (
                                     history_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '变更记录ID',
                                     doctor_id int COMMENT '医生ID',
                                     old_dept_id VARCHAR(20) COMMENT '原科室ID',
                                     new_dept_id VARCHAR(20) COMMENT '新科室ID',
                                     change_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '变更时间',
                                     FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
) COMMENT '医生科室变更历史表';

create table appointments(
                             appointment_id varchar(50) PRIMARY KEY comment '预约 ID',
                             patient_id varchar(50) comment '患者 ID',
                             doctor_id varchar(50) comment '医生 ID',
                             schedule_id int comment '排班 ID',
                             appointment_time datetime comment '预约时间',
                             symptoms varchar(200) comment '症状描述',
                             appointment_status tinyint DEFAULT 3 comment '预约状态,0: 已取消 1: 待就诊 2: 已完成 3: 已爽约',
                             create_time datetime comment '创建时间',
                             FOREIGN KEY (`patient_id`) REFERENCES patients(`patient_id`),
                             FOREIGN KEY (`doctor_id`) REFERENCES doctors(`doctor_id`),
                             FOREIGN KEY (`schedule_id`) REFERENCES schedules(`schedule_id`)
)comment '预约表';

ALTER TABLE departments ADD COLUMN dept_address VARCHAR(200) COMMENT '科室地址';
ALTER TABLE schedules ADD COLUMN dept_id VARCHAR(20) COMMENT '科室ID';

-- 添加科室
DELIMITER //
CREATE PROCEDURE sp_AddDepartment(
    IN p_dept_name VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_dept_id VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    IN p_dept_head VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci

)
BEGIN
    DECLARE count_name INT;
    DECLARE count_id INT;
    -- 检查科室名称是否已存在
SELECT COUNT(*) INTO count_name FROM departments WHERE dept_name = p_dept_name;
IF count_name > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '该科室名称已存在，请重新输入';
END IF;
    -- 若传入dept_id，检查其唯一性
    IF p_dept_id IS NOT NULL THEN
SELECT COUNT(*) INTO count_id FROM departments WHERE dept_id = p_dept_id;
IF count_id > 0 THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = '该科室ID已存在，请重新输入';
END IF;
ELSE
        -- 自动生成dept_id
        SET p_dept_id = UUID();
END IF;
    -- 插入新科室记录
INSERT INTO departments (dept_id, dept_name, dept_head)
VALUES (p_dept_id, p_dept_name, p_dept_head);
END //
DELIMITER ;

--  更新科室地址
DELIMITER //
CREATE PROCEDURE sp_UpdateDeptAddress(
    IN p_dept_id VARCHAR(50),
    IN p_new_address VARCHAR(200)
)
BEGIN
UPDATE departments
SET dept_address = p_new_address
WHERE dept_id = p_dept_id;
-- 检查是否更新成功
IF ROW_COUNT() = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '未找到对应的科室记录，更新失败';
END IF;
END //
DELIMITER ;
-- 更新科室负责人
DELIMITER //
CREATE PROCEDURE sp_UpdateDeptHead(
    IN p_dept_id VARCHAR(50),
    IN p_new_head VARCHAR(50)
)
BEGIN
    DECLARE doctor_exists INT;
    DECLARE doctor_status INT;
    DECLARE has_schedule_or_appointment INT;
    -- 检查新指定医生ID是否存在且状态正常
SELECT COUNT(*), doctor_status INTO doctor_exists, doctor_status
FROM doctors
WHERE doctor_id = p_new_head AND doctor_status = 1;
IF doctor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '新指定的医生ID不存在';
    ELSEIF doctor_status = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '新指定的医生状态不正常，无法设置为科室负责人';
ELSE
        -- 检查科室是否存在未完成的排班或预约
SELECT COUNT(*) INTO has_schedule_or_appointment
FROM (
         SELECT 1
         FROM schedules s
                  JOIN doctors d ON s.doctor_id = d.doctor_id AND d.dept_id = p_dept_id AND s.schedule_status = 1
         UNION ALL
         SELECT 1
         FROM appointments a
                  JOIN doctors d ON a.doctor_id = d.doctor_id AND d.dept_id = p_dept_id AND a.appointment_status IN (1, 3)
     ) AS subquery;
IF has_schedule_or_appointment > 0 THEN
            SIGNAL SQLSTATE '01000'
                SET MESSAGE_TEXT = '该科室存在未完成的排班或预约，更新可能影响业务，请确认是否继续';
ELSE
            -- 更新科室负责人
UPDATE departments
SET dept_head = p_new_head
WHERE dept_id = p_dept_id;
END IF;
END IF;
END //
DELIMITER ;

-- 添加医生
DELIMITER //
CREATE PROCEDURE sp_AddDoctor(
    IN p_doctor_name VARCHAR(50),
    IN p_doctor_dept_id VARCHAR(50),
    IN p_doctor_specialty VARCHAR(100)
)
BEGIN
    DECLARE new_doctor_id VARCHAR(50);
    DECLARE dept_exists INT;
    -- 检查所属科室ID是否存在
SELECT COUNT(*) INTO dept_exists FROM departments WHERE dept_id = p_doctor_dept_id;
IF dept_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '所属科室ID无效，请重新输入';
ELSE
        -- 生成doctor_id
        SET new_doctor_id = UUID();
        -- 插入新医生记录
INSERT INTO doctors (doctor_id, doctor_name, dept_id, doctor_specialty)
VALUES (new_doctor_id, p_doctor_name, p_doctor_dept_id, p_doctor_specialty);
END IF;
END //
DELIMITER ;

-- 更新医生所属科室
DELIMITER //
CREATE PROCEDURE UpdateDoctorInfo(
    IN p_doctor_id varchar(50),
    IN p_doctor_name VARCHAR(255),
    IN p_doctor_gender int,
    IN p_doctor_title VARCHAR(255),
    IN p_doctor_department_name VARCHAR(255),
    IN p_doctor_specialty VARCHAR(255),
    IN p_doctor_status VARCHAR(255)
)
BEGIN
    -- 更新医生信息，使用COALESCE函数处理NULL值（若传入NULL则保持原值）
    UPDATE doctors
    SET
        doctor_name = COALESCE(p_doctor_name, doctor_name),
        doctor_gender = COALESCE(p_doctor_gender, doctor_gender),
        doctor_title = COALESCE(p_doctor_title, doctor_title),
        doctor_specialty = COALESCE(p_doctor_specialty,doctor_specialty),
        doctor_status = COALESCE(p_doctor_status,doctor_status)
    WHERE doctor_id = p_doctor_id;
END //
DELIMITER ;

-- 查询医生
DELIMITER //
create procedure getDoctors(IN p_doctor_name varchar(50),IN p_dept_id varchar(10),IN p_doctor_status varchar(50))
begin
    # 查询条件为'' 设置为空
    if(p_doctor_name='')then
        set p_doctor_name=null;
    end if ;
    if(p_doctor_status='')then
        set p_doctor_status=null;
    end if ;
    if(p_dept_id='')then
        set p_dept_id=null;
    end if ;

    select doctors.*,dept_name from doctors join departments on doctors.dept_id = departments.dept_id
                            where (p_doctor_name is null or p_doctor_name=doctor_name)
                            and (p_dept_id is null or p_dept_id=doctor_id)
                            and (p_doctor_status is null or doctor_status = p_doctor_status) ;
end //
DELIMITER ;

-- 物理删除医生记录（先取消排班和预约）
DELIMITER //
CREATE PROCEDURE sp_DeleteDoctor(
    IN p_doctor_id VARCHAR(50)
)
BEGIN
    DECLARE has_schedule INT;
    DECLARE has_appointment INT;
    -- 检查是否存在关联排班记录
SELECT COUNT(*) INTO has_schedule FROM schedules WHERE doctor_id = p_doctor_id;
-- 检查是否存在关联预约记录
SELECT COUNT(*) INTO has_appointment FROM appointments WHERE doctor_id = p_doctor_id;
IF has_schedule > 0 OR has_appointment > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '该医生存在未取消的排班或预约，无法删除';
ELSE
DELETE FROM doctors WHERE doctor_id = p_doctor_id;
END IF;
END //
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE addDoctor(
    IN p_doctor_name VARCHAR(50),       -- 医生姓名（必填）
    IN p_doctor_gender TINYINT,        -- 性别（0/1，可选）
    IN p_doctor_title VARCHAR(20),     -- 职称（可选）
    IN p_dept_id INT,                  -- 科室ID（必填）
    IN p_doctor_specialty VARCHAR(100),-- 专业（可选）
    IN p_doctor_status TINYINT         -- 状态（0/1，可选，默认1）
)
BEGIN
    -- 声明变量
    DECLARE v_error_code INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SET v_error_code = 1;
        END;

    -- 开启事务
    START TRANSACTION;

    -- 校验必填参数
    IF p_doctor_name IS NULL OR p_doctor_name = '' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '医生姓名不能为空';
    END IF;

    IF p_dept_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '科室ID不能为空';
    END IF;

    -- 插入数据（使用COALESCE设置默认值）
    INSERT INTO doctors (
        doctor_name,
        doctor_gender,
        doctor_title,
        dept_id,
        doctor_specialty,
        doctor_status
    ) VALUES (
                 p_doctor_name,
                 COALESCE(p_doctor_gender, NULL),    -- 允许NULL
                 COALESCE(p_doctor_title, '未设置'),  -- 设置默认值
                 p_dept_id,
                 COALESCE(p_doctor_specialty, '无'), -- 设置默认值
                 COALESCE(p_doctor_status, 1)        -- 默认状态为1（正常出诊）
             );

    -- 提交事务
    COMMIT;

    -- 返回结果
    SELECT
        IF(v_error_code = 0, '插入成功', '插入失败') AS result;
END$$
DELIMITER ;