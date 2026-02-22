package com.company.auth.service;

import com.company.auth.security.TenantContextHolder;
import com.company.auth.token.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JwtService jwtService;

    private static final String KEY_PREFIX = "auth:v1:";

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
        UUID tenantId = resolveTenantId(token);
        return KEY_PREFIX + tenantId + ":blacklist:" + token;
    }

    private UUID resolveTenantId(String token) {
        try {
            String tenantId = jwtService.extractTenantId(token);
            if (tenantId != null && !tenantId.isBlank()) {
                return UUID.fromString(tenantId);
            }
        } catch (Exception ignored) {
        }
        UUID tenantFromContext = TenantContextHolder.getTenantId();
        if (tenantFromContext != null) {
            return tenantFromContext;
        }
        throw new RuntimeException("Tenant context is missing");
    }
}
