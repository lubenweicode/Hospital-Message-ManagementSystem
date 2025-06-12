# 查询医生的排班信息
DELIMITER $$
CREATE PROCEDURE getSchedules(
    IN p_doctorName VARCHAR(255),
    IN p_startDate DATE,
    IN p_endDate DATE,
    IN p_scheduleStatus VARCHAR(50)
)
BEGIN
    SELECT *
    FROM schedules
    WHERE (p_doctorName IS NULL OR doctor_name = p_doctorName)
      AND (p_startDate IS NULL OR schedule_date >= p_startDate)
      AND (p_endDate IS NULL OR schedule_date <= p_endDate)
      AND (p_scheduleStatus IS NULL OR schedule_status = p_scheduleStatus);
END$$

DELIMITER $$

CREATE PROCEDURE addSchedule(
    IN p_doctorId INT,
    IN p_startDate DATE,
    IN p_scheduleTime TIME,
    IN p_maxPatients INT,
    IN p_scheduleStatus VARCHAR(10)
)
BEGIN
    -- 插入排班记录
    INSERT INTO schedules (doctor_id,schedule_date,schedule_time,max_patients,schedule_status,create_time,current_patients)
    VALUES (
               p_doctorId,
               p_startDate,
               p_scheduleTime,
               p_maxPatients,
               p_scheduleStatus,
               NOW(),
                0
           );
END$$
DELIMITER ;
# 删除排班
delimiter //
create procedure deleteSchedules(in p_s_id varchar(50))
begin
    delete from schedules where schedule_id=p_s_id;
    update appointments set appointment_status=3 where schedule_id=p_s_id;
end //
delimiter ;
# 更新排班
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
        schedule_date = p_startDate,
        schedule_time = p_scheduleTime,
        max_patients = p_maxPatients,
        schedule_status = p_scheduleStatus
    WHERE
        schedule_id = p_scheduleId; -- 条件：根据排班ID更新（需替换为实际主键字段）
END$$
DELIMITER ;