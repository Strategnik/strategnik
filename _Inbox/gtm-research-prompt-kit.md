# GTM Research Prompt Kit: 21 Business Types

## How to Use

Each prompt below is self-contained and ready to run as a standalone deep research query. Every prompt includes:

1. **Universal Schema** — the standardized fields every business type must return
2. **Type-Specific Schema** — additional fields unique to that business type
3. **Graph Output Spec** — instructions for structuring output as entities, relationships, and properties for graph ingestion

Run each prompt as its own research session. The universal schema ensures cross-type comparability. The type-specific schema captures what makes each type's GTM structurally distinct.

---

## Universal Schema Reference

Every prompt requests these fields. They are embedded in each prompt below so each is self-contained, but this is the canonical reference.

### Core Identity
- Business type label
- Definition (1-2 sentences)
- B2B / B2C / Buyer-Agnostic classification
- Typical company stages where this model applies (seed, Series A, Series B, growth, mature)

### Buyer & Market
- Primary buyer persona(s): title, function, seniority
- Secondary buyer persona(s) / influencers
- Typical buying committee size and composition
- Buyer motivation hierarchy (what they're actually solving for, rank-ordered)
- Average sales cycle length (range by deal size)
- Decision-making process (evaluation → selection → procurement)

### Acquisition & Channels
- Primary acquisition channels (ranked by typical contribution to pipeline)
- Secondary / emerging channels
- Inbound vs. outbound mix (typical % split)
- Role of content marketing and what formats work
- Role of partnerships / channel / referral
- Paid acquisition: typical channels, viable CAC range, when it works vs. doesn't

### Funnel & Conversion
- Funnel stages (awareness → activation → revenue → expansion → advocacy) with stage-specific definitions for this business type
- Benchmark conversion rates at each stage (ranges, not single numbers)
- Typical lead-to-close rate
- Average deal size / ACV (range by segment)
- Pipeline velocity formula inputs: # of opportunities, win rate, deal size, cycle length

### Revenue Model & Unit Economics
- Pricing model(s): how revenue is structured
- Typical pricing range or tiers
- CAC benchmarks (range by channel)
- LTV benchmarks (range by segment)
- Target CAC:LTV ratio
- Payback period (months to recover CAC)
- Gross margin benchmarks
- Net revenue retention (NRR) benchmarks where applicable
- Expansion revenue: how it works, what % of total revenue, primary levers

### Retention & Churn
- Churn rate benchmarks (monthly and/or annual, by segment)
- Primary churn drivers (top 3-5 reasons customers leave)
- Primary retention levers (top 3-5 things that reduce churn)
- Leading indicators of churn (signals before cancellation)
- Win-back: does it work, common tactics

### Sales Motion
- Primary sales motion: self-serve / inside sales / field sales / channel / hybrid
- When to introduce sales (trigger points or thresholds)
- Sales team structure at different stages (seed → A → B)
- Typical quota and comp structure
- Role of sales engineering / solution consulting
- Handoff mechanics: marketing → sales → CS

### Positioning & Competitive Dynamics
- Primary positioning dimensions (what you compete on)
- Typical competitive landscape structure (fragmented, oligopoly, winner-take-all, etc.)
- Switching costs: high / medium / low, and what creates them
- Moat sources (what sustains competitive advantage)
- Common positioning mistakes

### Metrics & KPIs
- Top 7-10 KPIs that matter most for this business type (ranked)
- KPIs that are vanity metrics for this type (commonly tracked but misleading)
- Board-level metrics vs. operating metrics distinction

### GTM Anti-Patterns
- Top 5 most common GTM mistakes for this business type
- Premature scaling signals specific to this type
- When the model breaks (conditions where this GTM stops working)

### Team & Org
- Typical GTM team structure at seed stage
- Typical GTM team structure at Series A
- Typical GTM team structure at Series B
- Key first GTM hire and why
- When to split sales/marketing leadership

---

## Type-Specific Schema Extensions

These additional fields are appended to the universal schema for specific business types.

### Product-Led SaaS (B2B) — Extension
- Product-qualified lead (PQL) definition: what triggers a sales touch
- Activation metric: what constitutes "activated" user
- Time-to-value benchmark
- Viral / network coefficient (if applicable)
- Free-to-paid conversion rate benchmarks
- Self-serve vs. sales-assisted revenue split
- In-product conversion triggers and nudges

### Product-Led SaaS (B2C) — Extension
- App store dynamics: ASO, ratings, category ranking
- Activation metric and onboarding completion rate
- Free-to-paid conversion rate benchmarks
- Day 1 / Day 7 / Day 30 retention benchmarks
- Viral / referral coefficient
- Monetization model: freemium, subscription, in-app purchase, ads
- Role of push notifications and lifecycle messaging

### Sales-Led SaaS — Extension
- Outbound motion: SDR/BDR model, sequence structure, connect rates
- Enterprise vs. mid-market vs. SMB motion differences
- Multi-threading: how many stakeholders to engage
- Procurement / legal / security review dynamics
- Professional services attach rate
- Implementation timeline and its impact on revenue recognition
- Champion-building tactics

### Hybrid PLG + Sales SaaS — Extension
- Handoff trigger: what signal moves a user from self-serve to sales-assisted
- PQL vs. MQL: how both coexist
- Self-serve revenue ceiling (at what ACV does sales become required)
- Team friction: how to comp and organize two motions
- Product data → sales signal pipeline
- Conversion path differences: individual → team → enterprise

### Usage-Based / Infrastructure — Extension
- Consumption metric: what unit is metered
- Commit vs. on-demand pricing dynamics
- Developer adoption funnel: awareness → trial → integration → production
- Documentation and developer experience as GTM lever
- Open source strategy (if applicable): community → commercial conversion
- Bottom-up adoption → top-down expansion pattern
- Cost transparency and billing predictability as retention lever

### Vertical SaaS — Extension
- Industry-specific compliance / regulatory requirements
- Role of industry events, associations, and trade shows
- Embedded fintech / payments as revenue lever
- Workflow completeness: how much of the vertical's workflow you must own
- Switching cost dynamics specific to the vertical
- Word-of-mouth density within vertical communities
- Multi-location / franchise dynamics within the vertical

### Data / API Product — Extension
- Integration complexity and time-to-integration
- Data freshness, coverage, and accuracy as competitive dimensions
- Embedded vs. standalone usage patterns
- Developer vs. business buyer: who initiates, who pays
- Usage metering and pricing per call / record / query
- Data moat: how data assets compound over time
- Compliance and data provenance requirements

### Marketplace / Platform — Extension
- Supply vs. demand: which side to acquire first
- Chicken-and-egg solution tactics
- Liquidity metrics: what constitutes a liquid marketplace
- Take rate benchmarks and pricing power dynamics
- Disintermediation risk and how to defend against it
- Trust and safety as GTM infrastructure
- Geographic / category density thresholds
- Network effects: same-side vs. cross-side

### E-commerce / DTC Brand — Extension
- Customer acquisition by channel: paid social, search, influencer, retail, affiliate
- ROAS / MER benchmarks by channel
- Average order value (AOV) and basket size optimization
- Email/SMS lifecycle revenue contribution
- Retail / wholesale expansion: when and how
- Inventory and margin management impact on GTM
- Brand vs. performance marketing budget split
- Subscription conversion (one-time → recurring)

### Subscription Commerce — Extension
- Trial-to-paid conversion rate benchmarks
- Monthly vs. annual billing dynamics
- Involuntary churn (payment failure) rate and recovery
- Subscription fatigue: category-level saturation dynamics
- Gift and seasonal acquisition spikes
- Skip / pause rate and its relationship to cancellation
- Unboxing / first-delivery experience as activation lever
- Referral program benchmarks

### B2B Local / Regional Service Business — Extension
- Territory economics: serviceable radius, density requirements
- Contract vs. project vs. retainer revenue mix
- Bid / proposal process and win rates
- Account management and relationship continuity
- Fleet / crew utilization as growth constraint
- Commercial referral networks (property managers, GCs, etc.)
- Seasonal demand patterns and capacity planning

### B2C Local / Regional Service Business — Extension
- Local SEO and Google Business Profile optimization
- Review generation and reputation management
- Yard signs, truck wraps, and physical presence as channels
- Neighbor-referral and neighborhood density effects
- Seasonal demand patterns
- Emergency vs. scheduled service mix and pricing
- Home services platform dynamics (Angi, Thumbtack, etc.)
- Average ticket size and frequency of repeat purchase

### Professional Services / Consultancy — Extension
- Utilization rate benchmarks and capacity planning
- Rate structure: hourly vs. project vs. retainer vs. value-based
- Thought leadership as lead generation: what works, what doesn't
- Referral network mechanics and partner development
- Expertise signaling: credentials, publications, speaking
- Scope creep management and its GTM implications
- Productization path: when and how to package expertise into repeatable offerings
- Leverage model: 1:1 delivery vs. scaled delivery

### Agency — Extension
- Project vs. retainer revenue mix and how it affects growth
- Case study and portfolio as primary sales collateral
- Client concentration risk thresholds
- Creative / performance / technical specialization as positioning
- White-label and subcontracting dynamics
- Pitch / RFP process and win rates
- Talent as constraint: hiring as GTM bottleneck
- Platform / tool certification as channel strategy

### Managed Services / Outsourced Ops — Extension
- SLA structure and how it drives pricing and retention
- Compliance and security certification as table stakes
- Multi-year contract dynamics: TCV, renewal, and expansion
- Transition / onboarding period and cost
- Operational efficiency metrics that drive margin
- Staff augmentation vs. outcome-based: positioning implications
- Vendor consolidation trends and bundling strategy

### Franchise / Multi-Location — Extension
- Dual GTM: corporate brand marketing vs. local execution
- Franchise unit economics: average unit volume, ramp time
- Franchisee acquisition as a GTM motion (selling the franchise itself)
- Territory protection and cannibalization management
- Marketing fund structure (national vs. local co-op)
- Playbook replicability: what can be standardized, what must be localized
- Multi-unit operator dynamics

### Content / Media (B2B) — Extension
- Audience development funnel: reach → subscriber → engaged → monetizable
- Sponsorship and advertising sales as primary revenue
- Event / community extension as revenue and retention lever
- Lead generation / content syndication as a service to advertisers
- Editorial credibility vs. commercial pressure tension
- Newsletter, podcast, and owned media benchmarks

### Content / Media (B2C) — Extension
- Consumer subscription pricing and conversion benchmarks
- Ad-supported vs. subscription vs. hybrid model dynamics
- Algorithm dependency: platform distribution risk
- Creator / talent dependency and IP ownership
- Engagement metrics: time spent, frequency, share rate
- Paywall strategy: hard, metered, freemium

### Community / Membership — Extension
- Member acquisition cost and onboarding-to-engagement rate
- Engagement metrics: DAU/MAU, posts per member, event attendance
- Free-to-paid conversion in freemium community models
- Member-generated content and value creation dynamics
- Event (virtual and IRL) as engagement and acquisition lever
- Renewal and annual membership retention benchmarks
- Community platform choice and its impact on growth

### B2B Hardware + Connected Product — Extension
- Channel strategy: direct, distributor, VAR, OEM
- Hardware margin vs. recurring software/service margin
- Integration and deployment complexity
- Proof of concept / pilot process and conversion to purchase
- Support and maintenance contract attach rate
- Product lifecycle and upgrade/replacement cycle
- Certification and compliance as market entry requirements

### B2C Hardware + Connected Product — Extension
- Retail channel strategy: DTC, Amazon, big-box, specialty
- Unboxing and setup experience as activation
- App / connected experience as retention lever
- Warranty and support cost impact on unit economics
- Crowdfunding as validation and pre-sale channel
- Accessory and consumable attach revenue
- Review and influencer seeding strategy
- Return rate benchmarks and their margin impact

---

## The 21 Research Prompts

Each prompt is ready to run. Copy-paste into a deep research session.

---

### Prompt 1: Sales-Led SaaS

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Sales-Led SaaS companies (seed stage through Series B). This is a B2B software business where revenue is primarily driven by account executives running demo-to-close sales cycles, with annual or multi-year contracts.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges (not single numbers) and note the source or basis. Distinguish between seed/early-stage and Series A/B benchmarks where they differ materially.

UNIVERSAL SCHEMA — return all of the following:

Core Identity: business type label, definition, B2B/B2C classification, typical company stages where this model applies.

Buyer & Market: primary buyer persona(s) with title/function/seniority, secondary buyer personas and influencers, typical buying committee size and composition, buyer motivation hierarchy (rank-ordered), average sales cycle length (range by deal size), decision-making process from evaluation through procurement.

Acquisition & Channels: primary acquisition channels ranked by typical pipeline contribution, secondary and emerging channels, inbound vs. outbound mix (typical % split), role of content marketing and effective formats, role of partnerships/channel/referral, paid acquisition channels with viable CAC range and when it works vs. doesn't.

Funnel & Conversion: funnel stages from awareness through advocacy with stage-specific definitions, benchmark conversion rates at each stage (ranges), typical lead-to-close rate, average deal size / ACV (range by segment), pipeline velocity formula inputs.

Revenue Model & Unit Economics: pricing model(s), typical pricing range or tiers, CAC benchmarks by channel, LTV benchmarks by segment, target CAC:LTV ratio, payback period in months, gross margin benchmarks, NRR benchmarks, expansion revenue mechanics and percentage of total revenue.

Retention & Churn: churn rate benchmarks (monthly and annual by segment), primary churn drivers (top 3-5), primary retention levers (top 3-5), leading churn indicators, win-back viability and tactics.

Sales Motion: primary sales motion, when to introduce sales, sales team structure at seed/A/B stages, typical quota and comp structure, role of sales engineering, marketing-to-sales-to-CS handoff mechanics.

Positioning & Competitive Dynamics: primary positioning dimensions, typical competitive landscape structure, switching costs (level and what creates them), moat sources, common positioning mistakes.

Metrics & KPIs: top 7-10 KPIs ranked, vanity metrics for this type, board-level vs. operating metrics.

GTM Anti-Patterns: top 5 most common GTM mistakes, premature scaling signals, conditions where this model breaks.

Team & Org: typical GTM team structure at seed, Series A, and Series B. Key first GTM hire and reasoning. When to split sales/marketing leadership.

TYPE-SPECIFIC EXTENSION — also return:

Outbound motion details: SDR/BDR model, sequence structure, typical connect and reply rates. Enterprise vs. mid-market vs. SMB motion differences. Multi-threading: how many stakeholders to engage and how. Procurement/legal/security review dynamics and how they affect cycle length. Professional services attach rate benchmarks. Implementation timeline and its revenue recognition impact. Champion-building tactics and why they matter.

OUTPUT FORMAT:
Structure your response for graph database ingestion. Organize the output as a set of entities (nodes) with properties, and explicit relationships between them. Use this pattern:

Entity: [Name] (Type: [entity type])
Properties:
- property_name: value
Relationships:
- [RELATIONSHIP_TYPE] → [Target Entity]

Primary entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver.

Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO.

Use ranges and arrays for multi-valued properties. Include confidence levels (high/medium/low) on benchmark data where sourcing varies.
```

---

### Prompt 2: Hybrid PLG + Sales SaaS

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Hybrid PLG + Sales SaaS companies (seed stage through Series B). This is a B2B software business that combines product-led growth (self-serve signup, free tier or trial) with a sales-assisted expansion motion. Users enter through the product; sales engages when usage or team size hits a threshold.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges (not single numbers) and note the source or basis. Distinguish between seed/early-stage and Series A/B benchmarks where they differ materially.

UNIVERSAL SCHEMA — return all of the following:

Core Identity: business type label, definition, B2B/B2C classification, typical company stages where this model applies.

Buyer & Market: primary buyer persona(s) with title/function/seniority, secondary buyer personas and influencers, typical buying committee size and composition, buyer motivation hierarchy (rank-ordered), average sales cycle length (range by deal size), decision-making process from evaluation through procurement.

Acquisition & Channels: primary acquisition channels ranked by typical pipeline contribution, secondary and emerging channels, inbound vs. outbound mix (typical % split), role of content marketing and effective formats, role of partnerships/channel/referral, paid acquisition channels with viable CAC range and when it works vs. doesn't.

Funnel & Conversion: funnel stages from awareness through advocacy with stage-specific definitions, benchmark conversion rates at each stage (ranges), typical lead-to-close rate, average deal size / ACV (range by segment), pipeline velocity formula inputs.

Revenue Model & Unit Economics: pricing model(s), typical pricing range or tiers, CAC benchmarks by channel, LTV benchmarks by segment, target CAC:LTV ratio, payback period in months, gross margin benchmarks, NRR benchmarks, expansion revenue mechanics and percentage of total revenue.

Retention & Churn: churn rate benchmarks (monthly and annual by segment), primary churn drivers (top 3-5), primary retention levers (top 3-5), leading churn indicators, win-back viability and tactics.

Sales Motion: primary sales motion, when to introduce sales, sales team structure at seed/A/B stages, typical quota and comp structure, role of sales engineering, marketing-to-sales-to-CS handoff mechanics.

Positioning & Competitive Dynamics: primary positioning dimensions, typical competitive landscape structure, switching costs (level and what creates them), moat sources, common positioning mistakes.

Metrics & KPIs: top 7-10 KPIs ranked, vanity metrics for this type, board-level vs. operating metrics.

GTM Anti-Patterns: top 5 most common GTM mistakes, premature scaling signals, conditions where this model breaks.

Team & Org: typical GTM team structure at seed, Series A, and Series B. Key first GTM hire and reasoning. When to split sales/marketing leadership.

TYPE-SPECIFIC EXTENSION — also return:

Handoff trigger: what signal moves a user from self-serve to sales-assisted (usage thresholds, team size, feature gates). PQL vs. MQL: how both coexist, which takes priority, how they're scored differently. Self-serve revenue ceiling: at what ACV does sales become required. Team friction: how to comp and organize two simultaneous motions without conflict. Product data to sales signal pipeline: what data flows from product to CRM and how. Conversion path differences: individual user → team adoption → enterprise deal.

OUTPUT FORMAT:
Structure your response for graph database ingestion. Organize the output as a set of entities (nodes) with properties, and explicit relationships between them. Use this pattern:

Entity: [Name] (Type: [entity type])
Properties:
- property_name: value
Relationships:
- [RELATIONSHIP_TYPE] → [Target Entity]

Primary entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver.

Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO.

Use ranges and arrays for multi-valued properties. Include confidence levels (high/medium/low) on benchmark data where sourcing varies.
```

---

### Prompt 3: Usage-Based / Infrastructure

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Usage-Based / Infrastructure companies (seed stage through Series B). This is a B2B business selling infrastructure, developer tools, or platform services priced on consumption (API calls, compute, storage, data volume, etc.). Buyers are typically technical — developers, engineers, or platform teams — and adoption is bottom-up.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges (not single numbers) and note the source or basis. Distinguish between seed/early-stage and Series A/B benchmarks where they differ materially.

UNIVERSAL SCHEMA — return all of the following:

Core Identity: business type label, definition, B2B/B2C classification, typical company stages where this model applies.

Buyer & Market: primary buyer persona(s) with title/function/seniority, secondary buyer personas and influencers, typical buying committee size and composition, buyer motivation hierarchy (rank-ordered), average sales cycle length (range by deal size), decision-making process from evaluation through procurement.

Acquisition & Channels: primary acquisition channels ranked by typical pipeline contribution, secondary and emerging channels, inbound vs. outbound mix (typical % split), role of content marketing and effective formats, role of partnerships/channel/referral, paid acquisition channels with viable CAC range and when it works vs. doesn't.

Funnel & Conversion: funnel stages from awareness through advocacy with stage-specific definitions, benchmark conversion rates at each stage (ranges), typical lead-to-close rate, average deal size / ACV (range by segment), pipeline velocity formula inputs.

Revenue Model & Unit Economics: pricing model(s), typical pricing range or tiers, CAC benchmarks by channel, LTV benchmarks by segment, target CAC:LTV ratio, payback period in months, gross margin benchmarks, NRR benchmarks, expansion revenue mechanics and percentage of total revenue.

Retention & Churn: churn rate benchmarks (monthly and annual by segment), primary churn drivers (top 3-5), primary retention levers (top 3-5), leading churn indicators, win-back viability and tactics.

Sales Motion: primary sales motion, when to introduce sales, sales team structure at seed/A/B stages, typical quota and comp structure, role of sales engineering, marketing-to-sales-to-CS handoff mechanics.

Positioning & Competitive Dynamics: primary positioning dimensions, typical competitive landscape structure, switching costs (level and what creates them), moat sources, common positioning mistakes.

Metrics & KPIs: top 7-10 KPIs ranked, vanity metrics for this type, board-level vs. operating metrics.

GTM Anti-Patterns: top 5 most common GTM mistakes, premature scaling signals, conditions where this model breaks.

Team & Org: typical GTM team structure at seed, Series A, and Series B. Key first GTM hire and reasoning. When to split sales/marketing leadership.

TYPE-SPECIFIC EXTENSION — also return:

Consumption metric: what unit is metered and how pricing maps to value delivered. Commit vs. on-demand pricing dynamics: when to introduce commits, typical discount for commit. Developer adoption funnel: awareness → trial → integration → production (with conversion benchmarks at each stage). Documentation and developer experience as GTM lever: what good looks like, how it impacts conversion. Open source strategy (if applicable): community → commercial conversion rates and tactics. Bottom-up adoption → top-down expansion pattern: how individual developer usage becomes an enterprise deal. Cost transparency and billing predictability as retention lever.

OUTPUT FORMAT:
Structure your response for graph database ingestion. Organize the output as a set of entities (nodes) with properties, and explicit relationships between them. Use this pattern:

Entity: [Name] (Type: [entity type])
Properties:
- property_name: value
Relationships:
- [RELATIONSHIP_TYPE] → [Target Entity]

Primary entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver.

Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO.

Use ranges and arrays for multi-valued properties. Include confidence levels (high/medium/low) on benchmark data where sourcing varies.
```

---

### Prompt 4: Vertical SaaS

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Vertical SaaS companies (seed stage through Series B). This is a B2B software business building an industry-specific platform for a single vertical (e.g., restaurants, construction, dental, logistics). Often bundles payments, workflow, or compliance into the platform. GTM is concentrated within the vertical's ecosystem.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges (not single numbers) and note the source or basis. Distinguish between seed/early-stage and Series A/B benchmarks where they differ materially.

UNIVERSAL SCHEMA — return all of the following:

Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org. (Use the full field definitions from the universal schema: each section includes all sub-fields such as persona details, conversion rate ranges, CAC/LTV benchmarks, churn drivers, team structure by stage, etc.)

TYPE-SPECIFIC EXTENSION — also return:

Industry-specific compliance and regulatory requirements that shape GTM. Role of industry events, associations, and trade shows as acquisition channels with ROI benchmarks. Embedded fintech / payments as a revenue lever: attach rates, revenue contribution, margin impact. Workflow completeness: how much of the vertical's workflow you must own to be defensible. Switching cost dynamics specific to verticals (data lock-in, workflow dependency, regulatory burden). Word-of-mouth density within vertical communities and how to accelerate it. Multi-location / franchise dynamics within the vertical: how they affect pricing, sales motion, and expansion.

OUTPUT FORMAT:
Structure your response for graph database ingestion. Organize the output as a set of entities (nodes) with properties, and explicit relationships between them. Use this pattern:

Entity: [Name] (Type: [entity type])
Properties:
- property_name: value
Relationships:
- [RELATIONSHIP_TYPE] → [Target Entity]

Primary entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver.

Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO.

Use ranges and arrays for multi-valued properties. Include confidence levels (high/medium/low) on benchmark data where sourcing varies.
```

---

### Prompt 5: Data / API Product

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Data / API Product companies (seed stage through Series B). This is a B2B business that sells access to data, enrichment, intelligence, or functionality via API. Revenue is typically usage-metered (per call, per record, per query). The product is often embedded in the buyer's stack rather than used as a standalone tool.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges and note sources. Distinguish between early-stage and Series A/B benchmarks where they differ.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org. (Full sub-field definitions as specified in the universal schema.)

TYPE-SPECIFIC EXTENSION — also return:

Integration complexity and time-to-integration benchmarks. Data freshness, coverage, and accuracy as competitive positioning dimensions. Embedded vs. standalone usage patterns and how they affect retention and expansion. Developer vs. business buyer: who initiates the evaluation, who controls budget, and how the sale splits. Usage metering and pricing per call / record / query: typical structures and tradeoffs. Data moat: how proprietary data assets compound over time and create defensibility. Compliance and data provenance requirements and how they affect GTM (especially in regulated industries).

OUTPUT FORMAT:
Structure for graph database ingestion using entities (nodes) with properties and explicit relationships. Entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver. Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO. Use ranges and arrays for multi-valued properties. Include confidence levels on benchmarks.
```

---

### Prompt 6: B2B Product-Led SaaS

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2B Product-Led SaaS companies (seed stage through Series B). This is a B2B software business where individual users sign up via self-serve (free tier or trial), adopt the product within their workflow, and expand to teams organically. Revenue grows through seat expansion, usage, or feature upgrades. Distinguished from Hybrid PLG+Sales in that the primary motion is product-driven with sales playing a minimal or late-stage role.

Produce a comprehensive, structured analysis covering every field below. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

PQL definition: what user behaviors or product signals qualify a lead as product-qualified. Activation metric: what constitutes an "activated" user and benchmark activation rates. Time-to-value benchmark: how quickly users must reach value to convert. Viral / network coefficient: how and whether usage spreads within and across organizations. Free-to-paid conversion rate benchmarks (monthly and annual, by tier). Self-serve vs. sales-assisted revenue split at different stages. In-product conversion triggers and nudges: what works, what backfires.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver. Relationship types: HAS_BUYER, USES_CHANNEL, HAS_FUNNEL_STAGE, TRACKS_METRIC, EMPLOYS_PRICING, COMMON_MISTAKE, REQUIRES_ROLE, COMPETES_ON, RETAINS_VIA, CHURNS_BECAUSE, EXPANDS_THROUGH, HANDS_OFF_TO.
```

---

### Prompt 7: B2C Product-Led SaaS

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2C Product-Led SaaS / App companies (seed stage through Series B). This is a consumer software business where users download or sign up individually, and monetization happens through subscriptions, in-app purchases, ads, or freemium upgrades. Examples include productivity apps, fitness apps, language learning, personal finance tools.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

App store dynamics: ASO best practices, ratings impact on conversion, category ranking mechanics. Activation metric and onboarding completion rate benchmarks. Free-to-paid conversion rate benchmarks by monetization model. Day 1 / Day 7 / Day 30 retention rate benchmarks. Viral / referral coefficient and program benchmarks. Monetization model comparison: freemium vs. subscription vs. in-app purchase vs. ad-supported — when each works. Role of push notifications and lifecycle messaging in retention and conversion.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Entity types: BusinessType, BuyerPersona, Channel, FunnelStage, Metric, PricingModel, AntiPattern, TeamRole, CompetitiveDynamic, RetentionLever, ChurnDriver. Standard relationship types as defined above.
```

---

### Prompt 8: E-commerce / DTC Brand

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for E-commerce / DTC Brand companies (seed stage through Series B). This is a B2C business selling physical products directly to consumers, primarily through owned e-commerce channels with potential expansion into retail. Revenue is transaction-based with margin sensitivity to COGS, shipping, and customer acquisition costs.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Customer acquisition by channel: paid social, search, influencer, retail, affiliate — with CAC and ROAS benchmarks per channel. MER (marketing efficiency ratio) benchmarks. AOV and basket size optimization tactics and benchmarks. Email/SMS lifecycle revenue contribution as % of total. Retail / wholesale expansion: when to pursue, margin implications, channel conflict. Inventory and margin management impact on GTM decisions. Brand vs. performance marketing budget split at different stages. Subscription conversion: one-time to recurring — conversion rates and impact on LTV.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types as defined above.
```

---

### Prompt 9: Subscription Commerce

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Subscription Commerce companies (seed stage through Series B). This is a B2C business delivering recurring physical or digital products on a subscription basis (e.g., meal kits, beauty boxes, curated goods, digital content bundles). Revenue is recurring but churn-sensitive, and the GTM is dominated by trial conversion and retention economics.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Trial-to-paid conversion rate benchmarks. Monthly vs. annual billing dynamics and their impact on retention and cash flow. Involuntary churn (payment failure) rate and recovery tactics with benchmarks. Subscription fatigue: category-level saturation dynamics and how to compete. Gift and seasonal acquisition spikes: contribution to annual revenue, retention of gift recipients. Skip / pause rate and its relationship to cancellation prevention. Unboxing / first-delivery experience as activation lever. Referral program benchmarks: program participation rate, referred customer LTV vs. organic.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 10: B2B Local / Regional Service Business

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2B Local / Regional Service Businesses (seed stage through established/growth). This is a B2B service business operating within a defined geography, selling to other businesses — examples include commercial HVAC, janitorial services, commercial landscaping, IT services for SMBs, commercial cleaning, B2B pest control. Revenue comes from contracts, projects, and retainers with other businesses.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Territory economics: serviceable radius, density requirements, travel time impact on margin. Contract vs. project vs. retainer revenue mix and how it affects growth and predictability. Bid / proposal process: typical win rates, how to improve them, evaluation criteria. Account management and relationship continuity: what drives retention in relationship-heavy sales. Fleet / crew utilization as a growth constraint and how to solve it. Commercial referral networks: property managers, general contractors, real estate — how to build them. Seasonal demand patterns and capacity planning strategies.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 11: B2C Local / Regional Service Business

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2C Local / Regional Service Businesses (startup through established/growth). This is a consumer-facing service business operating within a defined geography — examples include residential HVAC, plumbing, electrical, landscaping, house cleaning, pest control, mobile auto detailing. Revenue is transactional or subscription-based from individual homeowners/consumers.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Local SEO and Google Business Profile optimization: best practices and impact on lead volume. Review generation and reputation management: benchmarks for review velocity and rating thresholds. Yard signs, truck wraps, and physical presence as acquisition channels: measured impact. Neighbor-referral and neighborhood density effects on acquisition cost. Seasonal demand patterns and how they shape marketing spend. Emergency vs. scheduled service mix: pricing dynamics and staffing implications. Home services platform dynamics (Angi, Thumbtack, HomeAdvisor): cost per lead, conversion, dependency risk. Average ticket size and repeat purchase frequency benchmarks.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 12: Professional Services / Consultancy

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Professional Services / Consultancy firms (solo/startup through established growth). This is a B2B business where revenue comes from selling expertise — strategy, advisory, implementation, or specialized knowledge. Examples include management consulting, fractional executives, IT consulting, specialized advisory (legal, financial, technical). Relationship-driven, with reputation and expertise as primary assets.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Utilization rate benchmarks and capacity planning: target utilization, impact on revenue and burnout. Rate structure comparison: hourly vs. project vs. retainer vs. value-based pricing — when each works, tradeoffs. Thought leadership as lead generation: what formats work (writing, speaking, podcast, LinkedIn), conversion rates, time to ROI. Referral network mechanics: how to build, maintain, and activate professional referral networks. Expertise signaling: credentials, publications, speaking, case studies — what actually moves buyers. Scope creep management and how it affects GTM (pricing, positioning, client retention). Productization path: when and how to package expertise into repeatable offerings, and how this changes the GTM. Leverage model: 1:1 delivery vs. scaled/leveraged delivery (training, tools, frameworks) — economic implications.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 13: Agency

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Agency businesses (startup through established growth). This is a B2B service business providing creative, technical, or performance marketing services to other companies. Revenue comes from a mix of project fees and retainers. Examples include digital marketing agencies, creative agencies, web development agencies, PR firms, content agencies, performance/media agencies.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Project vs. retainer revenue mix: ideal ratio, how it affects cash flow and growth predictability. Case study and portfolio as primary sales collateral: what makes them effective, how many you need. Client concentration risk: thresholds (e.g., no single client >X% of revenue), consequences of violation. Creative / performance / technical specialization as positioning: generalist vs. specialist tradeoffs. White-label and subcontracting dynamics: when to use, margin impact, brand implications. Pitch / RFP process: typical win rates, cost of pitching, how to improve close rates. Talent as constraint: how hiring is a GTM bottleneck, and how agency growth is capped by talent. Platform / tool certification as channel strategy (e.g., HubSpot Partner, Shopify Expert): lead volume and quality impact.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 14: Managed Services / Outsourced Ops

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Managed Services / Outsourced Operations companies (startup through established growth). This is a B2B business that takes over and runs ongoing operational functions for clients under SLAs — examples include managed IT, managed security (MSSP), managed HR/payroll, managed accounting, outsourced customer support, outsourced logistics. Revenue is recurring contract-based.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

SLA structure: how SLAs drive pricing, retention, and competitive differentiation. Compliance and security certifications as table stakes: which ones matter, cost to obtain, impact on sales. Multi-year contract dynamics: TCV calculation, renewal mechanics, expansion tactics within existing contracts. Transition / onboarding period: typical duration, cost, risk of churn during transition. Operational efficiency metrics that drive margin: utilization, automation ratio, cost-per-ticket or equivalent. Staff augmentation vs. outcome-based positioning: how each affects pricing power and retention. Vendor consolidation trends: how to position as a consolidation play, bundling strategy.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 15: Marketplace / Platform

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Marketplace / Platform businesses (seed stage through Series B). This is a buyer-agnostic business model connecting two or more sides of a market (buyers/sellers, riders/drivers, freelancers/clients, etc.) and monetizing through take rates, transaction fees, or subscription. Can be B2B, B2C, or B2B2C. The GTM challenge is fundamentally about solving chicken-and-egg problems and achieving liquidity.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Supply vs. demand: which side to acquire first, how to decide, and typical strategy by marketplace type. Chicken-and-egg solution tactics: what approaches work at each stage (single-player mode, manual matching, seeding, constraining geography). Liquidity metrics: what constitutes a liquid marketplace, how to measure it, target benchmarks. Take rate benchmarks by category and pricing power dynamics over time. Disintermediation risk: what causes it, how to defend against it (payment processing, trust, workflow, data). Trust and safety as GTM infrastructure: investment required, impact on conversion and retention. Geographic / category density thresholds: how much supply/demand density you need before the marketplace works. Network effects: same-side vs. cross-side — how each type builds, measurement, and tipping points.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 16: Franchise / Multi-Location

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Franchise / Multi-Location businesses (early franchise development through growth stage). This is a buyer-agnostic business model built on systematized operations replicated across multiple locations — can be B2B or B2C. The GTM has dual layers: national/brand marketing and local execution. Examples include restaurant franchises, fitness chains, home services franchises, staffing firms, tax preparation, retail chains.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Dual GTM: corporate brand marketing vs. local execution — how responsibilities split, what's centralized vs. localized. Franchise unit economics: average unit volume (AUV), ramp time to profitability, failure rate benchmarks. Franchisee acquisition as a GTM motion: selling the franchise itself — channels, conversion rates, cost per franchisee acquired. Territory protection and cannibalization management. Marketing fund structure: national ad fund vs. local co-op fund — typical contribution rates, governance, friction points. Playbook replicability: what can be standardized vs. what must be localized, and how to enforce consistency. Multi-unit operator dynamics: how MUOs affect growth, economics, and operational complexity.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 17: B2B Content / Media

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2B Content / Media businesses (startup through established growth). This is a B2B business that builds an audience of professionals or decision-makers and monetizes through sponsorship, advertising, events, lead generation services, or premium subscriptions sold to businesses. Examples include industry trade publications, B2B newsletters, B2B podcasts, industry research firms, B2B event companies.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Audience development funnel: reach → subscriber → engaged → monetizable — with conversion benchmarks at each stage. Sponsorship and advertising sales: typical deal structures, CPM/CPC benchmarks, sales cycle, and renewal rates. Event / community extension as revenue and retention lever: economics of adding events to a media business. Lead generation / content syndication as a service to advertisers: how it works, pricing models, quality concerns. Editorial credibility vs. commercial pressure: how to manage the tension without destroying the asset. Newsletter, podcast, and owned media benchmarks: open rates, listen-through rates, growth rates, monetization per subscriber.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 18: B2C Content / Media

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2C Content / Media businesses (startup through established growth). This is a consumer-facing business that creates and distributes content to an audience and monetizes through consumer subscriptions, advertising, or hybrid models. Examples include consumer newsletters, creator-led media brands, consumer podcasts, digital magazines, streaming/content platforms at early stage.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Consumer subscription pricing and conversion benchmarks: free-to-paid rates, price sensitivity, annual vs. monthly. Ad-supported vs. subscription vs. hybrid model dynamics: revenue per user by model, when each works. Algorithm dependency and platform distribution risk: how reliance on social platforms affects growth and sustainability. Creator / talent dependency and IP ownership: risks, contractual structures, succession. Engagement metrics that matter: time spent, frequency, share rate, save rate — benchmarks by format. Paywall strategy: hard, metered, freemium — conversion rate and revenue impact of each approach.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 19: Community / Membership

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for Community / Membership businesses (startup through established growth). This is a buyer-agnostic model built on access, belonging, and network effects — monetized through membership fees, events, premium tiers, or services sold to members. Can be B2B (professional communities, peer networks) or B2C (hobby communities, lifestyle memberships). Examples include professional associations, paid Slack/Discord communities, membership-based coworking, alumni networks, creator communities.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Member acquisition cost and onboarding-to-engagement rate: how quickly new members must engage to retain. Engagement metrics: DAU/MAU ratio, posts per member, event attendance rate — benchmarks. Free-to-paid conversion in freemium community models: what triggers upgrade, conversion rate benchmarks. Member-generated content and value creation: how to incentivize, quality control, and measure. Events (virtual and IRL) as engagement and acquisition lever: economics, frequency, format. Renewal and annual membership retention benchmarks by community type. Community platform choice and its impact on growth: owned vs. rented (Slack, Discord, Circle, etc.) tradeoffs.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 20: B2B Hardware + Connected Product

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2B Hardware + Connected Product companies (seed stage through Series B). This is a B2B business selling physical products with a software or service layer — examples include IoT devices for industrial use, connected sensors, smart building systems, commercial robotics, enterprise networking hardware, connected medical devices. Revenue combines hardware sales with recurring software/service subscriptions.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Channel strategy: direct vs. distributor vs. VAR vs. OEM — when each works, margin implications. Hardware margin vs. recurring software/service margin: blended economics and how investors evaluate them. Integration and deployment complexity: impact on sales cycle, need for professional services, and customer satisfaction. Proof of concept / pilot process: typical duration, conversion to purchase, cost of running pilots. Support and maintenance contract attach rate: benchmarks and revenue contribution. Product lifecycle and upgrade/replacement cycle: how it affects retention and expansion revenue. Certification and compliance as market entry requirements: cost, time, and competitive implications.

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

### Prompt 21: B2C Hardware + Connected Product

```
Research the go-to-market mechanics, funnel metrics, unit economics, and best practices for B2C Hardware + Connected Product companies (seed stage through Series B). This is a consumer-facing business selling physical products with a connected software/app experience — examples include smart home devices, wearables, connected fitness equipment, consumer drones, personal health devices. Revenue combines product sales with potential recurring software/service subscriptions.

Produce a comprehensive, structured analysis. For benchmarks, provide ranges and note sources.

UNIVERSAL SCHEMA — return all fields: Core Identity, Buyer & Market, Acquisition & Channels, Funnel & Conversion, Revenue Model & Unit Economics, Retention & Churn, Sales Motion, Positioning & Competitive Dynamics, Metrics & KPIs, GTM Anti-Patterns, Team & Org.

TYPE-SPECIFIC EXTENSION — also return:

Retail channel strategy: DTC vs. Amazon vs. big-box vs. specialty retail — margin, volume, and brand tradeoffs. Unboxing and setup experience as activation: impact on retention, review generation, and return rates. App / connected experience as retention lever: engagement benchmarks, what keeps users connected post-purchase. Warranty and support cost impact on unit economics: benchmarks, how to manage. Crowdfunding as validation and pre-sale channel: success rate benchmarks, fulfillment risk, brand perception. Accessory and consumable attach revenue: contribution to LTV, attach rate benchmarks. Review and influencer seeding strategy: cost, conversion impact, and timing relative to launch. Return rate benchmarks and their margin impact by channel (DTC vs. Amazon vs. retail).

OUTPUT FORMAT:
Structure for graph database ingestion using entities with properties and relationships. Standard entity and relationship types.
```

---

## Running Order Recommendation

If you're prioritizing, start with the types closest to your current client base and work outward:

1. **Sales-Led SaaS** (Afiniti, enterprise motion)
2. **Usage-Based / Infrastructure** (Codiac, platform/infra)
3. **Hybrid PLG + Sales SaaS** (Codiac growth path)
4. **Professional Services / Consultancy** (Strategnik itself)
5. **B2B Product-Led SaaS** (common client type)
6. Then expand to the rest based on which types you're most likely to onboard next.

---

## Post-Research: Graph Assembly Notes

After running all 21 prompts, you'll have a set of typed entities and relationships per business type. To assemble the cross-type graph:

1. **Merge shared entities** — many Channels, Metrics, and AntiPatterns will recur across types. Deduplicate and link them to multiple BusinessType nodes.
2. **Add cross-type relationships** — e.g., `SIMILAR_MOTION_TO` between business types that share acquisition channels or funnel structures.
3. **Layer the B2B/B2C modifier** — the "Can Be Either" types (Marketplace, Franchise, Community) should have a `buyer_orientation` property rather than being duplicated.
4. **Build the selection logic** — the graph should support a query like: "Given [business type] + [stage] + [buyer orientation], return the GTM playbook skeleton" — which means the BusinessType node needs traversable edges to every schema section.
