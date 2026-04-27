import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

const ARCHETYPE = {
  primary: 'Pragmatist',
  secondary: 'Builder',
  anti: 'Anti-Hype',
};

const PRINCIPLES = [
  { id: 1, text: 'Lead with the problem, not the product' },
  { id: 2, text: 'Proof over promise — every claim gets a receipt' },
  { id: 3, text: 'Respect the operator — no dumbing down' },
  { id: 4, text: 'Specificity is credibility' },
  { id: 5, text: 'Earn attention, never demand it' },
];

const TONE_AXES: { label: string; low: string; high: string; value: number }[] = [
  { label: 'Formality',   low: 'Casual',     high: 'Formal',    value: 65 },
  { label: 'Confidence',  low: 'Tentative',  high: 'Assertive', value: 82 },
  { label: 'Warmth',      low: 'Clinical',   high: 'Warm',      value: 40 },
  { label: 'Complexity',  low: 'Simple',     high: 'Technical', value: 70 },
  { label: 'Urgency',     low: 'Patient',    high: 'Urgent',    value: 35 },
];

const SIGNATURE_MOVES = [
  'Open with a contrarian reframe',
  'Name the elephant in the room',
  'Use operator-native metaphors (deploys, not launches)',
  'Close with a single actionable takeaway',
];

const APPROVED_PHRASES = [
  'Contact center AI that actually works',
  'Behavioral pairing — not just routing',
  'Revenue you can prove',
  'The math works or it doesn\'t ship',
];

const SOURCES = {
  documents: [
    { name: 'Afiniti Brand Book v4', type: 'PDF' },
    { name: 'Sarah writing samples (47 pieces)', type: 'Corpus' },
    { name: 'Voice training corpus', type: 'Dataset' },
    { name: 'Founder podcasts (12 episodes)', type: 'Audio' },
  ],
  extractedNodes: [
    'tone-axes',
    'archetype-scores',
    'phrase-bank',
    'anti-patterns',
    'voice-principles',
  ],
  composedVariable: 'voice_tone.v3.1.2',
};

/* ── Component ─────────────────────────────────────────────── */

function ToneSlider({ label, low, high, value }: typeof TONE_AXES[number]) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <span className="t-label" style={{ width: 80, flexShrink: 0, textAlign: 'right' }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-4)', width: 60, textAlign: 'right' }}>
        {low}
      </span>
      <div style={{
        flex: 1,
        height: 6,
        background: 'var(--bg-3)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${value}%`,
          background: 'var(--accent)',
          borderRadius: 3,
          opacity: 0.7,
        }} />
        <div style={{
          position: 'absolute',
          left: `${value}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 12,
          background: 'var(--accent)',
          borderRadius: '50%',
          border: '2px solid var(--bg-1)',
        }} />
      </div>
      <span style={{ fontSize: 10, color: 'var(--text-4)', width: 60 }}>
        {high}
      </span>
      <span className="t-num" style={{ width: 32, textAlign: 'right', fontSize: 12, color: 'var(--text-2)' }}>
        {value}
      </span>
    </div>
  );
}

export default function VoiceScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-identity)"
      categoryLabel="Identity"
      variableName="Voice & Tone"
      version="v3.1.2"
      status="live"
      consumers={5}
      sources={SOURCES}
    >
      {/* Archetype */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>Archetype</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span className="pill pill--accent">{ARCHETYPE.primary}</span>
          <span className="pill pill--accent">{ARCHETYPE.secondary}</span>
          <span className="pill pill--drift">{ARCHETYPE.anti}</span>
        </div>
      </div>

      {/* Operating Principles */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 12 }}>5 Operating Principles</div>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {PRINCIPLES.map((p) => (
            <li key={p.id} style={{ marginBottom: 6, color: 'var(--text-2)', fontSize: 13 }}>
              {p.text}
            </li>
          ))}
        </ol>
      </div>

      {/* Tone Axes */}
      <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
        <div className="t-eyebrow" style={{ marginBottom: 16 }}>Tone Axes</div>
        {TONE_AXES.map((axis) => (
          <ToneSlider key={axis.label} {...axis} />
        ))}
      </div>

      {/* Signature Moves */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="panel" style={{ padding: 20 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Signature Moves</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {SIGNATURE_MOVES.map((m, i) => (
              <li key={i} style={{ marginBottom: 6, color: 'var(--text-2)', fontSize: 12 }}>{m}</li>
            ))}
          </ul>
        </div>

        <div className="panel" style={{ padding: 20 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Approved Phrases</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {APPROVED_PHRASES.map((p, i) => (
              <div key={i} className="t-code" style={{
                fontSize: 11,
                color: 'var(--accent)',
                padding: '6px 10px',
                background: 'var(--accent-soft)',
                borderRadius: 'var(--r-2)',
              }}>
                "{p}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </VariablePage>
  );
}
