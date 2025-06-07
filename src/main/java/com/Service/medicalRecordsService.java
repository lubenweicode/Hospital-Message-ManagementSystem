package com.Service;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
import org.springframework.stereotype.Service;

@Service
public interface medicalRecordsService {

    Result getMedicalRecords(MedicalRecordDTO medicalRecordDTO);

    Result addMedicalRecords(MedicalRecordDTO medicalRecordDTO);

    Result deleteMedicalRecords(String medicalRecordId);

    Result updateMedicalRecords(String medicalRecordId, MedicalRecordDTO medicalRecordDTO);

    /**
     * 根据Id查询药品
     * @param medicalRecordId
     * @return
     */
    Result getMedicalRecordById(String medicalRecordId);
}
