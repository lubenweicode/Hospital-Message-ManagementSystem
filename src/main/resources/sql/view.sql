# 创建查询用户视图
CREATE OR REPLACE VIEW view_users AS
SELECT
    user_id,                -- 用户ID（主键）
    user_displayname,       -- 用户名
    user_username,          -- 登录账户
    user_private,           -- 用户权限（1: 普通用户，2: 管理员）
    user_phone,             -- 联系电话
    CASE user_status         -- 用户状态（友好显示）
        WHEN 1 THEN '启用'
        WHEN 0 THEN '禁用'
        ELSE '未知'
        END AS user_status,
    create_time,            -- 创建时间
    update_time             -- 更新时间
FROM users
WHERE user_private IN (1, 2); -- 仅显示普通用户和管理员（过滤无效权限）
# 创建查询患者视图
CREATE OR REPLACE VIEW view_patients AS
SELECT
    p.patient_id,               -- 患者ID（主键）
    p.patient_name,             -- 姓名
    CASE p.patient_gender        -- 性别转换
        WHEN 1 THEN '男'
        WHEN 2 THEN '女'
        ELSE '未知'
        END AS patient_gender,
    p.patient_age,              -- 年龄
    DATE_FORMAT(p.patient_birth, '%Y-%m-%d') AS patient_birth, -- 出生日期（格式化）
    p.patient_address,          -- 地址
    p.patient_phone,            -- 联系电话
    p.patient_Idcard,          -- 身份证号（敏感字段可按需隐藏）
    p.patient_allergy,          -- 过敏史
    p.patient_history,          -- 既往病史
    p.patient_case,             -- 所属科室
    p.patient_casedetail,       -- 病情描述
    mr.record_id,               -- 最新病历ID（关联病历表）
    mr.record_date,             -- 最新诊断日期
    mr.diagnosis               -- 最新诊断结果（简化显示）
FROM patients p
         LEFT JOIN (
    -- 子查询：获取每个患者的最新病历
    SELECT patient_id, MAX(record_id) AS record_id, MAX(record_date) AS record_date, diagnosis
    FROM medical_records
    GROUP BY patient_id
) mr ON p.patient_id = mr.patient_id
ORDER BY p.create_time DESC; -- 按创建时间倒序排列

# 查询用户
SELECT * FROM view_users;
# 查询患者
SELECT patient_name, patient_gender, record_date, diagnosis FROM view_patients;