import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const STATS = [
  { label: 'Total releases', value: '47',     color: 'var(--text)' },
  { label: 'Live',           value: '12',     color: 'var(--ok)' },
  { label: 'In flight',      value: '3',      color: 'var(--staging)' },
  { label: 'Avg interval',   value: '2.1d',   color: 'var(--info)' },
];

interface Release {
  version: string;
  file: string;
  when: string;
  who: string;
  status: 'live' | 'staged' | 'review' | 'superseded';
  changes: number;
  note: string;
}

const RELEASES: Release[] = [
  { version: 'v3.1.2', file: 'voice-spec.yaml',       when: '2h ago',  who: 'n.talbert',   status: 'live',       changes: 4,  note: 'Warmth + urgency axis rebalance' },
  { version: 'v2.4.0', file: 'positioning.yaml',       when: '6h ago',  who: 'j.martinez',  status: 'review',     changes: 7,  note: 'Gravity Field rebrand integration' },
  { version: 'v1.8.0', file: 'forbidden-lexicon.yaml', when: '1d ago',  who: 'n.talbert',   status: 'live',       changes: 12, note: 'Added 14 terms from Q1 audit' },
  { version: 'v1.3.1', file: 'icp-buyer.yaml',         when: '1d ago',  who: 'n.talbert',   status: 'staged',     changes: 3,  note: 'Enterprise segment addition' },
  { version: 'v3.1.1', file: 'voice-spec.yaml',        when: '2d ago',  who: 'n.talbert',   status: 'superseded', changes: 2,  note: 'Minor tenet wording fix' },
  { version: 'v2.3.0', file: 'positioning.yaml',       when: '3d ago',  who: 'j.martinez',  status: 'superseded', changes: 5,  note: 'Competitive displacement update' },
  { version: 'v1.7.2', file: 'forbidden-lexicon.yaml', when: '4d ago',  who: 'n.talbert',   status: 'superseded', changes: 1,  note: 'Removed "synergy" false positive' },
  { version: 'v0.9.0', file: 'cadence-rules.yaml',     when: '5d ago',  who: 'n.talbert',   status: 'live',       changes: 8,  note: 'Initial cadence rule set' },
  { version: 'v1.2.0', file: 'topic-pillars.yaml',     when: '6d ago',  who: 'k.chen',      status: 'live',       changes: 6,  note: 'Added ML/AI infrastructure pillar' },
  { version: 'v3.1.0', file: 'voice-spec.yaml',        when: '7d ago',  who: 'n.talbert',   status: 'superseded', changes: 9,  note: 'Major voice archetype revision' },
];

const STATUS_PILL: Record<string, string> = {
  live: 'pill--ok',
  staged: 'pill--staging',
  review: 'pill--review',
  superseded: 'pill--soft',
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function ReleasesScreen() {
  const [filter, setFilter] = useState('');

  const filtered = RELEASES.filter(
    (r) =>
      r.version.toLowerCase().includes(filter.toLowerCase()) ||
      r.file.toLowerCase().includes(filter.toLowerCase()) ||
      r.note.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="t-h1">Releases</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            Version history &middot; all spec files
          </p>
        </div>
        <button className="btn btn--primary">New release</button>
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

      {/* Filter */}
      <input
        className="input"
        placeholder="Filter releases..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />

      {/* Timeline table */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Version</th>
              <th>File</th>
              <th>When</th>
              <th>Who</th>
              <th>Status</th>
              <th>Changes</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={`${r.version}-${r.file}`}>
                <td>
                  <span className="t-code" style={{ fontWeight: 600, color: 'var(--accent)' }}>{r.version}</span>
                </td>
                <td>
                  <span className="t-code" style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{r.file}</span>
                </td>
                <td>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.when}</span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{r.who}</span>
                </td>
                <td>
                  <span className={`pill ${STATUS_PILL[r.status]}`}>{r.status}</span>
                </td>
                <td>
                  <span className="t-num" style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.changes}</span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{r.note}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
