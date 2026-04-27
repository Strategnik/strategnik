import VariablePage from './VariablePage';

/* ── Data ──────────────────────────────────────────────────── */

interface AgentGate {
  agent: string;
  reads: string[];
  gatePolicy: string;
  passRate: number;
  status: 'active' | 'paused' | 'probation';
}

const AGENT_GATES: AgentGate[] = [
  {
    agent: 'Content Writer',
    reads: ['voice', 'lexicon', 'tenets', 'cadence', 'topics'],
    gatePolicy: 'Pre-publish — must pass all P1 tenets + lexicon scan',
    passRate: 94,
    status: 'active',
  },
  {
    agent: 'Social Scheduler',
    reads: ['voice', 'lexicon', 'cadence'],
    gatePolicy: 'Pre-publish — lexicon + length check',
    passRate: 97,
    status: 'active',
  },
  {
    agent: 'Ad Copy Generator',
    reads: ['voice', 'lexicon', 'positioning', 'cadence'],
    gatePolicy: 'Pre-publish — positioning alignment + forbidden claims',
    passRate: 88,
    status: 'active',
  },
  {
    agent: 'Battlecard Builder',
    reads: ['positioning', 'icp', 'lexicon'],
    gatePolicy: 'Pre-publish — competitive mention policy check',
    passRate: 91,
    status: 'active',
  },
  {
    agent: 'Email Sequencer',
    reads: ['voice', 'lexicon', 'cadence', 'icp'],
    gatePolicy: 'Pre-send — full variable sweep',
    passRate: 82,
    status: 'probation',
  },
  {
    agent: 'Analyst Brief Writer',
    reads: ['voice', 'tenets', 'positioning', 'topics'],
    gatePolicy: 'Pre-publish — founder approval gate',
    passRate: 100,
    status: 'active',
  },
];

interface ApprovalThreshold {
  action: string;
  threshold: string;
  approver: string;
}

const APPROVAL_THRESHOLDS: ApprovalThreshold[] = [
  { action: 'Publish blog post',        threshold: 'Pass all P1 tenets + lexicon clean',   approver: 'Auto-approve' },
  { action: 'Publish landing page',     threshold: 'Pass all tenets + positioning check',  approver: 'Marketing lead' },
  { action: 'Send email sequence',      threshold: 'Pass lexicon + ICP alignment',         approver: 'Auto-approve' },
  { action: 'Update sales collateral',  threshold: 'Pass positioning + competitive policy', approver: 'Sales lead' },
  { action: 'External analyst brief',   threshold: 'Pass all variables',                   approver: 'Founder' },
  { action: 'Promote variable to live', threshold: 'Diff review + regression test',        approver: 'Marketing lead' },
];

interface ScopeRow {
  role: string;
  read: boolean;
  edit: boolean;
  promote: boolean;
  override: boolean;
}

const SCOPES: ScopeRow[] = [
  { role: 'Founder',          read: true,  edit: true,  promote: true,  override: true },
  { role: 'Marketing Lead',   read: true,  edit: true,  promote: true,  override: false },
  { role: 'Content Manager',  read: true,  edit: true,  promote: false, override: false },
  { role: 'Agent (automated)', read: true, edit: false, promote: false, override: false },
  { role: 'Viewer',           read: true,  edit: false, promote: false, override: false },
];

const SOURCES = {
  documents: [
    { name: 'Governance policy v1', type: 'Doc' },
    { name: 'Agent audit log', type: 'System' },
    { name: 'Role permission matrix', type: 'Sheet' },
  ],
  extractedNodes: [
    'agent-gates',
    'approval-rules',
    'role-scopes',
    'pass-rates',
  ],
  composedVariable: 'permissions_gates',
};

/* ── Helpers ───────────────────────────────────────────────── */

function statusColor(status: AgentGate['status']): string {
  switch (status) {
    case 'active':    return 'var(--ok)';
    case 'paused':    return 'var(--text-4)';
    case 'probation': return 'var(--staging)';
  }
}

function statusPillClass(status: AgentGate['status']): string {
  switch (status) {
    case 'active':    return 'pill--ok';
    case 'paused':    return 'pill--soft';
    case 'probation': return 'pill--staging';
  }
}

function passRateColor(rate: number): string {
  if (rate >= 95) return 'var(--ok)';
  if (rate >= 85) return 'var(--staging)';
  return 'var(--drift)';
}

function checkMark(val: boolean): string {
  return val ? '✓' : '—';
}

function checkColor(val: boolean): string {
  return val ? 'var(--ok)' : 'var(--text-4)';
}

/* ── Component ─────────────────────────────────────────────── */

export default function GovernanceScreen() {
  return (
    <VariablePage
      categoryDot="var(--c-governance)"
      categoryLabel="Governance"
      variableName="Permissions & Gates"
      version="—"
      status="live"
      consumers={6}
      sources={SOURCES}
    >
      {/* Per-agent gates */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Per-Agent Gates</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Agent</th>
              <th>Reads</th>
              <th>Gate Policy</th>
              <th style={{ width: 70, textAlign: 'right' }}>Pass %</th>
              <th style={{ width: 90 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {AGENT_GATES.map((ag, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: 'var(--text)' }}>{ag.agent}</td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {ag.reads.map((r) => (
                      <span key={r} className="pill pill--soft" style={{ fontSize: 9 }}>{r}</span>
                    ))}
                  </div>
                </td>
                <td style={{ color: 'var(--text-3)', fontSize: 12 }}>{ag.gatePolicy}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className="t-num" style={{ fontSize: 13, color: passRateColor(ag.passRate) }}>
                    {ag.passRate}%
                  </span>
                </td>
                <td>
                  <span className={`pill ${statusPillClass(ag.status)}`}>
                    <span className="dot" style={{
                      background: statusColor(ag.status),
                      width: 5,
                      height: 5,
                    }} />
                    {ag.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approval thresholds */}
      <div className="panel" style={{ marginBottom: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Approval Thresholds</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Action</th>
              <th>Threshold</th>
              <th style={{ width: 140 }}>Approver</th>
            </tr>
          </thead>
          <tbody>
            {APPROVAL_THRESHOLDS.map((at, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{at.action}</td>
                <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{at.threshold}</td>
                <td>
                  <span className={`pill ${at.approver === 'Auto-approve' ? 'pill--ok' : at.approver === 'Founder' ? 'pill--review' : 'pill--info'}`}>
                    {at.approver}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Scopes by role */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <div className="t-eyebrow" style={{ marginBottom: 4 }}>Scopes by Member Role</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 180 }}>Role</th>
              <th style={{ textAlign: 'center' }}>Read</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Promote</th>
              <th style={{ textAlign: 'center' }}>Override</th>
            </tr>
          </thead>
          <tbody>
            {SCOPES.map((s, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{s.role}</td>
                <td style={{ textAlign: 'center', color: checkColor(s.read), fontSize: 14 }}>{checkMark(s.read)}</td>
                <td style={{ textAlign: 'center', color: checkColor(s.edit), fontSize: 14 }}>{checkMark(s.edit)}</td>
                <td style={{ textAlign: 'center', color: checkColor(s.promote), fontSize: 14 }}>{checkMark(s.promote)}</td>
                <td style={{ textAlign: 'center', color: checkColor(s.override), fontSize: 14 }}>{checkMark(s.override)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </VariablePage>
  );
}
