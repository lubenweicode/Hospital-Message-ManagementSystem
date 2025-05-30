package com.Service;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
import org.springframework.stereotype.Service;

@Service
public interface medicalRecordsService {

    public Result getMedicalRecords(MedicalRecordDTO medicalRecordDTO);

    public Result addMedicalRecords(MedicalRecordDTO medicalRecordDTO);

    public Result deleteMedicalRecords(String medicalRecordId);

    public Result updateMedicalRecords(String medicalRecordId,MedicalRecordDTO medicalRecordDTO);

    /**
     * 根据Id查询药品
     * @param medicalRecordId
     * @return
     */
    Result getMedicalRecordById(String medicalRecordId);
}
