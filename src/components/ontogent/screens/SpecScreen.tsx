import React, { useState } from 'react';

/* ── File tree data ─────────────────────────────────────────────────── */

interface TreeItem {
  name: string;
  type: 'file' | 'folder';
  group?: string;
  color?: string;
  children?: TreeItem[];
}

const SPEC_TREE: TreeItem[] = [
  {
    name: 'Brand', type: 'folder', color: 'var(--c-identity)', children: [
      { name: 'voice-spec.yaml', type: 'file', group: 'identity' },
      { name: 'forbidden-lexicon.yaml', type: 'file', group: 'identity' },
      { name: 'tenets.yaml', type: 'file', group: 'identity' },
      { name: 'cadence-rules.yaml', type: 'file', group: 'identity' },
    ],
  },
  {
    name: 'Buyer', type: 'folder', color: 'var(--c-buyer)', children: [
      { name: 'icp-buyer.yaml', type: 'file', group: 'buyer' },
      { name: 'personas.yaml', type: 'file', group: 'buyer' },
      { name: 'objections.yaml', type: 'file', group: 'buyer' },
    ],
  },
  {
    name: 'Position', type: 'folder', color: 'var(--c-competitive)', children: [
      { name: 'positioning.yaml', type: 'file', group: 'competitive' },
      { name: 'battlecards.yaml', type: 'file', group: 'competitive' },
      { name: 'displacement.yaml', type: 'file', group: 'competitive' },
    ],
  },
  {
    name: 'Content', type: 'folder', color: 'var(--c-content)', children: [
      { name: 'topic-pillars.yaml', type: 'file', group: 'content' },
      { name: 'templates.yaml', type: 'file', group: 'content' },
      { name: 'brief-schema.yaml', type: 'file', group: 'content' },
    ],
  },
  {
    name: 'Measurement', type: 'folder', color: 'var(--c-measurement)', children: [
      { name: 'kpi-registry.yaml', type: 'file', group: 'measurement' },
      { name: 'attribution.yaml', type: 'file', group: 'measurement' },
    ],
  },
];

/* ── Voice spec rendered data ───────────────────────────────────────── */

const TONE_AXES = [
  { axis: 'warmth',    value: 0.40, max: 1.0 },
  { axis: 'authority', value: 0.82, max: 1.0 },
  { axis: 'wit',       value: 0.28, max: 1.0 },
  { axis: 'urgency',   value: 0.50, max: 1.0 },
];

const TENETS = [
  'Show, don\'t tell',
  'Lead with evidence',
  'Respect the operator\'s time',
  'Avoid hyperbole and superlatives',
  'Name the tradeoff explicitly',
  'Use operator language, not marketing jargon',
];

const FORBIDDEN_LEXICON: { term: string; reason: string; severity: string }[] = [
  { term: 'cutting-edge',      reason: 'vague superlative',       severity: 'hard' },
  { term: 'revolutionary',     reason: 'unsubstantiated claim',   severity: 'hard' },
  { term: 'synergy',           reason: 'corporate jargon',        severity: 'hard' },
  { term: 'leverage',          reason: 'overused verb',           severity: 'soft' },
  { term: 'best-in-class',     reason: 'unverifiable claim',      severity: 'hard' },
  { term: 'game-changer',      reason: 'vague superlative',       severity: 'hard' },
  { term: 'seamless',          reason: 'rarely true',             severity: 'soft' },
  { term: 'robust',            reason: 'meaningless modifier',    severity: 'soft' },
];

const CADENCE_RULES = [
  { channel: 'blog',        max: '3/week',   min: '1/week',   review: 'editorial' },
  { channel: 'email',       max: '2/week',   min: '1/2 weeks', review: 'cadence-bot' },
  { channel: 'social',      max: '2/day',    min: '3/week',   review: 'auto' },
  { channel: 'paid ads',    max: 'unlimited', min: 'n/a',      review: 'performance' },
];

/* ── Right rail data ────────────────────────────────────────────────── */

const CONSUMED_BY = ['content-gen', 'email-drafter', 'support-bot', 'ad-copy-engine', 'social-poster', 'blog-writer'];

const RECENT_ACTIVITY = [
  { time: '2h ago',  event: 'Published v3.1.2' },
  { time: '1d ago',  event: 'Staged v3.1.2 for review' },
  { time: '2d ago',  event: 'Published v3.1.1' },
  { time: '7d ago',  event: 'Major revision v3.1.0' },
];

const IMPORTS = ['tenets.yaml', 'forbidden-lexicon.yaml', 'cadence-rules.yaml'];

/* ── Component ──────────────────────────────────────────────────────── */

export default function SpecScreen() {
  const [selectedFile, setSelectedFile] = useState('voice-spec.yaml');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(SPEC_TREE.map((f) => f.name)));

  function toggleFolder(name: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 94px)', margin: '-24px', overflow: 'hidden' }}>
      {/* Left: File tree */}
      <div
        style={{
          width: 220,
          minWidth: 220,
          background: 'var(--bg-1)',
          borderRight: '1px solid var(--line)',
          overflowY: 'auto',
          padding: '16px 0',
        }}
      >
        <div className="t-eyebrow" style={{ padding: '0 16px', marginBottom: 12 }}>Spec files</div>
        {SPEC_TREE.map((folder) => (
          <div key={folder.name} style={{ marginBottom: 4 }}>
            <button
              onClick={() => toggleFolder(folder.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                width: '100%',
                padding: '5px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-2)',
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 10, color: 'var(--text-4)', width: 12 }}>
                {expandedFolders.has(folder.name) ? '\u25BE' : '\u25B8'}
              </span>
              <span className="dot" style={{ background: folder.color, width: 6, height: 6 }} />
              {folder.name}
            </button>
            {expandedFolders.has(folder.name) && folder.children?.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '4px 16px 4px 40px',
                  background: selectedFile === file.name ? 'var(--bg-3)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: selectedFile === file.name ? 'var(--text)' : 'var(--text-3)',
                  fontSize: 11.5,
                  textAlign: 'left',
                  fontFamily: "'JetBrains Mono','SF Mono','Menlo',monospace",
                }}
              >
                {file.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Center: Rendered reading view */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {selectedFile === 'voice-spec.yaml' ? (
          <div style={{ maxWidth: 640 }}>
            {/* Title */}
            <div style={{ marginBottom: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 6 }}>voice-spec.yaml &middot; v3.1.2</div>
              <h2 className="t-h1" style={{ fontSize: 26 }}>Voice Specification</h2>
            </div>

            {/* Archetype */}
            <div style={{ marginBottom: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 8 }}>Archetype</div>
              <div
                className="panel"
                style={{
                  padding: '20px 24px',
                  borderLeft: '3px solid var(--accent)',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text)',
                  lineHeight: 1.6,
                }}
              >
                "The Pragmatic Operator"
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, fontWeight: 400 }}>
                  Expert but not academic. Direct and opinionated. Respects the operator&apos;s intelligence.
                </div>
              </div>
            </div>

            {/* Tone axes */}
            <div style={{ marginBottom: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 12 }}>Tone Axes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {TONE_AXES.map((t) => (
                  <div key={t.axis}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-2)', textTransform: 'capitalize' }}>{t.axis}</span>
                      <span className="t-num" style={{ fontSize: 12, color: 'var(--accent)' }}>{t.value.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${(t.value / t.max) * 100}%`,
                          height: '100%',
                          background: 'var(--accent)',
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tenets */}
            <div style={{ marginBottom: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 10 }}>Tenets</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {TENETS.map((tenet, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 10,
                      padding: '6px 0',
                      borderBottom: '1px solid var(--line)',
                    }}
                  >
                    <span className="t-num" style={{ fontSize: 10, color: 'var(--text-4)', width: 16, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{tenet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forbidden lexicon */}
            <div style={{ marginBottom: 28 }}>
              <div className="t-eyebrow" style={{ marginBottom: 10 }}>Forbidden Lexicon</div>
              <div className="panel" style={{ overflow: 'hidden' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Reason</th>
                      <th>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FORBIDDEN_LEXICON.map((l) => (
                      <tr key={l.term}>
                        <td>
                          <span className="t-code" style={{ fontSize: 12, color: 'var(--drift)' }}>{l.term}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{l.reason}</span>
                        </td>
                        <td>
                          <span className={`pill ${l.severity === 'hard' ? 'pill--drift' : 'pill--staging'}`}>
                            {l.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cadence rules */}
            <div>
              <div className="t-eyebrow" style={{ marginBottom: 10 }}>Cadence Rules</div>
              <div className="panel" style={{ overflow: 'hidden' }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Channel</th>
                      <th>Max</th>
                      <th>Min</th>
                      <th>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CADENCE_RULES.map((r) => (
                      <tr key={r.channel}>
                        <td>
                          <span style={{ fontWeight: 500, color: 'var(--text)', textTransform: 'capitalize' }}>{r.channel}</span>
                        </td>
                        <td>
                          <span className="t-code" style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{r.max}</span>
                        </td>
                        <td>
                          <span className="t-code" style={{ fontSize: 11.5, color: 'var(--text-2)' }}>{r.min}</span>
                        </td>
                        <td>
                          <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.review}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="t-h2" style={{ color: 'var(--text-2)', marginBottom: 8 }}>{selectedFile}</div>
              <div className="t-mono" style={{ fontSize: 12 }}>Select a file to view its rendered spec</div>
            </div>
          </div>
        )}
      </div>

      {/* Right rail: Metadata */}
      <div
        style={{
          width: 260,
          minWidth: 260,
          background: 'var(--bg-1)',
          borderLeft: '1px solid var(--line)',
          overflowY: 'auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Status */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="pill pill--ok">live</span>
            <span className="t-code" style={{ fontSize: 11, color: 'var(--text-3)' }}>v3.1.2</span>
          </div>
        </div>

        {/* Drift score */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Drift Score</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="t-num" style={{ fontSize: 22, color: 'var(--ok)' }}>0.04</span>
            <span className="t-label">within tolerance</span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
            <div style={{ width: '4%', height: '100%', background: 'var(--ok)', borderRadius: 2 }} />
          </div>
        </div>

        {/* Consumed by */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Consumed by &middot; {CONSUMED_BY.length}</div>
          {CONSUMED_BY.map((agent) => (
            <div
              key={agent}
              style={{
                padding: '5px 0',
                borderBottom: '1px solid var(--line)',
                fontSize: 12,
                color: 'var(--text-2)',
              }}
            >
              {agent}
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Recent Activity</div>
          {RECENT_ACTIVITY.map((a, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 8,
                padding: '5px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <span className="t-mono" style={{ fontSize: 10, color: 'var(--text-4)', width: 50, flexShrink: 0 }}>
                {a.time}
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--text-3)' }}>{a.event}</span>
            </div>
          ))}
        </div>

        {/* Imports */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Imports</div>
          {IMPORTS.map((imp) => (
            <div
              key={imp}
              className="t-code"
              style={{
                padding: '4px 0',
                fontSize: 11,
                color: 'var(--accent-2)',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedFile(imp)}
            >
              {imp}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
