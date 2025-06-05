package com.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {

    private String deptId; // 科室ID（UUID）
    private String deptName; // 科室名称（如内科、外科）
    private String deptDesc; // 科室描述
    private String deptAddress;// 科室地址
    private String deptHead; // 科室负责人ID（关联用户表）
    private Integer deptStatus; // 科室状态（0: 停用，1: 启用）
    private LocalDateTime createTime; // 创建时间
}
