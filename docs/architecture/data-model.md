# Data Model

## Entities and Tables
- User (table: users)
  - Purpose: Core identity record with email, password hash, role, status, and profile fields.
  - Fields: id (UUID), email (unique), username, photoUrl, passwordHash, role, isActive, createdAt.
- AuditLog (table: audit_logs)
  - Purpose: Security/audit trail of auth events.
  - Fields: id (UUID), email, action, details, ipAddress, timestamp.

## Relationships
- No explicit JPA relationships are defined between entities.
- AuditLog references a user by email only (no foreign key).

## Repositories
- UserRepository: lookup by email; existence checks.
- AuditLogRepository: latest logs; query logs by email with pagination.

## Roles / RBAC
- Role enum exists with USER and ADMIN.
- Role is stored on User and used in JWT claims.
