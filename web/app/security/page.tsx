'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, SystemStats } from '@/lib/api';
import { AuthManager } from '@/lib/auth';

export default function SecurityPage() {
    const router = useRouter();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await AuthManager.refreshTokenIfNeeded();
            if (!isAuth) {
                router.push('/login');
                return;
            }
            try {
                const s = await api.getStats();
                setStats(s);
            } catch (e) {
                console.error('Failed to fetch stats', e);
            }
        };
        checkAuth();
    }, [router]);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.changePassword({ oldPassword, newPassword });
            setMessage('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const [ip, setIp] = useState('Loading...');

    useEffect(() => {
        setIp('127.0.0.1 (Local)');
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                </Link>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    ← Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h1>
                    <p className="text-gray-500">Manage your account security and active sessions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Active Sessions Card */}
                    <div className="card-premium p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <span className="mr-2">🌐</span> Active Sessions
                            </h2>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded uppercase">
                                Secure
                            </span>
                        </div>
                        <div className="text-center py-8">
                            <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                                {stats?.activeSessions || 1}
                            </div>
                            <p className="text-sm text-gray-500">Active sessions across all devices</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400">
                            <p className="mb-2"><strong>Current Session:</strong></p>
                            <p className="font-mono text-xs">IP: {ip}</p>
                            <p className="font-mono text-xs">Device: Web Browser</p>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="card-premium p-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="mr-2">🔑</span> Change Password
                        </h2>

                        {message && (
                            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-lg">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="input-field"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full mt-2"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
