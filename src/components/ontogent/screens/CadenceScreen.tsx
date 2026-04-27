import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

interface SurfaceRule {
  surface: string;
  format: string;
  length: string;
}

const SURFACE_RULES: SurfaceRule[] = [
  { surface: 'Blog post',          format: 'Markdown → HTML',       length: '1,200–2,000 words' },
  { surface: 'LinkedIn post',      format: 'Plain text, line breaks', length: '150–280 words' },
  { surface: 'Email (nurture)',    format: 'HTML email',             length: '80–150 words body' },
  { surface: 'Landing page hero',  format: 'Headline + subhead',     length: '6–12 words / 20–35 words' },
  { surface: 'Ad copy (search)',   format: 'Google RSA format',      length: '30 char headline / 90 char desc' },
  { surface: 'Sales one-pager',    format: 'PDF — single page',      length: '300–500 words' },
  { surface: 'Analyst brief',      format: 'Word / PDF',             length: '800–1,500 words' },
  { surface: 'Social (X/Twitter)', format: 'Plain text',             length: '≤ 280 chars' },
];

interface PovRule {
  rule: string;
  value: string;
  note: string;
}

const POV_RULES: PovRule[] = [
  { rule: 'Default person',  value: 'First plural (we/our)',  note: 'Except thought leadership — first singular' },
  { rule: 'CTA person',      value: 'Second (you/your)',      note: 'Always address the reader directly' },
  { rule: 'Contractions',    value: 'Yes — always',           note: '"We\'re" not "We are" — sounds human' },
  { rule: 'Em-dash',         value: 'Preferred over semicolons', note: 'Use for mid-sentence pivots' },
  { rule: 'Oxford comma',    value: 'Always',                 note: 'Non-negotiable' },
  { rule: 'Sentence length', value: 'Vary deliberately',      note: 'Mix short punches with longer unpacks' },
];

interface LengthDefault {
  lengthClass: string;
  range: string;
  surfaces: string;
}

const LENGTH_DEFAULTS: LengthDefault[] = [
  { lengthClass: 'Micro',  range: '≤ 50 words',        surfaces: 'Ad copy, social, CTAs' },
  { lengthClass: 'Short',  range: '50–300 words',       surfaces: 'Email, one-pagers, landing sections' },
  { lengthClass: 'Medium', range: '300–1,200 words',    surfaces: 'Blog posts, case studies' },
  { lengthClass: 'Long',   range: '1,200–3,000 words',  surfaces: 'Analyst briefs, whitepapers, guides' },
];

const SOURCES = {
  documents: [
    { name: 'Afiniti Style Guide v2', type: 'Doc' },
    { name: 'Content calendar (2026)', type: 'Sheet' },
    { name: 'Platform spec sheets', type: 'PDF' },
  ],
  extractedNodes: [
    'surface-rules',
    'pov-defaults',
    'length-classes',
    'format-specs',
  ],
  composedVariable: 'cadence_rules.v1.8.1',
};

/* ── Component ─────────────────────────────────────────────── */

export default function CadenceScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-content)"
      categoryLabel="Content"
      variableName="Cadence Rules"
      version="v1.8.1"
      status="live"
      consumers={3}
      sources={SOURCES}
    >
      {/* By-surface rules */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Rules by Surface</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Surface</th>
              <th>Format</th>
              <th>Length</th>
            </tr>
          </thead>
          <tbody>
            {SURFACE_RULES.map((r, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{r.surface}</td>
                <td>
                  <span className="t-code" style={{ fontSize: 11, color: 'var(--text-2)' }}>{r.format}</span>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{r.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Point of View */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Point of View</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Rule</th>
              <th>Value</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {POV_RULES.map((r, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{r.rule}</td>
                <td>
                  <span className="t-code" style={{ fontSize: 11, color: 'var(--accent)' }}>{r.value}</span>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Length defaults */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Length Defaults by Class</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 100 }}>Class</th>
              <th style={{ width: 160 }}>Range</th>
              <th>Applicable Surfaces</th>
            </tr>
          </thead>
          <tbody>
            {LENGTH_DEFAULTS.map((l, i) => (
              <tr key={i}>
                <td>
                  <span className="pill pill--accent">{l.lengthClass}</span>
                </td>
                <td className="t-num" style={{ fontSize: 12, color: 'var(--text-2)' }}>{l.range}</td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{l.surfaces}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VariablePage>
  );
}
