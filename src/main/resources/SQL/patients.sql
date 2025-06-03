CREATE TABLE patients (
                          patient_id VARCHAR(50) PRIMARY KEY COMMENT '患者唯一标识',
                          patient_name VARCHAR(50) NOT NULL COMMENT '患者姓名',
                          patient_gender TINYINT COMMENT '性别：1=男，2=女，0=未知',
                          patient_age INT COMMENT '年龄',
                          patient_birth DATE COMMENT '出生日期',
                          patient_address VARCHAR(200) COMMENT '家庭住址',
                          patient_phone VARCHAR(20) COMMENT '联系电话',
                          patient_id_card VARCHAR(20) UNIQUE COMMENT '身份证号',
                          patient_status TINYINT DEFAULT 1 COMMENT '患者状态：1=正常，0=已删除',
                          patient_allergy VARCHAR(200) COMMENT '过敏史',
                          patient_history TEXT COMMENT '既往病史',
                          patient_case VARCHAR(10) COMMENT '病例类型',
                          patient_casedetail VARCHAR(200) COMMENT '病例详情',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                          update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);

-- 创建预约表
CREATE TABLE appointments (
                              appointment_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '预约ID',
                              patient_id VARCHAR(50) NOT NULL COMMENT '关联患者ID',
                              doctor_id INT NOT NULL COMMENT '关联医生ID',
                              appointment_date DATETIME NOT NULL COMMENT '预约日期时间',
                              appointment_status TINYINT DEFAULT 1 COMMENT '预约状态：1=待就诊，2=已就诊，3=已取消',
                              create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 创建病历表（修正外键约束语法）
CREATE TABLE medical_records (
                                 record_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '病历ID',
                                 patient_id VARCHAR(50) NOT NULL COMMENT '关联患者ID',
                                 doctor_id INT NOT NULL COMMENT '负责医生ID',
                                 diagnosis_date DATE NOT NULL COMMENT '诊断日期',
                                 chief_complaint TEXT COMMENT '主诉',
                                 diagnosis TEXT COMMENT '诊断结果',
                                 treatment_plan TEXT COMMENT '治疗方案',
                                 create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                 FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- 创建医生表
CREATE TABLE doctors (
                         doctor_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '医生ID',
                         doctor_name VARCHAR(50) NOT NULL COMMENT '医生姓名',
                         department VARCHAR(50) COMMENT '科室',
                         title VARCHAR(50) COMMENT '职称',
                         contact VARCHAR(20) COMMENT '联系方式',
                         status TINYINT DEFAULT 1 COMMENT '状态：1=在职，0=离职'
);

-- 添加索引优化查询
CREATE INDEX idx_patient_name ON patients(patient_name);
CREATE INDEX idx_patient_id_card ON patients(patient_id_card);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_diagnosis_date ON medical_records(diagnosis_date);
CREATE INDEX idx_doctor_department ON doctors(department);

DELIMITER $$


CREATE PROCEDURE AddPatient(
    IN p_patient_name VARCHAR(50),
    IN p_patient_gender TINYINT,
    IN p_patient_birth DATE,
    IN p_patient_address VARCHAR(200),
    IN p_patient_phone VARCHAR(20),
    IN p_patient_id_card VARCHAR(20),
    IN p_patient_allergy VARCHAR(200),
    IN p_patient_history TEXT,
    OUT p_patientId varchar(50)              -- 输出参数：患者ID（必须为第9个参数）
)
BEGIN
    DECLARE v_patient_id VARCHAR(50);

    -- 获取当前日期
    SET @today = DATE_FORMAT(CURDATE(), '%Y%m%d');


-- 生成新患者ID
SET p_patientId = UUID();

    -- 插入患者数据
INSERT INTO patients (
    patient_id,
    patient_name,
    patient_gender,
    patient_birth,
    patient_address,
    patient_phone,
    patient_id_card,
    patient_allergy,
    patient_history
) VALUES (
             v_patient_id,
             p_patient_name,
             p_patient_gender,
             p_patient_birth,
             p_patient_address,
             p_patient_phone,
             p_patient_id_card,
             p_patient_allergy,
             p_patient_history
         );
END$$

-- 更新患者存储过程
CREATE PROCEDURE UpdatePatient(
    IN p_patient_id VARCHAR(50),
    IN p_patient_name VARCHAR(50),
    IN p_patient_gender TINYINT,
    IN p_patient_birth DATE,
    IN p_patient_address VARCHAR(200),
    IN p_patient_phone VARCHAR(20),
    IN p_patient_id_card VARCHAR(20),
    IN p_patient_allergy VARCHAR(200),
    IN p_patient_history TEXT
)
BEGIN
UPDATE patients
SET
    patient_name = p_patient_name,
    patient_gender = p_patient_gender,
    patient_birth = p_patient_birth,
    patient_address = p_patient_address,
    patient_phone = p_patient_phone,
    patient_id_card = p_patient_id_card,
    patient_allergy = p_patient_allergy,
    patient_history = p_patient_history
WHERE
    patient_id = p_patient_id;
END$$

-- 删除患者存储过程（逻辑删除）
CREATE PROCEDURE DeletePatient(IN p_patient_id VARCHAR(50))
BEGIN
UPDATE patients
SET patient_status = 0
WHERE patient_id = p_patient_id;
END$$

-- 查询患者存储过程
CREATE PROCEDURE GetPatient(IN p_patient_id VARCHAR(50))
BEGIN
SELECT *
FROM patients
WHERE
    patient_id = p_patient_id
  AND patient_status = 1;
END$$

-- 根据姓名模糊查询患者存储过程
CREATE PROCEDURE GetPatientsByName(IN p_patient_name VARCHAR(50))
BEGIN
SELECT *
FROM patients
WHERE
    patient_name LIKE CONCAT('%', p_patient_name, '%')
  AND patient_status = 1;
END$$

-- 根据身份证号查询患者存储过程
CREATE PROCEDURE GetPatientByIdCard(IN p_patient_id_card VARCHAR(20))
BEGIN
SELECT *
FROM patients
WHERE
    patient_id_card = p_patient_id_card
  AND patient_status = 1;
END$$

DELIMITER ;