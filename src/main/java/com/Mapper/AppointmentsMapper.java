package com.Mapper;

import com.Entity.DTO.AppointmentDTO;
import com.Entity.Pojo.Appointment;
import com.Entity.VO.AppointmentVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface AppointmentsMapper {

    /**
     * 查询预约
     * @param appointmentDTO
     * @return
     */
    List<AppointmentVO> select(AppointmentDTO appointmentDTO);

    /**
     * 添加预约
     * @param appointmentDTO
     * @return
     */
    int insert(AppointmentDTO appointmentDTO);


    /**
     * 更新预约
     * @param appointmentDTO
     * @return
     */
    int update(AppointmentDTO appointmentDTO);

    /**
     * 删除预约
     * @param appointmentId
     * @return
     */
//    @Delete("delete from appointments where appointment_id=#{appointmentId}")
    int delete(String appointmentId);

    /**
     * 根据Id查询预约
     * @param appointmentId
     * @return
     */
    @Select("SELECT * FROM appointments where appointment_id=#{appointmentId}")
    Appointment getAppointmentById(String appointmentId);

    @Select("SELECT * FROM today_appointments")
    Integer count();
}
