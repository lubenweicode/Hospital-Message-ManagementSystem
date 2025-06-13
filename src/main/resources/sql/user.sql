-- 用户表主键索引
ALTER TABLE users
    ADD PRIMARY KEY (user_id);

DELIMITER $$
# 条件查询用户
CREATE PROCEDURE getUsers(
    IN p_userDisplayName VARCHAR(255),
    IN p_userPrivate VARCHAR(255)
)
BEGIN
    SELECT *
    FROM users
    WHERE (p_userDisplayName IS NULL OR p_userDisplayName = '' OR user_displayName LIKE CONCAT('%', p_userDisplayName, '%'))
      AND (p_userPrivate IS NULL OR p_userPrivate = '' OR user_private = p_userPrivate)
    ORDER BY user_private ;
END$$

DELIMITER ;

DELIMITER $$
# 更新用户
CREATE PROCEDURE updateUser(
    IN p_userId varchar(50),
    IN p_displayName VARCHAR(255),
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_private VARCHAR(255),
    IN p_status VARCHAR(255)
)
BEGIN
    UPDATE users
    SET
        user_displayName = IFNULL(p_displayName, user_displayName),
        user_username = IFNULL(p_username, user_username),
        user_password = IFNULL(p_password, user_password),
        user_private = IFNULL(p_private, user_private),
        user_status = IFNULL(p_status, user_status)
    WHERE user_id = p_userId;
END$$

DELIMITER ;

# 根据Id查询用户
DELIMITER $$
CREATE PROCEDURE getUserById(
    IN p_userId INT  -- 用户ID参数
)
BEGIN
    SELECT
        user_id,
        user_displayName,
        user_username,
        user_password,
        user_private,
        user_status,
        create_time
    FROM users
    WHERE user_id = p_userId;  -- 根据ID精确查询
END$$
DELIMITER ;

# 用户账户名模糊查询用户
DELIMITER $$
CREATE PROCEDURE GetUserByDisplayName(
    IN p_displayName VARCHAR(255)
)
BEGIN
    SELECT * FROM users
    WHERE user_displayName LIKE CONCAT('%', p_displayName, '%');
END$$
DELIMITER ;
# 用户名查询用户 ()
DELIMITER $$
CREATE PROCEDURE getUserByUsername(
    IN p_username VARCHAR(255)
)
BEGIN
    SELECT * FROM users
    WHERE user_username = p_username;
END$$
DELIMITER ;

DELIMITER $$

# 逻辑删除用户
CREATE PROCEDURE delUser(
    IN p_id varchar(50)
)
BEGIN
    UPDATE users
    SET
        user_status = -1,
        update_time = NOW()
    WHERE user_id = p_id;
    -- 返回受影响的行数，确认是否成功删除
    SELECT ROW_COUNT() AS rowsAffected;
END$$

DELIMITER ;

# 添加用户
DELIMITER $$
CREATE PROCEDURE addUser(
    IN p_displayName VARCHAR(255),
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_phone VARCHAR(20),
    IN p_status INT,
    IN p_private TINYINT
)
BEGIN
    INSERT INTO users (
        user_displayName,
        user_username,
        user_password,
        user_phone,
        user_status,
        user_private,
        create_time
    )
    VALUES (
               p_displayName,
               p_username,
               p_password,
               p_phone,
               p_status,
               p_private,
               NOW()
           );

    -- 返回新插入的用户ID
    SELECT LAST_INSERT_ID() AS userId;
END$$

DELIMITER ;