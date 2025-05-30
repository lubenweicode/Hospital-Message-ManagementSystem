package com.Service.Impl;

import com.Common.Result;
import com.Mapper.AppointmentsMapper;
import com.Entity.Pojo.Appointment;
import com.Entity.DTO.AppointmentDTO;
import com.Service.appointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
        List<Appointment> appointmentList = appointmentMapper.select(appointmentDTO);
        if(appointmentList != null && appointmentList.size() > 0) {
            log.info("查询成功,appointmentDTO:{}",appointmentDTO);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(appointmentList);
        }else{
            log.info("查询为空,appointmentDTO:{}",appointmentDTO);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
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
            log.info("添加预约成功,appointmentDTO:{}",appointmentDTO);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            log.info("添加预约失败,appointmentDTO:{}",appointmentDTO);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_FAILED);
        }
        return result;
    }

    @Override
    public Result updateAppointment(String appointmentId, AppointmentDTO appointmentDTO) {
        Result result = new Result();
        Integer flag = appointmentMapper.update(appointmentId, appointmentDTO);
        if(flag >= 1){
            log.info("更新预约成功,appointmentDTO:{}",appointmentDTO);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            log.info("更新预约失败,appointmentDTO:{}",appointmentDTO);
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
        }
        return result;
    }

    @Override
    public Result deleteAppointment(String appointmentId) {
        Result result = new Result();
        Integer flag = appointmentMapper.delete(appointmentId);
        if(flag >= 1){
            log.info("删除预约成功,appointmentId:{}",appointmentId);
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
        }else{
            log.info("删除预约失败,appointmentId:{}",appointmentId);
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
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
            result.setCode(1);
            result.setMsg(MSG_OPERATION_SUCCESS);
            result.setData(appointment);
        }else{
            result.setCode(0);
            result.setMsg(MSG_OPERATION_FAILED);
            result.setData(appointment);
        }
        return result;
    }
}
