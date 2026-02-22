package com.company.auth.controller;

import com.company.auth.model.*;
import com.company.auth.security.UserDetailsImpl;
import com.company.auth.service.AuditLogService;
import com.company.auth.service.LoginAttemptService;
import com.company.auth.service.OtpService;
import com.company.auth.service.RefreshTokenService;
import com.company.auth.service.TokenBlacklistService;
import com.company.auth.service.UserService;
import com.company.auth.token.JwtService;
import com.company.auth.repository.TenantRepository;
import com.company.auth.model.Tenant;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.UUID;
import com.company.auth.security.TenantContextHolder;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final TokenBlacklistService tokenBlacklistService;
    private final OtpService otpService;
    private final LoginAttemptService loginAttemptService;
    private final AuditLogService auditLogService;
    private final TenantRepository tenantRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request, HttpServletRequest httpRequest) {
        User user = userService.registerUser(request.getEmail(), request.getPassword(), request.getRole(), request.getTenantId());
        auditLogService.log(request.getEmail(), "REGISTER", "User registered successfully",
                httpRequest.getRemoteAddr(), userAgent(httpRequest), user.getTenant().getId(), user.getId());
        return ResponseEntity.ok("User registered successfully via IAM Lite. ID: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request, HttpServletRequest httpRequest) {
        if (loginAttemptService.isBlocked(request.getEmail())) {
            auditLogService.log(request.getEmail(), "FAILED_LOGIN", "Account blocked due to too many attempts",
                    httpRequest.getRemoteAddr(), userAgent(httpRequest), resolveTenantId(request.getEmail()), null);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body("Account locked due to too many failed attempts. Try again later.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            loginAttemptService.loginSucceeded(request.getEmail());
        auditLogService.log(request.getEmail(), "LOGIN", "Successful login", httpRequest.getRemoteAddr(),
                userAgent(httpRequest), resolveTenantId(request.getEmail()), resolveUserId(request.getEmail()));
        } catch (BadCredentialsException e) {
            loginAttemptService.loginFailed(request.getEmail());
            auditLogService.log(request.getEmail(), "FAILED_LOGIN", "Invalid credentials", httpRequest.getRemoteAddr(),
                    userAgent(httpRequest), resolveTenantId(request.getEmail()), null);
            throw e; // Let global handler or default mechanism handle it (returns 401/403)
        }

        User user = userService.findByEmail(request.getEmail());
        final UserDetails userDetails = new UserDetailsImpl(user);
        final String accessToken = jwtService.generateToken(userDetails);
        final String refreshToken = jwtService.generateRefreshToken(userDetails);

        refreshTokenService.createRefreshToken(refreshToken, user.getId(), deviceId(httpRequest));

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(900)
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody @Valid RefreshTokenRequest request, HttpServletRequest httpRequest) {
        String requestRefreshToken = request.getRefreshToken();
        String userIdStr = refreshTokenService.verifyRefreshToken(requestRefreshToken);

        User user = userService.findById(UUID.fromString(userIdStr));
        final UserDetails userDetails = new UserDetailsImpl(user);

        String newAccessToken = jwtService.generateToken(userDetails);
        String newRefreshToken = jwtService.generateRefreshToken(userDetails);

        refreshTokenService.deleteRefreshToken(requestRefreshToken);
        refreshTokenService.createRefreshToken(newRefreshToken, user.getId(), deviceId(httpRequest));

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(900)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Missing Authorization header");
        }
        final String jwt = authHeader.substring(7);
        String userEmail = jwtService.extractUsername(jwt);

        try {
            java.util.Date expiration = jwtService.extractExpiration(jwt);
            long ttl = expiration.getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                tokenBlacklistService.blacklistToken(jwt, ttl);
                auditLogService.log(userEmail, "LOGOUT", "User logged out successfully", request.getRemoteAddr(),
                        userAgent(request), resolveTenantId(userEmail), resolveUserId(userEmail));
            }
        } catch (Exception e) {
            // Ignore token error during logout
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/password/otp")
    public ResponseEntity<?> requestOtp(@RequestBody @Valid PasswordResetRequest request) {
        // In production, verify user exists first to prevent enumeration, but return
        // same message.
        // Or if strictly internal, throw error.
        // We'll generate OTP regardless if email is valid format, but only send if user
        // exists.
        // For simplicity here:
        try {
            userService.findByEmail(request.getEmail());
            String otp = otpService.generateOtp(request.getEmail());
            // Return OTP for demo/testing convenience as per typical dev setups,
            // but in PROD this should be "OTP sent to email".
            return ResponseEntity.ok("OTP Generated (Demo): " + otp);
        } catch (RuntimeException e) {
            // User not found
            return ResponseEntity.ok("If account exists, OTP sent.");
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody @Valid PasswordResetConfirmRequest request,
            HttpServletRequest httpRequest) {
        boolean valid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (!valid) {
            auditLogService.log(request.getEmail(), "FAILED_PASSWORD_RESET", "Invalid OTP",
                    httpRequest.getRemoteAddr(), userAgent(httpRequest), resolveTenantId(request.getEmail()), null);
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        userService.updatePassword(request.getEmail(), request.getNewPassword());
        auditLogService.log(request.getEmail(), "PASSWORD_RESET", "Password reset successfully via OTP",
                httpRequest.getRemoteAddr(), userAgent(httpRequest), resolveTenantId(request.getEmail()),
                resolveUserId(request.getEmail()));
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequest request, Principal principal,
            HttpServletRequest httpRequest) {
        String email = principal.getName();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(email, request.getOldPassword()));
        } catch (BadCredentialsException e) {
            auditLogService.log(email, "FAILED_PASSWORD_CHANGE", "Invalid old password", httpRequest.getRemoteAddr(),
                    userAgent(httpRequest), resolveTenantId(email), resolveUserId(email));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password");
        }

        userService.updatePasswordInTenant(email, request.getNewPassword());
        auditLogService.log(email, "PASSWORD_CHANGE", "Password changed successfully", httpRequest.getRemoteAddr(),
                userAgent(httpRequest), resolveTenantId(email), resolveUserId(email));
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Principal principal) {
        User user = userService.findByEmailInTenant(principal.getName());
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .tenantId(user.getTenant().getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .photoUrl(user.getPhotoUrl())
                .role(user.getRole().getName())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build());
    }

    @org.springframework.web.bind.annotation.PatchMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody UpdateProfileRequest request, Principal principal) {
        User user = userService.updateProfile(principal.getName(), request.getUsername(), request.getPhotoUrl());
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .tenantId(user.getTenant().getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .photoUrl(user.getPhotoUrl())
                .role(user.getRole().getName())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .build());
    }

    private String userAgent(HttpServletRequest request) {
        return request.getHeader("User-Agent");
    }

    private String deviceId(HttpServletRequest request) {
        return request.getHeader("X-Device-Id");
    }

    private java.util.UUID resolveTenantId(String email) {
        UUID tenantFromContext = TenantContextHolder.getTenantId();
        if (tenantFromContext != null) {
            return tenantFromContext;
        }
        try {
            return userService.findByEmail(email).getTenant().getId();
        } catch (RuntimeException e) {
            return tenantRepository.findByIsDefaultTrue()
                    .map(Tenant::getId)
                    .orElseThrow(() -> new RuntimeException("Default tenant not configured"));
        }
    }

    private java.util.UUID resolveUserId(String email) {
        try {
            return userService.findByEmail(email).getId();
        } catch (RuntimeException e) {
            return null;
        }
    }
}
