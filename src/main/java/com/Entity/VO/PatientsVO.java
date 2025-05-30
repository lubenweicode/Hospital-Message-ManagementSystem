package com.Entity.VO;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 患者VO
 * 部分信息
 */
public class PatientsVO {

    private String patientId; // 患者ID（UUID）
    private String patientName; // 患者姓名
    private Integer patientGender; // 性别（1: 男，2: 女，0: 未知）
    private Integer patientAge; // 年龄
    private LocalDate patientBirth; // 出生日期
    private String patientAddress; // 地址
    private String patientPhone; // 联系电话
    private String patientHistory; // 既往病史
    private String patientCase; // 病例类型（如内科、外科）
    private String patientCasedetail; // 病例详情

}
