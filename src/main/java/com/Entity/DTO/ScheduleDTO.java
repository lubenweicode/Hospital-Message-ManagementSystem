package com.Entity.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ScheduleDTO {
    private String scheduleId; // 排班ID
    private String deptName; // 科室名称
    private String doctorId; // 医生ID
    private String doctorName; // 医生姓名（冗余字段）
    private LocalDate scheduleDate; // 排班日期
    private Integer scheduleTime; // 时间段（1: 上午，2: 下午，3: 晚上）
    private Integer maxPatients; // 最大预约数
    private Integer currentPatients; // 已预约数
    private Integer scheduleStatus; // 排班状态（0: 取消，1: 正常）
    private LocalDateTime createTime; // 创建时间
}