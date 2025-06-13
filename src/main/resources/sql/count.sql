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