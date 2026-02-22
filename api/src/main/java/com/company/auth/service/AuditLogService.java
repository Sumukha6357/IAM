package com.company.auth.service;

import com.company.auth.model.AuditLog;
import com.company.auth.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(String email, String action, String details, String ipAddress, String userAgent, java.util.UUID tenantId, java.util.UUID actorUserId) {
        AuditLog log = AuditLog.builder()
                .email(email)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .tenantId(tenantId)
                .actorUserId(actorUserId)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLog> getLatestLogs() {
        return auditLogRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
