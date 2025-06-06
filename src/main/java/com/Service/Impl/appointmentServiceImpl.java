package com.Service.Impl;

import com.Common.Result;
import com.Entity.Pojo.ProcedureResult;
import com.Entity.VO.AppointmentVO;
import com.Mapper.AppointmentsMapper;
import com.Entity.Pojo.Appointment;
import com.Entity.DTO.AppointmentDTO;
import com.Service.appointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.Common.ComScheduleAppointment.*;
import static com.Common.ComUserAuth.MSG_OPERATION_FAILED;
import static com.Common.ComUserAuth.MSG_OPERATION_SUCCESS;

@Service
@Slf4j
public class appointmentServiceImpl implements appointmentService {

    @Autowired
    private AppointmentsMapper appointmentMapper;

    /**
     * 条件查询预约
     * @param appointmentDTO
     * @return
     */
    @Override
    public Result getAppointments(AppointmentDTO appointmentDTO) {
        Result result = new Result();
        List<AppointmentVO> appointmentList = appointmentMapper.select(appointmentDTO);
        if(appointmentList != null && appointmentList.size() > 0) {
            log.info(MSG_SELECT_APPOINTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_APPOINTMENT_SUCCESS);
            result.setData(appointmentList);
        }else{
            log.info(MSG_SELECT_APPOINTMENT_FAILED);
            result.setCode(1);
            result.setMsg(MSG_SELECT_APPOINTMENT_FAILED);
            result.setData(appointmentDTO);
        }
        return result;
    }

    /**
     * 添加预约
     * @param appointmentDTO
     * @return
     */
    @Override
    public Result insertAppointment(AppointmentDTO appointmentDTO) {
        Result result = new Result();
        Integer flag = appointmentMapper.insert(appointmentDTO);
        if(flag >= 1){
            log.info(MSG_INSERT_APPOINTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_APPOINTMENT_SUCCESS);
        }else{
            log.info(MSG_INSERT_APPOINTMENT_FAILED);
            result.setCode(1);
            result.setMsg(MSG_INSERT_APPOINTMENT_FAILED);
        }
        return result;
    }

    @Override
    public Result updateAppointment(String appointmentId, AppointmentDTO appointmentDTO) {
        Result result = new Result();
        int flag= appointmentMapper.update(appointmentDTO);
        if(flag >= 1){
            log.info(MSG_UPDATE_APPOINTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_APPOINTMENT_SUCCESS);
        }else{
            log.info(MSG_UPDATE_APPOINTMENT_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_APPOINTMENT_FAILED);
        }
        return result;
    }

    @Override
    public Result deleteAppointment(String appointmentId) {
        Result result = new Result();
        Integer flag = appointmentMapper.delete(appointmentId);
        if(flag >= 1){
            log.info(MSG_DELETE_APPOINTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_DELETE_APPOINTMENT_SUCCESS);
        }else{
            log.info(MSG_DELETE_APPOINTMENT_FAILED);
            result.setCode(0);
            result.setMsg(MSG_DELETE_APPOINTMENT_FAILED);
        }
        return result;
    }

    /**
     * 根据Id查询预约
     * @param appointmentId
     * @return
     */
    @Override
    public Result getAppointmentById(String appointmentId) {
        Result result = new Result();
        Appointment appointment = appointmentMapper.getAppointmentById(appointmentId);
        if(appointment != null){
            log.info(MSG_SELECT_APPOINTMENT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_APPOINTMENT_SUCCESS);
            result.setData(appointment);
        }else{
            log.info(MSG_SELECT_APPOINTMENT_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_APPOINTMENT_FAILED);
            result.setData(appointment);
        }
        return result;
    }
}
