package com.Mapper;

import com.Entity.Pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface LoginMapper {

    @Select("SELECT * from users where user_username=#{userName} and user_password=#{userPassword}")
    public User login(String userName, String userPassword);

    @Insert(("INSERT INTO users (user_username,user_password) values (#{userName},#{userPassword})"))
    public Integer register(String userName, String userPassword);

    @Select("SELECT * from users where user_username=#{userName}")
    User getUserByUsername(String userName);
}
