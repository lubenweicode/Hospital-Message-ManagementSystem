package com.Mapper;

import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DoctorsMapper {

    public List<Doctor> getDoctors(DoctorDTO doctorDTO);

    public Integer addDoctor(Doctor doctor);

    public Integer updateDoctor(String doctorId,DoctorDTO doctorDTO);

    public Integer deleteDoctor(String doctorId);
}
