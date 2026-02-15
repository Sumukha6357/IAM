'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.login({ email, password });

            if (response.accessToken) {
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('refreshToken', response.refreshToken);
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>
                            IAM Lite
                        </h1>
                    </Link>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>Welcome Back</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Sign in to continue to your account</p>
                </div>

                {/* Form Card */}
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '10px 40px 10px 12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '14px' }}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <Link href="/forgot-password" style={{ fontSize: '14px', color: '#3b82f6', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{ padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '14px', color: '#dc2626', margin: 0 }}>{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'transform 0.2s' }}
                            onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
                            onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div style={{ marginTop: '24px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                            Don't have an account?{' '}
                            <Link href="/register" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link href="/" style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'none' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
