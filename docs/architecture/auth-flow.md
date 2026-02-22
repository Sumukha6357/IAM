# Auth Flow

## Endpoints (OpenAPI)
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- POST /auth/password/otp
- POST /auth/password/reset
- POST /auth/change-password
- GET /auth/me
- PATCH /auth/profile
- GET /auth/system/stats
- GET /auth/system/logs
- GET /auth/system/features

## Register Flow
- Client sends email, password, role to /auth/register.
- API validates and creates a User record with hashed password and role.
- Audit log entry is recorded for registration.

## Login Flow
- Client sends email and password to /auth/login.
- API checks login attempt throttling (Redis-backed).
- If credentials are valid, API issues access and refresh JWTs.
- Refresh token is stored in Redis with TTL; audit log entry is recorded.

## Token Generation and Storage
- Access token and refresh token are JWTs signed with the configured secret.
- Access token includes roles in claims.
- Refresh tokens are stored in Redis as refresh:{token} -> userId with TTL.
- Access tokens are stored in browser localStorage by the frontend.

## Authenticated Requests
- Frontend attaches Authorization: Bearer <accessToken> for protected API calls.
- Backend validates JWT signature and expiration per request.

## Logout Behavior
- Client calls /auth/logout with Authorization header.
- API extracts token, computes remaining TTL, and blacklists it in Redis.
- Audit log entry is recorded for logout.

## Token Expiry and Refresh
- Access token expiry is configured in application.yml (default 15 minutes).
- Refresh token expiry is configured in application.yml (default 7 days).
- Frontend checks expiry in localStorage and calls /auth/refresh when needed.
- Refresh rotates tokens: old refresh token is deleted, new one stored.
