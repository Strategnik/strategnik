import React, { useState, useEffect, useRef, Suspense } from 'react';

/* ── Surface definitions ─────────────────────────────────────────────── */

interface Surface {
  id: string;
  group: string;
  label: string;
  primary?: boolean;
  badge?: string;
  cat?: string;
  drift?: number;
  staged?: boolean;
  review?: boolean;
  count?: number;
  hot?: number;
}

const SURFACES: Surface[] = [
  { id: 'control', group: 'Home', label: 'Control Plane', primary: true, badge: 'home' },
  // Variables
  { id: 'voice', group: 'Variables', label: 'Voice & tone', cat: 'identity' },
  { id: 'lexicon', group: 'Variables', label: 'Forbidden lexicon', cat: 'identity', drift: 1 },
  { id: 'tenets', group: 'Variables', label: 'Tenets', cat: 'identity' },
  { id: 'icp', group: 'Variables', label: 'ICP & buyer', cat: 'buyer', staged: true },
  { id: 'positioning', group: 'Variables', label: 'Positioning', cat: 'competitive', review: true },
  { id: 'cadence', group: 'Variables', label: 'Cadence rules', cat: 'identity' },
  { id: 'topics', group: 'Variables', label: 'Topic pillars', cat: 'content' },
  { id: 'governance', group: 'Variables', label: 'Permissions & gates', cat: 'governance' },
  // Fleet
  { id: 'agents', group: 'Fleet', label: 'Agents', count: 6, hot: 1 },
  { id: 'graph', group: 'Fleet', label: 'Lineage graph' },
  { id: 'queue', group: 'Fleet', label: 'Approval queue', count: 2 },
  // Activity
  { id: 'activity', group: 'Activity', label: 'Live feed' },
  { id: 'audit', group: 'Activity', label: 'Audit log' },
  { id: 'drift', group: 'Activity', label: 'Drift detection', count: 1 },
  { id: 'tests', group: 'Activity', label: 'Test before publish' },
  // Admin
  { id: 'releases', group: 'Admin', label: 'Releases' },
  { id: 'settings', group: 'Admin', label: 'Settings & API' },
];

/* ── Lazy screen imports ─────────────────────────────────────────────── */

const ControlPlane = React.lazy(() => import('./screens/ControlPlane'));
const VoiceScreen = React.lazy(() => import('./screens/VoiceScreen'));
const LexiconScreen = React.lazy(() => import('./screens/LexiconScreen'));
const TenetsScreen = React.lazy(() => import('./screens/TenetsScreen'));
const IcpScreen = React.lazy(() => import('./screens/IcpScreen'));
const PositioningScreen = React.lazy(() => import('./screens/PositioningScreen'));
const CadenceScreen = React.lazy(() => import('./screens/CadenceScreen'));
const TopicsScreen = React.lazy(() => import('./screens/TopicsScreen'));
const GovernanceScreen = React.lazy(() => import('./screens/GovernanceScreen'));
const AgentsScreen = React.lazy(() => import('./screens/AgentsScreen'));
const GraphScreen = React.lazy(() => import('./screens/GraphScreen'));
const QueueScreen = React.lazy(() => import('./screens/QueueScreen'));
const ActivityScreen = React.lazy(() => import('./screens/ActivityScreen'));
const AuditScreen = React.lazy(() => import('./screens/AuditScreen'));
const DriftScreen = React.lazy(() => import('./screens/DriftScreen'));
const TestsScreen = React.lazy(() => import('./screens/TestsScreen'));
const ReleasesScreen = React.lazy(() => import('./screens/ReleasesScreen'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen'));

const SCREEN_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  control: ControlPlane,
  voice: VoiceScreen,
  lexicon: LexiconScreen,
  tenets: TenetsScreen,
  icp: IcpScreen,
  positioning: PositioningScreen,
  cadence: CadenceScreen,
  topics: TopicsScreen,
  governance: GovernanceScreen,
  agents: AgentsScreen,
  graph: GraphScreen,
  queue: QueueScreen,
  activity: ActivityScreen,
  audit: AuditScreen,
  drift: DriftScreen,
  tests: TestsScreen,
  releases: ReleasesScreen,
  settings: SettingsScreen,
};

/* ── Category color map ──────────────────────────────────────────────── */

const CAT_COLORS: Record<string, string> = {
  identity: 'var(--c-identity)',
  buyer: 'var(--c-buyer)',
  competitive: 'var(--c-competitive)',
  content: 'var(--c-content)',
  distribution: 'var(--c-distribution)',
  pipeline: 'var(--c-pipeline)',
  gtm: 'var(--c-gtm)',
  measurement: 'var(--c-measurement)',
  governance: 'var(--c-governance)',
};

/* ── Helpers ─────────────────────────────────────────────────────────── */

function getHash(): string {
  return window.location.hash.replace('#', '') || 'control';
}

function groupSurfaces(): [string, Surface[]][] {
  const groups: Map<string, Surface[]> = new Map();
  for (const s of SURFACES) {
    const list = groups.get(s.group) ?? [];
    list.push(s);
    groups.set(s.group, list);
  }
  return Array.from(groups.entries());
}

/* ── Wordmark ────────────────────────────────────────────────────────── */

function Wordmark() {
  return (
    <div className="wordmark" style={{ padding: '20px 20px 16px' }}>
      <svg width="152" height="24" viewBox="0 0 152 24" aria-label="Ontogent">
        <defs>
          <filter id="ont-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <text
          x="0"
          y="18"
          fill="var(--text)"
          fontFamily="'Soehne Breit', system-ui, sans-serif"
          fontWeight="700"
          fontSize="18"
          letterSpacing="0.06em"
          filter="url(#ont-glow)"
        >
          ONTOGENT
        </text>
      </svg>
      <span
        className="wordmark-by"
        style={{ fontSize: '8.5px', marginTop: '3px' }}
      >
        BY &middot; STRATEGNIK
      </span>
    </div>
  );
}

/* ── SidebarItem ─────────────────────────────────────────────────────── */

interface SidebarItemProps {
  surface: Surface;
  active: boolean;
  onNav: (id: string) => void;
}

function SidebarItem({ surface, active, onNav }: SidebarItemProps) {
  const dotColor = surface.cat ? CAT_COLORS[surface.cat] : undefined;

  return (
    <button
      onClick={() => onNav(surface.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '6px 16px',
        background: active ? 'var(--bg-3)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--r-2)',
        cursor: 'pointer',
        color: active ? 'var(--text)' : 'var(--text-2)',
        fontSize: '12.5px',
        textAlign: 'left',
        transition: 'background 0.1s, color 0.1s',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-2)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Category dot */}
      {dotColor && (
        <span
          className="dot"
          style={{ background: dotColor }}
        />
      )}

      {/* Primary icon placeholder */}
      {surface.primary && (
        <span style={{ fontSize: '11px', opacity: 0.6 }}>&#9670;</span>
      )}

      <span style={{ flex: 1 }}>{surface.label}</span>

      {/* Status badges */}
      {surface.staged && (
        <span className="pill pill--staging" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
          staged
        </span>
      )}
      {surface.review && (
        <span className="pill pill--review" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
          review
        </span>
      )}
      {surface.drift != null && surface.drift > 0 && (
        <span className="pill pill--drift" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
          drift&thinsp;{surface.drift}
        </span>
      )}
      {surface.count != null && surface.count > 0 && (
        <span className="pill pill--soft" style={{ fontSize: '9px', height: '16px', padding: '0 5px' }}>
          {surface.count}
        </span>
      )}
      {surface.hot != null && surface.hot > 0 && (
        <span className="dot dot--pulse" style={{ background: 'var(--drift)', width: '6px', height: '6px' }} />
      )}
    </button>
  );
}

/* ── Sidebar ─────────────────────────────────────────────────────────── */

interface SidebarProps {
  activeId: string;
  onNav: (id: string) => void;
}

function Sidebar({ activeId, onNav }: SidebarProps) {
  const groups = groupSurfaces();

  return (
    <aside
      style={{
        width: '232px',
        minWidth: '232px',
        height: '100vh',
        background: 'var(--bg-1)',
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Wordmark */}
      <Wordmark />

      {/* Workspace switcher */}
      <div
        style={{
          margin: '0 12px 12px',
          padding: '8px 10px',
          background: 'var(--bg-2)',
          borderRadius: 'var(--r-2)',
          border: '1px solid var(--line)',
          cursor: 'pointer',
        }}
      >
        <div className="t-eyebrow" style={{ marginBottom: '2px' }}>Workspace</div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-2)' }}>
          Afiniti &middot; prod &middot; v3.1.2
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {groups.map(([group, items]) => (
          <div key={group} style={{ marginBottom: '16px' }}>
            <div
              className="t-eyebrow"
              style={{ padding: '4px 16px 4px', marginBottom: '2px' }}
            >
              {group}
            </div>
            {items.map((s) => (
              <SidebarItem
                key={s.id}
                surface={s}
                active={s.id === activeId}
                onNav={onNav}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* User strip */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--accent)',
            flexShrink: 0,
          }}
        >
          NT
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '11.5px', color: 'var(--text)' }}>Nick Talbert</div>
          <div style={{ fontSize: '10px', color: 'var(--text-4)' }}>
            operator &middot; all scopes
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Topbar ──────────────────────────────────────────────────────────── */

interface TopbarProps {
  surface: Surface;
  onCommandBar: () => void;
}

function Topbar({ surface, onCommandBar }: TopbarProps) {
  return (
    <header
      style={{
        height: '46px',
        minHeight: '46px',
        background: 'var(--bg-1)',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
        <span style={{ color: 'var(--text-3)' }}>Afiniti</span>
        <span style={{ color: 'var(--text-4)' }}>/</span>
        <span style={{ color: 'var(--text-3)' }}>{surface.group}</span>
        <span style={{ color: 'var(--text-4)' }}>/</span>
        <span style={{ color: 'var(--text)' }}>{surface.label}</span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Environment */}
        <span className="t-mono" style={{ fontSize: '11px', color: 'var(--text-3)' }}>
          prod &middot; 1,757 ops/24h
        </span>

        {/* Command bar trigger */}
        <button
          className="btn btn--ghost"
          onClick={onCommandBar}
          style={{ gap: '4px', height: '26px', padding: '0 8px' }}
        >
          <kbd>&#8984;K</kbd>
        </button>

        {/* Notification bell */}
        <button
          className="btn btn--ghost"
          style={{ width: '28px', padding: 0, justifyContent: 'center', position: 'relative' }}
          aria-label="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M4 6a4 4 0 0 1 8 0c0 4 2 5 2 5H2s2-1 2-5" />
            <path d="M6.5 13a1.5 1.5 0 0 0 3 0" />
          </svg>
          <span
            className="dot dot--pulse"
            style={{
              background: 'var(--drift)',
              position: 'absolute',
              top: '4px',
              right: '5px',
              width: '5px',
              height: '5px',
            }}
          />
        </button>
      </div>
    </header>
  );
}

/* ── CommandBar ──────────────────────────────────────────────────────── */

interface CommandBarProps {
  open: boolean;
  onClose: () => void;
  onNav: (id: string) => void;
}

function CommandBar({ open, onClose, onNav }: CommandBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filtered = SURFACES.filter(
    (s) =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.group.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered.length > 0) {
        onNav(filtered[selectedIdx]?.id ?? 'control');
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, filtered, selectedIdx, onClose, onNav]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '120px',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          width: '480px',
          maxHeight: '420px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-2)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--line)' }}>
          <input
            ref={inputRef}
            className="input"
            placeholder="Search surfaces..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', background: 'var(--bg-2)' }}
          />
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-3)', fontSize: '12px' }}>
              No matching surfaces
            </div>
          )}
          {filtered.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                onNav(s.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                background: i === selectedIdx ? 'var(--bg-3)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--r-2)',
                cursor: 'pointer',
                color: 'var(--text)',
                fontSize: '12.5px',
                textAlign: 'left',
              }}
            >
              {s.cat && (
                <span className="dot" style={{ background: CAT_COLORS[s.cat] ?? 'var(--text-4)' }} />
              )}
              <span style={{ flex: 1 }}>{s.label}</span>
              <span className="t-eyebrow" style={{ fontSize: '9px' }}>{s.group}</span>
            </button>
          ))}
        </div>

        {/* Keyboard hints */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '10.5px',
            color: 'var(--text-4)',
          }}
        >
          <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> navigate</span>
          <span><kbd>&#9166;</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

/* ── Stub ────────────────────────────────────────────────────────────── */

interface StubProps {
  surface: Surface;
}

function Stub({ surface }: StubProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '12px',
        opacity: 0.6,
      }}
    >
      <div className="t-h2" style={{ color: 'var(--text-2)' }}>
        {surface.label}
      </div>
      <div className="t-mono" style={{ fontSize: '12px', color: 'var(--text-3)' }}>
        Coming next
      </div>
      <span className="pill pill--soft">{surface.group}</span>
    </div>
  );
}

/* ── Loading fallback ────────────────────────────────────────────────── */

function ScreenLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-3)',
        fontSize: '12px',
      }}
    >
      <span className="t-mono">Loading...</span>
    </div>
  );
}

/* ── Navigator (root) ────────────────────────────────────────────────── */

function Navigator() {
  const [activeId, setActiveId] = useState(getHash);
  const [cmdBarOpen, setCmdBarOpen] = useState(false);

  // Hash routing
  useEffect(() => {
    function onHashChange() {
      setActiveId(getHash());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Keyboard shortcut for command bar
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdBarOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function handleNav(id: string) {
    window.location.hash = id;
    setActiveId(id);
  }

  const activeSurface = SURFACES.find((s) => s.id === activeId) ?? SURFACES[0];
  const ScreenComponent = SCREEN_MAP[activeId];

  return (
    <div
      id="ontogent-root"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Sidebar activeId={activeId} onNav={handleNav} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <Topbar surface={activeSurface} onCommandBar={() => setCmdBarOpen(true)} />

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            background: 'var(--bg)',
          }}
        >
          {ScreenComponent ? (
            <Suspense fallback={<ScreenLoader />}>
              <ScreenComponent />
            </Suspense>
          ) : (
            <Stub surface={activeSurface} />
          )}
        </main>
      </div>

      {/* Command bar overlay */}
      <CommandBar open={cmdBarOpen} onClose={() => setCmdBarOpen(false)} onNav={handleNav} />
    </div>
  );
}

export default Navigator;
