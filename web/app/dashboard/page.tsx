'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { api, User, AuditLog, SystemStats } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [stats, setStats] = useState<SystemStats | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await AuthManager.refreshTokenIfNeeded();
            if (!isAuth) {
                router.push('/login');
                return;
            }
            try {
                const [userData, statsData, logsData] = await Promise.all([
                    api.getMe(),
                    api.getStats(),
                    api.getLogs()
                ]);
                setUser(userData);
                setStats(statsData);
                setLogs(logsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();

        // Refresh stats/logs every 30 seconds
        const interval = setInterval(async () => {
            try {
                const [s, l] = await Promise.all([api.getStats(), api.getLogs()]);
                setStats(s);
                setLogs(l);
            } catch (e) {
                console.error('Auto-refresh failed:', e);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [router]);

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            AuthManager.clearTokens();
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Securing session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Top Navigation */}
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                    <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-mono">v3.0</span>
                </Link>

                <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.email}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-bold bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white border border-red-200 dark:border-red-900/50 rounded-lg transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
                {/* Hero section */}
                <div className="mb-12">
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            Welcome back, <span className="gradient-text">Member</span>
                        </h1>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-md">
                            {user?.role}
                        </span>
                    </div>
                    <p className="text-gray-500 text-lg">Your identity and access management console is active.</p>
                </div>

                {/* Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Active Sessions', value: stats?.activeSessions || 0, color: 'text-green-500', icon: '🌐' },
                        { label: 'Revoked Tokens', value: stats?.blacklistedTokens || 0, color: 'text-red-500', icon: '🚫' },
                        { label: 'Blocked Attacks', value: stats?.blockedAttempts || 0, color: 'text-orange-500', icon: '🛡️' },
                        { label: 'Total IAM Users', value: stats?.totalUsers || 0, color: 'text-blue-500', icon: '👥' }
                    ].map((stat, i) => (
                        <div key={i} className="card-premium p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className={`text-xs font-bold uppercase tracking-widest ${stat.color}`}>LIVE</span>
                            </div>
                            <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Security Audit Log */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                <span className="mr-2">📋</span> Security Audit Log
                            </h2>
                            <span className="text-xs text-gray-500">Auto-refreshing...</span>
                        </div>
                        <div className="card-premium overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                            <th className="px-6 py-4">Event</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">IP Address</th>
                                            <th className="px-6 py-4">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.action === 'LOGIN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        log.action === 'FAILED_LOGIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 font-medium">{log.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono tracking-tighter">{log.ipAddress}</td>
                                                <td className="px-6 py-4 text-sm text-gray-400">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {logs.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-gray-400">No events recorded yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Features & Settings Column */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <span className="mr-2">⚙️</span> Quick Management
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { title: 'Security Overview', desc: 'MFA & encryption status', icon: '🛡️', path: '/security' },
                                    { title: 'API Management', desc: 'Keys and rate limiting', icon: '🔑', path: '/docs/rate-limiting' },
                                    { title: 'Identity Config', desc: 'LDAP & SAML settings', icon: '🚀', path: '/docs/saml' }
                                ].map((feature, i) => (
                                    <Link key={i} href={feature.path} className="card-premium p-4 flex items-center space-x-4 hover:translate-x-1 transition-transform group">
                                        <span className="text-2xl">{feature.icon}</span>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{feature.title}</p>
                                            <p className="text-xs text-gray-500">{feature.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <span className="mr-2">👤</span> Personalization
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { title: 'My Profile', desc: 'Update contact info', icon: '👤', path: '/profile' },
                                    { title: 'Access History', desc: 'Review session logs', icon: '⏳', path: '#' },
                                    { title: 'Terminate Account', desc: 'Secure data deletion', icon: '⚠️', path: '/delete-account', danger: true }
                                ].map((setting, i) => (
                                    <Link key={i} href={setting.path} className="card-premium p-4 flex items-center space-x-4 hover:translate-x-1 transition-transform group">
                                        <span className="text-2xl">{setting.icon}</span>
                                        <div className="flex-1">
                                            <p className={`font-bold ${setting.danger ? 'text-red-500' : 'text-gray-800 dark:text-white'} group-hover:opacity-70 transition-opacity`}>{setting.title}</p>
                                            <p className="text-xs text-gray-500">{setting.desc}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Support Card */}
                        <div className="card-premium p-6 bg-blue-600 dark:bg-blue-700 text-white border-none">
                            <h3 className="text-lg font-bold mb-2 flex items-center">
                                <span className="mr-2">💡</span> Professional Support
                            </h3>
                            <p className="text-blue-100 text-sm mb-6">Need expert assistance with high-availability IAM setups?</p>
                            <Link
                                href="/contact"
                                className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors block text-center"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-gray-100 dark:border-gray-800 py-8 px-6 text-center text-gray-500 text-sm">
                &copy; 2026 IAM Lite. Enterprise Identity Management.
            </footer>
        </div>
    );
}
