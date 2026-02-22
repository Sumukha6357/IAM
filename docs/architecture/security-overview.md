# Security Overview

## Password Hashing
- Passwords are hashed with BCrypt via Spring Security PasswordEncoder.
- Stored as passwordHash on User.

## JWT Validation
- JWTs are signed with HS256 using the configured secret.
- JwtAuthenticationFilter extracts Bearer tokens, validates signature and expiration, and sets security context.
- Roles are embedded as claims at token generation.

## Public vs Protected Endpoints
- Public: /auth/register, /auth/login, /auth/refresh, /auth/password/otp, /auth/password/reset.
- Protected: /auth/me, /auth/profile, /auth/change-password, /auth/logout, /auth/system/*.
- API docs endpoints (/v3/api-docs, /swagger-ui/*) are permitted to allow docs generation.

## CORS
- Allowed origins: http://localhost:3000 and http://localhost:3001.
- Allowed methods: GET, POST, PUT, DELETE, OPTIONS.
- Allows credentials and exposes Authorization header.

## Redis Usage
- Refresh tokens stored with TTL under refresh:{token}.
- Blacklisted access tokens stored with TTL under blacklist:{token}.
- Login throttling stored under login_fail:{email}.
- OTP codes stored under otp:{email} with short TTL.

## Assumptions and Limitations
- JWTs are stored in localStorage (susceptible to XSS).
- No CSRF protection (stateless API).
- Audit logs reference users by email, not a foreign key.
- Token blacklist requires Redis; without it, logout revocation is limited.
