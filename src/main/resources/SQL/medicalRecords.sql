# 添加病历
delimiter //
create procedure addMedicalRecords(IN p_patient_id varchar(50),IN p_patient_name varchar(50),in p_doctor_id varchar(50),IN p_doctor_name varchar(50),in p_record_date datetime,in p_symptoms varchar(255),
in p_diagnosis varchar(255),in p_medications varchar(255),in p_treatment_plan varchar(255),in p_record_status tinyint)
begin
    if(p_medications='')then
        set p_medications=null;
    end if;
    insert into medical_records (patient_id,patient_name, doctor_id,doctor_name, record_date, symptoms, diagnosis, treatment_plan, medications,record_status) values
    (p_patient_id,p_patient_name,p_doctor_id,p_doctor_name,p_record_date,p_symptoms,p_diagnosis,p_treatment_plan,p_treatment_plan
    ,p_record_status);
end //

# 更新病历
DELIMITER //

CREATE PROCEDURE updateMedicalRecords(IN p_patient_id VARCHAR(50),IN p_patient_name VARCHAR(50),IN p_doctor_id VARCHAR(50),IN p_doctor_name VARCHAR(50),IN p_record_date DATETIME,
IN p_symptoms VARCHAR(255),IN p_diagnosis VARCHAR(255),IN p_medications VARCHAR(255),IN p_treatment_plan VARCHAR(255),IN p_record_status TINYINT
)
BEGIN
    -- 如果药物字段为空字符串，则设置为NULL
    IF (p_medications = '') THEN
        SET p_medications = NULL;
    END IF;

    -- 使用正确的UPDATE语法
    UPDATE medical_records
    SET
        patient_id = p_patient_id,patient_name = p_patient_name,doctor_id = p_doctor_id,doctor_name = p_doctor_name,record_date = p_record_date,
        symptoms = p_symptoms,diagnosis = p_diagnosis,treatment_plan = p_treatment_plan,medications = p_medications,record_status = p_record_status
    WHERE patient_id = p_patient_id; -- 假设通过patient_id来唯一标识记录，你可能需要根据实际情况调整WHERE子句
END //

DELIMITER ;

# 删除病历
delimiter //
create procedure deleteMedicalRecord(in p_record_id varchar(50))
begin
    delete from medical_records where record_id=p_record_id;
end //


# 获取病历
delimiter //
create procedure getMedicalRecords(IN p_patient_name varchar(50),IN p_doctor_name varchar(50),in p_record_status tinyint
,in p_start_time datetime,in p_end_time datetime)
begin
    if(p_patient_name='')then
        set p_patient_name=null;
    end if;
    if(p_doctor_name='')then
        set p_doctor_name=null;
    end if;
    if(p_record_status!=1 or p_record_status!=0)then
        set p_record_status=null;
    end if;
    if(p_start_time is null)then
        set p_start_time=null;
    end if;
    if(p_end_time is null)then
        set p_end_time=null;
    end if;

    select * from medical_records where (p_patient_name is null or patient_name=p_patient_name) and
                                        (p_doctor_name is null or doctor_name=p_doctor_name) and
                                        (p_record_status is null or record_status=p_record_status) and
                                        (p_start_time is null or start_time=p_start_time) and
                                        (p_end_time is null or end_time=p_end_time);

end //