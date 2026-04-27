import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const PRIORITY_STATS = [
  { label: 'P0 \u2014 Critical', count: 1, color: 'var(--err)' },
  { label: 'P1 \u2014 High',     count: 2, color: 'var(--drift)' },
  { label: 'P2 \u2014 Normal',   count: 3, color: 'var(--staging)' },
  { label: 'P3 \u2014 Low',      count: 1, color: 'var(--text-3)' },
];

interface QueueItem {
  id: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  kind: string;
  item: string;
  routing: string;
  tests: string;
  age: string;
}

const QUEUE: QueueItem[] = [
  { id: 'q1', priority: 'P0', kind: 'drift',   item: 'support-bot tone violation \u0394 0.31',        routing: 'n.talbert',   tests: '5/5 pass', age: '2h 14m' },
  { id: 'q2', priority: 'P1', kind: 'publish',  item: 'positioning.yaml v2.4.0',                      routing: 'j.martinez',  tests: '7/7 pass', age: '6h 02m' },
  { id: 'q3', priority: 'P1', kind: 'stage',    item: 'icp-buyer.yaml enterprise segment',            routing: 'n.talbert',   tests: '3/3 pass', age: '1d 01h' },
  { id: 'q4', priority: 'P2', kind: 'review',   item: 'cadence-rules.yaml max_frequency field',       routing: 'governance',  tests: '4/6 fail', age: '3h 18m' },
  { id: 'q5', priority: 'P2', kind: 'rotate',   item: 'API key ak_staging_3x expiration',             routing: 'key-mgr',     tests: '\u2014',   age: '5h 44m' },
  { id: 'q6', priority: 'P2', kind: 'publish',  item: 'topic-pillars.yaml v1.3.0',                    routing: 'k.chen',      tests: '6/6 pass', age: '8h 12m' },
  { id: 'q7', priority: 'P3', kind: 'review',   item: 'forbidden-lexicon.yaml \u2014 false positive audit', routing: 'n.talbert', tests: '12/12 pass', age: '2d 04h' },
];

const PRIORITY_COLORS: Record<string, string> = {
  P0: 'var(--err)',
  P1: 'var(--drift)',
  P2: 'var(--staging)',
  P3: 'var(--text-3)',
};

const KIND_PILL: Record<string, string> = {
  drift: 'pill--drift',
  publish: 'pill--ok',
  stage: 'pill--staging',
  review: 'pill--review',
  rotate: 'pill--info',
};

/* ── Component ──────────────────────────────────────────────────────── */

export default function QueueScreen() {
  const [approved, setApproved] = useState<Set<string>>(new Set());

  function handleApprove(id: string) {
    setApproved((prev) => new Set(prev).add(id));
  }

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="t-h1">Approval Queue</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            {QUEUE.length} items awaiting action
          </p>
        </div>
        <button className="btn btn--ghost">Bulk approve</button>
      </div>

      {/* Priority tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {PRIORITY_STATS.map((p) => (
          <div className="panel" style={{ padding: '16px 20px', textAlign: 'center' }} key={p.label}>
            <div className="t-num" style={{ fontSize: 24, color: p.color }}>{p.count}</div>
            <div className="t-label" style={{ marginTop: 4 }}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* Queue table */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Kind</th>
              <th>Item</th>
              <th>Routing</th>
              <th>Tests</th>
              <th>Age</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {QUEUE.map((q) => (
              <tr key={q.id} style={{ opacity: approved.has(q.id) ? 0.4 : 1 }}>
                <td>
                  <span className="t-num" style={{ fontSize: 13, color: PRIORITY_COLORS[q.priority] }}>
                    {q.priority}
                  </span>
                </td>
                <td>
                  <span className={`pill ${KIND_PILL[q.kind] ?? 'pill--soft'}`}>{q.kind}</span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{q.item}</span>
                </td>
                <td>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{q.routing}</span>
                </td>
                <td>
                  <span
                    className="t-code"
                    style={{
                      fontSize: 11,
                      color: q.tests.includes('fail') ? 'var(--drift)' : q.tests === '\u2014' ? 'var(--text-4)' : 'var(--ok)',
                    }}
                  >
                    {q.tests}
                  </span>
                </td>
                <td>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{q.age}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {approved.has(q.id) ? (
                    <span className="pill pill--ok">approved</span>
                  ) : (
                    <button className="btn btn--sm btn--primary" onClick={() => handleApprove(q.id)}>
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
