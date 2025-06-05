package com.Entity.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@NotNull
/**
 * 封装用户查询条件
 */
public class UserDTO {
    private String userId;
    private String userDisplayName;
    private String userUsername;
    private String userPassword;
    private Integer userStatus;
    private String userPhone;
    private String userPrivate="1";

}
