package com.Mapper;

import com.Entity.DTO.DoctorDTO;
import com.Entity.Pojo.Doctor;
import com.Entity.VO.DoctorVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DoctorsMapper {

    public List<DoctorVO> getDoctors(DoctorDTO doctorDTO);

    public Integer addDoctor(Doctor doctor);

    public Integer updateDoctor(DoctorDTO doctorDTO);

    public Integer deleteDoctor(String doctorId);

    /**
     * 根据Id查询医生
     * @param doctorId
     * @return
     */
    @Select("SELECT * FROM doctors where doctor_id=#{doctorId}")
    DoctorVO getDoctorById(String doctorId);
}
