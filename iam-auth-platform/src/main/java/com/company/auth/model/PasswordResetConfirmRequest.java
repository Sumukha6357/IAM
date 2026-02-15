package com.company.auth.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordResetConfirmRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String otp;

    @NotBlank
    @Size(min = 6)
    private String newPassword;
}
