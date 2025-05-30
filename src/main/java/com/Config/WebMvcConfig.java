package com.Config;

import com.Interceptor.JwtInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 关键修改：根据配置决定是否注册拦截器
//        if (jwtProperties.getInterceptor().isEnabled()) {
//            registry.addInterceptor(jwtInterceptor)
//                    .addPathPatterns("/api/**")
//                    .excludePathPatterns("/api/login", "/api/register");
//        }
    }
}