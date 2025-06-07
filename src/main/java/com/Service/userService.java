package com.Service;

import com.Common.Result;
import com.Entity.DTO.UserDTO;
import org.springframework.stereotype.Service;

@Service
public interface userService {

    /**
     * 查询所有用户
     * @return
     */
    Result getUsers(UserDTO userDTO);

    /**
     * 添加用户
     * @param user
     * @return
     */
    Result insertUser(UserDTO user);

    /**
     * 删除用户
     * @param id
     * @return
     */
    Result deleteById(String id);

    /**
     * 更改用户
     * @param userDTO
     * @param id
     * @return
     */
    Result updateById(String id,UserDTO userDTO);

    Result getuserById(String userId);
}
