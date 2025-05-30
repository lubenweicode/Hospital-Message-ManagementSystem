package com.Service.Impl;

import com.Common.Result;
import com.Mapper.LoginMapper;
import com.Mapper.UsersMapper;
import com.Entity.DTO.UserDTO;
import com.Entity.Pojo.User;
import com.Entity.VO.UserVO;
import com.Service.userService;
import lombok.extern.slf4j.Slf4j;
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
            log.info("删除成功,id:{}", id);
            result.setCode(1);
            result.setMsg(MSG_DELETE_SUCCESS);
        }else{
            log.info("删除失败,id:{}", id);
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
            log.info("查询成功,userDTO:{}", userDTO);
            result.setMsg(MSG_OPERATION_SUCCESS);// 查询成功
        }else{
            log.info("查询为空,userDTO:{}", userDTO);
            result.setMsg(MSG_NOT_FOUND);// 查询为空
        }
        return result;
    }

    /**
     * 添加用户
     * @param user
     * @return
     */
    @Override
    public Result insertUser(User user) {
        Result result = new Result();
        String username = user.getUserUsername();
        String password = user.getUserPassword();
        // 这里需要对添加的用户的账户和密码进行合法性匹配
        if(!validateUsername(username)){
            log.info("账户号格式不正确,username:{}", username);
            result.setCode(1);
            result.setMsg(MSG_ACCOUNT_NUMBER_INVALID);
            return result;
        }
        // 2.用户密码验证
        if(!validatePassword(password)){
            log.info("密码格式不正确,password:{}", password);
            result.setCode(1);
            result.setMsg(MSG_ACCOUNT_NUMBER_INVALID);
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
            log.info("该用户名已经有人注册,username:{}", username);
            result.setCode(1);
            result.setMsg(MSG_REGISTER_EXISTS);
            return result;
        }

        user.setUserUsername(username);
        user.setUserPassword(password);

        Integer flag1 = userMapper.insertUser(user);
        if(flag1 > 0){
            log.info("添加用户成功,username:{}", username);
            result.setCode(1);
            result.setMsg(MSG_INSERT_SUCCESS);// 添加成功
        }else{
            log.info("添加用户失败,username:{}", username);
            result.setCode(1);
            result.setMsg(MSG_INSERT_FAILED);// 添加失败
        }
        return result;
    }

    /**
     * 修改用户
     * @param user
     * @return
     */
    @Override
    public Result updateById(String id,User user) {
        Result result = new Result();
        Integer flag = userMapper.updateUser(id,user);
        if(flag > 0){
            log.info("修改用户成功,id:{}", id);
            result.setCode(1);
            result.setMsg(MSG_UPDATE_SUCCESS);
        }else{
            log.info("修改用户失败,id:{}", id);
            result.setCode(0);
            result.setMsg(MSG_UPDATE_FAILED);
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
