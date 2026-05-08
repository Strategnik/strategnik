# PRD: Knowledge Graph Context Quality & Optimization System

**Status**: Draft  
**Owner**: Nick Talbert  
**Last Updated**: 2026-04-23  
**Scope**: This PRD covers the context quality detection, graph optimization, and self-directed growth systems for Strategnik's Intelligence Layer product. It does NOT cover the initial graph construction, customer onboarding flow, or billing/subscription management.

---

## Problem Statement (The Why)

### What is the problem?
The existing per-customer knowledge graph system retrieves context for LLM queries, but has no mechanism to detect when retrieved context is insufficient, no way to measure whether LLM answers are grounded in that context, and no feedback loop to direct graph growth toward the customer's actual query needs. This results in:
- Customers receiving low-confidence answers without knowing the context was insufficient
- Graphs growing arbitrarily without optimization for retrieval quality
- No signal to customers about what documents would improve their graph's utility
- No way to measure whether the system is actually improving over time

### Who has this problem?
1. **B2B marketing teams** (primary users) who ask GTM strategy questions (campaign recommendations, ICP targeting, competitive positioning, keyword expansion) and receive answers that aren't grounded in their specific brand/product context
2. **Strategnik/Nick** (operator) who needs to measure system quality, detect degradation, and demonstrate ROI to customers
3. **Codiac** (pilot customer) whose marketing team needs confidence that recommendations are based on their actual positioning, not generic advice

### What's the cost of NOT solving it?
- Customers stop trusting the system after receiving 2-3 generic/hallucinated answers → churn
- No visibility into which customers have underpowered graphs → can't proactively improve them
- Manual, reactive support burden when customers complain about answer quality
- No way to prove the value proposition ("machine-readable marketing intelligence") vs. generic ChatGPT
- Graph grows without optimization → retrieval quality degrades silently → customer experience worsens over time without visible reason

---

## Goals & Non-Goals

### Goals
- [ ] **30 days**: System can detect insufficient context pre-generation and return specific document requests to customers with >80% accuracy (measured by human review of 50 flagged queries)
- [ ] **60 days**: Context quality scorer operational, measuring groundedness of LLM answers; baseline established for Codiac pilot (target: >75% of answers grounded in retrieved context)
- [ ] **90 days**: Hybrid baseline system (static + learned) deployed; at least one customer shows measurable improvement in context sufficiency scores after uploading requested documents

### Non-Goals (explicitly out of scope)
- Multi-customer shared knowledge or cross-customer insights (each graph remains isolated)
- Real-time graph updates during a query (optimization runs asynchronously on schedule)
- Automated document ingestion from external sources (customers must explicitly upload)
- Graph visualization UI for customers (measurement only, no dashboards in v1)
- Support for non-marketing domains (stays focused on B2B GTM use cases)

---

## User Stories

### US-001: Insufficient Context Detection
As a **B2B marketing strategist**, I want the system to tell me when it doesn't have enough context to answer my question confidently, so that I know whether to trust the answer or upload more documents.

**Acceptance Criteria:**
- Given a query that requires vertical-specific context (e.g., "banking campaign strategy") and the customer graph has no banking-related nodes, when I submit the query, then the system returns a confidence score <0.5 and lists specific document types that would improve the answer
- Edge case: query is answerable from general knowledge → system still flags if customer-specific context is thin, but provides best-effort answer
- Out of scope: automatic retrieval of missing documents from web sources

### US-002: Document Request Guidance
As a **Strategnik customer**, I want to receive specific, actionable suggestions about what documents to upload next, so that I can improve my graph's utility without guessing what's missing.

**Acceptance Criteria:**
- Given an insufficient context detection, when the system generates a document request, then it specifies: (1) document type (e.g., "competitor messaging analysis"), (2) why it's needed (e.g., "for banking vertical competitive positioning queries"), (3) query types that will improve
- Document requests are presented inline with query responses, not buried in logs
- Out of scope: estimating how much improvement a document would provide (binary signal only: "would help" vs. "not needed")

### US-003: Groundedness Measurement
As a **system operator (Nick)**, I want to measure what percentage of LLM answers are grounded in retrieved context vs. fabricated from general knowledge, so that I can track system quality over time and identify degrading customers.

**Acceptance Criteria:**
- Given a completed query with LLM answer, when the context quality scorer runs, then it returns a groundedness score (0.0-1.0) and flags specific claims that lack supporting context
- Scores are logged per-customer, per-query-type with timestamps
- Dashboard view: per-customer average groundedness over 7/30/90 day windows
- Out of scope: real-time scoring during generation (async post-processing acceptable in v1)

### US-004: Adaptive Baseline Learning
As a **frequent user of a specific query type**, I want the system to learn what "good context" looks like for my patterns, so that sufficiency detection improves over time for my actual needs.

**Acceptance Criteria:**
- Given 20+ high-groundedness queries of the same type for a customer, when the learned baseline runs, then it adjusts sufficiency thresholds to match what actually worked (e.g., banking queries need 3x density vs. SaaS queries)
- Learned baselines override static baselines only when confidence >0.8
- Learned baselines degrade gracefully if query patterns shift (don't overfit to early data)
- Out of scope: explaining why learned baselines differ from static baselines (black box acceptable in v1)

### US-005: Graph Health Monitoring
As a **system operator (Nick)**, I want automated alerts when a customer's graph exhibits structural problems (hub nodes, orphaned nodes, stale embeddings), so that I can proactively optimize before retrieval degrades.

**Acceptance Criteria:**
- Given scheduled health checks (weekly), when a graph exceeds thresholds (e.g., >50-degree node, >30 days since re-embed, >40% orphaned nodes), then an alert is logged with specific remediation action
- Alerts include: (1) graph ID, (2) metric that triggered, (3) recommended fix, (4) severity (warning/critical)
- Out of scope: automatic remediation (human-reviewed fixes only in v1)

---

## Functional Requirements

### Core Detection & Scoring

**FR-001**: The system MUST compute a context sufficiency score (0.0-1.0) for every query before LLM generation, based on five signals: subgraph density, entity coverage, edge-type diversity, recency, embedding distance.

**FR-002**: When sufficiency score <0.5 (threshold tunable per-customer), the system MUST return a structured document request alongside the answer, specifying: document type needed, reason (which query types it improves), and example filenames/sources.

**FR-003**: The system MUST log every query with: customer_id, query_text, query_type (detected or user-specified), sufficiency_score, groundedness_score (post-hoc), retrieved_subgraph_metadata (node count, edge count, community IDs), timestamp.

**FR-004**: The context quality scorer MUST measure groundedness by comparing LLM claims against retrieved nodes, returning a score (0.0-1.0) and a list of unsupported claims (if any).

**FR-005**: The system MUST NOT block query execution on low sufficiency — always return best-effort answer with confidence flag.

### Entry Point Resolver & Retrieval

**FR-006**: The entry-point resolver MUST use hybrid retrieval: (1) semantic search in pgvector to find top N candidate entry nodes (N=5-10, tunable), (2) graph traversal from each candidate using Neo4j, (3) merge and rank subgraphs by relevance.

**FR-007**: Graph traversal MUST respect query templates that define: traversal depth (1-3 hops), required edge types, excluded edge types, and context budget (max tokens).

**FR-008**: When multiple candidate subgraphs are retrieved, the system MUST rank them by: (1) embedding similarity to query, (2) subgraph density, (3) community coherence, and return the top-ranked subgraph within context budget.

**FR-009**: Retrieved subgraphs MUST include node metadata: node_id, node_type, content_summary, source_document, upload_date, embedding_vector, community_id, edge_list (with edge types and weights).

### Baseline Systems (Static & Learned)

**FR-010**: Static baselines MUST define per-query-type minimum requirements as structured rules, including: required entity types (e.g., "campaign_rec requires persona + channel + messaging"), minimum subgraph density (edges/nodes ratio), minimum node count, recency threshold (days).

**FR-011**: Learned baselines MUST train on successful queries (groundedness >0.75) by logging: query_type, subgraph_properties (density, entity types present, node count, embedding distances), groundedness_score. After 20+ examples per query type, compute learned thresholds via percentile analysis (50th percentile of successful queries = new baseline).

**FR-012**: The sufficiency detector MUST use `max(static_baseline, learned_baseline_if_confident)` where learned baseline is only applied when confidence >0.8 (confidence = sample size / target sample size, capped at 1.0).

**FR-013**: Learned baselines MUST be recomputed weekly per-customer per-query-type, not on every query.

### Graph Optimization Jobs

**FR-014**: Community detection (Leiden algorithm via Neo4j GDS) MUST run weekly per customer graph, updating node properties with community_id. Retrieved subgraphs MUST prioritize nodes within the same community as entry nodes before expanding.

**FR-015**: Edge pruning MUST flag any node with >50 edges of the same type and log for manual review. Automated pruning MUST NOT run in v1 (risk of data loss).

**FR-016**: Re-embedding MUST run monthly per customer OR when corpus grows >20% (node count increase), updating all node embeddings in pgvector using current embedding model.

**FR-017**: Graph health checks MUST run weekly, flagging: nodes with >50 degree (hub nodes), nodes with 0 edges (orphans), embeddings >30 days old, graphs with <200 nodes total (underpowered).

### Query Templates

**FR-018**: The system MUST support query template definitions as structured config, including: template_id, keywords/triggers (for auto-detection), required_entity_types (list), traversal_depth (int), edge_type_priorities (weighted list), context_budget (max tokens), static_baseline_config.

**FR-019**: Five query templates MUST be implemented at launch: (1) campaign_recommendation, (2) keyword_expansion, (3) competitive_positioning, (4) persona_intelligence, (5) messaging_framework.

**FR-020**: When a query does not match a known template, the system MUST use a default "general_marketing_query" template with conservative settings (depth=2, all edge types, medium context budget).

---

## Non-Functional Requirements

### Performance
- Sufficiency detection MUST complete in <500ms (pre-generation, non-blocking)
- Entry-point resolver + graph traversal MUST return subgraph in <2s at p95 for graphs up to 2,000 nodes
- Context quality scorer (post-hoc) MUST complete in <5s per query (async acceptable)
- Community detection MUST complete in <60s for a 2,000-node graph (weekly job, non-critical latency)
- Re-embedding MUST complete in <10min for a 2,000-node graph (monthly job, non-critical latency)

### Security & Privacy
- All customer graphs MUST be isolated — no cross-customer queries or data leakage
- Query logs MUST include only customer_id (hashed), not PII or customer names
- Retrieved subgraphs MUST NOT be cached across customer boundaries
- Groundedness measurements MUST NOT send customer content to external services (use local LLM or Anthropic API with ZDR=true)

### Scale
- System MUST support 50 customers with 500-2,000 nodes each at launch
- System MUST handle 100 queries/day per customer (5,000 queries/day total)
- Logs MUST retain 90 days, with aggregated metrics retained indefinitely

### Operational
- All optimization jobs (community detection, re-embedding, health checks) MUST run as Vercel Cron or external queue (Inngest/Trigger.dev) to avoid 60s function timeout
- Neo4j connection pooling MUST be configured (Aura's built-in or external pooler) to avoid cold-start connection overhead
- Failed jobs MUST retry 3x with exponential backoff, then alert operator

### Observability
- All components MUST log to structured logs (JSON) with: timestamp, customer_id, component_name, event_type, metadata
- Dashboards MUST display: per-customer groundedness trends, sufficiency score distributions, document request acceptance rate, query volume by type
- Alerts MUST fire on: groundedness drop >15% week-over-week, sufficiency score median <0.4 for 3+ days, optimization job failures

---

## Data Model & API Contracts

### New Database Tables (Supabase Postgres)

**Table: query_logs**
```sql
CREATE TABLE query_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  query_text TEXT NOT NULL,
  query_type VARCHAR(50), -- detected or null
  sufficiency_score NUMERIC(3,2), -- 0.00-1.00
  groundedness_score NUMERIC(3,2), -- 0.00-1.00, null until scored
  retrieved_node_count INT,
  retrieved_edge_count INT,
  community_ids INT[], -- array of community IDs in subgraph
  entry_node_ids UUID[], -- entry points used
  answer_text TEXT, -- LLM response
  unsupported_claims JSONB, -- from groundedness scorer
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_query_logs_customer_created ON query_logs(customer_id, created_at DESC);
CREATE INDEX idx_query_logs_query_type ON query_logs(customer_id, query_type);
```

**Table: document_requests**
```sql
CREATE TABLE document_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  query_log_id UUID REFERENCES query_logs(id),
  document_type VARCHAR(100), -- e.g., "competitor_analysis"
  reason TEXT, -- why needed
  query_types_improved VARCHAR(50)[], -- which templates this helps
  status VARCHAR(20) DEFAULT 'pending', -- pending|uploaded|ignored
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);
CREATE INDEX idx_doc_requests_customer_status ON document_requests(customer_id, status);
```

**Table: learned_baselines**
```sql
CREATE TABLE learned_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  query_type VARCHAR(50) NOT NULL,
  sample_size INT NOT NULL, -- number of queries used to compute
  confidence NUMERIC(3,2), -- 0.00-1.00
  min_density NUMERIC(4,2), -- edges/nodes
  min_node_count INT,
  required_entity_types JSONB, -- e.g., ["persona", "vertical"]
  avg_embedding_distance NUMERIC(4,3),
  computed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, query_type)
);
CREATE INDEX idx_learned_baselines_customer ON learned_baselines(customer_id);
```

**Table: graph_health_logs**
```sql
CREATE TABLE graph_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  total_nodes INT,
  total_edges INT,
  orphan_count INT,
  hub_nodes JSONB, -- array of {node_id, degree}
  stale_embeddings_count INT, -- >30 days old
  last_community_detection TIMESTAMP,
  last_reembedding TIMESTAMP,
  issues JSONB, -- [{severity, metric, description, remediation}]
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_graph_health_customer ON graph_health_logs(customer_id, created_at DESC);
```

### New Neo4j Node Properties

All nodes MUST have:
- `community_id: int` (updated weekly by community detection job)
- `embedding_updated_at: timestamp` (for staleness detection)

### API Endpoints (New)

**POST /api/query**
Request:
```json
{
  "customer_id": "uuid",
  "query_text": "string",
  "query_type": "string|null", // optional, auto-detected if null
  "context_budget": 4000 // optional, tokens
}
```
Response:
```json
{
  "answer": "string",
  "confidence": 0.85,
  "sufficiency_score": 0.72,
  "document_request": { // null if sufficiency >= threshold
    "document_type": "competitor_analysis",
    "reason": "Needed for banking vertical competitive positioning",
    "query_types_improved": ["competitive_positioning", "messaging_framework"]
  },
  "metadata": {
    "query_type_detected": "campaign_recommendation",
    "nodes_retrieved": 23,
    "edges_retrieved": 41,
    "communities_used": [3, 7]
  }
}
```

**GET /api/customers/:customer_id/health**
Response:
```json
{
  "customer_id": "uuid",
  "graph_stats": {
    "total_nodes": 1247,
    "total_edges": 3891,
    "orphan_count": 12,
    "hub_nodes": [{"node_id": "...", "degree": 67}],
    "stale_embeddings_count": 23
  },
  "quality_metrics": {
    "avg_groundedness_7d": 0.78,
    "avg_groundedness_30d": 0.81,
    "avg_sufficiency_7d": 0.69,
    "query_volume_7d": 142
  },
  "issues": [
    {
      "severity": "warning",
      "metric": "hub_node_detected",
      "description": "Node 'ICP' has 67 edges",
      "remediation": "Review and split overly broad concept nodes"
    }
  ],
  "last_optimization": {
    "community_detection": "2026-04-20T03:00:00Z",
    "reembedding": "2026-04-01T02:00:00Z"
  }
}
```

**POST /api/admin/optimize/:customer_id**
Triggers optimization jobs manually (for testing/support):
```json
{
  "jobs": ["community_detection", "reembedding", "health_check"]
}
```
Response: job IDs and status

---

## UX/Design Notes

### Query Response with Document Request
When sufficiency <0.5, inline response format:

```
[Answer text here, best-effort based on available context...]

⚠️ Confidence: Medium (72%)

📄 To improve answers on banking campaign strategy:
- Upload: Competitor messaging analysis for banking vertical
- Why: Your graph has strong persona data but limited banking-specific positioning
- This will help with: Competitive positioning queries, Messaging framework requests

[Continue conversation or upload documents]
```

### Customer Health Dashboard (future, not v1)
Key metrics to display:
- 7/30/90 day groundedness trend (line chart)
- Query volume by type (bar chart)
- Document request acceptance rate (%)
- Graph growth over time (nodes/edges)
- Top 5 unsupported claims from recent queries

---

## Open Questions

| # | Question | Owner | Due | Decision |
|---|----------|-------|-----|----------|
| 1 | What embedding model should we standardize on for pgvector? (text-embedding-3-small vs. voyage-2) | Nick | 2026-04-30 | Pending benchmark |
| 2 | Should groundedness scorer use local Llama or Anthropic API? (cost vs. latency tradeoff) | Nick | 2026-04-30 | Pending cost analysis |
| 3 | What is the minimum sample size for learned baselines to override static baselines? (currently 20, needs validation) | Nick | 2026-05-07 | Pending pilot data |
| 4 | Should we alert customers when their graph health degrades, or only alert Nick? (customer-facing vs. operator-only) | Nick | 2026-05-07 | Pending UX review |

---

## Success Metrics

### Primary
**Groundedness rate >75%** — Percentage of LLM answers with groundedness score >0.75, measured across all customers, 30-day rolling window. This is the core quality metric.

### Secondary
- **Document request acceptance rate >40%** — Percentage of document requests that result in customer upload within 14 days
- **Sufficiency improvement after upload** — Average increase in sufficiency score for query types targeted by uploaded documents (target: +0.15)
- **Query volume retention** — Customers with >50 queries in first 30 days show >80% query volume retention in days 60-90

### Guardrails
- **API latency p95 <3s** — Context assembly + LLM generation must not regress
- **Zero cross-customer leakage** — All audits confirm graph isolation
- **Optimization job success rate >95%** — Community detection and re-embedding jobs complete successfully

### How we measure
- Query logs → groundedness_score, sufficiency_score (primary metrics)
- Document requests table → status field (acceptance rate)
- Graph health logs → node/edge counts, issue severity (guardrail)
- Application logs → API latency traces (guardrail)
- Weekly manual audit: spot-check 10 random queries for groundedness accuracy

---

## Implementation Notes for Claude Code

### Existing System Context

**Current Tech Stack:**
- **Supabase**: Postgres database + pgvector for embeddings
- **Neo4j**: Graph database (likely Aura hosted) for per-customer knowledge graphs
- **Vercel**: Serverless hosting for API endpoints and frontend
- **Existing tables**: `customers`, content/node metadata (exact schema TBD — Claude should discover via Supabase introspection)
- **Existing Neo4j structure**: Per-customer graphs with typed nodes (personas, positioning, content, campaigns, etc.) and typed edges (exact schema TBD — Claude should query Neo4j to discover)

**What already exists:**
- Customer onboarding and graph construction pipeline (document upload → entity extraction → node/edge creation)
- Basic retrieval: query → find relevant nodes → return to LLM (no sufficiency detection or quality scoring yet)
- pgvector embeddings on some/all nodes (Claude should verify which nodes have embeddings)

**What does NOT exist (build these):**
- Sufficiency detection system (new)
- Context quality scorer (new)
- Document request generation (new)
- Learned baselines (new)
- Graph health monitoring (new)
- Query templates and entry-point resolver (new — current retrieval is likely simpler)
- All new database tables listed in this PRD

### What to build (in priority order)

**Phase 1: Core Detection (weeks 1-2)**
1. Implement query_logs table and basic logging on all queries
2. Build sufficiency detector with 5 signals (start with static baselines only, no learned baselines yet)
3. Implement document request generation and document_requests table
4. Integrate into existing /api/query endpoint (non-breaking: add fields, don't change existing behavior)

**Phase 2: Quality Measurement (weeks 3-4)**
5. Build context quality scorer (groundedness measurement) — use Anthropic API with structured outputs to compare claims against retrieved nodes
6. Run scorer async on all queries (post-hoc, don't block responses)
7. Add groundedness_score to query_logs, populate retroactively for last 7 days of queries

**Phase 3: Optimization & Baselines (weeks 5-6)**
8. Implement graph health checks and graph_health_logs table
9. Build community detection job (Neo4j GDS Leiden) as Vercel Cron or queue job
10. Build re-embedding job for pgvector
11. Implement learned_baselines table and computation logic (run weekly, requires 30+ days of query logs to be useful)

**Phase 4: Query Templates & Advanced Retrieval (weeks 7-8)**
12. Migrate existing retrieval to entry-point resolver pattern (semantic search → graph traversal)
13. Define and implement 5 query templates with traversal configs
14. Wire learned baselines into sufficiency detector

### Constraints that are non-negotiable

- **No cross-customer data leakage**: Every query MUST filter by customer_id at database and Neo4j level — enforce with RLS in Supabase and Cypher WHERE clauses
- **Vercel function timeout**: Optimization jobs (community detection, re-embedding) MUST NOT run in API route handlers — use Vercel Cron (for <60s jobs) or external queue like Inngest
- **Neo4j connection pooling**: MUST reuse connections across requests, not create new connection per function invocation (use Aura's pooling or middleware)
- **Backwards compatibility**: /api/query endpoint MUST continue to work for existing clients — add fields, don't break existing response structure
- **Idempotency**: All optimization jobs MUST be idempotent (safe to run multiple times, handle race conditions)

### Where to use judgment

- **Embedding model choice**: Pick text-embedding-3-small or voyage-2 based on quick benchmark (cost vs. quality), document decision in code comments
- **Groundedness scorer implementation**: LLM-as-judge is fine for v1 — exact prompting strategy is up to you, optimize for precision over recall
- **Thresholds**: Sufficiency threshold (0.5), groundedness threshold (0.75), hub node degree (50), sample size for learned baselines (20) — these are starting points, tune based on early data
- **Query type detection**: Simple keyword matching is acceptable for v1 (e.g., "campaign" → campaign_recommendation), no need for ML classifier
- **Cypher query optimization**: Use EXPLAIN on Neo4j queries, add indexes as needed — trust your judgment on graph query patterns

### Always check back before

- **Changing existing Neo4j schema**: Adding node properties is fine (community_id, embedding_updated_at), but changing edge types or deleting nodes requires approval
- **Adding external dependencies**: New npm packages or Python libraries (beyond standard ones like anthropic, neo4j-driver, pg) need approval for security review
- **Exposing customer data in logs**: Any logging of query_text, answer_text, or retrieved content must be sanitized — confirm logging strategy before implementation
- **Changing data retention policies**: 90-day log retention is set — don't auto-delete or archive without approval

### Testing Strategy

- **Unit tests**: Sufficiency detector signals (mock subgraphs, verify score calculation), baseline computation logic
- **Integration tests**: End-to-end query flow (query → detect → retrieve → score), optimization jobs (run against test graph, verify state changes)
- **Benchmark data**: Create 3 test customers with known query patterns (underpowered graph, healthy graph, overpowered graph) — use for all testing
- **Manual validation**: Before marking Phase 1 complete, run 20 real Codiac queries through system and manually review sufficiency scores + document requests for accuracy

### Migration Notes

- **Existing query logs**: If any exist, backfill into new query_logs table with null sufficiency/groundedness scores (can't retroactively compute)
- **Existing Neo4j nodes**: Run one-time script to add community_id (set to null initially, filled by first community detection run) and embedding_updated_at (set to node creation date or null)
- **pgvector index**: Verify pgvector extension is installed and indexed on embedding columns — if not, add index before implementing entry-point resolver

---

## References

- **Existing codebase**: [location TBD — Claude should ask where repo lives]
- **Supabase project**: [connection details in env vars]
- **Neo4j Aura**: [connection string in env vars]
- **Strategnik Intelligence Layer positioning**: /mnt/user-data/... [Nick to provide if needed]
- **Codiac pilot context**: Customer focuses on Agent Control Plane / Kubernetes management, primary personas are platform engineers and DevOps leads

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-04-23 | 0.1 | Initial draft based on knowledge graph optimization discussion | Nick Talbert |

