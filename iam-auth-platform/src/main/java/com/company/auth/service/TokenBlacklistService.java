package com.company.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void blacklistToken(String token, long expirationMillis) {
        if (expirationMillis > 0) {
            String key = "blacklist:" + token;
            redisTemplate.opsForValue().set(key, "revoked", Duration.ofMillis(expirationMillis));
        }
    }

    public boolean isTokenBlacklisted(String token) {
        String key = "blacklist:" + token;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
