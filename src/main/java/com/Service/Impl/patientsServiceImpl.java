package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.PatientDTO;
import com.Entity.Pojo.Patient;
import com.Mapper.PatientsMapper;
import com.Service.patientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.Common.MSG_OPERATION_SUCCESS;
import static com.Common.ComPatientDoctor.*;

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
            result.setCode(1);
            result.setMsg(MSG_INSERT_PATIENTS_SUCCESS);
            result.setData(null);
        }else{
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
            result.setCode(0);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(patientsList);
        }else{
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(patientsList);
        }
        return result;
    }

    @Override
    public Result updatePatient(String patientId, PatientDTO patientDTO) {
        Result result = new Result();
        Integer flag = patientsMapper.updatePatient(patientId,patientDTO);
        if(flag == 0){
            result.setCode(0);
            result.setMsg(MSG_UPDATE_PATIENTS_SUCCESS);
            result.setData(null);
        }else{
            result.setCode(1);
            result.setMsg(MSG_UPDATE_PATIENTS_FAILED);
            result.setData(null);
        }
        return result;
    }

    @Override
    public Result deletePatient(String patientId) {
       Result result = new Result();
       Integer flag = patientsMapper.deletePatient(patientId);
       if(flag >=1 ){
           result.setCode(1);
           result.setMsg(MSG_DELETE_PATIENTS_SUCCESS);
           result.setData(null);
       }else{
           result.setCode(0);
           result.setMsg(MSG_DELETE_PATIENTS_FAILED);
           result.setData(null);
       }
       return result;
    }
}
