# Redis Key Strategy

## Goals
- Namespaced keys to avoid collisions across services.
- Versioned keys to allow safe format changes.
- Predictable patterns for operational visibility.

## Global Prefix
All keys for this service use:
- `auth:v1:`

If a breaking change is required, increment the version segment (e.g., `auth:v2:`) and run dual-read or migration logic as needed.

## Key Patterns
- Login lockouts: `auth:v1:{tenantId}:login-fail:{email}`
- Refresh tokens: `auth:v1:{tenantId}:refresh:{token}`
- Blacklisted access tokens: `auth:v1:{tenantId}:blacklist:{token}`
- One-time passwords: `auth:v1:{tenantId}:otp:{email}`

## Rules
- Never store PII in the key beyond existing identifiers already used by the service.
- Always include the version segment (`v1`, `v2`, ...).
- Prefer short, stable identifiers (UUIDs) over long values.
- If a device identifier is available, pass it via the `X-Device-Id` header so the service can record it in `user_sessions`.
- All TTL-managed keys must set an explicit expiration.
- Do not use `KEYS` in production for large keyspaces; prefer `SCAN` in operational tooling.
