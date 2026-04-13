# Strategnik Weekly SEO Health Check — 2026-04-13

**Generated:** Monday, April 13, 2026  
**Report type:** Source-code analysis (live HTTP blocked — see §1 note)

---

## Status Summary

| Check | Status | Notes |
|---|---|---|
| robots.txt | ✅ PASS | All bots allowed, sitemap ref correct |
| sitemap config | ✅ PASS | @astrojs/sitemap w/ GTMengineoption filter |
| Key page SEO (5 pages) | ⚠️ 2 minor issues | See §3 |
| Blog post SEO (spot-check) | ✅ PASS | All required fields present |
| New content frontmatter | ✅ PASS | All 21 new posts pass |
| llms.txt | ✅ EXISTS | Comprehensive; minor gaps noted |
| Vercel deployment | ⏳ PENDING | OAuth auth required to check |
| Live HTTP spot-check | ❌ BLOCKED | Cloudflare rejected automated fetches |

---

## §1 — Sitemap Validation

**Note:** Live HTTP fetch of `https://strategnik.com/sitemap-index.xml` returned 403 (Cloudflare bot protection blocks the automated fetcher's user-agent and sandbox outbound connections). All checks below are derived from source code.

**Sitemap configuration** (`astro.config.mjs`):
- Integration: `@astrojs/sitemap`
- Filter: excludes URLs containing `GTMengineoption`
- Site: `https://strategnik.com`

**Estimated URL count (~43 total):**
- Static pages: ~22
  - `/`, `/thinking/`, `/intelligence-layer/`, `/gravity-audit/`, `/physics-of-growth/`
  - `/physics-of-growth/friction/`, `/physics-of-growth/momentum/`
  - `/services/`, `/experience/`, `/work/`, `/architecture/`, `/calculator/`
  - `/fractional-cmo-b2b-saas/`, `/gtm-strategy-consultant/`, `/survey/`
  - `/intelligence-layer-animation/`
  - `/case-studies/clean-rooms/`, `/case-studies/developer-discovery/`
  - `/case-studies/government-marketplace/`, `/case-studies/lifecycle-archetypes/`
  - `/case-studies/privacy-pivot/`, `/case-studies/propensity-scoring/`
- Blog posts: 21 (all non-draft, published via `/thinking/[slug]`)

**⚠️ Issue: `intelligence-layer-animation` page in sitemap**  
`/intelligence-layer-animation/` uses a raw custom HTML head (no `BaseLayout`), has no canonical tag, and no robots noindex directive. It will appear in the sitemap and be indexable. If this is a demo/animation-only page, add `<meta name="robots" content="noindex">` or exclude it from the sitemap via the filter.

**⚠️ Issue: `/survey/` in sitemap**  
If `survey.astro` is an internal intake form, confirm whether indexing is intentional. If not, add noindex or add `survey` to the sitemap filter.

**Live spot-check:** Could not perform (403). To verify manually, fetch `https://strategnik.com/sitemap-index.xml` from a browser or non-blocked environment.

---

## §2 — robots.txt Verification

**Source:** `public/robots.txt`

```
User-agent: GPTBot       Allow: /  ✅
User-agent: ClaudeBot    Allow: /  ✅
User-agent: PerplexityBot Allow: / ✅
User-agent: Googlebot    Allow: /  ✅
User-agent: *            Allow: /  ✅

Disallow: /api/          ✅ (API routes blocked)
Disallow: /GTMengineoption1  ✅
Disallow: /GTMengineoption2  ✅

Sitemap: https://strategnik.com/sitemap-index.xml  ✅
```

**Result: PASS.** All required crawlers allowed. Sitemap reference is correct. Sensitive pages blocked.

---

## §3 — Page Health Spot-Check

**Source-code verified.** `BaseLayout.astro` provides: `<title>`, `<meta name="description">`, `<link rel="canonical">`, full OG tag set, and dual JSON-LD (Organization + Person schema) for all pages that use it.

### 5 Key Pages

| Page | Title | Description | Canonical | OG Tags | JSON-LD | Issues |
|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ | ✅ Organization + Person | None |
| `/thinking/` | ⚠️ | ✅ | ✅ | ✅ | ✅ Organization + Person | Weak title (see below) |
| `/intelligence-layer/` | ✅ | ✅ | ✅ | ✅ | ✅ Service + WebPage + FAQPage | None |
| `/gravity-audit/` | ✅ | ✅ | ✅ | ✅ | ✅ Service + WebPage + FAQPage | None |
| `/physics-of-growth/` | ✅ | ✅ | ✅ | ⚠️ | ✅ Organization + Person | Default OG image |

**⚠️ Issue: `/thinking/` title is "Thinking \| Strategnik"**  
This is too generic for SEO and AI citation. Recommended: something like `"GTM Strategy & Field Notes for B2B SaaS | Strategnik"` or `"The Thinking: GTM, AI, and Physics of Growth | Strategnik"`.

**⚠️ Issue: `/physics-of-growth/` uses default OG image**  
No `image` prop passed to `BaseLayout` — falls back to `/images/og-default.png`. Create and assign a dedicated Physics of Growth OG image for better social sharing.

### 5 Blog Post Spot-Check (sample from new posts)

All blog posts use `PostLayout`, which wraps `BaseLayout` and adds Article JSON-LD schema with `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `articleSection`, and optional `SpeakableSpecification`.

| Post slug | Title | Desc | Canonical | OG | JSON-LD Article |
|---|---|---|---|---|---|
| `when-frictionless-breaks-plg` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `chief-marketing-orchestrator` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `aeo-statistics-b2b-saas-2026` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `gtm-architect-guide-answer-engine-optimization` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `why-b2b-content-doesnt-show-up-in-chatgpt` | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result: PASS.** All checked posts fully instrumented.

---

## §4 — New Content Detection (Last 7 Days)

**Period:** 2026-04-06 through 2026-04-13  
**New posts added:** 21  
**Modified posts (not newly added):** aeo-statistics-b2b-saas-2026, b2b-gtm-metrics-benchmark-2026 (external links added + additional updates)

### Newly Added Posts

All 21 posts pass the required frontmatter check: ✅ title, ✅ description, ✅ image, ✅ category, ✅ date.

| Slug | Date (frontmatter) | Added to Repo | Category |
|---|---|---|---|
| `when-frictionless-breaks-plg` | 2026-04-12 | Apr 12 | physics |
| `physics-of-marketing-definitive-guide` | 2026-04-12 | Apr 12 | physics |
| `aeo-statistics-b2b-saas-2026` | 2026-04-12 | Apr 12 | field-notes |
| `b2b-gtm-metrics-benchmark-2026` | 2026-04-12 | Apr 12 | physics |
| `chief-marketing-orchestrator` | 2026-04-12 | Apr 11 | physics |
| `context-engineering-vs-intelligence-layer` | 2026-04-08 | Apr 8 | field-notes |
| `from-chatbot-to-agent-fleet` | 2026-04-08 | Apr 8 | field-notes |
| `your-ai-is-still-a-chatbot` | 2026-04-08 | Apr 8 | physics |
| `six-components-of-an-intelligence-layer` | 2026-04-08 | Apr 8 | playbook |
| `gtm-architect-guide-answer-engine-optimization` | 2026-04-07 | Apr 8 | playbook |
| `why-b2b-content-doesnt-show-up-in-chatgpt` | 2026-04-06 | Apr 8 | field-notes |
| `ai-collapsing-gtm-walls` | **2025-02-10** ⚠️ | Apr 8 | physics |
| `fractional-cmo-cost-2026` | 2026-04-05 | Apr 8 | playbook |
| `fractional-cmo-first-90-days` | 2026-04-04 | Apr 8 | playbook |
| `fractional-cmo-vs-gtm-consultant` | 2026-04-03 | Apr 8 | playbook |
| `funnel-math-kills-the-deal` | 2026-04-03 | Apr 8 | playbook |
| `friction-problem` | **2025-01-05** ⚠️ | Apr 8 | physics |
| `stage-appropriate-gtm-metrics-saas` | **2025-02-03** ⚠️ | Apr 8 | physics |
| `momentum-marketing-investments` | **2025-02-03** ⚠️ | Apr 8 | physics |
| `why-gtm-leaders-churn-early-stage-saas` | **2025-02-03** ⚠️ | Apr 8 | physics |
| `inflection-points` | **2024-12-28** ⚠️ | Apr 8 | physics |

**⚠️ Backdated posts (6 posts):** Posts `ai-collapsing-gtm-walls`, `friction-problem`, `stage-appropriate-gtm-metrics-saas`, `momentum-marketing-investments`, `why-gtm-leaders-churn-early-stage-saas`, and `inflection-points` carry 2024–2025 frontmatter dates but were added to the repo in the last 7 days. Likely intentional (evergreen content with authentic publication dates). Be aware that Google may treat these as existing content republished rather than new — this is generally fine and avoids freshness gaming, but confirm the dates are accurate to avoid potential crawl date mismatch confusion.

**Notable commit this week:**  
`Add 48 external source links across 10 blog posts` (Apr 12) — significant outbound link addition. External links are healthy for credibility, but verify all 48 URLs are to authoritative, live domains (Forrester, Gartner, SparkToro confirmed valid).

---

## §5 — Vercel Deployment Status

**Status: ⏳ PENDING AUTH**

Vercel MCP server is configured but requires OAuth authorization. To complete:

1. Open this URL in a browser: `https://api.anthropic.com/authorize?response_type=code&client_id=2692e8b0-eb04-42d9-a908-0929458e43f8&code_challenge=VslOA1ysbEAyLM3BNDyD089EIyl48FBBkeU8UaVQtBw&code_challenge_method=S256&redirect_uri=http%3A%2F%2Flocalhost%3A60631%2Fcallback&state=JQV_cZ6ItegcjNTKJFsFokAg4TsyDnydwJCzKKMs6vE`
2. After authorizing, copy the full callback URL from the address bar and paste it into chat.
3. Deployment status check can then run automatically.

Project: `prj_1ldbPSKjayIU9dMG59DZ414iZjDS` | Team: `team_f2awD2ZsBlJPuReLUba4pqJ8`

---

## §6 — llms.txt Verification

**Source:** `public/llms.txt`  
**Status: ✅ EXISTS AND COMPREHENSIVE**

Current coverage:
- ✅ About / practice description
- ✅ Intelligence Layer definition + 6 components
- ✅ Physics of Growth framework (all 5 forces)
- ✅ Services (4 listed with descriptions)
- ✅ Key pages with full URLs
- ✅ Nick Talbert expertise + background
- ✅ Key concepts / AI-citable claims

**Minor gaps:**
- ❌ Active clients not listed (Codiac, Navix) — adding client names improves entity recognition
- ❌ No representative blog post list — AI systems benefit from a `/thinking` index to cite specific articles
- ❌ No case study mentions — missing "past work" signal for trust/authority

**Recommended additions:**
```
## Active Clients
- Codiac (Kubernetes / AI agent orchestration)
- Navix (Freight audit SaaS)

## Selected Writing
- When Frictionless Breaks: The Signal Problem in B2B PLG: https://strategnik.com/thinking/when-frictionless-breaks-plg
- AEO Statistics for B2B SaaS (2026): https://strategnik.com/thinking/aeo-statistics-b2b-saas-2026
- The Physics of Marketing — Definitive Guide: https://strategnik.com/thinking/physics-of-marketing-definitive-guide
```

---

## Issues Log

| Priority | Issue | Location | Action |
|---|---|---|---|
| Medium | `/intelligence-layer-animation/` lacks canonical + noindex | `src/pages/intelligence-layer-animation.astro` | Add `<meta name="robots" content="noindex">` or exclude from sitemap |
| Medium | `/thinking/` page title too generic | `src/pages/thinking/index.astro` | Rewrite to keyword-rich title |
| Low | `/physics-of-growth/` missing dedicated OG image | `src/pages/physics-of-growth/index.astro` | Create and assign `/images/og-physics-of-growth.png` |
| Low | `/survey/` indexability unconfirmed | `src/pages/survey.astro` | Confirm if intentional; add noindex if not |
| Low | llms.txt missing client names + post index | `public/llms.txt` | Add Codiac, Navix, and 3-5 top posts |
| Info | 6 posts carry backdated frontmatter dates | Multiple | Confirm dates are accurate; no action required if intentional |
| Info | Live HTTP checks blocked by Cloudflare | Environment | Run spot-check manually or from unblocked IP |
| Pending | Vercel deployment status unverified | Vercel MCP | Complete OAuth flow (see §5) |

---

*Report generated from source code analysis. Live HTTP verification requires manual or unblocked environment check.*
