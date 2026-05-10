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
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#1e40af' }}>Something went wrong</h1>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>{error.message}</p>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '1.5rem' }}>
          Digest: {error.digest}
        </p>
        <button
          onClick={reset}
          style={{ padding: '0.5rem 1.5rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
