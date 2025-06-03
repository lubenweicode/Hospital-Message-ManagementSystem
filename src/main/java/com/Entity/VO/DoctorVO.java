package com.Entity.VO;

import jakarta.persistence.Column;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

/**
 * 医生VO
 */
public class DoctorVO {

    private String doctorId; // 医生ID（UUID）
    private String doctorName; // 医生姓名
    private Integer doctorGender; // 性别（1: 男，2: 女）
    private String doctorTitle; // 职称（如主任医师）
    private String doctorDeptId; // 所属科室ID（关联科室表）
    private String doctorSpecialty; // 擅长领域
    private Integer doctorStatus; // 状态（0: 休假，1: 正常出诊）
    private LocalDateTime createTime; // 创建时间
}
