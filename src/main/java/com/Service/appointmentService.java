package com.Service;

import com.Common.Result;
import com.Entity.DTO.AppointmentDTO;
import org.springframework.stereotype.Service;

@Service
public interface appointmentService {

    /**
     * 查询预约
     * @param appointmentDTO
     * @return
     */
    Result getAppointments(AppointmentDTO appointmentDTO);

    /**
     * 插入预约
     * @param appointmentDTO
     * @return
     */
    Result insertAppointment(AppointmentDTO appointmentDTO);

    /**
     * 根据ID更新预约
     * @param appointmentDTO
     * @param appointmentId
     * @return
     */
    Result updateAppointment(String appointmentId, AppointmentDTO appointmentDTO);

    /**
     * 根据ID删除预约
     * @param appointmentId
     * @return
     */
    Result deleteAppointment(String appointmentId);

    /**
     * 根据Id查询预约
     * @param appointmentId
     * @return
     */
    Result getAppointmentById(String appointmentId);

    Result count();
}
