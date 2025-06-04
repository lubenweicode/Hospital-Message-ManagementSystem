package com.Controller;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
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

    /**
     * 查询病历(允许条件查询)
     * @param medicalRecordDTO
     * @return
     */
    @PostMapping("/search")
    public Result getMedicalRecords(@RequestBody(required = false) MedicalRecordDTO medicalRecordDTO) {
        log.info("查询病历,查询条件为:{}", medicalRecordDTO);
        return medicalRecordsServiceImpl.getMedicalRecords(medicalRecordDTO);
    }

    /**
     * 添加病历
     * @param medicalRecordDTO
     * @return
     */
    @PostMapping
    public Result addMedicalRecord(@RequestBody MedicalRecordDTO medicalRecordDTO) {
        log.info("添加病历:{}", medicalRecordDTO);
        return medicalRecordsServiceImpl.addMedicalRecords(medicalRecordDTO);
    }

    /**
     * 根据Id删除病历
     * @param medicalRecordId
     * @return
     */
    @DeleteMapping("/{medicalRecordId}")
    public Result deleteMedicalRecord(@PathVariable String medicalRecordId) {
        log.info("根据Id:{},删除病历", medicalRecordId);
        return medicalRecordsServiceImpl.deleteMedicalRecords(medicalRecordId);
    }

    /**
     * 根据Id更新病历
     * @param medicalRecordId
     * @param medicalRecordDTO
     * @return
     */
    @PutMapping("/{medicalRecordId}")
    public Result updateMedicalRecord(@PathVariable String medicalRecordId,@RequestBody MedicalRecordDTO medicalRecordDTO) {
        log.info("根据Id:{},更改病历:{}", medicalRecordId, medicalRecordDTO);
        return medicalRecordsServiceImpl.updateMedicalRecords(medicalRecordId,medicalRecordDTO);
    }

    /**
     * 根据Id查询药品
     * @param medicalRecordId
     * @return
     */
    @GetMapping("/{medicalRecordId}")
    public Result getMedicalRecordById(@PathVariable String medicalRecordId) {
        log.info("根据Id：:{} 查询病历", medicalRecordId);
        return medicalRecordsServiceImpl.getMedicalRecordById(medicalRecordId);
    }
}
