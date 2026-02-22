import { api, AuthResponse } from './api';

export class AuthManager {
    private static TOKEN_KEY = 'accessToken';
    private static REFRESH_KEY = 'refreshToken';
    private static EXPIRY_KEY = 'tokenExpiry';

    static saveTokens(authResponse: AuthResponse): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(this.TOKEN_KEY, authResponse.accessToken);
        localStorage.setItem(this.REFRESH_KEY, authResponse.refreshToken);

        const expiryTime = Date.now() + authResponse.expiresIn * 1000;
        localStorage.setItem(this.EXPIRY_KEY, expiryTime.toString());
    }

    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.REFRESH_KEY);
    }

    static isTokenExpired(): boolean {
        if (typeof window === 'undefined') return true;

        const expiry = localStorage.getItem(this.EXPIRY_KEY);
        if (!expiry) return true;

        return Date.now() > parseInt(expiry);
    }

    static async refreshTokenIfNeeded(): Promise<boolean> {
        if (!this.isTokenExpired()) return true;

        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await api.refresh(refreshToken);
            this.saveTokens(response);
            return true;
        } catch {
            this.clearTokens();
            return false;
        }
    }

    static clearTokens(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_KEY);
        localStorage.removeItem(this.EXPIRY_KEY);
    }

    static isAuthenticated(): boolean {
        return !!this.getAccessToken() && !this.isTokenExpired();
    }
}
