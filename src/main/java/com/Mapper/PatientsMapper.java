package com.Mapper;

import com.Entity.DTO.PatientDTO;
import com.Entity.Pojo.Patient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PatientsMapper {


    List<PatientDTO> getPatients(PatientDTO patientDTO);

    void addPatient(PatientDTO patientDTO);

    Integer updatePatient(PatientDTO patientDTO);

    Integer deletePatient(String patientId);

    @Select("select * from patients where patient_id=#{patientId}")
    Patient getPatientById(String patientId);

    @Select("SELECT * FROM in_hospital_patients")
    Integer count();
}
