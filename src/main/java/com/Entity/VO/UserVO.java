package com.Entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserVO {

    private String userId;// 用户ID
    private String userDisplayname;// 用户名
    private Integer userPrivate;// 用户权限 1.医生 2.护士 3.管理员
    private String userPhone;// 用户电话
    private Integer userStatus;// 用户状态 0.禁用 1.启用
    private LocalDateTime createTime;// 用户创造时间
    private LocalDateTime updateTime;// 用户更新时间
}
