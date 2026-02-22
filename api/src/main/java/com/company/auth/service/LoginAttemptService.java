package com.company.auth.service;

import com.company.auth.repository.TenantRepository;
import com.company.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 15;
    private static final String KEY_PREFIX = "auth:v1:";

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
        UUID tenantId = resolveTenantId(email);
        return KEY_PREFIX + tenantId + ":login-fail:" + email;
    }

    private UUID resolveTenantId(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getTenant().getId())
                .orElseGet(() -> tenantRepository.findByIsDefaultTrue()
                        .map(tenant -> tenant.getId())
                        .orElseThrow(() -> new RuntimeException("Default tenant not configured")));
    }
}
