import React, { useState } from 'react';

/* ── Sample data ────────────────────────────────────────────────────── */

const TABS = ['Workspace', 'Team', 'Billing', 'Security', 'Integrations', 'Notifications'] as const;
type Tab = (typeof TABS)[number];

interface TeamMember {
  initials: string;
  name: string;
  email: string;
  role: 'owner' | 'operator' | 'viewer' | 'editor' | 'auditor';
  lastSeen: string;
  color: string;
}

const TEAM: TeamMember[] = [
  { initials: 'NT', name: 'Nick Talbert',     email: 'nick@strategnik.com',      role: 'owner',    lastSeen: 'now',     color: 'var(--accent)' },
  { initials: 'JM', name: 'Julia Martinez',   email: 'julia@strategnik.com',     role: 'operator', lastSeen: '2h ago',  color: 'var(--review)' },
  { initials: 'KC', name: 'Kevin Chen',       email: 'kevin@strategnik.com',     role: 'editor',   lastSeen: '6h ago',  color: 'var(--info)' },
  { initials: 'SR', name: 'Sarah Reeves',     email: 'sarah@strategnik.com',     role: 'viewer',   lastSeen: '1d ago',  color: 'var(--staging)' },
  { initials: 'AP', name: 'Audit Pipeline',   email: 'ci-bot@ontogent.io',       role: 'auditor',  lastSeen: '47s ago', color: 'var(--ok)' },
];

const ROLE_PILL: Record<string, string> = {
  owner: 'pill--accent',
  operator: 'pill--ok',
  editor: 'pill--info',
  viewer: 'pill--soft',
  auditor: 'pill--staging',
};

interface Invoice {
  date: string;
  amount: string;
  status: 'paid' | 'pending';
}

const INVOICES: Invoice[] = [
  { date: 'Apr 1, 2026', amount: '$490', status: 'paid' },
  { date: 'Mar 1, 2026', amount: '$490', status: 'paid' },
  { date: 'Feb 1, 2026', amount: '$490', status: 'paid' },
];

/* ── Component ──────────────────────────────────────────────────────── */

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Team');

  return (
    <div style={{ maxWidth: 880 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="t-h1">Settings</h1>
        <p className="t-mono" style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
          Workspace configuration &middot; Afiniti
        </p>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--line)',
          marginBottom: 24,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
              fontSize: 12.5,
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              transition: 'color 0.12s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Team tab */}
      {activeTab === 'Team' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div className="t-eyebrow">Team members &middot; {TEAM.length}</div>
            <button className="btn btn--primary btn--sm">Invite member</button>
          </div>

          <div className="panel" style={{ overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 40 }} />
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last seen</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {TEAM.map((m) => (
                  <tr key={m.email}>
                    <td>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: `color-mix(in srgb, ${m.color} 15%, transparent)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 600,
                          color: m.color,
                        }}
                      >
                        {m.initials}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>{m.name}</span>
                    </td>
                    <td>
                      <span className="t-code" style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.email}</span>
                    </td>
                    <td>
                      <span className={`pill ${ROLE_PILL[m.role]}`}>{m.role}</span>
                    </td>
                    <td>
                      <span className="t-mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{m.lastSeen}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn--sm btn--ghost">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing tab (shown below Team when Team is active, or standalone) */}
      {(activeTab === 'Team' || activeTab === 'Billing') && (
        <div style={{ marginTop: activeTab === 'Team' ? 32 : 0 }}>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            {activeTab === 'Team' ? 'Billing' : 'Billing & Plan'}
          </div>

          {/* Plan card */}
          <div className="panel" style={{ padding: 20, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="t-h3">Foundation Sprint</span>
                <span className="pill pill--accent">active</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Up to 10 spec files &middot; 6 agents &middot; 5 team members &middot; 30-day audit log
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="t-num" style={{ fontSize: 22, color: 'var(--text)' }}>$490</div>
              <div className="t-label" style={{ marginTop: 2 }}>per month</div>
            </div>
          </div>

          {/* Invoices */}
          <div className="panel" style={{ overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv) => (
                  <tr key={inv.date}>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{inv.date}</span>
                    </td>
                    <td>
                      <span className="t-num" style={{ fontSize: 12 }}>{inv.amount}</span>
                    </td>
                    <td>
                      <span className={`pill ${inv.status === 'paid' ? 'pill--ok' : 'pill--staging'}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn--sm btn--ghost">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workspace tab */}
      {activeTab === 'Workspace' && (
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>Workspace info</div>
          <div className="panel" style={{ padding: 20 }}>
            {[
              { label: 'Name',        value: 'Afiniti' },
              { label: 'Slug',        value: 'afiniti' },
              { label: 'Environment', value: 'prod' },
              { label: 'Region',      value: 'us-east-1' },
              { label: 'Created',     value: 'Jan 15, 2026' },
              { label: 'Spec version', value: 'v3.1.2' },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span className="t-label" style={{ width: 140 }}>{row.label}</span>
                <span className="t-code" style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {!['Team', 'Billing', 'Workspace'].includes(activeTab) && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
          <div className="t-h2" style={{ color: 'var(--text-2)', marginBottom: 8 }}>{activeTab}</div>
          <div className="t-mono" style={{ fontSize: 12 }}>Configuration surface coming next</div>
        </div>
      )}
    </div>
  );
}
