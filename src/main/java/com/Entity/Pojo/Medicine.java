package com.Entity.Pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "medicines")
public class Medicine {
    @Id
    @Column(name = "medicine_id", length = 50)
    private String medicineId; // 药品ID（UUID）

    @Column(name = "medicine_name", length = 100, nullable = false)
    private String medicineName; // 药品名称

    @Column(name = "medicine_spec", length = 50)
    private String medicineSpec; // 规格（如500mg/片）

    @Column(name = "medicine_unit", length = 20)
    private String medicineUnit; // 单位（盒/瓶/片）

    @Column(name = "medicine_category", length = 50)
    private String medicineCategory; // 类别（处方药/非处方药）

    @Column(name = "manufacturer", length = 100)
    private String manufacturer; // 生产厂家

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price; // 单价（精确到分）

    @Column(name = "stock_quantity")
    private Integer stockQuantity; // 库存数量

    @Column(name = "min_stock")
    private Integer minStock; // 最低库存预警值

    @Column(name = "create_time")
    private LocalDateTime createTime; // 创建时间
}