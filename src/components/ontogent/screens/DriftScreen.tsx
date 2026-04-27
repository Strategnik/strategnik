import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const STATS = [
  { label: 'Agents drifting',  value: '3',    color: 'var(--drift)' },
  { label: 'Paused',           value: '1',    color: 'var(--staging)' },
  { label: 'In tolerance',     value: '5',    color: 'var(--ok)' },
  { label: 'Avg drift',        value: '0.14', color: 'var(--text)' },
];

interface DriftRow {
  agent: string;
  sev: 'critical' | 'warning' | 'ok';
  delta: number;
  violations: string[];
  action: string;
  age: string;
}

const ROWS: DriftRow[] = [
  { agent: 'support-bot',     sev: 'critical', delta: 0.31, violations: ['tone: warmth +0.18', 'forbidden term: "cutting-edge"'],   action: 'Pause & re-align', age: '2h 14m' },
  { agent: 'ad-copy-engine',  sev: 'warning',  delta: 0.19, violations: ['urgency axis +0.12'],                                     action: 'Review queued',     age: '4h 02m' },
  { agent: 'social-poster',   sev: 'warning',  delta: 0.16, violations: ['cadence: over max_frequency by 2x'],                      action: 'Review queued',     age: '6h 31m' },
  { agent: 'content-gen',     sev: 'ok',       delta: 0.07, violations: [],                                                          action: '\u2014',            age: '\u2014' },
  { agent: 'email-drafter',   sev: 'ok',       delta: 0.04, violations: [],                                                          action: '\u2014',            age: '\u2014' },
  { agent: 'blog-writer',     sev: 'ok',       delta: 0.02, violations: [],                                                          action: '\u2014',            age: '\u2014' },
];

const SEV_PILL: Record<string, string> = {
  critical: 'pill--drift',
  warning: 'pill--staging',
  ok: 'pill--ok',
};

/* ── SVG chart data (7 days, 4 agents) ──────────────────────────────── */

const CHART_W = 640;
const CHART_H = 160;
const TOLERANCE = 0.25;

interface ChartSeries {
  agent: string;
  color: string;
  points: number[];
}

const SERIES: ChartSeries[] = [
  { agent: 'support-bot',    color: 'var(--drift)',   points: [0.08, 0.11, 0.14, 0.18, 0.22, 0.27, 0.31] },
  { agent: 'ad-copy-engine', color: 'var(--staging)', points: [0.05, 0.07, 0.10, 0.12, 0.14, 0.17, 0.19] },
  { agent: 'social-poster',  color: 'var(--review)',  points: [0.03, 0.04, 0.06, 0.09, 0.11, 0.14, 0.16] },
  { agent: 'content-gen',    color: 'var(--ok)',      points: [0.06, 0.05, 0.06, 0.07, 0.06, 0.07, 0.07] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toPath(points: number[]): string {
  const maxY = 0.40;
  return points
    .map((p, i) => {
      const x = 40 + (i / (points.length - 1)) * (CHART_W - 60);
      const y = CHART_H - 24 - ((p / maxY) * (CHART_H - 40));
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

/* ── Component ──────────────────────────────────────────────────────── */

export default function DriftScreen() {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 960 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 className="t-h1">Drift Detection</h1>
          <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            Monitoring agent alignment to spec variables
          </p>
        </div>
        <button className="btn btn--ghost">Configure tolerance</button>
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

      {/* Chart */}
      <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="t-eyebrow">Drift over 7d</div>
          <div style={{ display: 'flex', gap: 16 }}>
            {SERIES.map((s) => (
              <div
                key={s.agent}
                style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', opacity: hoveredAgent && hoveredAgent !== s.agent ? 0.3 : 1 }}
                onMouseEnter={() => setHoveredAgent(s.agent)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <span className="dot" style={{ background: s.color }} />
                <span style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{s.agent}</span>
              </div>
            ))}
          </div>
        </div>

        <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`} style={{ width: '100%', height: 'auto' }}>
          {/* Grid lines */}
          {[0, 0.1, 0.2, 0.3, 0.4].map((v) => {
            const y = CHART_H - 24 - ((v / 0.4) * (CHART_H - 40));
            return (
              <g key={v}>
                <line x1={40} y1={y} x2={CHART_W - 20} y2={y} stroke="var(--line)" strokeWidth={0.5} />
                <text x={32} y={y + 3} fill="var(--text-4)" fontSize={9} textAnchor="end" fontFamily="monospace">
                  {v.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Tolerance line */}
          {(() => {
            const tolY = CHART_H - 24 - ((TOLERANCE / 0.4) * (CHART_H - 40));
            return (
              <g>
                <line x1={40} y1={tolY} x2={CHART_W - 20} y2={tolY} stroke="var(--drift)" strokeWidth={1} strokeDasharray="4 3" opacity={0.6} />
                <text x={CHART_W - 16} y={tolY - 4} fill="var(--drift)" fontSize={9} fontFamily="monospace">tolerance</text>
              </g>
            );
          })()}

          {/* Day labels */}
          {DAYS.map((d, i) => {
            const x = 40 + (i / 6) * (CHART_W - 60);
            return (
              <text key={d} x={x} y={CHART_H - 4} fill="var(--text-4)" fontSize={9} textAnchor="middle" fontFamily="monospace">
                {d}
              </text>
            );
          })}

          {/* Lines */}
          {SERIES.map((s) => (
            <path
              key={s.agent}
              d={toPath(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth={hoveredAgent === s.agent ? 2.5 : 1.5}
              opacity={hoveredAgent && hoveredAgent !== s.agent ? 0.2 : 1}
            />
          ))}
        </svg>
      </div>

      {/* Table */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Agent</th>
              <th>Sev</th>
              <th>\u0394 delta</th>
              <th>Top violations</th>
              <th>Action</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.agent}>
                <td>
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>{r.agent}</span>
                </td>
                <td>
                  <span className={`pill ${SEV_PILL[r.sev]}`}>{r.sev}</span>
                </td>
                <td>
                  <span className="t-num" style={{ color: r.sev === 'critical' ? 'var(--drift)' : r.sev === 'warning' ? 'var(--staging)' : 'var(--text-3)' }}>
                    {r.delta.toFixed(2)}
                  </span>
                </td>
                <td>
                  {r.violations.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {r.violations.map((v, i) => (
                        <span key={i} className="t-code" style={{ fontSize: 11, color: 'var(--text-3)' }}>{v}</span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-4)' }}>\u2014</span>
                  )}
                </td>
                <td>
                  {r.action !== '\u2014' ? (
                    <button className="btn btn--sm btn--ghost">{r.action}</button>
                  ) : (
                    <span style={{ color: 'var(--text-4)' }}>\u2014</span>
                  )}
                </td>
                <td>
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.age}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
