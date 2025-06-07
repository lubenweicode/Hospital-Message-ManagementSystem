package com.Entity.Pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "departments")
public class Department {
    @Id
    @Column(name = "dept_id", length = 50)
    private String deptId; // 科室ID（UUID）

    @Column(name = "dept_name", length = 50, nullable = false)
    private String deptName; // 科室名称（如内科、外科）

    @Column(name = "dept_desc", length = 200)
    private String deptDesc; // 科室描述

    @Column(name = "dept_address", length=50)
    private String deptAddress;// 科室地址

    @Column(name = "dept_head", length = 50)
    private String deptHead; // 科室负责人ID（关联用户表）

    @Column(name = "dept_status", columnDefinition = "TINYINT DEFAULT 1")
    private Integer deptStatus; // 科室状态（0: 停用，1: 启用）

    @Column(name = "create_time")
    private LocalDateTime createTime; // 创建时间
}