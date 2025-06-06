package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.PatientDTO;
import com.Entity.Pojo.Patient;
import com.Mapper.PatientsMapper;
import com.Service.patientsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.Common.MSG_OPERATION_FAILED;
import static com.Common.Common.MSG_OPERATION_SUCCESS;
import static com.Common.ComPatientDoctor.*;

@Slf4j
@Service
public class patientsServiceImpl implements patientsService {

    @Autowired
    private PatientsMapper patientsMapper;

    /**
     * 添加患者
     * @param patientDTO
     * @return
     */
    @Override
    public Result addPatient(PatientDTO patientDTO) {
        Result result = new Result();
        patientsMapper.addPatient(patientDTO);
        String patientId = patientDTO.getPatientId();
        if(patientId != null ){
            log.info(MSG_INSERT_PATIENTS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_PATIENTS_SUCCESS);
            result.setData(null);
        }else{
            log.info(MSG_INSERT_PATIENTS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_PATIENTS_FAILED);
            result.setData(null);
        }
        return result;
    }

    @Override
    public Result getPatients(PatientDTO patientDTO) {
        Result result = new Result();
        List<Patient> patientsList = patientsMapper.getPatients(patientDTO);
        if(patientsList == null || patientsList.isEmpty()){
            log.info(MSG_SELECT_PATIENTS_SUCCESS);
            result.setCode(0);
            result.setMsg(MSG_SELECT_PATIENTS_SUCCESS);
            result.setData(patientsList);
        }else{
            log.info(MSG_SELECT_PATIENTS_FAILED);
            result.setCode(1);
            result.setMsg(MSG_SELECT_PATIENTS_FAILED);
            result.setData(patientsList);
        }
        return result;
    }

    /**
     * 更新患者
     * @param patientId
     * @param patientDTO
     * @return
     */
    @Override
    public Result updatePatient(String patientId, PatientDTO patientDTO) {
        Result result = new Result();
        patientDTO.setPatientId(patientId);
        Integer flag = patientsMapper.updatePatient(patientDTO);
        if(flag == null || flag == 0){
            log.info(MSG_UPDATE_PATIENTS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_PATIENTS_FAILED);
            result.setData(null);
        }else{
            log.info(MSG_UPDATE_PATIENTS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_PATIENTS_SUCCESS);
            result.setData(null);
        }
        return result;
    }

    @Override
    public Result deletePatient(String patientId) {
       Result result = new Result();
       Integer flag = patientsMapper.deletePatient(patientId);
       if(flag >=1 ){
           log.info(MSG_DELETE_PATIENTS_SUCCESS);
           result.setCode(1);
           result.setMsg(MSG_DELETE_PATIENTS_SUCCESS);
           result.setData(null);
       }else{
           log.info(MSG_DELETE_PATIENTS_FAILED);
           result.setCode(0);
           result.setMsg(MSG_DELETE_PATIENTS_FAILED);
           result.setData(null);
       }
       return result;
    }

    /**
     * 根据Id查询患者
     * @param patientId
     * @return
     */
    @Override
    public Result getPatientsById(String patientId) {
        Result result = new Result();
        Patient patient = patientsMapper.getPatientById(patientId);
        if(patientId == null){
            log.info(MSG_SELECT_PATIENTS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_PATIENTS_FAILED);
            result.setData(patient);
        }else{
            log.info(MSG_SELECT_PATIENTS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_PATIENTS_SUCCESS);
            result.setData(patient);
        }
        return result;
    }
}
