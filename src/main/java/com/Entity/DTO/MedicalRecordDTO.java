package com.Entity.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MedicalRecordDTO {
    private String recordId; // 病历ID
    private String patientId; // 患者ID
    private String patientName; // 患者姓名（冗余字段）
    private String doctorId; // 医生ID
    private String doctorName; // 医生姓名（冗余字段）
    private LocalDateTime recordDate; // 记录日期
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String symptoms; // 症状描述
    private String diagnosis; // 诊断结果
    private String treatmentPlan; // 治疗方案
    private String medications; // 用药记录（JSON格式）
    private Integer recordStatus; // 病历状态（0: 草稿，1: 已提交，2: 已审核）
    private LocalDateTime createTime; // 创建时间
}