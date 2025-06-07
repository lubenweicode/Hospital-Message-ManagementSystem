package com.Entity.DTO;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InventoryRecordDTO {
    private String recordId; // 记录ID
    private String medicineId; // 药品ID
    private String medicineName; // 药品名称（冗余字段）
    private Integer operationType; // 操作类型（1: 入库，2: 出库，3: 退货）
    private Integer quantity; // 数量（入库正，出库负）
    private String operatorId; // 操作人ID
    private String operatorName; // 操作人姓名（冗余字段）
    private LocalDateTime operationTime; // 操作时间
    private String reason; // 操作原因
    private String batchNumber; // 批次号
    private LocalDate expiryDate; // 有效期
}