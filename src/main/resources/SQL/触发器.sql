
DELIMITER $$
CREATE TRIGGER users
BEFORE INSERT ON users
FOR EACH ROW
    BEGIN
        SET NEW.user_id = UUID();
    end $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER schedules
BEFORE INSERT ON schedules
FOR EACH ROW
BEGIN
    SET NEW.schedule_id = UUID();
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER appointments
BEFORE INSERT ON appointments
FOR EACH ROW
    BEGIN
        SET NEW.appointment_id = UUID();
    end $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER departments
BEFORE INSERT ON departments
FOR EACH ROW
    BEGIN
        SET NEW.dept_id = UUID();
    end $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER doctors
BEFORE INSERT ON doctors
FOR EACH ROW
    BEGIN
        SET NEW.doctor_id = UUID();
    end $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER medicines
BEFORE INSERT ON medicines
FOR EACH ROW
    BEGIN
        SET NEW.medicine_id = UUID();
    end $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER patients
BEFORE INSERT ON patients
FOR EACH ROW
    BEGIN
        SET NEW.patient_id = UUID();
    end $$
DELIMITER ;

DELIMITER  $$
CREATE TRIGGER medical_records
BEFORE INSERT ON medical_records
FOR EACH ROW
    BEGIN
        SET NEW.record_id = UUID();
    end $$
DELIMITER ;