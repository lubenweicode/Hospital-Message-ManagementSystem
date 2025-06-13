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

-- 患者表主键索引
ALTER TABLE patients
    ADD PRIMARY KEY (patient_id);


-- 添加索引优化查询
CREATE INDEX idx_patient_name ON patients(patient_name);
CREATE INDEX idx_patient_id_card ON patients(patient_id_card);

DELIMITER $$


CREATE PROCEDURE AddPatient(
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
    DECLARE v_patient_id VARCHAR(50);
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
DELIMITER $$
CREATE PROCEDURE updatePatient(
    IN p_id INT,
    IN p_patientName VARCHAR(50),
    IN p_patientGender TINYINT,
    IN p_patientAge INT,
    IN p_patientBirth DATE,
    IN p_patientAddress VARCHAR(255),
    IN p_patientPhone VARCHAR(20),
    IN p_patientIdCard VARCHAR(20),
    IN p_patientCase TEXT,
    IN p_patientAllergy VARCHAR(255),
    IN p_patientHistory TEXT,
    IN p_patientCasedetail TEXT
)
BEGIN
    UPDATE patients
    SET
        patient_name = IF(p_patientName IS NOT NULL AND p_patientName != '', p_patientName, patient_name),
        patient_gender = IF(p_patientGender IS NOT NULL, p_patientGender, patient_gender),
        patient_age = IF(p_patientAge IS NOT NULL, p_patientAge, patient_age),
        patient_birth = IF(p_patientBirth IS NOT NULL, p_patientBirth, patient_birth),
        patient_address = IF(p_patientAddress IS NOT NULL AND p_patientAddress != '', p_patientAddress, patient_address),
        patient_phone = IF(p_patientPhone IS NOT NULL AND p_patientPhone != '', p_patientPhone, patient_phone),
        patient_idCard = IF(p_patientIdCard IS NOT NULL AND p_patientIdCard != '', p_patientIdCard, patient_idCard),
        patient_Case = IF(p_patientCase IS NOT NULL AND p_patientCase != '', p_patientCase, patient_Case),
        patient_allergy = IF(p_patientAllergy IS NOT NULL AND p_patientAllergy != '', p_patientAllergy, patient_allergy),
        patient_history = IF(p_patientHistory IS NOT NULL, p_patientHistory, patient_history),
        patient_casedetail = IF(p_patientCasedetail IS NOT NULL, p_patientCasedetail, patient_casedetail)
    WHERE patient_id = p_id;
END$$
DELIMITER ;

-- 删除患者存储过程（逻辑删除）
DELIMITER $$
CREATE PROCEDURE DeletePatient(IN p_patient_id VARCHAR(50))
BEGIN
delete from patients where patient_id = p_patient_id;
END$$

-- 查询患者存储过程
CREATE PROCEDURE GetPatient(
    IN p_patient_name VARCHAR(50),
    IN p_patient_phone VARCHAR(50),
    IN p_patient_case VARCHAR(50)
)
BEGIN
    SELECT *
    FROM patients
    WHERE
        (p_patient_name IS NULL OR patient_name LIKE CONCAT('%', p_patient_name, '%'))
      AND (p_patient_phone IS NULL OR patient_phone LIKE CONCAT('%', p_patient_phone, '%'))
      AND (p_patient_case IS NULL OR patient_case LIKE CONCAT('%', p_patient_case, '%'));
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
CREATE PROCEDURE GetPatientByIdCard(IN p_patient_idCard VARCHAR(20))
BEGIN
SELECT *
FROM patients
WHERE
    patient_id_card = p_patient_idCard
  AND patient_status = 1;
END$$

DELIMITER ;