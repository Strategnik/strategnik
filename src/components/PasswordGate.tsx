import { useState, type ReactNode } from 'react';

const HASH = '120c37';

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16).slice(0, 6);
}

// Pre-compute: simpleHash('GTMvroom!') = '120c37'
export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('gtm_auth') === HASH;
    }
    return false;
  });
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (simpleHash(pw) === HASH) {
      sessionStorage.setItem('gtm_auth', HASH);
      setUnlocked(true);
    } else {
      setError(true);
      setPw('');
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    <div className="not-italic" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111113' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 360, width: '100%', padding: '0 24px' }}>
        <p className="text-xs tracking-wide mb-4 not-italic" style={{ color: '#494950', letterSpacing: '0.1em' }}>
          GTM SYSTEMS ARCHITECTURE
        </p>
        <h1 className="text-2xl font-bold text-white mb-6 not-italic" style={{ letterSpacing: '-0.02em' }}>
          Enter password to continue
        </h1>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false); }}
          placeholder="Password"
          autoFocus
          className="not-italic"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#18181b',
            border: `1px solid ${error ? '#ef4444' : '#313135'}`,
            borderRadius: 6,
            color: '#afafb6',
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            marginBottom: 8,
          }}
        />
        {error && (
          <p className="not-italic" style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>
            Incorrect password. Try again.
          </p>
        )}
        <button
          type="submit"
          className="not-italic"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#1de2c4',
            color: '#111113',
            border: 'none',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.04em',
          }}
        >
          UNLOCK
        </button>
      </form>
    </div>
  );
}
