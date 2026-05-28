# Maison Mana — Design System

## Scene Sentence

A bride-to-be, 34, opens this site at 11pm on her phone in bed, after a Cartier appointment in Tel Aviv that left her feeling like a transaction. She wants to feel like the next morning she could walk into a quiet room above a goldsmith's bench in Ramat Gan, be offered tea, and be shown three rings — only three — that were chosen because someone listened.

That scene forces: light theme (not the obvious luxury-dark cliché), generous silence, the tactile presence of paper and gold, no urgency, no spectacle.

## Color Strategy

**Restrained, warmed.** A tinted neutral substrate carries 85%+ of every surface. One brass-gold accent does ceremonial work only (active states, certificate seals, the diamond crosshair in the configurator). Ink black is used for the masthead lockup and serif display. Nothing else fights for attention.

### Tokens (OKLCH)

```
--paper:        oklch(0.985 0.004 75)   /* the page. warm bone, not white */
--paper-deep:   oklch(0.965 0.006 75)   /* alt sections */
--vellum:       oklch(0.93  0.008 70)   /* card / panel / certificate */
--rule:         oklch(0.86  0.010 70)   /* hairlines */

--ink:          oklch(0.18  0.012 60)   /* primary text, masthead. never #000 */
--ink-soft:     oklch(0.36  0.010 60)   /* secondary text */
--ink-mute:     oklch(0.55  0.008 65)   /* metadata, captions */

--brass:        oklch(0.74  0.110 78)   /* the singular accent. warm gold */
--brass-deep:   oklch(0.58  0.115 65)   /* hover / pressed states */
--brass-leaf:   oklch(0.88  0.060 82)   /* whisper-gold backgrounds, rare */

--diamond:      oklch(0.97  0.005 220)  /* faint cool wash for the configurator stage */
--velvet:       oklch(0.22  0.025 280)  /* deep aubergine — used ONCE, on the Atelier interior */
```

No pure black. No pure white. Every neutral is tinted toward warm bone (hue 60-78). The single cool token (`--diamond`) exists only inside the configurator's stage area where the diamond is rendered.

## Typography

Hebrew-first pairing. The display face must have a real Hebrew cut — not a Latin font with Hebrew fallback.

- **Display (Hebrew + Latin):** *Frank Ruhl Libre* — the most refined contemporary Hebrew serif, with a Latin counterpart that does not feel like a stranger. Used for headlines, piece names, the masthead.
- **Body (Hebrew + Latin):** *Heebo* at 380 weight for body — neutral, calm, designed for screen Hebrew. Loaded weights: 300, 380, 500.
- **Accent / numerals:** *Cormorant Garamond* italic for Latin numerals on certificates and carat callouts only. Never for Hebrew.

### Scale (1.333 ratio, slightly compressed at the top to keep editorial calm)

```
--type-xs:    0.75rem    /* 12px — metadata */
--type-sm:    0.875rem   /* 14px — captions */
--type-base:  1.0625rem  /* 17px — body. larger than default; this is a magazine */
--type-lg:    1.375rem   /* 22px — lead paragraph */
--type-xl:    1.875rem   /* 30px — section titles */
--type-2xl:   2.75rem    /* 44px — page titles */
--type-3xl:   4.25rem    /* 68px — hero */
--type-4xl:   6.5rem     /* 104px — masthead-scale display only */
```

Body line length 62-68 characters (Hebrew counts characters not words; 60-68ch is the comfortable range). Line-height 1.65 for body, 1.05 for hero display.

## Rhythm & Spacing

```
--space-1:  0.25rem    /* hairline gaps */
--space-2:  0.5rem
--space-3:  0.75rem
--space-4:  1rem
--space-6:  1.5rem
--space-8:  2rem
--space-12: 3rem
--space-16: 4rem
--space-24: 6rem
--space-32: 8rem
--space-40: 10rem       /* between editorial sections */
--space-56: 14rem       /* hero clearances */
```

Vary deliberately. Section padding is asymmetric — never `py-24` everywhere. The maison breathes.

## Elevation

No drop shadows. Elevation is communicated through **paper layering** — a panel sits on the page via a 1px `--rule` hairline and a tonal step from `--paper` to `--vellum`. Cards may use a single hair-shadow `0 1px 0 oklch(0.86 0.01 70 / 0.6)` to suggest a leaf of paper laid on another. Nothing floats.

## Motion

- All transitions ease-out-quart `cubic-bezier(0.25, 1, 0.5, 1)` or ease-out-expo `cubic-bezier(0.19, 1, 0.22, 1)`.
- Default duration 520ms for entrances, 280ms for state changes. Slower than typical web — this is the pace of a salon.
- Hero imagery and configurator transitions use exposed timing (visible ease-out, ~900ms).
- No bounce, no spring overshoot, no parallax (parallax is a cliché the maison rejects).
- Hover states on jewelry tiles: a slow tonal lift of the surrounding vellum, and the piece itself does not move. The room reacts to the piece, not the inverse.

## RTL & Hebrew Specifics

- `dir="rtl"` on `<html>`. The grammar of the layout is right-to-left: navigation reads right-to-left, breadcrumbs flow right-to-left, the diamond-shape selector reads right-to-left.
- Latin runs (carat weights, certificate IDs) inside Hebrew sentences use `<bdi dir="ltr">` with `unicode-bidi: isolate`.
- Hebrew typography never letter-spaces (no `tracking` on Hebrew; tracking destroys Hebrew rhythm). Latin display headers may have `-0.01em` tracking.
- Numerals in body copy use Hebrew-formatted thousands separators (`50,000 ש"ח` not `₪50,000` — the shekel symbol goes after, separated by a thin space).
- Asymmetric layouts respect RTL: the optical heavy side is the right side. Hero text aligns right; hero image bleeds left.

## Components — register: BRAND

These are the named components. Implement only as needed for the routes built.

- **Masthead** — wordmark `Maison Mana` in display serif, with `ATELIER · TEL AVIV` micro-caps below in `--ink-mute`. Reserved 96-128px vertical breathing room.
- **Maison Nav** — text-only navigation in `--type-sm` body weight 380, generously spaced. No icons. Underline-on-hover with a hairline that draws ease-out-quart from inside.
- **Piece Tile** — vellum panel, 4:5 aspect image, Hebrew piece name in serif, discreet `קטלוג №` reference number in `--ink-mute`. Never shows price on the tile. Hover: hairline ring in `--brass`.
- **Editorial Block** — long-form Hebrew body with optional pull quote and inline plate (centered image with a serif caption below and a hairline above).
- **Atelier Stage** — large central canvas with a deep `--velvet` interior backdrop and a single overhead spotlight gradient. Choice panels arrange around it in vellum strips with letter-form labels (א, ב, ג, ד for the four configuration steps).
- **Mirror Frame** — full-bleed AR viewport with corner brackets (not a closed border — open corner ticks in `--brass` indicating capture area). Privacy notice as a hairline-bordered footer strip.
- **Inquiry Sheet** — replaces the standard "form on a page." Looks like a piece of vellum stationery with the maison's monogram embossed (CSS-only, subtle), fields are baseline-ruled, send button is a small brass disc with the verb "לשליחה" in serif.

## Imagery Rules

- Product photography on warm bone or deep velvet backgrounds. Never pure white seamless.
- Process imagery (hands, loupes, benches, certificates) is allowed and encouraged as editorial breaks.
- No couple-holding-hands stock. No "diamond on a finger pointing at sunset." No "diversity smile on a beach."
- Aspect ratios are deliberate: 4:5 for tiles, 3:2 for editorial plates, 16:9 only for the home cinematic still.

## Absolute "Do Nots"

In addition to the skill's universal bans:

- No gold gradient anywhere. The brass accent is solid, single-color. Gradients on luxury sites scream template.
- No countdown timers, no urgency badges, no "12 watching" widgets.
- No customer-review carousel with star ratings on the home page. Reviews live, if at all, on a dedicated section as long-form prose.
- No "TIMELESS" "ETERNAL" "FOREVER" caps headlines. These are the SaaS-cream of luxury.
- No video autoplay with sound. Cinematic still imagery beats motion video for this register.
- No dark mode toggle. The light maison is the brand.
