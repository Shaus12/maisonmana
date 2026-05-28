# Maison Mana

## Register
brand

## Product Purpose

Maison Mana is an ultra-high-end Israeli jewelry house specializing in engagement and bridal pieces. The website is the brand — it must feel like walking into a private salon on Place Vendôme, not browsing an e-commerce catalog. The site exists to (1) make couples feel they have found *the* atelier for the most important purchase of their life, (2) qualify serious inquiries into private appointments, and (3) showcase craft and provenance with the gravity it deserves.

This is not a shop. It is a maison. Pieces are not "added to cart" — they are inquired about, viewed by appointment, or commissioned bespoke.

## Users

**Primary: Engagement-stage couples (Israel + diaspora)**
- Age 28-45, household income top decile of Israel (or international clients sourcing from Israeli ateliers for value).
- Bride-to-be is design-literate, follows global luxury houses (Cartier, Graff, JAR), uses Instagram for inspiration but distrusts "Instagram jewelry."
- Partner is the buyer of record; intimidated by the category, wants reassurance and discretion, fears being upsold or embarrassed.
- They have already looked at Tiffany, Cartier, Harry Winston. They are at Maison Mana because someone whispered the name to them, or because Maison Mana's craft is visibly equal at a fraction of the markup.

**Secondary: Anniversary / milestone gifters**
- Returning customers commissioning tennis bracelets, solitaire pendants, eternity bands for anniversaries, birthdays, milestone moments.

## Strategic Principles

1. **The maison earns the inquiry, not the click.** No "Buy Now" buttons. CTAs are "Request a Viewing", "Book a Private Consultation", "Begin a Bespoke Commission". Prices are present but never the protagonist.
2. **Craft is the proof.** Show the diamond's certificate, the goldsmith's hand, the loupe, the bench. Process imagery beats lifestyle imagery.
3. **Hebrew first, native, never translated-feeling.** Typography, rhythm, idiom, and date/number formatting are Hebrew-native. RTL is the design substrate, not an afterthought layer.
4. **Discretion over excitement.** No countdown timers, no "27 people viewing", no exclamation marks. Silence and space communicate value.
5. **Two interactive moments earn their place.** The Atelier (bespoke configurator) and the Mirror (AR try-on) are the only interactive features because they replicate what happens in the salon. Everything else is editorial.

## Tone of Voice

- **Hebrew register:** literary, slightly archaic, never colloquial. Closer to *Haaretz* culture section than to Instagram caption. Uses ניקוד sparingly on key brand words for elegance.
- Sentences are short. Pauses do work that adjectives cannot.
- Numbers are spelled in Hebrew where natural ("שלושה גראם זהב צהוב" not "3g"), except for carat weights and certificate references.
- Never uses superlatives the brand has not earned ("הכי", "אלוף", "מנצח"). Avoid "יוקרתי" as an adjective the brand applies to itself — show, do not claim.

## Anti-references

Explicit do-not-look-like list:

- **Pandora, Magnolia, H. Stern (local), Padani:** mall jewelry visual language. Pink-leaning palettes, charm grids, sale stickers, "מבצע" banners, cluttered category pages, heart motifs.
- **Tiffany & Co.:** the robin's-egg blue, the very specific serif logotype, the white-box-with-ribbon visual.
- **Shein / fast-jewelry e-commerce:** aggressive discounting, urgency timers, low-trust testimonial widgets.
- **Generic AI-luxury template:** dark hero with gold gradient text, oversized centered serif headline over a black-and-white couple holding hands, "TIMELESS ELEGANCE" in letter-spaced caps. If it looks like a Wix template tagged "luxury," it is wrong.
- **First-order category reflex:** do not default to black-and-gold. Do not default to centered editorial serif. The second-order avoidance trap (black + sans-serif + ample whitespace) is also a cliché — see DESIGN.md for the chosen direction.

## Commercial Model

- No checkout. No prices on tile views.
- Each piece page shows price discreetly with "להזמנת צפייה פרטית" (Request a Private Viewing) as the primary CTA.
- Bespoke commissions and consultations are booked via the Atelier configurator → appointment form.
- Showroom in Tel Aviv (Ramat Gan Diamond Exchange district, by appointment only).
- WhatsApp is the dominant Israeli luxury concierge channel — surface it, but with a refined "התכתבות פרטית" entry point, not a green floating bubble.

## Key Features (this build)

1. **Editorial home & collection pages** — the maison itself.
2. **The Atelier (אטלייה):** bespoke jewelry configurator. Customer chooses setting (solitaire, three-stone, hidden halo, eternity, tennis), diamond shape & specs (cut, carat, color, clarity), metal (yellow gold / white gold / rose gold / platinum), and band style. Real-time visual preview. Output is a saved design that becomes a consultation request, not a cart.
3. **The Mirror (מראה):** AR try-on. Customer uploads a photo of themselves (or uses live camera) and sees pieces placed on hand, neck, ear, wrist. Privacy-first — photos are processed in-browser, never uploaded.

## Out of Scope (v1)

- E-commerce checkout, payments, shipping flow.
- User accounts beyond a saved-design token.
- Blog / journal (planned for v2).
- Multi-language beyond Hebrew (English v2).
