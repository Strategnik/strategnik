import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

const CATEGORY = 'Behavioral pairing';

interface ValuePillar {
  pillar: string;
  proofPoints: string[];
}

const VALUE_PILLARS: ValuePillar[] = [
  {
    pillar: 'Revenue uplift you can measure',
    proofPoints: [
      '4–7% revenue lift in controlled A/B tests across 3 carriers',
      'Payback period under 90 days for enterprise deployments',
      'Independent audit by Deloitte confirms methodology',
    ],
  },
  {
    pillar: 'Zero operational disruption',
    proofPoints: [
      'Sits alongside existing ACD — no rip-and-replace',
      'Transparent scoring: agents see nothing, supervisors see everything',
      'Kill-switch reverts to standard routing in < 1 second',
    ],
  },
  {
    pillar: 'Behavioral science, not black-box ML',
    proofPoints: [
      'Published research on interpersonal dynamics (Nature, 2020)',
      'Explainability dashboard shows why each pairing was made',
      'No PII enters the model — behavioral signals only',
    ],
  },
];

interface Competitor {
  name: string;
  framing: string;
}

const COMPETITORS: Competitor[] = [
  { name: 'NICE inContact',  framing: 'Skills-based routing — optimizes for agent capability, not customer behavior' },
  { name: 'Genesys',         framing: 'Predictive routing — ML black box, no behavioral science foundation' },
  { name: 'Five9',           framing: 'AI-assisted — bolt-on analytics, not core routing intelligence' },
  { name: 'Legacy ACD',      framing: 'Round-robin / longest-idle — no intelligence layer at all' },
];

const FORBIDDEN_POSITIONING = [
  '"We replace your ACD" — we complement, never replace',
  '"AI that reads minds" — behavioral pairing, not sentiment analysis',
  '"Better than human judgment" — we augment, not override',
  '"Guaranteed results" — we prove results, we don\'t guarantee them',
];

const ELEVATOR_PITCH = 'Afiniti uses behavioral pairing to match each caller with the agent most likely to deliver the best outcome — increasing revenue per call by 4–7% with zero disruption to existing operations.';

const SOURCES = {
  documents: [
    { name: 'Positioning framework v3', type: 'Doc' },
    { name: 'Competitive analysis Q1 2026', type: 'Sheet' },
    { name: 'Founder positioning memo', type: 'Doc' },
    { name: 'Analyst feedback (Gartner)', type: 'Notes' },
  ],
  extractedNodes: [
    'category-frame',
    'value-pillars',
    'competitive-matrix',
    'forbidden-claims',
    'elevator-pitch',
  ],
  composedVariable: 'positioning.v3.0.0',
};

/* ── Component ─────────────────────────────────────────────── */

export default function PositioningScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-competitive)"
      categoryLabel="Competitive"
      variableName="Positioning"
      version="v3.0.0"
      status="review"
      consumers={3}
      sources={SOURCES}
    >
      {/* Review banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'var(--review-soft)',
        border: '1px solid rgba(192,132,252,0.3)',
        borderRadius: 'var(--r-3)',
        marginBottom: 24,
      }}>
        <span className="pill pill--review">REVIEW</span>
        <span style={{ color: 'var(--review)', fontSize: 12 }}>
          Awaiting founder signoff — submitted 2 days ago
        </span>
        <button className="btn btn--review btn--sm" style={{ marginLeft: 'auto' }}>
          Approve & Promote
        </button>
      </div>

      {/* Category */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>Category</div>
        <div className="t-h2" style={{ color: 'var(--accent)' }}>{CATEGORY}</div>
        <p style={{ margin: '8px 0 0', color: 'var(--text-3)', fontSize: 12 }}>
          We define the category, not compete in someone else's. Behavioral pairing is distinct
          from skills-based routing, predictive routing, and AI-assisted contact center tools.
        </p>
      </div>

      {/* Value Pillars */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>Value Pillars</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {VALUE_PILLARS.map((vp, i) => (
            <div key={i} style={{
              padding: 16,
              background: 'var(--bg-2)',
              borderRadius: 'var(--r-2)',
              borderLeft: '3px solid var(--accent)',
            }}>
              <div className="t-h3" style={{ marginBottom: 10, color: 'var(--text)' }}>
                {vp.pillar}
              </div>
              <div className="t-label" style={{ marginBottom: 6 }}>Proof Points</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {vp.proofPoints.map((pp, j) => (
                  <li key={j} style={{ color: 'var(--text-2)', fontSize: 12, marginBottom: 4 }}>{pp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Frame */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Competitive Frame</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Competitor</th>
              <th>Our Framing</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITORS.map((c, i) => (
              <tr key={i}>
                <td className="t-code" style={{ fontSize: 11 }}>{c.name}</td>
                <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{c.framing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Forbidden Positioning + Elevator Pitch */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="panel" style={{ padding: 20 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Forbidden Positioning</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {FORBIDDEN_POSITIONING.map((f, i) => (
              <li key={i} style={{ color: 'var(--drift)', fontSize: 12, marginBottom: 8 }}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="panel" style={{ padding: 20 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Elevator Pitch</div>
          <div style={{
            padding: 16,
            background: 'var(--bg-2)',
            borderRadius: 'var(--r-2)',
            borderLeft: '3px solid var(--accent)',
            color: 'var(--text)',
            fontSize: 14,
            lineHeight: 1.7,
          }}>
            {ELEVATOR_PITCH}
          </div>
        </div>
      </div>
    </VariablePage>
  );
}
