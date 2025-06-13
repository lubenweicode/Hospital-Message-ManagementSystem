-- 药品表主键索引
ALTER TABLE medicines
    ADD PRIMARY KEY (medicine_id);

# 查询药品
delimiter //
create procedure getMedicines(in p_medicineName varchar(50),in p_medicineCategory varchar(50),in p_medicineStatus tinyint)
begin
    if(p_medicineName='')then
        set p_medicineName=null;
    end if;
    if(p_medicineCategory='')then
        set p_medicineCategory=null;
    end if;
    if(p_medicineStatus not in (1,2,3))then
        set p_medicineStatus=null;
    end if;

    select * from medicines where (p_medicineName is null or p_medicineName=medicine_name) and
                                  (p_medicineCategory is null or p_medicineCategory=medicine_category) and
                                  (p_medicineStatus is null or p_medicineStatus=medicine_status);
end //
# 检查库存状态触发器
#
delimiter //
create trigger t_Medicines_ck_status after update on medicines
    for each row
begin
    if new.stock_quantity < new.min_stock and new.stock_quantity > 0 then
        update medicines set medicine_status = 3 where medicines.medicine_id = new.medicine_id;
    end if;
    if new.stock_quantity >= new.min_stock then
        update medicines set medicine_status = 1 where medicines.medicine_id = new.medicine_id;
    end if;
    if new.stock_quantity < 0 then
        update medicines set medicine_status = 2, stock_quantity = 0 where medicines.medicine_id = new.medicine_id;
    end if;
end //
delimiter ;
# 添加药品
DELIMITER //

CREATE PROCEDURE addMedicine(
    IN p_medicineName VARCHAR(255),IN p_medicineSpec VARCHAR(100),IN p_medicineUnit VARCHAR(50),
    IN p_medicineCategory varchar(50),IN p_manufacturer VARCHAR(255),IN p_price DECIMAL(10, 2),
    IN p_stockQuantity INT,IN p_minStock INT
)
BEGIN
    -- 声明变量用于存储状态值
    DECLARE v_medicineStatus INT;

    -- 根据库存数量计算状态
    IF p_stockQuantity >= p_minStock THEN
        SET v_medicineStatus = 1; -- 充足
    ELSEIF p_stockQuantity > 0 THEN
        SET v_medicineStatus = 3; -- 不足
    ELSE
        SET v_medicineStatus = 2; -- 缺货
    END IF;

    -- 插入新药品记录
    INSERT INTO medicines (
        medicine_name,medicine_spec,medicine_unit,medicine_category,manufacturer,
        price,stock_quantity,min_stock,medicine_status,create_time)
    VALUES (
            p_medicineName,p_medicineSpec,
            p_medicineUnit,p_medicineCategory,
            p_manufacturer,p_price,
            p_stockQuantity,p_minStock,
            v_medicineStatus,NOW()
           );

    -- 返回新插入记录的ID
    # SELECT LAST_INSERT_ID() AS medicine_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE updateMedicine(
    IN p_medicineId INT,                 -- 新增：药品ID作为更新条件
    IN p_medicineName VARCHAR(255),
    IN p_medicineSpec VARCHAR(100),
    IN p_medicineUnit VARCHAR(50),
    IN p_medicineCategory INT,
    IN p_manufacturer VARCHAR(255),
    IN p_price DECIMAL(10, 2),
    IN p_stockQuantity INT,
    IN p_minStock INT
)
BEGIN
    -- 声明变量用于存储状态值
    DECLARE v_medicineStatus INT;

    -- 根据库存数量计算状态
    IF p_stockQuantity >= p_minStock THEN
        SET v_medicineStatus = 1; -- 充足
    ELSEIF p_stockQuantity > 0 THEN
        SET v_medicineStatus = 3; -- 不足
    ELSE
        SET v_medicineStatus = 2; -- 缺货
    END IF;

    -- 更新药品记录
    UPDATE medicines
    SET
        medicine_name = p_medicineName,
        medicine_spec = p_medicineSpec,
        medicine_unit = p_medicineUnit,
        medicine_category = p_medicineCategory,
        manufacturer = p_manufacturer,
        price = p_price,
        stock_quantity = p_stockQuantity,
        min_stock = p_minStock,
        medicine_status = v_medicineStatus,
        update_time = NOW()               -- 新增：记录更新时间
    WHERE
        medicine_id = p_medicineId;                -- 使用药品ID作为更新条件

    -- 返回受影响的行数
    SELECT ROW_COUNT() AS rows_affected;
END //

DELIMITER ;

# 扣减药品库存
DELIMITER $$
CREATE PROCEDURE `sp_decrease_stock`(
    IN p_medicine_id BIGINT,
    IN p_quantity INT,
    OUT p_success TINYINT
)
BEGIN
    declare  current_stock int;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION SET p_success = 0;
    START TRANSACTION;

    -- 1. 查询库存并加行锁（悲观锁）
    SELECT stock_quantity INTO current_stock
    FROM medicines
    WHERE medicine_id = p_medicine_id
        FOR UPDATE; -- 锁定行，阻止其他事务修改

    -- 2. 校验库存
    IF current_stock >= p_quantity THEN
        -- 3. 扣减库存
        UPDATE medicines
        SET stock_quantity = stock_quantity - p_quantity
        WHERE medicine_id = p_medicine_id;
        SET p_success = 1;
    ELSE
        SET p_success = 0;
    END IF;

    COMMIT;
END$$
DELIMITER ;