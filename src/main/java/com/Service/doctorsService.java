package com.Service;

import com.Common.Result;
import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import org.springframework.stereotype.Service;

@Service
public interface doctorsService {

    Result getDoctors(DoctorDTO doctorDTO);

    Result addDoctor(Doctor doctor);

    Result deleteDoctor(String dotorId);

    Result updateDoctor(String dotorId, DoctorDTO doctorDTO);

    Result getDoctorById(String doctorId);
}
