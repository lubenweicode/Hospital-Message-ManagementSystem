package com.Service.Impl;

import com.Common.Result;
import com.Entity.DTO.UserDTO;
import com.Entity.Pojo.User;
import com.Entity.VO.UserVO;
import com.Mapper.LoginMapper;
import com.Mapper.UsersMapper;
import com.Service.userService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import static com.Common.ComUserAuth.*;

@Service
@Slf4j
public class userServiceImpl implements userService {

    @Autowired
    private UsersMapper userMapper;
    @Autowired
    private LoginMapper loginMapper;

    /**
     * 根据ID删除用户
     * @param id
     * @return
     */
    @Override
    public Result deleteById(String id) {
        Result result = new Result();
        Integer flag = userMapper.deleteUser(id);
        if(flag > 0){
            log.info(MSG_DELETE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_DELETE_SUCCESS);
        }else{
            log.info(MSG_DELETE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_DELETE_FAILED);
        }
        return result;
    }

    /**
     * 条件查询所有用户
     * @return
     */
    @Override
    public Result getUsers(UserDTO userDTO) {
        Result result = new Result();
        List<UserVO> userList = userMapper.getUsers(userDTO);
        result.setData(userList);
        if(userList != null && !userList.isEmpty()){
            log.info(MSG_SELECT_USER_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_USER_SUCCESS);// 查询成功
        }else{
            log.info(MSG_SELECT_USER_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_USER_FAILED);// 查询为空
        }
        return result;
    }

    /**
     * 添加用户
     * @param userDTO
     * @return
     */
    @Override
    public Result insertUser(UserDTO userDTO) {
        Result result = new Result();
        String username = userDTO.getUserUsername();
        String password = userDTO.getUserPassword();
        // 这里需要对添加的用户的账户和密码进行合法性匹配
        if(!validateUsername(username)){
            log.info(MSG_ACCOUNT_NUMBER_INVALID);
            result.setCode(0);
            result.setMsg(MSG_ACCOUNT_NUMBER_INVALID);
            return result;
        }
        // 2.用户密码验证
        if(!validatePassword(password)){
            log.info(MSG_PASSWORD_NUMBER_INVALID);
            result.setCode(0);
            result.setMsg(MSG_ACCOUNT_NUMBER_INVALID);
            return result;
        }
        // -.生成UUID作为账户ID

        // 3.对账户和密码进行MD5加密
        username = md5Encrypt(username);
        password = md5Encrypt(password);

        // 4.需要检查数据库是否有重复用户
        User user1 = loginMapper.getUserByUsername(username);
        if(user1 != null){
            // 5.存在,注册失败
            log.info(MSG_REGISTER_EXISTS);
            result.setCode(1);
            result.setMsg(MSG_REGISTER_EXISTS);
            return result;
        }
        User user = new User();
        user.setUserUsername(username);
        user.setUserPassword(password);

        BeanUtils.copyProperties(userDTO, user);
        int flag1 = userMapper.insertUser(user);
        if(flag1 > 0){
            log.info(MSG_INSERT_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_INSERT_SUCCESS);// 添加成功
        }else{
            log.info(MSG_INSERT_FAILED);
            result.setCode(0);
            result.setMsg(MSG_INSERT_FAILED);// 添加失败
        }
        return result;
    }

    /**
     * 修改用户
     * 账户名和用户名不可重名
     * @param userDTO
     * @param id
     * @return
     */
    @Override
    public Result updateById(String id,UserDTO userDTO) {
        Result result = new Result();

        User originalUser = userMapper.getuserById(id);

        // 检验自身是否发生过变化,有则检验是否重名
        if(!originalUser.getUserDisplayName().equals(userDTO.getUserDisplayName())){
            User user1 = userMapper.getUserByDisplayName(userDTO.getUserDisplayName());
            if(user1==null){
                // 没有重名
                log.info("没有重复账户名:{}", userDTO.getUserDisplayName());
            }else{
                log.info(MSG_UPDATE_FAILED);
                result.setCode(0);
                result.setMsg(MSG_UPDATE_FAILED);
                return result;
            }
        }


        String username = userDTO.getUserUsername();
        username = md5Encrypt(username);

        // 检验自身是否发生过变化,有则检验是否重名
        if(!originalUser.getUserUsername().equals(username)){
            User flag2 = userMapper.getUserByUsername(username);
            if(flag2 == null){
                // 没有重复用户号
                log.info("没有重复用户号:{}", userDTO.getUserUsername());
            }else{
                log.info(MSG_UPDATE_FAILED);
                result.setCode(0);
                result.setMsg(MSG_UPDATE_FAILED);
                return result;
            }
        }


        String password = md5Encrypt(userDTO.getUserPassword());
        userDTO.setUserUsername(username);
        userDTO.setUserPassword(password);

        userDTO.setUserId(id);
        Integer flag = userMapper.updateUser(userDTO);
        if(flag > 0){
            log.info(MSG_UPDATE_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_SUCCESS);
        }else{
            log.info(MSG_UPDATE_FAILED);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_FAILED);
        }
        return result;
    }

    /**
     * 根据Id查询用户
     * @param userId
     * @return
     */
    @Override
    public Result getuserById(String userId) {
        Result result = new Result();
        User user = userMapper.getuserById(userId);
        if(user != null){
            log.info(MSG_SELECT_USER_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_SELECT_USER_SUCCESS);
            result.setData(user);
        }else{
            log.info(MSG_SELECT_USER_FAILED);
            result.setCode(0);
            result.setMsg(MSG_SELECT_USER_FAILED);
            result.setData(user);
        }
        return result;
    }

    /**
     * 账户名验证
     * 4-20 位字母或数字
     * @param username
     * @return
     */
    public static boolean validateUsername(String username) {
        String regex = "^[a-zA-Z0-9]{4,20}$";
        return username.matches(regex);
    }

    /**
     * 密码验证
     * （至少 8 个字符，包含字母和数字）
     * @param password
     * @return
     */
    public static boolean validatePassword(String password) {
        String regex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
        return password.matches(regex);
    }

    /**
     * MD5加密
     * @param input
     * @return
     */
    public static String md5Encrypt(String input) {
        try {
            // 获取MD5摘要实例
            MessageDigest md = MessageDigest.getInstance("MD5");

            // 计算哈希值
            byte[] hashBytes = md.digest(input.getBytes());

            // 将字节数组转换为十六进制字符串
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = String.format("%02x", b);
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            // 处理不支持MD5算法的情况
            throw new RuntimeException("MD5算法不可用", e);
        }
    }
}
