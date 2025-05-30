package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import com.Mapper.DoctorsMapper;
import com.Service.doctorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.Common.MSG_OPERATION_FAILED;
import static com.Common.Common.MSG_OPERATION_SUCCESS;
import static com.Common.ComPatientDoctor.MSG_INSERT_DOCTORS_FAILED;
import static com.Common.ComPatientDoctor.MSG_INSERT_DOCTORS_SUCCESS;

@Service
public class doctorsServiceImpl implements doctorsService {

    @Autowired
    private DoctorsMapper doctorsMapper;

    @Override
    public Result addDoctor(Doctor doctor) {
        Result result = new Result();
        Integer flag = doctorsMapper.addDoctor(doctor);
        if(flag == 1) {
            result.setCode(1);
            result.setMsg(MSG_INSERT_DOCTORS_SUCCESS );
            result.setData(doctor);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_DOCTORS_FAILED );
            result.setData(doctor);
        }
        return result;
    }

    @Override
    public Result getDoctors(DoctorDTO doctorDTO) {
        Result result = new Result();
        List<Doctor> doctorsList = doctorsMapper.getDoctors(doctorDTO);
        if(doctorsList != null||doctorsList.size()>0) {
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(doctorDTO);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
            result.setData(doctorDTO);
        }
        return result;
    }

    @Override
    public Result deleteDoctor(String doctorId) {
        Result result = new Result();
        Integer flag = doctorsMapper.deleteDoctor(doctorId);
        if(flag == 1) {
            result.setCode(1);
            result.setMsg(MSG_INSERT_DOCTORS_SUCCESS);
            result.setData(doctorId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_DOCTORS_FAILED );
            result.setData(doctorId);
        }
        return result;
    }

    @Override
    public Result updateDoctor(String doctorId, DoctorDTO doctorDTO) {
        Result result = new Result();
        Integer flag = doctorsMapper.updateDoctor(doctorId,doctorDTO);
        if(flag == 1) {
            result.setCode(1);
            result.setMsg(MSG_INSERT_DOCTORS_SUCCESS );
            result.setData(doctorId);
        }else{
            result.setCode(0);
            result.setMsg(MSG_INSERT_DOCTORS_FAILED );
            result.setData(doctorId);
        }
        return result;
    }
}
