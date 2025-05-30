package com.Entity.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    @Id
    @Column(name = "record_id", length = 50)
    private String recordId; // 病历ID（UUID）

    @Column(name = "patient_id", length = 50)
    private String patientId; // 患者ID（关联患者表）

    @Column(name = "doctor_id", length = 50)
    private String doctorId; // 医生ID（关联医生表）

    @Column(name = "record_date")
    private LocalDateTime recordDate; // 记录日期

    @Column(name = "symptoms", columnDefinition = "TEXT")
    private String symptoms; // 症状描述

    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis; // 诊断结果

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan; // 治疗方案

    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications; // 用药记录（JSON格式）

    @Column(name = "record_status", columnDefinition = "TINYINT DEFAULT 0")
    private Integer recordStatus; // 病历状态（0: 草稿，1: 已提交，2: 已审核）

    @Column(name = "create_time")
    private LocalDateTime createTime; // 创建时间

    // 关联患者和医生（可选）
    @ManyToOne
    @JoinColumn(name = "patient_id", insertable = false, updatable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", insertable = false, updatable = false)
    private Doctor doctor;
}