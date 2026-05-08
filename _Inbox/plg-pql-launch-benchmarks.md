# PLG / PQL Business Launch Playbook
## Benchmarks, Rules & Guidelines for Developer-Led Product-Led Growth

---

## How to Use This Document

This is a reference guide for launching and operating a product-led growth motion where a developer or technical user adopts the product first, and the business upsells into the organization via Product Qualified Leads (PQLs). Every benchmark is sourced from OpenView (450–1,000+ products), ProductLed (600+ companies), Pocus, Bessemer, Kyle Poyar / Growth Unhinged, Tomasz Tunguz / Redpoint, and public disclosures from Datadog, Snowflake, MongoDB, Cloudflare, GitLab, and Snyk.

**Data quality caveat:** Most benchmarks derive from self-reported surveys. Companies that don't track metrics tend not to respond, so medians likely skew slightly favorable. Public-company NRR figures are audited. Treat these as directional targets, not gospel.

---

## 1. Funnel Benchmarks at a Glance

| Stage | Median / "Good" | Top Quartile / Best-in-Class |
|---|---|---|
| Visitor → signup | 5–10% | 15–20% |
| Signup → activation | 20–30% | 40–60% (70% best) |
| Time-to-value | < 30 min | < 5–15 min |
| 28-day retention | ~23% (dev tools) | 40%+ |
| Free → paid (6-month cohort) | 5% (dev-tool median) | 15–25% |
| PQL conversion (PQL → paid) | 25–30% | 30–39% by ACV band |
| PQL → SQL | 20–30% | 40%+ |
| PLG-sourced SQL → closed-won | 25–40% | 50%+ |
| Enterprise sales cycle (PLG-sourced) | 60–120 days | 30–60 days |
| Net revenue retention (NRR) | 100–110% | 120–135%+ |
| Gross retention (enterprise) | 90–95% | 95%+ |
| Visitor → eventual paying customer | 0.3–0.5% | 1–3% |
| Visitor → eventual enterprise deal | 0.025–0.075% | ~0.2% |

---

## 2. Stage-by-Stage Benchmarks & Rules

### 2.1 Top of Funnel: Visitor → Signup

**Benchmarks**

- Free trial products: ~5% median visitor-to-signup; 75th percentile ~10%.
- Freemium products: ~9% median; 75th percentile ~20%.
- Developer-focused products: ~10% median (OpenView 2023 dev-tools cut) — higher than general SaaS, likely because developer landing pages with concrete product copy convert technical buyers efficiently.
- Average user takes 3.3 website visits before signing up.

**Rules**

- If your visitor-to-signup rate is below 5%, your landing page has a messaging or friction problem. Fix that before spending on acquisition.
- Measure signup rate on a per-visitor basis (unique visitors, not sessions).
- Organic search and SEO drive 40% of new users at top PLG companies. Product virality drives another 16%. Paid acquisition is a minority channel for the best PLG businesses.

**Guidelines**

- Lead with what the product does, not what category it belongs to. Developers convert on specificity.
- Minimize signup friction: email-only or SSO. Every additional field costs conversion.
- Build for the return visit. If 3+ visits are typical before signup, your docs, changelog, and pricing page matter as much as your hero section.

---

### 2.2 Activation: Signup → "Aha Moment"

**Benchmarks**

- Median activation rate across PLG B2B SaaS: 36–37%.
- Standout PLG companies: 20–30% of signups reach activation (meaning even elite products lose 70%+ before core value).
- Top aspiration: 40–60%. Best-in-class: 70%+.
- Day-7 activation across 2,500+ Amplitude customers: ~6.8% average.
- Only 34% of PLG companies actually track activation. If you're not tracking it, you can't improve it.

**Rules**

- Define your activation event before you launch. It must be a single, measurable in-product action that correlates with retention — not a vanity metric like "completed onboarding."
- If activation requires another teammate or an integration, your activation rate will be structurally lower. Plan for it.
- 7-day activation correlates 69% with 3-month retention (Amplitude 2025). This is your leading indicator for the entire downstream funnel.

**Guidelines**

- Public activation examples worth studying: Slack = 2,000 team messages exchanged (93% conversion when reached). Datadog = 100 monitoring events over 7+ days. Snyk = first code scan plus teammate invite. Zapier = first Zap created. Loom = first video shared.
- Instrument activation tracking from day one. Retrofit is painful and introduces survivorship bias.
- Optimize the path to activation, not the path through onboarding. They're not the same thing.

---

### 2.3 Time-to-Value (TTV)

**Benchmarks**

- Exceptional: under 5 minutes (Stripe, Twilio).
- Good for freemium dev tools: under 15 minutes (Vercel, Supabase, Cursor).
- Acceptable for free trials: under 30 minutes.

**Rules**

- If a developer can't get meaningful output from your product in 15 minutes, you have a TTV problem that will suppress every downstream metric.
- TTV is a product investment, not a marketing problem. Treat it as the highest-leverage engineering priority during launch.

**Guidelines**

- Ship sample data, starter templates, or pre-configured environments. Don't make developers bring their own data to evaluate you.
- Measure TTV as time from signup to activation event, not time from signup to first login.

---

### 2.4 Free-to-Paid Conversion

**Benchmarks by model (6-month conversion window)**

| Model | Good | Great |
|---|---|---|
| Freemium, self-serve only | 3–5% | 6–8% |
| Freemium with sales-assist | 5–7% | 10–15% |
| Free trial (any) | 8–12% | 15–25% |
| Free trial, credit card required (opt-out) | ~40% | ~49% |
| Free trial, no card required (opt-in) | ~10% | ~18% |

**Developer-specific penalty:** Dev-focused companies convert at ~5% median vs. ~10% for non-developer products — a 50% haircut. Reasons: developers gate-keep, integrations require approvals, and buying decisions move to procurement/security committees.

**Benchmarks by ACV**

| ACV | Median | Top Quartile |
|---|---|---|
| < $1K | Lower median | 24% |
| $1K–$5K | 10% (highest median) | Strong |
| $5K–$10K | Mid-single digits | Mid-teens |
| $10K+ | Low single digits | Low double digits |

**Conversion timing:** ~54% of conversions happen within 3 months; ~85% within 12 months. Measure 6-month cohort conversion as your headline number.

**Rules**

- Time-based and usage-based trials convert ~2× better than feature-limited or seat-limited trials.
- Sales follow-up doubles conversion for free trials and quadruples it for freemium when sales reaches >50% of signups. This is the single biggest non-product lever.
- 14-day trials are most common; 7-day trials show the highest conversion (~40%), though this may reflect selection bias (only high-confidence products use 7-day trials).

**Guidelines**

- Choose your model based on ACV, not aesthetics. Freemium works for < $1K ACV and viral products. Free trial works for $1K–$10K ACV. Sales-assisted trial works for $10K+.
- If you're below 3% conversion after 6 months with a freemium model, diagnose whether it's an activation problem (users never reach value) or a monetization problem (users reach value but won't pay). The fixes are completely different.

---

### 2.5 PQL Definition & Framework

**What defines a PQL**

A PQL is a user or account that has reached an activation milestone in-product AND fits ICP AND/OR shows buying intent. The composition blends three signal types:

1. **Behavioral signals**: feature usage thresholds, login frequency, invitations sent, integrations added, hitting free-tier limits, pricing page visits.
2. **Firmographic fit**: company size, vertical, geography (enriched via Clearbit, ZoomInfo, or similar).
3. **Intent signals**: pricing page visits, docs-page depth, admin/billing page access during trial.

**Rules**

- Only ~25% of PLG companies have a formal PQL framework. Those that do see 3× higher conversion and 5–6× higher conversion vs. MQL-only motions. Implementing PQL infrastructure is the highest-leverage operational change available for a developer-led PLG company.
- A PQL is not "anyone who signed up." It's not "anyone who's active." It requires both product engagement AND fit/intent signals.
- Start simple. Your V1 PQL definition should be 2–3 behavioral signals plus one firmographic filter. Refine from there.

**Guidelines**

- Instrument PQL signals from the beginning. You need event tracking on activation milestones, usage thresholds, and pricing/billing page visits.
- Use a PQL scoring model, not a binary threshold. Score accounts on a weighted blend of usage depth, team size, firmographic fit, and intent signals. Route to sales above a threshold.
- Review and recalibrate PQL definitions quarterly. What correlates with conversion will shift as your product and market evolve.

---

### 2.6 PQL Conversion Benchmarks

**PQL → Paid**

- Overall benchmark: 25–30%.
- By ACV: $1K–$5K = 30%; $5K–$10K = 39%.
- PQLs convert at 5–6× the rate of MQLs.

**PQL → SQL**

- Typical rate: 20–30%.
- Once a PQL is engaged by sales, the playbook is "help, don't sell" — the product has already done the qualification.

**Rules**

- If your PQL → paid rate is below 20%, your PQL definition is too loose. Tighten the behavioral threshold.
- If your PQL → paid rate is above 40%, your PQL definition may be too tight and you're leaving pipeline on the table. Loosen it and test.
- MQL → SQL benchmark for comparison: 10–20% (median ~13–15%). MQL → closed-won: ~6%. 84-day gap to first sales conversation. PQLs are structurally better leads.

**Guidelines**

- Route PQLs to sales within 24 hours of qualification. Speed matters because the user is actively in the product.
- Sales motions on PQLs should reference the user's actual product behavior. "I noticed your team has been using [feature] — can I help you [expand/unlock/configure]?" not "I'd love to schedule a demo."
- Track PQL → paid conversion by cohort month. The trend matters more than the absolute number.

---

### 2.7 SQL → Closed-Won & Enterprise Upsell

**Benchmarks**

- General SaaS SQL → closed-won: 15–25%.
- PLG-sourced SQL → closed-won: 25–40%; top quartile 50%+.
- PLG-sourced deals close faster at every ACV band because the prospect arrives pre-activated.
- Traditional enterprise sales cycle: 134 days median (up 22–25% since 2022), 8–13 stakeholders.
- PLG-sourced enterprise deals: conversations "start in the middle" — discovery and value-proof are largely done.

**Deal cycle by size**

| ACV | Typical Cycle |
|---|---|
| < $1K | ~25 days |
| $10K–$50K | ~75 days |
| $50K–$100K | ~90 days |
| $100K+ | 90–180+ days |
| $500K+ | 270+ days |

**Rules**

- Sales is not optional past ~$10M ARR. OpenView data is unambiguous: 40%+ of new ARR at developer-PLG companies comes from sales-led motions.
- In the OpenView 2023 dev-tools cut, revenue split was: 40% sales-led, 22% sales-assisted, 21% self-serve, 17% partner/other. Even self-described PLG companies derive over half of new ARR from sales motions.

**Guidelines**

- Build the sales-assist motion before you need it. Hire your first AE when you see PQLs converting to paid without help — that's the signal that sales will accelerate, not create, demand.
- Equip AEs with product-usage dashboards for every account. The AE's job is to convert existing usage into an org-wide contract, not to cold-pitch.
- The "sandwich" or "pincher" model is the default: bottoms-up self-serve adoption plus a top-down enterprise motion, both fed by the same product-usage signal.

---

### 2.8 Expansion Revenue & Net Revenue Retention

**NRR benchmarks (Bessemer Good/Better/Best)**

| Tier | NRR |
|---|---|
| Good | 100% |
| Better | 110% |
| Best | 120%+ |
| Best-in-class (dev/infra, usage-based) | 130%+ |

**Additional context**

- Public SaaS median NRR: ~110% (2024).
- Private SaaS median NRR: 101–106% (enterprise-segment private SaaS averages 115–125%; SMB sits 90–105%).
- PLG companies report 15–20% higher NRR than sales-led peers.
- By ACV: enterprise (>$100K) median 118%; mid-market ($25K–$100K) 108%; SMB (<$25K) 97%.
- Gross retention: SMB 70–80%; mid-market 80–90%; enterprise 90%+.

**Public PLG developer/infrastructure reference points**

- Snowflake: peaked at 162% NRR; settled to 127–131%.
- Datadog: mid-110s through 2024; 603 customers at $1M+ ARR (up from 462 YoY).
- Twilio: 137% historical peak.
- MongoDB: 120%+ at peak.
- Cloudflare: consistently 110–115%.
- GitLab: ~125%+ at IPO, declining toward ~120%.

**Rules**

- If your NRR is below 100%, you have a retention problem that no amount of acquisition will solve. Fix churn before scaling.
- Usage-based pricing is the structural driver of best-in-class NRR. ~85% of SaaS companies now use some form of usage-based pricing (up from 28% in 2023).
- In-product expansion prompts (triggered at the moment of value — hitting usage limits, feature gates) convert at ~40%, vs. ~3–5% for generic upsell emails. Build expansion triggers into the product.

**Guidelines**

- Design pricing with expansion built in. Usage-based or seat-based models create natural expansion as the customer grows. Flat-rate pricing caps your NRR.
- Track NRR by cohort, not blended. A blended 110% NRR can hide a churn problem in older cohorts masked by expansion in newer ones.
- The land-and-expand playbook is the default for developer-led PLG. Plan for initial deal sizes of 10–20% of eventual account value. Datadog's $1M+ ARR customers almost all started as a single team adopting one product.

---

## 3. End-to-End Funnel Math

### The developer-led freemium math

Per 1,000 unique website visitors:

- ~100 sign up (10%)
- ~30 reach activation (30% of signups)
- ~5 convert to paid within 6 months (5% of signups)
- ~0.5–1.0 eventually expand into enterprise tier ($50K+ ACV) over 12–36 months
- Each enterprise account expands at 120–135%+ NRR annually

### Implied unit economics

- Only 0.3–0.5% of visitors become a paying customer short-term.
- Only 0.025–0.075% of visitors eventually become enterprise deals.
- But each enterprise deal is worth orders of magnitude more, and usage-based expansion compounds lifetime value.
- Cursor's trajectory: enterprise revenue grew from ~25% at $500M ARR to ~60% at $2B ARR — product created demand, sales captured expansion.

---

## 4. Launch Checklist: Non-Negotiables Before Going Live

### Product & Instrumentation

- [ ] Activation event defined and instrumented (single measurable action correlated with retention)
- [ ] TTV under 15 minutes for the core use case
- [ ] Event tracking on: signup, activation event, feature usage depth, pricing page visits, invite actions, integration connections, usage limit hits
- [ ] Firmographic enrichment on signups (company size, vertical, domain — Clearbit, ZoomInfo, or similar)
- [ ] PQL scoring model defined (V1: 2–3 behavioral signals + 1 firmographic filter)

### Pricing & Packaging

- [ ] Free tier or trial designed with expansion in mind (usage-based or seat-based, not flat-rate)
- [ ] Clear upgrade trigger: the moment the user hits a limit that matters (not an arbitrary gate)
- [ ] Self-serve purchase flow live and tested

### Go-to-Market

- [ ] Visitor-to-signup tracking live (unique visitors, not sessions)
- [ ] Cohort-based conversion tracking set up (6-month window as headline metric)
- [ ] PQL → sales routing workflow defined (who gets the lead, how fast, what context they see)
- [ ] Sales playbook written for PQL engagement ("help, don't sell" — reference actual product usage)

### Measurement

- [ ] Dashboard tracking: visitor → signup → activation → PQL → paid → expansion
- [ ] NRR tracking by cohort from month one
- [ ] Weekly review cadence on activation rate and TTV — these are leading indicators for everything downstream

---

## 5. Key Mental Models

**The developer penalty is real but the expansion upside is unmatched.** Dev-focused companies convert free-to-paid at roughly half the rate of non-developer products, but they dominate the highest-NRR cohort in public software. The economics work because developer-led adoption is structurally land-and-expand.

**PQL infrastructure is a 3× lever that almost no one uses.** Only ~25% of PLG companies have a formal PQL framework. Implementing one is the highest-leverage operational change for a developer-led company where free-to-paid median is already 5%.

**Sales is not optional past $10M ARR.** The hybrid (self-serve + sales-assist + sales-led) is the default, not an exception. Plan for it from the start even if you don't hire an AE on day one.

**TTV is the leading indicator.** The 69% correlation between 7-day activation and 3-month retention means time-to-value effectively predicts the entire downstream funnel. Treat it as the highest-priority product investment.

**Measure cohorts, not blends.** Every metric in this document is more useful tracked by signup cohort than as a blended monthly average. Blended numbers hide problems.

---

## Sources

- OpenView Product Benchmarks 2022–2023 (450–1,000+ B2B SaaS products, in partnership with Amplitude and Pendo)
- Boldstart Ventures / Anna Debenham — Dev-tools benchmark cut from OpenView 2023
- ProductLed PLG Benchmarks 2024 (600+ companies)
- Pocus Product-Led Sales Benchmark 2022–2023 (170–200+ PLG companies)
- Lenny Rachitsky / Lenny's Newsletter — Free-to-paid conversion benchmarks (joint study with Pendo)
- Kyle Poyar / Growth Unhinged — PLG metrics and SaaS product metrics guides
- Tomasz Tunguz / Redpoint — Free trial research (600+ companies)
- Bessemer Venture Partners — State of the Cloud, NRR benchmarks
- Amplitude Product Benchmark Report 2025 (2,600+ products)
- Userpilot Product Metrics Benchmark Report 2024 (547 companies)
- ChartMogul SaaS Benchmarks 2024 (2,500+ businesses)
- Public 10-K filings: Datadog, Snowflake, MongoDB, Cloudflare, Twilio, GitLab, JFrog
- Ebsta / Pavilion GTM Benchmarks (655K opportunities, $48B pipeline)
- SaaS Mag — PLG in 2026 analysis
- Stateshift — Developer GTM measurement 2025
