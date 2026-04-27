import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

interface TopicPillar {
  name: string;
  weight: number;
  color: string;
  posts90d: number;
  subtopics: string[];
}

const PILLARS: TopicPillar[] = [
  {
    name: 'Contact Center Transformation',
    weight: 35,
    color: 'var(--accent)',
    posts90d: 14,
    subtopics: ['Agent experience', 'ACD modernization', 'Behavioral routing', 'CX metrics'],
  },
  {
    name: 'Revenue Attribution & Proof',
    weight: 30,
    color: 'var(--info)',
    posts90d: 11,
    subtopics: ['A/B testing methodology', 'Revenue per call', 'Controlled experiments', 'ROI frameworks'],
  },
  {
    name: 'AI Ethics & Explainability',
    weight: 20,
    color: 'var(--review)',
    posts90d: 8,
    subtopics: ['Algorithmic fairness', 'Bias auditing', 'Transparency dashboards', 'Regulatory compliance'],
  },
  {
    name: 'Enterprise Deployment Patterns',
    weight: 10,
    color: 'var(--staging)',
    posts90d: 4,
    subtopics: ['Integration architecture', 'Change management', 'Rollback strategies', 'SLA design'],
  },
  {
    name: 'Industry POV & Thought Leadership',
    weight: 5,
    color: 'var(--text-3)',
    posts90d: 2,
    subtopics: ['Analyst relations', 'Conference takeaways', 'Market commentary'],
  },
];

const OUT_OF_SCOPE = [
  'Generic "AI will change everything" takes',
  'Cryptocurrency / blockchain / Web3',
  'Consumer-facing AI assistants (Alexa, Siri)',
  'Recruitment / HR tech (unless contact center staffing)',
  'Competitor product announcements (covered in competitive intel, not content)',
];

const SOURCES = {
  documents: [
    { name: 'Content strategy brief', type: 'Doc' },
    { name: 'SEO keyword clusters', type: 'Sheet' },
    { name: 'Editorial calendar Q1–Q2', type: 'Sheet' },
  ],
  extractedNodes: [
    'pillar-definitions',
    'weight-distribution',
    'subtopic-map',
    'exclusion-list',
  ],
  composedVariable: 'topic_pillars.v1.4.2',
};

/* ── Component ─────────────────────────────────────────────── */

export default function TopicsScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-content)"
      categoryLabel="Content"
      variableName="Topic Pillars"
      version="v1.4.2"
      status="live"
      consumers={2}
      sources={SOURCES}
    >
      {/* Stacked bar chart */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>Weight Distribution</div>
        <div style={{
          display: 'flex',
          height: 32,
          borderRadius: 'var(--r-2)',
          overflow: 'hidden',
          marginBottom: 12,
        }}>
          {PILLARS.map((p) => (
            <div
              key={p.name}
              style={{
                width: `${p.weight}%`,
                background: p.color,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={`${p.name}: ${p.weight}%`}
            >
              {p.weight >= 15 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: '#04140f' }}>{p.weight}%</span>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {PILLARS.map((p) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-2)' }}>
              <span className="dot" style={{ background: p.color }} />
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Pillar cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {PILLARS.map((p) => (
          <div key={p.name} className="panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span className="dot" style={{ background: p.color, width: 9, height: 9 }} />
              <div className="t-h3" style={{ flex: 1, color: 'var(--text)' }}>{p.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div>
                <div className="t-label" style={{ marginBottom: 2 }}>Weight</div>
                <div className="t-num" style={{ fontSize: 22, color: p.color }}>{p.weight}%</div>
              </div>
              <div>
                <div className="t-label" style={{ marginBottom: 2 }}>Posts (90d)</div>
                <div className="t-num" style={{ fontSize: 22, color: 'var(--text-2)' }}>{p.posts90d}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {p.subtopics.map((st) => (
                <span key={st} className="pill pill--soft">{st}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Out of scope */}
      <div className="panel" style={{ padding: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>Out of Scope</div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {OUT_OF_SCOPE.map((item, i) => (
            <li key={i} style={{ color: 'var(--drift)', fontSize: 12, marginBottom: 6 }}>{item}</li>
          ))}
        </ul>
      </div>
    </VariablePage>
  );
}
