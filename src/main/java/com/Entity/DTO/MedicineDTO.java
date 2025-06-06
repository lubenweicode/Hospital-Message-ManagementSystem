package com.Entity.DTO;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MedicineDTO {
    private String medicineId; // 药品ID
    private String medicineName; // 药品名称
    private String medicineSpec; // 规格
    private String medicineUnit; // 单位
    private String medicineCategory; // 类别（处方药/非处方药）
    private String manufacturer; // 生产厂家
    private BigDecimal price; // 单价
    private String medicineStatus; // 库存状态
    private Integer stockQuantity; // 库存数量
    private Integer minStock; // 最低库存预警值
    private LocalDateTime createTime; // 创建时间
    private LocalDateTime updateTime; // 更新时间
}