# Design System: Maison Mana (Stitch High-End Vibe)

## 1. Visual Theme & Atmosphere
A restrained, gallery-airy interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is clinical yet warm — like a well-lit architecture studio or a quiet goldsmith’s bench. It rejects the "E-commerce" template (no 3-column equal grids, no huge centered text blocks over dark images) in favor of editorial framing.
- **Density**: 4 (Airy, intentional negative space)
- **Variance**: 8 (Offset Asymmetric, dynamic text scaling, inline images)
- **Motion**: 7 (Fluid CSS, spring physics for micro-interactions)

## 2. Color Palette & Roles
- **Canvas White** (`#FAF9F6`) — Primary background surface (warm bone tint, not pure white).
- **Pure Surface** (`#FFFFFF`) — Card and vellum panel fill.
- **Charcoal Ink** (`#18181B`) — Primary text, Zinc-950 depth. No pure black.
- **Muted Steel** (`#71717A`) — Secondary text, descriptions, metadata.
- **Whisper Border** (`rgba(226, 232, 240, 0.4)`) — Card borders, 1px structural hairlines.
- **Brass Accent** (`#CAB890`) — Single accent for CTAs and focus rings. Warm, desaturated gold.

*(No neon colors, no purple glow, no pure black `#000000`)*

## 3. Typography Rules
Hebrew-first, but paired elegantly with Latin fonts.
- **Display**: *Instrument Serif* (Latin) / *Frank Ruhl Libre* (Hebrew). Track-tight, controlled scale, weight-driven hierarchy. Used for huge asymmetric hero headlines.
- **Body**: *Outfit* (Latin) / *Heebo* (Hebrew). Relaxed leading, 65ch max-width, neutral secondary color.
- **Banned**: Inter, Poppins, Roboto, Times New Roman. 

## 4. Component Stylings
* **Buttons**: Flat, no outer glow. Tactile `-1px` translate and `scale(0.98)` on active state. Solid Charcoal Ink fill for primary, Brass outline for secondary.
* **Cards**: Generously rounded corners (`1.5rem`). No heavy drop shadows — only a diffused whisper shadow `0 4px 24px rgba(0,0,0,0.03)` or just a `Whisper Border`. 
* **Images**: Soft edges. Inline images inside typography are fully pill-shaped (`rounded-full`).
* **Inputs**: Label above, clean border, focus ring in Brass.

## 5. Layout Principles
- **Grid-first responsive architecture**. Asymmetric splits for Hero sections.
- **Inline Image Typography**: Small images embedded directly within `h1` titles to break the text and create visual poetry.
- **No overlapping elements** — every element occupies its own clear spatial zone.
- **Strict single-column collapse** below `768px`.
- **Max-width containment**: `1440px`.
- **No 3-column equal cards**: Use zig-zag or asymmetric bento grids for collections.

## 6. Motion & Interaction
- **Spring Physics default**: `stiffness: 100, damping: 20` via CSS or framer-motion concepts.
- **Staggered cascade reveals**: Items don't fade in together; they cascade (`delay: 0.1s, 0.2s, etc.`).
- **Hardware-accelerated**: Animate exclusively via `transform` and `opacity`.

## 7. Anti-Patterns (Banned)
- NO emojis.
- NO pure black (`#000000`).
- NO 3-column equal grids for product displays.
- NO generic centered text over full-screen darkened images.
- NO AI copywriting clichés ("Elevate", "Seamless", "Unleash").
- NO filler UI text ("Scroll to explore", bouncing arrows).
- NO drop shadows that look like floating boxes.
