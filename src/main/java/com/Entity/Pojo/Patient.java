package com.Entity.Pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "patients")
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    @Column(name = "patient_id", length = 50)
    private String patientId; // 患者ID（UUID）

    @Column(name = "patient_name", length = 50, nullable = false)
    private String patientName; // 患者姓名

    @Column(name = "patient_gender")
    private Integer patientGender; // 性别（1: 男，2: 女，0: 未知）

    @Column(name = "patient_age")
    private Integer patientAge; // 年龄

    @Column(name = "patient_birth")
    private LocalDate patientBirth; // 出生日期

    @Column(name = "patient_address", length = 200)
    private String patientAddress; // 地址

    @Column(name = "patient_phone", length = 20)
    private String patientPhone; // 联系电话

    @Column(name = "patient_id_card", length = 20, unique = true)
    private String patientIdCard; // 身份证号（唯一）

    @Column(name = "patient_allergy", length = 200)
    private String patientAllergy; // 过敏史

    @Column(name = "patient_history", columnDefinition = "TEXT")
    private String patientHistory; // 既往病史

    @Column(name = "patient_case", length = 10)
    private String patientCase; // 病例类型（如内科、外科）

    @Column(name = "patient_casedetail", length = 200)
    private String patientCasedetail; // 病例详情

    @Column(name = "create_time", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createTime; // 创建时间

    @Column(name = "update_time", columnDefinition = "DATETIME ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updateTime; // 更新时间
}