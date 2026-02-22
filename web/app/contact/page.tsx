'use client';

import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* Navigation */}
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                    <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded font-mono">v3.0</span>
                </Link>
                <Link href="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    Back to Dashboard
                </Link>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        We&apos;re here to <span className="gradient-text">help</span>
                    </h1>
                    <p className="text-gray-500 text-xl">Get in touch with our security and support experts.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Support Channels */}
                    <div className="space-y-6">
                        <div className="card-premium p-8">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">
                                📧
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Technical Support</h3>
                            <p className="text-gray-500 text-sm mb-4">For integration queries and technical issues.</p>
                            <a href="mailto:support@iam-lite.io" className="text-blue-600 font-semibold hover:underline">support@iam-lite.io</a>
                        </div>

                        <div className="card-premium p-8">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-2xl mb-6">
                                🛡️
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security Reporting</h3>
                            <p className="text-gray-500 text-sm mb-4">Urgent reports regarding system vulnerabilities.</p>
                            <a href="mailto:security@iam-lite.io" className="text-purple-600 font-semibold hover:underline">security@iam-lite.io</a>
                        </div>
                    </div>

                    {/* FAQ Quick Links */}
                    <div className="card-premium p-8 bg-linear-to-br from-blue-600/5 to-purple-600/5">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Common Questions</h3>
                        <div className="space-y-6">
                            {[
                                { q: 'How do I reset my API keys?', a: 'Visit the security tab in your profile settings.' },
                                { q: 'What is the token expiration?', a: 'Default JWTs expire in 15 minutes, refresh tokens in 7 days.' },
                                { q: 'Is MFA supported?', a: 'Yes, we support TOTP and Email-based OTP flows.' },
                                { q: 'How to rotate secrets?', a: 'Use our CLI tool `iam-rotate` for secure secret rotation.' }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <p className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 transition-colors mb-1">{item.q}</p>
                                    <p className="text-sm text-gray-500">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-16 p-8 rounded-3xl bg-gray-900 text-white text-center shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-4">Enterprise Grade Support</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Need a dedicated account manager? Our enterprise plan offers 99.9% uptime SLA and 1-hour response times.
                        </p>
                        <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                            Upgrade to Enterprise
                        </button>
                    </div>
                </div>
            </main>

            <footer className="mt-auto px-6 py-8 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-400">© 2026 IAM Lite. All rights reserved.</p>
            </footer>
        </div>
    );
}
