package com.Properties;

import com.fasterxml.jackson.core.JsonFactory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

//@Data
//@Component
//@ConfigurationProperties(prefix = "jwt.interceptor") // 直接绑定到 interceptor 层级
//@AllArgsConstructor
//@NoArgsConstructor
//public class JwtProperties {
//    private boolean enabled;
//    private String secretKey;
//    private long expiration;
//}