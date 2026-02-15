import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            IAM Lite <span style={{ fontSize: '12px', backgroundColor: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>v3.0 CLEAN</span>
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" style={{ padding: '8px 16px', textDecoration: 'none', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
              Sign In
            </Link>
            <Link href="/register" style={{ padding: '8px 16px', textDecoration: 'none', color: 'white', background: 'linear-gradient(to right, #2563eb, #9333ea)', borderRadius: '6px' }}>
              Get Started
            </Link>
          </div>
        </header>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>
            Secure Authentication
          </h2>
          <h3 style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(to right, #2563eb, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '24px' }}>
            Made Simple
          </h3>
          <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '700px', margin: '0 auto 40px' }}>
            Enterprise-grade authentication platform with JWT, Redis-backed token management, and modern security features.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ padding: '16px 40px', fontSize: '18px', textDecoration: 'none', color: 'white', background: 'linear-gradient(to right, #2563eb, #9333ea)', borderRadius: '8px', fontWeight: '600' }}>
              Get Started Free
            </Link>
            <Link href="/login" style={{ padding: '16px 40px', fontSize: '18px', textDecoration: 'none', color: '#374151', border: '2px solid #e5e7eb', borderRadius: '8px', fontWeight: '600', backgroundColor: 'white' }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {[
            { icon: '🔐', title: 'JWT Authentication', desc: 'Secure stateless token-based authentication' },
            { icon: '🔄', title: 'Token Refresh', desc: 'Automatic token rotation with 7-day expiry' },
            { icon: '🛡️', title: 'RBAC', desc: 'Granular role-based access control' },
            { icon: '🔑', title: 'Password Reset', desc: 'Secure OTP-based password recovery' },
            { icon: '🚫', title: 'Token Blacklist', desc: 'Redis-backed secure logout mechanism' },
            { icon: '⚡', title: 'High Performance', desc: 'Optimized with Redis caching layer' },
          ].map((feature, idx) => (
            <div key={idx} style={{ padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{feature.title}</h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Built With
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Spring Boot', 'Next.js', 'PostgreSQL', 'Redis', 'JWT', 'TypeScript'].map((tech) => (
              <span key={tech} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid #e5e7eb', marginTop: '60px', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            © 2026 IAM Lite. Enterprise Authentication Platform.
          </p>
        </footer>
      </div>
    </div>
  );
}
