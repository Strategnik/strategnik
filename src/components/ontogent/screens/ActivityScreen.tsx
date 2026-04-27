import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

interface ActivityEvent {
  id: string;
  time: string;
  kind: string;
  icon: string;
  sev: 'ok' | 'info' | 'staging' | 'review' | 'drift' | 'err';
  actor: string;
  message: string;
}

const EVENTS: ActivityEvent[] = [
  { id: 'e1',  time: '12:44:02', kind: 'publish', icon: '\u25B2', sev: 'ok',      actor: 'ci-bot',       message: 'voice-spec.yaml v3.1.2 published to prod' },
  { id: 'e2',  time: '12:43:18', kind: 'gate',    icon: '\u25C6', sev: 'staging',  actor: 'governance',   message: 'Gate CI-schema passed for voice-spec.yaml' },
  { id: 'e3',  time: '12:42:55', kind: 'stage',   icon: '\u25CF', sev: 'staging',  actor: 'n.talbert',    message: 'voice-spec.yaml staged for review' },
  { id: 'e4',  time: '12:38:11', kind: 'drift',   icon: '\u26A0', sev: 'drift',    actor: 'drift-engine', message: 'support-bot exceeded tolerance \u0394 0.31 on tone axis' },
  { id: 'e5',  time: '12:35:47', kind: 'read',    icon: '\u25CB', sev: 'info',     actor: 'content-gen',  message: 'Read icp-buyer.yaml \u2192 campaign brief context' },
  { id: 'e6',  time: '12:31:22', kind: 'review',  icon: '\u270E', sev: 'review',   actor: 'j.martinez',   message: 'Approved positioning.yaml v2.4.0 changes' },
  { id: 'e7',  time: '12:28:09', kind: 'reject',  icon: '\u2716', sev: 'err',      actor: 'governance',   message: 'Rejected cadence-rules.yaml \u2014 missing required field: max_frequency' },
  { id: 'e8',  time: '12:24:33', kind: 'rotate',  icon: '\u21BB', sev: 'info',     actor: 'key-mgr',      message: 'API key ak_prod_7x rotated, old key expires in 24h' },
  { id: 'e9',  time: '12:19:01', kind: 'audit',   icon: '\u2610', sev: 'ok',       actor: 'audit-daemon', message: 'Nightly audit sweep: 0 anomalies, 74 nodes verified' },
  { id: 'e10', time: '12:14:46', kind: 'publish', icon: '\u25B2', sev: 'ok',       actor: 'ci-bot',       message: 'forbidden-lexicon.yaml v1.8.0 published to prod' },
  { id: 'e11', time: '12:10:22', kind: 'stage',   icon: '\u25CF', sev: 'staging',  actor: 'n.talbert',    message: 'icp-buyer.yaml staged \u2014 added enterprise segment' },
  { id: 'e12', time: '12:05:58', kind: 'gate',    icon: '\u25C6', sev: 'staging',  actor: 'governance',   message: 'Gate CI-drift passed for positioning.yaml' },
];

const STATS: { label: string; value: number; color: string }[] = [
  { label: 'publishes', value: 14, color: 'var(--ok)' },
  { label: 'stages',    value: 9,  color: 'var(--staging)' },
  { label: 'gates',     value: 22, color: 'var(--staging)' },
  { label: 'reviews',   value: 6,  color: 'var(--review)' },
  { label: 'drifts',    value: 3,  color: 'var(--drift)' },
  { label: 'rejects',   value: 1,  color: 'var(--err)' },
];

const SEV_BORDER: Record<string, string> = {
  ok:      'var(--ok)',
  info:    'var(--info)',
  staging: 'var(--staging)',
  review:  'var(--review)',
  drift:   'var(--drift)',
  err:     'var(--err)',
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function ActivityScreen() {
  const [filter, setFilter] = useState('');

  const filtered = EVENTS.filter(
    (e) =>
      e.message.toLowerCase().includes(filter.toLowerCase()) ||
      e.kind.toLowerCase().includes(filter.toLowerCase()) ||
      e.actor.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="t-h1">Activity</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            Live event feed &middot; last 24 h
          </p>
        </div>
        <button className="btn btn--ghost">Export log</button>
      </div>

      {/* Stats strip */}
      <div
        className="panel"
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRight: i < STATS.length - 1 ? '1px solid var(--line)' : 'none',
              textAlign: 'center',
            }}
          >
            <div className="t-num" style={{ fontSize: 20, color: s.color }}>{s.value}</div>
            <div className="t-label" style={{ marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <input
        className="input"
        placeholder="Filter events..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />

      {/* Event list */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        {filtered.map((evt) => (
          <div
            key={evt.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              borderBottom: '1px solid var(--line)',
              borderLeft: `3px solid ${SEV_BORDER[evt.sev]}`,
            }}
          >
            {/* Time */}
            <span className="t-code" style={{ fontSize: 11, color: 'var(--text-4)', width: 62, flexShrink: 0 }}>
              {evt.time}
            </span>

            {/* Kind icon */}
            <span style={{ width: 20, textAlign: 'center', fontSize: 13, color: SEV_BORDER[evt.sev], flexShrink: 0 }}>
              {evt.icon}
            </span>

            {/* Kind pill */}
            <span
              className={`pill pill--${evt.sev === 'ok' ? 'ok' : evt.sev === 'info' ? 'info' : evt.sev === 'staging' ? 'staging' : evt.sev === 'review' ? 'review' : evt.sev === 'drift' ? 'drift' : 'err'}`}
              style={{ fontSize: 9.5, flexShrink: 0 }}
            >
              {evt.kind}
            </span>

            {/* Message */}
            <span style={{ flex: 1, fontSize: 12, color: 'var(--text-2)' }}>{evt.message}</span>

            {/* Actor */}
            <span className="t-mono" style={{ fontSize: 10.5, color: 'var(--text-3)', flexShrink: 0 }}>
              {evt.actor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
