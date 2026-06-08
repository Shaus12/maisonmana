// Maison Mana — full catalog types.

export type DiamondShape =
  | "round"
  | "oval"
  | "cushion"
  | "princess"
  | "emerald"
  | "pear"
  | "marquise"
  | "radiant"
  | "asscher"
  | "heart";

export type DiamondColor =
  | "colorless"   // D–F
  | "near-colorless" // G–H
  | "yellow"
  | "pink"
  | "blue"
  | "green"
  | "black"
  | "brown"
  | "red";

export type Metal = "yellow-gold" | "white-gold" | "rose-gold" | "platinum";

export type Setting =
  | "solitaire"
  | "three-stone"
  | "hidden-halo"
  | "pave"
  | "bezel"
  | "eternity"
  | "tennis"
  | "hoop"
  | "stud"
  | "pendant";

export type CollectionCategory =
  | "bridal"
  | "diamond"
  | "signature"
  | "high-jewelry"
  | "mens"
  | "womens"
  | "bespoke"
  | "investment";

// Legacy — kept for backward compatibility with PIECES array
export type Collection =
  | "engagement"
  | "tennis-bracelets"
  | "solitaire-necklaces"
  | "diamond-earrings"
  | "wedding-bands";

export type Piece = {
  slug: string;
  nameHe: string;
  nameLat: string;
  collection: Collection;
  setting: Setting;
  shape: DiamondShape;
  metal: Metal;
  carat: number;
  color: "D" | "E" | "F" | "G" | "H";
  clarity: "FL" | "IF" | "VVS1" | "VVS2" | "VS1" | "VS2";
  certificate: { lab: "GIA" | "IGI" | "HRD"; id: string };
  priceILS: number;
  reference: string;
  narrativeHe: string;
  narrativeEn: string;
  images: string[];
};

// ── Fixture pieces ────────────────────────────────────────────
export const PIECES: Piece[] = [
  {
    slug: "anna-solitaire",
    nameHe: "אנה",
    nameLat: "The Anna",
    collection: "engagement",
    setting: "solitaire",
    shape: "round",
    metal: "platinum",
    carat: 2.02,
    color: "E",
    clarity: "VVS1",
    certificate: { lab: "GIA", id: "7411882950" },
    priceILS: 148_000,
    reference: "MM-E-001",
    narrativeHe: "סוליטר עגול שתי קראט על להקה דקה מפלטינה. הטבעת שאליה חוזרים.",
    narrativeEn: "A round two-carat solitaire on a fine platinum band. The ring you return to.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    slug: "tennis-classique",
    nameHe: "טניס קלאסיק",
    nameLat: "Tennis Classique",
    collection: "tennis-bracelets",
    setting: "tennis",
    shape: "round",
    metal: "white-gold",
    carat: 10.08,
    color: "F",
    clarity: "VS1",
    certificate: { lab: "IGI", id: "LG45382910" },
    priceILS: 210_000,
    reference: "MM-B-001",
    narrativeHe: "שבעים ושתיים אבנים ביד אחת של אומן.",
    narrativeEn: "Seventy-two stones set by a single craftsman's hand.",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=85",
    ],
  },
  {
    slug: "adria-tear",
    nameHe: "אדריה",
    nameLat: "The Adria",
    collection: "solitaire-necklaces",
    setting: "pendant",
    shape: "pear",
    metal: "white-gold",
    carat: 1.54,
    color: "D",
    clarity: "IF",
    certificate: { lab: "GIA", id: "5201774021" },
    priceILS: 132_000,
    reference: "MM-N-001",
    narrativeHe: "יהלום אגס תלוי על שלוש מצולות.",
    narrativeEn: "A pear diamond suspended on three claws.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85",
    ],
  },
];

export function pieceBySlug(slug: string): Piece | undefined {
  return PIECES.find((p) => p.slug === slug);
}
