'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error.message, error.digest);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#dc2626' }}>Runtime Error</h2>
        <pre style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', textAlign: 'left', overflow: 'auto', fontSize: '0.8rem' }}>
          {error.message}
        </pre>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Digest: {error.digest}</p>
        <button onClick={reset} style={{ marginTop: '1rem', padding: '0.5rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Retry
        </button>
      </body>
    </html>
  );
}
