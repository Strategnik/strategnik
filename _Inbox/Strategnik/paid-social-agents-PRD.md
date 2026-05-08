# PRD: Strategnik Paid Social Agent Suite

**Status**: Draft
**Owner**: Nick Talbert
**Last Updated**: April 21, 2026
**Scope**: A modular suite of five independent, plug-and-play paid social advertising agents (Meta, LinkedIn, TikTok, Reddit, Google) sharing a common core of authentication, guardrails, output, and client configuration. Each agent runs standalone — clients engage only the agents relevant to their paid media stack. This PRD covers the shared core architecture and the first platform agent (LinkedIn). Platform-specific addenda for Meta, TikTok, Reddit, and Google will follow as separate documents.

This PRD **does not** cover: organic social, SEO tools, web analytics integration, CRM sync, or lead-routing logic. It also does not specify the SaaS path — delivery in v1 is consulting-flavored (Nick-operated per engagement).

---

## 1. Problem Statement

### The customer problem
B2B marketing teams running paid social across multiple platforms waste 30–50% of their optimization time on mechanical work: pulling reports from each platform, comparing them, identifying which campaigns need attention, then manually pausing/adjusting/scaling. The work is cognitively low-value but operationally high-risk — a missed underperformer burns budget, a wrong budget change burns more. Specialist agencies handle this well but cost $10–25K/month; in-house teams lack the tooling or bandwidth; self-serve SaaS tools (Madgicx, Revealbot) are platform-specific or too prescriptive for sophisticated operators.

### Who specifically has this problem
B2B SaaS companies in Series A–C with $50K–$500K/month paid social spend across 2+ platforms, running without a dedicated PPC lead. Nick's existing clients (Afiniti, Codiac) fit this profile. Secondary: fractional CMO engagements where Nick needs to operate a client's paid media stack while also working on strategy.

### Cost of not solving
For Strategnik specifically: every consulting engagement requires Nick to manually pull and analyze paid media data weekly, which caps client load at ~3 concurrent engagements. With a working agent suite, the same analysis time supports 6–8 clients. The offering also becomes productizable: Strategnik Agent Suite as a named service line, not just Nick's time.

For clients: without automation, paid social optimization is either (a) done poorly because the team is overloaded, or (b) done expensively by an agency with misaligned incentives (agencies profit from spend, not from efficiency).

---

## 2. Goals & Non-Goals

### Goals
- [ ] Ship shared core + LinkedIn agent within 5 weeks, production-ready for Afiniti or Codiac use
- [ ] Each subsequent platform agent (Meta, TikTok, Reddit, Google) ships in ≤2 weeks after the core is stable
- [ ] Every agent operates within per-client guardrails with zero un-authorized write actions across 30 days of operation
- [ ] JSON + markdown output format that cleanly feeds downstream tooling (Slack, Google Docs, Strategnik blog content)
- [ ] Per-client configuration isolation — one client's config can never bleed into another's
- [ ] Consulting delivery in v1 (Nick runs it locally per client), with architecture clean enough to migrate to multi-tenant SaaS later without rewrite

### Non-Goals (explicitly out of scope)
- Cross-platform attribution or unified reporting dashboards (each agent is independent)
- Creative generation (writing ad copy, generating images/video) — that's Creatomate/Creatify territory
- Landing page optimization, CRO, or funnel work
- Organic social scheduling or community management
- Campaign creation from scratch (v1 operates on existing campaigns only)
- Historical data backfill beyond what platform APIs expose natively
- SaaS multi-tenant deployment in v1 — architecture supports it, but we don't build it
- Mobile app, web dashboard, or any UI beyond Claude Code + markdown/JSON files
- Automated billing, subscription management, or customer onboarding flows
- Integration with ad creative ingestion tools (Creatify, Creatomate) — future phase
- Support for platforms beyond the five specified (X/Twitter, Pinterest, Snapchat, etc.)

---

## 3. User Stories

### US-001: Per-engagement agent activation
As Nick (consultant), I want to activate only the agents relevant to a client's paid media stack so that I'm not paying API costs or managing credentials for platforms they don't use.

**Acceptance Criteria:**
- Given a new client "Codiac" using only LinkedIn + Meta, when I create their config, then only LinkedIn and Meta agents are available to act on their accounts
- Edge case: attempting to invoke the TikTok agent against Codiac must return a clear "not configured for this client" error, not a credential error
- Out of scope: billing or pricing tied to which agents are active

### US-002: Per-client guardrail configuration
As Nick, I want to set per-client guardrails (spend caps, action frequency, lookback windows) so that a cautious client gets conservative behavior while an aggressive client gets more autonomy.

**Acceptance Criteria:**
- Given client A has max_daily_budget_change=20% and client B has max_daily_budget_change=50%, when the agent proposes a 40% budget increase, then it executes for B but requires manual override for A
- Edge case: if a client has no guardrail specified, the agent falls back to the most conservative default for that field
- Out of scope: dynamic guardrail changes based on performance

### US-003: Dry-run before execution
As Nick, I want every write action to produce a dry-run output showing what WOULD happen before executing so that I can catch errors before money moves.

**Acceptance Criteria:**
- Given the agent identifies 3 campaigns to pause, when I invoke the action command, then it shows a dry-run report with campaign IDs, names, current status, and reasoning
- The dry-run output is valid JSON + markdown, identical in structure to a post-execution report but with `"status": "proposed"` instead of `"status": "executed"`
- Execution requires a separate, explicit confirmation command — not just "yes"
- Out of scope: interactive UI confirmations

### US-004: Scheduled reporting for weekly client reviews
As Nick, I want to run a weekly report for each active client across all their configured platforms so that I have a single artifact to review before the client call.

**Acceptance Criteria:**
- Given client X has LinkedIn + Meta agents active, when I run `/strategnik-report client-x`, then I receive one markdown file per platform plus a JSON bundle
- Reports include: spend, performance (CTR, CPL, CPA as applicable), week-over-week deltas, anomalies flagged, and proposed optimizations
- Output files are named predictably: `{client-slug}-{platform}-{YYYY-MM-DD}.md`
- Out of scope: automated email/Slack delivery in v1 (files written to disk, Nick distributes manually)

### US-005: Autonomous action within guardrails
As Nick, I want the agent to take approved actions autonomously when they fall within guardrails so that I'm not bottlenecking routine optimization.

**Acceptance Criteria:**
- Given an action is within all configured guardrails, when the agent determines it should execute, then it executes without human confirmation and logs the action
- If ANY guardrail is at risk, the action converts to dry-run-only and requires manual override
- All executed actions are logged with timestamp, client, platform, action type, before/after state, and reasoning
- Out of scope: rollback automation (manual rollback only in v1)

### US-006: Audit log for accountability
As Nick, I want a complete audit log of every agent action per client so that I can answer "what did the agent do on our account last month" with complete precision.

**Acceptance Criteria:**
- Every action (read or write) logs: timestamp, client, platform, tool invoked, inputs, outputs, duration
- Logs are append-only and stored per-client in a predictable location
- Querying the log for a date range produces both JSON and markdown summaries
- Out of scope: log shipping to external SIEM or compliance tools

### US-007: Platform-independent failure
As Nick, I want one agent's failure to not affect other agents so that a LinkedIn API outage doesn't block Meta optimization work.

**Acceptance Criteria:**
- Given LinkedIn's API returns 500s, when I invoke the Meta agent for the same client, then Meta operates normally
- Agent failures log the platform error but don't propagate up as a suite-wide failure
- Out of scope: automatic retry logic beyond what each platform SDK provides

---

## 4. Functional Requirements

### Shared core
- FR-001: The system MUST expose a config loader that reads per-client YAML files from a known directory and validates schema on load.
- FR-002: The system MUST isolate client credentials such that no code path can accidentally use Client A's credentials against Client B's accounts.
- FR-003: The system MUST implement a guardrail engine that evaluates proposed actions against client-specific rules and returns `approved`, `requires_confirmation`, or `blocked`.
- FR-004: The system MUST log every tool invocation with structured metadata (client, platform, tool, inputs, outputs, timestamp, duration).
- FR-005: The system WILL produce output in two formats simultaneously: structured JSON (for machine consumption) and markdown (for human review).
- FR-006: The system MUST support a `--dry-run` mode on every write action that produces the full output without executing.
- FR-007: The system MUST NOT store platform credentials in plaintext in any location that is git-tracked.
- FR-008: The system MUST implement OAuth token refresh for every platform that requires it, with automatic refresh on expiration.

### Per-agent requirements (applies to each platform agent)
- FR-010: Each agent MUST implement a standard interface: `list_accounts`, `list_campaigns`, `get_insights`, `propose_actions`, `execute_actions`.
- FR-011: Each agent MUST consult the shared guardrail engine before any write action.
- FR-012: Each agent MUST produce identical output schema (different content, same structure) so downstream tooling is platform-agnostic.
- FR-013: Each agent MUST handle its own platform's rate limits, including backoff and retry logic.
- FR-014: Each agent MUST surface platform-specific errors to the user with actionable messages, not raw API error codes.

### LinkedIn agent (first platform)
- FR-020: The LinkedIn agent MUST connect to LinkedIn Marketing API via direct REST (not the proprietary LinkedIn-developers SDK).
- FR-021: The LinkedIn agent MUST support reporting on: impressions, clicks, spend, CTR, CPL (if Lead Gen Form campaigns), CPM, frequency.
- FR-022: The LinkedIn agent MUST support actions: pause campaign, activate campaign, update daily budget, update bid.
- FR-023: The LinkedIn agent MUST respect LinkedIn's 60-day OAuth token expiry and prompt for re-auth with 7 days of lead time.
- FR-024: The LinkedIn agent MUST flag campaigns with insufficient data (< minimum spend threshold defined in client config) and exclude them from optimization recommendations.
- FR-025: The LinkedIn agent MUST handle LinkedIn's campaign group → campaign → creative hierarchy correctly.
- FR-026: The LinkedIn agent MUST NOT support creative CRUD (create, update, delete creatives) in v1.

### Client configuration
- FR-030: Each client config MUST specify which platform agents are active for that client.
- FR-031: Each client config MUST specify per-platform ad account IDs the agent is authorized to touch.
- FR-032: Each client config MUST specify guardrails including: max_daily_budget_change_pct, max_single_action_spend_usd, min_lookback_days, min_spend_for_action_usd, max_actions_per_run, learning_phase_respect_flag.
- FR-033: Each client config MUST specify an action authorization tier: `reporting_only`, `pause_only`, `full_agent_with_confirm`, `full_agent_autonomous`.
- FR-034: Changing a client's authorization tier MUST require editing the config file (no CLI shortcut), to prevent accidental escalation.

---

## 5. Non-Functional Requirements

- **Performance**: End-to-end reporting run for a single client on a single platform MUST complete in < 2 minutes at p95. Multi-platform multi-client runs MUST parallelize across platforms.
- **Security**:
  - All platform credentials stored in a local credential vault (OS keychain preferred, encrypted file fallback) — never in `.env` files committed to git
  - Per-client credential isolation enforced at the code level, not just by convention
  - All audit logs are append-only and locally persisted
  - No client data egresses to third-party services except the platform APIs themselves
- **Scale** (v1 consulting mode):
  - Support up to 10 concurrent clients
  - Each client with up to 5 platforms active
  - Each platform with up to 50 active campaigns per ad account
  - Audit logs up to 1 year of retention without performance degradation
- **Scale** (v2 SaaS mode, not built but supported by architecture):
  - Up to 500 concurrent clients
  - Per-tenant database isolation
  - Credential vault swappable for HSM-backed storage
- **Platform support**: macOS + Linux (Nick's local dev + future Linux cloud hosts). Windows not supported in v1.
- **Python**: 3.10+
- **Deployment**: Local execution via Claude Code in v1. Each client's config + logs stored in `~/.strategnik/clients/{client-slug}/`.

---

## 6. UX/Design Notes

No GUI in v1. The "UX" is Claude Code + generated markdown/JSON files.

### Core user flows

**Flow 1: Add a new client**
1. Nick runs `strategnik client new codiac`
2. System generates a config template at `~/.strategnik/clients/codiac/config.yaml`
3. Nick edits the config: active platforms, ad account IDs, guardrails, authorization tier
4. Nick runs `strategnik client init codiac --platforms linkedin,meta`
5. System walks Nick through OAuth for each platform, stores tokens in credential vault
6. System validates each connection and reports status

**Flow 2: Weekly reporting run**
1. Nick runs `strategnik report codiac --period last-7-days`
2. System parallelizes across all active platforms for that client
3. Each platform agent produces `{client}-{platform}-{date}.md` and `{client}-{platform}-{date}.json`
4. System produces a summary `{client}-summary-{date}.md` linking to each platform report
5. All files written to `~/.strategnik/clients/codiac/reports/{date}/`

**Flow 3: Proposed action review**
1. Nick runs `strategnik analyze codiac --platform linkedin`
2. LinkedIn agent identifies optimization opportunities, produces dry-run JSON + markdown
3. Nick reviews proposed actions
4. Nick runs `strategnik execute codiac --platform linkedin --action-id abc123` to execute specific action, OR `strategnik execute codiac --platform linkedin --all-approved` for all within-guardrail actions
5. System executes, produces execution report with before/after state

**Flow 4: Autonomous scheduled run (for clients on `full_agent_autonomous` tier)**
1. Cron or launchd triggers `strategnik autonomous-run codiac` on configured schedule
2. System runs analysis across all active platforms
3. System executes all within-guardrail actions automatically
4. System logs everything and writes summary report
5. Any action that required confirmation (exceeded guardrail) is flagged in the report for Nick's review

### Non-obvious copy that matters

- Error messages MUST clarify whose fault a failure is: client config error vs. platform API error vs. agent bug
- Dry-run outputs MUST be visually distinct from execution outputs (suggest `[DRY RUN]` prefix on every line + JSON `"status": "proposed"`)
- Audit log entries MUST include a human-readable `reasoning` field explaining why the agent took an action, not just what it did

---

## 7. Data Model & API Contracts

### Client config schema (YAML)

```yaml
client:
  slug: codiac                    # unique identifier, used in paths
  display_name: Codiac Inc.
  engagement_start: 2026-03-15
  primary_contact: nick@strategnik.com

platforms:
  linkedin:
    enabled: true
    ad_account_ids:
      - "507123456"
    authorization_tier: full_agent_with_confirm
    guardrails:
      max_daily_budget_change_pct: 25
      max_single_action_spend_usd: 500
      min_lookback_days: 7
      min_spend_for_action_usd: 100
      max_actions_per_run: 10
      respect_learning_phase: true
  meta:
    enabled: true
    ad_account_ids:
      - "act_1234567890"
    authorization_tier: full_agent_autonomous
    guardrails:
      max_daily_budget_change_pct: 15
      max_single_action_spend_usd: 1000
      min_lookback_days: 3
      min_spend_for_action_usd: 200
      max_actions_per_run: 20
      respect_learning_phase: true
  tiktok:
    enabled: false
  reddit:
    enabled: false
  google:
    enabled: false

reporting:
  default_lookback_days: 7
  output_dir: ~/.strategnik/clients/codiac/reports
  include_creative_previews: false

notifications:
  on_action_blocked: log_only
  on_autonomous_action: log_only
  on_error: log_only
  # v2: slack, email
```

### Standard output JSON schema (every report)

```json
{
  "meta": {
    "client": "codiac",
    "platform": "linkedin",
    "run_id": "run_20260421_143022_abc123",
    "run_type": "report | analyze | execute | autonomous",
    "period_start": "2026-04-14",
    "period_end": "2026-04-21",
    "timestamp": "2026-04-21T14:30:22Z",
    "agent_version": "0.1.0"
  },
  "summary": {
    "total_spend_usd": 4521.33,
    "total_impressions": 128450,
    "total_clicks": 892,
    "key_metric": {"name": "CPL", "value": 47.22, "unit": "usd"},
    "week_over_week_delta_pct": {"spend": -3.2, "key_metric": 8.5}
  },
  "campaigns": [
    {
      "id": "camp_789",
      "name": "Q2 Enterprise ABM",
      "status": "ACTIVE",
      "daily_budget_usd": 300,
      "spend_usd": 1204.12,
      "performance": {"impressions": 42100, "clicks": 287, "ctr": 0.68, "leads": 18, "cpl": 66.89},
      "flags": ["cpl_above_target", "creative_fatigue_risk"]
    }
  ],
  "anomalies": [
    {
      "campaign_id": "camp_789",
      "type": "cpl_spike",
      "severity": "medium",
      "description": "CPL up 34% week-over-week, crossed $60 threshold",
      "evidence": {"previous_cpl": 49.91, "current_cpl": 66.89}
    }
  ],
  "proposed_actions": [
    {
      "action_id": "act_001",
      "type": "update_budget",
      "campaign_id": "camp_789",
      "current_value": 300,
      "proposed_value": 240,
      "change_pct": -20,
      "reasoning": "CPL exceeds target by 34%, reducing budget to lower exposure while creative is refreshed. Reduction within 25% guardrail.",
      "guardrail_check": "approved",
      "status": "proposed"
    }
  ],
  "executed_actions": [],
  "errors": []
}
```

### Audit log entry schema (JSON lines format)

```json
{"timestamp": "2026-04-21T14:30:22Z", "client": "codiac", "platform": "linkedin", "run_id": "run_20260421_143022_abc123", "tool": "update_budget", "inputs": {"campaign_id": "camp_789", "new_budget": 240}, "outputs": {"success": true, "before": 300, "after": 240}, "duration_ms": 847, "reasoning": "CPL exceeds target by 34%"}
```

---

## 8. Open Questions

| # | Question | Owner | Due | Decision |
|---|----------|-------|-----|----------|
| 1 | Credential vault: OS keychain via `keyring` lib vs. encrypted file via `cryptography`? Keychain is cleaner but macOS-specific behavior; encrypted file is portable but you manage keys. | Nick | Before core build | Pending |
| 2 | Do we need a database for audit logs in v1 or is JSONL sufficient? JSONL is simpler and fine up to ~100K entries. SQLite is the natural upgrade. | Nick | Before core build | Pending |
| 3 | Cron/launchd for autonomous scheduled runs, or separate daemon? Cron is simpler but no in-process state; daemon is more work. | Nick | Before autonomous tier build | Pending |
| 4 | LinkedIn: API v2 vs. Versioned APIs? LinkedIn deprecated v2 for new apps in 2024. Must use versioned. | Nick | Before LinkedIn build | Confirmed: use versioned APIs |
| 5 | Does Afiniti or Codiac actually want to be first client, or is this Strategnik-internal for v1? Changes urgency and testing profile. | Nick | Before LinkedIn build | Pending |
| 6 | Rollback: do we store "before" state in a way that lets us auto-revert, or is rollback manual only in v1? Impacts action execution design. | Nick | Before execute tier build | Manual only in v1 |
| 7 | How does the agent handle a campaign it's never seen before mid-engagement — new campaign appears, what's the default posture? | Nick | Before autonomous tier build | Pending (likely: ignore until explicitly approved) |
| 8 | Multi-currency: some clients may run non-USD accounts. How does USD-centric guardrail logic handle EUR/GBP budgets? | Nick | Before 2nd client onboards | Pending |

---

## 9. Success Metrics

### Primary
- **Zero un-authorized write actions across first 30 days of operation per client.** A write action outside guardrails with no manual confirmation = product failure.

### Secondary
- Time-per-client-weekly-review reduced from ~4 hours (current manual) to ≤30 minutes
- Shared core genuinely shared: agents #2-5 each implement in ≤2 weeks (vs. 5 weeks for #1)
- At least 80% of routine optimizations (pause underperformers, reallocate budget to winners) execute autonomously without Nick in the loop

### Guardrails (must NOT regress)
- No silent failures: every failed action produces a log + visible error
- No credential leakage: client A's token never used for client B's account
- No platform spillover: LinkedIn agent outage doesn't affect other platforms

### How we measure
- Audit log analysis (append-only JSONL parseable by any script)
- Manual weekly Nick review of agent behavior for first 60 days
- Error rate tracked in log: fails / total_actions per client per week

---

## 10. Implementation Notes for Claude Code

### What to build (in priority order)

**Phase 1 — Shared Core (weeks 1-3)**
1. Project scaffolding, pyproject.toml, testing setup
2. Client config loader + YAML schema validation (pydantic)
3. Credential vault abstraction (interface first, keychain impl second)
4. Structured logger + audit log (JSONL)
5. Guardrail engine with pluggable rules
6. Output format generator (JSON + markdown side by side)
7. CLI skeleton (`strategnik` command with subcommands)
8. Dry-run / execute pattern as a shared decorator

**Phase 2 — LinkedIn Agent (weeks 4-5)**
9. LinkedIn REST client (no SDK, direct httpx)
10. OAuth flow + token refresh + 60-day expiry warnings
11. Read operations: list_accounts, list_campaigns, get_insights
12. Write operations: pause, activate, update_budget, update_bid
13. LinkedIn-specific guardrail rules (learning phase, minimum spend)
14. Test against a real LinkedIn Ads account (Nick's Strategnik account initially)

**Phase 3 — Subsequent platforms (weeks 6-13, sequential)**
15. Meta agent (uses facebook-business SDK)
16. Google agent (uses google-ads Python client — Apache 2.0)
17. TikTok agent (direct REST)
18. Reddit agent (direct REST)

### Constraints that are non-negotiable

- **License discipline**: no BSL, no GPL, no proprietary SDKs. Every dependency must be MIT/Apache 2.0/BSD/ISC. Verify before adding.
- **No LinkedIn official SDK**: `linkedin-developers/linkedin-api-python-client` is proprietary — build against REST directly.
- **No hosted-service wrappers**: do not wrap Pipeboard, Synter, AdsMCP, or any SaaS MCP. All code runs locally.
- **Per-client isolation**: client credentials and configs MUST be accessed only through the config loader abstraction. No global credential variables. No shortcuts.
- **Dry-run by default**: every write tool has dry-run mode. Execution requires explicit confirmation flag or tier-authorized autonomous mode.
- **Audit everything**: every tool call, read or write, is logged. No exceptions.

### Where to use judgment

- Error message wording — make them actionable, you know Nick's voice
- Internal code organization within each agent (keep adapters clean, but internal file layout is your call)
- Which pydantic version, which httpx version, which testing framework — pick current stable
- Guardrail rule implementation details as long as the engine interface matches FR-003
- Markdown formatting in reports (tables vs. lists, etc.) — aim for scannable

### Always check back before

- Adding a new dependency (verify license first)
- Changing the client config schema (breaking change for any existing configs)
- Implementing automatic rollback logic (out of scope v1 per open question #6)
- Adding a new platform beyond the five specified
- Changing the output JSON schema (downstream tooling depends on it)
- Adding any network egress beyond the platform APIs themselves
