package com.company.auth.repository;

import com.company.auth.model.AuditLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findTop10ByOrderByTimestampDesc();

    List<AuditLog> findByEmailOrderByTimestampDesc(String email, Pageable pageable);
}
