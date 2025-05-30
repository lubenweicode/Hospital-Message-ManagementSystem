package com.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // 允许的前端域名（可写 "*" 表示所有，开发环境使用，生产环境需指定具体域名）
        config.addAllowedOriginPattern("http://127.0.0.1:*"); // 允许 127.0.0.1 的所有端口
        config.addAllowedOriginPattern("http://localhost:*"); // 允许 localhost 的所有端口
        config.addAllowedMethod("*"); // 允许所有请求方法（GET/POST/PUT 等）
        config.addAllowedHeader("*"); // 允许所有请求头
        config.setAllowCredentials(true); // 允许携带 Cookie

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 对所有接口生效
        return new CorsFilter(source);
    }
}