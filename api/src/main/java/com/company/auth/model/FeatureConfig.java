package com.company.auth.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeatureConfig {
    private int maxLoginAttempts;
    private long lockDurationMinutes;
    private long jwtExpirationMs;
    private long refreshExpirationMs;
    private long otpDurationMinutes;
    private boolean rateLimitEnabled; // Hardcoded true for now as per "PLATINUM" type
}
