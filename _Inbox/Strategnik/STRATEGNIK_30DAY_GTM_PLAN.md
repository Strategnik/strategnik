# Strategnik 30-Day GTM Positioning Sprint
**Objective:** Claim "Fractional CMO & GTM Architect for Growth-Stage B2B SaaS" as a defensible, AI-search-visible positioning before competitors move into this white space.

**How to use this file:** Work through each week sequentially. Every task has a Claude Code prompt you can run directly. Do not skip Week 1 — it is the infrastructure everything else depends on.

**Production model:** You are not writing anything manually. Claude produces all copy, schema, and content. Your job is to approve, deploy, and do outreach.

---

## Context Claude Code needs to know

```
ABOUT STRATEGNIK
- Owner: Nick Talbert
- URL: strategnik.com
- Stack: Astro + Tailwind + MDX, hosted on Vercel
- Email: nick@strategnik.com
- ICP: CEOs and CROs at growth-stage B2B SaaS companies (Series A–C, ~$2M–$30M ARR)
- Core positioning claim: "Fractional CMO & GTM Architect for Growth-Stage B2B SaaS"
- Framework: Physics of Growth™ (Momentum, Friction, Gravity pillars)
- Differentiator: builds and operates GTM systems — not advisory-only
- Services: Fractional CMO, GTM strategy, ICP development, demand gen build-out, AEO/SEO content architecture, RevOps alignment
- Named diagnostic product: Gravity Audit™ (AI visibility, content authority, organic pull assessment)
- LinkedIn: linkedin.com/in/nick-talbert
- Background: 20+ years B2B GTM — adtech (Adapt.tv/AOL, Sizmek/Amazon), martech (Quartile), B2B SaaS (Certent)

AEO CONTENT RULES (apply to every piece of content produced)
- Every post/page opens with a 40-60 word direct answer in paragraph 1
- H2s must be question-format or "N [Thing] for [Audience]" format
- FAQ section required at bottom of every post (5 Q&As minimum)
- FAQPage JSON-LD schema block required for every FAQ section
- No fluff intros — first sentence is a definitive factual claim
- Physics of Growth™ framework embedded in every long-form piece
- Author byline links to /about page on every post
- E-E-A-T signals: use first-person, include specific data points, label estimates

VOICE
- Direct, analytical, first-person
- Midwestern directness — no hedging, no consultant-speak
- Conversational authority: peer explaining something they've figured out
- No buzzwords as filler (synergy, leverage, unlock)
- No listicle energy
```

---

## Week 1 — Claim the position, fix the foundation
**Days 1–7 | Priority: CRITICAL — do not start content until this is done**

Goal: Make the site technically legible to AI answer engines and search engines. Lock the positioning claim. Deploy entity signals that let AI systems identify Strategnik as a distinct, authoritative entity.

---

### Task 1.1 — Homepage hero rewrite
**Day 1 | ~20 min**

```
CLAUDE CODE PROMPT:
Rewrite the Strategnik homepage hero section. Current file is likely src/pages/index.astro or src/components/Hero.astro — check the file structure first.

New headline: "Fractional CMO & GTM Architect for Growth-Stage B2B SaaS"
New subhead (2 sentences max): Position Strategnik as the firm that builds the GTM system — not just advises on it. Emphasize Series A–C specifically. Reference the Physics of Growth™ framework as the methodology.
CTA: "See how it works" → links to /fractional-cmo-b2b-saas (page we're building in Task 1.5)
Secondary CTA: "Book a call" → links to calendar

Do not add decorative content. Clean, direct, outcome-focused.
```

---

### Task 1.2 — Meta title + description rewrite (all key pages)
**Day 1 | ~15 min**

```
CLAUDE CODE PROMPT:
Update the meta title and meta description for the following pages. Find where meta tags are set in the Astro config or layout component.

Homepage:
- Title: "Fractional CMO & GTM Strategy for B2B SaaS | Strategnik"
- Description (150 chars max, answer-first): "Nick Talbert is a fractional CMO and GTM architect for Series A–C B2B SaaS companies. Strategy, execution, and AI-era demand generation."

/about:
- Title: "Nick Talbert — Fractional CMO & GTM Architect | Strategnik"
- Description: "20+ years building B2B GTM systems across adtech, martech, and SaaS. Strategnik helps growth-stage companies build the motion, not just the strategy."

Also add <meta name="robots" content="index, follow"> if not already present on all pages.
```

---

### Task 1.3 — Organization + Person schema (JSON-LD)
**Day 2 | ~30 min**

```
CLAUDE CODE PROMPT:
Add JSON-LD structured data to the Strategnik site. This should be injected into the <head> of the base layout component.

Create two schema blocks:

1. Organization schema for Strategnik:
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Strategnik",
  "url": "https://www.strategnik.com",
  "logo": "https://www.strategnik.com/[logo-path]",
  "description": "Fractional CMO and GTM strategy consulting for growth-stage B2B SaaS companies.",
  "founder": { "@type": "Person", "name": "Nick Talbert" },
  "sameAs": [
    "https://www.linkedin.com/company/strategnik",
    "https://www.linkedin.com/in/nick-talbert"
  ]
}

2. Person schema for Nick Talbert:
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nick Talbert",
  "jobTitle": "Fractional CMO & GTM Architect",
  "worksFor": { "@type": "Organization", "name": "Strategnik" },
  "url": "https://www.strategnik.com",
  "sameAs": [
    "https://www.linkedin.com/in/nick-talbert"
  ],
  "knowsAbout": ["Go-to-market strategy", "Fractional CMO", "B2B SaaS marketing", "Demand generation", "Answer engine optimization"]
}

Fill in the actual logo path from the project assets. Validate both blocks will render correctly in the Astro layout.
```

---

### Task 1.4 — FAQPage schema for homepage
**Day 2 | ~20 min**

```
CLAUDE CODE PROMPT:
Add a visible FAQ section to the homepage AND a matching FAQPage JSON-LD schema block. The visible text and the schema text must be 100% identical — AI engines penalize mismatches.

FAQ questions and answers to use (write the full answers in Nick's voice — direct, specific, no fluff):

Q1: What does a fractional CMO do for a B2B SaaS company?
Q2: When should a Series A company hire a fractional CMO?
Q3: What is the difference between a fractional CMO and a GTM consultant?
Q4: How does the Physics of Growth™ framework work?
Q5: What does Strategnik charge for fractional CMO engagements?

For Q5: answer honestly that engagements are scoped by need — typical retainers run $5K–$15K/month depending on scope and time commitment. Do not be evasive.

Add the FAQ section visually to the homepage below the services section. Style consistent with existing Tailwind design. Add the JSON-LD FAQPage schema block to the page <head>.
```

---

### Task 1.5 — Build /fractional-cmo-b2b-saas landing page
**Day 3–4 | ~45 min**

```
CLAUDE CODE PROMPT:
Create a new page at /fractional-cmo-b2b-saas in the Astro site.

Page purpose: SEO/AEO landing page targeting "fractional CMO for B2B SaaS" keyword cluster. This is NOT a generic services page — it is a specific, ICP-aware page for Series A–C B2B SaaS founders and CROs who are evaluating whether to hire a fractional CMO.

Page structure:
1. H1: "Fractional CMO for B2B SaaS — Series A to Series C"
2. Opening paragraph (40-60 words, answer-first): What a fractional CMO actually does at this stage. Lead with the outcome, not the service.
3. H2: "What Does a Fractional CMO Do at a Series A SaaS Company?"
4. H2: "When Is It the Right Time to Hire a Fractional CMO?"
5. H2: "How the Physics of Growth™ Framework Drives Pipeline"
   - Explain Momentum, Friction, and Gravity pillars. Embed the framework naturally.
6. H2: "What to Expect in the First 90 Days"
   - Specific, opinionated, stage-appropriate. This is what Nick actually does.
7. H2: "Frequently Asked Questions About Fractional CMO Engagements"
   - 5 Q&As with FAQPage schema
8. CTA section: "Book a GTM Architecture Call" with calendar link

Tone: Direct, credible, peer-to-peer. No agency-speak. Write as Nick would explain this to a founder over coffee.

Add FAQPage JSON-LD schema. Add BreadcrumbList schema. Add to sitemap.xml.
```

---

### Task 1.6 — Build /gtm-strategy-consultant landing page
**Day 3–4 | ~45 min**

```
CLAUDE CODE PROMPT:
Create a new page at /gtm-strategy-consultant in the Astro site.

Page purpose: SEO/AEO landing page targeting "B2B GTM strategy consultant" and "go-to-market consultant" keyword clusters. This page is for buyers who are thinking about GTM strategy as a discipline — not just marketing leadership. Often CROs and revenue-focused founders.

Differentiate clearly from /fractional-cmo-b2b-saas: this page leads with the architecture and systems framing, not the leadership/CMO framing.

Page structure:
1. H1: "B2B GTM Strategy Consultant for Growth-Stage SaaS Companies"
2. Opening paragraph (40-60 words): What a GTM architect does that a consultant doesn't. Lead with the build vs. advise distinction.
3. H2: "What Is a GTM Architect and Why Does It Matter for Series A–C Companies?"
4. H2: "The 5 Components of a Working GTM System"
   - ICP definition, positioning, pipeline mechanics, content infrastructure, measurement
5. H2: "How to Know If Your GTM Motion Is Broken"
   - Problem-aware content. This is where founders are when they find this page.
6. H2: "GTM Strategy vs. Fractional CMO: Which Does Your Company Need?"
   - Link internally to /fractional-cmo-b2b-saas
7. H2: "Frequently Asked Questions"
   - 5 Q&As with FAQPage schema
8. CTA: "Start with a Gravity Audit™" — link to /gravity-audit (we'll build this in Week 4)

Add FAQPage JSON-LD. Add to sitemap.xml.
```

---

### Task 1.7 — Submit sitemap + verify indexing
**Day 5 | ~15 min**

```
CLAUDE CODE PROMPT:
Check that sitemap.xml includes all new pages: /fractional-cmo-b2b-saas and /gtm-strategy-consultant. If sitemap is auto-generated by the Astro sitemap plugin, verify the config includes these routes.

Also check robots.txt — confirm it is not blocking any content pages and that it explicitly allows all AI crawlers:

Add to robots.txt if not present:
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: *
Allow: /

Sitemap: https://www.strategnik.com/sitemap.xml

Do not add Disallow rules for any content pages.
```

---

### Task 1.8 — AI visibility baseline test (manual — Nick does this)
**Day 6–7 | 20 min**

Run these exact prompts in ChatGPT, Perplexity, Claude.ai, and Google (with AI Overview enabled). Screenshot every result.

```
TEST PROMPTS:
1. "Who is a fractional CMO for B2B SaaS Series A companies?"
2. "What is a GTM architect?"
3. "What does a fractional CMO do for a startup?"
4. "How much does a fractional CMO cost for a SaaS company?"
5. "What is the difference between a fractional CMO and a GTM consultant?"

Save screenshots to /reference/ai-baseline-week1/
Compare again at Day 22.
```

---

## Week 2 — Content blitz: own the answer layer
**Days 8–14 | Priority: HIGH — ship all 5 posts**

Goal: Five AEO-optimized posts published and indexed. Every post answer-first, every post with FAQ schema, every post internally linked to both landing pages. Topic density is what moves AI citation probability — one great post doesn't do it.

---

### Task 2.1 — Post 1: "Fractional CMO vs. GTM Consultant"
**Day 8 | Target: 1,400–1,600 words**

```
CLAUDE CODE PROMPT:
Write a blog post for strategnik.com using the strategnik-blog skill and AEO content rules defined above.

Title: "Fractional CMO vs. GTM Consultant: What Growth-Stage B2B Companies Actually Need"
Target keyword: "fractional CMO vs GTM consultant"
Target reader: Series A–B CEO or CRO evaluating their options

AEO opening (40-60 words): Answer the question directly in the first paragraph. Don't tease — give the answer immediately.

Structure:
- H2: "What Is a Fractional CMO?"
- H2: "What Is a GTM Consultant?"
- H2: "The 3 Key Differences Between a Fractional CMO and a GTM Consultant"
- H2: "Which One Does a Series A SaaS Company Need?"
- H2: "When You Need Both: The GTM Architect Model"
  - This is where Nick's positioning lives. Introduce the Physics of Growth™ framework here.
- H2: "Frequently Asked Questions"
  - 5 Q&As + FAQPage JSON-LD

Include a comparison table (markdown format).
Add internal links to /fractional-cmo-b2b-saas and /gtm-strategy-consultant.
End with strategnik-blog CTA.

Deliver as: MDX file ready for src/content/blog/
```

---

### Task 2.2 — Post 2: "What a Fractional CMO Should Do in the First 90 Days"
**Day 9 | Target: 1,400–1,600 words**

```
CLAUDE CODE PROMPT:
Write a blog post for strategnik.com.

Title: "What a Fractional CMO Should Do in the First 90 Days at a Series A Company"
Target keyword: "fractional CMO first 90 days"
Target reader: Series A founder who just hired or is about to hire a fractional CMO

AEO opening: Lead with the concrete deliverable list for days 1–90. Be specific.

Structure:
- H2: "Days 1–30: Diagnose Before You Build"
  - GTM audit, ICP validation, pipeline review, positioning assessment
- H2: "Days 31–60: Build the Foundation"
  - Positioning lock, ICP definition, channel selection, content infrastructure
- H2: "Days 61–90: Launch and Measure"
  - First campaigns, pipeline instrumentation, reporting cadence
- H2: "What a Fractional CMO Should NOT Do in the First 90 Days"
  - Opinionated. This is a differentiator.
- H2: "How the Physics of Growth™ Framework Guides the 90-Day Plan"
- H2: "Frequently Asked Questions"
  - 5 Q&As + FAQPage JSON-LD

Internal links to both landing pages.
Deliver as: MDX file ready for src/content/blog/
```

---

### Task 2.3 — Post 3: "Fractional CMO Cost in 2026"
**Day 10 | Target: 1,200–1,400 words**

```
CLAUDE CODE PROMPT:
Write a blog post for strategnik.com.

Title: "Fractional CMO Cost in 2026: What Series A–C Companies Should Expect to Pay"
Target keyword: "fractional CMO cost 2026"
Target reader: Founder evaluating budget for fractional CMO

AEO opening: Lead with the number. $5,000–$15,000/month for most engagements. Don't bury it.

Structure:
- H2: "What Does a Fractional CMO Cost in 2026?"
  - Range, pricing models (retainer vs. project), what drives variation
- H2: "Fractional CMO vs. Full-Time CMO: The Cost Comparison"
  - Full-time CMO: $250K–$570K fully loaded. Fractional: $60K–$180K/year equivalent.
- H2: "What Should Be Included in a Fractional CMO Retainer?"
- H2: "What Drives Fractional CMO Pricing Up or Down?"
  - Hours/week, scope, stage, whether execution is included
- H2: "Is a Fractional CMO Worth It for a Series A Company?"
  - Honest answer. Not always yes.
- H2: "Frequently Asked Questions"
  - 5 Q&As + FAQPage JSON-LD

Internal links to both landing pages.
Deliver as: MDX file ready for src/content/blog/
```

---

### Task 2.4 — Post 4: "Why Your Content Doesn't Show Up in ChatGPT"
**Day 11 | Target: 1,400–1,600 words**

```
CLAUDE CODE PROMPT:
Write a blog post for strategnik.com. This is the most distinctive post of the week — no competitor has written it. It lives at the intersection of GTM strategy and AI search.

Title: "Why Your B2B Content Doesn't Show Up in ChatGPT (And What Your CMO Should Do About It)"
Target keyword: "b2b content chatgpt visibility" / "aeo for b2b saas"
Target reader: Founder or marketing leader who has noticed their company doesn't appear in AI search results

AEO opening: State the problem and the root cause in the first paragraph. Be direct.

Structure:
- H2: "Why AI Engines Ignore Most B2B Content"
  - No entity signals, no answer-first structure, no FAQ schema, no external citations
- H2: "What Is Answer Engine Optimization (AEO) and Why Does It Matter for SaaS?"
- H2: "The 5 Reasons Your Company Isn't Getting Cited by AI"
  - Specific, diagnostic, actionable
- H2: "How to Make Your B2B Brand the Answer in ChatGPT"
  - Entity authority, AEO content format, schema, citation building
- H2: "What a Fractional CMO Should Be Doing About AEO in 2026"
  - This is Nick's POV. Opinionated.
- H2: "The Gravity Audit™: How to Diagnose Your AI Visibility"
  - Introduce the named service
- H2: "Frequently Asked Questions"
  - 5 Q&As + FAQPage JSON-LD

Internal links to both landing pages AND /gravity-audit (even if page isn't live yet — use the URL, we'll build it in Week 4).
Deliver as: MDX file ready for src/content/blog/
```

---

### Task 2.5 — Post 5: "GTM Architect Guide to Answer Engine Optimization"
**Day 12–13 | Target: 2,000–2,400 words — this is the cornerstone pillar**

```
CLAUDE CODE PROMPT:
Write the cornerstone pillar post for strategnik.com. This is the most important piece of content in the 30-day plan. It introduces "GTM architect" as a category label and establishes Nick as the authority at the intersection of GTM strategy and AI search.

Title: "The GTM Architect's Guide to Answer Engine Optimization for B2B SaaS"
Target keyword: "GTM architect" + "answer engine optimization B2B SaaS"
Target reader: Sophisticated Series B/C founder or CMO who understands GTM and is curious about AEO

This post should be definitive. It should be the piece AI engines cite when someone asks about GTM + AEO.

Structure:
- H2: "What Is a GTM Architect? (And Why 'CMO' Doesn't Capture It)"
- H2: "What Is Answer Engine Optimization for B2B SaaS?"
  - 40-60 word answer. Definition-box format.
- H2: "Why B2B Buyers Now Discover Solutions Through AI, Not Google"
  - Data: 69% zero-click searches, ChatGPT 900M weekly users, Gartner 25% organic traffic shift
- H2: "The 5 Components of AEO for B2B GTM Systems"
  - Entity authority, content structure, schema markup, external citations, topical density
- H2: "How the Physics of Growth™ Framework Maps to AI Discoverability"
  - Gravity = organic AI pull, Momentum = compounding citations, Friction = discoverability barriers
  - This is the core intellectual contribution of the post
- H2: "What a GTM Architect Does Differently Than a Traditional CMO in the AEO Era"
- H2: "The Gravity Audit™: Where to Start Your AEO Diagnosis"
- H2: "Frequently Asked Questions"
  - 7 Q&As + FAQPage JSON-LD

Include speakable schema markup on this post in addition to FAQPage schema.
Internal links to all existing blog posts, both landing pages, and /gravity-audit.
Deliver as: MDX file ready for src/content/blog/
```

---

### Task 2.6 — Internal link audit + schema validation
**Day 14 | ~30 min**

```
CLAUDE CODE PROMPT:
Audit internal linking across all new content:

1. Confirm every new blog post links to /fractional-cmo-b2b-saas AND /gtm-strategy-consultant
2. Confirm both landing pages link to relevant blog posts
3. Confirm homepage links to both landing pages
4. Validate all FAQPage schema blocks using the Google Rich Results Test API pattern — check that JSON-LD is syntactically valid in each file
5. Generate a sitemap entry list showing all new URLs added this week
6. Check that all new MDX files have correct frontmatter: title, description, publishDate, author, tags
```

---

## Week 3 — Entity authority & targeted outreach
**Days 15–21 | Priority: HIGH**

Goal: Build off-site citation signals. AI engines need to see Strategnik referenced from multiple external sources to confirm entity authority. This week is about getting cited, not just publishing.

---

### Task 3.1 — Directory listing copy block
**Day 15 | Nick deploys, Claude drafts**

```
CLAUDE CODE PROMPT:
Write a standardized Strategnik profile block for fractional CMO and consultant directories. This copy will be used across all directory submissions. Must be consistent — AI engines compare entity information across sources.

Deliver:
1. Company name: Strategnik
2. One-line description (100 chars): for directory taglines
3. Short bio (150 words): for directory "About" sections
4. Services list: exact phrasing to use consistently across all directories
5. Specialty/tags: exact keywords to select in directory filters
6. Nick Talbert personal bio (150 words): for any personal profile fields

Directories to submit to (Nick does this manually using the copy block):
- Clutch.co
- GrowTal.com
- MarketerHire.com
- Consultport.com
- Toptal (advisory listing)
- Crunchbase (company profile)
- AngelList/Wellfound
```

---

### Task 3.2 — LinkedIn article 1: "The GTM Motion That Compounds"
**Day 16**

```
CLAUDE CODE PROMPT:
Write a LinkedIn long-form article in Nick Talbert's voice using the strategnik-blog skill.

Title: "The GTM Motion That Compounds (And Why Most Series A Companies Don't Have One)"
Platform: LinkedIn article (not post — full article format)
Target: CEOs and CROs at Series A–B B2B SaaS

This piece adapts the Physics of Growth™ framework for LinkedIn audience. More personal, more first-person war stories, less academic. Open with a specific failure pattern Nick has seen repeatedly.

Length: 900–1,100 words
End with: Link to the GTM Architect pillar post on strategnik.com
Include: 3–5 relevant LinkedIn hashtags at the bottom
```

---

### Task 3.3 — LinkedIn article 2: "Why Series A GTM Keeps Breaking"
**Day 17**

```
CLAUDE CODE PROMPT:
Write a LinkedIn long-form article in Nick Talbert's voice.

Title: "Why Every Series A GTM Leader Fails in the Same Way"
Hook: VP of Sales at Series A lasts an average of 7 months. Why?
Target: Series A founders who have burned through a GTM hire or are about to make one

This is a problem-aware piece, not a solution piece. The goal is ICP recognition — founders reading this should think "that's exactly what happened to us." The soft CTA at the end is "if this sounds familiar, here's how I think about it" with a link to the 90-day fractional CMO post.

Length: 900–1,100 words
Voice: More raw than the website. First-person observation. Call out the pattern specifically.
```

---

### Task 3.4 — Podcast pitch template
**Day 18**

```
CLAUDE CODE PROMPT:
Write 3 variations of a podcast guest pitch email from Nick Talbert. Target: B2B SaaS and founder-focused podcasts.

Pitch angle: "The AI Discovery Era Has Changed B2B GTM — Here's What Founders Are Missing"
Unique hook: Nick can demonstrate live how Strategnik's clients do and don't appear in ChatGPT/Perplexity results — a tangible, visual segment that works well on audio with description

Variation 1: Cold pitch (host Nick doesn't know)
Variation 2: Warm pitch (met at event or connected on LinkedIn)
Variation 3: Follow-up to no-reply on variation 1

Keep all variations under 150 words. Subject line options: 3 per variation.

Target podcast types:
- Founder/CEO focused (My First Million, Lenny's Podcast, SaaStr)
- GTM/Revenue focused (The GTM Podcast, Revenue Builders)
- Marketing/SaaS (Exit Five, B2B Marketing with Dave Gerhardt)
```

---

### Task 3.5 — ICP outreach message templates
**Day 18–19 | Nick personalizes and sends**

```
CLAUDE CODE PROMPT:
Write 10 personalized outreach message templates for LinkedIn DMs. Target: CEOs and CROs at Series A–C B2B SaaS companies.

These are NOT cold pitches. They are warm, value-first messages. The pattern:
1. Specific trigger (recent funding, job post for VP Marketing, LinkedIn post they made)
2. One relevant observation
3. Share a piece of content (the "Why Series A GTM Fails" article)
4. Zero ask

Write templates for these 10 trigger scenarios:
1. Just announced Series A funding
2. Job posting for VP Marketing or CMO
3. Posted on LinkedIn about a GTM challenge
4. Recently hired a new CRO
5. Announced a new product launch
6. Posted about AI/LLM strategy
7. Spoke at a conference (tag them)
8. Published a company blog post about growth
9. Mutual connection introduction
10. Ex-colleague at a growth-stage company

Each message: 3-4 sentences max. No fluff. No pitch.
```

---

### Task 3.6 — Cross-syndication: Medium + Substack
**Day 20–21**

```
CLAUDE CODE PROMPT:
Adapt the following 3 strategnik.com blog posts for cross-publication on Medium and Substack. Each adaptation needs:
1. A slightly modified title (same concept, platform-native phrasing)
2. A canonical notice at the top: "This post originally appeared on strategnik.com — [link]"
3. A minor intro tweak to feel native to the platform (less formal for Medium, more newsletter-y for Substack)
4. The same body content — do not rewrite the post
5. An end CTA pointing back to strategnik.com

Posts to adapt:
- "Fractional CMO vs. GTM Consultant"
- "Why Your B2B Content Doesn't Show Up in ChatGPT"
- "GTM Architect Guide to Answer Engine Optimization" (Substack only — this is the anchor piece)

Deliver as 5 separate markdown files labeled for platform and post.
```

---

## Week 4 — Amplify, measure, lock in compound momentum
**Days 22–30 | Priority: MEDIUM-HIGH**

Goal: Measure what moved. Close open loops. Build the /gravity-audit service page. Set month-2 content calendar. Establish the cadence that makes this compound.

---

### Task 4.1 — AI visibility re-test (manual — Nick does this)
**Day 22 | 20 min**

```
MANUAL TASK:
Repeat the exact same 5 test prompts from Task 1.8 in ChatGPT, Perplexity, Claude.ai, and Google AI Overview.

Compare screenshots to week-1 baseline. Document:
- Is Strategnik appearing in any results?
- Which posts are being cited?
- What competitors are appearing in the same results?
- Which queries still have zero Strategnik presence?

Save to /reference/ai-baseline-week4/
Share results with Claude Code in next session for gap analysis.
```

---

### Task 4.2 — GSC review + content updates
**Day 22–23**

```
CLAUDE CODE PROMPT:
[After Nick shares GSC data] Review the Google Search Console performance data for all new pages and posts published in weeks 1–2.

For each piece:
- If impressions > 0 but CTR < 3%: rewrite the meta description to be more answer-forward
- If position > 20: strengthen the answer-first opening paragraph with a more direct 40-60 word answer
- If position < 20 but CTR is high: add more internal links pointing to this piece

Also: identify which H2s are generating impression data (GSC shows query-level data) — rewrite any H2 that isn't matching buyer query language.
```

---

### Task 4.3 — Build /gravity-audit service page
**Day 23–24**

```
CLAUDE CODE PROMPT:
Create a new page at /gravity-audit in the Astro site. This is a named diagnostic service — the entry point for new client relationships.

The Gravity Audit™ is a structured assessment of a company's:
1. AI visibility: Does the company appear in ChatGPT, Perplexity, and Google AI Overview for relevant queries?
2. Content authority: Is existing content structured for AEO citation?
3. Organic pull: Is the GTM motion generating inbound signal or purely outbound dependent?

Page structure:
1. H1: "The Gravity Audit™ — AI Visibility & GTM Diagnostic for B2B SaaS"
2. Opening: What it is and what you walk away with (40-60 words)
3. H2: "What Does the Gravity Audit™ Cover?"
   - Three pillars: AI Visibility, Content Authority, Organic Pull
4. H2: "Who Is the Gravity Audit™ For?"
   - Series A–C B2B SaaS companies who are investing in content but not seeing AI citation
5. H2: "What You Get After a Gravity Audit™"
   - Specific deliverables: written report, priority gap list, 30-day action plan
6. H2: "How to Get Started"
   - CTA: Book a 30-min discovery call
7. H2: "Frequently Asked Questions"
   - 5 Q&As + FAQPage JSON-LD

Add Service schema (schema.org/Service) in addition to FAQPage schema.
Add to sitemap. Internal link from all existing posts that mention Gravity Audit™.
```

---

### Task 4.4 — LinkedIn content (week 4 posts — short form)
**Day 24–25**

```
CLAUDE CODE PROMPT:
Write 3 LinkedIn posts (not articles — short-form status updates) for Nick to publish across days 24–26.

Post 1 — Insight post:
Topic: One observation about how AI search is changing B2B buyer behavior. Specific and data-grounded. End with a question that invites comments. 150-200 words.

Post 2 — Question post:
"What's the biggest GTM mistake you see at Series A?" — Nick's version of this question. Frame it from his POV, invite genuine responses, signal he's the person to follow on this topic. 100 words max.

Post 3 — Client observation post (anonymized):
Share a pattern Nick has seen across his current client engagements. No names. Specific enough to be credible, anonymized enough to be safe. 150-200 words.

Each post: no hashtag spam (max 2 relevant tags), no engagement-bait, no "drop a comment below" CTAs. These should feel like a peer sharing something they actually noticed.
```

---

### Task 4.5 — Month-2 content calendar
**Day 27–28**

```
CLAUDE CODE PROMPT:
Build the month-2 content calendar for strategnik.com. 5 posts, publish cadence of 1 per week + 1 bonus piece.

Based on the week-1–2 keyword clusters and white space identified in the competitive research, prioritize these topics:

Post 1: "How to Build a Pipeline Engine for Series B: The GTM Architecture Framework"
Post 2: "Physics of Growth™: Why Brand Mass Matters More Than Tactics in AI Search"
Post 3: "Series A GTM Benchmarks: What Good Looks Like in 2026"
Post 4: "How to Evaluate a Fractional CMO Before You Hire One"
Post 5: "The B2B Content Architecture That AI Engines Actually Cite"

For each post, deliver:
- Final title
- Target keyword (primary)
- Target reader + their stage
- AEO opening paragraph (40-60 words — write it now so it's ready)
- H2 outline
- Internal linking plan (which existing pages it should link to)
- Estimated word count
- Priority rank (1–5)

Deliver as a structured markdown table + individual outlines.
```

---

### Task 4.6 — Speakable schema on top 3 posts
**Day 29–30**

```
CLAUDE CODE PROMPT:
Add speakable schema markup to the top 3 posts published in week 2. Speakable schema marks specific sections of content for AI assistant and voice search citation.

Posts to update:
1. "GTM Architect Guide to Answer Engine Optimization" (cornerstone — highest priority)
2. "Fractional CMO vs. GTM Consultant"
3. "Why Your B2B Content Doesn't Show Up in ChatGPT"

For each post:
- Identify the 2-3 sections that are most answer-forward and citation-worthy
- Add speakable JSON-LD schema pointing to those sections using cssSelector
- Validate schema is syntactically correct

The speakable sections should be the ones that directly answer "what is" and "how to" questions — these are what voice assistants extract.
```

---

### Task 4.7 — Month-1 recap email (Nick sends)
**Day 29–30**

```
CLAUDE CODE PROMPT:
Write a brief recap email from Nick Talbert to his warm contact list. This is NOT a pitch. It is a top-of-mind signal and social proof builder.

Tone: Personal, direct, low-key. Like an email to a colleague, not a newsletter blast.

Content:
- What Strategnik published this month (list the 5 posts with links)
- One observation about what you're seeing in the market right now (Physics of Growth angle)
- One soft mention of the Gravity Audit™ as something new
- No CTA except "reply if any of this resonates"

Length: 200 words max. Subject line options: 3 variations.
```

---

## Success metrics — end of day 30

| Metric | Target | How to check |
|---|---|---|
| AI visibility (Strategnik cited) | Appearing in ≥1 AI result for target queries | Manual test (Task 4.1) |
| New pages indexed | 7+ (2 landing pages + 5 posts) | Google Search Console |
| Schema deployed | FAQPage on all 7 pages, Organization + Person on homepage | Rich Results Test |
| Content published | 5 blog posts + 2 landing pages | strategnik.com |
| Directory listings | 5+ live with consistent NAP | Manual verification |
| LinkedIn articles | 2 published | LinkedIn |
| Outreach sent | 10 ICP DMs + 5 podcast pitches | Personal tracking |
| /gravity-audit live | 1 service page indexed | GSC |
| Month-2 calendar | Outlined and ready | This file, Task 4.5 |

---

## Reference: AEO content checklist (run on every piece before publishing)

- [ ] First paragraph is 40-60 words and directly answers the target question
- [ ] H1 contains primary keyword
- [ ] All H2s are question-format or "N [Thing] for [Audience]" format
- [ ] No fluff intro sentences — first sentence is a factual claim
- [ ] FAQ section at bottom with minimum 5 Q&As
- [ ] FAQPage JSON-LD schema present and matching visible text exactly
- [ ] Internal links to /fractional-cmo-b2b-saas AND /gtm-strategy-consultant
- [ ] Author byline links to /about
- [ ] Physics of Growth™ framework referenced at least once
- [ ] At least one specific data point or statistic included
- [ ] Meta description is answer-first and under 155 characters
- [ ] Page added to sitemap.xml
- [ ] Validated in Google Rich Results Test

---

## Reference: Positioning vocabulary (use consistently everywhere)

| Use this | Not this |
|---|---|
| Fractional CMO & GTM Architect | Marketing consultant |
| Growth-stage B2B SaaS | Startups / SMB |
| Series A–C | Early-stage |
| Physics of Growth™ | Our methodology |
| Gravity Audit™ | Marketing audit |
| GTM system / GTM motion | Marketing strategy |
| Pipeline mechanics | Lead gen |
| Organic pull | Inbound |
| AI discovery era | Digital transformation |
| Build and operate | Advise and guide |

---

*File generated: Strategnik 30-Day GTM Positioning Sprint*
*Use in Claude Code: upload this file and reference it at the start of each working session with "Continue the 30-day plan — we're on [Task X.X]"*
