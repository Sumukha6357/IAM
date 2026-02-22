package com.company.auth.security;

import java.util.UUID;

public final class TenantContextHolder {

    private static final ThreadLocal<UUID> TENANT_ID = new ThreadLocal<>();

    private TenantContextHolder() {
    }

    public static void setTenantId(UUID tenantId) {
        TENANT_ID.set(tenantId);
    }

    public static UUID getTenantId() {
        return TENANT_ID.get();
    }

    public static UUID getRequiredTenantId() {
        UUID tenantId = TENANT_ID.get();
        if (tenantId == null) {
            throw new IllegalStateException("Tenant context is missing");
        }
        return tenantId;
    }

    public static void clear() {
        TENANT_ID.remove();
    }
}