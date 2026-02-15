package com.company.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemStatsResponse {
    private long activeSessions; // Based on refresh tokens
    private long blacklistedTokens;
    private long blockedAttempts;
    private long totalUsers;
}
