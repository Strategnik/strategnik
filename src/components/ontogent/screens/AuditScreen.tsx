import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const DIFF_LINES: { type: 'ctx' | 'add' | 'del'; text: string }[] = [
  { type: 'ctx', text: '  archetype: "The Pragmatic Operator"' },
  { type: 'ctx', text: '  tone_axes:' },
  { type: 'del', text: '-   warmth: 0.35' },
  { type: 'add', text: '+   warmth: 0.40' },
  { type: 'ctx', text: '    authority: 0.82' },
  { type: 'ctx', text: '    wit: 0.28' },
  { type: 'del', text: '-   urgency: 0.55' },
  { type: 'add', text: '+   urgency: 0.50' },
  { type: 'ctx', text: '  tenets:' },
  { type: 'ctx', text: '    - "Show, don\'t tell"' },
  { type: 'add', text: '+   - "Lead with evidence"' },
  { type: 'ctx', text: '    - "Respect the operator\'s time"' },
  { type: 'del', text: '-   - "Avoid hyperbole"' },
  { type: 'add', text: '+   - "Avoid hyperbole and superlatives"' },
];

interface PipelineStep {
  label: string;
  status: 'done' | 'active' | 'pending';
  time?: string;
}

const PIPELINE: PipelineStep[] = [
  { label: 'edit',           status: 'done',   time: '12:41:03' },
  { label: 'staged',         status: 'done',   time: '12:42:55' },
  { label: 'CI schema',      status: 'done',   time: '12:43:08' },
  { label: 'CI governance',  status: 'done',   time: '12:43:12' },
  { label: 'CI drift',       status: 'done',   time: '12:43:15' },
  { label: 'approval',       status: 'done',   time: '12:43:44' },
  { label: 'published',      status: 'done',   time: '12:44:02' },
];

const CASCADE = [
  { agent: 'content-gen',     status: 'invalidated' },
  { agent: 'email-drafter',   status: 'invalidated' },
  { agent: 'support-bot',     status: 'invalidated' },
  { agent: 'ad-copy-engine',  status: 'invalidated' },
  { agent: 'social-poster',   status: 'invalidated' },
  { agent: 'blog-writer',     status: 'invalidated' },
];

/* ── Component ──────────────────────────────────────────────────────── */

export default function AuditScreen() {
  const [showRollback, setShowRollback] = useState(false);

  return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 1120 }}>
      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 className="t-h1">Audit Event</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            voice-spec.yaml &middot; v3.1.1 &rarr; v3.1.2 &middot; publish
          </p>
        </div>

        {/* Meta strip */}
        <div className="panel" style={{ display: 'flex', gap: 0, marginBottom: 20, overflow: 'hidden' }}>
          {[
            { label: 'Event', value: 'publish' },
            { label: 'File', value: 'voice-spec.yaml' },
            { label: 'Version', value: 'v3.1.1 \u2192 v3.1.2' },
            { label: 'Actor', value: 'n.talbert' },
            { label: 'Time', value: '12:44:02 UTC' },
          ].map((m, i) => (
            <div
              key={m.label}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRight: i < 4 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div className="t-label" style={{ marginBottom: 2 }}>{m.label}</div>
              <div className="t-code" style={{ fontSize: 12, color: 'var(--text)' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Diff view */}
        <div style={{ marginBottom: 20 }}>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Diff</div>
          <div
            className="panel"
            style={{ overflow: 'hidden', fontFamily: "'JetBrains Mono','SF Mono','Menlo',monospace", fontSize: 12 }}
          >
            {DIFF_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: '4px 16px',
                  background:
                    line.type === 'add'
                      ? 'rgba(52,211,153,0.08)'
                      : line.type === 'del'
                        ? 'rgba(248,113,113,0.08)'
                        : 'transparent',
                  color:
                    line.type === 'add'
                      ? 'var(--ok)'
                      : line.type === 'del'
                        ? 'var(--drift)'
                        : 'var(--text-2)',
                  borderLeft: `3px solid ${
                    line.type === 'add' ? 'var(--ok)' : line.type === 'del' ? 'var(--drift)' : 'transparent'
                  }`,
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Pipeline</div>
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {PIPELINE.map((step, i) => (
                <React.Fragment key={step.label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 600,
                        background: step.status === 'done' ? 'var(--ok-soft)' : 'var(--bg-3)',
                        color: step.status === 'done' ? 'var(--ok)' : 'var(--text-4)',
                        border: `1px solid ${step.status === 'done' ? 'rgba(52,211,153,0.3)' : 'var(--line)'}`,
                      }}
                    >
                      {step.status === 'done' ? '\u2713' : (i + 1)}
                    </div>
                    <span className="t-label" style={{ fontSize: 9, textAlign: 'center', maxWidth: 70 }}>
                      {step.label}
                    </span>
                    {step.time && (
                      <span className="t-code" style={{ fontSize: 9, color: 'var(--text-4)' }}>
                        {step.time}
                      </span>
                    )}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: step.status === 'done' ? 'var(--ok)' : 'var(--line)',
                        opacity: 0.4,
                        marginBottom: 28,
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Cascade */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>
            Cascade &middot; {CASCADE.length} consumers invalidated
          </div>
          {CASCADE.map((c) => (
            <div
              key={c.agent}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{c.agent}</span>
              <span className="pill pill--staging" style={{ fontSize: 9 }}>{c.status}</span>
            </div>
          ))}
        </div>

        {/* Provenance */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>Provenance</div>
          {[
            { label: 'event_id', value: 'evt_a3f8c1d2' },
            { label: 'SHA',       value: '9e2b7f1a...c04d' },
            { label: 'signature', value: 'sig_hmac_256' },
          ].map((p) => (
            <div key={p.label} style={{ marginBottom: 8 }}>
              <div className="t-label" style={{ marginBottom: 1 }}>{p.label}</div>
              <div className="t-code" style={{ fontSize: 11, color: 'var(--text-2)' }}>{p.value}</div>
            </div>
          ))}
        </div>

        {/* Rollback */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>Rollback</div>
          <p style={{ fontSize: 11.5, color: 'var(--text-3)', marginBottom: 10, lineHeight: 1.5 }}>
            Revert to v3.1.1 and re-validate all downstream consumers.
          </p>
          {!showRollback ? (
            <button className="btn btn--danger" onClick={() => setShowRollback(true)}>
              Initiate rollback
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn--danger">Confirm rollback</button>
              <button className="btn btn--ghost" onClick={() => setShowRollback(false)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
