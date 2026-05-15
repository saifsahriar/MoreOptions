import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '24px',
      fontFamily: 'var(--sans)',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: '72px', letterSpacing: '-2px', marginBottom: '8px' }}>404</div>
      <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '12px' }}>Page not found</h1>
      <p style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 24px',
        background: 'var(--accent)',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
      }}>
        ← Back to home
      </Link>
    </div>
  );
}
