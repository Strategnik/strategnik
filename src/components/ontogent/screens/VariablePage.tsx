import { useState } from 'react';

/* ── Types ─────────────────────────────────────────────────── */

interface SourceDoc {
  name: string;
  type: string;
}

interface SourceLineageProps {
  documents: SourceDoc[];
  extractedNodes: string[];
  composedVariable: string;
}

type VariableStatus = 'live' | 'staging' | 'review' | 'draft';

interface VariablePageProps {
  categoryDot: string;      // CSS color for the dot
  categoryLabel: string;    // e.g. "Identity"
  variableName: string;     // e.g. "Voice & Tone"
  version: string;          // e.g. "v3.1.2"
  status: VariableStatus;
  consumers: number;
  sources: SourceLineageProps;
  children: React.ReactNode;
}

/* ── Helpers ───────────────────────────────────────────────── */

function statusPill(status: VariableStatus): string {
  switch (status) {
    case 'live':    return 'pill--ok';
    case 'staging': return 'pill--staging';
    case 'review':  return 'pill--review';
    case 'draft':   return 'pill--soft';
  }
}

/* ── SourceLineage ─────────────────────────────────────────── */

function SourceLineage({ documents, extractedNodes, composedVariable }: SourceLineageProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-3)',
        overflow: 'hidden',
        marginTop: 20,
      }}
    >
      {/* Collapsed strip */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 16px',
          background: 'none',
          border: 'none',
          color: 'var(--text-2)',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        <span className="t-eyebrow" style={{ color: 'var(--text-3)' }}>
          Source Lineage
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="t-num" style={{ color: 'var(--accent)', fontSize: 13 }}>
            {documents.length}
          </span>
          <span style={{ color: 'var(--text-4)' }}>docs</span>
          <span style={{ color: 'var(--line-3)', margin: '0 4px' }}>→</span>
          <span className="t-num" style={{ color: 'var(--accent)', fontSize: 13 }}>
            {extractedNodes.length}
          </span>
          <span style={{ color: 'var(--text-4)' }}>nodes</span>
          <span style={{ color: 'var(--line-3)', margin: '0 4px' }}>→</span>
          <span className="t-code" style={{ color: 'var(--text)', fontSize: 11 }}>
            {composedVariable}
          </span>
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--text-4)', fontSize: 11 }}>
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 24 }}>
          {/* Documents */}
          <div style={{ flex: 1 }}>
            <div className="t-label" style={{ marginBottom: 8 }}>Documents</div>
            {documents.map((doc, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 0',
                  borderBottom: '1px solid var(--line)',
                  fontSize: 12,
                }}
              >
                <span className="pill pill--soft" style={{ fontSize: 9 }}>{doc.type}</span>
                <span style={{ color: 'var(--text-2)' }}>{doc.name}</span>
              </div>
            ))}
          </div>

          {/* Extracted nodes */}
          <div style={{ flex: 1 }}>
            <div className="t-label" style={{ marginBottom: 8 }}>Extracted Nodes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {extractedNodes.map((node, i) => (
                <span key={i} className="pill pill--accent">{node}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── VariablePage ──────────────────────────────────────────── */

export default function VariablePage({
  categoryDot,
  categoryLabel,
  variableName,
  version,
  status,
  consumers,
  sources,
  children,
}: VariablePageProps) {
  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          {/* Category + variable name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="dot" style={{ background: categoryDot }} />
            <span className="t-eyebrow">{categoryLabel}</span>
          </div>
          <h1 className="t-h1" style={{ fontSize: 24, marginBottom: 8 }}>{variableName}</h1>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="t-code" style={{ color: 'var(--text-3)', fontSize: 11 }}>
              {version}
            </span>
            <span className={`pill ${statusPill(status)}`}>
              {status === 'live' && <span className="dot dot--pulse" style={{ background: 'var(--ok)', width: 5, height: 5 }} />}
              {status}
            </span>
            <span className="pill pill--soft">
              {consumers} consumer{consumers !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button className="btn btn--ghost">History</button>
          <button className="btn btn--ghost">Edit</button>
          {status === 'staging' && (
            <button className="btn btn--staging">Promote to Live</button>
          )}
          {status === 'review' && (
            <button className="btn btn--review">Approve</button>
          )}
          {status === 'live' && (
            <button className="btn btn--primary">Push Update</button>
          )}
        </div>
      </div>

      {/* Source lineage */}
      <SourceLineage {...sources} />

      {/* Variable-specific content */}
      <div style={{ marginTop: 28 }}>
        {children}
      </div>
    </div>
  );
}

export { SourceLineage };
export type { VariablePageProps, SourceLineageProps, SourceDoc, VariableStatus };
