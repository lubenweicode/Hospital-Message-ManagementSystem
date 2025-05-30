package com.Controller;

import com.Common.Result;
import com.Entity.DTO.UserDTO;
import com.Entity.Pojo.User;
import com.Service.userService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/user")
@Slf4j
public class UsersController {

    @Autowired
    private userService userServiceImpl;

    /**
     * 条件查询用户
     * @param userDTO
     * @return
     */
    @GetMapping
    public Result select(@RequestBody UserDTO userDTO) {
        log.info("查询用户,查询条件是:{}", userDTO);
        return userServiceImpl.getUsers(userDTO);
    }

    /**
     * 添加用户
     * @param user
     * @return
     */
    @PostMapping
    public Result insert(@RequestBody User user) {
        log.info("添加用户,用户信息是:{}", user);
        return userServiceImpl.insertUser(user);
    }

    /**
     * 根据ID删除用户
     * @param userId
     * @return
     */
    @DeleteMapping("/{userId}")
    public Result deleteById(@PathVariable String userId) {
        log.info("根据ID:{} 删除用户",userId);
        return userServiceImpl.deleteById(userId);
    }

    /**
     * 根据ID更改用户
     * @param userId
     * @param user
     * @return
     */
    @PutMapping("/{userId}")
    public Result updateById(@PathVariable String userId,@RequestBody User user) {
        log.info("修改ID:{} 用户信息,更新为:{}",userId,user);
        return userServiceImpl.updateById(userId,user);
    }
}
