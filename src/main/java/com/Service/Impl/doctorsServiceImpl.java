package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import com.Entity.VO.DoctorVO;
import com.Mapper.DoctorsMapper;
import com.Service.doctorsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComPatientDoctor.*;
import static com.Common.Common.MSG_OPERATION_FAILED;
import static com.Common.Common.MSG_OPERATION_SUCCESS;

@Slf4j
@Service
public class doctorsServiceImpl implements doctorsService {

    @Autowired
    private DoctorsMapper doctorsMapper;

    @Override
    public Result addDoctor(Doctor doctor) {
        Result result = new Result();
        Integer flag = doctorsMapper.addDoctor(doctor);
        if(flag == 1) {
            log.info(MSG_INSERT_DOCTORS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_DOCTORS_SUCCESS );
            result.setData(doctor);
        }else{
            log.info(MSG_INSERT_DOCTORS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_DOCTORS_FAILED );
            result.setData(doctor);
        }
        return result;
    }

    @Override
    public Result getDoctors(DoctorDTO doctorDTO) {
        Result result = new Result();
        List<DoctorVO> doctorsList = doctorsMapper.getDoctors(doctorDTO);
        if(doctorsList != null||doctorsList.size()>0) {
            log.info(MSG_SELECT_DOCTOR_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_DOCTOR_SUCCESS);
            result.setData(doctorsList);
        }else{
            log.info(MSG_SELECT_DOCTOR_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_DOCTOR_FAILED );
            result.setData(doctorsList);
        }
        return result;
    }

    @Override
    public Result deleteDoctor(String doctorId) {
        Result result = new Result();
        Integer flag = doctorsMapper.deleteDoctor(doctorId);
        if(flag == 1) {
            log.info(MSG_DELETE_DOCTORS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_DOCTORS_SUCCESS);
            result.setData(doctorId);
        }else{
            log.info(MSG_DELETE_DOCTORS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_DOCTORS_FAILED );
            result.setData(doctorId);
        }
        return result;
    }

    @Override
    public Result updateDoctor(String doctorId, DoctorDTO doctorDTO) {
        Result result = new Result();
        Integer flag = doctorsMapper.updateDoctor(doctorDTO);
        if(flag == 1) {
            log.info(MSG_UPDATE_DOCTORS_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_DOCTORS_SUCCESS);
            result.setData(doctorId);
        }else{
            log.info(MSG_UPDATE_DOCTORS_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_PATIENTS_FAILED);
            result.setData(doctorId);
        }
        return result;
    }

    /**
     * 根据Id查询医生
     * @param doctorId
     * @return
     */
    @Override
    public Result getDoctorById(String doctorId) {
        Result result = new Result();
        DoctorVO doctor = doctorsMapper.getDoctorById(doctorId);
        if(doctor != null) {
            log.info(MSG_SELECT_DOCTOR_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_DOCTOR_SUCCESS);
            result.setData(doctor);
        }else{
            log.info(MSG_SELECT_DOCTOR_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_DOCTOR_FAILED );
            result.setData(doctor);
        }
        return result;
    }
}
