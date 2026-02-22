package com.company.auth.service;

import com.company.auth.model.UserSession;
import com.company.auth.repository.UserRepository;
import com.company.auth.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserSessionRepository userSessionRepository;
    private final UserRepository userRepository;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    // Key format: auth:v1:refresh:{token} -> userId. TTL = refreshExpiration.
    private static final String KEY_PREFIX = "auth:v1:refresh:";

    public void createRefreshToken(String token, UUID userId, String deviceId) {
        String key = key(token);
        redisTemplate.opsForValue().set(key, userId.toString(), Duration.ofMillis(refreshExpiration));

        UserSession session = UserSession.builder()
                .user(userRepository.getReferenceById(userId))
                .deviceId(deviceId)
                .refreshTokenHash(hashToken(token))
                .revoked(false)
                .lastUsedAt(LocalDateTime.now())
                .build();
        userSessionRepository.save(session);
    }

    public String verifyRefreshToken(String token) {
        String key = key(token);
        Object userIdStr = redisTemplate.opsForValue().get(key);
        if (userIdStr == null) {
            throw new RuntimeException("Refresh token is expired or invalid");
        }
        String tokenHash = hashToken(token);
        userSessionRepository.findByRefreshTokenHashAndRevokedFalse(tokenHash)
                .map(session -> {
                    session.setLastUsedAt(LocalDateTime.now());
                    return userSessionRepository.save(session);
                })
                .orElseThrow(() -> new RuntimeException("Refresh token session is revoked or missing"));
        return (String) userIdStr;
    }

    public void deleteRefreshToken(String token) {
        String key = key(token);
        redisTemplate.delete(key);
        String tokenHash = hashToken(token);
        userSessionRepository.findByRefreshTokenHashAndRevokedFalse(tokenHash)
                .ifPresent(session -> {
                    session.setRevoked(true);
                    session.setRevokedAt(LocalDateTime.now());
                    userSessionRepository.save(session);
                });
    }

    private String key(String token) {
        return KEY_PREFIX + token;
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
