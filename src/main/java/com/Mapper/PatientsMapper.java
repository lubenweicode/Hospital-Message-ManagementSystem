package com.Mapper;

import com.Entity.DTO.PatientDTO;
import com.Entity.Pojo.Patient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PatientsMapper {


    @Select("select * from patients")
    public List<Patient> getPatients(PatientDTO patientDTO);

    public void addPatient(PatientDTO patientDTO);

    public Integer updatePatient(String patientId, PatientDTO patientDTO);

    public Integer deletePatient(String patientId);

    @Select("select * from patients where patient_id=#{patientId}")
    Patient getPatientById(String patientId);
}
