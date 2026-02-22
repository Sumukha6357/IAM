-- Core seed data

INSERT INTO tenants (id, name, is_default)
VALUES ('00000000-0000-0000-0000-000000000001', 'default', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (id, name, description)
VALUES (1, 'ADMIN', 'System administrator')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (id, name, description)
VALUES (2, 'USER', 'Standard user')
ON CONFLICT (name) DO NOTHING;

INSERT INTO permissions (id, code, description)
VALUES (1, 'AUTH_MANAGE', 'Full access to authentication and authorization')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
VALUES (
    (SELECT id FROM roles WHERE name = 'ADMIN'),
    (SELECT id FROM permissions WHERE code = 'AUTH_MANAGE')
)
ON CONFLICT DO NOTHING;

INSERT INTO users (id, tenant_id, email, username, password_hash, role_id, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000100',
    (SELECT id FROM tenants WHERE name = 'default'),
    'admin@local',
    'admin',
    '{bcrypt}$2a$10$REPLACE_WITH_REAL_HASH',
    (SELECT id FROM roles WHERE name = 'ADMIN'),
    true
)
ON CONFLICT (email) DO NOTHING;