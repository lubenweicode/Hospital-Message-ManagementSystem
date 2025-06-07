package com.Entity.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DoctorDTO {
    private String doctorId; // 医生ID
    private String doctorName; // 医生姓名
    private Integer doctorGender; // 性别（1: 男，2: 女）
    private String doctorTitle; // 职称
    private String deptId; // 所属科室ID
    private String doctorSpecialty; // 擅长领域
    private Integer doctorStatus; // 状态（0: 休假，1: 正常出诊）
    private LocalDateTime createTime; // 创建时间
    private String doctorDepartmentName;// 所属科室
    private String doctorDepartment;
}