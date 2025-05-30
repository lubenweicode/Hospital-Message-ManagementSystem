package com.Utils;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

import static com.Common.Key.*;

@Component
public class JwtUtils {
    private static final String SECRET_KEY = COMMON_JWT_KEY; // 密钥，生产环境应从配置文件读取
    private static final long EXPIRATION_TIME = COMMON_EXPIRATION_TIME ; // 24小时

    // 生成 JWT
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // 解析 JWT
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    // 验证 JWT
    public static boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException |
                 SignatureException | IllegalArgumentException e) {
            return false;
        }
    }

    // 从 Token 中获取用户名
    public static String getUsernameFromToken(String token) {
        return parseToken(token).getSubject();
    }
}