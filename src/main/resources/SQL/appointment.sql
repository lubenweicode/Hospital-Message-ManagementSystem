# 添加预约
delimiter //
create procedure addAppointment(in p_patient_id varchar(50),in p_doctor_id varchar(50),in p_appointment_status tinyint,in p_appointment_symptoms varchar(255))
begin
    declare t_schedule_id varchar(50);
    select schedule_id into t_schedule_id from schedules where  doctor_id=p_doctor_id;
    insert into appointments (patient_id, doctor_id, schedule_id, appointment_status, symptoms) values
    (p_patient_id,p_doctor_id,t_schedule_id,p_appointment_status,p_appointment_symptoms);

    update schedules set current_patients=current_patients+1 where t_schedule_id=schedule_id;
end //

delimiter //
create procedure getAppointment(in p_patient_name varchar(50),in p_doctor_name varchar(50),in p_app_status tinyint)
begin
    declare d_id varchar(50);
    declare p_id varchar(50);
    select doctor_id from doctors where doctor_name=p_doctor_name;
    select patient_id from patients where patient_name=p_patient_name;
    select * from appointments where doctor_id=d_id and patient_id=p_id and appointment_status=p_app_status;
end //

# 删除预约
# 如果预约未完成,医生的当前排班预约数-1
DELIMITER $$

CREATE PROCEDURE `delAppointment`(IN p_id VARCHAR(50))
BEGIN
    DECLARE t_app_status TINYINT;
    DECLARE t_schedule_id VARCHAR(50);
    DECLARE appointment_exists INT DEFAULT 0;
    start transaction;
    -- 检查预约是否存在并获取状态和排班ID
    SELECT COUNT(*), appointment_status, schedule_id
    INTO appointment_exists, t_app_status, t_schedule_id
    FROM appointments
    WHERE appointment_id = p_id
    LIMIT 1;

    -- 如果预约不存在，抛出错误
    IF appointment_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '预约记录不存在';
    END IF;

    -- 如果状态不是已完成(2)，则减少对应排班的当前患者数
    IF t_app_status != 2 THEN
        UPDATE schedules
        SET current_patients = current_patients - 1
        WHERE schedule_id = t_schedule_id;  -- 关联具体排班ID
    END IF;

    -- 删除预约记录
    DELETE FROM appointments WHERE appointment_id = p_id;

    COMMIT;
END$$

DELIMITER //

# 更新预约
CREATE PROCEDURE `updateAppointment`(
    IN p_appointment_id VARCHAR(50),      -- 添加预约ID作为更新条件
    IN p_patient_id VARCHAR(50),
    IN p_doctor_id VARCHAR(50),
    IN p_appointment_status TINYINT,
    IN p_appointment_symptoms VARCHAR(255)
)
BEGIN
    DECLARE t_original_status TINYINT;
    DECLARE t_schedule_id VARCHAR(50);
    DECLARE t_current_patients INT;
    DECLARE appointment_exists INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            RESIGNAL;
        END;

    START TRANSACTION;

    -- 检查预约是否存在并获取原始状态和排班ID
    SELECT COUNT(*), appointment_status, schedule_id
    INTO appointment_exists, t_original_status, t_schedule_id
    FROM appointments
    WHERE appointment_id = p_appointment_id
    LIMIT 1;

    -- 如果预约不存在，抛出错误
    IF appointment_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = '预约记录不存在';
    END IF;

    -- 如果医生ID有变化，更新排班信息
    IF p_doctor_id IS NOT NULL AND p_doctor_id != '' THEN
        -- 获取新医生的排班ID
        SELECT schedule_id INTO t_schedule_id
        FROM schedules
        WHERE doctor_id = p_doctor_id
        LIMIT 1;

        -- 检查新排班是否存在
        IF t_schedule_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = '指定医生的排班不存在';
        END IF;

        -- 更新预约的排班ID
        UPDATE appointments
        SET schedule_id = t_schedule_id
        WHERE appointment_id = p_appointment_id;
    END IF;

    -- 获取当前排班的患者数
    SELECT current_patients INTO t_current_patients
    FROM schedules
    WHERE schedule_id = t_schedule_id;

    -- 处理状态变化对排班患者数的影响
    -- 从"已完成"状态改为其他状态，增加患者数
    IF t_original_status = 2 AND p_appointment_status != 2 THEN
        UPDATE schedules
        SET current_patients = current_patients + 1
        WHERE schedule_id = t_schedule_id;
    END IF;

    -- 从其他状态改为"已完成"状态，减少患者数
    IF t_original_status != 2 AND p_appointment_status = 2 THEN
        IF t_current_patients > 0 THEN
            UPDATE schedules
            SET current_patients = current_patients - 1
            WHERE schedule_id = t_schedule_id;
        END IF;
    END IF;

    -- 更新预约信息
    UPDATE appointments
    SET
        patient_id = IFNULL(p_patient_id, patient_id),
        doctor_id = IFNULL(p_doctor_id, doctor_id),
        appointment_status = IFNULL(p_appointment_status, appointment_status),
        symptoms = IFNULL(p_appointment_symptoms, symptoms)
    WHERE appointment_id = p_appointment_id;

    COMMIT;
END //

DELIMITER ;