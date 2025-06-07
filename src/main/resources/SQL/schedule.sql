DELIMITER $$

CREATE PROCEDURE getSchedules(
    IN p_doctorName VARCHAR(255),
    IN p_startDate DATE,
    IN p_endDate DATE,
    IN p_scheduleStatus VARCHAR(50)
)
BEGIN
    -- 构建动态SQL查询语句
    SET @query = 'SELECT * FROM schedules WHERE 1=1';

    -- 针对各个参数，在非NULL时添加对应的筛选条件
    IF p_doctorName IS NOT NULL THEN
        SET @query = CONCAT(@query, ' AND doctor_name = ', QUOTE(p_doctorName));
    END IF;

    IF p_startDate IS NOT NULL THEN
        SET @query = CONCAT(@query, ' AND schedule_date >= ', QUOTE(p_startDate));
    END IF;

    IF p_endDate IS NOT NULL THEN
        SET @query = CONCAT(@query, ' AND schedule_date <= ', QUOTE(p_endDate));
    END IF;

    IF p_scheduleStatus IS NOT NULL THEN
        SET @query = CONCAT(@query, ' AND status = ', QUOTE(p_scheduleStatus));
    END IF;

    -- 执行动态构建的SQL查询
    PREPARE stmt FROM @query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER $$

CREATE PROCEDURE addSchedule(
    IN p_doctorId INT,
    IN p_startDate DATE,
    IN p_scheduleTime TIME,
    IN p_maxPatients INT,
    IN p_scheduleStatus VARCHAR(10),
    OUT p_scheduleId INT
)
BEGIN
    -- 插入排班记录
    INSERT INTO schedules (
        doctor_id,
        schedule_date,
        schedule_time,
        max_patients,
        schedule_status,
        create_time,
        current_patients
    )
    VALUES (
               p_doctorId,
               p_startDate,
               p_scheduleTime,
               p_maxPatients,
               p_scheduleStatus,
               NOW(),
                0
           );

    -- 返回新插入记录的ID
END$$

DELIMITER ;

DELIMITER ;

delimiter //
create procedure deleteSchedules(in p_s_id varchar(50))
begin
    delete from schedules where schedule_id=p_s_id;
    update appointments set appointment_status=3 where schedule_id=p_s_id;
end //
delimiter ;

DELIMITER $$
CREATE PROCEDURE updateSchedule(
    IN p_scheduleId varchar(50),
    IN p_doctorId varchar(50),        -- 医生ID
    IN p_startDate DATE,     -- 排班日期
    IN p_scheduleTime INT,   -- 时间段（1=上午，2=下午，3=晚上）
    IN p_maxPatients INT,    -- 最大患者数
    IN p_scheduleStatus INT  -- 状态（1=正常，0=取消）
)
BEGIN
    -- 假设排班表主键为 scheduleId，需根据实际表结构调整
    UPDATE schedules
    SET
        doctor_id = p_doctorId,
        schedules.schedule_date = p_startDate,
        schedule_time = p_scheduleTime,
        max_patients = p_maxPatients,
        schedule_status = p_scheduleStatus
    WHERE
        schedule_id = p_scheduleId; -- 条件：根据排班ID更新（需替换为实际主键字段）
END$$
DELIMITER ;