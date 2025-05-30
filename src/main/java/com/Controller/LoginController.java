package com.Controller;
import com.Common.Result;
import com.Entity.Pojo.User;
import com.Service.loginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class LoginController {

    @Autowired
    private loginService loginService;

    @PostMapping("/login")
    public Result login(@RequestParam String username, @RequestParam String password) {
        log.info("load username : {} password : {}", username, password);
        return loginService.login(username,password);
    }

    @PostMapping("/register")
    public Result register(@RequestParam String username, @RequestParam String password) {
        log.info("register username : {} password : {}", username, password);
        return loginService.register(username,password);
    }

    @GetMapping("/test")
    public Result test() {
        log.info("test");
        return Result.success();
    }
}
