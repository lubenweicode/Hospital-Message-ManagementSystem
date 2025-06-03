package com.Entity.Pojo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId; // 用户ID（UUID）

    @Column(name = "user_displayname", length = 36)
    private String userDisplayname; // 用户名

    @Column(name = "user_username", length = 50, unique = true, nullable = false)
    private String userUsername; // 登录账户（唯一）

    @Column(name = "user_password", length = 50, nullable = false)
    private String userPassword; // 加密密码

    @Column(name = "user_private", nullable = true)
    private Integer userPrivate; // 用户权限（1: 普通用户，2: 管理员）

    @Column(name = "user_phone", length = 20)
    private String userPhone; // 联系电话

    @Column(name = "user_status", nullable = true, columnDefinition = "TINYINT DEFAULT 1")
    private Integer userStatus; // 用户状态（0: 禁用，1: 启用）

    @Column(name = "create_time", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createTime; // 创建时间（自动填充）

    @Column(name = "update_time", columnDefinition = "DATETIME ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updateTime; // 更新时间（自动更新）
}