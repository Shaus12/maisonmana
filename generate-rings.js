const fs = require('fs');

const rings = [
  {
    id: "ring-product-02",
    slug: "lab-grown-diamond-ring-round-oval-1-11ct",
    titleHe: "טבעת יהלומי מעבדה 1.11 קראט",
    titleEn: "1.11 ct Lab-Grown Diamond Ring",
    price: 2900,
    priceLabel: "₪2,900",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "1.11",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "VS F-G",
    shapeHe: "עגול ואובל",
    shapeEn: "Round & Oval",
    descHe: "טבעת זהב 14 קראט משובצת 1.11 קראט יהלומי מעבדה בשילוב עדין של חיתוכים עגולים ואובליים, היוצרים יחד קו נוצץ ואלגנטי במיוחד. העיצוב המדויק מעניק לטבעת נוכחות מרשימה אך קלאסית.",
    descEn: "A 14K gold ring set with 1.11 ct of lab-grown diamonds in a delicate mix of round and oval cuts, creating an exceptionally sparkling and elegant line. The precise design gives the ring an impressive yet classic presence."
  },
  {
    id: "ring-product-03",
    slug: "lab-grown-diamond-ring-round-1-00ct",
    titleHe: "טבעת יהלומי מעבדה עגולים 1.00 קראט",
    titleEn: "1.00 ct Round Lab-Grown Diamond Ring",
    price: 3000,
    priceLabel: "₪3,000",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "1.00",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "D-F VVS",
    shapeHe: "עגול",
    shapeEn: "Round",
    descHe: "טבעת יוקרתית בעיצוב מודרני ואלגנטי, עשויה זהב צהוב 14K ומשובצת יהלומי מעבדה עגולים לאורך הקשת המרכזית ובשני קצוות הטבעת.",
    descEn: "A luxurious ring in a modern and elegant design, crafted in 14K yellow gold and set with round lab-grown diamonds along the main arch and at both ends of the ring."
  },
  {
    id: "ring-product-04",
    slug: "lab-grown-diamond-ring-round-0-45ct",
    titleHe: "טבעת יהלומי מעבדה עגולים 0.45 קראט",
    titleEn: "0.45 ct Round Lab-Grown Diamond Ring",
    price: 3500,
    priceLabel: "₪3,500",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "0.45",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "D-F VS",
    shapeHe: "עגול",
    shapeEn: "Round",
    descHe: "טבעת יוקרתית בעיצוב אלגנטי ועל־זמני, עשויה זהב צהוב 14K ומשובצת שורת יהלומי מעבדה עגולים היוצרים ברק רציף ומרשים.",
    descEn: "A luxurious ring with an elegant and timeless design, crafted in 14K yellow gold and set with a row of round lab-grown diamonds that create a continuous, impressive brilliance."
  },
  {
    id: "ring-product-05",
    slug: "lab-grown-diamond-screw-ring-0-15ct",
    titleHe: "טבעת בורג משובצת יהלומים",
    titleEn: "Diamond Screw Ring, 0.15 ct",
    price: 2900,
    priceLabel: "₪2,900",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "0.15",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "D VS",
    descHe: "טבעת זהב 14K מעוצבת בסגנון ייחודי של בורג, משובצת יהלומי מעבדה למראה מודרני ויוקרתי.",
    descEn: "A 14K gold ring featuring a unique screw-style design, set with lab-grown diamonds for a modern and luxurious look."
  },
  {
    id: "ring-product-06",
    slug: "pear-diamond-spiral-ring-1-60ct",
    titleHe: "טבעת ספירלה יהלומי טיפות",
    titleEn: "Pear Diamond Spiral Ring, 1.60 ct",
    price: 4800,
    priceLabel: "₪4,800",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "1.60",
    diamondQuality: "D VS",
    shapeHe: "טיפה",
    shapeEn: "Pear",
    descHe: "טבעת ספירלה יוקרתית עם שני יהלומי טיפה מרכזיים, המשלבת עיצוב זורם עם נוכחות מרשימה.",
    descEn: "A luxurious spiral ring featuring two center pear-shaped diamonds, combining a flowing design with an impressive presence."
  },
  {
    id: "ring-product-07",
    slug: "fire-diamond-ring-0-50ct",
    titleHe: "טבעת האש שלי משובצת יהלומים",
    titleEn: "My Fire Diamond Ring, 0.50 ct",
    price: 3200,
    priceLabel: "₪3,200",
    gold: "14K",
    goldEn: "14K Gold",
    diamondWeight: "0.50",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "D VS",
    descHe: "טבעת בעיצוב ייחודי בהשראת להבות אש, משובצת יהלומי מעבדה למראה מודרני.",
    descEn: "A uniquely designed ring inspired by flames of fire, set with lab-grown diamonds for a modern look."
  },
  {
    id: "ring-product-08",
    slug: "designer-diamond-ring-0-90ct",
    titleHe: "טבעת יהלומים מעוצבת",
    titleEn: "Designer Diamond Ring, 0.90 ct",
    price: 4300,
    priceLabel: "₪4,300",
    gold: "זהב אדום 14K",
    goldEn: "14K Rose Gold",
    diamondWeight: "0.90",
    diamondQuality: "D-F VS1-VVS2",
    descHe: "טבעת פתוחה יוקרתית בעלת ארבע זרועות מעוגלות ואלמנט טיפה משובץ.",
    descEn: "A luxurious open ring featuring four rounded bands and a set pear-shaped element."
  },
  {
    id: "ring-product-09",
    slug: "pear-diamond-branch-ring-0-45ct",
    titleHe: "טבעת משולבת יהלומי טיפה",
    titleEn: "Pear Diamond Branch Ring, 0.45 ct",
    price: 2790,
    priceLabel: "₪2,790",
    gold: "זהב אדום 14K",
    goldEn: "14K Rose Gold",
    diamondWeight: "0.45",
    diamondQuality: "D-F VS1-VVS2",
    descHe: "טבעת פתוחה ועדינה בשילוב יהלומים עגולים ומרקיזה, בהשראת ענפים פורחים.",
    descEn: "A delicate open ring combining round and marquise diamonds, inspired by blooming branches."
  },
  {
    id: "ring-product-10",
    slug: "heart-diamond-spiral-ring-0-30ct",
    titleHe: "טבעת ספירלה משובצת יהלום לב",
    titleEn: "Heart Diamond Spiral Ring, 0.30 ct",
    price: 3200,
    priceLabel: "₪3,200",
    gold: "זהב צהוב 14K",
    goldEn: "14K Yellow Gold",
    diamondWeight: "0.30",
    diamondQuality: "D-F VS1-VVS2",
    shapeHe: "לב",
    shapeEn: "Heart",
    descHe: "טבעת מינימליסטית בעיצוב פתוח עם יהלום לב מרכזי.",
    descEn: "A minimalist open-design ring featuring a center heart-shaped diamond."
  },
  {
    id: "ring-product-11",
    slug: "spiral-diamond-ring-1-00ct",
    titleHe: "טבעת ספירלה משובצת יהלומים",
    titleEn: "Spiral Diamond Ring, 1.00 ct",
    price: 4200,
    priceLabel: "₪4,200",
    gold: "זהב לבן 14K",
    goldEn: "14K White Gold",
    diamondWeight: "1.00",
    diamondQuality: "D-F VS1-VVS2",
    descHe: "טבעת פתוחה בעיצוב מודרני עם יהלומים עגולים בגדלים משתנים.",
    descEn: "A modern open-design ring with round diamonds in varying sizes."
  },
  {
    id: "ring-product-12",
    slug: "pear-diamond-open-ring-1-00ct",
    titleHe: "טבעת יהלומי טיפה",
    titleEn: "Pear Diamond Open Ring, 1.00 ct",
    price: 5400,
    priceLabel: "₪5,400",
    gold: "זהב אדום 14K",
    goldEn: "14K Rose Gold",
    diamondWeight: "1.00",
    diamondQuality: "D-F VS1-VVS2",
    shapeHe: "טיפה",
    shapeEn: "Pear",
    descHe: "טבעת פתוחה יוקרתית בשילוב יהלומי טיפה.",
    descEn: "A luxurious open ring combining pear-shaped diamonds."
  },
  {
    id: "ring-product-13",
    slug: "half-eternity-diamond-ring-0-30ct",
    titleHe: "טבעת חצי איטרניטי משובצת יהלומים",
    titleEn: "Half Eternity Diamond Ring, 0.30 ct",
    price: 1600,
    priceLabel: "₪1,600",
    gold: "זהב לבן 14K",
    goldEn: "14K White Gold",
    diamondWeight: "0.30",
    diamondTypeHe: "יהלומי מעבדה",
    diamondTypeEn: "Lab-grown diamonds",
    diamondQuality: "D-F VS1-VVS2",
    descHe: "טבעת נצח קלאסית ועדינה, משובצת שורת יהלומי מעבדה לאורך חלקה העליון.",
    descEn: "A classic and delicate eternity ring, set with a row of lab-grown diamonds along its top half."
  }
];

let output = '';

for (const r of rings) {
  output += `  "${r.id}": {
    id: "${r.id}",
    slug: "${r.slug}",
    group: "rings",
    title: lv("${r.titleHe}", "${r.titleEn}"),
    category: lv("טבעות", "Rings"),
    price: ${r.price},
    priceLabel: "${r.priceLabel}",
    isPurchasable: true,
    shortDescription: lv(
      "${r.descHe}",
      "${r.descEn}"
    ),
    specs: [
      { label: METAL, value: lv("${r.gold}", "${r.goldEn}") },`;
      
  if (r.diamondTypeHe) {
    output += `\n      { label: lv("סוג יהלומים", "Diamond Type"), value: lv("${r.diamondTypeHe}", "${r.diamondTypeEn}") },`;
  }
  
  if (r.diamondWeight) {
    output += `\n      { label: TOTAL_DIAMOND_WEIGHT, value: ct("${r.diamondWeight}") },`;
  }

  if (r.diamondQuality) {
    const qualityParts = r.diamondQuality.split(' ');
    let color = '';
    let clarity = '';
    
    // Attempt basic parse of color/clarity from "D-F VVS" or similar
    if (r.diamondQuality.includes('VS') || r.diamondQuality.includes('VVS')) {
       // Just put it entirely in "איכות" or separate them. Let's just put it as quality.
       output += `\n      { label: lv("איכות", "Quality"), value: same("${r.diamondQuality}") },`;
    }
  }

  if (r.shapeHe) {
    output += `\n      { label: CUT, value: lv("${r.shapeHe}", "${r.shapeEn}") },`;
  }
  
  output += `
    ],
    images: [
      { src: "/products/${r.id}-main.jpg", alt: lv("${r.titleHe} של Maison MANA", "${r.titleEn} by Maison MANA") },
      { src: "/products/${r.id}-hand.jpg", alt: lv("${r.titleHe} על היד", "${r.titleEn} on the hand") },
    ],
    availability: AVAILABLE,
    ctaLabel: CTA,
    options: [goldColorOption, ringSizeOption],
  },
`;
}

fs.writeFileSync('/Users/user/Dev/maisonmana/generated-rings.ts', output);
