# Strategnik Diagram Style Guide
## "Studio Whiteboard meets LinkedIn Explainer"

Use this as a reference when prompting image models (nano-banana, Gemini, etc.) for Strategnik diagrams, infographics, and slide visuals.

**Quick reference:** Pass this file as context or paste the relevant section into your image prompt.

---

## Brand Colors

| Role | Hex | Token |
|---|---|---|
| Accent (turquoise) | `#1de2c4` | turquoise-500 |
| Accent hover | `#4ae8d0` | turquoise-400 |
| Accent muted | `#17b59d` | turquoise-600 |
| Background black | `#111113` | shadow-grey-950 |
| Surface/card | `#18181b` | shadow-grey-900 |
| Card elevated | `#313135` | shadow-grey-800 |
| Text white | `#FFFFFF` | — |
| Text gray | `#afafb6` | shadow-grey-300 |
| Text dim | `#7a7a85` | shadow-grey-500 |
| Off-white | `#f2f2f3` | shadow-grey-50 |
| Amber | `#f59e0b` | — |
| Blue | `#60a5fa` | — |
| Green | `#34d399` | — |
| Purple | `#c084fc` | — |
| Cyan | `#06b6d4` | — |
| Red | `#ef4444` | — |
| Orange (at-risk) | `#f97316` | — |

### Pastel zone washes (for section backgrounds)
Use these at 10-15% opacity behind sketched content:
- Mint zone: `#1de2c4` at 12%
- Amber zone: `#f59e0b` at 12%
- Blue zone: `#60a5fa` at 12%
- Purple zone: `#c084fc` at 12%

---

## Style A: Dark Presentation Slides

For pitch decks, CEO/CRO meetings, LinkedIn carousels on dark backgrounds.

```
Background: near-black (#111113)
Cards/surfaces: dark gray (#18181b)
Accent: turquoise (#1de2c4)
Section headers: colored top accent lines on dark cards
Text: white headlines, gray (#afafb6) body, dim (#7a7a85) labels
Typography: clean modern sans-serif (Inter/Helvetica Neue)
No gradients, no shadows, no 3D. Flat design.
Every element communicates information — zero ornamental graphics.
16:9 widescreen aspect ratio.
```

---

## Style B: LinkedIn Technical Infographic

For tall-scroll LinkedIn posts with modular sections.

```
Tall vertical format (3:5+ ratio, portrait).
White or light background (#f2f2f3).
Modular stacked horizontal bands — each concept is self-contained.

Section headers: rounded-corner pill labels with solid pastel fills
(mint #1de2c4, amber #f59e0b, blue #60a5fa) and bold text inside.

Diagrams: simple rounded rectangles connected by straight-line arrows.
Color-coded pastel background zones behind related concepts.
Dashed lines for secondary flows, solid for primary.

Typography: large bold title at top, clean sans-serif throughout.
Generous whitespace between sections.

Looks like a senior engineer made it in Figma — precise, readable,
information-dense but not cluttered.
```

---

## Style C: Hybrid Sketch + Infographic (Signature Style)

The fusion of exhibit-design whiteboard sketching with LinkedIn scannable structure. **This is the distinctive Strategnik style.**

```
LAYOUT:
Tall portrait format (3:5 or taller). Modular stacked horizontal bands,
each self-contained. Generous whitespace between sections. But WITHIN
each band, content is rendered as loose, confident ink sketches.

LINE QUALITY:
All diagrams drawn in confident black ink strokes with variable line
weight. Lines overshoot corners slightly — fast, intentional drawing.
Thick strokes for primary forms, thinner for connectors. Feels sketched
by hand, then dropped into a structured layout.

SECTION HEADERS:
Rounded-corner pill labels with solid pastel fills — mint (#1de2c4),
amber (#f59e0b), blue (#60a5fa), purple (#c084fc). Bold sans-serif
text inside. These are the ONLY "designed" elements — everything else
looks sketched. The contrast between clean headers and hand-drawn
content is the signature tension.

DIAGRAMS:
Hand-sketched rectangles connected by hand-drawn arrows. Corners don't
quite close, lines have natural variation. Dashed lines for secondary
flows. Pastel background zone washes (10-12% opacity) sit BEHIND the
sketched elements like colored sticky-note zones on a whiteboard.

HUMAN FIGURES:
Simplified architectural entourage figures — egg-shaped heads,
cylindrical torsos, 5-10 strokes per person. Show scale and
interaction, not anatomy. NOT stick figures.

ANNOTATIONS:
Handwritten ALL-CAPS labels with brackets — "[SIGNAL FIRES HERE]",
"AUTONOMOUS?". Coexist with the clean pill headers. Handwritten notes
feel like thinking-in-progress. Pill headers feel resolved.

COLOR:
- Background: white or light warm gray
- Pill headers: solid brand accent fills
- Zone washes: 10-15% opacity of section accent color
- Sketched content: black ink only, no color in line work
- Occasional accent highlight on key elements

THE SIGNATURE TENSION:
Two visual systems on the same page:
1. STRUCTURE — clean pills, pastel zones, modular bands (engineer brain)
2. THINKING — loose ink sketches, wireframe volumes, annotations (designer brain)

Structure makes it scannable. Sketches make it feel like someone's
actual working process, not a finished deliverable.
```

---

## Usage

### From nano-banana CLI:
```bash
nano-banana "Intelligence Layer 6-component framework diagram. [paste Style C block above]" -a 3:4 -s 2K -o intelligence-layer-sketch
```

### From generate_slide_images.py:
Append the style block to any slide prompt in the SLIDES dictionary.

### From any image model prompt:
Copy the relevant style block and append your content description after it.
