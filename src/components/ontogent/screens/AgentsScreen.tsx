import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const STATS = [
  { label: 'Live agents',    value: '6',     color: 'var(--ok)' },
  { label: 'Reads 24h',      value: '1,757', color: 'var(--text)' },
  { label: 'p50 latency',    value: '42ms',  color: 'var(--info)' },
  { label: 'Cache hit rate',  value: '94%',   color: 'var(--accent)' },
];

interface Agent {
  name: string;
  icon: string;
  reads: string;
  hitsPerDay: string;
  p50: string;
  status: 'live' | 'paused' | 'drifting';
}

const AGENTS: Agent[] = [
  { name: 'content-gen',     icon: '\u270D', reads: '412',  hitsPerDay: '38',  p50: '34ms',  status: 'live' },
  { name: 'email-drafter',   icon: '\u2709', reads: '287',  hitsPerDay: '24',  p50: '28ms',  status: 'live' },
  { name: 'support-bot',     icon: '\u2699', reads: '531',  hitsPerDay: '67',  p50: '52ms',  status: 'drifting' },
  { name: 'ad-copy-engine',  icon: '\u25B6', reads: '198',  hitsPerDay: '19',  p50: '45ms',  status: 'live' },
  { name: 'social-poster',   icon: '\u2302', reads: '176',  hitsPerDay: '22',  p50: '31ms',  status: 'live' },
  { name: 'blog-writer',     icon: '\u2261', reads: '153',  hitsPerDay: '14',  p50: '61ms',  status: 'paused' },
];

const STATUS_PILL: Record<string, string> = {
  live: 'pill--ok',
  paused: 'pill--staging',
  drifting: 'pill--drift',
};

interface ApiKey {
  label: string;
  prefix: string;
  permissions: string;
  lastUsed: string;
}

const API_KEYS: ApiKey[] = [
  { label: 'Production',     prefix: 'ak_prod_7x***',    permissions: 'read / write',  lastUsed: '2m ago' },
  { label: 'Staging',        prefix: 'ak_staging_3x***',  permissions: 'read only',     lastUsed: '4h ago' },
  { label: 'CI / Automation', prefix: 'ak_ci_9f***',      permissions: 'read / write',  lastUsed: '18m ago' },
];

const CURL_EXAMPLE = `curl -X GET https://api.ontogent.io/v1/specs/voice-spec \\
  -H "Authorization: Bearer ak_prod_7x..." \\
  -H "Accept: application/yaml"

# Response: 200 OK
# Content-Type: application/yaml
# X-Ontogent-Version: v3.1.2
# X-Cache: HIT`;

/* ── Component ──────────────────────────────────────────────────────── */

export default function AgentsScreen() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  function handleCopy(prefix: string) {
    setCopiedKey(prefix);
    setTimeout(() => setCopiedKey(null), 1500);
  }

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="t-h1">Agents & API</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            Fleet status, keys, and integration
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--ghost">Register agent</button>
          <button className="btn btn--primary">Generate key</button>
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {STATS.map((s) => (
          <div className="panel" style={{ padding: '16px 20px', textAlign: 'center' }} key={s.label}>
            <div className="t-num" style={{ fontSize: 24, color: s.color }}>{s.value}</div>
            <div className="t-label" style={{ marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Agent list */}
      <div style={{ marginBottom: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>Fleet</div>
        <div className="panel" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 36 }} />
                <th>Agent</th>
                <th>Reads</th>
                <th>Hits/d</th>
                <th>p50</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {AGENTS.map((a) => (
                <tr key={a.name}>
                  <td style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-3)' }}>{a.icon}</td>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--text)' }}>{a.name}</span>
                  </td>
                  <td>
                    <span className="t-num" style={{ fontSize: 12 }}>{a.reads}</span>
                  </td>
                  <td>
                    <span className="t-num" style={{ fontSize: 12, color: 'var(--text-3)' }}>{a.hitsPerDay}</span>
                  </td>
                  <td>
                    <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.p50}</span>
                  </td>
                  <td>
                    <span className={`pill ${STATUS_PILL[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Keys */}
      <div style={{ marginBottom: 24 }}>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>API Keys</div>
        <div className="panel" style={{ overflow: 'hidden' }}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Label</th>
                <th>Key prefix</th>
                <th>Permissions</th>
                <th>Last used</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {API_KEYS.map((k) => (
                <tr key={k.prefix}>
                  <td>
                    <span style={{ fontWeight: 500, color: 'var(--text)' }}>{k.label}</span>
                  </td>
                  <td>
                    <span className="t-code" style={{ fontSize: 11, color: 'var(--text-2)' }}>{k.prefix}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{k.permissions}</span>
                  </td>
                  <td>
                    <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{k.lastUsed}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn--sm btn--ghost"
                      onClick={() => handleCopy(k.prefix)}
                    >
                      {copiedKey === k.prefix ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quickstart */}
      <div>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>Quickstart</div>
        <div
          className="panel"
          style={{
            padding: 20,
            fontFamily: "'JetBrains Mono','SF Mono','Menlo',monospace",
            fontSize: 12,
            lineHeight: 1.7,
            color: 'var(--text-2)',
            whiteSpace: 'pre',
            overflow: 'auto',
          }}
        >
          {CURL_EXAMPLE}
        </div>
      </div>
    </div>
  );
}
