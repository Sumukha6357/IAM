package com.company.auth.service;

import com.company.auth.model.User;
import com.company.auth.repository.RoleRepository;
import com.company.auth.repository.TenantRepository;
import com.company.auth.repository.UserRepository;
import com.company.auth.security.TenantContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final TenantRepository tenantRepository;

    @Transactional
    public User registerUser(String email, String password, String roleName, UUID tenantId) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User already exists with email: " + email);
        }

        String resolvedRoleName = (roleName == null || roleName.isBlank()) ? "USER" : roleName.trim().toUpperCase();
        var role = roleRepository.findByName(resolvedRoleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + resolvedRoleName));

        var tenant = tenantId != null
                ? tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId))
                : tenantRepository.findByIsDefaultTrue()
                .orElseThrow(() -> new RuntimeException("Default tenant not configured"));

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role)
                .tenant(tenant)
                .isActive(true)
                .build();

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByEmailInTenant(String email) {
        UUID tenantId = TenantContextHolder.getRequiredTenantId();
        return userRepository.findByEmailAndTenantId(email, tenantId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findById(java.util.UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User findByIdInTenant(UUID id) {
        UUID tenantId = TenantContextHolder.getRequiredTenantId();
        return userRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void updatePassword(String email, String newPassword) {
        User user = findByEmail(email);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void updatePasswordInTenant(String email, String newPassword) {
        User user = findByEmailInTenant(email);
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public User updateProfile(String email, String username, String photoUrl) {
        User user = findByEmailInTenant(email);
        if (username != null && !username.isBlank()) {
            user.setUsername(username);
        }
        if (photoUrl != null && !photoUrl.isBlank()) {
            user.setPhotoUrl(photoUrl);
        }
        return userRepository.save(user);
    }
}
