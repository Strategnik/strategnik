import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

const STATS = [
  { label: 'Forbidden Terms', value: 47, pill: 'pill--drift' },
  { label: 'Preferred Subs', value: 12, pill: 'pill--accent' },
  { label: 'Live Drift', value: 1, pill: 'pill--warn' },
  { label: 'Agent Cascade', value: 6, pill: 'pill--info' },
];

type Severity = 'S' | 'A' | 'B';

interface ForbiddenTerm {
  sev: Severity;
  term: string;
  reason: string;
  hits7d: number;
  regex: boolean;
}

const FORBIDDEN_TERMS: ForbiddenTerm[] = [
  { sev: 'S', term: 'AI-powered',            reason: 'Empty modifier — says nothing specific',       hits7d: 0, regex: false },
  { sev: 'S', term: 'next-generation',        reason: 'Meaningless superlative',                     hits7d: 0, regex: false },
  { sev: 'S', term: 'revolutionize',          reason: 'Hyperbolic; violates anti-hype archetype',    hits7d: 0, regex: false },
  { sev: 'A', term: 'leverage',              reason: 'Corporate jargon — use "use" or "apply"',     hits7d: 2, regex: false },
  { sev: 'A', term: 'synergy',              reason: 'Buzzword — describe the actual mechanism',     hits7d: 0, regex: false },
  { sev: 'A', term: 'best-in-class',        reason: 'Unsubstantiated claim',                        hits7d: 1, regex: false },
  { sev: 'B', term: 'utilize',              reason: 'Use "use" — shorter, clearer',                 hits7d: 3, regex: false },
  { sev: 'B', term: '/disrupt\\w*/i',        reason: 'Overused tech cliché',                        hits7d: 0, regex: true },
  { sev: 'B', term: 'game-chang(er|ing)',    reason: 'Hyperbolic sports metaphor',                  hits7d: 0, regex: true },
  { sev: 'B', term: 'seamless(ly)?',         reason: 'Nothing is seamless — be specific',           hits7d: 4, regex: true },
];

interface PreferredSub {
  instead: string;
  use: string;
  context: string;
}

const PREFERRED_SUBS: PreferredSub[] = [
  { instead: 'leverage',       use: 'use / apply',           context: 'All copy' },
  { instead: 'utilize',        use: 'use',                   context: 'All copy' },
  { instead: 'AI-powered',     use: 'describe the mechanism', context: 'Product copy' },
  { instead: 'best-in-class',  use: 'cite the metric',        context: 'Claims' },
  { instead: 'seamless',       use: 'describe the UX step',   context: 'Product / landing' },
  { instead: 'end-to-end',     use: 'list the actual stages',  context: 'Architecture copy' },
];

const COMPETITOR_POLICY = [
  { competitor: 'NICE inContact',  rule: 'Name directly — factual comparison only' },
  { competitor: 'Genesys',         rule: 'Name directly — factual comparison only' },
  { competitor: 'Five9',           rule: 'Name directly in battlecards only' },
  { competitor: 'Generic "legacy"', rule: 'Allowed as category, not as slur' },
];

const SOURCES = {
  documents: [
    { name: 'Afiniti Brand Book v4', type: 'PDF' },
    { name: 'Content audit Q1 2026', type: 'Sheet' },
    { name: 'Drift detection log', type: 'System' },
  ],
  extractedNodes: [
    'forbidden-terms',
    'substitutions',
    'severity-rules',
    'regex-patterns',
    'competitor-policy',
  ],
  composedVariable: 'forbidden_lexicon.v3.1.0',
};

/* ── Helpers ───────────────────────────────────────────────── */

function sevColor(sev: Severity): string {
  switch (sev) {
    case 'S': return 'var(--drift)';
    case 'A': return 'var(--staging)';
    case 'B': return 'var(--text-3)';
  }
}

/* ── Component ─────────────────────────────────────────────── */

export default function LexiconScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-identity)"
      categoryLabel="Identity"
      variableName="Forbidden Lexicon"
      version="v3.1.0"
      status="live"
      consumers={6}
      sources={SOURCES}
    >
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {STATS.map((s) => (
          <div key={s.label} className="panel" style={{ flex: 1, padding: '16px 20px', textAlign: 'center' }}>
            <div className="t-num" style={{ fontSize: 28, marginBottom: 4 }}>{s.value}</div>
            <div className="t-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Forbidden terms table */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Forbidden Terms</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 48 }}>SEV</th>
              <th>Term</th>
              <th>Reason</th>
              <th style={{ width: 60, textAlign: 'right' }}>7d Hits</th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {FORBIDDEN_TERMS.map((t, i) => (
              <tr key={i}>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: `${sevColor(t.sev)}1a`,
                    color: sevColor(t.sev),
                  }}>
                    {t.sev}
                  </span>
                </td>
                <td>
                  <span className="t-code" style={{ fontSize: 11, color: 'var(--text)' }}>{t.term}</span>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{t.reason}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="t-num" style={{
                    fontSize: 12,
                    color: t.hits7d > 0 ? 'var(--staging)' : 'var(--text-4)',
                  }}>
                    {t.hits7d}
                  </span>
                </td>
                <td>
                  {t.regex && (
                    <span className="pill pill--info" style={{ fontSize: 9 }}>regex</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preferred substitutions */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Preferred Substitutions</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Instead of</th>
              <th>Use</th>
              <th>Context</th>
            </tr>
          </thead>
          <tbody>
            {PREFERRED_SUBS.map((s, i) => (
              <tr key={i}>
                <td>
                  <span className="t-code" style={{ fontSize: 11, color: 'var(--drift)', textDecoration: 'line-through' }}>
                    {s.instead}
                  </span>
                </td>
                <td style={{ color: 'var(--accent)', fontSize: 12 }}>{s.use}</td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{s.context}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Competitive mention policy */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Competitive Mention Policy</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Competitor</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
            {COMPETITOR_POLICY.map((c, i) => (
              <tr key={i}>
                <td className="t-code" style={{ fontSize: 11 }}>{c.competitor}</td>
                <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{c.rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VariablePage>
  );
}
