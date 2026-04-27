import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────────────────────────────────── */

interface Variable {
  id: string;
  label: string;
  category: string;
  color: string;
  version: string;
  status: 'live' | 'staged' | 'drift' | 'review';
  consumers: string[];
  drift?: boolean;
}

interface Agent {
  id: string;
  name: string;
  kind: string;
  reads: string[];
  lastShipped: string;
  requests24h: number;
  status: 'healthy' | 'degraded' | 'paused' | 'gated';
}

interface InboxItem {
  id: string;
  type: 'review' | 'drift' | 'gate' | 'staged';
  urgency: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  ts: string;
}

interface ActivityItem {
  id: string;
  action: 'shipped' | 'staged' | 'flagged' | 'validated' | 'edited' | 'gated';
  actor: string;
  target: string;
  ts: string;
}

const CP_VARIABLES: Variable[] = [
  { id: 'voice',        label: 'Voice',        category: 'identity',    color: 'var(--c-identity)',    version: 'v3.1', status: 'live',    consumers: ['writer-gpt', 'sdr-copilot', 'newsletter-gen'],        drift: false },
  { id: 'lexicon',      label: 'Lexicon',      category: 'identity',    color: 'var(--c-identity)',    version: 'v2.4', status: 'live',    consumers: ['writer-gpt', 'support-bot', 'newsletter-gen'],         drift: false },
  { id: 'tenets',       label: 'Tenets',       category: 'identity',    color: 'var(--c-identity)',    version: 'v1.0', status: 'live',    consumers: ['writer-gpt', 'proposal-bot', 'sdr-copilot'],          drift: false },
  { id: 'cadence',      label: 'Cadence',      category: 'distribution',color: 'var(--c-distribution)',version: 'v4.2', status: 'staged',  consumers: ['newsletter-gen', 'sdr-copilot'],                     drift: false },
  { id: 'icp',          label: 'ICP',          category: 'buyer',       color: 'var(--c-buyer)',       version: 'v5.0', status: 'live',    consumers: ['sdr-copilot', 'proposal-bot', 'finetune-v4'],         drift: true },
  { id: 'positioning',  label: 'Positioning',  category: 'competitive', color: 'var(--c-competitive)', version: 'v2.1', status: 'review',  consumers: ['writer-gpt', 'sdr-copilot', 'proposal-bot', 'support-bot'], drift: false },
  { id: 'topics',       label: 'Topics',       category: 'content',     color: 'var(--c-content)',     version: 'v6.3', status: 'live',    consumers: ['writer-gpt', 'newsletter-gen'],                      drift: false },
  { id: 'permissions',  label: 'Permissions',  category: 'governance',  color: 'var(--c-governance)',  version: 'v1.2', status: 'live',    consumers: ['writer-gpt', 'sdr-copilot', 'proposal-bot', 'support-bot', 'newsletter-gen', 'finetune-v4'], drift: false },
  { id: 'thresholds',   label: 'Thresholds',   category: 'measurement', color: 'var(--c-measurement)', version: 'v2.0', status: 'live',    consumers: ['finetune-v4', 'support-bot'],                        drift: false },
];

const CP_AGENTS: Agent[] = [
  { id: 'writer-gpt',     name: 'writer-gpt',     kind: 'content',   reads: ['voice', 'lexicon', 'tenets', 'positioning', 'topics', 'permissions'], lastShipped: '4m ago',  requests24h: 482,  status: 'healthy' },
  { id: 'sdr-copilot',    name: 'sdr-copilot',    kind: 'outbound',  reads: ['voice', 'tenets', 'cadence', 'icp', 'positioning', 'permissions'],   lastShipped: '12m ago', requests24h: 318,  status: 'healthy' },
  { id: 'proposal-bot',   name: 'proposal-bot',   kind: 'sales',     reads: ['tenets', 'icp', 'positioning', 'permissions'],                       lastShipped: '1h ago',  requests24h: 87,   status: 'gated' },
  { id: 'support-bot',    name: 'support-bot',    kind: 'cx',        reads: ['lexicon', 'positioning', 'permissions', 'thresholds'],                lastShipped: '22m ago', requests24h: 614,  status: 'healthy' },
  { id: 'newsletter-gen', name: 'newsletter-gen', kind: 'content',   reads: ['voice', 'lexicon', 'cadence', 'topics', 'permissions'],               lastShipped: '3h ago',  requests24h: 24,   status: 'degraded' },
  { id: 'finetune-v4',    name: 'finetune-v4',    kind: 'training',  reads: ['icp', 'permissions', 'thresholds'],                                  lastShipped: '6h ago',  requests24h: 232,  status: 'healthy' },
];

const CP_INBOX: InboxItem[] = [
  { id: 'inb-1', type: 'drift',   urgency: 'high',   title: 'ICP drift detected',              detail: 'v5.0 diverges from live agent reads by 12%', ts: '8m ago' },
  { id: 'inb-2', type: 'review',  urgency: 'medium', title: 'Positioning v2.1 pending review',  detail: 'Submitted by Nick — 3 agents affected',      ts: '22m ago' },
  { id: 'inb-3', type: 'gate',    urgency: 'high',   title: 'proposal-bot gated',               detail: 'Confidence below threshold (0.71 < 0.80)',   ts: '1h ago' },
  { id: 'inb-4', type: 'staged',  urgency: 'low',    title: 'Cadence v4.2 staged',              detail: '2 agents will pick up on promote',            ts: '2h ago' },
  { id: 'inb-5', type: 'review',  urgency: 'medium', title: 'newsletter-gen output review',     detail: 'Last 3 outputs flagged for tone drift',       ts: '3h ago' },
  { id: 'inb-6', type: 'drift',   urgency: 'low',    title: 'Lexicon minor variance',           detail: 'Synonym expansion drifted in support-bot',    ts: '5h ago' },
];

const CP_ACTIVITY: ActivityItem[] = [
  { id: 'act-1', action: 'shipped',   actor: 'writer-gpt',     target: 'Blog: "Pipeline Physics Q3"',     ts: '4m ago' },
  { id: 'act-2', action: 'staged',    actor: 'Nick',            target: 'Cadence v4.2',                    ts: '18m ago' },
  { id: 'act-3', action: 'flagged',   actor: 'system',          target: 'ICP drift detected',              ts: '22m ago' },
  { id: 'act-4', action: 'validated', actor: 'finetune-v4',     target: 'Thresholds v2.0 compliance',      ts: '35m ago' },
  { id: 'act-5', action: 'shipped',   actor: 'sdr-copilot',    target: 'Outbound: Acme Corp sequence',    ts: '41m ago' },
  { id: 'act-6', action: 'edited',    actor: 'Nick',            target: 'Positioning v2.1 draft',          ts: '1h ago' },
  { id: 'act-7', action: 'gated',     actor: 'system',          target: 'proposal-bot output held',        ts: '1h ago' },
  { id: 'act-8', action: 'shipped',   actor: 'support-bot',    target: 'Ticket #4821 reply',              ts: '1.5h ago' },
  { id: 'act-9', action: 'validated', actor: 'writer-gpt',     target: 'Voice v3.1 alignment check',      ts: '2h ago' },
  { id: 'act-10',action: 'shipped',   actor: 'newsletter-gen', target: 'Weekly digest draft',              ts: '3h ago' },
];

/* ──────────────────────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────────────────────── */

const STATUS_PILL: Record<string, string> = {
  live:     'pill pill--ok',
  staged:   'pill pill--staging',
  review:   'pill pill--review',
  drift:    'pill pill--drift',
  healthy:  'pill pill--ok',
  degraded: 'pill pill--warn',
  paused:   'pill pill--soft',
  gated:    'pill pill--drift',
};

const ACTION_PILL: Record<string, string> = {
  shipped:   'pill pill--ok',
  staged:    'pill pill--staging',
  flagged:   'pill pill--drift',
  validated: 'pill pill--accent',
  edited:    'pill pill--info',
  gated:     'pill pill--drift',
};

const URGENCY_COLOR: Record<string, string> = {
  high:   'var(--drift)',
  medium: 'var(--staging)',
  low:    'var(--text-4)',
};

const INBOX_ACTION_LABEL: Record<string, { label: string; cls: string }> = {
  review: { label: 'Review', cls: 'btn btn--review btn--sm' },
  drift:  { label: 'Resolve', cls: 'btn btn--danger btn--sm' },
  gate:   { label: 'Override', cls: 'btn btn--staging btn--sm' },
  staged: { label: 'Promote', cls: 'btn btn--primary btn--sm' },
};

/* ──────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────────────────────────────────── */

/* --- VariableRow --- */

interface VariableRowProps {
  v: Variable;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  yRef: (id: string, el: HTMLDivElement | null) => void;
}

function VariableRow({ v, highlighted, onHover, yRef }: VariableRowProps) {
  return (
    <div
      ref={(el) => yRef(v.id, el)}
      onMouseEnter={() => onHover(v.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 'var(--r-2)',
        background: highlighted ? 'var(--bg-3)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
    >
      <span className="dot" style={{ background: v.color }} />
      <span style={{ flex: 1, fontWeight: 500, color: highlighted ? 'var(--text)' : 'var(--text-2)', transition: 'color 0.15s' }}>
        {v.label}
      </span>
      <span className="t-code" style={{ fontSize: 10, color: 'var(--text-4)' }}>{v.version}</span>
      <span className={STATUS_PILL[v.status]} style={{ fontSize: 10 }}>{v.status}</span>
      <span className="t-label" style={{ minWidth: 20, textAlign: 'right' }}>{v.consumers.length}</span>
      {v.drift && <span className="pill pill--drift" style={{ fontSize: 9, padding: '0 6px', height: 16 }}>DRIFT</span>}
    </div>
  );
}

/* --- AgentRow --- */

interface AgentRowProps {
  a: Agent;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  yRef: (id: string, el: HTMLDivElement | null) => void;
}

function AgentRow({ a, highlighted, onHover, yRef }: AgentRowProps) {
  return (
    <div
      ref={(el) => yRef(a.id, el)}
      onMouseEnter={() => onHover(a.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 12px',
        borderRadius: 'var(--r-2)',
        background: highlighted ? 'var(--bg-3)' : 'transparent',
        transition: 'background 0.15s',
        cursor: 'default',
      }}
    >
      <span className="t-mono" style={{ flex: 1, fontSize: 12, color: highlighted ? 'var(--accent)' : 'var(--text-2)', transition: 'color 0.15s' }}>
        {a.name}
      </span>
      <span className="t-label">{a.kind}</span>
      <span className="t-label" style={{ minWidth: 16, textAlign: 'right' }}>{a.reads.length}r</span>
      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.lastShipped}</span>
      <span className="t-num" style={{ fontSize: 11, color: 'var(--text-2)', minWidth: 30, textAlign: 'right' }}>{a.requests24h}</span>
      <span className={STATUS_PILL[a.status]} style={{ fontSize: 10 }}>{a.status}</span>
    </div>
  );
}

/* --- Inbox --- */

interface InboxProps {
  items: InboxItem[];
}

type InboxFilter = 'all' | 'review' | 'drift' | 'gate' | 'staged';

function Inbox({ items }: InboxProps) {
  const [filter, setFilter] = useState<InboxFilter>('all');
  const filters: InboxFilter[] = ['all', 'review', 'drift', 'gate', 'staged'];
  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="t-h2">Inbox</span>
        <span className="t-label" style={{ marginLeft: 'auto' }}>{filtered.length}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, padding: '10px 20px 6px' }}>
        {filters.map((f) => (
          <button
            key={f}
            className={filter === f ? 'btn btn--primary btn--sm' : 'btn btn--ghost btn--sm'}
            onClick={() => setFilter(f)}
          >
            {f === 'gate' ? 'gates' : f}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
        {filtered.map((item) => {
          const act = INBOX_ACTION_LABEL[item.type];
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 8px', borderBottom: '1px solid var(--line)' }}>
              <span className="dot dot--pulse" style={{ background: URGENCY_COLOR[item.urgency], marginTop: 5 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: 12, color: 'var(--text)' }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.detail}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{item.ts}</span>
                <button className={act.cls}>{act.label}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- ActivityStream --- */

interface ActivityStreamProps {
  items: ActivityItem[];
}

function ActivityStream({ items }: ActivityStreamProps) {
  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="t-h2">Activity</span>
        <span className="dot dot--pulse" style={{ background: 'var(--ok)', width: 6, height: 6 }} />
        <span className="t-label">live</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', borderBottom: '1px solid var(--line)' }}>
            <span className={ACTION_PILL[item.action]} style={{ fontSize: 10 }}>{item.action}</span>
            <span className="t-mono" style={{ fontSize: 11, color: 'var(--accent)' }}>{item.actor}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.target}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-4)', flexShrink: 0 }}>{item.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- FleetHealth --- */

interface MetricTile {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

const FLEET_METRICS: MetricTile[] = [
  { label: 'Outputs 24h',     value: '1,757', color: 'var(--accent)' },
  { label: 'Drift open',      value: 2,       color: 'var(--drift)' },
  { label: 'Staged changes',  value: 1,       color: 'var(--staging)' },
  { label: 'Approval queue',  value: 2,       color: 'var(--review)' },
  { label: 'Gate pass rate',  value: '94.2%', color: 'var(--ok)' },
  { label: 'p50 latency',     value: '220ms', color: 'var(--info)' },
];

function FleetHealth() {
  return (
    <div className="panel" style={{ display: 'flex', gap: 0, overflow: 'hidden' }}>
      {FLEET_METRICS.map((m, i) => (
        <div
          key={m.label}
          style={{
            flex: 1,
            padding: '16px 20px',
            borderRight: i < FLEET_METRICS.length - 1 ? '1px solid var(--line)' : 'none',
            textAlign: 'center',
          }}
        >
          <div className="t-label" style={{ marginBottom: 6 }}>{m.label}</div>
          <div className="t-num" style={{ fontSize: 20, color: m.color || 'var(--text)' }}>{m.value}</div>
        </div>
      ))}
    </div>
  );
}

/* --- ContextField (visual hero) --- */

interface ContextFieldProps {
  variables: Variable[];
  agents: Agent[];
}

function ContextField({ variables, agents }: ContextFieldProps) {
  const [hoveredVar, setHoveredVar] = useState<string | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const varRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const agentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [edges, setEdges] = useState<{ varId: string; agentId: string; y1: number; y2: number }[]>([]);

  const setVarRef = useCallback((id: string, el: HTMLDivElement | null) => { varRefs.current[id] = el; }, []);
  const setAgentRef = useCallback((id: string, el: HTMLDivElement | null) => { agentRefs.current[id] = el; }, []);

  // Recompute edge positions
  useEffect(() => {
    const compute = () => {
      if (!containerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const newEdges: typeof edges = [];

      variables.forEach((v) => {
        const vEl = varRefs.current[v.id];
        if (!vEl) return;
        const vRect = vEl.getBoundingClientRect();
        const y1 = vRect.top + vRect.height / 2 - cRect.top;

        v.consumers.forEach((agentId) => {
          const aEl = agentRefs.current[agentId];
          if (!aEl) return;
          const aRect = aEl.getBoundingClientRect();
          const y2 = aRect.top + aRect.height / 2 - cRect.top;
          newEdges.push({ varId: v.id, agentId, y1, y2 });
        });
      });

      setEdges(newEdges);
    };

    // Small delay for layout settle
    const timer = setTimeout(compute, 50);
    window.addEventListener('resize', compute);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', compute);
    };
  }, [variables]);

  // Determine active edges
  const activeEdges = edges.map((e) => {
    let active = false;
    if (hoveredVar && e.varId === hoveredVar) active = true;
    if (hoveredAgent && e.agentId === hoveredAgent) active = true;
    return { ...e, active };
  });

  const anyHover = hoveredVar !== null || hoveredAgent !== null;

  // Determine highlighted states for rows
  const highlightedVars = new Set<string>();
  const highlightedAgents = new Set<string>();
  if (hoveredVar) {
    highlightedVars.add(hoveredVar);
    const v = variables.find((vv) => vv.id === hoveredVar);
    v?.consumers.forEach((aId) => highlightedAgents.add(aId));
  }
  if (hoveredAgent) {
    highlightedAgents.add(hoveredAgent);
    const a = agents.find((aa) => aa.id === hoveredAgent);
    a?.reads.forEach((vId) => highlightedVars.add(vId));
  }

  return (
    <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="t-h2">Context Field</span>
        <span className="t-eyebrow" style={{ marginLeft: 'auto' }}>
          {variables.length} variables &middot; {agents.length} agents
        </span>
      </div>
      <div
        ref={containerRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 120px 1fr',
          position: 'relative',
          padding: '12px 0',
        }}
      >
        {/* Variables column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px 0 12px' }}>
          <div className="t-eyebrow" style={{ padding: '0 12px 8px' }}>Variables</div>
          {variables.map((v) => (
            <VariableRow
              key={v.id}
              v={v}
              highlighted={highlightedVars.has(v.id)}
              onHover={setHoveredVar}
              yRef={setVarRef}
            />
          ))}
        </div>

        {/* SVG connector column */}
        <div style={{ position: 'relative' }}>
          <svg
            ref={svgRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          >
            <defs>
              <linearGradient id="edge-active" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="edge-dim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--line-2)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--line-2)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {activeEdges.map((e, i) => {
              const dim = anyHover && !e.active;
              return (
                <g key={i}>
                  <path
                    d={`M 0 ${e.y1} C 60 ${e.y1}, 60 ${e.y2}, 120 ${e.y2}`}
                    fill="none"
                    stroke={dim ? 'var(--line)' : 'var(--accent)'}
                    strokeWidth={e.active ? 1.5 : 0.5}
                    strokeOpacity={dim ? 0.15 : e.active ? 0.8 : 0.25}
                    style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
                  />
                  {e.active && (
                    <circle r="2.5" fill="var(--accent)">
                      <animateMotion
                        dur="1.5s"
                        repeatCount="indefinite"
                        path={`M 0 ${e.y1} C 60 ${e.y1}, 60 ${e.y2}, 120 ${e.y2}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Agents column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px 0 8px' }}>
          <div className="t-eyebrow" style={{ padding: '0 12px 8px' }}>Agents</div>
          {agents.map((a) => (
            <AgentRow
              key={a.id}
              a={a}
              highlighted={highlightedAgents.has(a.id)}
              onHover={setHoveredAgent}
              yRef={setAgentRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN — ControlPlane
   ────────────────────────────────────────────────────────────────────────── */

function ControlPlane() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div
      id="ontogent-root"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 24,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ── Greeting bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="t-display" style={{ fontSize: 18, color: 'var(--text)' }}>
            Good afternoon, Nick.
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>
            Your fleet shipped <span className="t-num" style={{ color: 'var(--accent)' }}>1,757</span> outputs against{' '}
            <span className="t-num" style={{ color: 'var(--text-2)' }}>9</span> spec variables today.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>{timeStr}</span>
          <div className="wordmark">
            <span className="t-display" style={{ fontSize: 14 }}>ONTOGENT</span>
            <span className="wordmark-by" style={{ fontSize: 8 }}>by Strategnik</span>
          </div>
        </div>
      </div>

      {/* ── Context Field ── */}
      <div style={{ flex: '0 0 auto' }}>
        <ContextField variables={CP_VARIABLES} agents={CP_AGENTS} />
      </div>

      {/* ── Inbox + Activity ── */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        <Inbox items={CP_INBOX} />
        <ActivityStream items={CP_ACTIVITY} />
      </div>

      {/* ── Fleet Health strip ── */}
      <FleetHealth />
    </div>
  );
}

export default ControlPlane;
