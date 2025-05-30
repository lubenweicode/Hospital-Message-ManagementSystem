package com.Controller;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
import com.Entity.Pojo.MedicalRecord;
import com.Service.medicalRecordsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/MedicalRecords")
@Slf4j
public class MedicalRecordsController {

    @Autowired
    private medicalRecordsService medicalRecordsServiceImpl;

    @GetMapping
    public Result getMedicalRecords(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        log.info("查询药品,查询条件为:{}", medicalRecordDTO);
        return medicalRecordsServiceImpl.getMedicalRecords(medicalRecordDTO);
    }

    @PostMapping
    public Result addMedicalRecord(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        log.info("添加药品:{}", medicalRecordDTO);
        return medicalRecordsServiceImpl.addMedicalRecords(medicalRecordDTO);
    }

    @DeleteMapping("/{medicalRecordId}")
    public Result deleteMedicalRecord(@RequestBody String medicalRecordId) {
        log.info("根据Id:{},删除药品", medicalRecordId);
        return medicalRecordsServiceImpl.deleteMedicalRecords(medicalRecordId);
    }

    @PostMapping("/{medicalRecordId}")
    public Result updateMedicalRecord(@RequestBody String medicalRecordId,@RequestBody MedicalRecordDTO medicalRecordDTO) {
        log.info("根据Id:{},更改药品:{}", medicalRecordId, medicalRecordDTO);
        return medicalRecordsServiceImpl.updateMedicalRecords(medicalRecordId,medicalRecordDTO);
    }
}
