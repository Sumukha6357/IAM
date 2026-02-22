const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirmRequest {
    email: string;
    otp: string;
    newPassword: string;
}

export interface User {
    id: string;
    email: string;
    username?: string;
    photoUrl?: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
}

export interface UpdateProfileRequest {
    username?: string;
    photoUrl?: string;
}

// ... existing interfaces ...

// ... existing interfaces ...
export interface AuditLog {
    id: string;
    email: string;
    action: string;
    details: string;
    ipAddress: string;
    timestamp: string;
}

export interface SystemStats {
    activeSessions: number;
    blacklistedTokens: number;
    blockedAttempts: number;
    totalUsers: number;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface FeatureConfig {
    maxLoginAttempts: number;
    lockDurationMinutes: number;
    jwtExpirationMs: number;
    refreshExpirationMs: number;
    otpDurationMinutes: number;
    rateLimitEnabled: boolean;
}

class ApiService {
    private getHeaders(includeAuth = false): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    async register(data: RegisterRequest): Promise<string> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }

        return response.text();
    }

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        return response.json();
    }

    async refresh(refreshToken: string): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        return response.json();
    }

    async logout(): Promise<void> {
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: this.getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    }

    async requestOtp(data: PasswordResetRequest): Promise<string> {
        const response = await fetch(`${API_URL}/auth/password/otp`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('OTP request failed');
        }

        return response.text();
    }

    async resetPassword(data: PasswordResetConfirmRequest): Promise<string> {
        const response = await fetch(`${API_URL}/auth/password/reset`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Password reset failed');
        }

        return response.text();
    }

    async getMe(): Promise<User> {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        return response.json();
    }

    async getStats(): Promise<SystemStats> {
        const response = await fetch(`${API_URL}/auth/system/stats`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch system stats');
        }

        return response.json();
    }

    async getLogs(): Promise<AuditLog[]> {
        const response = await fetch(`${API_URL}/auth/system/logs`, {
            method: 'GET',
            headers: this.getHeaders(true),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch audit logs');
        }

        return response.json();
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: this.getHeaders(true),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to change password');
        }
    }

    async updateProfile(data: UpdateProfileRequest): Promise<User> {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'PATCH',
            headers: this.getHeaders(true),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    }

    async getFeatures(): Promise<FeatureConfig> {
        try {
            const response = await fetch(`${API_URL}/auth/system/features`, {
                method: 'GET',
                headers: this.getHeaders(false),
            });

            if (!response.ok) {
                console.warn('Failed to fetch feature config, using defaults');
                throw new Error('Fallback to defaults');
            }

            return response.json();
        } catch {
            return {
                maxLoginAttempts: 5,
                lockDurationMinutes: 15,
                jwtExpirationMs: 900000,
                refreshExpirationMs: 604800000,
                otpDurationMinutes: 5,
                rateLimitEnabled: true
            };
        }
    }
}

export const api = new ApiService();
