# PRD: Crisp GTM Systems Architecture Dashboard
**Status**: Approved  
**Owner**: Nick Talbert / Strategnik  
**Last Updated**: 2026-03-10  
**Scope**: A single-page React application that visualizes Crisp Inc.'s GTM stack integration architecture, data ownership matrix, MEDDPICC AI pipeline, stack audit / redundancy analysis, and middleware rationale. This PRD covers the complete v6 application. It does NOT cover backend services, live data connections, or actual API integrations — this is a documentation/visualization tool only.

---

## Problem Statement

Crisp's RevOps architecture spans 15+ active tools across four functional layers. Without a single reference document that a Director of RevOps (or a hiring committee evaluating one) can navigate quickly, the architecture exists only in disconnected slide decks and verbal handoffs. The cost of not solving this: (1) implementation teams build point-to-point integrations that bypass the middleware layer, creating data conflicts by month 3; (2) there is no artifact to anchor stakeholder alignment on what gets built when and why.

---

## Goals

- [ ] Interactive diagram showing all 15 active tools, their phase placement, data flow direction, and SFDC object targets
- [ ] Field ownership matrix with SFDC object column — every field has a named owner and conflict rule
- [ ] MEDDPICC AI pipeline documentation — extraction logic, confidence thresholds, write vs. queue decision
- [ ] Stack audit tab — 6 tools evaluated (2 cut, 2 deferred, 2 validate), with reasoning and estimated savings
- [ ] Middleware comparison — Syncari + n8n + Celigo + HubSpot rationale vs. Workato
- [ ] Phase filter that dims future-phase nodes, reinforcing the load-bearing foundation concept

## Non-Goals

- Live data or real API connections of any kind
- Authentication or multi-user state
- Mobile-optimized layout (desktop/tablet viewport assumed)
- Editable fields or admin interface
- Export to PDF or image
- Saving state between sessions

---

## Tech Stack

```
React (hooks only — useState)
Tailwind NOT used — all styles are inline style objects
SVG for the integration map diagram
Google Fonts: Share Tech Mono + Rajdhani (loaded via @import in style tag)
No external component libraries
Single file: App.jsx (or index.jsx)
```

---

## Application Structure

Five tabs rendered conditionally via `useState('map')`:

| Tab Key | Label | Content |
|---------|-------|---------|
| `map` | MAP | SVG integration diagram + phase filter + hover tooltips |
| `audit` | AUDIT | Stack audit: cuts, deferrals, validations + savings summary |
| `own` | OWNERSHIP | Field ownership matrix table |
| `med` | MEDDPICC | AI extraction pipeline + confidence table |
| `mid` | MIDDLEWARE | Middleware stack rationale (Syncari/n8n/Celigo/HubSpot) |

Active tab button has amber (`#f59e0b`) background except AUDIT which uses red (`#ef4444`).

---

## Visual Design System

```js
// Background and surfaces
bg:        '#07111e'   // page background
surface:   '#040d18'   // card/table backgrounds  
border:    '#0d2040'   // default borders
borderMid: '#1e3a5f'   // mid-tone borders
borderSub: '#0a1e30'   // table row separators

// Text hierarchy
textPrimary:   '#e2e8f0'
textSecondary: '#94a3b8'
textMuted:     '#2a4060'
textSubtle:    '#1e3a5f'

// Phase colors
phase1: '#f59e0b'   // Foundation — amber
phase2: '#60a5fa'   // Rev Intel + AI — blue
phase3: '#c084fc'   // CS + Collab — purple
phase4: '#334155'   // Deferred — slate (muted)

// Node category colors (stroke / text)
core:     { stroke: '#f59e0b', text: '#fbbf24' }  // Golden Triangle
tof:      { stroke: '#06b6d4', text: '#67e8f9' }  // Top of Funnel
auto:     { stroke: '#22d3ee', text: '#a5f3fc' }  // Automation
seller:   { stroke: '#34d399', text: '#6ee7b7' }  // Seller Tools
sales:    { stroke: '#60a5fa', text: '#93c5fd' }  // Quote-to-Cash
cs:       { stroke: '#c084fc', text: '#d8b4fe' }  // CS/Support
collab:   { stroke: '#475569', text: '#94a3b8' }  // Collaboration
ai:       { stroke: '#f0abfc', text: '#f5d0fe' }  // AI Decisioning
defer:    { stroke: '#334155', text: '#475569' }  // Deferred
validate: { stroke: '#fb923c', text: '#fdba74' }  // Validate Before Renewing

// Fonts
display: "'Rajdhani', sans-serif"   // headers, tool names, numbers
mono:    "'Share Tech Mono', monospace"  // labels, tags, metadata
```

Load both fonts via inline `<style>` tag:
```css
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');
```

---

## Data: Node Definitions

SVG canvas: `width=1040 height=600`

Layer Y-positions (center of each node row):
```js
const LY = { ph4:58, ph3:152, ph2:258, busT:338, busB:384, ph1:468 }
```
Node height (NH): `46px`

All nodes with `x` (center), `y` (center), `w` (width), `cat` (category key):

```js
// Phase 1 — Foundation
{ id:'vib', name:'Vibe Prospecting',  cat:'tof',      x:138, y:LY.ph1, w:168,
  sub:'OWNS: ICP lists · account signals (Explorium)' },
{ id:'n8n', name:'PDL + n8n',         cat:'auto',     x:340, y:LY.ph1, w:130,
  sub:'INBOUND ENRICH · pay-per-match · trigger guard' },
{ id:'hs',  name:'HubSpot',           cat:'core',     x:546, y:LY.ph1, w:158,
  sub:'OWNS: Contact · Lead · MQL · Comms Sequences' },
{ id:'sf',  name:'Salesforce',        cat:'core',     x:738, y:LY.ph1, w:172,
  sub:'OWNS: Acct · Opp · Stage · ACV · Close Date' },
{ id:'ns',  name:'NetSuite',          cat:'core',     x:934, y:LY.ph1, w:152,
  sub:'OWNS: Order · RevRec · Commission' },

// Phase 2 — Rev Intel + AI
{ id:'gon', name:'Gong',              cat:'seller',   x:80,  y:LY.ph2, w:118,
  sub:'OWNS: Call Intel · APPEND Activity to SFDC' },
{ id:'llm', name:'Claude · MEDDPICC', cat:'ai',       x:226, y:LY.ph2, w:152,
  sub:'Transcript → extract MEDDPICC → SFDC Opportunity' },
{ id:'chi', name:'Chili Piper',       cat:'seller',   x:390, y:LY.ph2, w:122,
  sub:'OWNS: Scheduling · creates SFDC Activity/Event' },
{ id:'pen', name:'Pendo',             cat:'cs',       x:528, y:LY.ph2, w:116,
  sub:'OWNS: Usage · DAU/MAU · Adoption' },
{ id:'cpq', name:'DealHub CPQ',       cat:'sales',    x:720, y:LY.ph2, w:130,
  sub:'OWNS: Quote · Pricing · Approvals' },
{ id:'pan', name:'PandaDoc / CLM',    cat:'sales',    x:908, y:LY.ph2, w:138,
  sub:'OWNS: Contract execution' },

// Phase 3 — CS + Collab
{ id:'vit', name:'Vitally',           cat:'cs',       x:88,  y:LY.ph3, w:124,
  sub:'OWNS: Health Score · Renewal Risk' },
{ id:'zen', name:'ZenDesk',           cat:'validate', x:252, y:LY.ph3, w:136,
  sub:'VALIDATE: replace w/ HubSpot Service Hub?' },
{ id:'lin', name:'LinkedIn SNav',     cat:'validate', x:504, y:LY.ph3, w:140,
  sub:'VALIDATE: audit per-seat usage before renewal' },
{ id:'slk', name:'Slack',             cat:'collab',   x:700, y:LY.ph3, w:104,
  sub:'RECEIVES: Opportunity + health alerts only' },
{ id:'gws', name:'Google WS',         cat:'collab',   x:898, y:LY.ph3, w:124,
  sub:'OWNS: Email Activity · Calendar Events' },

// Phase 4 — Deferred (rendered faded, dashed border)
{ id:'cla', name:'Clari',             cat:'defer',    x:190, y:LY.ph4, w:160,
  sub:'DEFERRED — activate when AE team > 20 reps' },
```

---

## Data: Edge Definitions

Each edge: `{ id, from, to, sync, phase, deferred? }`

Sync types: `'bi'` | `'uni'` | `'append'` | `'read'`

```js
const EDGES = [
  // Phase 1
  { id:'e1',   from:'hs',  to:'sf',  sync:'bi',     phase:1 },
  { id:'e2',   from:'sf',  to:'ns',  sync:'bi',     phase:1 },
  { id:'e5',   from:'vib', to:'hs',  sync:'uni',    phase:1 },
  { id:'e6',   from:'vib', to:'sf',  sync:'uni',    phase:1 },
  { id:'e7',   from:'hs',  to:'n8n', sync:'uni',    phase:1 },
  { id:'e8',   from:'n8n', to:'hs',  sync:'uni',    phase:1 },

  // Phase 2
  { id:'e9',   from:'gon', to:'sf',  sync:'append', phase:2 },
  { id:'egai', from:'gon', to:'llm', sync:'uni',    phase:2 },   // AI edge — special color
  { id:'eai',  from:'llm', to:'sf',  sync:'uni',    phase:2 },   // AI edge — special color
  { id:'e10',  from:'chi', to:'sf',  sync:'uni',    phase:2 },
  { id:'e13',  from:'pen', to:'sf',  sync:'uni',    phase:2 },
  { id:'e14',  from:'pen', to:'vit', sync:'uni',    phase:2 },
  { id:'e15',  from:'sf',  to:'cpq', sync:'uni',    phase:2 },
  { id:'e16',  from:'cpq', to:'sf',  sync:'uni',    phase:2 },
  { id:'e17',  from:'cpq', to:'ns',  sync:'uni',    phase:2 },
  { id:'e18',  from:'pan', to:'sf',  sync:'bi',     phase:2 },
  { id:'e19',  from:'pan', to:'ns',  sync:'uni',    phase:2 },

  // Phase 3
  { id:'e20',  from:'vit', to:'sf',  sync:'bi',     phase:3 },
  { id:'e21',  from:'zen', to:'sf',  sync:'uni',    phase:3 },
  { id:'e22',  from:'zen', to:'vit', sync:'uni',    phase:3 },
  { id:'e24',  from:'lin', to:'sf',  sync:'read',   phase:3 },
  { id:'e25',  from:'sf',  to:'slk', sync:'uni',    phase:3 },
  { id:'e26',  from:'gws', to:'hs',  sync:'bi',     phase:3 },
  { id:'e27',  from:'gws', to:'sf',  sync:'uni',    phase:3 },
  { id:'e31',  from:'vit', to:'hs',  sync:'uni',    phase:3 },

  // Phase 4 — deferred (render as faint dashed, no arrowhead)
  { id:'e28',  from:'sf',  to:'cla', sync:'uni',    phase:4, deferred:true },
  { id:'e29',  from:'gon', to:'cla', sync:'uni',    phase:4, deferred:true },
  { id:'e30',  from:'ns',  to:'sf',  sync:'read',   phase:4, deferred:true },
]
```

**SFDC object labels per edge** (rendered as small text at edge midpoint on vertical edges only — skip if `Math.abs(p2.y - p1.y) < 28`):

```js
const SFDC_OBJ = {
  e1:   'Contact · Lead',
  e2:   'Opportunity',
  e5:   'Contact',
  e6:   'Account',
  e7:   'Contact (trigger)',
  e8:   'Contact',
  e9:   'Activity [Task]',
  egai: 'Transcript (webhook)',
  eai:  'Opportunity [MEDDPICC]',
  e10:  'Activity [Event]',
  e13:  'Account [Usage__c]',
  e14:  'Account [Health input]',
  e15:  'Opportunity',
  e16:  'Opportunity',
  e17:  'Order',
  e18:  'Opportunity',
  e19:  'Order · RevRec',
  e20:  'Account [Health__c]',
  e21:  'Account [Support__c] · Case',
  e22:  'Account [Health__c]',
  e24:  'Contact · Account (overlay)',
  e25:  'Opportunity [Stage alerts]',
  e26:  'Contact [Email]',
  e27:  'Activity [Task]',
  e31:  'Contact [lifecycle trigger]',
  e30:  'Account [ARR__c]',
}
```

---

## MAP Tab: SVG Diagram Spec

### Canvas annotations (static SVG elements)

**Background grid pattern**: `40×40` grid, stroke `#091828`, `strokeWidth=0.5`

**Zone band fills** (rect spanning full width):
- Phase 4 zone: `y=0` to `LY.ph3-26`: fill `#c084fc03`
- Phase 3 zone: `y=LY.ph3-26` to `LY.ph2`: fill `#60a5fa03`
- Foundation band: `y=LY.busB` to `SVG_H`: gradient `#f59e0b` 4%→14% opacity
- Foundation left accent bar: `x=0 y=LY.busB width=5 height=SVG_H-LY.busB` fill `#f59e0b` opacity `0.55`

**DEFERRED zone label** (above ph4 nodes):
```
Text: "⏸  DEFERRED — add when team scale justifies cost"
Color: #334155, fontSize: 7.5, y: LY.ph4+16
```
Dashed line below at `y=LY.ph4+24`, strokeDasharray `8 4`, opacity `0.3`

**MIDDLEWARE BUS** (rect from `LY.busT` to `LY.busB`, x=30 width=SVG_W-60):
- Fill `#22d3ee07`, stroke `#22d3ee`, strokeDasharray `12 4`
- Line 1 (y+15): `"SYNCARI (HubSpot↔SFDC) · CELIGO (SFDC↔NetSuite) · n8n (custom workflows)"` — fontSize 8, opacity 0.7
- Line 2 (y+27): field ownership rules etc — fontSize 6.5, opacity 0.28
- Line 3 (y+39): n8n use cases — fontSize 5.5, opacity 0.18

**LOAD-BEARING FOUNDATION label** at `y=LY.ph1-36`:
```
"◆  LOAD-BEARING FOUNDATION  ◆  PHASE 1"
color: #f59e0b, fontSize: 8.5, letterSpacing: 0.18em
```
Warning rect + text at `y=LY.ph1-26`:
```
"⚠  Build Syncari field ownership matrix + rules before connecting any satellite tools."
```

**Golden Triangle callout** above SF node: `"◆  GOLDEN TRIANGLE  ◆"` in amber, fontSize 7, opacity 0.45

**HubSpot comms label** below HubSpot node: `"COMMS EXECUTION LAYER"` in amber, fontSize 6

**Inbound enrich loop** (dashed rect top-left above n8n/phase1):
```
rect: x=14 y=LY.ph1-72 width=156 height=34
"INBOUND ENRICH LOOP" / "HubSpot → n8n → PDL → HubSpot"
```

**AI Decisioning label** above llm node:
```
"AI DECISIONING LAYER" in #f0abfc, fontSize 6.5
```

**Phase right-rail labels** for Ph2 and Ph3 (rotated text):
- Thin colored rect `width=12` at `x=1028`
- Rotated text: phase name

### Edge rendering

For each visible edge (respecting phase filter):

```
stroke color:
  - deferred edges: #334155
  - AI edges (egai, eai): #f0abfc
  - other: PC[edge.phase]  →  {1:'#f59e0b', 2:'#60a5fa', 3:'#c084fc', 4:'#34d399'}

strokeWidth:
  - hovered + active: 2.2
  - AI edges: 1.8
  - deferred: 0.8
  - default: 1.2

opacity:
  - deferred: 0.2
  - active + hovered: 0.95
  - default (no hover): 0.42
  - dimmed (hover elsewhere): 0.04

strokeDasharray:
  - deferred: '4 6'
  - AI edges: '6 3'
  - bi sync: undefined (solid)
  - uni sync: undefined (solid)
  - append: '2 5'
  - read: '1 7'

arrowheads:
  - deferred: no arrowhead
  - AI edges: custom #f0abfc marker
  - bi sync: arrowhead on both ends (same phase color)
  - all others: arrowhead on 'to' end only

glow filter:
  - active + hovered: url(#glow)
  - AI edges: url(#aiGlow)
```

**Edge midpoint label** (SFDC object name — show only when NOT hovering):
- Only on edges where `Math.abs(p2.y - p1.y) > 28`
- Text: `[Opp]`, `[Acct]`, `[Ctct]`, `[Act]` (abbreviate)
- Fill: edge color, fontSize: 5.5, opacity: 0.36
- Position: midpoint + offset `{x+4, y-3}`

### Node rendering

For each node:

```
Base rect:
  x: node.x - w/2
  y: node.y - NH/2
  width: w
  height: NH (46)
  rx: 4
  fill: hovered ? cat.stroke+'28' : cat.bg
  stroke: cat.stroke
  strokeWidth: hovered ? 2 : (ai or validate) ? 1.5 : 1
  strokeDasharray: defer='5 4', ai='5 3', validate='8 3', others=none

Ownership strip at bottom of node:
  y: node.y + NH/2 - 11
  height: 10
  fill: cat.stroke opacity 0.10

Name text (Rajdhani, 10px, bold):
  y: node.y - 8

Sub text (Share Tech Mono, 6px):
  y: node.y + 8
  opacity: 0.42
  truncate at 44 chars with '…'

Hover glow rect: x-6, y-6, w+12, h+12, rx=7, fill=cat.stroke opacity 0.12

AI node ambient glow: separate rect behind, filter=url(#aiGlow), fill=#f0abfc opacity 0.08

Validate node ambient: rect behind, fill=#fb923c opacity 0.06

Labels above node:
  AI nodes:       "◆ AI DECISIONING"   — #f0abfc, fontSize 6, y=node.y-NH/2-8
  validate nodes: "⚠ VALIDATE BEFORE RENEWAL" — #fb923c, fontSize 6
  defer nodes:    "⏸ DEFERRED"         — #334155, fontSize 6

Opacity modifiers:
  isDimmed (hovering elsewhere, not connected): 0.06
  phaseDim (phase filter active, future phase): 0.10
  isDeferred: 0.35
  normal: 1.0
```

### Edge endpoint calculation

```js
function edgePt(node, otherNode) {
  const nw = node.w / 2, nh = NH / 2
  const dx = other.x - node.x, dy = other.y - node.y
  const sx = Math.abs(dx) ? nw / Math.abs(dx) : Infinity
  const sy = Math.abs(dy) ? nh / Math.abs(dy) : Infinity
  const s = Math.min(sx, sy)
  return { x: node.x + dx * s, y: node.y + dy * s }
}
```

### Hover tooltip

When `hov` is set, render tooltip near the node:

```
Container: rect, fill=#040d18, stroke=cat.stroke, rx=4, opacity=0.98
Width: 268px
Height: 28 + connections.length * 34 + 14

Placement:
  if node.x > SVG_W * 0.55: render to LEFT of node
  else: render to RIGHT
  clamp to SVG boundaries

Per connection row:
  Line 1: arrow + other tool name (Rajdhani 11px bold, phase color or #f0abfc for AI)
  Line 2: sync type + phase name (Share Tech Mono 7px, muted)
  Line 3: "SFDC: [object name]" (Share Tech Mono 7px, #1e3a5f)

Footer for validate nodes:
  "⚠ Validate before renewal — see AUDIT tab"
  
Footer for defer nodes:
  "⏸ Not contracted — see AUDIT tab for conditions"
```

### Phase filter controls

```
Buttons: ALL | PH.1 FOUNDATION | + PH.2 AI/REV | + PH.3 CS
Active: background = phaseColor+'22', text = phaseColor, border = phaseColor
Inactive: transparent background, text = #2a3f55, border = #1e3a5f
```

When filter active:
- Show only edges with `edge.phase <= selectedPhase`
- Dim (opacity 0.10) all nodes in future phases
- Deferred nodes always render at 0.35 opacity

### Savings banner (top of MAP tab)

```
border: #ef444422, background: #ef444408
Left: "STACK AUDIT: 5 tools eliminated or deferred" (Rajdhani, #ef4444)
Middle: pill tags for each cut/defer/validate tool
Right: "$67–135k / yr identified" (Rajdhani 13px, #34d399, bold)
```

---

## AUDIT Tab

### Summary cards (3-column grid)

| Column | Label | Color | Tools | Save |
|--------|-------|-------|-------|------|
| 1 | CUT — remove from stack | `#ef4444` | Apollo.io, Vector | $20–45k / yr |
| 2 | DEFER — add at scale milestone | `#f59e0b` | Clari, Loopio | $35–65k / yr |
| 3 | VALIDATE — before next renewal | `#fb923c` | ZenDesk, LinkedIn SNav | $12–25k+ / yr |

Each card: `borderTop: 3px solid {color}`, tool names in Rajdhani 12px bold, savings in color.

### Audit item cards (expandable)

Six items. Click header to toggle body. State: `openAudit` (int | null).

Header row (always visible):
- Status icon circle (✕ / ⏸ / ⚠)
- Tool name (Rajdhani 14px bold, status color)
- Status label (8px) + reason (8.5px muted)
- Savings estimate (right-aligned, Rajdhani 13px)
- Expand chevron

Expanded body (two sections):
1. **OVERLAP / REDUNDANCY** — detailed explanation of what's duplicated
2. **ONLY KEEP IF / RE-EVALUATE WHEN / VALIDATE** — the condition under which you'd keep or add it

**Full audit data:**

```
Apollo.io — CUT — $5–15k / yr
Reason: Redundant with Vibe Prospecting + PDL
Overlap: ICP list building covered by Vibe Prospecting. Inbound enrichment covered by PDL via n8n. Running Apollo + Vibe + PDL = paying 3× for significantly overlapping data.
Keep if: Reps are actively running outbound sequences through Apollo (not just enrichment). If sequences move to HubSpot Workflows, Apollo is dead weight entirely. Evaluate: migrate sequences to HubSpot and cut Apollo.

Vector — CUT — $15–30k / yr
Reason: Redundant intent signal layer
Overlap: Apollo mid-tier includes intent signals. LinkedIn SNav provides engagement signals. HubSpot tracks behavioral intent natively. Three overlapping intent signal sources with no differentiated data coverage for Crisp's CPG/retail ICP.
Keep if: You can demonstrate Vector surfaces intent signals that Apollo and LinkedIn are missing AND those signals convert to pipeline. If you cannot show that, cut it. At scale, Bombora or G2 intent would be the right upgrade — not Vector.

Clari — DEFERRED — $20–40k / yr
Reason: Premature at current scale
Overlap: Gong Forecast is included in Gong license. SFDC Einstein Forecasting is included in Enterprise. Clari earns its keep when VP Sales manages 20+ AEs and needs automated roll-up and deal inspection AI.
Re-evaluate when: AE team exceeds 20 reps AND Gong Forecast proves insufficient for CRO commit accuracy.

Loopio — DEFERRED — $15–25k / yr
Reason: Premature unless RFP volume is high
Overlap: Justified at 20+ complex RFPs/year with a team reusing content. Below that, PandaDoc template library + Google Drive covers 90% of the use case at zero incremental cost.
Re-evaluate when: Crisp actively pursues enterprise retail (Walmart, Kroger, Target) that issues formal vendor RFPs. At that volume, Loopio's content library and collaboration features pay for themselves. Not before.

ZenDesk — VALIDATE — $12–25k / yr
Reason: Potential HubSpot Service Hub overlap
Overlap: HubSpot Professional and Enterprise tiers include Service Hub — ticketing, CSAT surveys, SLA management. Before renewing ZenDesk, validate exactly which CS workflows live there that HubSpot cannot replicate.
Validate: Does CS have complex support workflows (multi-channel routing, large KB, complex SLAs) that HubSpot Service Hub cannot match? If support volume is low and CS primarily works in Vitally, ZenDesk cost is not justified.

LinkedIn Sales Navigator — VALIDATE — $5–6k per unused seat / yr
Reason: High per-seat cost; validate active usage before renewal
Overlap: At $80–100/seat/month = $5–6k/rep/year, SNav is a meaningful line item. Value is real only if reps are actively using the SFDC overlay, InMail, and relationship mapping features.
Validate: Pull LinkedIn's usage report. Cut seats for any rep with fewer than 10 logins per month. Non-users are pure waste.
```

### Bottom savings summary panel

```
Left side:
  "IDENTIFIED ANNUAL SAVINGS"
  "$67–135k / yr" — Rajdhani 28px bold, #34d399
  "conservative → aggressive scenario" — small muted

Right side (separated by vertical line):
  "WHAT REMAINS: 15 ACTIVE TOOLS — EACH WITH A DISTINCT, NON-OVERLAPPING FUNCTION"
  Pill tags for each active tool:
    Standard tools: #34d39910 background, #34d39933 border, #34d399 text
    Validate tools (ZenDesk*, SNav*): #fb923c10 / #fb923c33 / #fb923c
  Footnote: "* pending validation — may consolidate further"
```

Active tools list:
`HubSpot`, `Salesforce`, `NetSuite`, `Gong`, `Claude·MEDDPICC (n8n)`, `Chili Piper`, `Pendo`, `DealHub CPQ`, `PandaDoc`, `Vitally`, `ZenDesk*`, `LinkedIn SNav*`, `Slack`, `Google WS`, `Vibe Prospecting + PDL/n8n`, `Syncari`, `Celigo`

---

## OWNERSHIP Tab

Table with columns: `FIELD | SFDC OBJECT | OWNER | SYNC | WRITE / CONFLICT RULE`

Grid: `148px 155px 140px 100px 1fr`

Five sections (collapsible, default all expanded):

### Core Records (amber)
| Field | SFDC Object | Owner | Sync | Rule |
|-------|-------------|-------|------|------|
| Contact record | Contact | HubSpot | ⇄ Bi | HubSpot wins. Syncari enforces. SFDC blank-field only. |
| Lead / MQL | Lead | HubSpot | → Uni | HubSpot owns through MQL gate. SFDC converts on SQL. |
| Account firmographics | Account | Salesforce | ⇄ Bi | SFDC wins. Enrichment upsert-only. 30-day lock after rep edit. |
| Opportunity | Opportunity | Salesforce | → Uni | Reps + SFDC workflows only. No downstream write-back. |

### AI-Assisted MEDDPICC (pink/fuchsia)
| Field | SFDC Object | Owner | Sync | Rule |
|-------|-------------|-------|------|------|
| Metrics | Metrics__c [Opp] | Claude + Rep | → Uni | AI writes ≥80% confidence. Below → Activity Note for rep. |
| Economic Buyer | Economic_Buyer__c [Opp] | Claude + Rep | → Uni | AI writes ≥85%. Highest threshold — wrong EB kills deals. |
| Decision Criteria/Process | Decision_* [Opp] | Claude + Rep | → Uni | AI writes ≥75%. Structured format enforced by n8n. |
| Identify Pain / Champion | Pain__c Champion__c [Opp] | Claude + Rep | → Uni | ≥85% and ≥80% respectively. |
| Paper Process / Competition | Paper__c Comp__c [Opp] | Claude + Rep | → Uni | ≥72% and ≥78% respectively. |
| MEDDPICC Score | MEDDPICC_Score__c [Opp] | n8n (calc) | → Uni | % of 8 fields populated. Slack alert if <40% at Stage 3+. |

### Enrichment / Consolidated (cyan)
| Field | SFDC Object | Owner | Sync | Rule |
|-------|-------------|-------|------|------|
| ICP prospect lists | Contact (import) | Vibe Prospecting | → Uni | Explorium MCP → HubSpot Contact. Dedup at Syncari. |
| Account signals | Account [custom] | Vibe Prospecting | → Uni | Dedicated SFDC field. Not merged with rep data. |
| Inbound contact enrich | Contact | PDL via n8n | → Uni | Trigger: new HubSpot Contact. PDL upsert, blank fields only. |

### Activity + Revenue (green)
| Field | SFDC Object | Owner | Sync | Rule |
|-------|-------------|-------|------|------|
| Call intel | Activity [Task] | Gong | + Append | Append-only to SFDC Activity Timeline. |
| MEDDPICC write | Opportunity [custom] | Claude via n8n | → Uni | Confidence gate. Above → write. Below → Activity Note. |
| Scheduling | Activity [Event] | Chili Piper | → Uni | Every meeting auto-creates SFDC Activity (Event). |
| Quote / pricing | Opportunity [Amount] | DealHub CPQ | → Uni | SFDC Opp triggers CPQ. Approved amount back only. |
| Contract | Opportunity [Stage] | PandaDoc | → Uni | Signed → SFDC Stage → Celigo → NetSuite Order. |
| Email activity | Activity [Task] | Google WS | ⇄ Bi | HubSpot gets engagement. SFDC gets Activity Task. |

### CS + Financial (purple)
| Field | SFDC Object | Owner | Sync | Rule |
|-------|-------------|-------|------|------|
| Health score | Account [Health__c] | Vitally | ⇄ Bi | Vitally calculates. SFDC displays. HubSpot gets trigger. |
| Renewal risk | Account [Renewal__c] | Vitally→HubSpot | → Uni | Risk flag → HubSpot Contact → renewal sequence. |
| Product usage | Account [Usage__c] | Pendo | → Uni | Unidirectional. No GTM write to product data. |
| Support tickets | Account [Support__c] | ZenDesk* | → Uni | *Validate vs HubSpot Service Hub. High-sev → Vitally degradation. |
| ARR display | Account [ARR__c] | NetSuite | ◦ Read | Read-only via Celigo. Finance owns in NetSuite. |

**Sync type color coding:**
- `bi`: `#f59e0b`
- `append`: `#34d399`
- `read`: `#475569`
- `uni`: `#60a5fa`

---

## MEDDPICC Tab

### Pipeline flow (horizontal flex)

Nodes and arrows in sequence:
```
[Gong "Call ends"] → webhook → [n8n "Trigger"] → API → [Gong API "Full text"]
  + SFDC read → [MEDDPICC state "Current Opp"] → prompt → [Claude API "Extract+score"]
  → JSON → [n8n gate "Confidence?"] → write/queue → [SFDC Opp "Custom fields"]
```

Node style: `border: 1px solid {color}44`, background `{color}11`, minWidth: 72px, Rajdhani name + tiny sub note

### Decision cards (2-column grid)

**Left — HIGH CONFIDENCE ≥ THRESHOLD → AUTO-WRITE** (green border):
> Claude writes directly to SFDC Opportunity MEDDPICC custom field. Tagged `AI_GENERATED` in metadata. Call ID + timestamp stored for audit. Rep override locks field 30 days.

**Right — BELOW THRESHOLD → REP REVIEW QUEUE** (amber border):
> n8n creates SFDC Activity Note on the Opportunity: extracted value + confidence score + source quote. Rep reviews and confirms. Confirmed value writes as `REP_CONFIRMED`.

### MEDDPICC extraction table

Columns: ` [letter] | FIELD | SFDC FIELD [Opp] | THRESHOLD | EXTRACTION LOGIC`

Grid: `28px 120px 175px 75px 1fr`

| L | Field | SFDC Field | Threshold | Extraction Logic |
|---|-------|-----------|-----------|-----------------|
| M | Metrics | Metrics__c | 80% | Quantifiable ROI, time savings, cost reduction numbers from transcript |
| E | Economic Buyer | Economic_Buyer__c | **85%** | Name + title of budget authority. Highest threshold — wrong EB tanks deals. |
| D | Decision Criteria | Decision_Criteria__c | 75% | Evaluation factors: security, integration, price, support, compliance |
| D | Decision Process | Decision_Process__c | 75% | Approval chain, committee, procurement steps described on call |
| P | Paper Process | Paper_Process__c | 72% | Procurement timelines, security review, legal sign-off requirements |
| I | Identify Pain | Identify_Pain__c | **85%** | Specific problem language: manual work, errors, lost revenue, risk |
| C | Champion | Champion__c | 80% | Advocate language: "I'm pushing this internally", sponsorship signals |
| C | Competition | Competition__c | 78% | Competitor names, "also evaluating", pricing comparison language |

Threshold color coding:
- ≥85%: `#34d399` (green)
- ≥80%: `#f59e0b` (amber)
- <80%: `#60a5fa` (blue)

### MEDDPICC_Score__c footer callout

```
Header: "MEDDPICC_Score__c — COMPLETENESS TRIGGER" in #f0abfc

Body: n8n recalculates MEDDPICC_Score__c after each call as % of 8 fields populated.
Writes to Opportunity. Triggers Slack alert to AE manager when score <40% at Stage 3+.
Gong Forecast reads this field. Reps see it in SFDC sidebar — replacing the need for
Clari at current scale.
```

---

## MIDDLEWARE Tab

Four tool cards stacked vertically. Each card: `borderLeft: 3px solid {color}`.

Header row per card: tool name (Rajdhani 15px bold) + role description + cost (right-aligned)

Body: 2-column grid — **WHY THIS TOOL** (left) + **WHAT IT HANDLES IN THIS STACK** (bullet list, right)

### Syncari — HubSpot ↔ Salesforce sync + field ownership — ~$12–18k / yr
**Why**: Purpose-built for the HubSpot↔SFDC field ownership problem. Syncari Synapse gives you visual field ownership enforcement, conflict resolution, and dedup as the core product. Workato can do this but you build and maintain the logic as custom recipes. Syncari ships it.

**Handles**:
- Visual field ownership pipeline — configure, not code
- Native conflict resolution + audit log
- Dedup enforced before any insert
- MQL→SQL handoff, attribution sync, contact/account ownership split

### Celigo — Salesforce ↔ NetSuite (ERP integration) — ~$8–12k / yr
**Why**: Purpose-built NetSuite integrator. Multi-entity, multi-currency, RevRec field mapping, and commission data flow are core competencies. A general iPaaS handling NetSuite requires constant recipe maintenance as schema evolves.

**Handles**:
- SFDC Opportunity → NetSuite Order on signing
- RevRec schedule creation from PandaDoc executed contract
- Commission data flow to SFDC Account (read-only display)
- Multi-currency and multi-entity schema out of the box

### n8n — Custom webhook workflows + AI pipeline — ~$600–1.5k / yr
**Why**: Already deployed for PDL enrichment. The Gong → Claude API → SFDC MEDDPICC pipeline is a webhook receiver, two API calls, and a conditional SFDC write — exactly what n8n handles. Same team, same infrastructure, zero new platform overhead.

**Handles**:
- PDL inbound enrichment trigger (existing)
- Gong call-end webhook → Claude API prompt → SFDC MEDDPICC field writes
- MEDDPICC_Score__c calculation + Slack alert dispatch
- Any custom API integration not covered by Syncari/Celigo

### HubSpot Workflows — Comms execution layer — Included in existing tier
**Why**: HubSpot stops being a contact DB and becomes the outbound communication engine. Health drops in Vitally → data flows to HubSpot Contact → HubSpot Workflow fires CS sequence. This is not a new platform — it is an activation of what's already paid for.

**Handles**:
- CS health drop → outreach sequence (triggered by Vitally health data)
- Renewal risk flag → renewal sequence (triggered by Vitally Renewal__c)
- New customer onboarding drip (triggered by Opportunity Closed Won)
- MQL → SDR alert (triggered by HubSpot Lead Score)
- Re-engagement campaigns (triggered by usage drop from Pendo)

### Footer stats bar

```
~$21–32k   total middleware cost / yr
4          purpose-fit tools
0          general iPaaS recipes to maintain  (color: #ef4444)
0          point-to-point connectors          (color: #ef4444)
```

---

## Functional Requirements

**FR-001**: The app MUST render as a single React component with no required props.  
**FR-002**: All five tabs MUST be accessible via header button row. Active tab state MUST persist within session.  
**FR-003**: The SVG diagram MUST render all 17 nodes (including 1 deferred) with correct x/y placement per the spec.  
**FR-004**: All 31 edges MUST render with correct source/target, sync type styling, and phase color.  
**FR-005**: Deferred edges MUST render as faint dashed lines with no arrowhead.  
**FR-006**: AI edges (`egai`, `eai`) MUST render in `#f0abfc` with `strokeDasharray='6 3'` and the aiGlow filter.  
**FR-007**: Hovering a node MUST dim all non-connected nodes to opacity 0.06 and highlight connected edges to opacity 0.95.  
**FR-008**: The hover tooltip MUST show all active connections for the hovered node including SFDC object name per edge.  
**FR-009**: Phase filter buttons MUST dim future-phase nodes and hide future-phase edges.  
**FR-010**: SFDC object labels MUST appear on vertical edges (deltaY > 28) when no node is hovered.  
**FR-011**: The AUDIT tab MUST render 6 expandable audit items with click-to-expand behavior.  
**FR-012**: The savings banner on MAP tab MUST be visible without scrolling on a 1280px+ viewport.  
**FR-013**: Validate-category nodes MUST render with dashed orange border and "⚠ VALIDATE BEFORE RENEWAL" label.  
**FR-014**: Deferred nodes MUST render at 0.35 opacity with dashed border and "⏸ DEFERRED" label.  
**FR-015**: All inline styles MUST use the design system color tokens — no hardcoded colors outside the design system.  
**FR-016**: The app MUST NOT use localStorage, sessionStorage, or any external state management library.  
**FR-017**: SVG MUST use `width="100%"` with a `viewBox` so it scales responsively within its container.

---

## Non-Functional Requirements

- **Performance**: No external API calls. All data is static JS constants. App MUST load and render within 500ms.  
- **Dependencies**: Only React (useState). No Tailwind. No component libraries. Google Fonts via @import in style tag.  
- **Browser support**: Chrome, Firefox, Safari (latest). No IE.  
- **Viewport**: Designed for 1280px+ width. Graceful degradation (flex-wrap) at narrower widths.  
- **Accessibility**: Not a primary concern for this v1. Color contrast meets minimum legibility.

---

## Open Questions

| # | Question | Decision Needed By |
|---|----------|-------------------|
| 1 | Should AUDIT items be expanded by default or collapsed? | Before first build — current spec: collapsed |
| 2 | Should the OWNERSHIP tab sections be collapsible? | Current spec: all expanded, click header to collapse |
| 3 | Add a PLAN/rollout tab (16-week timeline)? | Deferred — can add as Phase 2 tab |
| 4 | ZenDesk and LinkedIn SNav appear on the map but are flagged validate — is that correct? | Yes — they're in the active stack but flagged for review |

---

## Implementation Notes for Claude Code

### Build order (priority sequence)

1. Scaffold App.jsx with tab state, header, and empty tab containers
2. Implement design system constants (LY, CAT, PC, NODES, EDGES, SFDC_OBJ)
3. Build MAP tab: SVG canvas, zone bands, middleware bus, foundation labels
4. Add node rendering with category styles, deferred/validate/AI variants
5. Add edge rendering with sync type styling, AI edges, deferred edges
6. Add edge midpoint SFDC labels (vertical edges only, no hover)
7. Add hover interaction: dim/highlight + tooltip
8. Add phase filter button row + filter logic
9. Add savings banner above diagram
10. Build AUDIT tab: summary cards + expandable audit items + savings panel
11. Build OWNERSHIP tab: collapsible sections + table rows
12. Build MEDDPICC tab: pipeline flow + decision cards + extraction table
13. Build MIDDLEWARE tab: four tool cards + footer stats

### Non-negotiable constraints

- Single file. All JS, styles, data in one `App.jsx` (or `index.jsx`).
- No Tailwind. All styles are `style={{}}` inline objects.
- No `localStorage`. State lives in React only.
- The `edgePt()` function (boundary intersection) MUST be implemented as specified — this is what makes edges connect to node borders correctly.
- Fonts MUST be loaded via the `<style>` tag `@import` — not via a `<link>` tag (not available in artifact context).
- `SVG_W=1040`, `SVG_H=600`, `NH=46` are fixed — do not change these without recalculating all node positions.

### Where to use judgment

- Exact pixel tweaks to annotation label positions (±5px is fine)
- Number of rows shown before overflow in ownership table
- Exact tooltip width if content overflows
- Minor color opacity adjustments for readability

### Stop and check before

- Changing any node `x/y` coordinates (positions are calculated to avoid overlap)
- Changing `LY` layer positions (affects all node placement and zone fills)
- Adding new data categories not in the CAT object
- Adding new tabs (fine conceptually, but confirm the tab key first)
- Any change to the MEDDPICC confidence thresholds (these are intentional)

---

## Success Criteria

- All 5 tabs render without console errors
- Hovering any node highlights its connections and shows the tooltip with SFDC object names
- Phase filter correctly shows/hides edges and dims nodes
- AUDIT items expand and collapse on click
- The `Claude · MEDDPICC` AI node renders with dashed border, ambient glow, and correct AI-colored edges
- ZenDesk and LinkedIn SNav render with orange dashed borders and validate labels
- Clari renders grey/faded at 0.35 opacity with deferred treatment
- Zero external API calls
- Zero localStorage usage
