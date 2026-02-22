package com.company.auth.service;

import com.company.auth.model.Permission;
import com.company.auth.model.Role;
import com.company.auth.model.Tenant;
import com.company.auth.model.User;
import com.company.auth.repository.PermissionRepository;
import com.company.auth.repository.RoleRepository;
import com.company.auth.repository.TenantRepository;
import com.company.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class BootstrapService {

    private static final String DEFAULT_TENANT = "default";
    private static final String ADMIN_ROLE = "ADMIN";
    private static final String USER_ROLE = "USER";
    private static final String PERM_AUTH_MANAGE = "AUTH_MANAGE";

    private final TenantRepository tenantRepository;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User bootstrap(String tenantName, String adminEmail, String adminPassword, String adminUsername) {
        Tenant tenant = ensureTenant(tenantName);
        Permission managePermission = ensurePermission(PERM_AUTH_MANAGE, "Full access to authentication and authorization");
        Role adminRole = ensureRole(ADMIN_ROLE, "System administrator", managePermission);
        ensureRole(USER_ROLE, "Standard user", null);

        return userRepository.findByEmail(adminEmail)
                .orElseGet(() -> userRepository.save(User.builder()
                        .tenant(tenant)
                        .email(adminEmail)
                        .username(adminUsername != null ? adminUsername : "admin")
                        .passwordHash(passwordEncoder.encode(adminPassword))
                        .role(adminRole)
                        .isActive(true)
                        .build()));
    }

    private Tenant ensureTenant(String tenantName) {
        String name = (tenantName == null || tenantName.isBlank()) ? DEFAULT_TENANT : tenantName.trim();
        return tenantRepository.findByName(name)
                .orElseGet(() -> tenantRepository.save(Tenant.builder()
                        .name(name)
                        .isDefault(true)
                        .build()));
    }

    private Role ensureRole(String roleName, String description, Permission permission) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role role = Role.builder()
                            .name(roleName)
                            .description(description)
                            .permissions(new HashSet<>())
                            .build();
                    if (permission != null) {
                        role.getPermissions().add(permission);
                    }
                    return roleRepository.save(role);
                });
    }

    private Permission ensurePermission(String code, String description) {
        return permissionRepository.findByCode(code)
                .orElseGet(() -> permissionRepository.save(Permission.builder()
                        .code(code)
                        .description(description)
                        .build()));
    }
}