package com.Service;

import com.Common.Result;
import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import org.springframework.stereotype.Service;

@Service
public interface doctorsService {

    public Result getDoctors(DoctorDTO doctorDTO);

    public Result addDoctor(Doctor doctor);

    public Result deleteDoctor(String dotorId);

    public Result updateDoctor(String dotorId, DoctorDTO doctorDTO);

    Result getDoctorById(String doctorId);
}
