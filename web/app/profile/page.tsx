'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, User } from '@/lib/api';
import { AuthManager } from '@/lib/auth';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ username: '', photoUrl: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await api.getMe();
                setUser(userData);
                setFormData({ username: userData.username || '', photoUrl: userData.photoUrl || '' });
            } catch (error) {
                console.error('Failed to load profile:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleLogout = async () => {
        try {
            await api.logout();
            AuthManager.clearTokens();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedUser = await api.updateProfile(formData);
            setUser(updatedUser);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            // Optionally add toast notification here
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const initials = (user.username || user.email).substring(0, 2).toUpperCase();
    const displayName = user.username || user.email;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                        ← Dashboard
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                {/* Identity Card */}
                <div className="card-premium p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
                    <div className="relative group shrink-0 mx-auto md:mx-0">
                        {user.photoUrl ? (
                            <img src={user.photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-gray-50 dark:ring-gray-800" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg shrink-0 ring-4 ring-gray-50 dark:ring-gray-800">
                                {initials}
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-text transition-colors">
                                <span className="text-white text-xs font-bold">Paste URL below</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-2">
                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="Display Name"
                                            className="text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-blue-500 focus:outline-none placeholder-gray-500/50 w-full max-w-md py-1"
                                            autoFocus
                                        />
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate py-1">{displayName}</h1>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                )}
                                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-1">{user.email}</p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold text-sm transition-colors">
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-semibold text-sm transition-colors" disabled={saving}>
                                            Cancel
                                        </button>
                                        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm transition-colors shadow-lg shadow-blue-500/30" disabled={saving}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="my-6 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Profile Photo URL</label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">🔗</span>
                                        </div>
                                        <input
                                            id="photo-input"
                                            type="text"
                                            value={formData.photoUrl}
                                            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                            placeholder="https://example.com/avatar.jpg"
                                            className="w-full pl-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Paste a direct link to an image (JPG, PNG, GIF).</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Role</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{user.role}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Member Since</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/security" className="card-premium p-6 hover:border-blue-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">🛡️</span>
                            <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security Settings</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Update your password, manage active sessions, and review recent activity.</p>
                    </Link>

                    <Link href="/delete-account" className="card-premium p-6 hover:border-red-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">⚠️</span>
                            <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Danger Zone</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}
