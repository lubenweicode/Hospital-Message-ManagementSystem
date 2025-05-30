package com.Mapper;

import com.Entity.Pojo.Appointment;
import com.Entity.DTO.AppointmentDTO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AppointmentsMapper {

    /**
     * 查询预约
     * @param appointmentDTO
     * @return
     */
    @Select("")
    public List<Appointment> select(AppointmentDTO appointmentDTO);

    /**
     * 添加预约
     * @param appointmentDTO
     * @return
     */
    @Insert("")
    public int insert(AppointmentDTO appointmentDTO);


    /**
     * 更新预约
     * @param appointmentId
     * @param appointmentDTO
     * @return
     */
    @Update("")
    public int update(String appointmentId,AppointmentDTO appointmentDTO);

    /**
     * 删除预约
     * @param appointmentId
     * @return
     */
    @Delete("")
    public int delete(String appointmentId);
}
