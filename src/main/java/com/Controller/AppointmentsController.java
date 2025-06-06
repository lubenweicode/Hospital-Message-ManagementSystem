package com.Controller;

import com.Common.Result;
import com.Entity.DTO.AppointmentDTO;
import com.Entity.Pojo.Appointment;
import com.Service.appointmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/appointment")
public class AppointmentsController {

    @Autowired
    private appointmentService appointmentServiceImpl;

    /**
     * 查询预约(允许条件查询)
     * @param appointmentDTO
     * @return
     */
    @PostMapping("/search")
    public Result search(@RequestBody(required = false) AppointmentDTO appointmentDTO) {
        log.info("查询预约：{}", appointmentDTO);
        return appointmentServiceImpl.getAppointments(appointmentDTO);
    }

    /**
     * 添加预约
     * @param appointmentDTO
     * @return
     */
    @PostMapping
    public Result addAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        log.info("添加预约{}", appointmentDTO);
        return appointmentServiceImpl.insertAppointment(appointmentDTO);
    }

    /**
     * 根据Id更新预约
     * @param appointmentId
     * @param appointmentDTO
     * @return
     */
    @PutMapping("/{appointmentId}")
    public Result updateAppointment(@PathVariable String appointmentId, @RequestBody AppointmentDTO appointmentDTO) {
        log.info("根据Id：{},更新预约:{}",appointmentId,appointmentDTO);
        return appointmentServiceImpl.updateAppointment(appointmentId, appointmentDTO);
    }

    /**
     * 根据Id删除预约
     * @param appointmentId
     * @return
     */
    @DeleteMapping("/{appointmentId}")
    public Result deleteAppointment(@PathVariable String appointmentId) {
        log.info("根据Id：{},删除预约:{}",appointmentId,appointmentServiceImpl.deleteAppointment(appointmentId));
        return appointmentServiceImpl.deleteAppointment(appointmentId);
    }

    /**
     * 根据Id查询预约
     * @param appointmentId
     * @return
     */
    @GetMapping("{appointmentId}")
    public Result getAppointment(@PathVariable String appointmentId) {
        log.info("根据Id:{} 查询预约", appointmentId);
        return appointmentServiceImpl.getAppointmentById(appointmentId);
    }
}
