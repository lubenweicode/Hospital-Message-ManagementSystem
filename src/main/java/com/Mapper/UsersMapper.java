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
    Integer updateUser(@Param("userId") String userId, @Param("user") UserDTO userDTO);

    /**
     * 添加用户
     * @param user
     * @return
     */
    @Insert("INSERT INTO users (user_displayName,user_username,user_password, user_private,user_status) VALUES (#{userDisplayName},#{userUsername},#{userPassword},#{userPrivate},#{userStatus})")
    int insertUser(User user);

    /**
     * 删除用户
     * @param id
     * @return
     */
    @Delete("DELETE FROM users WHERE user_id = #{id}")
    int deleteUser(String id);

    @Select("select * from users where user_id=#{userId}")
    User getuserById(String userId);

    @Select("select * from users where user_displayName=#{userDisplayName}")
    User getUserByDisplayName(String userDisplayName);

    @Select("select * from users where user_username=#{userUsername}")
    User getUserByUsername(String userUsername);
}
