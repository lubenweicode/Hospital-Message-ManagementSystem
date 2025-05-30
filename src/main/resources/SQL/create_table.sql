USE hospital;

-- 登录系统
CREATE TABLE IF NOT EXISTS users(
                       user_id VARCHAR(50) PRIMARY KEY COMMENT '用户 ID,唯一标识，建议使用 UUID',
                       user_displayname varchar(36) comment '用户名,不唯一',
                       user_username VARCHAR(50) UNIQUE NOT NULL COMMENT '账户号,唯一，用于登录',
                       user_password VARCHAR(50) NOT NULL COMMENT '密码,存储加密后的密码',
                       user_private TINYINT NOT NULL COMMENT '用户权限,1: 普通用户（医生 / 护士 / 患者） 2: 管理员',
                       user_phone VARCHAR(20) COMMENT '联系电话,用于联系普通用户和管理员',
                       user_status TINYINT DEFAULT 1 NOT NULL COMMENT '用户状态,0: 禁用 1: 启用（默认）',
                       create_time DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间,默认 CURRENT_TIMESTAMP',
                       update_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间,自动更新'
) COMMENT '用户表';

-- 患者管理
CREATE TABLE IF NOT EXISTS patients (
                          patient_id VARCHAR(50) PRIMARY KEY COMMENT '患者 ID',
                          patient_name VARCHAR(50) NOT NULL COMMENT '患者姓名',
                          patient_gender TINYINT COMMENT '性别, 1: 男 2: 女 0: 未知',
                          patient_age INT COMMENT '年龄',
                          patient_birth DATE COMMENT '出生日期',
                          patient_address VARCHAR(200) COMMENT '地址',
                          patient_phone VARCHAR(20) COMMENT '联系电话',
                          patient_id_card VARCHAR(20) UNIQUE COMMENT '身份证号',
                          patient_allergy VARCHAR(200) COMMENT '过敏史',
                          patient_history TEXT COMMENT '既往病史',
                          patient_case VARCHAR(10) COMMENT '病人情况,如 "内科"、"外科"',
                          patient_casedetail VARCHAR(200) COMMENT '病人具体情况,病人头部疼痛剧烈、发热',
                          create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                          update_time DATETIME ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) COMMENT '患者表';

-- 医生与科室管理
CREATE TABLE IF NOT EXISTS departments (
                             dept_id VARCHAR(50) PRIMARY KEY COMMENT '科室 ID',
                             dept_name VARCHAR(50) NOT NULL COMMENT '科室名称,如 "内科"、"外科"',
                             dept_desc VARCHAR(200) COMMENT '科室描述',
                             dept_address varchar(50) comment '科室地址',
                             dept_head VARCHAR(50) COMMENT '科室负责人 ID',
                             dept_status TINYINT DEFAULT 1 COMMENT '科室状态,0: 停用 1: 启用（默认）',
                             create_time DATETIME COMMENT '创建时间 '
) COMMENT '科室表';

CREATE TABLE IF NOT EXISTS doctors (
                         doctor_id VARCHAR(50) PRIMARY KEY COMMENT '医生 ID',
                         doctor_name VARCHAR(50) COMMENT '医生姓名',
                         doctor_gender TINYINT NOT NULL COMMENT ' 1: 男 2: 女',
                         doctor_title VARCHAR(50) COMMENT '职称',
                         doctor_dept_id VARCHAR(20) COMMENT '所属科室 ID',
                         doctor_specialty VARCHAR(100) COMMENT '擅长领域',
                         doctor_status TINYINT COMMENT '状态,0: 休假 1: 正常出诊',
                         create_time DATETIME COMMENT '创建时间',
                         FOREIGN KEY (`doctor_dept_id`) REFERENCES departments(`dept_id`)
) COMMENT '医生表';

-- 预约与排班管理
CREATE TABLE IF NOT EXISTS schedules (
                           schedule_id varchar(50) PRIMARY KEY COMMENT '排班ID,UUID',
                           dept_name varchar(50) COMMENT '科室名称',
                           dept_address varchar(50) comment '科室地址',
                           doctor_id VARCHAR(50) COMMENT '医生ID',
                           schedule_date DATE COMMENT '排班日期',
                           schedule_time INT COMMENT '时间段,如 "上午"、"下午"、"晚上"',
                           max_patients INT DEFAULT 30 COMMENT '最大预约数,默认30人',
                           current_patients INT DEFAULT 0 COMMENT '已预约数,默认0',
                           schedule_status TINYINT DEFAULT 1 COMMENT '排班状态,0: 取消 1: 正常（默认）',
                           create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           FOREIGN KEY (`doctor_id`) REFERENCES doctors(`doctor_id`)
) COMMENT '排班表';

CREATE TABLE IF NOT EXISTS appointments (
                              appointment_id VARCHAR(50) PRIMARY KEY COMMENT '预约 ID',
                              patient_id VARCHAR(50) COMMENT '患者 ID',
                              doctor_id VARCHAR(50) COMMENT '医生 ID',
                              schedule_id varchar(50) COMMENT '排班 ID',
                              appointment_time DATETIME COMMENT '预约时间',
                              symptoms VARCHAR(200) COMMENT '症状描述',
                              appointment_status TINYINT DEFAULT 3 COMMENT '预约状态,0: 已取消 1: 待就诊 2: 已完成 3: 已爽约',
                              create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                              FOREIGN KEY (`patient_id`) REFERENCES patients(`patient_id`),
                              FOREIGN KEY (`doctor_id`) REFERENCES doctors(`doctor_id`),
                              FOREIGN KEY (`schedule_id`) REFERENCES schedules(`schedule_id`)
) COMMENT '预约表';

-- 病历与诊断管理
CREATE TABLE IF NOT EXISTS medical_records (
                                 record_id VARCHAR(50) PRIMARY KEY COMMENT '病历ID（主键）',
                                 patient_id VARCHAR(50),
                                 doctor_id VARCHAR(50),
                                 record_date DATETIME COMMENT '记录日期',
                                 symptoms TEXT COMMENT '症状描述,医生填写',
                                 diagnosis TEXT COMMENT '诊断结果',
                                 treatment_plan TEXT COMMENT '治疗方案',
                                 medications TEXT COMMENT '用药记录,JSON格式存储药品信息',
                                 record_status TINYINT DEFAULT 0 COMMENT '病历状态,0: 草稿 1: 已提交 2: 已审核',
                                 create_time DATETIME COMMENT '创建时间',
                                 FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
                                 FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
) COMMENT '病历表';

-- 药品管理
CREATE TABLE IF NOT EXISTS medicines (
                           medicine_id VARCHAR(50) PRIMARY KEY COMMENT '药品ID',
                           medicine_name VARCHAR(100) NOT NULL COMMENT '药品名称',
                           medicine_spec VARCHAR(50) COMMENT '规格,如 "500mg / 片"',
                           medicine_unit VARCHAR(20) COMMENT '单位,如 "盒"、"瓶"、"片"',
                           medicine_category VARCHAR(50) COMMENT '药品类别,如 "处方药"、"非处方药"',
                           manufacturer VARCHAR(100) COMMENT '生产厂家',
                           price DECIMAL(10,2) COMMENT '单价',
                           stock_quantity INT COMMENT '库存数量',
                           min_stock INT COMMENT '最低库存预警值',
                           create_time DATETIME COMMENT '创建时间'
) COMMENT '药品表';

# CREATE TABLE IF NOT EXISTS inventory_records (
#                                    record_id varchar(50) PRIMARY KEY COMMENT '记录ID',
#                                    medicine_id VARCHAR(50),
#                                    operation_type TINYINT COMMENT '操作类型,1: 入库 2: 出库 3: 退货',
#                                    quantity INT COMMENT '数量,入库为正,出库为负',
#                                    operator_id VARCHAR(50),
#                                    operation_time DATETIME COMMENT '操作时间',
#                                    reason VARCHAR(200) COMMENT '操作原因',
#                                    batch_number VARCHAR(50) COMMENT '批次号',
#                                    expiry_date DATE COMMENT '有效期',
#                                    FOREIGN KEY (medicine_id) REFERENCES medicines(medicine_id),
#                                    FOREIGN KEY (operator_id) REFERENCES users(user_id)
# ) COMMENT '库存记录表';