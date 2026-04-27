import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

interface TestSuite {
  name: string;
  description: string;
  pass: number;
  fail: number;
  time: string;
  errors?: string[];
}

const SUITES: TestSuite[] = [
  { name: 'schema-validation',   description: 'Validates YAML structure against spec JSON schema',            pass: 12, fail: 0, time: '1.2s' },
  { name: 'forbidden-lexicon',   description: 'Scans output for forbidden terms and near-matches',            pass: 8,  fail: 0, time: '0.8s' },
  { name: 'tone-axis-bounds',    description: 'Checks tone axis values are within configured ranges',         pass: 6,  fail: 1, time: '2.1s', errors: ['FAIL: voice-spec.yaml warmth=0.40 exceeds upper bound 0.38 for archetype "Pragmatic Operator"'] },
  { name: 'cadence-compliance',  description: 'Validates publish frequency against cadence rules',            pass: 4,  fail: 0, time: '0.4s' },
  { name: 'icp-completeness',    description: 'Ensures all required ICP fields populated per segment',        pass: 7,  fail: 1, time: '1.7s', errors: ['FAIL: icp-buyer.yaml enterprise segment missing required field: annual_contract_value_range'] },
  { name: 'governance-gates',    description: 'Runs all CI gate checks: schema, drift, permissions',          pass: 9,  fail: 0, time: '3.2s' },
  { name: 'cross-ref-integrity', description: 'Validates all $ref and import paths resolve correctly',        pass: 5,  fail: 0, time: '0.9s' },
  { name: 'drift-regression',    description: 'Ensures previous drift violations have not regressed',         pass: 6,  fail: 0, time: '1.4s' },
];

const TOTAL_PASS = SUITES.reduce((a, s) => a + s.pass, 0);
const TOTAL_FAIL = SUITES.reduce((a, s) => a + s.fail, 0);

/* ── Run history (last 12 runs) ─────────────────────────────────────── */

const RUN_HISTORY = [
  { pass: 55, fail: 0 },
  { pass: 57, fail: 0 },
  { pass: 54, fail: 1 },
  { pass: 57, fail: 0 },
  { pass: 56, fail: 0 },
  { pass: 57, fail: 0 },
  { pass: 55, fail: 2 },
  { pass: 57, fail: 0 },
  { pass: 53, fail: 3 },
  { pass: 57, fail: 0 },
  { pass: 56, fail: 1 },
  { pass: 57, fail: 2 },
];

/* ── Coverage by variable ───────────────────────────────────────────── */

const COVERAGE = [
  { variable: 'voice-spec.yaml',       covered: 18, total: 20 },
  { variable: 'forbidden-lexicon.yaml', covered: 8,  total: 8 },
  { variable: 'positioning.yaml',       covered: 9,  total: 12 },
  { variable: 'icp-buyer.yaml',         covered: 6,  total: 7 },
  { variable: 'cadence-rules.yaml',     covered: 4,  total: 4 },
  { variable: 'topic-pillars.yaml',     covered: 5,  total: 6 },
];

/* ── Component ──────────────────────────────────────────────────────── */

export default function TestsScreen() {
  const [expandedSuite, setExpandedSuite] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 1120 }}>
      {/* Main */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 className="t-h1">Governance Tests</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
              <span className="t-num" style={{ color: 'var(--ok)' }}>{TOTAL_PASS} passing</span>
              <span style={{ color: 'var(--text-4)' }}>&middot;</span>
              <span className="t-num" style={{ color: 'var(--drift)' }}>{TOTAL_FAIL} failing</span>
              <span style={{ color: 'var(--text-4)' }}>&middot;</span>
              <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>last run 47s ago</span>
            </div>
          </div>
          <button className="btn btn--primary">Run all tests</button>
        </div>

        {/* Test suites */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUITES.map((suite) => {
            const hasFail = suite.fail > 0;
            const expanded = expandedSuite === suite.name;

            return (
              <div
                key={suite.name}
                className="panel"
                style={{
                  overflow: 'hidden',
                  borderLeft: `3px solid ${hasFail ? 'var(--drift)' : 'var(--ok)'}`,
                  cursor: hasFail ? 'pointer' : 'default',
                }}
                onClick={() => hasFail && setExpandedSuite(expanded ? null : suite.name)}
              >
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Status icon */}
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      background: hasFail ? 'var(--drift-soft)' : 'var(--ok-soft)',
                      color: hasFail ? 'var(--drift)' : 'var(--ok)',
                      flexShrink: 0,
                    }}
                  >
                    {hasFail ? '\u2716' : '\u2713'}
                  </span>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="t-code" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                        {suite.name}
                      </span>
                      <span className="pill pill--ok" style={{ fontSize: 9 }}>{suite.pass} pass</span>
                      {hasFail && (
                        <span className="pill pill--err" style={{ fontSize: 9 }}>{suite.fail} fail</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                      {suite.description}
                    </div>
                  </div>

                  {/* Time */}
                  <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-4)', flexShrink: 0 }}>
                    {suite.time}
                  </span>
                </div>

                {/* Error details */}
                {hasFail && expanded && suite.errors && (
                  <div
                    style={{
                      padding: '10px 16px 14px 52px',
                      background: 'rgba(239,68,68,0.05)',
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    {suite.errors.map((err, i) => (
                      <div
                        key={i}
                        className="t-code"
                        style={{ fontSize: 11, color: 'var(--drift)', lineHeight: 1.6 }}
                      >
                        {err}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right rail */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Run history */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Run history (last 12)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
            {RUN_HISTORY.map((run, i) => {
              const total = run.pass + run.fail;
              const failPct = run.fail / total;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                  <div
                    style={{
                      width: '100%',
                      height: 60,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {run.fail > 0 && (
                      <div style={{ height: `${failPct * 100}%`, background: 'var(--drift)', minHeight: 3 }} />
                    )}
                    <div style={{ flex: 1, background: 'var(--ok)', opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span className="t-label" style={{ fontSize: 9 }}>12 runs ago</span>
            <span className="t-label" style={{ fontSize: 9 }}>latest</span>
          </div>
        </div>

        {/* Coverage by variable */}
        <div className="panel" style={{ padding: 16 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Coverage by variable</div>
          {COVERAGE.map((c) => {
            const pct = Math.round((c.covered / c.total) * 100);
            return (
              <div key={c.variable} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span className="t-code" style={{ fontSize: 10.5, color: 'var(--text-2)' }}>{c.variable}</span>
                  <span className="t-num" style={{ fontSize: 10.5, color: pct === 100 ? 'var(--ok)' : 'var(--staging)' }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct === 100 ? 'var(--ok)' : 'var(--staging)',
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
