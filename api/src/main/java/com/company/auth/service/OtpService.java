package com.company.auth.service;

import com.company.auth.repository.TenantRepository;
import com.company.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    private static final long OTP_DURATION_MINUTES = 5;
    private static final String KEY_PREFIX = "auth:v1:";

    public long getOtpDurationMinutes() {
        return OTP_DURATION_MINUTES;
    }

    public String generateOtp(String email) {
        // Generate 6 digit code
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Store in Redis: otp:{email} -> code
        String key = key(email);
        redisTemplate.opsForValue().set(key, otp, Duration.ofMinutes(OTP_DURATION_MINUTES));

        // In real app, send email here.
        // For now, we log it or return it (for testing/demo as requested
        // "mock/email/log").
        System.out.println("OTP for " + email + ": " + otp);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        String key = key(email);
        Object storedOtp = redisTemplate.opsForValue().get(key);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisTemplate.delete(key); // Single use
            return true;
        }
        return false;
    }

    private String key(String email) {
        UUID tenantId = resolveTenantId(email);
        return KEY_PREFIX + tenantId + ":otp:" + email;
    }

    private UUID resolveTenantId(String email) {
        return userRepository.findByEmail(email)
                .map(user -> user.getTenant().getId())
                .orElseGet(() -> tenantRepository.findByIsDefaultTrue()
                        .map(tenant -> tenant.getId())
                        .orElseThrow(() -> new RuntimeException("Default tenant not configured")));
    }
}
