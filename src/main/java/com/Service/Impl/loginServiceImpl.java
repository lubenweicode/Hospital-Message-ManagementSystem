package com.Service.Impl;

import com.Common.Result;
import com.Entity.Pojo.User;
import com.Mapper.LoginMapper;
import com.Mapper.UsersMapper;
import com.Service.loginService;
import com.Utils.JwtUtils;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import static com.Common.ComUserAuth.*;


@Service
@Slf4j
public class loginServiceImpl implements loginService {

    @Resource
    private LoginMapper loginMapper;
    @Autowired
    private UsersMapper userMapper;

    /**
     * 用户登录
     * @param username
     * @param password
     * @return
     */
    @Override
    public Result login(String username, String password) {
        Result result = new Result();
        // 账户和密码认证
        // 1.用户账户名认证
        if(!validateUsername(username)){
            log.info(MSG_ACCOUNT_NUMBER_INVALID);
            result.setCode(1);
            result.setMsg(MSG_ACCOUNT_NUMBER_INVALID);
            return result;
        }
        // 2.用户密码验证
        if(!validatePassword(password)){
            log.info(MSG_PASSWORD_NUMBER_INVALID);
            result.setCode(1);
            result.setMsg(MSG_PASSWORD_NUMBER_INVALID);
            return result;
        }
        username = md5Encrypt(username);
        password = md5Encrypt(password);
        User flagUser = loginMapper.login(username,password);
        if(flagUser != null){

            String token = JwtUtils.generateToken(username);
            Map<String,Object> map = new HashMap<>();
            map.put("token",token);
            log.info(MSG_LOAD_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_LOAD_SUCCESS);
            result.setData(map);
            return result;
        }else{
            log.info(MSG_LOAD_FAILED);
            result.setCode(0);
            result.setMsg(MSG_LOAD_FAILED);
            return result;
        }
    }

    /**
     * 用户注册
     * @param username
     * @param password
     * @return
     */
    @Override
    public Result register(String username, String password) {
        Result result = new Result();
        // 账户和密码认证
        // 1.用户账户名认证
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
            result.setMsg(MSG_PASSWORD_NUMBER_INVALID);
            return result;
        }
        // -.生成UUID作为账户ID

        // 3.对账户和密码进行MD5加密
        username = md5Encrypt(username);
        password = md5Encrypt(password);

        // 4.需要检查数据库是否有重复用户
        User userDTO = loginMapper.getUserByUsername(username);
        if(userDTO != null){
            // 5.存在,注册失败
            log.info(MSG_REGISTER_EXISTS);
            result.setCode(0);
            result.setMsg(MSG_REGISTER_EXISTS);
            return result;
        }
        // 6.不存在,注册成功
        // loginMapper.register(username,password);

        User user = new User();
        user.setUserUsername(username);
        user.setUserPassword(password);
        Integer f=userMapper.insertUser(user);

        if(f != null){
            log.info(MSG_REGISTER_SUCCESS);
            result.setCode(1);
            result.setMsg(MSG_REGISTER_SUCCESS);
        }else{
            log.info(MSG_REGISTER_FAILED);
            result.setCode(0);
            result.setMsg(MSG_REGISTER_FAILED);
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
