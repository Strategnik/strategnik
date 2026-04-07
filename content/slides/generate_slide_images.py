#!/usr/bin/env python3
"""Generate Intelligence Layer presentation slides via Gemini API.
Focused on explaining the Intelligence Layer and how teams use it to speed up marketing.
"""
import json, base64, os, sys, time
import httpx

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.expanduser("~/.env"))
        API_KEY = os.environ.get("GEMINI_API_KEY", "")
    except ImportError:
        # Try manual .env loading
        env_path = os.path.expanduser("~/.env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        v = v.strip().strip("'\"")
                        if k.strip() == "GEMINI_API_KEY":
                            API_KEY = v
                            break

MODEL = "gemini-2.5-flash-image"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT_DIR, exist_ok=True)

# ─── Color System ───
# Deep navy background: #0F172A
# Primary accent (turquoise/teal): #06B6D4
# Secondary (amber): #F59E0B
# Success (green): #10B981
# Danger (red): #EF4444
# Text: white #FFFFFF, gray #94A3B8

SLIDES = {
    "slide01_title": {
        "title": "Title — The Intelligence Layer",
        "prompt": """Create a professional, dark-themed 16:9 widescreen presentation title slide.

Design:
- Background: deep dark navy (#0F172A) with a subtle geometric network pattern — faint glowing turquoise (#06B6D4) connection nodes and lines in the right third, like a neural mesh fading into the background
- Large bold headline, upper-left aligned with generous margins: "THE INTELLIGENCE LAYER"
- Below the headline, a thin turquoise horizontal line (2px, ~40% width)
- Subtitle below the line: "What AI Agents Actually Need to Run Your Marketing"
- Bottom-left corner: "STRATEGNIK" in small turquoise caps
- Bottom-right corner: "April 2026" in small gray (#94A3B8) text
- All text: clean modern sans-serif (like Inter or Helvetica Neue), white
- Lots of negative space — this is a premium B2B consulting deck, not a tech demo
- No stock photos, no gradients, no decorative flourishes"""
    },

    "slide02_problem": {
        "title": "Your AI Is Still a Chatbot",
        "prompt": """Create a professional dark-themed 16:9 presentation slide.

Header: "YOUR AI IS STILL A CHATBOT" in bold white text, left-aligned, with a turquoise (#06B6D4) underline accent

Content — a stark before/after comparison split down the middle:

LEFT SIDE labeled "What most companies did" in gray:
- A simple gray chat bubble icon (large, centered)
- Below it in white: "Gave the team ChatGPT access"
- Below that in gray: "Called it an AI strategy"
- Below that in dim gray: "Got faster typing"

RIGHT SIDE labeled "What actually changes things" in turquoise:
- A connected system diagram icon — 6 small nodes connected by lines forming a hexagonal mesh, glowing turquoise
- Below it in white: "Built the Intelligence Layer"
- Below that in gray: "Encoded brand, data, content, distribution"
- Below that in turquoise: "Got a precision instrument"

A vertical thin dashed line separates the two halves
Bottom text in gray italic: "62% of companies are experimenting with AI. Only 23% are scaling. The gap is infrastructure."

Background: deep navy (#0F172A)
Clean sans-serif font throughout"""
    },

    "slide03_spectrum": {
        "title": "The AI Maturity Spectrum",
        "prompt": """Create a professional dark-themed 16:9 presentation slide showing a horizontal spectrum/progression.

Header: "WHERE IS YOUR MARKETING?" in bold white with turquoise (#06B6D4) underline

Main visual — a wide horizontal bar/spectrum with three distinct zones:

LEFT ZONE (gray, largest section ~50%):
- Label above: "CHATBOT" in gray
- Icon: single chat bubble
- Below: "Your team has AI access. They write better emails."
- A cluster of small dots above representing "Most companies are here"
- Small text: "AI = typing upgrade"

MIDDLE ZONE (amber #F59E0B, medium section ~30%):
- Label above: "AUTOMATION" in amber
- Icon: two gears
- Below: "You've automated some workflows. Disconnected tools."
- A few dots above
- Small text: "AI = task automation"

RIGHT ZONE (turquoise #06B6D4, smallest section ~20%):
- Label above: "OPERATING SYSTEM" in turquoise, glowing
- Icon: interconnected hexagonal network
- Below: "AI runs your marketing with strategic intent and brand precision."
- Almost no dots above
- Small text: "AI = intelligence layer"

Below the spectrum: a turquoise arrow pointing right with text: "The 39-point gap between experimenting and scaling is where we operate."

Background: deep navy (#0F172A)
16:9 widescreen, clean sans-serif"""
    },

    "slide04_six_layers": {
        "title": "The Six Layers",
        "prompt": """Create a professional dark-themed 16:9 presentation slide showing a 6-component framework.

Header: "WHAT AI AGENTS NEED TO OPERATE" in bold white with turquoise underline
Subheader in gray: "The Intelligence Layer — 6 layers of encoded context"

Layout: 3 columns x 2 rows of cards, each a dark gray (#1E293B) rounded rectangle with generous spacing

Row 1:
- Card 1 — turquoise (#06B6D4) top accent line:
  "1. BRAND CONTEXT" in turquoise bold
  "Voice, tone, editorial standards — encoded as machine-readable operating specs, not PDFs" in light gray

- Card 2 — teal (#14B8A6) top accent line:
  "2. MARKET CONTEXT" in teal bold
  "ICP definitions, buying committees, competitive positioning, account prioritization" in light gray

- Card 3 — green (#10B981) top accent line:
  "3. DATA ARCHITECTURE" in green bold
  "CRM design, product signals, lead scoring, behavioral triggers" in light gray

Row 2:
- Card 4 — amber (#F59E0B) top accent line:
  "4. CONTENT INFRASTRUCTURE" in amber bold
  "Templates, schemas, production kits, editorial workflows — the system that produces" in light gray

- Card 5 — rose (#F43F5E) top accent line:
  "5. DISTRIBUTION ORCHESTRATION" in rose bold
  "Multi-platform signal routing, ecosystem presence, channel choreography" in light gray

- Card 6 — blue (#3B82F6) top accent line:
  "6. MEASUREMENT & STEERING" in blue bold
  "Revenue influence, decision accuracy, feedback loops that steer what happens next" in light gray

Background: deep navy (#0F172A)
Clean sans-serif, professional, no decorative elements"""
    },

    "slide05_system_flow": {
        "title": "How It Works as a System",
        "prompt": """Create a professional dark-themed 16:9 presentation slide showing a horizontal system architecture flow.

Header: "HOW THE SYSTEM WORKS" in bold white with turquoise underline

Main visual — a left-to-right flow diagram with three major stages connected by glowing turquoise arrows:

STAGE 1 (left) — "SIGNALS" in amber (#F59E0B):
Three stacked dark gray cards:
- "Product Data" (usage signals, feature adoption, churn risk)
- "CRM / Behavioral" (engagement, scoring, intent signals)
- "Market / Competitive" (keyword trends, competitor moves)

→ Large glowing turquoise arrow →

STAGE 2 (center, larger, emphasized) — "INTELLIGENCE LAYER" in turquoise (#06B6D4):
A larger dark card with a turquoise border/glow containing a compact 2x3 grid:
Brand | Market | Data
Content | Distribution | Measurement
This is the brain — it decides WHO gets WHAT message, WHERE, WHEN

→ Large glowing turquoise arrow →

STAGE 3 (right) — "AGENT FLEET" → "OUTCOMES":
Three stacked dark gray cards:
- "Content Agents" → deploy across channels
- "Targeting Agents" → route to right segments
- "Measurement Agents" → feed back into the loop

A curved arrow loops from OUTCOMES back to SIGNALS at the bottom (feedback loop)

Below: "No human touches it. But every decision is governed by context your team designed." in gray italic

Background: deep navy (#0F172A)
16:9 widescreen"""
    },

    "slide06_before_after": {
        "title": "Campaign-Driven vs Signal-Driven",
        "prompt": """Create a professional dark-themed 16:9 presentation slide with two side-by-side flow diagrams.

Header: "THE SHIFT: CAMPAIGN → SIGNAL" in bold white with turquoise underline

LEFT SIDE — "CAMPAIGN-DRIVEN" (labeled in gray, with a red X or crossed-out treatment):
A vertical flow, each step a gray box with arrow down:
1. Quarterly Planning
2. Campaign Brief
3. Creative Production (2-4 weeks)
4. Channel Deployment
5. Wait for Results
6. Dashboard Report
7. Repeat

Text below in gray: "Linear. Slow. Batch-oriented."
Time indicator: "Cycle time: 6-8 weeks"

RIGHT SIDE — "SIGNAL-DRIVEN" (labeled in turquoise #06B6D4, with a checkmark):
A more dynamic flow with branching:
1. Signal Fires (product usage, behavior, intent)
2. Intelligence Layer Processes (instant)
3. Agent Selects Response (content, channel, timing)
4. Multi-Channel Deploy (simultaneous)
5. Feedback Loop (continuous)
↻ Loops back to step 1

Text below in turquoise: "Continuous. Adaptive. Autonomous."
Time indicator: "Response time: minutes, not months"

A vertical dashed line separates the two sides
Background: deep navy (#0F172A)
16:9 widescreen"""
    },

    "slide07_execution_tax": {
        "title": "The Execution Tax",
        "prompt": """Create a professional dark-themed 16:9 presentation slide about wasted marketing effort.

Header: "THE EXECUTION TAX" in bold white with amber (#F59E0B) underline (amber signals warning/cost)

Main visual — a large horizontal stacked bar chart taking up the center of the slide:

The bar is divided into three colored sections:
- 65% RED/ROSE section (#EF4444): "REPETITIVE EXECUTION" — manual production, formatting, scheduling, copying between tools
- 20% AMBER section (#F59E0B): "COORDINATION OVERHEAD" — status meetings, handoffs, approvals, context-switching
- 15% TURQUOISE section (#06B6D4): "STRATEGIC WORK" — positioning, creative direction, market insight, judgment

Each section has its percentage prominently displayed and the label below

Below the chart, two comparison rows:

"TYPICAL 15-PERSON MARKETING TEAM"
→ "$750K/yr fully loaded"
→ "~$500K spent on work agents do better"

"WITH THE INTELLIGENCE LAYER"
→ "6-person team + agent fleet"
→ "Same output. More strategic capacity."

Bottom text in amber: "You're not overstaffed. You're under-architected."

Background: deep navy (#0F172A)
16:9 widescreen"""
    },

    "slide08_team_transformation": {
        "title": "How Roles Transform",
        "prompt": """Create a professional dark-themed 16:9 presentation slide showing role evolution.

Header: "YOUR TEAM EVOLVES" in bold white with turquoise (#06B6D4) underline
Subheader in gray: "From campaign operators to system designers"

Four horizontal transformation rows, each showing a left→right evolution with a turquoise arrow:

Row 1:
"Campaign Manager" (gray, crossed out lightly) → turquoise arrow → "System Designer" (turquoise bold)
Small gray text: "Designs the rules and context agents operate within"

Row 2:
"Content Producer" (gray, crossed out) → turquoise arrow → "Content Architect + Agent Fleet" (turquoise bold)
Small gray text: "Builds templates and editorial specs; agents produce at scale"

Row 3:
"Channel Owner" (gray, crossed out) → turquoise arrow → "Experience Governor" (turquoise bold)
Small gray text: "Sets guardrails and quality standards across all touchpoints"

Row 4:
"Marketing Ops" (gray, crossed out) → turquoise arrow → "Intelligence Layer Engineer" (turquoise bold)
Small gray text: "Maintains the context infrastructure that powers everything"

Below all rows, separated by a thin line:
Left side in gray: "Before: 15-person team, linear execution"
Right side in turquoise: "After: 6-person team, exponential output"

Background: deep navy (#0F172A)
Clean sans-serif, 16:9 widescreen"""
    },

    "slide09_speed": {
        "title": "What Gets Faster",
        "prompt": """Create a professional dark-themed 16:9 presentation slide showing speed improvements.

Header: "WHAT GETS FASTER" in bold white with green (#10B981) underline

Layout: 5 horizontal comparison bars, each showing a before/after timing:

Bar 1 — "Campaign from brief to deployment"
BEFORE (long red/gray bar): "4-6 weeks"
AFTER (short turquoise bar): "Hours"
Speed multiplier badge: "40x"

Bar 2 — "Content production per piece"
BEFORE: "3-5 days"
AFTER: "30 minutes"
Badge: "10x"

Bar 3 — "Signal-to-response latency"
BEFORE: "Days to never"
AFTER: "Real-time"
Badge: "∞"

Bar 4 — "New market/vertical entry"
BEFORE: "Quarter-long initiative"
AFTER: "Reconfigure the layer in days"
Badge: "30x"

Bar 5 — "Personalization at scale"
BEFORE: "3-5 segments, manual"
AFTER: "1:1, autonomous"
Badge: "1000x"

Each bar pair: gray/red for before, turquoise for after, with the multiplier badge in a turquoise circle on the right

Bottom text in gray: "Source: Accenture internal deployment — 25-55% speed improvement across 600 marketers with AI agents"

Background: deep navy (#0F172A)
16:9 widescreen"""
    },

    "slide10_cta": {
        "title": "Before You Hire Your Next Marketer",
        "prompt": """Create a professional dark-themed 16:9 presentation closing/CTA slide.

Center-aligned layout with generous negative space:

Large text at top center: "BEFORE YOU HIRE" in white bold
Below it: "YOUR NEXT MARKETER" in turquoise (#06B6D4) bold

A thin turquoise horizontal line (~30% width, centered)

Below the line, three short value props in gray, vertically stacked with spacing:
"2 weeks. One diagnostic. The foundation for everything that comes next."

Below that, a clean rounded rectangle button/card shape in dark gray (#1E293B) with turquoise border:
"THE INTELLIGENCE LAYER DIAGNOSTIC"
"$10-15K | 2 weeks | 6-layer gap analysis + build roadmap"

At the very bottom: "strategnik.com" in small turquoise text

Background: deep dark navy (#0F172A) with very subtle abstract circuit/network pattern in the bottom-right corner, barely visible
Minimal, premium, confident
16:9 widescreen"""
    },
}

def generate_image(name, prompt):
    outpath = os.path.join(OUT_DIR, f"{name}.png")
    if os.path.exists(outpath) and os.path.getsize(outpath) > 10000:
        print(f"  SKIP {name} (exists)")
        return True
    print(f"  GEN  {name}...", end=" ", flush=True)
    try:
        r = httpx.post(URL,
            headers={"Content-Type": "application/json", "X-goog-api-key": API_KEY},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseModalities": ["IMAGE", "TEXT"]}
            },
            timeout=180)
        data = r.json()
        if "error" in data:
            print(f"ERROR: {data['error']['message'][:120]}")
            return False
        for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
            if "inlineData" in part:
                img = base64.b64decode(part["inlineData"]["data"])
                with open(outpath, "wb") as f:
                    f.write(img)
                print(f"OK ({len(img)//1024}KB)")
                return True
        print("NO IMAGE in response")
        return False
    except Exception as e:
        print(f"EXCEPTION: {e}")
        return False

if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not found. Set it in ~/.env or environment.")
        sys.exit(1)
    print(f"Generating {len(SLIDES)} Intelligence Layer slides via Gemini {MODEL}...\n")
    ok, fail = 0, 0
    for name, info in SLIDES.items():
        print(f"[{name}] {info['title']}")
        if generate_image(name, info["prompt"]):
            ok += 1
        else:
            fail += 1
        time.sleep(3)  # rate limit
    print(f"\nDone: {ok} OK, {fail} failed")
    print(f"Output: {OUT_DIR}")
