# PLG Framework Infographic — Nano Banana Pro Prompt Library

**Format:** 3-page portrait brochure, 8.5×11 each. 14 panels total. All text baked into images.
**Style:** HBR / MIT Sloan editorial infographic. Consistent tokens across every panel so they tile cleanly.

---

## How to use

1. Start every prompt with the `MASTER_STYLE` block (copy-paste verbatim at the top). This locks aesthetic consistency across panels.
2. Append the specific `PANEL` block for the section you're generating.
3. End every prompt with the `TEXT_RENDERING_RULES` block (non-negotiable — prevents the model from inventing or misspelling text).
4. Generate each panel individually. Stitch in whatever tool you prefer.

---

## MASTER_STYLE (paste at top of every prompt)

```json
{
  "aesthetic": "Editorial infographic in the style of Harvard Business Review and MIT Sloan Management Review. Minimal, restrained, intellectual. Print-editorial feel, not tech-startup feel. Looks like it belongs in a printed strategy journal.",
  "color_palette": {
    "background": "#F4EFE6 — warm cream off-white, very slight paper texture",
    "primary_ink": "#1A1A1A — soft black for all primary text and line work",
    "accent_primary": "#1B3A5B — deep editorial navy, used for headlines and key emphasis",
    "accent_secondary": "#C9402F — editorial red-orange, used sparingly for callouts and numerals only",
    "neutral_mid": "#8A8680 — warm gray for secondary text and labels",
    "neutral_light": "#D9D4CB — light warm gray for secondary fills and dividers"
  },
  "typography": {
    "headline": "Transitional serif, high-contrast, editorial weight — in the spirit of Tiempos Headline, Lyon Text, or similar print serif. Title case. Generous tracking.",
    "subhead": "Same serif family, lighter weight, smaller size",
    "body": "Geometric sans-serif — in the spirit of Inter, Söhne, or IBM Plex Sans. Regular weight. Tight but readable.",
    "labels_data": "Monospace — in the spirit of JetBrains Mono or IBM Plex Mono. All lowercase for variable names. Uppercase for section labels.",
    "rules": "Never mix more than 3 typefaces in a single panel. Headline + body + mono max."
  },
  "illustration_style": {
    "mode": "Flat editorial line illustration. Diagrammatic, not decorative.",
    "line_weight": "1-1.5pt precise strokes, no hand-drawn wobble",
    "fills": "Either solid flat color from palette or fine line-hatching for shading. No gradients. No shadows. No 3D.",
    "iconography": "Geometric primitives — circles, rectangles, arrows, flow lines, grids, dots. Abstract conceptual metaphors, not literal tech icons.",
    "forbidden": "No glossy effects, no neon, no gradients, no photorealism, no mockups of real software UI, no stock-illustration people, no emoji, no AI-generated-looking blobs"
  },
  "layout_rules": {
    "grid": "Implicit 12-column grid with generous margins (8-10% of panel width as outer margin)",
    "hierarchy": "Large editorial number or headline top-left. Supporting text in clear secondary position. Visual element centered or right-anchored.",
    "whitespace": "Generous. Never fill the panel. Negative space is a design element.",
    "annotations": "Small serif italic captions and thin leader lines allowed, in the style of print-journal diagrams.",
    "corner_mark": "Small monospace label in one corner of every panel (panel ID in format like 'P1.02' or section name in caps) — makes panels feel like parts of a system"
  }
}
```

---

## TEXT_RENDERING_RULES (paste at bottom of every prompt)

```json
{
  "rendering_instructions": "Render every piece of text in the 'text_to_render' field verbatim, exactly as written. Do not add text. Do not omit text. Do not paraphrase. Do not translate. Spelling must match exactly, including technical variable names with underscores. If you cannot fit text legibly at high quality, reduce visual complexity rather than shorten or alter text. No Lorem Ipsum. No placeholder text.",
  "forbidden_text_behaviors": [
    "Inventing new text not in text_to_render",
    "Misspelling technical terms or variable names",
    "Adding logos, brand names, or URLs not specified",
    "Adding page numbers, watermarks, or footers not specified",
    "Substituting characters (e.g., replacing underscores with spaces)"
  ]
}
```

---

# PAGE 1 — Framework Overview + Signal Architecture

## Panel 1.1 — Hero / Framework Diagram

```json
{
  "panel_id": "P1.01",
  "aspect_ratio": "3:2",
  "position_on_page": "Full width, top third of page 1",
  "composition": "Editorial cover-style layout. Large serif headline top-left occupying the left two-thirds. To the right or below: three equal rectangular blocks in a horizontal row, connected by thin arrow lines flowing left-to-right, labeled 01, 02, 03. Each block contains a small abstract diagrammatic icon and a short label beneath. Corner mark in monospace bottom-right.",
  "visual_elements": [
    "Three connected rectangular system blocks in navy line work, flowing left to right with thin connecting arrows",
    "Block 01: abstract funnel or filter icon",
    "Block 02: abstract scoring gauge or weighted-scale icon",
    "Block 03: abstract radial distribution pattern (one point expanding to many)",
    "Thin horizontal rule under the headline"
  ],
  "text_to_render": {
    "eyebrow_label": "A PLG OPERATING FRAMEWORK",
    "headline": "The PLG Framework for Developer Products",
    "subhead": "Three systems that convert free users into qualified pipeline.",
    "block_01_number": "01",
    "block_01_label": "Signal Architecture",
    "block_02_number": "02",
    "block_02_label": "PQL Scoring",
    "block_03_number": "03",
    "block_03_label": "Brand Infrastructure",
    "corner_mark": "P1.01"
  }
}
```

---

## Panel 1.2 — Signup Gate

```json
{
  "panel_id": "P1.02",
  "aspect_ratio": "1:1",
  "position_on_page": "Top-left quadrant of signal architecture 2x2 grid",
  "composition": "Large red-orange editorial numeral '01' top-left. Title in navy serif below. Supporting text in body sans beneath title. Small diagrammatic illustration in right portion of panel showing a filter or sieve metaphor — abstract geometric shapes (circles) passing through a horizontal rule with some blocked, some passing. Monospace data variable labels at the bottom in a pill-like frame.",
  "visual_elements": [
    "Oversized serif numeral '01' in accent_secondary red",
    "Abstract filter diagram: row of circles meeting a horizontal line, some pass through, others are marked out with an X",
    "Two small monospace variable name tags in a rounded rectangle frame at bottom"
  ],
  "text_to_render": {
    "numeral": "01",
    "title": "Signup Gate",
    "what": "Work email + company + stated use case.",
    "why": "Filters 40% of non-buyers before they cost you anything downstream.",
    "data_tag_1": "has_work_email",
    "data_tag_2": "stated_use_case",
    "corner_mark": "P1.02"
  }
}
```

---

## Panel 1.3 — Integration Boundary

```json
{
  "panel_id": "P1.03",
  "aspect_ratio": "1:1",
  "position_on_page": "Top-right quadrant of signal architecture 2x2 grid",
  "composition": "Same structural template as P1.02 — large numeral '02' top-left in accent_secondary, navy serif title, body text below. Visual on right shows two adjacent zones labeled SANDBOX and PRODUCTION separated by a vertical threshold line. A small circle or dot crosses from left zone to right zone with a directional arrow.",
  "visual_elements": [
    "Oversized numeral '02' in accent red",
    "Two-zone diagram with a clear vertical boundary: left zone in neutral_light fill labeled SANDBOX, right zone empty with a thin line border labeled PRODUCTION",
    "Small circle element crossing the boundary with a curved arrow",
    "Two monospace variable tags at bottom"
  ],
  "text_to_render": {
    "numeral": "02",
    "title": "Integration Boundary",
    "what": "Sandbox is frictionless. Production requires a verification step.",
    "why": "Where casual exploration becomes real commitment.",
    "zone_label_left": "SANDBOX",
    "zone_label_right": "PRODUCTION",
    "data_tag_1": "production_integration_date",
    "data_tag_2": "integration_depth_score",
    "corner_mark": "P1.03"
  }
}
```

---

## Panel 1.4 — Free-to-Paid Conversion Wall

```json
{
  "panel_id": "P1.04",
  "aspect_ratio": "1:1",
  "position_on_page": "Bottom-left quadrant of signal architecture 2x2 grid",
  "composition": "Same template. Numeral '03'. Visual on right shows a simple rising line chart reaching a horizontal ceiling (the wall), with a small dashed threshold marker at roughly 70% height labeled as the free-tier limit.",
  "visual_elements": [
    "Oversized numeral '03' in accent red",
    "Minimal line chart: ascending curve hitting a solid horizontal ceiling line",
    "A thin dashed horizontal rule below the ceiling marked '70%' in monospace",
    "Two monospace variable tags at bottom"
  ],
  "text_to_render": {
    "numeral": "03",
    "title": "Conversion Wall",
    "what": "Usage limits plus feature gates.",
    "why": "Tuned to convert growth trajectory, not cap adoption.",
    "chart_label": "70% free-tier limit",
    "data_tag_1": "usage_limit_proximity",
    "data_tag_2": "pricing_page_visits",
    "corner_mark": "P1.04"
  }
}
```

---

## Panel 1.5 — Team Expansion Gate

```json
{
  "panel_id": "P1.05",
  "aspect_ratio": "1:1",
  "position_on_page": "Bottom-right quadrant of signal architecture 2x2 grid",
  "composition": "Same template. Numeral '04'. Visual on right shows a network diagram: one circle on the left connected by thin lines to a cluster of four or five circles on the right, representing one developer expanding to a team.",
  "visual_elements": [
    "Oversized numeral '04' in accent red",
    "Network diagram: single circle on left, cluster of 4-5 connected circles on right, thin connecting lines",
    "Two monospace variable tags at bottom"
  ],
  "text_to_render": {
    "numeral": "04",
    "title": "Team Expansion Gate",
    "what": "Collaboration behind paid tier. Invite limits on free.",
    "why": "One dev is an experiment. Five devs is an evaluation.",
    "data_tag_1": "team_size",
    "data_tag_2": "admin_engagement_score",
    "corner_mark": "P1.05"
  }
}
```

---

# PAGE 2 — PQL Scoring Architecture

## Panel 2.1 — PQL Scoring Hero

```json
{
  "panel_id": "P2.01",
  "aspect_ratio": "3:2",
  "position_on_page": "Full width, top third of page 2",
  "composition": "Editorial page-opener. Large serif headline left. Right side shows an abstract diagrammatic gauge or weighted-scale illustration in navy line work — three input streams converging into a single output value.",
  "visual_elements": [
    "Abstract diagram: three horizontal lines of different weights entering from the left, converging into a single circular node on the right, representing weighted inputs producing a score",
    "Thin horizontal rule under the headline"
  ],
  "text_to_render": {
    "eyebrow_label": "SYSTEM 02 — PQL SCORING",
    "headline": "Scoring for Production Dependency",
    "subhead": "The question every variable answers: is this user showing signs of production dependency plus enterprise need?",
    "corner_mark": "P2.01"
  }
}
```

---

## Panel 2.2 — Three Variable Categories

```json
{
  "panel_id": "P2.02",
  "aspect_ratio": "3:2",
  "position_on_page": "Middle band of page 2",
  "composition": "Three equal-width columns separated by thin vertical rules. Each column has a header label in monospace caps, a weight percentage in a large serif numeral below the label, and a bulleted list of variable names in monospace beneath. The weight numerals should visually signal relative weight — 40%, 40%, 20%.",
  "visual_elements": [
    "Three columns divided by thin vertical rule lines",
    "Each column: mono uppercase header, serif percentage numeral, list of monospace variable names with small bullet dots"
  ],
  "text_to_render": {
    "column_1_header": "PRODUCTION USAGE",
    "column_1_weight": "40%",
    "column_1_vars": ["api_calls_last_30d", "error_rate", "integration_points", "usage_consistency"],
    "column_2_header": "ENTERPRISE INTENT",
    "column_2_weight": "40%",
    "column_2_vars": ["team_size", "sso_attempt", "usage_limit_proximity", "domain_firmographic"],
    "column_3_header": "ENGAGEMENT",
    "column_3_weight": "20%",
    "column_3_vars": ["docs_depth", "community_participation", "support_ticket_quality", "pricing_page_visits"],
    "corner_mark": "P2.02"
  }
}
```

---

## Panel 2.3 — Scoring Formula

```json
{
  "panel_id": "P2.03",
  "aspect_ratio": "3:2",
  "position_on_page": "Lower-middle band of page 2",
  "composition": "Center-aligned. The scoring formula rendered large in navy serif with monospace variable names embedded, like a print-journal equation. Below the formula, a thin horizontal rule. Below the rule, a routing condition rendered in smaller monospace, with a right-pointing arrow to the action.",
  "visual_elements": [
    "Formula typeset as a clean editorial equation, parentheses and multiplication signs in clean typography",
    "Thin horizontal divider",
    "Arrow glyph pointing right (→) separating condition from action"
  ],
  "text_to_render": {
    "formula": "PQL Score = (Production × 0.4) + (Enterprise × 0.4) + (Engagement × 0.2)",
    "routing_condition": "IF score > 70 AND team_size ≥ 3  →  Route to Sales",
    "caption": "Start simple. Advanced variants split developer-led vs. top-down.",
    "corner_mark": "P2.03"
  }
}
```

---

## Panel 2.4 — Two Routes: Dev-Led vs. Top-Down

```json
{
  "panel_id": "P2.04",
  "aspect_ratio": "3:2",
  "position_on_page": "Bottom third of page 2",
  "composition": "Two-column split with a thin vertical rule down the center. Each side has a header, a defining condition in monospace, a routing action, and a short tactical note. Small diverging-arrow illustration at the top center showing one path splitting into two.",
  "visual_elements": [
    "Single arrow at top center splitting into two arrows, one angled left, one angled right",
    "Vertical rule dividing the two columns",
    "Each column: header serif label, condition in mono, action in body text"
  ],
  "text_to_render": {
    "column_left_header": "Developer-Led",
    "column_left_signal": "High production usage + low enterprise signals",
    "column_left_route": "Route to DevRel.",
    "column_left_tactic": "Nurture with technical content. Sales calls kill this motion.",
    "column_right_header": "Top-Down",
    "column_right_signal": "Enterprise signals + moderate usage",
    "column_right_route": "Route to Enterprise AE.",
    "column_right_tactic": "Speed matters. Exec evaluations move fast or die.",
    "corner_mark": "P2.04"
  }
}
```

---

# PAGE 3 — Brand Infrastructure + Integration

## Panel 3.1 — Distribution Multiplier Hero

```json
{
  "panel_id": "P3.01",
  "aspect_ratio": "3:2",
  "position_on_page": "Full width, top third of page 3",
  "composition": "Editorial page-opener. Left: oversized serif numeral '1'. Arrow or radial burst of thin lines from '1' to a '10' on the right side. Around the '10', ten small channel labels arranged in a loose semicircle or grid, each in monospace.",
  "visual_elements": [
    "Oversized serif numeral '1' on the left",
    "Thin radiating lines from '1' fanning out to the right",
    "Oversized serif numeral '10' on the right",
    "Ten small monospace labels positioned around the '10'"
  ],
  "text_to_render": {
    "eyebrow_label": "SYSTEM 03 — BRAND INFRASTRUCTURE",
    "headline": "One Technical Piece → Ten Developer Touchpoints",
    "subhead": "Build once. Distribute across every channel where developers discover tools.",
    "numeral_left": "1",
    "numeral_right": "10",
    "channels": ["GitHub", "Dev.to", "Reddit", "Discord", "HackerNews", "YouTube", "Blog", "X/Twitter", "Stack Overflow", "Newsletter"],
    "corner_mark": "P3.01"
  }
}
```

---

## Panel 3.2 — GitHub as Primary Distribution

```json
{
  "panel_id": "P3.02",
  "aspect_ratio": "3:2",
  "position_on_page": "Upper-middle band of page 3",
  "composition": "Left two-thirds: header in serif, body paragraph, and five tag pills in monospace listing asset types. Right third: an abstract illustration of stacked rectangular code artifacts, like sheets of paper or stacked cards, suggesting repos as building blocks.",
  "visual_elements": [
    "Five rounded rectangle tag pills in a row with monospace labels",
    "Abstract stacked-rectangle illustration on the right, suggesting code artifacts or repositories",
    "Thin horizontal rule under headline"
  ],
  "text_to_render": {
    "header": "GitHub as Primary Distribution",
    "body": "Developers trust code over copy. A repo with 500 stars is more credible than a case study.",
    "tag_1": "SDKs",
    "tag_2": "Example repos",
    "tag_3": "Starter templates",
    "tag_4": "Migration scripts",
    "tag_5": "Debugging utilities",
    "corner_mark": "P3.02"
  }
}
```

---

## Panel 3.3 — Three PQL Paths (Scenarios Flow)

```json
{
  "panel_id": "P3.03",
  "aspect_ratio": "3:2",
  "position_on_page": "Middle band of page 3",
  "composition": "Three horizontal rows, each showing a sequence of 4-5 small circular nodes connected by arrows, with a short label above the row and an outcome on the right. Rows stack vertically, separated by thin horizontal rules. Each row represents one scenario path.",
  "visual_elements": [
    "Three parallel horizontal flow sequences",
    "Small numbered circles connected by arrows in each row",
    "Row label at left, outcome label at right",
    "Thin horizontal dividers between rows"
  ],
  "text_to_render": {
    "section_header": "Three Paths to Pipeline",
    "row_1_label": "Path A — High-Quality PQL",
    "row_1_sequence": "Signup → Integrate → Scale usage → Team invites → Route to Sales",
    "row_2_label": "Path B — Low Signal",
    "row_2_sequence": "Signup → Sandbox only → No team → Nurture, don't call",
    "row_3_label": "Path C — GitHub → Community → Enterprise",
    "row_3_sequence": "Repo discovery → Team sprawl → Director asks 'what is this?' → Inbound enterprise PQL",
    "corner_mark": "P3.03"
  }
}
```

---

## Panel 3.4 — Measurement Framework

```json
{
  "panel_id": "P3.04",
  "aspect_ratio": "3:2",
  "position_on_page": "Lower-middle band of page 3",
  "composition": "Four equal quadrants in a 2x2 grid separated by thin cross rules. Each quadrant has a mono uppercase category label, and 2-3 short metric names in body text.",
  "visual_elements": [
    "2x2 quadrant grid with thin cross-shaped dividing rules",
    "Each quadrant balanced with a uppercase mono header and a short bulleted list"
  ],
  "text_to_render": {
    "section_header": "What to Measure",
    "quadrant_1_label": "TOP OF FUNNEL",
    "quadrant_1_metrics": ["Work-email signups", "Production integrations", "GitHub stars and forks"],
    "quadrant_2_label": "MIDDLE OF FUNNEL",
    "quadrant_2_metrics": ["PQL-to-opportunity rate", "Time from PQL to close", "Developer-sourced leads"],
    "quadrant_3_label": "REVENUE HEALTH",
    "quadrant_3_metrics": ["Expansion revenue", "PLG vs. sales-led CAC", "NRR by channel"],
    "quadrant_4_label": "DISTRIBUTION",
    "quadrant_4_metrics": ["Repo engagement", "Content multiplier ratio", "Organic share of voice"],
    "corner_mark": "P3.04"
  }
}
```

---

## Panel 3.5 — Four Failure Modes

```json
{
  "panel_id": "P3.05",
  "aspect_ratio": "3:2",
  "position_on_page": "Bottom of page 3",
  "composition": "Four stacked rows. Each row: a small warning glyph (a thin circled X or exclamation in accent_secondary red) on the left, followed by a short diagnosis in bold serif, a thin arrow, and the fix in body sans.",
  "visual_elements": [
    "Four horizontally aligned rows",
    "Small accent-red warning glyph (circled X or slim triangle with exclamation) at the start of each row",
    "Thin arrow between diagnosis and fix in each row"
  ],
  "text_to_render": {
    "section_header": "Four Failure Modes",
    "row_1_diagnosis": "Loose friction + aggressive PQL thresholds",
    "row_1_fix": "→ Phantom pipeline. Tighten signup, add enterprise signals.",
    "row_2_diagnosis": "Tight friction + weak brand infrastructure",
    "row_2_fix": "→ Growth ceiling. Build the content engine.",
    "row_3_diagnosis": "Strong usage signals + no conversion wall",
    "row_3_fix": "→ Permanently free users. Recalibrate limits and feature gates.",
    "row_4_diagnosis": "B2B marketing tactics aimed at developers",
    "row_4_fix": "→ Credibility death. GitHub first. Marketing second.",
    "corner_mark": "P3.05"
  }
}
```

---

# Stitching Notes

**Page 1 layout:**
- Top third: Panel 1.1 (hero, full width, 3:2)
- Bottom two-thirds: Panels 1.2–1.5 arranged as 2×2 square grid

**Page 2 layout:**
- Top third: Panel 2.1 (hero, full width)
- Middle band: Panel 2.2 (three columns, full width)
- Lower-middle: Panel 2.3 (formula, full width, shorter)
- Bottom: Panel 2.4 (two columns, full width)

**Page 3 layout:**
- Top third: Panel 3.1 (hero, full width)
- Upper-middle: Panel 3.2
- Middle: Panel 3.3
- Lower-middle: Panel 3.4
- Bottom: Panel 3.5

**Compression options:**
- To compress to 2 pages: drop Panel 3.4 (metrics can live in a companion page or appendix) and merge Panels 2.3 and 2.4 into a single wider panel.
- To expand to 4 pages: break Panel 1.1 into its own cover page with pages 2–4 mapping to the three systems.

**If panels don't match in tone across the set:** regenerate with the master style block verbatim. Do not modify the style tokens between panels — that's what keeps them visually related.

**If Nano Banana keeps mangling specific variable names:** generate those panels with the tag pills rendered as blank rounded rectangles, then overlay the monospace text manually. This is the one escape hatch when text-baking fails.
