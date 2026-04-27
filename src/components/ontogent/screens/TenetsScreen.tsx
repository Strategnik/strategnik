import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

interface Tenet {
  id: number;
  priority: 'P1' | 'P2';
  tenet: string;
  manifests: number;
  violations: number;
}

const TENETS: Tenet[] = [
  { id: 1, priority: 'P1', tenet: 'Proof over promise — every claim gets evidence',                    manifests: 142, violations: 3 },
  { id: 2, priority: 'P1', tenet: 'Name the mechanism — never hide behind vague abstractions',         manifests: 98,  violations: 7 },
  { id: 3, priority: 'P1', tenet: 'Respect the operator — assume technical competence',                manifests: 215, violations: 1 },
  { id: 4, priority: 'P2', tenet: 'Acknowledge limitations before competitors do',                     manifests: 34,  violations: 0 },
  { id: 5, priority: 'P2', tenet: 'One idea per asset — if you need a second, make a second asset',    manifests: 67,  violations: 12 },
  { id: 6, priority: 'P2', tenet: 'Earn attention with value, never demand it with hype',              manifests: 89,  violations: 2 },
];

const SOURCES = {
  documents: [
    { name: 'Afiniti Brand Book v4', type: 'PDF' },
    { name: 'Sarah strategy memos (Q1–Q4)', type: 'Docs' },
    { name: 'Content audit results', type: 'Sheet' },
  ],
  extractedNodes: [
    'tenet-statements',
    'priority-ranks',
    'manifest-counts',
    'violation-log',
  ],
  composedVariable: 'tenets.v2.4.0',
};

/* ── Component ─────────────────────────────────────────────── */

export default function TenetsScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-identity)"
      categoryLabel="Identity"
      variableName="Tenets"
      version="v2.4.0"
      status="live"
      consumers={5}
      sources={SOURCES}
    >
      {/* Explanation panel */}
      <div className="panel" style={{
        padding: 20,
        marginBottom: 24,
        borderLeft: '3px solid var(--accent)',
      }}>
        <div className="t-h3" style={{ marginBottom: 8, color: 'var(--text)' }}>
          What tenets do
        </div>
        <p style={{ margin: 0, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6 }}>
          Tenets are non-negotiable content principles. Every agent checks its output against
          the active tenet set before publishing. A tenet violation blocks the content pipeline
          and creates a review task. Manifests count how many published assets successfully
          embody each tenet — higher is better.
        </p>
      </div>

      {/* Tenets table */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 36 }}>#</th>
              <th style={{ width: 48 }}>Pri</th>
              <th>Tenet</th>
              <th style={{ width: 80, textAlign: 'right' }}>Manifests</th>
              <th style={{ width: 80, textAlign: 'right' }}>Violations</th>
            </tr>
          </thead>
          <tbody>
            {TENETS.map((t) => (
              <tr key={t.id}>
                <td>
                  <span className="t-num" style={{ fontSize: 12, color: 'var(--text-4)' }}>
                    {t.id}
                  </span>
                </td>
                <td>
                  <span className={`pill ${t.priority === 'P1' ? 'pill--accent' : 'pill--soft'}`}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ color: 'var(--text)', fontSize: 13 }}>{t.tenet}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="t-num" style={{ fontSize: 13, color: 'var(--ok)' }}>
                    {t.manifests}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="t-num" style={{
                    fontSize: 13,
                    color: t.violations > 5 ? 'var(--drift)' : t.violations > 0 ? 'var(--staging)' : 'var(--text-4)',
                  }}>
                    {t.violations}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VariablePage>
  );
}
