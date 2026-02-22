package com.company.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BootstrapRequest {

    private String tenantName;

    @NotBlank
    @Email
    private String adminEmail;

    @NotBlank
    private String adminPassword;

    private String adminUsername;
}