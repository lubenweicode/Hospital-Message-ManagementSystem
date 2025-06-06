package com.Mapper;

import com.Entity.Pojo.Appointment;
import com.Entity.DTO.AppointmentDTO;
import com.Entity.Pojo.ProcedureResult;
import com.Entity.VO.AppointmentVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AppointmentsMapper {

    /**
     * 查询预约
     * @param appointmentDTO
     * @return
     */
    public List<AppointmentVO> select(AppointmentDTO appointmentDTO);

    /**
     * 添加预约
     * @param appointmentDTO
     * @return
     */
    public int insert(AppointmentDTO appointmentDTO);


    /**
     * 更新预约
     * @param appointmentDTO
     * @return
     */
    public int update(AppointmentDTO appointmentDTO);

    /**
     * 删除预约
     * @param appointmentId
     * @return
     */
//    @Delete("delete from appointments where appointment_id=#{appointmentId}")
    public int delete(String appointmentId);

    /**
     * 根据Id查询预约
     * @param appointmentId
     * @return
     */
    @Select("SELECT * FROM appointments where appointment_id=#{appointmentId}")
    public Appointment getAppointmentById(String appointmentId);
}
