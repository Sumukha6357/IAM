package com.company.auth.controller;

import com.company.auth.model.AuditLog;
import com.company.auth.model.BootstrapRequest;
import com.company.auth.model.SystemStatsResponse;
import com.company.auth.repository.UserRepository;
import com.company.auth.service.AuditLogService;
import com.company.auth.service.BootstrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/auth/system")
@RequiredArgsConstructor
public class SystemController {

    private final AuditLogService auditLogService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;
    private final com.company.auth.token.JwtService jwtService;
    private final com.company.auth.service.LoginAttemptService loginAttemptService;
    private final com.company.auth.service.OtpService otpService;
    private final BootstrapService bootstrapService;

    @GetMapping("/stats")
    public ResponseEntity<SystemStatsResponse> getStats() {
        Set<String> refreshTokens = redisTemplate.keys("auth:v1:refresh:*");
        Set<String> blacklistedTokens = redisTemplate.keys("auth:v1:blacklist:*");
        Set<String> blockedAttempts = redisTemplate.keys("auth:v1:login-fail:*");

        long totalUsers = userRepository.count();

        return ResponseEntity.ok(SystemStatsResponse.builder()
                .activeSessions(refreshTokens != null ? refreshTokens.size() : 0)
                .blacklistedTokens(blacklistedTokens != null ? blacklistedTokens.size() : 0)
                .blockedAttempts(blockedAttempts != null ? blockedAttempts.size() : 0)
                .totalUsers(totalUsers)
                .build());
    }

    @GetMapping("/logs")
    public ResponseEntity<List<AuditLog>> getLogs() {
        return ResponseEntity.ok(auditLogService.getLatestLogs());
    }

    @PostMapping("/bootstrap")
    public ResponseEntity<?> bootstrap(@RequestBody @Valid BootstrapRequest request) {
        var user = bootstrapService.bootstrap(
                request.getTenantName(),
                request.getAdminEmail(),
                request.getAdminPassword(),
                request.getAdminUsername()
        );
        return ResponseEntity.ok("Bootstrap complete. Admin user ID: " + user.getId());
    }

    @GetMapping("/features")
    public ResponseEntity<com.company.auth.model.FeatureConfig> getFeatures() {
        return ResponseEntity.ok(com.company.auth.model.FeatureConfig.builder()
                .maxLoginAttempts(loginAttemptService.getMaxAttempts())
                .lockDurationMinutes(loginAttemptService.getLockDurationMinutes())
                .jwtExpirationMs(jwtService.getJwtExpiration())
                .refreshExpirationMs(jwtService.getRefreshExpiration())
                .otpDurationMinutes(otpService.getOtpDurationMinutes())
                .rateLimitEnabled(true)
                .build());
    }
}
