// Configuration source-of-truth for The Studio configurator.

import type { DiamondShape, Metal, Setting } from "./pieces";

// ── Option types ──────────────────────────────────────────────

export type SettingOption = {
  id: Extract<Setting, "solitaire" | "three-stone" | "hidden-halo" | "pave" | "bezel">;
  he: string;
  en: string;
  description: string;
  descriptionEn: string;
};

export type ShapeOption = {
  id: DiamondShape;
  he: string;
  en: string;
  description: string;
  descriptionEn: string;
};

export type FancyColorOption = {
  id: "colorless" | "yellow" | "pink" | "blue" | "green" | "black" | "brown" | "red";
  en: string;
  he: string;
  hex: string;          // approximate visual swatch
  transmission: number; // 0 = opaque, 1 = fully transparent
};

export type MetalOption = {
  id: Metal;
  he: string;
  en: string;
  swatch: string;
  ring: string;
  glow: string;
};

export type BandOption = {
  id: "classic" | "knife-edge" | "twisted" | "pave-band" | "split-shank" | "bypass" | "twisted-pave" | "infinity" | "braided" | "milgrain" | "tapered" | "reverse-tapered" | "chevron" | "vine" | "double-band" | "euro-shank" | "channel-set" | "scalloped-pave" | "beaded" | "vintage-scroll" | "concave" | "convex" | "rope" | "hammered";
  he: string;
  en: string;
  description: string;
  descriptionEn: string;
};

export type CaratOption  = { value: number; label: string };
export type CertOption   = { id: "GIA" | "IGI" | "HRD"; description: string; descriptionHe: string };

// ── Settings ──────────────────────────────────────────────────

export const SETTING_OPTIONS: SettingOption[] = [
  { id: "solitaire",    he: "סוליטר",        en: "Solitaire",    description: "אבן אחת. השתיקה היא העיצוב.",                                   descriptionEn: "One stone. The silence is the design." },
  { id: "three-stone",  he: "שלוש אבנים",    en: "Three Stone",  description: "אבן מרכזית עם שתי לוויינות, סימטריה קלה.",                     descriptionEn: "A centre stone flanked by two satellites." },
  { id: "hidden-halo",  he: "הילה נסתרת",    en: "Hidden Halo",  description: "טבעת יהלומים מתחת לכותרת, נראית רק מהצד.",                    descriptionEn: "A diamond pavé ring beneath the crown — visible only from the side." },
  { id: "pave",         he: "פאווה",          en: "Pavé",         description: "להקה זרועה יהלומים, אור רציף סביב האצבע.",                     descriptionEn: "Diamonds set across the band — continuous light." },
  { id: "bezel",        he: "בזל",            en: "Bezel",        description: "מסגרת מתכת מלאה סביב האבן, קו נקי וצנוע.",                     descriptionEn: "A full metal frame around the stone — clean and understated." },
];

// ── Shapes ────────────────────────────────────────────────────

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: "round",    he: "עגול",    en: "Round",    description: "החיתוך הקלאסי. אור מקסימלי.",               descriptionEn: "The classic cut. Maximum light return." },
  { id: "oval",     he: "אובל",    en: "Oval",     description: "עגול מאורך. נראה גדול יותר ממשקלו.",        descriptionEn: "Elongated round. Appears larger than its carat weight." },
  { id: "cushion",  he: "כרית",    en: "Cushion",  description: "ריבועי עם פינות עגולות. רומנטי ורך.",       descriptionEn: "Square with soft rounded corners. Romantic and warm." },
  { id: "princess", he: "פרינצס",  en: "Princess", description: "מרובע חד, ברק מלא.",                        descriptionEn: "Sharp square cut. Full brilliance." },
  { id: "emerald",  he: "אמרלד",   en: "Emerald",  description: "מלבני קר, מדרגות פנים.",                    descriptionEn: "Cool rectangle, stepped facets — clarity over sparkle." },
  { id: "pear",     he: "טיפה",    en: "Pear",     description: "טיפה אחת. שואלת שאלה.",                    descriptionEn: "One teardrop. It asks a question." },
  { id: "marquise", he: "מרקיזה",  en: "Marquise", description: "חרב דקה. נוכחת, לא צועקת.",                descriptionEn: "A slender blade. Present, not loud." },
  { id: "radiant",  he: "רדיאנט",  en: "Radiant",  description: "מלבני עם חיתוך מבריק — הרבה ניצוצות.",     descriptionEn: "Rectangular with brilliant facets — many sparks." },
  { id: "asscher",  he: "אשר",     en: "Asscher",  description: "מדרגות ריבועיות. עמוק ומהפנט.",             descriptionEn: "Square step-cut. Deep and mesmerising." },
  { id: "heart",    he: "לב",      en: "Heart",    description: "הצורה שמדברת בלי מילים.",                   descriptionEn: "The shape that speaks without words." },
];

// ── Fancy / fancy-colour diamonds ─────────────────────────────

export const FANCY_COLOR_OPTIONS: FancyColorOption[] = [
  { id: "colorless", en: "Colourless (D–F)",    he: "חסר צבע (D–F)",    hex: "#F8F8FF", transmission: 1.0 },
  { id: "yellow",    en: "Fancy Yellow",         he: "צהוב פנסי",         hex: "#FFD700", transmission: 0.85 },
  { id: "pink",      en: "Fancy Pink",           he: "ורוד פנסי",         hex: "#FF91A4", transmission: 0.80 },
  { id: "blue",      en: "Fancy Blue",           he: "כחול פנסי",         hex: "#4A90D9", transmission: 0.80 },
  { id: "green",     en: "Fancy Green",          he: "ירוק פנסי",         hex: "#50C878", transmission: 0.80 },
  { id: "black",     en: "Black Diamond",        he: "יהלום שחור",        hex: "#1A1A1A", transmission: 0.05 },
  { id: "brown",     en: "Brown / Champagne",    he: "חום / שמפניה",      hex: "#C8A96E", transmission: 0.75 },
  { id: "red",       en: "Fancy Red (rare)",     he: "אדום פנסי (נדיר)",  hex: "#C41E3A", transmission: 0.70 },
];

// ── Metals ────────────────────────────────────────────────────

export const METAL_OPTIONS: MetalOption[] = [
  { id: "yellow-gold", he: "זהב צהוב", en: "Yellow Gold", swatch: "oklch(0.84 0.130 85)",  ring: "oklch(0.78 0.130 82)",  glow: "oklch(0.92 0.090 90)" },
  { id: "white-gold",  he: "זהב לבן",  en: "White Gold",  swatch: "oklch(0.91 0.005 240)", ring: "oklch(0.86 0.008 240)", glow: "oklch(0.98 0.005 240)" },
  { id: "rose-gold",   he: "זהב ורוד", en: "Rose Gold",   swatch: "oklch(0.82 0.080 35)",  ring: "oklch(0.76 0.085 35)",  glow: "oklch(0.90 0.060 40)" },
  { id: "platinum",    he: "פלטינה",   en: "Platinum",    swatch: "oklch(0.88 0.005 250)", ring: "oklch(0.82 0.006 250)", glow: "oklch(0.95 0.004 250)" },
];

// ── Bands ─────────────────────────────────────────────────────

export const BAND_OPTIONS: BandOption[] = [
  { id: "classic",         he: "קלאסית",           en: "Classic",          description: "להקה עגולה, חלקה, דו-מ\"מ.",                    descriptionEn: "Round, smooth 2mm band." },
  { id: "knife-edge",      he: "סכין",             en: "Knife Edge",       description: "קו מרכזי מחודד, ברק חד מהצד.",                   descriptionEn: "Sharp central ridge — crisp light from the side." },
  { id: "twisted",         he: "מסולסלת",          en: "Twisted",          description: "שני חוטים זהב שזורים בעדינות.",                   descriptionEn: "Two gold threads gently intertwined." },
  { id: "pave-band",       he: "פאווה",            en: "Pavé Band",        description: "יהלומי מיקרו לאורך כל המעטפת.",                   descriptionEn: "Micro diamonds along the full band." },
  { id: "split-shank",     he: "זרוע מפוצלת",      en: "Split Shank",      description: "הלהקה מתפצלת לקראת היהלום.",                     descriptionEn: "The band splits as it approaches the stone." },
  { id: "bypass",          he: "עוטפת",            en: "Bypass",           description: "זרועות חופפות שעוטפות את המרכז.",                  descriptionEn: "Overlapping shanks that wrap the centre." },
  { id: "twisted-pave",    he: "מסולסלת פאווה",    en: "Twisted Pavé",     description: "חוטי זהב שזורים עם יהלומים זעירים.",               descriptionEn: "Twisted gold threads set with tiny diamonds." },
  { id: "infinity",        he: "אינסוף",           en: "Infinity",         description: "לולאות זהב המשתלבות ללא קצה.",                    descriptionEn: "Interlocking gold loops without end." },
  { id: "braided",         he: "צמה",              en: "Braided",          description: "קליעת זהב צפופה ומורכבת.",                        descriptionEn: "Dense, intricate gold braid." },
  { id: "milgrain",        he: "מילגריין",         en: "Milgrain",         description: "שוליים מעוטרים בכדוריות זהב זעירות.",              descriptionEn: "Edges decorated with tiny gold beading." },
  { id: "tapered",         he: "הולכת וצרה",       en: "Tapered",          description: "הלהקה הופכת צרה יותר ליד היהלום.",                 descriptionEn: "Band narrows toward the stone." },
  { id: "reverse-tapered", he: "הולכת ומתרחבת",    en: "Reverse Tapered",  description: "הלהקה מתרחבת לקראת המרכז.",                       descriptionEn: "Band widens toward the centre stone." },
  { id: "chevron",         he: "שברון",            en: "Chevron",          description: "זווית עדינה שמוסיפה חדות.",                       descriptionEn: "A subtle V-angle that adds definition." },
  { id: "vine",            he: "מטפסת",            en: "Vine",             description: "עיצוב טבעי המזכיר ענפים ועלים.",                   descriptionEn: "Organic design evoking branches and leaves." },
  { id: "double-band",     he: "להקה כפולה",       en: "Double Band",      description: "שתי טבעות זהב מקבילות.",                          descriptionEn: "Two parallel gold bands." },
  { id: "euro-shank",      he: "בסיס אירופאי",     en: "Euro Shank",       description: "תחתית שטוחה למניעת סיבוב הטבעת.",                 descriptionEn: "Flat underside — prevents the ring from rotating." },
  { id: "channel-set",     he: "שיבוץ מסילה",      en: "Channel Set",      description: "יהלומים נחים בתעלה שקועה.",                       descriptionEn: "Diamonds set flush in a recessed channel." },
  { id: "scalloped-pave",  he: "פאווה מסולסל",     en: "Scalloped Pavé",   description: "שוליים גליים עם שיבוץ עשיר.",                     descriptionEn: "Scalloped edges with rich pavé setting." },
  { id: "beaded",          he: "פנינים",           en: "Beaded",           description: "להקה עשויה כדוריות זהב רציפות.",                   descriptionEn: "Band of continuous gold spheres." },
  { id: "vintage-scroll",  he: "וינטג'",           en: "Vintage Scroll",   description: "פיתוחים עתיקים ומלאי אופי.",                      descriptionEn: "Antique scroll engravings full of character." },
  { id: "concave",         he: "קעורה",            en: "Concave",          description: "שקע מתון לאורך הלהקה.",                           descriptionEn: "Gently inward-curved profile." },
  { id: "convex",          he: "קמורה",            en: "Convex",           description: "מראה מלא ובולט במיוחד.",                          descriptionEn: "Full, domed profile." },
  { id: "rope",            he: "חבל",              en: "Rope",             description: "טקסטורה מסובבת חזקה ובולטת.",                     descriptionEn: "Strong, prominent twisted-rope texture." },
  { id: "hammered",        he: "מרוקעת",           en: "Hammered",         description: "טקסטורה אורגנית הנעשית בהקשות פטיש.",              descriptionEn: "Organic texture from individual hammer strikes." },
];

// ── Jewelry Types ─────────────────────────────────────────────

export type JewelryType = "ring" | "necklace" | "bracelet" | "earring";
export type JewelryTypeOption = { id: JewelryType; he: string; en: string };
export const JEWELRY_TYPE_OPTIONS: JewelryTypeOption[] = [
  { id: "ring", he: "טבעת", en: "Ring" },
  { id: "necklace", he: "שרשרת", en: "Necklace" },
  { id: "bracelet", he: "צמיד", en: "Bracelet" },
  { id: "earring", he: "עגילים", en: "Earrings" },
];

// ── Carat options (extended) ──────────────────────────────────

export const CARAT_OPTIONS: CaratOption[] = [
  { value: 0.50, label: "0.50" },
  { value: 0.75, label: "0.75" },
  { value: 1.00, label: "1.00" },
  { value: 1.50, label: "1.50" },
  { value: 2.00, label: "2.00" },
  { value: 3.00, label: "3.00+" },
];

// ── Color grades (white diamonds) ────────────────────────────

export const COLOR_OPTIONS = [
  { value: "D" as const, he: "D — חסר צבע",      en: "D — Colourless" },
  { value: "E" as const, he: "E — חסר צבע",      en: "E — Colourless" },
  { value: "F" as const, he: "F — חסר צבע",      en: "F — Colourless" },
  { value: "G" as const, he: "G — כמעט חסר צבע", en: "G — Near Colourless" },
  { value: "H" as const, he: "H — כמעט חסר צבע", en: "H — Near Colourless" },
];

// ── Clarity grades (extended) ─────────────────────────────────

export const CLARITY_OPTIONS = [
  { value: "FL"   as const, he: "FL — ללא רבב",        en: "FL — Flawless" },
  { value: "IF"   as const, he: "IF — ללא רבב פנימי",  en: "IF — Internally Flawless" },
  { value: "VVS1" as const, he: "VVS1",                en: "VVS1" },
  { value: "VVS2" as const, he: "VVS2",                en: "VVS2" },
  { value: "VS1"  as const, he: "VS1",                 en: "VS1" },
  { value: "VS2"  as const, he: "VS2",                 en: "VS2" },
  { value: "SI1"  as const, he: "SI1",                 en: "SI1" },
  { value: "SI2"  as const, he: "SI2",                 en: "SI2" },
  { value: "I1"   as const, he: "I1",                  en: "I1" },
  { value: "I2"   as const, he: "I2",                  en: "I2" },
];

// ── Certificates ──────────────────────────────────────────────

export const CERT_OPTIONS: CertOption[] = [
  { id: "GIA", description: "Gemological Institute of America — the world standard.",         descriptionHe: "המכון הגמולוגי של אמריקה — התקן העולמי." },
  { id: "IGI", description: "International Gemological Institute — widely recognised.",        descriptionHe: "המכון הגמולוגי הבינלאומי — מוכר בינלאומית." },
  { id: "HRD", description: "Hoge Raad voor Diamant — the Antwerp diamond standard.",          descriptionHe: "הועד הגבוה ליהלומים — תקן האנטוורפן." },
];

// ── Price estimate ────────────────────────────────────────────

export function estimatePriceILS(opts: {
  jewelryType: JewelryType;
  origin: "natural" | "lab-grown";
  carat: number;
  color: FancyColorOption["id"];
  clarity: typeof CLARITY_OPTIONS[number]["value"];
  metal: Metal;
  setting?: SettingOption["id"] | "hoop" | "stud";
  band?: BandOption["id"];
}): number {
  const basePerCarat = opts.origin === "lab-grown" ? 4500 : 32000;
  
  const colorMul = {
    colorless: 1.15,
    yellow: 1.0,
    pink: 2.1,
    blue: 2.4,
    green: 2.2,
    black: 0.7,
    brown: 0.8,
    red: 6.5,
  }[opts.color] ?? 1.0;

  const clarityMul = {
    FL: 1.40,
    IF: 1.30,
    VVS1: 1.20,
    VVS2: 1.12,
    VS1: 1.04,
    VS2: 0.96,
    SI1: 0.88,
    SI2: 0.80,
    I1: 0.72,
    I2: 0.64
  }[opts.clarity] ?? 1.0;

  const caratPrem = Math.pow(opts.carat, 1.32);

  let basePrice = 0;
  if (opts.jewelryType === "ring") {
    const settingAdd = {
      solitaire: 6500,
      "three-stone": 14000,
      "hidden-halo": 11500,
      pave: 13000,
      bezel: 7500
    }[opts.setting as SettingOption["id"]] ?? 6500;
    const bandAdd = {
      classic: 0, "knife-edge": 1200, twisted: 2400, "pave-band": 8500,
      "split-shank": 1500, bypass: 1800, "twisted-pave": 9500, infinity: 3200,
      braided: 2800, milgrain: 2000, tapered: 500, "reverse-tapered": 500,
      chevron: 1200, vine: 3800, "double-band": 3000, "euro-shank": 800,
      "channel-set": 6500, "scalloped-pave": 9000, beaded: 1500, "vintage-scroll": 4000,
      concave: 900, convex: 1100, rope: 2100, hammered: 1000
    }[opts.band as BandOption["id"]] ?? 0;
    const metalAdd = { "yellow-gold": 3500, "white-gold": 3700, "rose-gold": 3600, platinum: 7500 }[opts.metal] ?? 0;
    basePrice = basePerCarat * colorMul * clarityMul * caratPrem + settingAdd + bandAdd + metalAdd;
  } else if (opts.jewelryType === "necklace") {
    const chainCost = { "yellow-gold": 5000, "white-gold": 5200, "rose-gold": 5100, platinum: 9500 }[opts.metal] ?? 0;
    basePrice = basePerCarat * colorMul * clarityMul * caratPrem + chainCost + 4000;
  } else if (opts.jewelryType === "bracelet") {
    const totalCarat = opts.carat * 3.5;
    const totalCaratPrem = Math.pow(totalCarat, 1.15);
    const metalCost = { "yellow-gold": 12000, "white-gold": 12500, "rose-gold": 12200, platinum: 22000 }[opts.metal] ?? 0;
    basePrice = (basePerCarat * 0.75) * colorMul * clarityMul * totalCaratPrem + metalCost + 15000;
  } else if (opts.jewelryType === "earring") {
    const settingAdd = opts.setting === "hoop" ? 9500 : 4500;
    const metalCost = { "yellow-gold": 4000, "white-gold": 4200, "rose-gold": 4100, platinum: 8000 }[opts.metal] ?? 0;
    basePrice = (basePerCarat * colorMul * clarityMul * caratPrem) * 2 + settingAdd + metalCost;
  }

  return Math.round(basePrice / 500) * 500;
}
