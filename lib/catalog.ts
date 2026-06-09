import type { CollectionCategory } from "./pieces";

// ── Collection metadata ───────────────────────────────────────

export type CollectionMeta = {
  slug: CollectionCategory;
  nameEn: string;
  nameHe: string;
  descriptionEn: string;
  descriptionHe: string;
  subcategories: SubcategoryMeta[];
  image: string;
};

export type SubcategoryMeta = {
  slug: string;
  nameEn: string;
  nameHe: string;
};

export const COLLECTIONS: CollectionMeta[] = [
  {
    slug: "bridal",
    nameEn: "Bridal Collection",
    nameHe: "קולקציית כלה",
    descriptionEn: "Engagement rings, wedding bands, and couple's sets — each one made for a single day that lasts a lifetime.",
    descriptionHe: "טבעות אירוסין, טבעות נישואין וסטים לזוגות — כל אחת נעשית ליום אחד שנמשך כל חיים.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "engagement-rings", nameEn: "Engagement Rings", nameHe: "טבעות אירוסין" },
      { slug: "wedding-bands",    nameEn: "Wedding Bands",    nameHe: "טבעות נישואין" },
      { slug: "couples-sets",     nameEn: "Couples' Sets",    nameHe: "סטים לזוגות" },
    ],
  },
  {
    slug: "diamond",
    nameEn: "Diamond Collection",
    nameHe: "קולקציית יהלומים",
    descriptionEn: "Tennis necklaces, bracelets, earrings, and rings — the purest expression of a diamond's light.",
    descriptionHe: "שרשראות טניס, צמידים, עגילים וטבעות — הביטוי הטהור ביותר של אור היהלום.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "tennis-necklaces",  nameEn: "Tennis Necklaces",  nameHe: "שרשראות טניס" },
      { slug: "tennis-bracelets",  nameEn: "Tennis Bracelets",  nameHe: "צמידי טניס" },
      { slug: "diamond-earrings",  nameEn: "Diamond Earrings",  nameHe: "עגילי יהלומים" },
      { slug: "diamond-rings",     nameEn: "Diamond Rings",     nameHe: "טבעות יהלומים" },
    ],
  },
  {
    slug: "signature",
    nameEn: "Signature Collection",
    nameHe: "קולקציית סיגנייצ'ר",
    descriptionEn: "The designs identified with Maison Mana — the MM monogram, and limited editions created once.",
    descriptionHe: "העיצובים המזוהים עם מאזון מנא — לוגו MM ופריטים במהדורות מוגבלות.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "mm-monogram",     nameEn: "MM Monogram",      nameHe: "לוגו MM" },
      { slug: "limited-edition", nameEn: "Limited Editions", nameHe: "מהדורות מוגבלות" },
    ],
  },
  {
    slug: "high-jewelry",
    nameEn: "High Jewelry",
    nameHe: "תכשיטי יוקרה",
    descriptionEn: "One-of-a-kind handcrafted pieces with significant stones. Prices from tens to hundreds of thousands.",
    descriptionHe: "תכשיטים ייחודיים בעבודת יד עם אבנים משמעותיות. מחירים של עשרות ומאות אלפי שקלים.",
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "unique-pieces",  nameEn: "Unique Pieces",   nameHe: "פריטים ייחודיים" },
      { slug: "large-diamonds", nameEn: "Large Diamonds",  nameHe: "יהלומים גדולים" },
    ],
  },
  {
    slug: "mens",
    nameEn: "Men's Collection",
    nameHe: "קולקציית גברים",
    descriptionEn: "Rings, bracelets, necklaces, and cufflinks — for a man who appreciates precision.",
    descriptionHe: "טבעות, צמידים, שרשראות וחפתים — לגבר שמעריך דיוק.",
    image: "https://images.unsplash.com/photo-1599643478514-4a11029cbb3b?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "mens-rings",     nameEn: "Rings",      nameHe: "טבעות" },
      { slug: "mens-bracelets", nameEn: "Bracelets",  nameHe: "צמידים" },
      { slug: "mens-necklaces", nameEn: "Necklaces",  nameHe: "שרשראות" },
      { slug: "cufflinks",      nameEn: "Cufflinks",  nameHe: "חפתים" },
    ],
  },
  {
    slug: "womens",
    nameEn: "Women's Collection",
    nameHe: "קולקציית נשים",
    descriptionEn: "Necklaces, earrings, and bracelets — for everyday wear and milestone moments.",
    descriptionHe: "שרשראות, עגילים וצמידים — לשגרה ולרגעים מיוחדים.",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "womens-necklaces", nameEn: "Necklaces", nameHe: "שרשראות" },
      { slug: "womens-earrings",  nameEn: "Earrings",  nameHe: "עגילים" },
      { slug: "womens-bracelets", nameEn: "Bracelets", nameHe: "צמידים" },
    ],
  },
  {
    slug: "bespoke",
    nameEn: "Bespoke",
    nameHe: "הזמנה אישית",
    descriptionEn: "Personal design, engravings, and pieces made entirely to order — starting from a conversation.",
    descriptionHe: "עיצוב אישי, חריטות ותכשיטים לפי הזמנה — מתחיל בשיחה.",
    image: "https://images.unsplash.com/photo-1573408301185-9519f94815b0?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "personal-design", nameEn: "Personal Design", nameHe: "עיצוב אישי" },
      { slug: "engravings",      nameEn: "Engravings",      nameHe: "חריטות" },
      { slug: "made-to-order",   nameEn: "Made to Order",   nameHe: "לפי הזמנה" },
    ],
  },
  {
    slug: "investment",
    nameEn: "Investment Diamonds",
    nameHe: "יהלומי השקעה",
    descriptionEn: "Certified diamonds with GIA, IGI, and HRD papers — lab-grown and natural, with expert stone selection.",
    descriptionHe: "יהלומים עם תעודות GIA, IGI ו-HRD — מעבדה וטבעיים, עם ליווי בבחירת האבן.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1400&q=85",
    subcategories: [
      { slug: "certified-diamonds", nameEn: "Certified Diamonds", nameHe: "יהלומים עם תעודות" },
      { slug: "lab-diamonds",       nameEn: "Lab Diamonds",       nameHe: "יהלומי מעבדה" },
      { slug: "natural-diamonds",   nameEn: "Natural Diamonds",   nameHe: "יהלומים טבעיים" },
    ],
  },
];

export function collectionBySlug(slug: string): CollectionMeta | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

// ── Legacy catalog types kept for existing product pages ──────

export type Category = "rings" | "necklaces" | "earrings" | "bracelets" | "mens" | "investment";

export interface Product {
  id: string;
  nameEn: string;
  nameHe: string;
  category: Category;
  collectionSlug: CollectionCategory;
  priceILS: number;
  image: string;
  descriptionEn: string;
  descriptionHe: string;
  metalOptions: string[];
  shapeOptions?: string[];
  certificate?: "GIA" | "IGI" | "HRD";
}

export const PRODUCTS: Product[] = [
  // BRIDAL — Engagement
  {
    id: "r-01", nameEn: "Classic Solitaire", nameHe: "סוליטר קלאסי",
    category: "rings", collectionSlug: "bridal", priceILS: 32_000,
    image: "/ring-close.jpg",
    descriptionEn: "A timeless round solitaire on a fine platinum band.",
    descriptionHe: "סוליטר עגול נצחי על להקת פלטינה דקה.",
    metalOptions: ["yellow-gold", "white-gold", "rose-gold", "platinum"],
    shapeOptions: ["round", "oval", "princess", "emerald", "pear", "marquise", "cushion"],
    certificate: "GIA",
  },
  {
    id: "r-02", nameEn: "Hidden Halo Pavé", nameHe: "הילה נסתרת פאווה",
    category: "rings", collectionSlug: "bridal", priceILS: 48_000,
    image: "https://images.unsplash.com/photo-1599643478514-4a11029cbb3b?auto=format&fit=crop&w=800&q=85",
    descriptionEn: "A pavé band leading to a centre stone with a hidden halo below.",
    descriptionHe: "להקת פאווה המובילה לאבן מרכזית עם הילה נסתרת מתחת.",
    metalOptions: ["yellow-gold", "white-gold", "platinum"],
    shapeOptions: ["round", "oval", "cushion"],
    certificate: "GIA",
  },
  // DIAMOND — Tennis
  {
    id: "b-01", nameEn: "Tennis Classique", nameHe: "טניס קלאסיק",
    category: "bracelets", collectionSlug: "diamond", priceILS: 210_000,
    image: "/bracelet-1.jpg",
    descriptionEn: "Seventy-two brilliant rounds, matched by hand.",
    descriptionHe: "שבעים ושתיים עגולים בוהקים, ממוינים ביד.",
    metalOptions: ["white-gold", "yellow-gold", "rose-gold"],
    certificate: "IGI",
  },
  {
    id: "b-02", nameEn: "Bespoke Tennis Bangle", nameHe: "צמיד טניס בהתאמה",
    category: "bracelets", collectionSlug: "diamond", priceILS: 185_000,
    image: "/bracelet-2.jpg",
    descriptionEn: "A classic white gold tennis bangle encrusted with ideal cut diamonds.",
    descriptionHe: "צמיד קשיח קלאסי מזהב לבן משובץ ביהלומים בחיתוך אידיאלי.",
    metalOptions: ["white-gold", "yellow-gold"],
    certificate: "IGI",
  },
  {
    id: "b-03", nameEn: "Bezel-Set Tennis Bracelet", nameHe: "צמיד טניס שיבוץ כוסית",
    category: "bracelets", collectionSlug: "diamond", priceILS: 240_000,
    image: "/bracelet-3.jpg",
    descriptionEn: "Individually bezel-set brilliant cut diamonds in 18k yellow gold.",
    descriptionHe: "יהלומים עגולים בשיבוץ כוסית אינדיבידואלי בזהב צהוב 18K.",
    metalOptions: ["yellow-gold", "white-gold"],
    certificate: "IGI",
  },
  {
    id: "n-01", nameEn: "Tennis Necklace 5ct", nameHe: "שרשרת טניס 5 קראט",
    category: "necklaces", collectionSlug: "diamond", priceILS: 320_000,
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=85",
    descriptionEn: "A full-circle tennis necklace, 42cm, 5 total carats.",
    descriptionHe: "שרשרת טניס מלאה, 42 ס\"מ, 5 קראט.",
    metalOptions: ["white-gold", "yellow-gold"],
    certificate: "IGI",
  },
  // SIGNATURE
  {
    id: "sig-01", nameEn: "MM Monogram Ring", nameHe: "טבעת לוגו MM",
    category: "rings", collectionSlug: "signature", priceILS: 18_000,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85",
    descriptionEn: "The house monogram in 18k yellow gold.",
    descriptionHe: "מונוגרם הבית בזהב צהוב 18K.",
    metalOptions: ["yellow-gold", "white-gold"],
  },
  // MEN'S
  {
    id: "m-01", nameEn: "Men's Diamond Band", nameHe: "טבעת יהלום לגבר",
    category: "rings", collectionSlug: "mens", priceILS: 22_000,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=85",
    descriptionEn: "A wide band with a channel-set row of round diamonds.",
    descriptionHe: "להקה רחבה עם שורת יהלומים עגולים בשיבוץ מסילה.",
    metalOptions: ["yellow-gold", "white-gold", "platinum"],
  },
  // INVESTMENT
  {
    id: "inv-01", nameEn: "1ct D/FL Round — GIA", nameHe: "עגול 1 קראט D/FL — GIA",
    category: "investment", collectionSlug: "investment", priceILS: 95_000,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=85",
    descriptionEn: "1.00ct Round Brilliant, D colour, Flawless — GIA certificate.",
    descriptionHe: "עגול בריליאנט 1.00 קראט, צבע D, ללא רבב — תעודת GIA.",
    metalOptions: [],
    certificate: "GIA",
  },
];

export function getProductsByCategory(category: Category) {
  return PRODUCTS.filter((p) => p.category === category).map((p) => ({
    id: p.id,
    name: p.nameEn,
    price: p.priceILS,
    description: p.descriptionEn,
    image: p.image,
    metalOptions: p.metalOptions,
    shapeOptions: p.shapeOptions,
    settingOptions: undefined as string[] | undefined,
    category: p.category,
  }));
}

export function getProductById(id: string) {
  const p = PRODUCTS.find((p) => p.id === id);
  if (!p) return undefined;
  return {
    id: p.id,
    name: p.nameEn,
    price: p.priceILS,
    description: p.descriptionEn,
    image: p.image,
    metalOptions: p.metalOptions,
    shapeOptions: p.shapeOptions,
    settingOptions: undefined as string[] | undefined,
    category: p.category,
  };
}

