'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <div style={{ fontFamily: 'var(--serif)', fontSize: '48px', letterSpacing: '-2px', marginBottom: '8px' }}>Oops</div>
      <h1 style={{ fontSize: '24px', fontWeight: 500, marginBottom: '12px' }}>Something went wrong</h1>
      <p style={{ fontSize: '15px', color: 'var(--text2)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
        We ran into an unexpected error. Please try again.
      </p>
      <button
        onClick={() => reset()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 24px',
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
