'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, FeatureConfig } from '@/lib/api';

interface DocSection {
    title: string;
    content: string;
}

interface DocData {
    title: string;
    description: string;
    sections: DocSection[];
    codeSnippet?: string;
}

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [config, setConfig] = useState<FeatureConfig | null>(null);

    useEffect(() => {
        api.getFeatures()
            .then(setConfig)
            .catch(err => console.error("Failed to load docs config", err));
    }, []);

    const jwtExpMins = config ? Math.round(config.jwtExpirationMs / 60000) : 15;
    const refreshExpDays = config ? Math.round(config.refreshExpirationMs / 86400000) : 7;

    const featureData: Record<string, DocData> = {
        'jwt': {
            title: 'JWT Authentication',
            description: 'Stateless JSON Web Tokens (JWT) are the backbone of IAM Lite authentication. They provide a secure, scalable way to handle user sessions without server-side state.',
            sections: [
                { title: 'How it works', content: `Upon successful login, a short-lived Access Token (${jwtExpMins} min) and a long-lived Refresh Token (${refreshExpDays} days) are issued. Access tokens must be included in the Authorization header of every API request.` },
                { title: 'Security Measures', content: 'Tokens are signed using RSA-256. Access tokens are stored in memory for XSS protection, while Refresh tokens are stored in HTTP-Only cookies to prevent theft.' }
            ],
            codeSnippet: `// Authorization Header Example
Authorization: Bearer <your_access_token>

// Payload Structure
{
  "sub": "user@example.com",
  "role": "ADMIN",
  "iat": 1700000000,
  "exp": ${config ? (1700000000 + (config.jwtExpirationMs / 1000)) : 1700000900}
}`
        },
        'refresh': {
            title: 'Token Refresh Rotation',
            description: 'Our advanced rotation mechanism prevents token replay attacks. Reusing an old refresh token immediately invalidates all related tokens.',
            sections: [
                { title: 'Rotation Logic', content: 'Every time a refresh token is used, it is deleted and replaced by a new one. This ensures that if a token is stolen, it can only be used once effectively.' }
            ]
        },
        'blacklist': {
            title: 'Token Blacklisting',
            description: 'Immediate session revocation is achieved through a Redis-backed blacklist. When a user logs out, their token is cryptographically invalidated until expiration.',
            sections: [
                { title: 'Logout Flow', content: ' The /auth/logout endpoint extracts the JTI (JWT ID) and expiration time, caching them in Redis. The security filter checks this cache on every request.' }
            ],
            codeSnippet: `// Check if token is blacklisted
if (redis.exists("blacklist:" + token)) {
    throw new SecurityException("Token Revoked");
}`
        },
        'rate-limiting': {
            title: 'Smart Rate Limiting',
            description: 'Protect your API from abuse and Brute-Force attacks with our adaptive rate limiting engine.',
            sections: [
                { title: 'Default Policies', content: `By default, we allow 100 requests per minute per IP for public endpoints. Login endpoints are stricter (${config?.maxLoginAttempts || 5} attempts per ${config?.lockDurationMinutes || 15} min).` },
                { title: 'Headers', content: 'We exclude standard RateLimit headers (Limit, Remaining, Reset) to help clients adjust their traffic.' }
            ],
            codeSnippet: `# Rate Limit Configuration (yaml)
iam:
  security:
    ratelimit:
      enabled: ${config?.rateLimitEnabled ?? true}
      default-bucket: 100
      login-bucket: ${config?.maxLoginAttempts || 5}
      duration: ${config?.lockDurationMinutes || 15}m`
        },
        'saml': {
            title: 'SAML 2.0 SSO',
            description: 'Enterprise-grade Single Sign-On (SSO) support allows integration with providers like Okta, Azure AD, and Google Workspace.',
            sections: [
                { title: 'Metadata Exchange', content: 'IAM Lite acts as a Service Provider (SP). You must import our XML metadata into your IdP to establish trust.' },
                { title: 'Attribute Mapping', content: 'We automatically map standard claims (email, firstName, lastName) from SAML assertions to local user profiles.' }
            ],
            codeSnippet: `<!-- SAML SP Metadata Snippet -->
<md:EntityDescriptor entityID="https://iam-lite.com/saml/metadata">
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:AssertionConsumerService Location="https://api.iam-lite.com/login/saml2/sso/idp" />
  </md:SPSSODescriptor>
</md:EntityDescriptor>`
        },
        'rbac': {
            title: 'Role-Based Access Control',
            description: 'Fine-grained permission management ensures users access only what strictly necessary.',
            sections: [
                { title: 'Roles', content: 'USER (Default access), ADMIN (User management, System logs), AUDITOR (Read-only logs).' }
            ]
        }
    };

    const data = featureData[slug] || {
        title: 'Feature Documentation',
        description: 'Detailed documentation for this feature is being authored.',
        sections: [],
        codeSnippet: `// Coming Soon`
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <nav className="glass-effect sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <span className="text-2xl font-bold gradient-text">IAM Lite</span>
                </Link>
                <button onClick={() => router.back()} className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    ← Back
                </button>
            </nav>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="card-premium p-10 mb-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                            Technical Spec
                        </span>
                        <span className="text-gray-400 text-sm">v4.2.0</span>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">{data.title}</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        {data.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {data.sections.map((section, idx) => (
                            <div key={idx} className="card-premium p-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        {data.codeSnippet && (
                            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                                <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
                                    <span className="text-xs font-mono text-gray-400">Configuration</span>
                                    <div className="flex space-x-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                    </div>
                                </div>
                                <div className="p-4 overflow-x-auto">
                                    <pre className="font-mono text-sm text-blue-300 leading-relaxed">
                                        {data.codeSnippet}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <div className="card-premium p-6">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Need help?</h4>
                            <p className="text-sm text-gray-500 mb-4">Our security engineers are available for enterprise support.</p>
                            <Link href="/contact" className="text-blue-600 text-sm font-semibold hover:underline">Contact Support →</Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
