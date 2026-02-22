package com.company.auth.repository;

import com.company.auth.model.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TenantRepository extends JpaRepository<Tenant, UUID> {
    Optional<Tenant> findByName(String name);

    Optional<Tenant> findByIsDefaultTrue();
}