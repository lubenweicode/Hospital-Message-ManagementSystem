package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.MedicalRecordDTO;
import com.Entity.Pojo.Doctor;
import com.Entity.Pojo.MedicalRecord;
import com.Entity.Pojo.Patient;
import com.Entity.VO.DoctorVO;
import com.Entity.VO.MedicalRecordVO;
import com.Mapper.DoctorsMapper;
import com.Mapper.MedicalRecordsMapper;
import com.Mapper.PatientsMapper;
import com.Service.medicalRecordsService;
import com.Service.medicinesService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComMedicalRecords.*;

@Service
public class medicalRecordsServiceImpl implements medicalRecordsService {

    @Autowired
    private MedicalRecordsMapper medicalRecordsMapper;
    @Autowired
    private PatientsMapper patientsMapper;
    @Autowired
    private DoctorsMapper doctorsMapper;

    @Override
    public Result getMedicalRecords(MedicalRecordDTO medicalRecordDTO) {
        Result result = new Result();

        List<MedicalRecord> medicalRecordList = medicalRecordsMapper.getMedicalRecords(medicalRecordDTO);
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
        Patient patient = patientsMapper.getPatientById(medicalRecordDTO.getPatientId());
        DoctorVO doctor = doctorsMapper.getDoctorById(medicalRecordDTO.getDoctorId());
        medicalRecordDTO.setDoctorName(doctor.getDoctorName());
        medicalRecordDTO.setPatientName(patient.getPatientName());
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
        DoctorVO doctorVO = doctorsMapper.getDoctorById(medicalRecordDTO.getDoctorId());
        Patient patient = patientsMapper.getPatientById(medicalRecordDTO.getPatientId());
        medicalRecordDTO.setPatientName(patient.getPatientName());
        medicalRecordDTO.setDoctorName(doctorVO.getDoctorName());
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
            Patient patient = patientsMapper.getPatientById(medicalRecord.getPatientId());
            DoctorVO doctor = doctorsMapper.getDoctorById(medicalRecord.getDoctorId());
            medicalRecord.setPatientName(patient.getPatientName());
            medicalRecord.setDeptName(doctor.getDoctorName());
            result.setData(medicalRecord);
        }else{
            result.setCode(0);
            result.setMsg(MSG_SELECT_MEDICALRECORD_FAILED);
            result.setData(medicalRecord);
        }
        return result;
    }
}
