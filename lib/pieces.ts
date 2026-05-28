// Maison Mana — bridal & high-jewelry catalog (v1 fixtures).
// Pieces, narratives, and certificate-style metadata for the collection routes.

export type DiamondShape =
  | "round"
  | "cushion"
  | "oval"
  | "emerald"
  | "pear"
  | "marquise"
  | "radiant";

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
  image: string;
  imageAlt: string;
};

export const COLLECTIONS: { slug: Collection; he: string; lead: string }[] = [
  {
    slug: "engagement",
    he: "טבעות אירוסין",
    lead: "כל טבעת היא שיחה שמתחילה לפני שמישהו מדבר.",
  },
  {
    slug: "tennis-bracelets",
    he: "צמידי טניס",
    lead: "שורה רציפה של אור — עשויה לזיכרון, ולא לאופנה.",
  },
  {
    slug: "solitaire-necklaces",
    he: "שרשרות סוליטר",
    lead: "אבן אחת. שרשרת אחת. שתיקה אחת.",
  },
  {
    slug: "diamond-earrings",
    he: "עגילי יהלום",
    lead: "האור מתחיל בלילה ונגמר בבוקר.",
  },
  {
    slug: "wedding-bands",
    he: "להקות נישואין",
    lead: "מה שנמדד בעשורים, לא בשנים.",
  },
];

export const PIECES: Piece[] = [
  {
    slug: "anna-solitaire",
    nameHe: "אנה",
    nameLat: "Anna",
    collection: "engagement",
    setting: "solitaire",
    shape: "round",
    metal: "platinum",
    carat: 2.04,
    color: "D",
    clarity: "VVS1",
    certificate: { lab: "GIA", id: "2487105119" },
    priceILS: 168000,
    reference: "מ-0114",
    narrativeHe:
      "סוליטר קלאסי, עגול ברילינט, על להקה דקה מפלטינה. אנה היא הטבעת שאליה חוזרים אחרי שמסתכלים בכל השאר. אין מה להוסיף לה.",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "טבעת אירוסין סוליטר ברילינט עגול על להקת פלטינה",
  },
  {
    slug: "celine-emerald",
    nameHe: "סלין",
    nameLat: "Céline",
    collection: "engagement",
    setting: "solitaire",
    shape: "emerald",
    metal: "yellow-gold",
    carat: 3.12,
    color: "E",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "6471993280" },
    priceILS: 142000,
    reference: "מ-0127",
    narrativeHe:
      "חיתוך אמרלד מלבני, ארוך וקר, על להקת זהב צהוב חמה. הניגוד הזה הוא כל הטבעת. סלין היא לאישה שיודעת לבחור.",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "טבעת אירוסין אמרלד קאט על להקת זהב צהוב",
  },
  {
    slug: "margot-oval",
    nameHe: "מארגו",
    nameLat: "Margot",
    collection: "engagement",
    setting: "hidden-halo",
    shape: "oval",
    metal: "yellow-gold",
    carat: 2.51,
    color: "F",
    clarity: "VVS2",
    certificate: { lab: "GIA", id: "1469075318" },
    priceILS: 124000,
    reference: "מ-0142",
    narrativeHe:
      "אובל פתוח, עם הילה נסתרת מתחת לכותרת — ארבעים יהלומי פאווה שאף אחד לא רואה, אבל הם משנים את כל ההילה. מארגו נראית גדולה מהמידה שלה.",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "טבעת אירוסין אובל עם הילה נסתרת על זהב צהוב",
  },
  {
    slug: "emilie-three-stone",
    nameHe: "אמילי",
    nameLat: "Émilie",
    collection: "engagement",
    setting: "three-stone",
    shape: "cushion",
    metal: "platinum",
    carat: 2.80,
    color: "E",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "5226041780" },
    priceILS: 195000,
    reference: "מ-0151",
    narrativeHe:
      "קושן מרכזי ושני באגטים מצדדים. שלוש אבנים — אחת לעבר, אחת להווה, אחת לעתיד. אנחנו לא בטוחים שזה נכון, אבל אמילי גורמת לזה להישמע אמת.",
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "טבעת שלוש אבנים קושן עם באגטים על פלטינה",
  },
  {
    slug: "tennis-bezel-classique",
    nameHe: "טניס בזל",
    nameLat: "Tennis Bezel",
    collection: "tennis-bracelets",
    setting: "tennis",
    shape: "round",
    metal: "yellow-gold",
    carat: 4.50,
    color: "F",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "0319485211" },
    priceILS: 78000,
    reference: "מ-0203",
    narrativeHe:
      "ארבעים ושבעה ברילינטים, כל אחד עטוף בבזל זהב צהוב נקי. הצמיד הזה לא קופץ — הוא מאיר. נסתר מתחת לשרוול ארוך, נראה מתחת לשמלה.",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "צמיד טניס בזל זהב צהוב",
  },
  {
    slug: "tennis-classique",
    nameHe: "טניס קלאסי",
    nameLat: "Tennis Classique",
    collection: "tennis-bracelets",
    setting: "tennis",
    shape: "round",
    metal: "platinum",
    carat: 7.20,
    color: "E",
    clarity: "VVS2",
    certificate: { lab: "GIA", id: "8842611703" },
    priceILS: 142000,
    reference: "מ-0218",
    narrativeHe:
      "הקלאסי שכולם רוצים להעתיק ואף אחד לא מצליח. שבעים ושתיים אבנים, יד אחת של אומן, ומנעול עם זרוע ביטחון שמרגיש כמו סוף משפט.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "צמיד טניס פלטינה קלאסי",
  },
  {
    slug: "rine-solitaire-pendant",
    nameHe: "רין",
    nameLat: "Rine",
    collection: "solitaire-necklaces",
    setting: "pendant",
    shape: "round",
    metal: "white-gold",
    carat: 1.50,
    color: "D",
    clarity: "IF",
    certificate: { lab: "GIA", id: "7172958403" },
    priceILS: 64000,
    reference: "מ-0307",
    narrativeHe:
      "אבן אחת על שרשרת דקה. כל מה שצריך, ולא רגע יותר. רין נלבשת ביום, מתחת לחולצה, וזוכרים אותה בלילה.",
    image:
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "תליון סוליטר על שרשרת זהב לבן דקה",
  },
  {
    slug: "adria-tear",
    nameHe: "אדריה",
    nameLat: "Adria",
    collection: "solitaire-necklaces",
    setting: "pendant",
    shape: "pear",
    metal: "white-gold",
    carat: 2.10,
    color: "E",
    clarity: "VVS1",
    certificate: { lab: "GIA", id: "3358904122" },
    priceILS: 88000,
    reference: "מ-0315",
    narrativeHe:
      "יהלום בצורת אגס תלוי על שלוש מצולות — נוטה קלות קדימה, כך שכשמרכינים את הראש הוא תופס את האור הראשון של הבוקר.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "תליון בצורת אגס על שרשרת זהב לבן",
  },
  {
    slug: "soli-studs",
    nameHe: "סולי",
    nameLat: "Soli",
    collection: "diamond-earrings",
    setting: "stud",
    shape: "round",
    metal: "platinum",
    carat: 4.00,
    color: "E",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "1180443902 / 1180443903" },
    priceILS: 124000,
    reference: "מ-0402",
    narrativeHe:
      "צמד צמודים בני שתי קראט כל אחד. עיגון בארבע צפרניים נמוכות שמאפשרות לאוזן לנשום. זוג שעובר בירושה ולא ביציאות לבילוי.",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "עגילי סוליטר ברילינט פלטינה",
  },
  {
    slug: "hoop-eternity",
    nameHe: "הופ איטרניטי",
    nameLat: "Hoop Éternité",
    collection: "diamond-earrings",
    setting: "hoop",
    shape: "round",
    metal: "yellow-gold",
    carat: 3.30,
    color: "F",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "9947112508" },
    priceILS: 92000,
    reference: "מ-0418",
    narrativeHe:
      "חישוקים זהובים בקוטר עשרים מילימטר, רצופים יהלומים פנים וחוץ. הסוד נמצא בחישוב המשקל — קלים מספיק לכל היום, כבדים מספיק להרגיש.",
    image:
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "עגילי חישוק יהלומים זהב צהוב",
  },
  {
    slug: "eternity-band",
    nameHe: "להקת איטרניטי",
    nameLat: "Éternité",
    collection: "wedding-bands",
    setting: "eternity",
    shape: "round",
    metal: "platinum",
    carat: 3.00,
    color: "E",
    clarity: "VS1",
    certificate: { lab: "GIA", id: "—" },
    priceILS: 58000,
    reference: "מ-0501",
    narrativeHe:
      "שלוש קראט במעגל סגור. נלבשת לבד, או צמודה לאנה. אם תבחרי בה, היא לא תזוז יותר ממקומה.",
    image:
      "https://images.unsplash.com/photo-1603561596112-db1bd1b7e6c4?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "להקת איטרניטי יהלומים פלטינה",
  },
];

export function piecesByCollection(slug: Collection): Piece[] {
  return PIECES.filter((p) => p.collection === slug);
}

export function pieceBySlug(slug: string): Piece | undefined {
  return PIECES.find((p) => p.slug === slug);
}

export const METAL_LABELS_HE: Record<Metal, string> = {
  "yellow-gold": "זהב צהוב 18 קראט",
  "white-gold": "זהב לבן 18 קראט",
  "rose-gold": "זהב ורוד 18 קראט",
  platinum: "פלטינה 950",
};

export const SHAPE_LABELS_HE: Record<DiamondShape, string> = {
  round: "ברילינט עגול",
  cushion: "קושן",
  oval: "אובל",
  emerald: "אמרלד",
  pear: "אגס",
  marquise: "מרקיזה",
  radiant: "רדיאנט",
};

export const SETTING_LABELS_HE: Record<Setting, string> = {
  solitaire: "סוליטר",
  "three-stone": "שלוש אבנים",
  "hidden-halo": "הילה נסתרת",
  pave: "פאווה",
  bezel: "בזל",
  eternity: "איטרניטי",
  tennis: "טניס",
  hoop: "חישוק",
  stud: "צמוד",
  pendant: "תליון",
};
