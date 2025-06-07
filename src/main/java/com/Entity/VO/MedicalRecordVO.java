package com.Entity.VO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MedicalRecordVO {

    private String recordId; // 病历ID（UUID）
    private String patientId; // 患者ID（关联患者表）
    private String patientName;// 患者名称
    private String doctorId; // 医生ID（关联医生表）
    private String doctorName; // 医生姓名
    private String deptName; // 部门
    private LocalDateTime recordDate; // 记录日期
    private String symptoms; // 症状描述
    private String diagnosis; // 诊断结果
    private String treatmentPlan; // 治疗方案
    private String medications; // 用药记录（JSON格式）
    private Integer recordStatus; // 病历状态（0: 草稿，1: 已提交，2: 已审核）
    private LocalDateTime createTime; // 创建时间

}
