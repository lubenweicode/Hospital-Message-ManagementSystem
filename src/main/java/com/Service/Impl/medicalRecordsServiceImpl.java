package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
import com.Entity.Pojo.MedicalRecord;
import com.Entity.VO.MedicalRecordVO;
import com.Mapper.MedicalRecordsMapper;
import com.Service.medicalRecordsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComMedicalRecords.*;

@Service
public class medicalRecordsServiceImpl implements medicalRecordsService {

    @Autowired
    private MedicalRecordsMapper medicalRecordsMapper;

    @Override
    public Result getMedicalRecords(MedicalRecordDTO medicalRecordDTO) {
        Result result = new Result();
        List<MedicalRecord> medicalRecordList = medicalRecordsMapper.getMedicalRecords( medicalRecordDTO);
        if(medicalRecordList != null){
            result.setCode(1);
            result.setMsg(MSG_SELECT_MEDICALRECORD_SUCCESS);
            result.setData(medicalRecordList);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_MEDICALRECORD_FAILED);
            result.setData(medicalRecordList);
        }
        return result;
    }

    @Override
    public Result addMedicalRecords(MedicalRecordDTO medicalRecordDTO) {
        Result result = new Result();
        Integer flag = medicalRecordsMapper.addMedicalRecord(medicalRecordDTO);
        if(flag != null){
            result.setCode(1);
            result.setMsg(MSG_INSERT_MEDICALRECORD_SUCCESS);
            result.setData(medicalRecordDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_MEDICALRECORD_FAILED);
            result.setData(medicalRecordDTO);
        }
        return result;
    }

    @Override
    public Result deleteMedicalRecords(String medicalRecordId) {
        Result result = new Result();
        Integer flag = medicalRecordsMapper.deleteMedicalRecord(medicalRecordId);
        if(flag != null){
            result.setCode(1);
            result.setMsg(MSG_DELETE_MEDICALRECORD_SUCCESS);
            result.setData(medicalRecordId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_DELETE_MEDICALRECORD_FAILED);
            result.setData(medicalRecordId);
        }
        return result;
    }

    @Override
    public Result updateMedicalRecords(String medicalRecordId,MedicalRecordDTO medicalRecordDTO) {
        Result result = new Result();
        Integer flag = medicalRecordsMapper.updateMedicalRecord(medicalRecordDTO);
        if(flag != null){
            result.setCode(1);
            result.setMsg(MSG_UPDATE_MEDICALRECORD_SUCCESS);
            result.setData(medicalRecordDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_UPDATE_MEDICALRECORD_FAILED);
            result.setData(medicalRecordDTO);
        }
        return result;
    }

    /**
     * 根据Id查询药品
     * @param medicalRecordId
     * @return
     */
    @Override
    public Result getMedicalRecordById(String medicalRecordId) {
        Result result = new Result();
        MedicalRecordVO medicalRecord = medicalRecordsMapper.getMedicalRecordById(medicalRecordId);
        if(medicalRecord != null){
            result.setCode(1);
            result.setMsg(MSG_SELECT_MEDICALRECORD_SUCCESS);
            result.setData(medicalRecord);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_MEDICALRECORD_FAILED);
            result.setData(medicalRecord);
        }
        return result;
    }
}
