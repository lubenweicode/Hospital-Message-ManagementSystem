package com.Entity.Pojo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "schedules")
@AllArgsConstructor
@NoArgsConstructor
public class Schedule {
    @Id
    @Column(name = "schedule_id", length = 50)
    private String scheduleId; // 排班ID（UUID）

    @Column(name = "dept_name", length = 50)
    private String deptName; // 科室名称

    @Column(name = "dept_address", length = 50)
    private String deptAddress;

    @Column(name = "doctor_id", length = 50)
    private String doctorId; // 医生ID（关联医生表）

    @Column(name = "schedule_date")
    private LocalDate scheduleDate; // 排班日期

    @Column(name = "schedule_time")
    private Integer scheduleTime; // 时间段（1: 上午，2: 下午，3: 晚上）

    @Column(name = "max_patients", columnDefinition = "INT DEFAULT 30")
    private Integer maxPatients; // 最大预约数（默认30）

    @Column(name = "current_patients", columnDefinition = "INT DEFAULT 0")
    private Integer currentPatients; // 已预约数（默认0）

    @Column(name = "schedule_status", columnDefinition = "TINYINT DEFAULT 1")
    private Integer scheduleStatus; // 排班状态（0: 取消，1: 正常）

    @Column(name = "create_time", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createTime; // 创建时间

    // 关联医生（可选，根据实际需求添加）
    @ManyToOne
    @JoinColumn(name = "doctor_id", insertable = false, updatable = false)
    private Doctor doctor;
}