#!/usr/bin/env python3
"""
PLG Framework Infographic Pipeline
Generates 14 panels via fal.ai (Nano Banana 2) and stitches into 3 letter-size pages.
"""

import json
import os
import sys
import time
import requests
from pathlib import Path
from PIL import Image
from io import BytesIO

# --- Config ---
FAL_KEY = os.environ.get("FAL_KEY")
if not FAL_KEY:
    sys.exit("FAL_KEY not set. Source ~/.env first.")

MODEL = "fal-ai/nano-banana-2"
FAL_URL = f"https://fal.run/{MODEL}"
OUTPUT_DIR = Path(__file__).parent / "plg-infographic-output"
OUTPUT_DIR.mkdir(exist_ok=True)

# Letter size at 150 DPI (good balance of quality vs generation speed)
DPI = 150
PAGE_W = int(8.5 * DPI)   # 1275
PAGE_H = int(11 * DPI)    # 1650
MARGIN = int(0.25 * DPI)  # 37px

# --- Master Style & Text Rules (baked into every prompt) ---

MASTER_STYLE = """STYLE REQUIREMENTS (apply to this image):
Aesthetic: Editorial infographic in the style of Harvard Business Review and MIT Sloan Management Review. Minimal, restrained, intellectual. Print-editorial feel, not tech-startup feel. Looks like it belongs in a printed strategy journal.

Color palette:
- Background: #F4EFE6 warm cream off-white with very slight paper texture
- Primary ink: #1A1A1A soft black for all text and line work
- Accent primary: #1B3A5B deep editorial navy for headlines and emphasis
- Accent secondary: #C9402F editorial red-orange, used sparingly for callouts and numerals only
- Neutral mid: #8A8680 warm gray for secondary text and labels
- Neutral light: #D9D4CB light warm gray for fills and dividers

Typography:
- Headlines: Transitional serif, high-contrast, editorial weight (like Tiempos or Lyon Text). Title case. Generous tracking.
- Subheads: Same serif, lighter weight, smaller size
- Body: Geometric sans-serif (like Inter or IBM Plex Sans). Regular weight. Tight but readable.
- Labels/data: Monospace (like JetBrains Mono). Lowercase for variable names. Uppercase for section labels.
- Never more than 3 typefaces in a single panel.

Illustration style: Flat editorial line illustration. Diagrammatic, not decorative. 1-1.5pt precise strokes, no hand-drawn wobble. Solid flat fills or fine hatching — NO gradients, NO shadows, NO 3D, NO glossy effects, NO neon, NO photorealism, NO mockups, NO stock-illustration people, NO emoji.

Layout: Implicit 12-column grid. Generous margins. Large editorial number or headline top-left. Generous whitespace. Small monospace corner mark."""

TEXT_RULES = """TEXT RENDERING RULES (mandatory):
Render every piece of text listed below VERBATIM, exactly as written. Do not add text. Do not omit text. Do not paraphrase. Do not translate. Spelling must match exactly, including technical variable names with underscores. If you cannot fit text legibly, reduce visual complexity rather than alter text. No Lorem Ipsum. No placeholder text. No invented text. No misspelled variable names. No added logos or watermarks."""

# --- Panel Definitions ---
# Each panel: id, aspect (w:h ratio), prompt text

PANELS = [
    # PAGE 1
    {
        "id": "P1.01",
        "aspect": (3, 2),
        "prompt": """Panel P1.01 — Hero / Framework Diagram

Full-width editorial cover-style layout. Large serif headline "The PLG Framework for Developer Products" top-left occupying left two-thirds. Above headline, small monospace eyebrow label. Below headline, a subhead line. Then three equal rectangular blocks in a horizontal row, connected by thin arrow lines flowing left-to-right, labeled 01, 02, 03. Each block has a small abstract diagrammatic icon and a label beneath. Corner mark bottom-right.

Block 01: abstract funnel/filter icon, labeled "Signal Architecture"
Block 02: abstract scoring gauge icon, labeled "PQL Scoring"
Block 03: abstract radial distribution pattern (one point expanding to many), labeled "Brand Infrastructure"

TEXT TO RENDER:
Eyebrow: "A PLG OPERATING FRAMEWORK"
Headline: "The PLG Framework for Developer Products"
Subhead: "Three systems that convert free users into qualified pipeline."
Block 01 number: "01" — Block 01 label: "Signal Architecture"
Block 02 number: "02" — Block 02 label: "PQL Scoring"
Block 03 number: "03" — Block 03 label: "Brand Infrastructure"
Corner mark: "P1.01" """
    },
    {
        "id": "P1.02",
        "aspect": (1, 1),
        "prompt": """Panel P1.02 — Signup Gate

Large red-orange editorial numeral '01' top-left. Title "Signup Gate" in navy serif below. Supporting text in body sans beneath. Right side: abstract filter diagram — row of circles meeting a horizontal line, some pass through, others marked with X. Two monospace variable tags in rounded rectangles at bottom.

TEXT TO RENDER:
Numeral: "01" (in red-orange accent color)
Title: "Signup Gate"
What line: "Work email + company + stated use case."
Why line: "Filters 40% of non-buyers before they cost you anything downstream."
Data tag 1: "has_work_email"
Data tag 2: "stated_use_case"
Corner mark: "P1.02" """
    },
    {
        "id": "P1.03",
        "aspect": (1, 1),
        "prompt": """Panel P1.03 — Integration Boundary

This is a square infographic panel on a cream #F4EFE6 background. Layout: left half is text, right half is a diagram.

LEFT HALF:
- Oversized serif numeral "02" in red-orange #C9402F color, top-left, very large and bold
- Below it, title "Integration Boundary" in navy #1B3A5B serif font
- Below title, two lines of body text in small geometric sans-serif:
  Line 1: "Sandbox is frictionless. Production requires a verification step."
  Line 2: "Where casual exploration becomes real commitment."
- At the bottom, two small rounded-rectangle pills with monospace text inside: "production_integration_date" and "integration_depth_score"

RIGHT HALF — DIAGRAM:
- Two large adjacent rectangular zones side by side, taking up most of the right half
- Left rectangle: filled with light warm gray #D9D4CB, with the word "SANDBOX" in uppercase monospace centered inside
- Right rectangle: white/cream fill with a thin navy border, with the word "PRODUCTION" in uppercase monospace centered inside
- Between them: a bold vertical dashed threshold line
- A small solid navy circle on the left side with a curved arrow crossing the threshold line into the right zone — showing movement from sandbox to production
- The two zones should be prominent and clearly distinct

Bottom-right corner: small monospace text "P1.03"

TEXT TO RENDER (verbatim, no changes):
"02"
"Integration Boundary"
"Sandbox is frictionless. Production requires a verification step."
"Where casual exploration becomes real commitment."
"SANDBOX"
"PRODUCTION"
"production_integration_date"
"integration_depth_score"
"P1.03" """
    },
    {
        "id": "P1.04",
        "aspect": (1, 1),
        "prompt": """Panel P1.04 — Conversion Wall

Large red-orange numeral '03' top-left. Title "Conversion Wall" in navy serif. Body text below. Visual on right: minimal line chart with ascending curve hitting a solid horizontal ceiling line. A thin dashed horizontal rule below the ceiling marked "70%" in monospace.

TEXT TO RENDER:
Numeral: "03" (in red-orange accent color)
Title: "Conversion Wall"
What line: "Usage limits plus feature gates."
Why line: "Tuned to convert growth trajectory, not cap adoption."
Chart label: "70% free-tier limit"
Data tag 1: "usage_limit_proximity"
Data tag 2: "pricing_page_visits"
Corner mark: "P1.04" """
    },
    {
        "id": "P1.05",
        "aspect": (1, 1),
        "prompt": """Panel P1.05 — Team Expansion Gate

This is a square infographic panel on a cream #F4EFE6 background. Layout: left half is text, right half is a diagram.

LEFT HALF:
- Oversized serif numeral "04" in red-orange #C9402F color, top-left, very large and bold
- Below it, title "Team Expansion Gate" in navy #1B3A5B serif font
- Below title, two lines of body text in small geometric sans-serif:
  Line 1: "Collaboration behind paid tier. Invite limits on free."
  Line 2: "One dev is an experiment. Five devs is an evaluation."
- At the bottom, two LARGE rounded-rectangle pills with monospace text inside, each on its own line stacked vertically: "team_size" on top, and "admin_engagement_score" below it. Make these pills wide enough to comfortably fit the full text at a readable size.

RIGHT HALF — DIAGRAM (this is the most important visual element):
- A network/node diagram showing team expansion
- ONE single navy circle on the far left of the diagram area, representing a solo developer
- FIVE navy circles clustered on the right side of the diagram area, arranged in a loose pentagon or organic cluster
- Thin navy lines connecting the single circle to each of the five circles, forming a hub-and-spoke pattern
- The five circles should be clearly grouped together, showing they are a team
- This diagram must be prominent and fill the right half of the panel

Do NOT write the words "Editorial Infographic" anywhere in this image. Only render the text listed below.

Bottom-right corner: small monospace text "P1.05"

TEXT TO RENDER (verbatim, no changes):
"04"
"Team Expansion Gate"
"Collaboration behind paid tier. Invite limits on free."
"One dev is an experiment. Five devs is an evaluation."
"team_size"
"admin_engagement_score"
"P1.05" """
    },

    # PAGE 2
    {
        "id": "P2.01",
        "aspect": (3, 2),
        "prompt": """Panel P2.01 — PQL Scoring Hero

Editorial page-opener. Large serif headline left. Right side: abstract diagram of three horizontal lines of different weights entering from left, converging into a single circular node on right (weighted inputs producing a score). Thin horizontal rule under headline.

TEXT TO RENDER:
Eyebrow: "SYSTEM 02 — PQL SCORING"
Headline: "Scoring for Production Dependency"
Subhead: "The question every variable answers: is this user showing signs of production dependency plus enterprise need?"
Corner mark: "P2.01" """
    },
    {
        "id": "P2.02",
        "aspect": (3, 2),
        "prompt": """Panel P2.02 — Three Variable Categories

Three equal-width columns separated by thin vertical rules. Each column: monospace uppercase header, large serif weight percentage, bulleted list of variable names in monospace.

Column 1 header: "PRODUCTION USAGE" — weight: "40%" — variables: api_calls_last_30d, error_rate, integration_points, usage_consistency
Column 2 header: "ENTERPRISE INTENT" — weight: "40%" — variables: team_size, sso_attempt, usage_limit_proximity, domain_firmographic
Column 3 header: "ENGAGEMENT" — weight: "20%" — variables: docs_depth, community_participation, support_ticket_quality, pricing_page_visits

TEXT TO RENDER:
"PRODUCTION USAGE" "40%" "api_calls_last_30d" "error_rate" "integration_points" "usage_consistency"
"ENTERPRISE INTENT" "40%" "team_size" "sso_attempt" "usage_limit_proximity" "domain_firmographic"
"ENGAGEMENT" "20%" "docs_depth" "community_participation" "support_ticket_quality" "pricing_page_visits"
Corner mark: "P2.02" """
    },
    {
        "id": "P2.03",
        "aspect": (3, 2),
        "prompt": """Panel P2.03 — Scoring Formula

Center-aligned layout. The scoring formula rendered large in navy serif with monospace variable names, like a print-journal equation. Below a thin horizontal rule. Below that, a routing condition in monospace with a right-pointing arrow to the action.

TEXT TO RENDER:
Formula: "PQL Score = (Production × 0.4) + (Enterprise × 0.4) + (Engagement × 0.2)"
Routing condition: "IF score > 70 AND team_size ≥ 3  →  Route to Sales"
Caption: "Start simple. Advanced variants split developer-led vs. top-down."
Corner mark: "P2.03" """
    },
    {
        "id": "P2.04",
        "aspect": (3, 2),
        "prompt": """Panel P2.04 — Two Routes: Dev-Led vs. Top-Down

Two-column split with thin vertical rule down center. At top center, a single arrow splitting into two arrows (one left, one right). Each side has a serif header, a monospace condition, a routing action, and a tactical note.

LEFT COLUMN:
Header: "Developer-Led"
Signal: "High production usage + low enterprise signals"
Route: "Route to DevRel."
Tactic: "Nurture with technical content. Sales calls kill this motion."

RIGHT COLUMN:
Header: "Top-Down"
Signal: "Enterprise signals + moderate usage"
Route: "Route to Enterprise AE."
Tactic: "Speed matters. Exec evaluations move fast or die."

Corner mark: "P2.04" """
    },

    # PAGE 3
    {
        "id": "P3.01",
        "aspect": (3, 2),
        "prompt": """Panel P3.01 — Distribution Multiplier Hero

Editorial page-opener. Left: oversized serif numeral "1". Thin radiating lines fan out from "1" to the right toward an oversized serif numeral "10". Around "10", ten small monospace labels arranged in a loose semicircle.

TEXT TO RENDER:
Eyebrow: "SYSTEM 03 — BRAND INFRASTRUCTURE"
Headline: "One Technical Piece → Ten Developer Touchpoints"
Subhead: "Build once. Distribute across every channel where developers discover tools."
Left numeral: "1"
Right numeral: "10"
Channel labels: "GitHub" "Dev.to" "Reddit" "Discord" "HackerNews" "YouTube" "Blog" "X/Twitter" "Stack Overflow" "Newsletter"
Corner mark: "P3.01" """
    },
    {
        "id": "P3.02",
        "aspect": (3, 2),
        "prompt": """Panel P3.02 — GitHub as Primary Distribution

Left two-thirds: serif header, body paragraph, and five tag pills in monospace. Right third: abstract stacked-rectangle illustration suggesting code repos as building blocks.

TEXT TO RENDER:
Header: "GitHub as Primary Distribution"
Body: "Developers trust code over copy. A repo with 500 stars is more credible than a case study."
Tag pills: "SDKs" "Example repos" "Starter templates" "Migration scripts" "Debugging utilities"
Corner mark: "P3.02" """
    },
    {
        "id": "P3.03",
        "aspect": (3, 2),
        "prompt": """Panel P3.03 — Three PQL Paths

Three horizontal rows stacked vertically, separated by thin horizontal rules. Each row: label on left, sequence of 4-5 small circles connected by arrows, outcome on right.

TEXT TO RENDER:
Section header: "Three Paths to Pipeline"
Row 1 label: "Path A — High-Quality PQL"
Row 1 sequence: "Signup → Integrate → Scale usage → Team invites → Route to Sales"
Row 2 label: "Path B — Low Signal"
Row 2 sequence: "Signup → Sandbox only → No team → Nurture, don't call"
Row 3 label: "Path C — GitHub → Community → Enterprise"
Row 3 sequence: "Repo discovery → Team sprawl → Director asks 'what is this?' → Inbound enterprise PQL"
Corner mark: "P3.03" """
    },
    {
        "id": "P3.04",
        "aspect": (3, 2),
        "prompt": """Panel P3.04 — Measurement Framework

This is a wide infographic panel (3:2 aspect ratio) on a cream #F4EFE6 background.

TOP: Section header "What to Measure" in large navy #1B3A5B serif font, left-aligned, with a thin horizontal rule beneath it.

BELOW THE HEADER: A 2x2 grid of four equal quadrants, separated by thin cross-shaped dividing lines (one horizontal, one vertical) in warm gray #D9D4CB. The four quadrants should be large, balanced, and take up most of the panel space.

TOP-LEFT QUADRANT:
- Header: "TOP OF FUNNEL" in uppercase monospace, navy color
- Three bullet items in small sans-serif below: "Work-email signups" / "Production integrations" / "GitHub stars and forks"

TOP-RIGHT QUADRANT:
- Header: "MIDDLE OF FUNNEL" in uppercase monospace, navy color
- Three bullet items: "PQL-to-opportunity rate" / "Time from PQL to close" / "Developer-sourced leads"

BOTTOM-LEFT QUADRANT:
- Header: "REVENUE HEALTH" in uppercase monospace, navy color
- Three bullet items: "Expansion revenue" / "PLG vs. sales-led CAC" / "NRR by channel"

BOTTOM-RIGHT QUADRANT:
- Header: "DISTRIBUTION" in uppercase monospace, navy color
- Three bullet items: "Repo engagement" / "Content multiplier ratio" / "Organic share of voice"

Each quadrant should have generous internal padding. The grid should feel spacious and organized, not cramped.

Bottom-right corner: small monospace text "P3.04"

TEXT TO RENDER (verbatim):
"What to Measure"
"TOP OF FUNNEL" "Work-email signups" "Production integrations" "GitHub stars and forks"
"MIDDLE OF FUNNEL" "PQL-to-opportunity rate" "Time from PQL to close" "Developer-sourced leads"
"REVENUE HEALTH" "Expansion revenue" "PLG vs. sales-led CAC" "NRR by channel"
"DISTRIBUTION" "Repo engagement" "Content multiplier ratio" "Organic share of voice"
"P3.04" """
    },
    {
        "id": "P3.05",
        "aspect": (3, 2),
        "prompt": """Panel P3.05 — Four Failure Modes

Four stacked rows. Each row: small red-orange warning glyph (circled X) on left, bold serif diagnosis, thin arrow, fix in body sans.

TEXT TO RENDER:
Section header: "Four Failure Modes"
Row 1 diagnosis: "Loose friction + aggressive PQL thresholds" — fix: "→ Phantom pipeline. Tighten signup, add enterprise signals."
Row 2 diagnosis: "Tight friction + weak brand infrastructure" — fix: "→ Growth ceiling. Build the content engine."
Row 3 diagnosis: "Strong usage signals + no conversion wall" — fix: "→ Permanently free users. Recalibrate limits and feature gates."
Row 4 diagnosis: "B2B marketing tactics aimed at developers" — fix: "→ Credibility death. GitHub first. Marketing second."
Corner mark: "P3.05" """
    },
]


def generate_panel(panel: dict, retries: int = 2) -> Path:
    """Generate a single panel image via fal.ai."""
    panel_id = panel["id"]
    output_path = OUTPUT_DIR / f"{panel_id}.png"

    if output_path.exists():
        print(f"  {panel_id}: already exists, skipping")
        return output_path

    # Build full prompt
    full_prompt = f"{MASTER_STYLE}\n\n{panel['prompt']}\n\n{TEXT_RULES}"

    # Determine pixel dimensions based on aspect ratio
    # Hero panels (3:2) = full width; Square panels (1:1) = half width
    aw, ah = panel["aspect"]
    if aw == 3 and ah == 2:
        # Wide panel: 1536x1024
        img_w, img_h = 1536, 1024
    else:
        # Square panel: 1024x1024
        img_w, img_h = 1024, 1024

    payload = {
        "prompt": full_prompt,
        "image_size": {"width": img_w, "height": img_h},
    }

    for attempt in range(retries + 1):
        try:
            print(f"  {panel_id}: generating ({img_w}x{img_h})...")
            resp = requests.post(
                FAL_URL,
                headers={
                    "Authorization": f"Key {FAL_KEY}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=120,
            )
            resp.raise_for_status()
            data = resp.json()

            if "images" not in data or not data["images"]:
                raise ValueError(f"No images in response: {list(data.keys())}")

            img_url = data["images"][0]["url"]
            img_resp = requests.get(img_url, timeout=60)
            img_resp.raise_for_status()

            img = Image.open(BytesIO(img_resp.content)).convert("RGB")
            img.save(output_path, "PNG")
            print(f"  {panel_id}: saved → {output_path.name}")
            return output_path

        except Exception as e:
            print(f"  {panel_id}: attempt {attempt+1} failed — {e}")
            if attempt < retries:
                time.sleep(2)
            else:
                print(f"  {panel_id}: FAILED after {retries+1} attempts")
                return None


def stitch_page(page_num: int, panel_images: dict) -> Path:
    """Stitch panels into a single letter-size page."""
    page = Image.new("RGB", (PAGE_W, PAGE_H), color=(244, 239, 230))  # #F4EFE6
    output_path = OUTPUT_DIR / f"page_{page_num}.png"

    usable_w = PAGE_W - 2 * MARGIN
    usable_h = PAGE_H - 2 * MARGIN

    if page_num == 1:
        # Top third: P1.01 hero (full width, ~1/3 height)
        hero_h = int(usable_h * 0.33)
        if "P1.01" in panel_images and panel_images["P1.01"]:
            img = Image.open(panel_images["P1.01"])
            img = img.resize((usable_w, hero_h), Image.LANCZOS)
            page.paste(img, (MARGIN, MARGIN))

        # Bottom 2/3: 2x2 grid of P1.02-P1.05
        grid_top = MARGIN + hero_h + MARGIN // 2
        grid_h = PAGE_H - grid_top - MARGIN
        cell_w = (usable_w - MARGIN // 2) // 2
        cell_h = (grid_h - MARGIN // 2) // 2

        grid_panels = ["P1.02", "P1.03", "P1.04", "P1.05"]
        positions = [
            (MARGIN, grid_top),
            (MARGIN + cell_w + MARGIN // 2, grid_top),
            (MARGIN, grid_top + cell_h + MARGIN // 2),
            (MARGIN + cell_w + MARGIN // 2, grid_top + cell_h + MARGIN // 2),
        ]
        for pid, pos in zip(grid_panels, positions):
            if pid in panel_images and panel_images[pid]:
                img = Image.open(panel_images[pid])
                img = img.resize((cell_w, cell_h), Image.LANCZOS)
                page.paste(img, pos)

    elif page_num == 2:
        # 4 bands: hero, 3-col, formula, 2-col
        band_ids = ["P2.01", "P2.02", "P2.03", "P2.04"]
        band_weights = [0.25, 0.30, 0.18, 0.27]  # relative heights
        y = MARGIN
        for pid, weight in zip(band_ids, band_weights):
            band_h = int(usable_h * weight)
            if pid in panel_images and panel_images[pid]:
                img = Image.open(panel_images[pid])
                img = img.resize((usable_w, band_h), Image.LANCZOS)
                page.paste(img, (MARGIN, y))
            y += band_h

    elif page_num == 3:
        # 5 bands: hero, github, paths, metrics, failures
        band_ids = ["P3.01", "P3.02", "P3.03", "P3.04", "P3.05"]
        band_weights = [0.22, 0.20, 0.22, 0.18, 0.18]
        y = MARGIN
        for pid, weight in zip(band_ids, band_weights):
            band_h = int(usable_h * weight)
            if pid in panel_images and panel_images[pid]:
                img = Image.open(panel_images[pid])
                img = img.resize((usable_w, band_h), Image.LANCZOS)
                page.paste(img, (MARGIN, y))
            y += band_h

    page.save(output_path, "PNG")
    print(f"Page {page_num} saved → {output_path.name}")
    return output_path


def pages_to_pdf(page_paths: list[Path]) -> Path:
    """Combine page PNGs into a single PDF."""
    pdf_path = OUTPUT_DIR / "PLG_Framework_Infographic.pdf"
    pages = [Image.open(p).convert("RGB") for p in page_paths if p]
    if pages:
        pages[0].save(pdf_path, "PDF", save_all=True, append_images=pages[1:], resolution=DPI)
        print(f"\nPDF saved → {pdf_path}")
    return pdf_path


def main():
    print(f"=== PLG Framework Infographic Pipeline ===")
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}\n")

    # Step 1: Generate all panels
    print("Step 1: Generating panels...")
    panel_images = {}
    for panel in PANELS:
        result = generate_panel(panel)
        if result:
            panel_images[panel["id"]] = result

    print(f"\nGenerated {len(panel_images)}/{len(PANELS)} panels.\n")

    if not panel_images:
        sys.exit("No panels generated. Check FAL_KEY and network.")

    # Step 2: Stitch pages
    print("Step 2: Stitching pages...")
    page_paths = []
    for page_num in [1, 2, 3]:
        page_path = stitch_page(page_num, panel_images)
        page_paths.append(page_path)

    # Step 3: Combine to PDF
    print("\nStep 3: Creating PDF...")
    pages_to_pdf(page_paths)

    print("\nDone!")


if __name__ == "__main__":
    main()
