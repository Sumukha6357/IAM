'use client';

import Link from 'next/link';

export default function DeleteAccountPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                </Link>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600">Back</Link>
            </nav>
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 text-center">
                <div className="card-premium p-12 border-red-100 dark:border-red-900/30">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
                        ⚠️
                    </div>
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Account Deletion</h1>
                    <p className="text-gray-500 mb-8">This action is irreversible. For security reasons, account deletion requests must be initiated through our support console to prevent unauthorized data loss.</p>
                    <Link href="/contact" className="inline-block px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors">
                        Request Deletion via Support
                    </Link>
                </div>
            </main>
        </div>
    );
}
