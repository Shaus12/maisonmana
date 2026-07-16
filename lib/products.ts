import type { Locale } from "@/lib/i18n";

// ─── Localized data types ────────────────────────────────────
// Every customer-facing string carries both languages; components
// resolve them to plain strings with resolveProduct(product, locale).

export type Localized = { he: string; en: string };

export type ProductOption =
  | {
      type: "select";
      name: string;
      label: Localized;
      options: Localized[];
    }
  | {
      type: "text";
      name: string;
      label: Localized;
      placeholder?: Localized;
      note?: Localized;
    };

export type ProductSpec = {
  label: Localized;
  value: Localized;
};

export type ProductGroup =
  | "rings"
  | "tennis"
  | "bangles"
  | "personalized"
  | "bracelets";

export type ProductImage = { src: string; alt: Localized };

export type Product = {
  id?: string;
  slug: string;
  group: ProductGroup;
  title: Localized;
  category: Localized;
  collection?: string;
  price: number;
  priceLabel: string;
  paymentUrl?: string;
  isPurchasable?: boolean;
  shortDescription: Localized;
  specs: ProductSpec[];
  images: ProductImage[];
  availability: Localized;
  ctaLabel: Localized;
  options?: ProductOption[];
  note?: Localized;
};

// ─── Resolved (single-locale) types ──────────────────────────

export type ResolvedProductOption =
  | { type: "select"; name: string; label: string; options: string[] }
  | { type: "text"; name: string; label: string; placeholder?: string; note?: string };

export type ResolvedProductSpec = { label: string; value: string };

export type ResolvedProduct = {
  id?: string;
  slug: string;
  group: ProductGroup;
  title: string;
  category: string;
  price: number;
  priceLabel: string;
  paymentUrl?: string;
  isPurchasable?: boolean;
  shortDescription: string;
  specs: ResolvedProductSpec[];
  images: { src: string; alt: string }[];
  availability: string;
  ctaLabel: string;
  options?: ResolvedProductOption[];
  note?: string;
};

export function resolveProduct(product: Product, locale: Locale): ResolvedProduct {
  const L = (v: Localized) => v[locale];
  return {
    id: product.id,
    slug: product.slug,
    group: product.group,
    title: L(product.title),
    category: L(product.category),
    price: product.price,
    priceLabel: product.priceLabel,
    paymentUrl: product.paymentUrl,
    isPurchasable: product.isPurchasable,
    shortDescription: L(product.shortDescription),
    specs: product.specs.map((s) => ({ label: L(s.label), value: L(s.value) })),
    images: product.images.map((img) => ({ src: img.src, alt: L(img.alt) })),
    availability: L(product.availability),
    ctaLabel: L(product.ctaLabel),
    options: product.options?.map((opt) =>
      opt.type === "select"
        ? { type: "select" as const, name: opt.name, label: L(opt.label), options: opt.options.map(L) }
        : {
            type: "text" as const,
            name: opt.name,
            label: L(opt.label),
            placeholder: opt.placeholder ? L(opt.placeholder) : undefined,
            note: opt.note ? L(opt.note) : undefined,
          }
    ),
    note: product.note ? L(product.note) : undefined,
  };
}

// ─── Shared building blocks ──────────────────────────────────

const lv = (he: string, en: string): Localized => ({ he, en });
const same = (v: string): Localized => ({ he: v, en: v });

const AVAILABLE = lv("זמין להזמנה", "Available to order");
const CTA = lv("לבירור והזמנה", "Inquire & Order");

const METAL = lv("סוג מתכת", "Metal");
const GOLD_14K = lv("זהב 14K", "14K Gold");
const DIAMOND_WEIGHT = lv("משקל יהלומים", "Diamond Weight");
const TOTAL_DIAMOND_WEIGHT = lv("משקל יהלומים כולל", "Total Diamond Weight");
const COLOR = lv("צבע", "Color");
const CLARITY = lv("ניקיון", "Clarity");
const CUT = lv("צורת חיתוך", "Cut");
const BRACELET_TYPE = lv("סוג צמיד", "Bracelet Type");
const PENDANT = lv("תליון", "Pendant");
const NOTE = lv("הערה", "Note");

const ct = (n: string) => lv(`${n} קראט`, `${n} ct`);

const goldColorOption: ProductOption = {
  type: "select",
  name: "goldColor",
  label: lv("צבע זהב", "Gold Color"),
  options: [
    lv("זהב צהוב", "Yellow Gold"),
    lv("זהב לבן", "White Gold"),
    lv("רוז גולד", "Rose Gold"),
  ],
};

const initialsOption: ProductOption = {
  type: "text",
  name: "initials",
  label: lv("אותיות לשיבוץ", "Initials"),
  placeholder: lv("לדוגמה: A M", "e.g. A M"),
  note: lv(
    "ניתן לבחור אותיות לשיבוץ בהתאם לעיצוב.",
    "Letters can be chosen for the setting according to the design."
  ),
};

const nameOption: ProductOption = {
  type: "text",
  name: "nameText",
  label: lv("שם לתליון", "Pendant Name"),
  placeholder: lv("הקלידו שם עד 5 אותיות", "Type a name, up to 5 letters"),
  note: lv(
    "עד 5 אותיות במחיר זהה, בהתאם לפרטי המוצר.",
    "Up to 5 letters at the same price, per the product details."
  ),
};

const ringSizeOption: ProductOption = {
  type: "select",
  name: "ringSize",
  label: lv("מידת טבעת", "Ring Size"),
  options: [
    same("44"), same("45"), same("46"), same("47"), same("48"), same("49"),
    same("50"), same("51"), same("52"), same("53"), same("54"), same("55"),
    same("56"), same("57"), same("58"), same("59"), same("60"), same("61"),
    same("62"), same("63"), same("64"), same("65")
  ],
};

// ─── Catalog ─────────────────────────────────────────────────

export const products: Record<string, Product> = {
  "lab-diamond-ring-2-30ct": {
    slug: "lab-diamond-ring-2-30ct",
    group: "rings",
    title: lv("טבעת יהלום מעבדה 2.30 קראט", "2.30 ct Lab-Grown Diamond Ring"),
    category: lv("טבעות יהלום", "Diamond Rings"),
    price: 4500,
    priceLabel: "₪4,500",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/c/payment/?cartid=2aaf26a3-56d3-44ef-8447-7f6e656eeae8",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת יהלום בעיצוב קלאסי עם אבן מרכזית 2 קראט יהלום מעבדה, בליווי אבני צד עדינות. שילוב נקי, יוקרתי ומדויק למראה אלגנטי ועל־זמני.",
      "A classic diamond ring with a 2 ct lab-grown center stone, accompanied by delicate side stones. A clean, refined, and precise combination for an elegant, timeless look."
    ),
    specs: [
      { label: lv("משקל זהב משוער", "Approx. Gold Weight"), value: lv("כ־2 גרם, משתנה לפי מידת האצבע", "About 2 g, varies by ring size") },
      { label: lv("אבן מרכזית", "Center Stone"), value: lv("יהלום מעבדה 2 קראט", "2 ct lab-grown diamond") },
      { label: lv("צבע אבן מרכזית", "Center Stone Color"), value: same("D–E") },
      { label: lv("ניקיון אבן מרכזית", "Center Stone Clarity"), value: same("VS1") },
      { label: lv("תעודה", "Certificate"), value: same("IGI") },
      { label: lv("אבני צד", "Side Stones"), value: lv("יהלומי מעבדה 0.30 קראט", "0.30 ct lab-grown diamonds") },
      { label: lv("צבע אבני צד", "Side Stones Color"), value: same("D") },
      { label: lv("ניקיון אבני צד", "Side Stones Clarity"), value: same("VS1") },
      { label: lv("סה״כ יהלומים בטבעת", "Total Diamonds in Ring"), value: ct("2.30") },
    ],
    images: [
      {
        src: "/products/lab-diamond-ring-2-30ct-main.jpg",
        alt: lv(
          "טבעת יהלום מעבדה 2.30 קראט עם אבן מרכזית ואבני צד של Maison MANA",
          "2.30 ct lab-grown diamond ring with center and side stones by Maison MANA"
        ),
      },
      {
        src: "/products/lab-diamond-ring-2-30ct-hand.jpg",
        alt: lv(
          "טבעת יהלום מעבדה 2.30 קראט על היד להמחשת מראה ומידה",
          "2.30 ct lab-grown diamond ring worn on the hand to show look and scale"
        ),
      },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
  },
  "diamond-product-01": {
    id: "diamond-product-01",
    slug: "diamond-product-01",
    group: "rings",
    title: lv("טבעת זהב אדום 14K יהלומים טבעיים 1.10 קראט", "14K Rose Gold Natural Diamond Ring, 1.10 ct"),
    category: lv("טבעות יהלום", "Diamond Rings"),
    price: 3900,
    priceLabel: "₪3,900",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxdna/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת יוקרתית בעיצוב מודרני ואלגנטי, עשויה זהב אדום 14K ומשובצת יהלומים טבעיים במשקל כולל של 1.10 קראט. היהלומים בדרגת D Color ו-VS1 Clarity, המעניקים לטבעת ברק יוצא דופן ומראה יוקרתי.",
      "A luxurious ring in a modern, elegant design, crafted in 14K rose gold and set with natural diamonds totaling 1.10 ct. The diamonds are D color and VS1 clarity, giving the ring exceptional brilliance and a refined look."
    ),
    specs: [
      { label: METAL, value: lv("זהב אדום 14K", "14K Rose Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומים טבעיים", "Natural diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.10") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS1") },
    ],
    images: [
      {
        src: "/products/diamond-product-01.jpg",
        alt: lv(
          "טבעת זהב אדום 14K משובצת יהלומים טבעיים 1.10 קראט של Maison MANA",
          "14K rose gold ring set with 1.10 ct natural diamonds by Maison MANA"
        ),
      },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
  },
  "diamond-product-02": {
    id: "diamond-product-02",
    slug: "diamond-product-02",
    group: "rings",
    title: lv("טבעת זהב אדום יהלומי מעבדה 0.30 קראט", "Rose Gold Lab-Grown Diamond Ring, 0.30 ct"),
    category: lv("טבעות יהלום", "Diamond Rings"),
    price: 1300,
    priceLabel: "₪1,300",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxdna/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת אלגנטית בעיצוב ייחודי מזהב אדום, משובצת יהלומי מעבדה במשקל כולל של 0.30 קראט, בדרגת D Color ו-VS1 Clarity. עיצוב נשי, יוקרתי ועל־זמני המתאים ללבישה יומיומית או כמתנה מיוחדת.",
      "An elegant ring in a distinctive rose gold design, set with lab-grown diamonds totaling 0.30 ct in D color and VS1 clarity. A feminine, refined, and timeless piece for everyday wear or a special gift."
    ),
    specs: [
      { label: METAL, value: lv("זהב אדום", "Rose Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.30") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS1") },
    ],
    images: [
      {
        src: "/products/diamond-product-02.jpg",
        alt: lv(
          "טבעת זהב אדום משובצת יהלומי מעבדה 0.30 קראט של Maison MANA",
          "Rose gold ring set with 0.30 ct lab-grown diamonds by Maison MANA"
        ),
      },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
  },
  "natural-diamond-tennis-bracelet-1ct": {
    id: "bracelet-product-01",
    slug: "natural-diamond-tennis-bracelet-1ct",
    group: "tennis",
    title: lv("צמיד טניס יהלומים טבעיים 1.00 קראט", "1.00 ct Natural Diamond Tennis Bracelet"),
    category: lv("צמידי טניס", "Tennis Bracelets"),
    price: 4800,
    priceLabel: "₪4,800",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxdw9/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טניס מרשים המשובץ יהלומים טבעיים בחיתוך עגול במשקל כולל של 1.00 קראט, באיכות F/VS, למראה יוקרתי ומיוחד.",
      "A striking tennis bracelet set with round natural diamonds, 1.00 ct total weight, in F/VS quality, for a luxurious and distinctive look."
    ),
    specs: [
      { label: DIAMOND_WEIGHT, value: ct("1.00") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומים טבעיים", "Natural diamonds") },
      { label: lv("איכות", "Quality"), value: same("F/VS") },
      { label: METAL, value: GOLD_14K },
      { label: CUT, value: lv("עגול", "Round") },
      {
        label: NOTE,
        value: lv(
          "מספר היהלומים עשוי להשתנות בהתאם להיקף היד. מספר היהלומים ומשקלם הינו הערכה.",
          "The number of diamonds may vary with wrist size. Diamond count and weight are approximate."
        ),
      },
    ],
    images: [
      { src: "/products/bracelet-product-01.jpeg", alt: lv("צמיד טניס יהלומים טבעיים 1.00 קראט של Maison MANA", "1.00 ct natural diamond tennis bracelet by Maison MANA") },
      { src: "/products/bracelet-product-01-2.jpeg", alt: lv("מבט נוסף על צמיד טניס יהלומים טבעיים 1.00 קראט", "Another view of the 1.00 ct natural diamond tennis bracelet") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "half-tennis-bracelet-11-diamonds-1-1ct": {
    id: "bracelet-product-02",
    slug: "half-tennis-bracelet-11-diamonds-1-1ct",
    group: "tennis",
    title: lv("צמיד חצי טניס 11 יהלומים 1.10 קראט", "Half Tennis Bracelet, 11 Diamonds, 1.10 ct"),
    category: lv("צמידי חצי טניס", "Half Tennis Bracelets"),
    price: 4000,
    priceLabel: "₪4,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxeob/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד חצי טניס עשוי זהב 14K בעיצוב יוקרתי וייחודי, משובץ 11 יהלומים במשקל 0.10 קראט כל אחד.",
      "A 14K gold half tennis bracelet in a refined, distinctive design, set with 11 diamonds of 0.10 ct each."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: lv("מספר יהלומים", "Number of Diamonds"), value: lv("11 יהלומים", "11 diamonds") },
      { label: lv("משקל כל יהלום", "Weight per Diamond"), value: ct("0.10") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.10") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-02.jpeg", alt: lv("צמיד חצי טניס 11 יהלומים 1.10 קראט של Maison MANA", "Half tennis bracelet with 11 diamonds, 1.10 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "custom-shape-diamond-bracelet-1ct": {
    id: "bracelet-product-03",
    slug: "custom-shape-diamond-bracelet-1ct",
    group: "bracelets",
    title: lv("צמיד יהלום לבחירת הלקוח 1.00 קראט", "1.00 ct Diamond Bracelet, Shape of Your Choice"),
    category: lv("צמידי יהלומים", "Diamond Bracelets"),
    price: 3000,
    priceLabel: "₪3,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxep4/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד זהב 14K בעיצוב יוקרתי המשובץ יהלום מרכזי במשקל 1.00 קראט, עם אפשרות בחירת צורת היהלום לפי העדפת הלקוח.",
      "A refined 14K gold bracelet set with a 1.00 ct center diamond, with the diamond shape chosen to your preference."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("1.00") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
      {
        label: lv("צורות לבחירה", "Available Shapes"),
        value: lv("עגול, אובל, טיפה, אמרלד, רדיאנט, מרקיזה, לב", "Round, Oval, Pear, Emerald, Radiant, Marquise, Heart"),
      },
    ],
    images: [
      { src: "/products/bracelet-product-03.jpeg", alt: lv("צמיד יהלום 1.00 קראט עם צורת יהלום לבחירה של Maison MANA", "1.00 ct diamond bracelet with a choice of diamond shape by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [
      goldColorOption,
      {
        type: "select",
        name: "diamondShape",
        label: lv("צורת יהלום", "Diamond Shape"),
        options: [
          lv("עגול", "Round"),
          lv("אובל", "Oval"),
          lv("טיפה", "Pear"),
          lv("אמרלד", "Emerald"),
          lv("רדיאנט", "Radiant"),
          lv("מרקיזה", "Marquise"),
          lv("לב", "Heart"),
        ],
      },
    ],
  },
  "round-diamond-bangle-bracelet-1-5ct": {
    id: "bracelet-product-04",
    slug: "round-diamond-bangle-bracelet-1-5ct",
    group: "bangles",
    title: lv("צמיד בנגל קשיח יהלום עגול 1.50 קראט", "1.50 ct Round Diamond Bangle"),
    category: lv("צמידי בנגל", "Bangles"),
    price: 6200,
    priceLabel: "₪6,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxff3/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד בנגל קשיח עשוי זהב 14K בעיצוב יוקרתי וסגנון ייחודי, משובץ יהלום עגול במשקל 1.50 קראט.",
      "A rigid 14K gold bangle in a refined, distinctive style, set with a 1.50 ct round diamond."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: BRACELET_TYPE, value: lv("בנגל קשיח", "Rigid bangle") },
      { label: DIAMOND_WEIGHT, value: ct("1.50") },
      { label: CUT, value: lv("עגול", "Round") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-04.jpeg", alt: lv("צמיד בנגל קשיח עם יהלום עגול 1.50 קראט של Maison MANA", "Rigid bangle with a 1.50 ct round diamond by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "jadi-marquise-diamond-bracelet-ring-1-30ct": {
    id: "bracelet-product-05",
    slug: "jadi-marquise-diamond-bracelet-ring-1-30ct",
    group: "bracelets",
    title: lv("צמיד טבעת ג׳אדי יהלומי מרקיזה", "Jadi Marquise Diamond Hand Chain"),
    category: lv("צמידי טבעת", "Hand Chains"),
    price: 4000,
    priceLabel: "₪4,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxg3u/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טבעת משולב בסגנון ייחודי, משובץ יהלומים בסדר עולה בחיתוך מרקיזה למראה עדין ומרשים.",
      "A distinctive combined bracelet-and-ring piece, set with graduated marquise-cut diamonds for a delicate, striking look."
    ),
    specs: [
      { label: lv("סוג פריט", "Piece Type"), value: lv("צמיד טבעת משולב / צמיד ג׳אדי", "Combined bracelet-ring / Jadi hand chain") },
      { label: CUT, value: lv("מרקיזה", "Marquise") },
      { label: DIAMOND_WEIGHT, value: ct("1.30") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-05.jpeg", alt: lv("צמיד טבעת ג׳אדי משובץ יהלומי מרקיזה של Maison MANA", "Jadi hand chain set with marquise diamonds by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "jadi-graduated-diamond-bracelet-ring-0-50ct": {
    id: "bracelet-product-06",
    slug: "jadi-graduated-diamond-bracelet-ring-0-50ct",
    group: "bracelets",
    title: lv("צמיד טבעת ג׳אדי יהלומים מדורג 0.50 קראט", "Jadi Graduated Diamond Hand Chain, 0.50 ct"),
    category: lv("צמידי טבעת", "Hand Chains"),
    price: 3400,
    priceLabel: "₪3,400",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxgqu/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טבעת משולב בסגנון ייחודי, משובץ יהלומים בסדר עולה ויורד במשקל כולל של 0.50 קראט.",
      "A distinctive combined bracelet-and-ring piece, set with graduated diamonds, 0.50 ct total weight."
    ),
    specs: [
      { label: lv("סוג פריט", "Piece Type"), value: lv("צמיד טבעת משולב / צמיד ג׳אדי", "Combined bracelet-ring / Jadi hand chain") },
      { label: DIAMOND_WEIGHT, value: ct("0.50") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-06.jpeg", alt: lv("צמיד טבעת ג׳אדי יהלומים מדורג 0.50 קראט של Maison MANA", "Jadi graduated diamond hand chain, 0.50 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "graduated-half-tennis-bracelet-0-70ct": {
    id: "bracelet-product-07",
    slug: "graduated-half-tennis-bracelet-0-70ct",
    group: "tennis",
    title: lv("צמיד חצי טניס מדורג 0.70 קראט", "Graduated Half Tennis Bracelet, 0.70 ct"),
    category: lv("צמידי חצי טניס", "Half Tennis Bracelets"),
    price: 3790,
    priceLabel: "₪3,790",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxnwv/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד זהב 14K בעיצוב יוקרתי של חצי טניס, משובץ יהלומים במשקלים שונים למראה מדורג ויוקרתי.",
      "A refined 14K gold half tennis bracelet, set with diamonds of varying weights for a graduated, luxurious look."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("0.70") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-07.jpeg", alt: lv("צמיד חצי טניס מדורג 0.70 קראט של Maison MANA", "Graduated half tennis bracelet, 0.70 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "two-initials-heart-diamond-bangle-0-70ct": {
    id: "bracelet-product-08",
    slug: "two-initials-heart-diamond-bangle-0-70ct",
    group: "personalized",
    title: lv("צמיד קשיח שתי אותיות ויהלום לב 0.70 קראט", "Bangle with Two Initials & Heart Diamond, 0.70 ct"),
    category: lv("צמידי בנגל", "Bangles"),
    price: 7200,
    priceLabel: "₪7,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxnyg/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד קשיח עשוי זהב 14K בעיצוב ייחודי, עם שתי אותיות משובצות יהלומים בתוספת יהלום לב מרכזי.",
      "A rigid 14K gold bangle in a distinctive design, with two diamond-set initials and a heart-shaped center diamond."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: BRACELET_TYPE, value: lv("קשיח", "Rigid") },
      { label: lv("יהלומי אותיות", "Initial Diamonds"), value: ct("0.20") },
      { label: lv("יהלום לב", "Heart Diamond"), value: ct("0.50") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.70") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-08.jpeg", alt: lv("צמיד קשיח עם שתי אותיות ויהלום לב 0.70 קראט של Maison MANA", "Rigid bangle with two initials and a heart diamond, 0.70 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, initialsOption],
  },
  "tennis-bracelet-marquise-pendant-2-2ct": {
    id: "bracelet-product-09",
    slug: "tennis-bracelet-marquise-pendant-2-2ct",
    group: "tennis",
    title: lv("צמיד טניס עם תליון מרקיזה 2.20 קראט", "Tennis Bracelet with Marquise Pendant, 2.20 ct"),
    category: lv("צמידי טניס", "Tennis Bracelets"),
    price: 6200,
    priceLabel: "₪6,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxoji/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טניס יוקרתי עשוי זהב 14K, משובץ יהלומים בתוספת תליון יהלום מרקיזה למראה ייחודי ובולט.",
      "A luxurious 14K gold tennis bracelet, set with diamonds and finished with a marquise diamond pendant for a distinctive, striking look."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: lv("משקל יהלומים בצמיד", "Diamond Weight on Bracelet"), value: ct("1.10") },
      { label: lv("תליון יהלום מרקיזה", "Marquise Diamond Pendant"), value: ct("1.00") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("2.20") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-09.jpeg", alt: lv("צמיד טניס עם תליון יהלום מרקיזה של Maison MANA", "Tennis bracelet with a marquise diamond pendant by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "name-pendant-diamond-bangle-0-40ct": {
    id: "bracelet-product-10",
    slug: "name-pendant-diamond-bangle-0-40ct",
    group: "personalized",
    title: lv("צמיד קשיח עם תליון שם יהלומים 0.40 קראט", "Bangle with Diamond Name Pendant, 0.40 ct"),
    category: lv("צמידי שם", "Name Bracelets"),
    price: 5790,
    priceLabel: "₪5,790",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxow9/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד קשיח עשוי זהב 14K עם תליון שם לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי השם.",
      "A rigid 14K gold bangle with a name pendant of your choice, set with diamonds — weight varies with the name."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: BRACELET_TYPE, value: lv("קשיח", "Rigid") },
      { label: PENDANT, value: lv("שם לבחירת הלקוח", "Name of your choice") },
      { label: DIAMOND_WEIGHT, value: lv("0.40 קראט, משתנה משם לשם", "0.40 ct, varies from name to name") },
      { label: lv("שם", "Name"), value: lv("עד 5 אותיות במחיר זהה", "Up to 5 letters at the same price") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-10.jpeg", alt: lv("צמיד קשיח עם תליון שם משובץ יהלומים של Maison MANA", "Rigid bangle with a diamond-set name pendant by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, nameOption],
  },
  "eight-diamonds-initial-bracelet-1ct": {
    id: "bracelet-product-11",
    slug: "eight-diamonds-initial-bracelet-1ct",
    group: "personalized",
    title: lv("צמיד 8 יהלומים ואות משובצת 1.00 קראט", "8-Diamond Bracelet with Set Initial, 1.00 ct"),
    category: lv("צמידי אותיות", "Initial Bracelets"),
    price: 6000,
    priceLabel: "₪6,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxox9/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד זהב 14K בעיצוב יוקרתי עם 8 יהלומים עגולים לאורך הצמיד, בתוספת אות משובצת יהלומים.",
      "A refined 14K gold bracelet with 8 round diamonds along its length, plus a diamond-set initial."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: lv("יהלומים לאורך הצמיד", "Diamonds Along the Bracelet"), value: lv("8 יהלומים עגולים, 0.10 קראט כל אחד", "8 round diamonds, 0.10 ct each") },
      { label: lv("משקל יהלומים לאורך הצמיד", "Diamond Weight Along the Bracelet"), value: ct("0.80") },
      { label: lv("אות משובצת", "Set Initial"), value: ct("0.20") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.00") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-11.jpeg", alt: lv("צמיד 8 יהלומים עם אות משובצת של Maison MANA", "8-diamond bracelet with a set initial by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, initialsOption],
  },
  "initial-pendant-diamond-bracelet-0-20ct": {
    id: "bracelet-product-12",
    slug: "initial-pendant-diamond-bracelet-0-20ct",
    group: "personalized",
    title: lv("צמיד תליון אות יהלומים 0.20 קראט", "Diamond Initial Pendant Bracelet, 0.20 ct"),
    category: lv("צמידי אותיות", "Initial Bracelets"),
    price: 2500,
    priceLabel: "₪2,500",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxptg/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד זהב 14K בעיצוב יוקרתי עם תליון אות לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי האות.",
      "A refined 14K gold bracelet with an initial pendant of your choice, set with diamonds — weight varies with the letter."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: PENDANT, value: lv("אות לבחירת הלקוח", "Initial of your choice") },
      { label: DIAMOND_WEIGHT, value: lv("0.20 קראט, משתנה מאות לאות", "0.20 ct, varies from letter to letter") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-12.jpeg", alt: lv("צמיד עם תליון אות משובצת יהלומים של Maison MANA", "Bracelet with a diamond-set initial pendant by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, initialsOption],
  },
  "gourmet-name-diamond-bracelet-0-40ct": {
    id: "bracelet-product-13",
    slug: "gourmet-name-diamond-bracelet-0-40ct",
    group: "personalized",
    title: lv("צמיד גורמט עם תליון שם יהלומים 0.40 קראט", "Curb Chain Bracelet with Diamond Name Pendant, 0.40 ct"),
    category: lv("צמידי גורמט", "Curb Chain Bracelets"),
    price: 4000,
    priceLabel: "₪4,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxq1u/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד גורמט עשוי זהב 14K עם תליון שם לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי השם.",
      "A 14K gold curb chain bracelet with a name pendant of your choice, set with diamonds — weight varies with the name."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: BRACELET_TYPE, value: lv("גורמט", "Curb chain") },
      { label: PENDANT, value: lv("שם לבחירת הלקוח", "Name of your choice") },
      { label: DIAMOND_WEIGHT, value: lv("0.40 קראט, משתנה משם לשם", "0.40 ct, varies from name to name") },
      { label: lv("שם", "Name"), value: lv("עד 5 אותיות במחיר זהה", "Up to 5 letters at the same price") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-13.jpeg", alt: lv("צמיד גורמט עם תליון שם משובץ יהלומים של Maison MANA", "Curb chain bracelet with a diamond-set name pendant by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, nameOption],
  },
  "oval-diamond-tennis-bracelet-7ct": {
    id: "bracelet-product-14",
    slug: "oval-diamond-tennis-bracelet-7ct",
    group: "tennis",
    title: lv("צמיד טניס יהלומי אובל 7.00 קראט", "7.00 ct Oval Diamond Tennis Bracelet"),
    category: lv("צמידי טניס", "Tennis Bracelets"),
    price: 9600,
    priceLabel: "₪9,600",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxq58/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טניס יוקרתי עשוי זהב 14K בעיצוב ייחודי ונדיר, משובץ יהלומים בחיתוך אובל במשקל כולל של 7.00 קראט.",
      "A luxurious 14K gold tennis bracelet in a rare, distinctive design, set with oval-cut diamonds, 7.00 ct total weight."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("7.00") },
      { label: CUT, value: lv("אובל", "Oval") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-14.jpeg", alt: lv("צמיד טניס יהלומי אובל 7.00 קראט של Maison MANA", "7.00 ct oval diamond tennis bracelet by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "tennis-bracelet-round-center-diamond-1-5ct": {
    id: "bracelet-product-15",
    slug: "tennis-bracelet-round-center-diamond-1-5ct",
    group: "tennis",
    title: lv("צמיד טניס עם יהלום מרכזי 1.50 קראט", "Tennis Bracelet with Center Diamond, 1.50 ct"),
    category: lv("צמידי טניס", "Tennis Bracelets"),
    price: 7290,
    priceLabel: "₪7,290",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxq91/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד טניס זהב 14K בעיצוב יוקרתי, משובץ יהלומים במשקל 1.00 קראט בתוספת אבן מרכזית עגולה במשקל 0.50 קראט.",
      "A refined 14K gold tennis bracelet set with 1.00 ct of diamonds, plus a 0.50 ct round center stone."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: lv("משקל יהלומים בצמיד", "Diamond Weight on Bracelet"), value: ct("1.00") },
      { label: lv("אבן מרכזית", "Center Stone"), value: lv("יהלום עגול 0.50 קראט", "0.50 ct round diamond") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.50") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-15.jpeg", alt: lv("צמיד טניס עם יהלום מרכזי 1.50 קראט של Maison MANA", "Tennis bracelet with a 1.50 ct center diamond by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "plate-half-tennis-bracelet-0-50ct": {
    id: "bracelet-product-16",
    slug: "plate-half-tennis-bracelet-0-50ct",
    group: "tennis",
    title: lv("צמיד חצי טניס פלטה 0.50 קראט", "Half Tennis Bracelet with Gold Plate, 0.50 ct"),
    category: lv("צמידי חצי טניס", "Half Tennis Bracelets"),
    price: 4800,
    priceLabel: "₪4,800",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxqkt/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד חצי טניס עשוי זהב 14K בעיצוב יוקרתי וייחודי, עם פלטת זהב משובצת יהלומים במשקל כולל של 0.50 קראט.",
      "A 14K gold half tennis bracelet in a refined, distinctive design, with a diamond-set gold plate, 0.50 ct total weight."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("0.50") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-16.jpeg", alt: lv("צמיד חצי טניס עם פלטת זהב משובצת יהלומים של Maison MANA", "Half tennis bracelet with a diamond-set gold plate by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "pear-diamond-bracelet-0-50ct": {
    id: "bracelet-product-17",
    slug: "pear-diamond-bracelet-0-50ct",
    group: "bracelets",
    title: lv("צמיד יהלום טיפה 0.50 קראט", "0.50 ct Pear Diamond Bracelet"),
    category: lv("צמידי יהלומים", "Diamond Bracelets"),
    price: 1900,
    priceLabel: "₪1,900",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxqyg/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד עשוי זהב 14K, משובץ יהלום בחיתוך טיפה במשקל 0.50 קראט למראה עדין ויוקרתי.",
      "A 14K gold bracelet set with a 0.50 ct pear-cut diamond for a delicate, refined look."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("0.50") },
      { label: CUT, value: lv("טיפה", "Pear") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VVS") },
    ],
    images: [
      { src: "/products/bracelet-product-17.jpeg", alt: lv("צמיד יהלום בחיתוך טיפה 0.50 קראט של Maison MANA", "0.50 ct pear-cut diamond bracelet by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "two-heart-diamond-bangle-1-20ct": {
    id: "bracelet-product-18",
    slug: "two-heart-diamond-bangle-1-20ct",
    group: "bangles",
    title: lv("צמיד בנגל שני יהלומי לב 1.20 קראט", "Bangle with Two Heart Diamonds, 1.20 ct"),
    category: lv("צמידי בנגל", "Bangles"),
    price: 7690,
    priceLabel: "₪7,690",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxr8o/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד בנגל קשיח עשוי זהב 14K, משובץ שני יהלומי לב במשקל 0.50 קראט כל אחד, בתוספת יהלומים משובצים לאורך הצמיד.",
      "A rigid 14K gold bangle set with two heart-shaped diamonds of 0.50 ct each, plus diamonds set along the bracelet."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: BRACELET_TYPE, value: lv("בנגל קשיח", "Rigid bangle") },
      { label: lv("יהלומי לב", "Heart Diamonds"), value: lv("2 יהלומים, 0.50 קראט כל אחד", "2 diamonds, 0.50 ct each") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.20") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-18.jpeg", alt: lv("צמיד בנגל עם שני יהלומי לב 1.20 קראט של Maison MANA", "Bangle with two heart diamonds, 1.20 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "half-tennis-bracelet-0-50ct": {
    id: "bracelet-product-19",
    slug: "half-tennis-bracelet-0-50ct",
    group: "tennis",
    title: lv("צמיד חצי טניס 0.50 קראט", "Half Tennis Bracelet, 0.50 ct"),
    category: lv("צמידי חצי טניס", "Half Tennis Bracelets"),
    price: 3000,
    priceLabel: "₪3,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/zkxs7d/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "צמיד חצי טניס עשוי זהב 14K, משובץ יהלומים במשקל כולל של 0.50 קראט למראה נקי ועדין.",
      "A 14K gold half tennis bracelet, set with diamonds totaling 0.50 ct for a clean, delicate look."
    ),
    specs: [
      { label: METAL, value: GOLD_14K },
      { label: DIAMOND_WEIGHT, value: ct("0.50") },
      { label: COLOR, value: same("D") },
      { label: CLARITY, value: same("VS") },
    ],
    images: [
      { src: "/products/bracelet-product-19.jpeg", alt: lv("צמיד חצי טניס 0.50 קראט של Maison MANA", "Half tennis bracelet, 0.50 ct, by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption],
  },
  "ring-product-02": {
    id: "ring-product-02",
    slug: "lab-grown-diamond-ring-round-oval-1-11ct",
    group: "rings",
    title: lv("טבעת יהלומי מעבדה 1.11 קראט", "1.11 ct Lab-Grown Diamond Ring"),
    category: lv("טבעות", "Rings"),
    price: 2900,
    priceLabel: "₪2,900",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd26b/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת זהב 14 קראט משובצת 1.11 קראט יהלומי מעבדה בשילוב עדין של חיתוכים עגולים ואובליים, היוצרים יחד קו נוצץ ואלגנטי במיוחד. העיצוב המדויק מעניק לטבעת נוכחות מרשימה אך קלאסית.",
      "A 14K gold ring set with 1.11 ct of lab-grown diamonds in a delicate mix of round and oval cuts, creating an exceptionally sparkling and elegant line."
    ),
    specs: [
      { label: METAL, value: lv("זהב 14K", "14K Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.11") },
      { label: lv("איכות", "Quality"), value: same("VS F-G") },
      { label: CUT, value: lv("עגול ואובל", "Round & Oval") },
    ],
    images: [
      { src: "/products/ring-product-02.jpg", alt: lv("טבעת יהלומי מעבדה 1.11 קראט של Maison MANA", "1.11 ct Lab-Grown Diamond Ring by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-03": {
    id: "ring-product-03",
    slug: "lab-grown-diamond-ring-round-1-00ct",
    group: "rings",
    title: lv("טבעת יהלומי מעבדה עגולים 1.00 קראט", "1.00 ct Round Lab-Grown Diamond Ring"),
    category: lv("טבעות", "Rings"),
    price: 3000,
    priceLabel: "₪3,000",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd2i7/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת יוקרתית בעיצוב מודרני ואלגנטי, עשויה זהב צהוב 14K ומשובצת יהלומי מעבדה עגולים לאורך הקשת המרכזית ובשני קצוות הטבעת.",
      "A luxurious ring in a modern and elegant design, crafted in 14K yellow gold and set with round lab-grown diamonds along the main arch and at both ends of the ring."
    ),
    specs: [
      { label: METAL, value: lv("זהב צהוב 14K", "14K Yellow Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.00") },
      { label: lv("איכות", "Quality"), value: same("D-F VVS") },
      { label: CUT, value: lv("עגול", "Round") },
    ],
    images: [
      { src: "/products/ring-product-03.jpg", alt: lv("טבעת יהלומי מעבדה עגולים 1.00 קראט של Maison MANA", "1.00 ct Round Lab-Grown Diamond Ring by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-04": {
    id: "ring-product-04",
    slug: "lab-grown-diamond-ring-round-0-45ct",
    group: "rings",
    title: lv("טבעת יהלומי מעבדה עגולים 0.45 קראט", "0.45 ct Round Lab-Grown Diamond Ring"),
    category: lv("טבעות", "Rings"),
    price: 3500,
    priceLabel: "₪3,500",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd2mt/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת יוקרתית בעיצוב אלגנטי ועל־זמני, עשויה זהב צהוב 14K ומשובצת שורת יהלומי מעבדה עגולים היוצרים ברק רציף ומרשים.",
      "A luxurious ring with an elegant and timeless design, crafted in 14K yellow gold and set with a row of round lab-grown diamonds that create a continuous, impressive brilliance."
    ),
    specs: [
      { label: METAL, value: lv("זהב צהוב 14K", "14K Yellow Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.45") },
      { label: lv("איכות", "Quality"), value: same("D-F VS") },
      { label: CUT, value: lv("עגול", "Round") },
    ],
    images: [
      { src: "/products/ring-product-04.jpg", alt: lv("טבעת יהלומי מעבדה עגולים 0.45 קראט של Maison MANA", "0.45 ct Round Lab-Grown Diamond Ring by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-05": {
    id: "ring-product-05",
    slug: "lab-grown-diamond-screw-ring-0-15ct",
    group: "rings",
    title: lv("טבעת בורג משובצת יהלומים", "Diamond Screw Ring, 0.15 ct"),
    category: lv("טבעות", "Rings"),
    price: 2900,
    priceLabel: "₪2,900",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd35w/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת זהב 14K מעוצבת בסגנון ייחודי של בורג, משובצת יהלומי מעבדה למראה מודרני ויוקרתי.",
      "A 14K gold ring featuring a unique screw-style design, set with lab-grown diamonds for a modern and luxurious look."
    ),
    specs: [
      { label: METAL, value: lv("זהב 14K", "14K Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.15") },
      { label: lv("איכות", "Quality"), value: same("D VS") },
    ],
    images: [
      { src: "/products/ring-product-05.jpg", alt: lv("טבעת בורג משובצת יהלומים של Maison MANA", "Diamond Screw Ring, 0.15 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-06": {
    id: "ring-product-06",
    slug: "pear-diamond-spiral-ring-1-60ct",
    group: "rings",
    title: lv("טבעת ספירלה יהלומי טיפות", "Pear Diamond Spiral Ring, 1.60 ct"),
    category: lv("טבעות", "Rings"),
    price: 4800,
    priceLabel: "₪4,800",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd3px/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת ספירלה יוקרתית עם שני יהלומי טיפה מרכזיים, המשלבת עיצוב זורם עם נוכחות מרשימה.",
      "A luxurious spiral ring featuring two center pear-shaped diamonds, combining a flowing design with an impressive presence."
    ),
    specs: [
      { label: METAL, value: lv("זהב 14K", "14K Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.60") },
      { label: lv("איכות", "Quality"), value: same("D VS") },
      { label: CUT, value: lv("טיפה", "Pear") },
    ],
    images: [
      { src: "/products/ring-product-06.jpg", alt: lv("טבעת ספירלה יהלומי טיפות של Maison MANA", "Pear Diamond Spiral Ring, 1.60 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-07": {
    id: "ring-product-07",
    slug: "fire-diamond-ring-0-50ct",
    group: "rings",
    title: lv("טבעת האש שלי משובצת יהלומים", "My Fire Diamond Ring, 0.50 ct"),
    category: lv("טבעות", "Rings"),
    price: 3200,
    priceLabel: "₪3,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd3uo/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת בעיצוב ייחודי בהשראת להבות אש, משובצת יהלומי מעבדה למראה מודרני.",
      "A uniquely designed ring inspired by flames of fire, set with lab-grown diamonds for a modern look."
    ),
    specs: [
      { label: METAL, value: lv("זהב 14K", "14K Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.50") },
      { label: lv("איכות", "Quality"), value: same("D VS") },
    ],
    images: [
      { src: "/products/ring-product-07.jpg", alt: lv("טבעת האש שלי משובצת יהלומים של Maison MANA", "My Fire Diamond Ring, 0.50 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-08": {
    id: "ring-product-08",
    slug: "designer-diamond-ring-0-90ct",
    group: "rings",
    title: lv("טבעת יהלומים מעוצבת", "Designer Diamond Ring, 0.90 ct"),
    category: lv("טבעות", "Rings"),
    price: 4300,
    priceLabel: "₪4,300",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd4bn/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת פתוחה יוקרתית בעלת ארבע זרועות מעוגלות ואלמנט טיפה משובץ.",
      "A luxurious open ring featuring four rounded bands and a set pear-shaped element."
    ),
    specs: [
      { label: METAL, value: lv("רוז גולד 14K", "14K Rose Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.90") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
    ],
    images: [
      { src: "/products/ring-product-08.jpg", alt: lv("טבעת יהלומים מעוצבת של Maison MANA", "Designer Diamond Ring, 0.90 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-09": {
    id: "ring-product-09",
    slug: "pear-diamond-branch-ring-0-45ct",
    group: "rings",
    title: lv("טבעת משולבת יהלומי טיפה", "Pear Diamond Branch Ring, 0.45 ct"),
    category: lv("טבעות", "Rings"),
    price: 2790,
    priceLabel: "₪2,790",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd4jw/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת פתוחה ועדינה בשילוב יהלומים עגולים ומרקיזה, בהשראת ענפים פורחים.",
      "A delicate open ring combining round and marquise diamonds, inspired by blooming branches."
    ),
    specs: [
      { label: METAL, value: lv("רוז גולד 14K", "14K Rose Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.45") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
    ],
    images: [
      { src: "/products/ring-product-09.jpg", alt: lv("טבעת משולבת יהלומי טיפה של Maison MANA", "Pear Diamond Branch Ring, 0.45 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-10": {
    id: "ring-product-10",
    slug: "heart-diamond-spiral-ring-0-30ct",
    group: "rings",
    title: lv("טבעת ספירלה משובצת יהלום לב", "Heart Diamond Spiral Ring, 0.30 ct"),
    category: lv("טבעות", "Rings"),
    price: 3200,
    priceLabel: "₪3,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd4su/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת מינימליסטית בעיצוב פתוח עם יהלום לב מרכזי.",
      "A minimalist open-design ring featuring a center heart-shaped diamond."
    ),
    specs: [
      { label: METAL, value: lv("זהב צהוב 14K", "14K Yellow Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.30") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
      { label: CUT, value: lv("לב", "Heart") },
    ],
    images: [
      { src: "/products/ring-product-10.jpg", alt: lv("טבעת ספירלה משובצת יהלום לב של Maison MANA", "Heart Diamond Spiral Ring, 0.30 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-11": {
    id: "ring-product-11",
    slug: "spiral-diamond-ring-1-00ct",
    group: "rings",
    title: lv("טבעת ספירלה משובצת יהלומים", "Spiral Diamond Ring, 1.00 ct"),
    category: lv("טבעות", "Rings"),
    price: 4200,
    priceLabel: "₪4,200",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd5fd/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת פתוחה בעיצוב מודרני עם יהלומים עגולים בגדלים משתנים.",
      "A modern open-design ring with round diamonds in varying sizes."
    ),
    specs: [
      { label: METAL, value: lv("זהב לבן 14K", "14K White Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.00") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
    ],
    images: [
      { src: "/products/ring-product-11.jpg", alt: lv("טבעת ספירלה משובצת יהלומים של Maison MANA", "Spiral Diamond Ring, 1.00 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-12": {
    id: "ring-product-12",
    slug: "pear-diamond-open-ring-1-00ct",
    group: "rings",
    title: lv("טבעת יהלומי טיפה", "Pear Diamond Open Ring, 1.00 ct"),
    category: lv("טבעות", "Rings"),
    price: 5400,
    priceLabel: "₪5,400",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd5dh/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת פתוחה יוקרתית בשילוב יהלומי טיפה.",
      "A luxurious open ring combining pear-shaped diamonds."
    ),
    specs: [
      { label: METAL, value: lv("רוז גולד 14K", "14K Rose Gold") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("1.00") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
      { label: CUT, value: lv("טיפה", "Pear") },
    ],
    images: [
      { src: "/products/ring-product-12.jpg", alt: lv("טבעת יהלומי טיפה של Maison MANA", "Pear Diamond Open Ring, 1.00 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  },
  "ring-product-13": {
    id: "ring-product-13",
    slug: "half-eternity-diamond-ring-0-30ct",
    group: "rings",
    title: lv("טבעת חצי איטרניטי משובצת יהלומים", "Half Eternity Diamond Ring, 0.30 ct"),
    category: lv("טבעות", "Rings"),
    price: 1600,
    priceLabel: "₪1,600",
    paymentUrl: "https://pay.sumit.co.il/cozxmk/zkm4wo/znd5j8/payment/",
    isPurchasable: true,
    shortDescription: lv(
      "טבעת נצח קלאסית ועדינה, משובצת שורת יהלומי מעבדה לאורך חלקה העליון.",
      "A classic and delicate eternity ring, set with a row of lab-grown diamonds along its top half."
    ),
    specs: [
      { label: METAL, value: lv("זהב לבן 14K", "14K White Gold") },
      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("יהלומי מעבדה", "Lab-grown diamonds") },
      { label: TOTAL_DIAMOND_WEIGHT, value: ct("0.30") },
      { label: lv("איכות", "Quality"), value: same("D-F VS1-VVS2") },
    ],
    images: [
      { src: "/products/ring-product-13.jpg", alt: lv("טבעת חצי איטרניטי משובצת יהלומים של Maison MANA", "Half Eternity Diamond Ring, 0.30 ct by Maison MANA") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [ringSizeOption],
  }
};

export type CatalogCategory =
  | "rings"
  | "bracelets"
  | "tennis-bracelets"
  | "necklaces"
  | "earrings"
  | "mens"
  | "high-jewelry"
  | "signature";

const CATALOG_CATEGORY_GROUPS: Record<CatalogCategory, ProductGroup[]> = {
  rings: ["rings"],
  bracelets: ["tennis", "bangles", "personalized", "bracelets"],
  "tennis-bracelets": ["tennis"],
  necklaces: [],
  earrings: [],
  mens: [],
  "high-jewelry": [],
  signature: [],
};

export function canCheckoutProduct(product: Product): boolean {
  return product.isPurchasable !== false && Boolean(product.paymentUrl);
}

const FEATURED_PRODUCT_SLUGS: Partial<Record<CatalogCategory, string[]>> = {
  rings: ["lab-diamond-ring-2-30ct"],
  bracelets: [
    "natural-diamond-tennis-bracelet-1ct",
    "round-diamond-bangle-bracelet-1-5ct",
    "initial-pendant-diamond-bracelet-0-20ct",
    "pear-diamond-bracelet-0-50ct",
  ],
  "tennis-bracelets": [
    "natural-diamond-tennis-bracelet-1ct",
    "half-tennis-bracelet-11-diamonds-1-1ct",
    "oval-diamond-tennis-bracelet-7ct",
    "tennis-bracelet-round-center-diamond-1-5ct",
  ],
};

export function getOrderableProducts(): Product[] {
  return Object.values(products);
}

export function getProductsByCatalogCategory(category: CatalogCategory): Product[] {
  const groups = CATALOG_CATEGORY_GROUPS[category];
  return getOrderableProducts().filter((product) => groups.includes(product.group));
}

export function getFeaturedProductsByCategory(category: CatalogCategory, limit = 4): Product[] {
  const featured = FEATURED_PRODUCT_SLUGS[category]
    ?.map((slug) => products[slug])
    .filter((product): product is Product => Boolean(product));

  const source = featured && featured.length > 0 ? featured : getProductsByCatalogCategory(category);
  return source.slice(0, limit);
}
