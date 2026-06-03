// Configuration source-of-truth for The Atelier configurator.

import type { DiamondShape, Metal, Setting } from "./pieces";

export type SettingOption = {
  id: Extract<Setting, "solitaire" | "three-stone" | "hidden-halo" | "pave" | "bezel">;
  he: string;
  description: string;
};

export type ShapeOption = {
  id: DiamondShape;
  he: string;
  description: string;
};

export type MetalOption = {
  id: Metal;
  he: string;
  swatch: string; // OKLCH
  ring: string;   // OKLCH for SVG band fill
  glow: string;   // OKLCH for inner edge highlight
};

export type BandOption = {
  id: "classic" | "knife-edge" | "twisted" | "pave-band" | "split-shank" | "bypass" | "twisted-pave" | "infinity" | "braided" | "milgrain" | "tapered" | "reverse-tapered" | "chevron" | "vine" | "double-band" | "euro-shank" | "channel-set" | "scalloped-pave" | "beaded" | "vintage-scroll" | "concave" | "convex" | "rope" | "hammered";
  he: string;
  description: string;
};

export type CaratOption = {
  value: number;
  label: string;
};

export const SETTING_OPTIONS: SettingOption[] = [
  {
    id: "solitaire",
    he: "סוליטר",
    description: "אבן אחת. השתיקה היא העיצוב.",
  },
  {
    id: "three-stone",
    he: "שלוש אבנים",
    description: "אבן מרכזית עם שתי לוויינות, סימטריה קלה.",
  },
  {
    id: "hidden-halo",
    he: "הילה נסתרת",
    description: "טבעת יהלומים מתחת לכותרת, נראית רק מהצד.",
  },
  {
    id: "pave",
    he: "פאווה",
    description: "להקה זרועה יהלומים, אור רציף סביב האצבע.",
  },
  {
    id: "bezel",
    he: "בזל",
    description: "מסגרת מתכת מלאה סביב האבן, קו נקי וצנוע.",
  },
];

export const SHAPE_OPTIONS: ShapeOption[] = [
  { id: "round",    he: "יהלום עגול",    description: "החיתוך הקלאסי. אור מקסימלי." },
  { id: "pear",     he: "יהלום טיפה",    description: "טיפה אחת. שואלת שאלה." },
  { id: "marquise", he: "יהלום מרקיזה",  description: "חרב דקה. נוכחת, לא צועקת." },
  { id: "princess", he: "יהלום פרינצס",  description: "מרובע חד, ברק מלא." },
  { id: "heart",    he: "יהלום לב",      description: "הצורה שמדברת בלי מילים." },
  { id: "emerald",  he: "יהלום אמרלד",   description: "מלבני קר, מדרגות פנים." },
];

export const METAL_OPTIONS: MetalOption[] = [
  {
    id: "yellow-gold",
    he: "זהב צהוב",
    swatch: "oklch(0.84 0.130 85)",
    ring: "oklch(0.78 0.130 82)",
    glow: "oklch(0.92 0.090 90)",
  },
  {
    id: "white-gold",
    he: "זהב לבן",
    swatch: "oklch(0.91 0.005 240)",
    ring: "oklch(0.86 0.008 240)",
    glow: "oklch(0.98 0.005 240)",
  },
  {
    id: "rose-gold",
    he: "זהב ורוד",
    swatch: "oklch(0.82 0.080 35)",
    ring: "oklch(0.76 0.085 35)",
    glow: "oklch(0.90 0.060 40)",
  },
  {
    id: "platinum",
    he: "פלטינה",
    swatch: "oklch(0.88 0.005 250)",
    ring: "oklch(0.82 0.006 250)",
    glow: "oklch(0.95 0.004 250)",
  },
];

export const BAND_OPTIONS: BandOption[] = [
  { id: "classic",     he: "קלאסית",       description: "להקה עגולה, חלקה, דו-מ\"מ." },
  { id: "knife-edge",  he: "סכין",         description: "קו מרכזי מחודד, ברק חד מהצד." },
  { id: "twisted",     he: "מסולסלת",     description: "שני חוטים זהב שזורים בעדינות." },
  { id: "pave-band",   he: "פאווה",        description: "יהלומי מיקרו לאורך כל המעטפת." },
  { id: "split-shank", he: "זרוע מפוצלת",  description: "הלהקה מתפצלת לקראת היהלום." },
  { id: "bypass",      he: "עוטפת (Bypass)", description: "זרועות חופפות שעוטפות את המרכז." },
  { id: "twisted-pave",he: "מסולסלת פאווה", description: "חוטי זהב שזורים עם יהלומים זעירים." },
  { id: "infinity",    he: "אינסוף",       description: "לולאות זהב המשתלבות ללא קצה." },
  { id: "braided",     he: "צמה",          description: "קליעת זהב צפופה ומורכבת." },
  { id: "milgrain",    he: "מילגריין",     description: "שוליים מעוטרים בכדוריות זהב זעירות." },
  { id: "tapered",     he: "הולכת וצרה",   description: "הלהקה הופכת צרה יותר ליד היהלום." },
  { id: "reverse-tapered", he: "הולכת ומתרחבת", description: "הלהקה מתרחבת לקראת המרכז." },
  { id: "chevron",     he: "שברון (V)",    description: "זווית עדינה שמוסיפה חדות." },
  { id: "vine",        he: "מטפסת",        description: "עיצוב טבעי המזכיר ענפים ועלים." },
  { id: "double-band", he: "להקה כפולה",   description: "שתי טבעות זהב מקבילות." },
  { id: "euro-shank",  he: "בסיס אירופאי", description: "תחתית שטוחה למניעת סיבוב הטבעת." },
  { id: "channel-set", he: "שיבוץ מסילה",  description: "יהלומים נחים בתעלה שקועה." },
  { id: "scalloped-pave", he: "פאווה מסולסל", description: "שוליים גליים עם שיבוץ עשיר." },
  { id: "beaded",      he: "פנינים",       description: "להקה עשויה כדוריות זהב רציפות." },
  { id: "vintage-scroll", he: "וינטג'",    description: "פיתוחים עתיקים ומלאי אופי." },
  { id: "concave",     he: "קעורה",        description: "שקע מתון לאורך הלהקה." },
  { id: "convex",      he: "קמורה",        description: "מראה מלא ובולט במיוחד." },
  { id: "rope",        he: "חבל",          description: "טקסטורה מסובבת חזקה ובולטת." },
  { id: "hammered",    he: "מרוקעת",       description: "טקסטורה אורגנית הנעשית בהקשות פטיש." },
];

export const CARAT_OPTIONS: CaratOption[] = [
  { value: 1.0, label: "1.00" },
  { value: 1.5, label: "1.50" },
  { value: 2.0, label: "2.00" },
  { value: 2.5, label: "2.50" },
  { value: 3.0, label: "3.00" },
  { value: 3.5, label: "3.50" },
  { value: 4.0, label: "4.00+" },
];

export const COLOR_OPTIONS = [
  { value: "D" as const, he: "D — חסר צבע" },
  { value: "E" as const, he: "E — חסר צבע" },
  { value: "F" as const, he: "F — חסר צבע" },
  { value: "G" as const, he: "G — כמעט חסר צבע" },
  { value: "H" as const, he: "H — כמעט חסר צבע" },
];

export const CLARITY_OPTIONS = [
  { value: "FL"   as const, he: "FL — ללא רבב" },
  { value: "IF"   as const, he: "IF — ללא רבב פנימי" },
  { value: "VVS1" as const, he: "VVS1" },
  { value: "VVS2" as const, he: "VVS2" },
  { value: "VS1"  as const, he: "VS1" },
  { value: "VS2"  as const, he: "VS2" },
];

// Rough indicative price per carat by clarity/color tier (for live preview only).
// Real pricing is always confirmed at consultation.
export function estimatePriceILS(opts: {
  carat: number;
  color: typeof COLOR_OPTIONS[number]["value"];
  clarity: typeof CLARITY_OPTIONS[number]["value"];
  metal: Metal;
  setting: SettingOption["id"];
  band: BandOption["id"];
}): number {
  const basePerCarat = 32000;
  const colorMul = { D: 1.32, E: 1.20, F: 1.10, G: 1.00, H: 0.92 }[opts.color];
  const clarityMul = { FL: 1.40, IF: 1.30, VVS1: 1.20, VVS2: 1.12, VS1: 1.04, VS2: 0.96 }[opts.clarity];
  const caratPremium = Math.pow(opts.carat, 1.32);
  const settingAdd = { solitaire: 6500, "three-stone": 14000, "hidden-halo": 11500, pave: 13000, bezel: 7500 }[opts.setting];
  const bandAdd = { classic: 0, "knife-edge": 1200, twisted: 2400, "pave-band": 8500, "split-shank": 1500, bypass: 1800, "twisted-pave": 9500, infinity: 3200, braided: 2800, milgrain: 2000, tapered: 500, "reverse-tapered": 500, chevron: 1200, vine: 3800, "double-band": 3000, "euro-shank": 800, "channel-set": 6500, "scalloped-pave": 9000, beaded: 1500, "vintage-scroll": 4000, concave: 900, convex: 1100, rope: 2100, hammered: 1000 }[opts.band];
  const metalAdd = { "yellow-gold": 0, "white-gold": 0, "rose-gold": 0, platinum: 4500 }[opts.metal];
  const raw = basePerCarat * colorMul * clarityMul * caratPremium + settingAdd + bandAdd + metalAdd;
  return Math.round(raw / 500) * 500;
}
