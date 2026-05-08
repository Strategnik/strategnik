# Strategnik Paid Social Agent Suite

## Project overview
Modular suite of five independent paid social agents (Meta, LinkedIn, TikTok, Reddit, Google) sharing a common core. Each agent is plug-and-play per client — clients engage only the agents their paid stack uses.

## Product Requirements
See `docs/prd/PRD.md` for full product requirements before implementing any feature. Do not begin work on any feature without reading the PRD first.

## Architecture summary
- **Shared core**: config, credentials, guardrails, logging, output format — built once
- **Platform agents**: LinkedIn → Meta → Google → TikTok → Reddit (build order)
- **Delivery**: consulting-flavored v1 (Nick runs locally per client); SaaS-flavored v2

## Non-negotiable constraints
- **License discipline**: MIT / Apache 2.0 / BSD / ISC only. No BSL, no GPL, no proprietary SDKs.
- **No LinkedIn official SDK**: build against REST directly.
- **No hosted-service wrappers**: all code runs locally.
- **Per-client isolation**: enforced in code, not just convention.
- **Dry-run by default**: every write action has a dry-run mode.
- **Audit everything**: every tool call is logged with reasoning.

## Build phases
- Phase 1: Shared core (3 weeks)
- Phase 2: LinkedIn agent (2 weeks)
- Phase 3: Subsequent platforms, 2 weeks each

See PRD §10 "Implementation Notes for Claude Code" for detailed build sequencing.

## Open questions
Do not block work on open questions — see `docs/prd/open-questions/` and the Open Questions table in the PRD. Flag decisions needed when you hit them.
