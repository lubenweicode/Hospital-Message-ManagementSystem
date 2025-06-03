package com.Entity.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientDTO {
    private String patientId; // 患者ID
    private String patientName; // 患者姓名
    private Integer patientGender; // 性别（1: 男，2: 女，0: 未知）
    private Integer patientAge; // 年龄
    private LocalDate patientBirth; // 出生日期
    private String patientAddress; // 地址
    private String patientPhone; // 联系电话
    private String patientIdCard; // 身份证号
    private String patientAllergy; // 过敏史
    private String patientHistory; // 既往病史
    private String patientCase; // 病例类型（如内科、外科）
    private String patientCasedetail; // 病例详情
    private LocalDateTime createTime; // 创建时间
    private LocalDateTime updateTime; // 更新时间
}