package com.Mapper;

import com.Entity.DTO.MedicalRecordDTO;
import com.Entity.Pojo.MedicalRecord;
import com.Entity.VO.MedicalRecordVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MedicalRecordsMapper {

    List<MedicalRecordDTO> getMedicalRecords(MedicalRecordDTO medicineRecordDTO);

    Integer addMedicalRecord(MedicalRecordDTO medicineRecordDTO);

    Integer updateMedicalRecord(MedicalRecordDTO medicineRecordDTO);

    Integer deleteMedicalRecord(String medicineRecordId);

    @Select("SELECT * FROM medical_records where record_id=#{medicalRecordId}")
    MedicalRecordVO getMedicalRecordById(String medicalRecordId);
}
