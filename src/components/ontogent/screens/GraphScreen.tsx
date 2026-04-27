import React, { useState, useMemo } from 'react';

/* ── Deterministic node generation ──────────────────────────────────── */

interface GraphNode {
  id: number;
  label: string;
  cat: string;
  x: number;
  y: number;
  r: number;
  score: number;
}

interface GraphEdge {
  from: number;
  to: number;
}

const CATEGORIES: { key: string; color: string; label: string; count: number; score: number }[] = [
  { key: 'identity',    color: 'var(--c-identity)',    label: 'Identity',      count: 12, score: 0.91 },
  { key: 'buyer',       color: 'var(--c-buyer)',       label: 'Buyer',         count: 9,  score: 0.87 },
  { key: 'competitive', color: 'var(--c-competitive)', label: 'Competitive',   count: 8,  score: 0.74 },
  { key: 'content',     color: 'var(--c-content)',     label: 'Content',       count: 11, score: 0.82 },
  { key: 'distribution',color: 'var(--c-distribution)',label: 'Distribution',  count: 7,  score: 0.79 },
  { key: 'pipeline',    color: 'var(--c-pipeline)',    label: 'Pipeline',      count: 10, score: 0.85 },
  { key: 'gtm',         color: 'var(--c-gtm)',         label: 'GTM',           count: 9,  score: 0.88 },
  { key: 'measurement', color: 'var(--c-measurement)', label: 'Measurement',   count: 8,  score: 0.72 },
];

const LABELS = [
  'voice', 'tone', 'archetype', 'lexicon', 'tenets', 'cadence', 'icp', 'persona',
  'segment', 'buyer-journey', 'objections', 'pricing', 'positioning', 'battlecard',
  'displacement', 'win-rate', 'pillars', 'brief', 'template', 'blog', 'email',
  'social', 'paid', 'organic', 'events', 'webinar', 'nurture', 'pipeline-stage',
  'mql', 'sql', 'opp', 'forecast', 'gtm-plan', 'launch', 'channel-mix',
  'territory', 'quota', 'enablement', 'metric', 'kpi', 'dashboard', 'attribution',
  'cohort', 'retention', 'expansion', 'churn', 'nps', 'csat', 'ltv', 'cac',
  'roas', 'cpl', 'cpo', 'arr', 'mrr', 'burn', 'runway', 'vc-deck',
  'board-deck', 'investor', 'advisory', 'brand-guide', 'logo', 'palette',
  'typography', 'imagery', 'messaging-house', 'elevator', 'one-liner',
  'tagline', 'manifesto', 'mission', 'vision', 'values', 'culture',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const rand = seededRandom(42);
  const nodes: GraphNode[] = [];
  let id = 0;

  const W = 900;
  const H = 600;

  for (const cat of CATEGORIES) {
    const cx = 100 + rand() * (W - 200);
    const cy = 80 + rand() * (H - 160);
    for (let i = 0; i < cat.count; i++) {
      const angle = (i / cat.count) * Math.PI * 2 + rand() * 0.5;
      const dist = 30 + rand() * 90;
      nodes.push({
        id: id++,
        label: LABELS[id % LABELS.length],
        cat: cat.key,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        r: 4 + rand() * 5,
        score: 0.3 + rand() * 0.7,
      });
    }
  }

  // Generate edges
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const numEdges = 3 + Math.floor(rand() * 7);
    for (let e = 0; e < numEdges; e++) {
      const target = Math.floor(rand() * nodes.length);
      if (target !== i) {
        edges.push({ from: i, to: target });
      }
    }
  }

  return { nodes, edges };
}

const CAT_COLOR_MAP: Record<string, string> = {};
for (const c of CATEGORIES) {
  CAT_COLOR_MAP[c.key] = c.color;
}

/* ── Component ──────────────────────────────────────────────────────── */

export default function GraphScreen() {
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(CATEGORIES.map((c) => c.key)));

  const { nodes, edges } = useMemo(() => generateGraph(), []);

  const filteredNodes = nodes.filter((n) => activeFilters.has(n.cat));
  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = edges.filter((e) => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));

  function toggleFilter(key: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  // Compute stats for selected node
  const selectedDeps = selected ? edges.filter((e) => e.to === selected.id).length : 0;
  const selectedUsedBy = selected ? edges.filter((e) => e.from === selected.id).length : 0;

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 94px)', margin: '-24px', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Floating command bar */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          width: 440,
        }}
      >
        <input
          className="input"
          placeholder="Ask the field a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(12,14,17,0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--line-2)',
            fontSize: 13,
            padding: '10px 16px',
            borderRadius: 'var(--r-3)',
          }}
        />
      </div>

      {/* Filter chips (left) */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {CATEGORIES.map((c) => {
          const isActive = activeFilters.has(c.key);
          return (
            <button
              key={c.key}
              onClick={() => toggleFilter(c.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                background: isActive ? 'rgba(12,14,17,0.85)' : 'rgba(12,14,17,0.5)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${isActive ? c.color : 'var(--line)'}`,
                borderRadius: 'var(--r-2)',
                cursor: 'pointer',
                color: isActive ? 'var(--text)' : 'var(--text-4)',
                fontSize: 11,
                transition: 'all 0.12s',
              }}
            >
              <span className="dot" style={{ background: isActive ? c.color : 'var(--text-4)', width: 6, height: 6 }} />
              <span>{c.label}</span>
              <span className="t-num" style={{ fontSize: 10, color: 'var(--text-3)' }}>{c.score.toFixed(2)}</span>
            </button>
          );
        })}
      </div>

      {/* Inspector panel (right) */}
      {selected && (
        <div
          className="panel"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            width: 240,
            padding: 16,
            background: 'rgba(12,14,17,0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="t-eyebrow" style={{ marginBottom: 8 }}>Inspector</div>
          <div className="t-h3" style={{ color: CAT_COLOR_MAP[selected.cat], marginBottom: 12 }}>
            {selected.label}
          </div>
          {[
            { label: 'Category',   value: selected.cat },
            { label: 'Depends on', value: String(selectedDeps) },
            { label: 'Used by',    value: String(selectedUsedBy) },
            { label: 'Drift',      value: (1 - selected.score).toFixed(2) },
            { label: 'Score',      value: selected.score.toFixed(2) },
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--line)' }}>
              <span className="t-label">{row.label}</span>
              <span className="t-code" style={{ fontSize: 11, color: 'var(--text-2)' }}>{row.value}</span>
            </div>
          ))}
          <button
            className="btn btn--ghost btn--sm"
            style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* SVG graph */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Edges */}
        {filteredEdges.map((e, i) => {
          const from = nodes[e.from];
          const to = nodes[e.to];
          if (!from || !to) return null;
          const isSelectedEdge = selected && (e.from === selected.id || e.to === selected.id);
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isSelectedEdge ? 'var(--accent)' : 'var(--line)'}
              strokeWidth={isSelectedEdge ? 0.8 : 0.3}
              opacity={isSelectedEdge ? 0.6 : 0.15}
            />
          );
        })}

        {/* Nodes */}
        {filteredNodes.map((n) => {
          const isSelected = selected?.id === n.id;
          return (
            <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(n)}>
              <circle
                cx={n.x}
                cy={n.y}
                r={isSelected ? n.r + 3 : n.r}
                fill={CAT_COLOR_MAP[n.cat]}
                opacity={isSelected ? 1 : 0.7}
                stroke={isSelected ? 'var(--text)' : 'none'}
                strokeWidth={isSelected ? 1.5 : 0}
              />
              {n.r > 6 && (
                <text
                  x={n.x}
                  y={n.y + n.r + 10}
                  fill="var(--text-3)"
                  fontSize={8}
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Bottom stats bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 36,
          background: 'rgba(12,14,17,0.9)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          zIndex: 10,
        }}
      >
        {[
          { label: 'nodes',    value: '74' },
          { label: 'edges',    value: '673' },
          { label: 'density',  value: '0.62' },
          { label: 'drifting', value: '4' },
        ].map((s) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="t-num" style={{ fontSize: 12, color: 'var(--accent)' }}>{s.value}</span>
            <span className="t-label" style={{ fontSize: 9 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
