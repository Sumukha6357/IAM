package com.company.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "auth:v1:blacklist:";

    public void blacklistToken(String token, long expirationMillis) {
        if (expirationMillis > 0) {
            String key = key(token);
            redisTemplate.opsForValue().set(key, "revoked", Duration.ofMillis(expirationMillis));
        }
    }

    public boolean isTokenBlacklisted(String token) {
        String key = key(token);
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    private String key(String token) {
        return KEY_PREFIX + token;
    }
}
