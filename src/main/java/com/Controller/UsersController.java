package com.Controller;

import com.Common.Result;
import com.Entity.DTO.UserDTO;
import com.Service.userService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UsersController {

    @Autowired
    private userService userServiceImpl;

    /**
     * 条件查询用户
     * @param userDTO
     * @return
     */
    @PostMapping("/search")
    public Result select(@RequestBody(required = false) UserDTO userDTO) {
        log.info("查询用户,查询条件是:{}", userDTO);
        return userServiceImpl.getUsers(userDTO);
    }

    /**
     * 添加用户
     * @param user
     * @return
     */
    @PostMapping
    public Result insert(@RequestBody UserDTO user) {
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
     * @param userDTO
     * @return
     */
    @PutMapping("/{userId}")
    public Result updateById(@PathVariable String userId,@RequestBody UserDTO userDTO) {
        log.info("修改ID:{} 用户信息,更新为:{}",userId,userDTO);
        return userServiceImpl.updateById(userId,userDTO);
    }

    /**
     * 根据Id查询用户
     * @param userId
     * @return
     */
    @GetMapping("/{userId}")
    public Result getUserById(@PathVariable String userId) {
        log.info("根据Id：{} 查询用户",userId);
        return userServiceImpl.getuserById(userId);
    }
}
