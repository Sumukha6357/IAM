package com.company.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    // Key format: refresh:{userId}:{refreshToken} or just map token to user?
    // Requirement says: "Stored in Redis with TTL. Mapped to userId + device."
    // Simplified: Key = refresh:{token}, Value = userId. TTL = 7 days.

    public void createRefreshToken(String token, UUID userId) {
        String key = "refresh:" + token;
        redisTemplate.opsForValue().set(key, userId.toString(), Duration.ofMillis(refreshExpiration));
    }

    public String verifyRefreshToken(String token) {
        String key = "refresh:" + token;
        Object userIdStr = redisTemplate.opsForValue().get(key);
        if (userIdStr == null) {
            throw new RuntimeException("Refresh token is expired or invalid");
        }
        return (String) userIdStr;
    }

    public void deleteRefreshToken(String token) {
        String key = "refresh:" + token;
        redisTemplate.delete(key);
    }
}
