package com.example.demo.config;

import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
@Getter
public class JwtConfig {
    
    @Value("${jwt.secret:MySecretKeyForJWTTokenGeneration12345678901234567890}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}") // 24시간
    private long expiration;
    
    public SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
