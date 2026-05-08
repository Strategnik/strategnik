# PLG Quick Reference: Building a Healthy PQL→SQL Funnel for Developer Products

## What You're Building

A product-led growth motion for developer products (APIs, dev tools, infrastructure) requires three systems working together:

1. **Signal architecture** — friction points that capture buying intent data
2. **PQL scoring engine** — variables that identify when a user is ready for sales
3. **Brand infrastructure layer** — GitHub repos, technical content, and community distribution that multiply touchpoints

Most PLG funnels break because they build #2 without #1, or try B2B marketing tactics on developers (who ignore them). This guide maps what to build and how the pieces connect for developer-focused products.

---

## 1. Signal Architecture: The Four Data Capture Points

Your free tier needs to capture buying intent signals, not just usage signals. Four friction points generate the cleanest data:

### Signup Gate
**What to build:** Work email requirement + company name + use case field.

**Why it matters:** Filters out 40% of signups who were never going to buy (students, competitors, side projects). Yes, your signup conversion drops. Every downstream metric improves.

**Data captured:** Domain (company size proxy), use case (product fit), job function (decision-maker vs. IC).

**PQL variable:** `has_work_email`, `company_domain`, `stated_use_case`

---

### Integration Boundary
**What to build:** Sandbox mode (frictionless exploration) + production mode gate (requires verification step when moving from test to prod).

**Why it matters:** "Trying your API" ≠ "building on your API." The integration boundary is where casual exploration becomes real commitment.

**Data captured:** Time from signup to production integration, whether they integrated into existing codebase vs. side project.

**PQL variable:** `production_integration_date`, `integration_depth_score`

**How to implement:** Simple as "tell us about your use case to get production API keys" or requiring a verified account to lift rate limits. The question itself generates signal even if the answer is light.

---

### Free-to-Paid Conversion Wall
**What to build:** Usage-based limits (API calls, containers, users) + feature gates (SSO, audit logs, SLA guarantees, advanced permissions).

**Why it matters:** The wall calibration determines whether usage converts to revenue or becomes permanently free. For developer products: usage limits capture growth trajectory, feature gates capture enterprise requirements.

**Data captured:** How close users are to limits, which features they're attempting to access but can't, upgrade page visits, pricing page time.

**PQL variable:** `usage_limit_proximity` (% of free tier consumed), `enterprise_feature_requests`, `pricing_page_visits`

**Calibration rule:** Free tier should get them to "this works and we want more" — not to "this is enough forever." If >30% of active users never hit the wall, it's too high.

---

### Team Expansion Gate
**What to build:** Collaboration features behind paid tier (shared workspaces, team permissions, SSO) + invite limit on free tier.

**Why it matters:** One developer using your product is an experiment. Five developers across three teams is either a serious evaluation or a company exploiting your free tier. The team expansion moment forces the question.

**Data captured:** Team size, cross-team usage patterns, admin behavior (are they managing the team or just inviting people).

**PQL variable:** `team_size`, `cross_team_usage`, `admin_engagement_score`

---

## 2. PQL Scoring Architecture

A product-qualified lead for developer products should answer: **Is this user/account showing signs of production dependency + enterprise need?**

### Core PQL Variables

**Production Usage Signals**
- `api_calls_last_30d` — volume matters, but trajectory matters more
- `error_rate` — low error rate = they figured it out = they're building something real
- `integration_points` — connected to other tools in their stack (CI/CD, monitoring, etc.)
- `usage_consistency` — daily usage > weekly spikes

**Enterprise Intent Signals**
- `team_size` — 5+ users is enterprise territory
- `sso_attempt` or `audit_log_request` — features only enterprise buyers need
- `usage_limit_proximity` — hitting 70%+ of free tier consistently
- `domain_firmographic` — company size, funding stage, industry (enrich from Clearbit/PDL)

**Engagement Signals**
- `docs_depth` — reading advanced docs vs. just quickstart
- `community_participation` — active in Discord/Slack/forums
- `support_ticket_quality` — detailed, production-related questions vs. "how do I start"
- `pricing_page_visits` — frequency + time on page

### Scoring Logic

Simple version:
```
PQL Score = (Production Usage × 0.4) + (Enterprise Intent × 0.4) + (Engagement × 0.2)

If PQL Score > 70 AND team_size ≥ 3 → Route to Sales
```

Advanced version: Build separate thresholds for developer-led (IC pushing up) vs. top-down (exec/manager evaluating). The PQL signals differ.

**Developer-led PQL:**
- High production usage + low enterprise signals = developer advocacy play
- Route to developer relations, not enterprise AE
- Nurture with technical content, not sales calls

**Top-down PQL:**
- Enterprise signals (SSO attempts, pricing page visits) + moderate usage = exec evaluation
- Route to enterprise AE immediately
- Speed matters — exec evals move faster or die

---

## 3. Brand Infrastructure Layer

PLG distribution creates touchpoints (one dev uses your API, tells their team). Brand infrastructure converts touchpoints into surface area by multiplying one piece of technical content across 6-10 developer channels.

### The Distribution Multiplier: One Piece → Ten Touchpoints

You write one technical deep-dive. It becomes:

1. **GitHub repo** — working code example with full implementation
2. **Dev.to article** — the technical narrative explaining the pattern
3. **Reddit post** — in r/devops, r/kubernetes, r/programming (wherever your ICP hangs out)
4. **Discord/Slack channels** — shared in relevant developer communities (not your own community — theirs)
5. **HackerNews submission** — if the technical depth is strong enough
6. **YouTube walkthrough** — 10-minute screenshare of the implementation
7. **Technical blog post** — canonical version on your domain
8. **Twitter/X thread** — key insights + link to GitHub
9. **Stack Overflow answer** — when relevant questions appear
10. **Newsletter feature** — to your developer mailing list

**The pattern:** Build once (the GitHub repo + working code), then distribute the narrative across every channel where developers discover tools.

### What to Build

**GitHub as Primary Distribution**
- **SDKs in every major language** — Python, JavaScript/TypeScript, Go, Rust (whatever your ICP uses)
- **Example repos** — not "hello world" but production-grade implementations: "Real-time data pipeline with [Your API] + Kafka + PostgreSQL"
- **Starter templates** — clone-and-run repos that solve specific problems
- **Migration scripts** — if you're displacing an incumbent, build the migration tooling
- **Debugging utilities** — open source tools that work with or without your API (builds credibility)

**Why GitHub matters:** Developers trust code over copy. A repo with 500 stars is more credible than a case study. Every repo is a touchpoint. Every fork is a signal. Every issue/PR is engagement.

**Developer Content Engine (Technical Credibility)**
- **Industry-specific use cases** — not "use our API for logging" but "How fintech companies handle PCI-compliant API logging with [Your API]"
- **Performance benchmarks** — "We load-tested 10 observability APIs at 100K requests/sec. Here's the data."
- **Architecture deep-dives** — "How we built sub-10ms P99 latency: a deep dive into our query engine"
- **Integration guides** — specific stack combinations: "[Your API] + Terraform + AWS Lambda + DataDog"
- **Comparison posts** — "[Your API] vs. [Competitor]: Technical benchmark with reproducible results"

**Why it compounds:** Developers share technical content that teaches them something. Every piece that solves a real problem gets shared in Discord channels, Slack workspaces, and Reddit threads you'll never see. That sharing is distribution you didn't pay for.

**Distribution Channels (Developer-Specific)**
- **Dev.to** — long-form technical articles, often outrank your own blog
- **Reddit** — r/devops, r/kubernetes, r/golang, r/webdev (wherever your ICP is active)
- **Discord servers** — not your own server (that's empty at the start) but established communities where your ICP already hangs out
- **Slack communities** — same principle. Find where the conversation is happening, add value there
- **HackerNews** — if your content is technically deep enough and genuinely interesting (not marketing)
- **Stack Overflow** — answer questions in your category, link to your detailed guides when relevant
- **Conference talks** — KubeCon, AWS re:Invent, language-specific conferences. Talks become YouTube content become blog posts become GitHub repos

**Data feedback loop:** Product telemetry shows which integrations/workflows developers are building → you build the GitHub example repo + technical guide → you distribute across 6-10 channels → more developers find it and implement the same pattern → usage data compounds.

---

## 4. Integration Map: How the Systems Work Together

**Scenario 1: High-Quality PQL Path**
1. Developer signs up with work email, states use case = "CI/CD pipeline automation"
2. Integrates into production within 48 hours (integration boundary signal)
3. Usage grows from 5K API calls/week to 40K over 30 days (production dependency forming)
4. Invites 3 teammates (team expansion signal)
5. Hits 80% of free tier limit (conversion wall proximity)
6. Visits pricing page 3x, average 4min per visit (buying intent)
7. **PQL score crosses threshold → Route to sales with context:** "Production CI/CD integration, 4-person team, near limit, pricing research active"

**Sales approach:** "Saw you're running CI/CD workflows on our platform — how's it going? We have customers doing similar patterns at scale, happy to show you how they handle [specific technical challenge based on usage data]."

**Scenario 2: High-Volume Low-Signal Path**
1. Developer signs up with Gmail, no use case stated
2. Runs 100 API calls in sandbox, never integrates to production
3. No teammates invited, no enterprise feature attempts
4. Usage drops after week 1
5. **PQL score stays low → Nurture with technical content, don't waste sales cycles**

**Scenario 3: GitHub → Community → Enterprise Path**
1. Developer finds your GitHub repo: "Production-grade Kubernetes deployment with [Your API] + ArgoCD"
2. Stars the repo, clones it, implements it in their staging environment
3. Posts in company Slack: "Got our monitoring stack running in 20 minutes with this" + link to your repo
4. Three other teams see it, fork the repo, implement similar patterns
5. Developer writes a Dev.to post about their implementation, mentions your API
6. Post gets shared in r/kubernetes and a Discord server for platform engineers
7. Now 15 developers across 5 teams using the free tier, all organically
8. Engineering director sees the sprawl, asks "what is this tool everyone's using?"
9. Platform lead explains: "It's handling our observability/API gateway/[your category]. Works great but we're hitting the team limits and need SSO."
10. **Enterprise PQL without outbound → GitHub distribution → community amplification → bottom-up buying pressure**

---

## What to Measure

**Top of funnel (volume metrics)**
- Signups with work email (not total signups)
- Production integrations (not sandbox experiments)
- Multi-user accounts (not individual devs)
- GitHub stars/forks on official repos (developer credibility proxy)
- Community engagement (Discord joins, Reddit upvotes, HN points)

**Middle of funnel (quality metrics)**
- PQL-to-opportunity conversion rate (should be >40% for well-calibrated scoring)
- Time from PQL to close (should compress as scoring improves)
- Sales velocity by PQL score band (proves the model works)
- Developer-sourced leads (came via GitHub, Dev.to, Reddit) vs. paid channels

**Bottom of funnel (revenue health)**
- Expansion revenue from PLG accounts (are they growing after conversion?)
- PLG CAC vs. sales-led CAC (PLG should be 50-70% lower)
- NRR by acquisition channel (PLG users should expand faster if the motion is healthy)
- Developer advocacy conversion (users who contribute to repos/docs/community → enterprise deals)

**Distribution effectiveness**
- GitHub repo engagement (stars, forks, issues, PRs per month)
- Community-driven content (Stack Overflow answers, Reddit mentions, Discord shares)
- Organic keyword rankings for "[your category] + [integration]"
- Content multiplier ratio (1 technical guide → how many channel distributions → how many signups)

**The compound metric:** PQL-qualified pipeline as % of total pipeline. If it's <30% after 12 months of PLG investment, something in the signal architecture is broken.

---

## Common Failure Modes

**Loose friction + aggressive PQL thresholds = phantom pipeline**
You attract volume, score them as PQLs based on usage, sales calls them and discovers they're students/side projects/competitors. Sales stops trusting the system.

**Fix:** Tighten friction at signup (work email minimum) and add enterprise intent signals to scoring.

**Tight friction + weak brand infrastructure = growth ceiling**
You filter for good fits, they convert well, but you're not generating enough top-of-funnel volume to scale.

**Fix:** Build the content engine. Developer products scale through education, not ads.

**Strong usage signals + no conversion wall = permanently free users**
Developers love your product, use it heavily, never need to pay because free tier is too generous.

**Fix:** Recalibrate the wall. Usage limits should capture growth trajectory. Feature gates should require payment for enterprise needs (SSO, SLA, compliance).

**B2B marketing tactics to developer products = credibility death**
You run LinkedIn ads, webinars, gated whitepapers, sales-y landing pages. Developers smell the marketing BS and bounce.

**Fix:** GitHub first, marketing second. Build repos developers actually use. Write technical content that teaches something. Distribute in communities where developers already are. Let the code earn credibility before asking for the sale.

---

## Implementation Checklist

### Week 1-2: Signal Architecture
- [ ] Add work email requirement to signup
- [ ] Add company name + use case fields to signup flow
- [ ] Define sandbox vs. production boundary in product
- [ ] Set up telemetry to track integration depth

### Week 3-4: PQL Scoring
- [ ] Define PQL variables based on signal architecture
- [ ] Build scoring model (start simple: production usage + enterprise intent + engagement)
- [ ] Set initial threshold (PQL score > 70 + team size ≥ 3)
- [ ] Wire PQL scoring to CRM (HubSpot/Salesforce)

### Week 5-8: Brand Infrastructure (Developer-Specific)
- [ ] Publish 3 production-grade example repos on GitHub (one per major ICP use case)
- [ ] Build SDK in top 2 languages your ICP uses (start with Python + JavaScript/Go/Rust)
- [ ] Write 3 technical deep-dives (architecture, performance, integration patterns)
- [ ] Distribute each piece across 6+ channels (Dev.to, Reddit, Discord, HN, blog, GitHub)
- [ ] Set up community monitoring (track mentions in Reddit, Discord, Stack Overflow)
- [ ] Launch technical blog (not marketing — actual engineering content)

### Month 3+: Iteration
- [ ] Review PQL-to-opportunity conversion rate monthly
- [ ] Adjust scoring thresholds based on sales feedback
- [ ] Identify which content drives highest-quality signups
- [ ] Tighten or loosen conversion wall based on revenue vs. adoption goals

---

**The framework in one sentence:** Build friction points that capture intent data, score PQLs on production dependency + enterprise need, and multiply each piece of technical content across 6-10 developer channels (GitHub, Dev.to, Reddit, Discord, HN) to convert product distribution into buying momentum.
