package com.Entity.Pojo;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @Column(name = "doctor_id", length = 50)
    private String doctorId; // 医生ID（UUID）

    @Column(name = "doctor_name", length = 50)
    private String doctorName; // 医生姓名

    @Column(name = "doctor_gender", nullable = false)
    private Integer doctorGender; // 性别（1: 男，2: 女）

    @Column(name = "doctor_title", length = 50)
    private String doctorTitle; // 职称（如主任医师）

    @Column(name = "dept_id", length = 20)
    private String deptId; // 所属科室ID（关联科室表）

    @Column(name = "doctor_specialty", length = 100)
    private String doctorSpecialty; // 擅长领域

    @Column(name = "doctor_status")
    private Integer doctorStatus; // 状态（0: 休假，1: 正常出诊）

    @Column(name = "create_time")
    private LocalDateTime createTime; // 创建时间

    // 关联科室（可选，根据实际需求添加）
    @ManyToOne
    @JoinColumn(name = "dept_id", insertable = false, updatable = false)
    private Department department;
}