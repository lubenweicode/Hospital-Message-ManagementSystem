package com.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private String appointmentId;// 预约ID
    private String patientId;// 患者ID
    private String patientName;
    private String doctorId;// 医生ID
    private String doctorName;
    private String scheduleId;// 排班ID
    private String scheduleDetail;//
    private LocalDateTime appointmentTime;// 预约时间
    private String symptoms;// 症状描述
    private Integer appointmentStatus;// 预约状态 0 已取消 1 待就诊 2 已完成 3 已爽约
    private LocalDateTime appointmentCreateTime;// 创建时间

}
