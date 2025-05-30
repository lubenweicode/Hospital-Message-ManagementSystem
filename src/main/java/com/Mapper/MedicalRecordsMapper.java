package com.Mapper;

import com.Entity.DTO.MedicalRecordDTO;
import com.Entity.Pojo.MedicalRecord;
import com.Entity.Pojo.Medicine;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MedicalRecordsMapper {

    public List<MedicalRecord> getMedicalRecord(MedicalRecordDTO medicineRecordDTO);

    public Integer addMedicalRecord(MedicalRecordDTO medicineRecordDTO);

    public Integer updateMedicalRecord(String medicineRecordId,MedicalRecordDTO medicineRecordDTO);

    public Integer deleteMedicalRecord(String medicineRecordId);

    @Select("SELECT * FROM medical_records where record_id=#{medicalRecordId}")
    MedicalRecord getMedicalRecordById(String medicalRecordId);
}
