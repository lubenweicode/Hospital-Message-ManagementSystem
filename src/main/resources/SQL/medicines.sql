
-- 药品批次表创建
CREATE TABLE IF NOT EXISTS medicine_batches (
    batch_id VARCHAR(50) PRIMARY KEY COMMENT '批次ID',
    medicine_id VARCHAR(50) NOT NULL COMMENT '药品ID',
    batch_number VARCHAR(50) NOT NULL COMMENT '批次号',
    quantity INT NOT NULL COMMENT '数量',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE NOT NULL COMMENT '有效期至',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常 2-已过期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id),
    INDEX idx_expiry (expiry_date),
    INDEX idx_medicine (medicine_id)
) COMMENT '药品批次表';

DELIMITER $$

CREATE TRIGGER medicine_batches_trigger
BEFORE INSERT ON medicine_batches
FOR EACH ROW
BEGIN
    SET NEW.batch_id = UUID();
END$$

DELIMITER ;

-- 库存操作记录表
CREATE TABLE IF NOT EXISTS inventory_operations (
    operation_id VARCHAR(50) PRIMARY KEY COMMENT '操作ID',
    medicine_id VARCHAR(50) NOT NULL COMMENT '药品ID',
    batch_id VARCHAR(50) COMMENT '批次ID',
    operation_type TINYINT NOT NULL COMMENT '操作类型：1-入库 2-出库 3-退货',
    quantity INT NOT NULL COMMENT '操作数量',
    operator_id VARCHAR(50) COMMENT '操作人ID',
    source_doc VARCHAR(50) COMMENT '来源单据',
    operation_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    remarks VARCHAR(200) COMMENT '备注',
    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id),
    FOREIGN KEY (batch_id) REFERENCES medicine_batches(batch_id)
) COMMENT '库存操作记录表';

DELIMITER $$

CREATE TRIGGER inventory_operations_trigger
BEFORE INSERT ON inventory_operations
FOR EACH ROW
BEGIN
    SET NEW.operation_id = UUID();
END$$

DELIMITER ;

-- 药品入库存储过程
DELIMITER $$

CREATE PROCEDURE sp_MedicineInStock(
    IN p_medicine_id VARCHAR(50),
    IN p_batch_number VARCHAR(50),
    IN p_quantity INT,
    IN p_production_date DATE,
    IN p_expiry_date DATE,
    IN p_operator_id VARCHAR(50),
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_expiry_days INT;
    DECLARE v_current_quantity INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_code = 0;
        SET p_result_msg = '系统错误，入库失败';
    END;

    START TRANSACTION;

    -- 检查药品是否存在
    IF NOT EXISTS (SELECT 1 FROM medicines WHERE medicine_id = p_medicine_id) THEN
        SET p_result_code = 0;
        SET p_result_msg = '药品不存在';
        ROLLBACK;
    ELSE
        -- 检查有效期
        SET v_expiry_days = DATEDIFF(p_expiry_date, CURDATE());

        IF v_expiry_days <= 0 THEN
            SET p_result_code = 0;
            SET p_result_msg = '药品已过期，禁止入库';
            ROLLBACK;
        ELSE
            -- 创建批次记录
            INSERT INTO medicine_batches (
                medicine_id, batch_number, quantity,
                production_date, expiry_date, status
            ) VALUES (
                p_medicine_id, p_batch_number, p_quantity,
                p_production_date, p_expiry_date, 1
            );

            -- 更新药品总库存
            UPDATE medicines
            SET stock_quantity = stock_quantity + p_quantity
            WHERE medicine_id = p_medicine_id;

            -- 记录操作日志
            INSERT INTO inventory_operations (
                medicine_id, batch_id, operation_type,
                quantity, operator_id, remarks
            ) VALUES (
                p_medicine_id, LAST_INSERT_ID(), 1,
                p_quantity, p_operator_id, '药品入库'
            );

            -- 检查库存预警
            SELECT stock_quantity INTO v_current_quantity
            FROM medicines WHERE medicine_id = p_medicine_id;

            IF v_current_quantity <= (SELECT min_stock FROM medicines WHERE medicine_id = p_medicine_id) THEN
                SET p_result_msg = CONCAT('入库成功，当前库存:', v_current_quantity, ' (已达预警值)');
            ELSE
                SET p_result_msg = CONCAT('入库成功，当前库存:', v_current_quantity);
            END IF;

            SET p_result_code = 1;
            COMMIT;
        END IF;
    END IF;
END$$

DELIMITER ;

-- 药品出库存储过程
DELIMITER $$

CREATE PROCEDURE sp_MedicineOutStock(
    IN p_medicine_id VARCHAR(50),
    IN p_quantity INT,
    IN p_operator_id VARCHAR(50),
    IN p_source_doc VARCHAR(50),
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_current_stock INT;
    DECLARE v_available_quantity INT; -- 已添加声明
    DECLARE v_batch_id VARCHAR(50);
    DECLARE v_batch_quantity INT;
    DECLARE v_deduct_quantity INT;
    DECLARE done INT DEFAULT FALSE;

    -- 声明游标用于处理批次
    DECLARE batch_cursor CURSOR FOR
        SELECT batch_id, quantity
        FROM medicine_batches
        WHERE medicine_id = p_medicine_id
        AND status = 1
        AND expiry_date > CURDATE()
        ORDER BY expiry_date;

    -- 声明异常处理
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_code = 0;
        SET p_result_msg = '系统错误，出库失败';
    END;

    START TRANSACTION;

    -- 获取当前库存
    SELECT stock_quantity INTO v_current_stock
    FROM medicines
    WHERE medicine_id = p_medicine_id
    FOR UPDATE;

    -- 检查库存是否充足
    IF v_current_stock < p_quantity THEN
        SET p_result_code = 0;
        SET p_result_msg = CONCAT('库存不足，当前库存:', v_current_stock, '，需求数量:', p_quantity);
        ROLLBACK;
    ELSE
        -- 初始化可用数量
        SET v_available_quantity = p_quantity;

        -- 打开游标处理批次
        OPEN batch_cursor;
        batch_loop: LOOP
            FETCH batch_cursor INTO v_batch_id, v_batch_quantity;
            IF done OR v_available_quantity <= 0 THEN
                LEAVE batch_loop;
            END IF;

            -- 计算本次扣除数量
            SET v_deduct_quantity = LEAST(v_batch_quantity, v_available_quantity);

            -- 更新批次库存
            UPDATE medicine_batches
            SET quantity = quantity - v_deduct_quantity
            WHERE batch_id = v_batch_id;

            -- 减少剩余需要扣除的数量
            SET v_available_quantity = v_available_quantity - v_deduct_quantity;
        END LOOP;
        CLOSE batch_cursor;

        -- 更新总库存
        UPDATE medicines
        SET stock_quantity = stock_quantity - p_quantity
        WHERE medicine_id = p_medicine_id;

        -- 记录出库操作
        INSERT INTO inventory_operations (
            medicine_id, operation_type, quantity,
            operator_id, source_doc, remarks
        ) VALUES (
            p_medicine_id, 2, p_quantity,
            p_operator_id, p_source_doc, '药品出库'
        );

        SET p_result_code = 1;
        SET p_result_msg = CONCAT('出库成功，剩余库存:', (v_current_stock - p_quantity));

        -- 检查库存预警
        IF (v_current_stock - p_quantity) <= (SELECT min_stock FROM medicines WHERE medicine_id = p_medicine_id) THEN
            SET p_result_msg = CONCAT(p_result_msg, ' (已达预警值)');
        END IF;

        COMMIT;
    END IF;
END$$

DELIMITER ;

-- 药品退货存储过程
DELIMITER $$

CREATE PROCEDURE sp_MedicineReturn(
    IN p_operation_id VARCHAR(50), -- 原始出库记录ID
    IN p_quantity INT,
    IN p_operator_id VARCHAR(50),
    OUT p_result_code INT,
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_original_quantity INT;
    DECLARE v_medicine_id VARCHAR(50);
    DECLARE v_batch_id VARCHAR(50);
    DECLARE v_expiry_date DATE;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_result_code = 0;
        SET p_result_msg = '系统错误，退货失败';
    END;

    START TRANSACTION;

    -- 获取原始出库信息
    SELECT quantity, medicine_id, batch_id
    INTO v_original_quantity, v_medicine_id, v_batch_id
    FROM inventory_operations
    WHERE operation_id = p_operation_id
    AND operation_type = 2  -- 出库操作
    FOR UPDATE;

    -- 检查有效性
    IF v_original_quantity IS NULL THEN
        SET p_result_code = 0;
        SET p_result_msg = '无效的原始出库记录';
        ROLLBACK;
    ELSEIF p_quantity > v_original_quantity THEN
        SET p_result_code = 0;
        SET p_result_msg = CONCAT('退货数量不能超过原始出库数量(', v_original_quantity, ')');
        ROLLBACK;
    ELSE
        -- 检查批次有效期
        SELECT expiry_date INTO v_expiry_date
        FROM medicine_batches
        WHERE batch_id = v_batch_id;

        IF DATEDIFF(v_expiry_date, CURDATE()) <= 0 THEN
            SET p_result_code = 0;
            SET p_result_msg = '药品已过期，不可退货';
            ROLLBACK;
        ELSE
            -- 更新批次库存
            UPDATE medicine_batches
            SET quantity = quantity + p_quantity
            WHERE batch_id = v_batch_id;

            -- 更新总库存
            UPDATE medicines
            SET stock_quantity = stock_quantity + p_quantity
            WHERE medicine_id = v_medicine_id;

            -- 记录退货操作
            INSERT INTO inventory_operations (
                medicine_id, batch_id, operation_type,
                quantity, operator_id, source_doc, remarks
            ) VALUES (
                v_medicine_id, v_batch_id, 3, -- 3=退货
                p_quantity, p_operator_id, p_operation_id, '药品退货'
            );

            SET p_result_code = 1;
            SET p_result_msg = '退货成功';
            COMMIT;
        END IF;
    END IF;
END$$

DELIMITER ;

-- 库存预警检查存储过程
DELIMITER $$

CREATE PROCEDURE sp_CheckInventoryWarning(
    OUT p_low_stock_count INT,
    OUT p_near_expiry_count INT,
    OUT p_expired_count INT
)
BEGIN
    -- 检查库存低于预警值的药品
    SELECT COUNT(*) INTO p_low_stock_count
    FROM medicines
    WHERE stock_quantity <= min_stock;

    -- 检查近效期药品(90天内到期)
    SELECT COUNT(DISTINCT medicine_id) INTO p_near_expiry_count
    FROM medicine_batches
    WHERE expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 90 DAY)
    AND status = 1;

    -- 检查已过期药品
    SELECT COUNT(DISTINCT medicine_id) INTO p_expired_count
    FROM medicine_batches
    WHERE expiry_date < CURDATE()
    AND status = 1;

    -- 自动更新过期药品状态
    UPDATE medicine_batches
    SET status = 2
    WHERE expiry_date < CURDATE()
    AND status = 1;
END$$

DELIMITER ;