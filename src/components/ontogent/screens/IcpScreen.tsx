import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

interface Persona {
  title: string;
  domain: string;
  technicalLevel: 'Low' | 'Medium' | 'High';
  caresAbout: string[];
  topObjection: string;
}

const PERSONAS: Persona[] = [
  {
    title: 'VP Customer Experience — Carrier',
    domain: 'Telecom / Insurance',
    technicalLevel: 'Medium',
    caresAbout: [
      'NPS improvement tied to revenue',
      'Reducing average handle time without sacrificing CSAT',
      'Board-reportable ROI within 90 days',
    ],
    topObjection: '"We already have skills-based routing — why layer on behavioral pairing?"',
  },
  {
    title: 'Director Contact Center Operations',
    domain: 'Financial Services',
    technicalLevel: 'High',
    caresAbout: [
      'Operational disruption during deployment',
      'Integration with existing ACD/IVR stack',
      'Agent utilization and schedule adherence',
    ],
    topObjection: '"What happens when the model is wrong? My agents still take the call."',
  },
  {
    title: 'Industry Analyst',
    domain: 'Gartner / Forrester / IDC',
    technicalLevel: 'Medium',
    caresAbout: [
      'Differentiated positioning vs. CCaaS incumbents',
      'Peer-reviewed outcome data',
      'Scalability across verticals',
    ],
    topObjection: '"How is this different from predictive routing in Genesys or NICE?"',
  },
  {
    title: 'Legal / Compliance',
    domain: 'Enterprise (regulated)',
    technicalLevel: 'Low',
    caresAbout: [
      'Data residency and PII handling',
      'Algorithmic bias audit results',
      'Consent and opt-out mechanisms',
    ],
    topObjection: '"Can you prove the model doesn\'t discriminate on protected classes?"',
  },
];

const DIFF_INFO = {
  added: 1,
  modified: 2,
  removed: 0,
  diffFrom: 'v2.0.3',
};

const SOURCES = {
  documents: [
    { name: 'Win/loss analysis 2025', type: 'Sheet' },
    { name: 'Customer interview transcripts', type: 'Corpus' },
    { name: 'Gartner inquiry notes', type: 'Doc' },
    { name: 'Sales call recordings (Q4)', type: 'Audio' },
  ],
  extractedNodes: [
    'persona-cards',
    'objection-bank',
    'domain-mapping',
    'technical-levels',
  ],
  composedVariable: 'icp_buyer.v2.1.0-rc1',
};

/* ── Helpers ───────────────────────────────────────────────── */

function techLevelColor(level: string): string {
  switch (level) {
    case 'High':   return 'var(--accent)';
    case 'Medium': return 'var(--staging)';
    case 'Low':    return 'var(--text-3)';
    default:       return 'var(--text-3)';
  }
}

/* ── Component ─────────────────────────────────────────────── */

export default function IcpScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-buyer)"
      categoryLabel="Buyer"
      variableName="ICP & Buyer Personas"
      version="v2.1.0-rc1"
      status="staging"
      consumers={4}
      sources={SOURCES}
    >
      {/* Staged banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'var(--staging-soft)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 'var(--r-3)',
        marginBottom: 24,
      }}>
        <span className="pill pill--staging">STAGED</span>
        <span style={{ color: 'var(--staging)', fontSize: 12 }}>
          Diff from {DIFF_INFO.diffFrom}: +{DIFF_INFO.added} added, ~{DIFF_INFO.modified} modified, -{DIFF_INFO.removed} removed
        </span>
        <button className="btn btn--staging btn--sm" style={{ marginLeft: 'auto' }}>
          View Diff
        </button>
      </div>

      {/* Persona cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {PERSONAS.map((p, i) => (
          <div key={i} className="panel" style={{ padding: 20 }}>
            <div className="t-h3" style={{ marginBottom: 12, color: 'var(--text)' }}>
              {p.title}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span className="pill pill--soft">{p.domain}</span>
              <span className="pill" style={{
                background: `${techLevelColor(p.technicalLevel)}1a`,
                color: techLevelColor(p.technicalLevel),
                border: `1px solid ${techLevelColor(p.technicalLevel)}44`,
              }}>
                Tech: {p.technicalLevel}
              </span>
            </div>

            <div className="t-label" style={{ marginBottom: 6 }}>Cares About</div>
            <ul style={{ margin: '0 0 12px', paddingLeft: 16 }}>
              {p.caresAbout.map((c, j) => (
                <li key={j} style={{ color: 'var(--text-2)', fontSize: 12, marginBottom: 4 }}>{c}</li>
              ))}
            </ul>

            <div className="t-label" style={{ marginBottom: 6 }}>Top Objection</div>
            <div style={{
              padding: '8px 12px',
              background: 'var(--bg-3)',
              borderRadius: 'var(--r-2)',
              borderLeft: '3px solid var(--drift)',
              color: 'var(--text-2)',
              fontSize: 12,
              fontStyle: 'italic',
            }}>
              {p.topObjection}
            </div>
          </div>
        ))}
      </div>
    </VariablePage>
  );
}
