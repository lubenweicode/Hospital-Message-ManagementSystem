package com.Entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
/**
 * 封装用户查询条件
 */
public class UserDTO {
    private String userId;
    private String userDisplayName;
    private String userName;
    private Integer userStatus;
    private String userPhone;
}
