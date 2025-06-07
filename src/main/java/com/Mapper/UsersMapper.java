package com.Mapper;
import com.Entity.DTO.UserDTO;
import com.Entity.Pojo.User;
import com.Entity.VO.UserVO;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UsersMapper {

    /**
     * 条件查询所有用户
     * @return
     */
    List<UserVO> getUsers(UserDTO user);

    /**
     * 根据查询用户 启用和禁用用户权限
     * 只有管理员才能选择禁用和启用其他用户
     * TODO 被禁用的用户无法登录系统
     * @param userDTO
     * @return
     */
    Integer updateUser(UserDTO userDTO);

    /**
     * 添加用户
     * @param user
     * @return
     */
    int insertUser(User user);

    /**
     * 删除用户
     * @param id
     * @return
     */
    int deleteUser(String id);

    /**
     * 根据用户id查询用户
     * @param userId
     * @return
     */
    User getuserById(String userId);

    /**
     * 根据账户名查询用户
     * @param userDisplayName
     * @return
     */
    User getUserByDisplayName(String userDisplayName);

    /**
     * 根据用户名查询用户
     * @param userUsername
     * @return
     */
    User getUserByUsername(String userUsername);
}
