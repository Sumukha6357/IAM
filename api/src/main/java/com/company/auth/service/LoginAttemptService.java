package com.company.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 15;
    private static final String KEY_PREFIX = "auth:v1:login-fail:";

    public int getMaxAttempts() {
        return MAX_ATTEMPTS;
    }

    public long getLockDurationMinutes() {
        return LOCK_DURATION_MINUTES;
    }

    public void loginSucceeded(String email) {
        redisTemplate.delete(key(email));
    }

    public void loginFailed(String email) {
        String key = key(email);
        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, Duration.ofMinutes(LOCK_DURATION_MINUTES));
    }

    public boolean isBlocked(String email) {
        String key = key(email);
        Object attempts = redisTemplate.opsForValue().get(key);
        if (attempts != null) {
            try {
                int count = Integer.parseInt(attempts.toString());
                return count >= MAX_ATTEMPTS;
            } catch (NumberFormatException e) {
                return false;
            }
        }
        return false;
    }

    private String key(String email) {
        return KEY_PREFIX + email;
    }
}
