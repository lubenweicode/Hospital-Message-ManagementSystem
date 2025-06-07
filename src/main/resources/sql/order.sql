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