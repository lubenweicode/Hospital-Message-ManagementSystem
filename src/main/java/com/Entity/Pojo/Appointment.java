package com.Entity.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @Column(name = "appointment_id", length = 50)
    private String appointmentId; // 预约ID（UUID）

    @Column(name = "patient_id", length = 50)
    private String patientId; // 患者ID（关联患者表）

    @Column(name = "doctor_id", length = 50)
    private String doctorId; // 医生ID（关联医生表）

    @Column(name = "schedule_id", length = 50)
    private String scheduleId; // 排班ID（关联排班表）

    @Column(name = "appointment_time")
    private LocalDateTime appointmentTime; // 预约时间

    @Column(name = "symptoms", length = 200)
    private String symptoms; // 症状描述

    @Column(name = "appointment_status", columnDefinition = "TINYINT DEFAULT 3")
    private Integer appointmentStatus; // 预约状态（0: 取消，1: 待就诊，2: 已完成，3: 已爽约）

    @Column(name = "create_time", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createTime; // 创建时间

    // 关联患者、医生、排班（可选）
    @ManyToOne
    @JoinColumn(name = "patient_id", insertable = false, updatable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", insertable = false, updatable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "schedule_id", insertable = false, updatable = false)
    private Schedule schedule;
}