package com.Entity.Pojo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory_records")
public class InventoryRecord {
    @Id
    @Column(name = "record_id", length = 50)
    private String recordId; // 记录ID（UUID）

    @Column(name = "medicine_id", length = 50)
    private String medicineId; // 药品ID（关联药品表）

    @Column(name = "operation_type")
    private Integer operationType; // 操作类型（1: 入库，2: 出库，3: 退货）

    @Column(name = "quantity")
    private Integer quantity; // 数量（入库正，出库负）

    @Column(name = "operator_id", length = 50)
    private String operatorId; // 操作人ID（关联用户表）

    @Column(name = "operation_time")
    private LocalDateTime operationTime; // 操作时间

    @Column(name = "reason", length = 200)
    private String reason; // 操作原因

    @Column(name = "batch_number", length = 50)
    private String batchNumber; // 批次号

    @Column(name = "expiry_date")
    private LocalDate expiryDate; // 有效期

    // 关联药品和操作人（可选）
    @ManyToOne
    @JoinColumn(name = "medicine_id", insertable = false, updatable = false)
    private Medicine medicine;

    @ManyToOne
    @JoinColumn(name = "operator_id", insertable = false, updatable = false)
    private User operator;
}