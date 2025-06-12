# # 查询在院患者
# delimiter //
# create procedure countPatient()
# begin
#     select count(patient_id) from patients where patient_case!='已出院';
# end //
#
# # 查询在班医生
# delimiter //
# create procedure countDoctor()
# begin
#     select count(doctor_id) from doctors where doctor_status=1;
# end //
#
# # 查询今天的所有预约
# DELIMITER //
# CREATE PROCEDURE countAppointment()
# BEGIN
#     -- 使用DATE()函数提取日期部分进行比较
#     SELECT COUNT(appointment_id)
#     FROM appointments
#     WHERE appointment_status = 3
#       AND DATE(appointment_time) = CURDATE();
# END //
#
# # 查询告急药品数量
# DELIMITER //
# CREATE PROCEDURE countMedicine()
# BEGIN
#     SELECT count(*) from medicines where medicine_status=3;
# END //

-- 在院患者视图
CREATE VIEW in_hospital_patients AS
SELECT COUNT(patient_id) AS patient_count
FROM patients
WHERE patient_case != '已出院';

-- 在班医生视图
CREATE VIEW on_duty_doctors AS
SELECT COUNT(doctor_id) AS doctor_count
FROM doctors
WHERE doctor_status = 1;

-- 今日预约视图
CREATE VIEW today_appointments AS
SELECT COUNT(appointment_id) AS appointment_count
FROM appointments
WHERE appointment_status = 3
  AND DATE(appointment_time) = CURDATE();

-- 告急药品视图
CREATE VIEW emergency_medicines AS
SELECT COUNT(*) AS medicine_count
FROM medicines
WHERE medicine_status = 3;