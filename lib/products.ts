export type ProductOption =
  | {
      type: "select";
      name: string;
      label: string;
      options: string[];
    }
  | {
      type: "text";
      name: string;
      label: string;
      placeholder?: string;
      note?: string;
    };

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  collection?: string;
  price: number;
  priceLabel: string;
  shortDescription: string;
  specs: ProductSpec[];
  images: (string | { src: string; alt: string })[];
  availability: string;
  ctaLabel: string;
  options?: ProductOption[];
  note?: string;
};

export const products: Record<string, Product> = {
  "lab-diamond-ring-2-30ct": {
    slug: "lab-diamond-ring-2-30ct",
    title: "טבעת יהלום מעבדה 2.30 קראט",
    category: "טבעות יהלום",
    price: 4500,
    priceLabel: "₪4,500",
    shortDescription: "טבעת יהלום בעיצוב קלאסי עם אבן מרכזית 2 קראט יהלום מעבדה, בליווי אבני צד עדינות. שילוב נקי, יוקרתי ומדויק למראה אלגנטי ועל־זמני.",
    specs: [
      { label: "משקל זהב משוער", value: "כ־2 גרם, משתנה לפי מידת האצבע" },
      { label: "אבן מרכזית", value: "יהלום מעבדה 2 קראט" },
      { label: "צבע אבן מרכזית", value: "D–E" },
      { label: "ניקיון אבן מרכזית", value: "VS1" },
      { label: "תעודה", value: "IGI" },
      { label: "אבני צד", value: "יהלומי מעבדה 0.30 קראט" },
      { label: "צבע אבני צד", value: "D" },
      { label: "ניקיון אבני צד", value: "VS1" },
      { label: "סה״כ יהלומים בטבעת", value: "2.30 קראט" }
    ],
    images: [
      {
        src: "/products/lab-diamond-ring-2-30ct-main.jpg",
        alt: "טבעת יהלום מעבדה 2.30 קראט עם אבן מרכזית ואבני צד של Maison MANA"
      },
      {
        src: "/products/lab-diamond-ring-2-30ct-hand.jpg",
        alt: "טבעת יהלום מעבדה 2.30 קראט על היד להמחשת מראה ומידה"
      }
    ],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה"
  },
  "natural-diamond-tennis-bracelet-1ct": {
    id: "bracelet-product-01",
    slug: "natural-diamond-tennis-bracelet-1ct",
    title: "צמיד טניס יהלומים טבעיים 1.00 קראט",
    category: "צמידי טניס",
    price: 4800,
    priceLabel: "₪4,800",
    shortDescription: "צמיד טניס מרשים המשובץ יהלומים טבעיים בחיתוך עגול במשקל כולל של 1.00 קראט, באיכות F/VS, למראה יוקרתי ומיוחד.",
    specs: [
      { label: "משקל יהלומים", value: "1.00 קראט" },
      { label: "סוג יהלומים", value: "יהלומים טבעיים" },
      { label: "איכות", value: "F/VS" },
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "צורת חיתוך", value: "עגול" },
      { label: "הערה", value: "מספר היהלומים עשוי להשתנות בהתאם להיקף היד. מספר היהלומים ומשקלם הינו הערכה." },
    ],
    images: ["/products/bracelet-product-01.jpeg", "/products/bracelet-product-01-2.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "half-tennis-bracelet-11-diamonds-1-1ct": {
    id: "bracelet-product-02",
    slug: "half-tennis-bracelet-11-diamonds-1-1ct",
    title: "צמיד חצי טניס 11 יהלומים 1.10 קראט",
    category: "צמידי חצי טניס",
    price: 4000,
    priceLabel: "₪4,000",
    shortDescription: "צמיד חצי טניס עשוי זהב 14K בעיצוב יוקרתי וייחודי, משובץ 11 יהלומים במשקל 0.10 קראט כל אחד.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "מספר יהלומים", value: "11 יהלומים" },
      { label: "משקל כל יהלום", value: "0.10 קראט" },
      { label: "משקל יהלומים כולל", value: "1.10 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-02.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "custom-shape-diamond-bracelet-1ct": {
    id: "bracelet-product-03",
    slug: "custom-shape-diamond-bracelet-1ct",
    title: "צמיד יהלום לבחירת הלקוח 1.00 קראט",
    category: "צמידי יהלומים",
    price: 3000,
    priceLabel: "₪3,000",
    shortDescription: "צמיד זהב 14K בעיצוב יוקרתי המשובץ יהלום מרכזי במשקל 1.00 קראט, עם אפשרות בחירת צורת היהלום לפי העדפת הלקוח.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "1.00 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
      { label: "צורות לבחירה", value: "עגול, אובל, טיפה, אמרלד, רדיאנט, מרקיזה, לב" },
    ],
    images: ["/products/bracelet-product-03.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "select",
      name: "diamondShape",
      label: "בחירת צורת יהלום",
      options: ["עגול", "אובל", "טיפה", "אמרלד", "רדיאנט", "מרקיזה", "לב"]
    },
    ]
  },
  "round-diamond-bangle-bracelet-1-5ct": {
    id: "bracelet-product-04",
    slug: "round-diamond-bangle-bracelet-1-5ct",
    title: "צמיד בנגל קשיח יהלום עגול 1.50 קראט",
    category: "צמידי בנגל",
    price: 6200,
    priceLabel: "₪6,200",
    shortDescription: "צמיד בנגל קשיח עשוי זהב 14K בעיצוב יוקרתי וסגנון ייחודי, משובץ יהלום עגול במשקל 1.50 קראט.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "סוג צמיד", value: "בנגל קשיח" },
      { label: "משקל יהלומים", value: "1.50 קראט" },
      { label: "צורת חיתוך", value: "עגול" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-04.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "jadi-marquise-diamond-bracelet-ring-1-30ct": {
    id: "bracelet-product-05",
    slug: "jadi-marquise-diamond-bracelet-ring-1-30ct",
    title: "צמיד טבעת ג׳אדי יהלומי מרקיזה",
    category: "צמיד טבעת",
    price: 4000,
    priceLabel: "₪4,000",
    shortDescription: "צמיד טבעת משולב בסגנון ייחודי, משובץ יהלומים בסדר עולה בחיתוך מרקיזה למראה עדין ומרשים.",
    specs: [
      { label: "סוג פריט", value: "צמיד טבעת משולב / צמיד ג׳אדי" },
      { label: "צורת חיתוך", value: "מרקיזה" },
      { label: "משקל יהלומים", value: "1.30 קראט לפי המפרט שנמסר" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
      { label: "הערה", value: "בתיאור המקורי נמסר גם משקל כולל של 0.90 קראט. יש לאמת מול הלקוח לפני פרסום סופי אם נדרש." },
    ],
    images: ["/products/bracelet-product-05.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "jadi-graduated-diamond-bracelet-ring-0-50ct": {
    id: "bracelet-product-06",
    slug: "jadi-graduated-diamond-bracelet-ring-0-50ct",
    title: "צמיד טבעת ג׳אדי יהלומים מדורג 0.50 קראט",
    category: "צמיד טבעת",
    price: 3400,
    priceLabel: "₪3,400",
    shortDescription: "צמיד טבעת משולב בסגנון ייחודי, משובץ יהלומים בסדר עולה ויורד במשקל כולל של 0.50 קראט.",
    specs: [
      { label: "סוג פריט", value: "צמיד טבעת משולב / צמיד ג׳אדי" },
      { label: "משקל יהלומים", value: "0.50 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
    ],
    images: ["/products/bracelet-product-06.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "graduated-half-tennis-bracelet-0-70ct": {
    id: "bracelet-product-07",
    slug: "graduated-half-tennis-bracelet-0-70ct",
    title: "צמיד חצי טניס מדורג 0.70 קראט",
    category: "צמידי חצי טניס",
    price: 3790,
    priceLabel: "₪3,790",
    shortDescription: "צמיד זהב 14K בעיצוב יוקרתי של חצי טניס, משובץ יהלומים במשקלים שונים למראה מדורג ויוקרתי.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "0.70 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-07.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "two-initials-heart-diamond-bangle-0-70ct": {
    id: "bracelet-product-08",
    slug: "two-initials-heart-diamond-bangle-0-70ct",
    title: "צמיד קשיח שתי אותיות ויהלום לב 0.70 קראט",
    category: "צמידי בנגל",
    price: 7200,
    priceLabel: "₪7,200",
    shortDescription: "צמיד קשיח עשוי זהב 14K בעיצוב ייחודי, עם שתי אותיות משובצות יהלומים בתוספת יהלום לב מרכזי.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "סוג צמיד", value: "קשיח" },
      { label: "יהלומי אותיות", value: "0.20 קראט" },
      { label: "יהלום לב", value: "0.50 קראט" },
      { label: "משקל יהלומים כולל", value: "0.70 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-08.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "text",
      name: "initials",
      label: "בחירת אותיות",
      placeholder: "לדוגמה: A M",
      note: "ניתן לבחור אותיות לשיבוץ בהתאם לעיצוב."
    },
    ]
  },
  "tennis-bracelet-marquise-pendant-2-2ct": {
    id: "bracelet-product-09",
    slug: "tennis-bracelet-marquise-pendant-2-2ct",
    title: "צמיד טניס עם תליון מרקיזה 2.20 קראט",
    category: "צמידי טניס",
    price: 6200,
    priceLabel: "₪6,200",
    shortDescription: "צמיד טניס יוקרתי עשוי זהב 14K, משובץ יהלומים בתוספת תליון יהלום מרקיזה למראה ייחודי ובולט.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים בצמיד", value: "1.10 קראט" },
      { label: "תליון יהלום מרקיזה", value: "1.00 קראט" },
      { label: "משקל יהלומים כולל", value: "2.20 קראט לפי הנתון שנמסר" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
      { label: "הערה", value: "יש לאמת את הסה״כ מול הלקוח, מאחר ש־1.10 + 1.00 שווה 2.10 קראט." },
    ],
    images: ["/products/bracelet-product-09.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "name-pendant-diamond-bangle-0-40ct": {
    id: "bracelet-product-10",
    slug: "name-pendant-diamond-bangle-0-40ct",
    title: "צמיד קשיח עם תליון שם יהלומים 0.40 קראט",
    category: "צמידי שם",
    price: 5790,
    priceLabel: "₪5,790",
    shortDescription: "צמיד קשיח עשוי זהב 14K עם תליון שם לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי השם.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "סוג צמיד", value: "קשיח" },
      { label: "תליון", value: "שם לבחירת הלקוח" },
      { label: "משקל יהלומים", value: "0.40 קראט, משתנה משם לשם" },
      { label: "שם", value: "עד 5 אותיות במחיר זהה" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-10.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "text",
      name: "nameText",
      label: "שם לבחירה",
      placeholder: "הקלידו שם עד 5 אותיות",
      note: "עד 5 אותיות במחיר זהה, בהתאם לפרטי המוצר."
    },
    ]
  },
  "eight-diamonds-initial-bracelet-1ct": {
    id: "bracelet-product-11",
    slug: "eight-diamonds-initial-bracelet-1ct",
    title: "צמיד 8 יהלומים ואות משובצת 1.00 קראט",
    category: "צמידי אותיות",
    price: 6000,
    priceLabel: "₪6,000",
    shortDescription: "צמיד זהב 14K בעיצוב יוקרתי עם 8 יהלומים עגולים לאורך הצמיד, בתוספת אות משובצת יהלומים.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "יהלומים לאורך הצמיד", value: "8 יהלומים עגולים, 0.10 קראט כל אחד" },
      { label: "משקל יהלומים לאורך הצמיד", value: "0.80 קראט" },
      { label: "אות משובצת", value: "0.20 קראט" },
      { label: "משקל יהלומים כולל", value: "1.00 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-11.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "text",
      name: "initials",
      label: "בחירת אותיות",
      placeholder: "לדוגמה: A M",
      note: "ניתן לבחור אותיות לשיבוץ בהתאם לעיצוב."
    },
    ]
  },
  "initial-pendant-diamond-bracelet-0-20ct": {
    id: "bracelet-product-12",
    slug: "initial-pendant-diamond-bracelet-0-20ct",
    title: "צמיד תליון אות יהלומים 0.20 קראט",
    category: "צמידי אותיות",
    price: 2500,
    priceLabel: "₪2,500",
    shortDescription: "צמיד זהב 14K בעיצוב יוקרתי עם תליון אות לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי האות.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "תליון", value: "אות לבחירת הלקוח" },
      { label: "משקל יהלומים", value: "0.20 קראט, משתנה מאות לאות" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-12.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "text",
      name: "initials",
      label: "בחירת אותיות",
      placeholder: "לדוגמה: A M",
      note: "ניתן לבחור אותיות לשיבוץ בהתאם לעיצוב."
    },
    ]
  },
  "gourmet-name-diamond-bracelet-0-40ct": {
    id: "bracelet-product-13",
    slug: "gourmet-name-diamond-bracelet-0-40ct",
    title: "צמיד גורמט עם תליון שם יהלומים 0.40 קראט",
    category: "צמידי גורמט",
    price: 4000,
    priceLabel: "₪4,000",
    shortDescription: "צמיד גורמט עשוי זהב 14K עם תליון שם לבחירת הלקוח, משובץ יהלומים במשקל משתנה לפי השם.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "סוג צמיד", value: "גורמט" },
      { label: "תליון", value: "שם לבחירת הלקוח" },
      { label: "משקל יהלומים", value: "0.40 קראט, משתנה משם לשם" },
      { label: "שם", value: "עד 5 אותיות במחיר זהה" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-13.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
      {
      type: "text",
      name: "nameText",
      label: "שם לבחירה",
      placeholder: "הקלידו שם עד 5 אותיות",
      note: "עד 5 אותיות במחיר זהה, בהתאם לפרטי המוצר."
    },
    ]
  },
  "oval-diamond-tennis-bracelet-7ct": {
    id: "bracelet-product-14",
    slug: "oval-diamond-tennis-bracelet-7ct",
    title: "צמיד טניס יהלומי אובל 7.00 קראט",
    category: "צמידי טניס",
    price: 9600,
    priceLabel: "₪9,600",
    shortDescription: "צמיד טניס יוקרתי עשוי זהב 14K בעיצוב ייחודי ונדיר, משובץ יהלומים בחיתוך אובל במשקל כולל של 7.00 קראט.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "7.00 קראט" },
      { label: "צורת חיתוך", value: "אובל" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-14.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "tennis-bracelet-round-center-diamond-1-5ct": {
    id: "bracelet-product-15",
    slug: "tennis-bracelet-round-center-diamond-1-5ct",
    title: "צמיד טניס עם יהלום מרכזי 1.50 קראט",
    category: "צמידי טניס",
    price: 7290,
    priceLabel: "₪7,290",
    shortDescription: "צמיד טניס זהב 14K בעיצוב יוקרתי, משובץ יהלומים במשקל 1.00 קראט בתוספת אבן מרכזית עגולה במשקל 0.50 קראט.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים בצמיד", value: "1.00 קראט" },
      { label: "אבן מרכזית", value: "יהלום עגול 0.50 קראט" },
      { label: "משקל יהלומים כולל", value: "1.50 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
    ],
    images: ["/products/bracelet-product-15.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "plate-half-tennis-bracelet-0-50ct": {
    id: "bracelet-product-16",
    slug: "plate-half-tennis-bracelet-0-50ct",
    title: "צמיד חצי טניס פלטה 0.50 קראט",
    category: "צמידי חצי טניס",
    price: 4800,
    priceLabel: "₪4,800",
    shortDescription: "צמיד חצי טניס עשוי זהב 14K בעיצוב יוקרתי וייחודי, עם פלטת זהב משובצת יהלומים במשקל כולל של 0.50 קראט.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "0.50 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
    ],
    images: ["/products/bracelet-product-16.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "pear-diamond-bracelet-0-50ct": {
    id: "bracelet-product-17",
    slug: "pear-diamond-bracelet-0-50ct",
    title: "צמיד יהלום טיפה 0.50 קראט",
    category: "צמידי יהלומים",
    price: 1900,
    priceLabel: "₪1,900",
    shortDescription: "צמיד עשוי זהב 14K, משובץ יהלום בחיתוך טיפה במשקל 0.50 קראט למראה עדין ויוקרתי.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "0.50 קראט" },
      { label: "צורת חיתוך", value: "טיפה" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VVS" },
    ],
    images: ["/products/bracelet-product-17.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "two-heart-diamond-bangle-1-20ct": {
    id: "bracelet-product-18",
    slug: "two-heart-diamond-bangle-1-20ct",
    title: "צמיד בנגל שני יהלומי לב 1.20 קראט",
    category: "צמידי בנגל",
    price: 7690,
    priceLabel: "₪7,690",
    shortDescription: "צמיד בנגל קשיח עשוי זהב 14K, משובץ שני יהלומי לב במשקל 0.50 קראט כל אחד, בתוספת יהלומים משובצים לאורך הצמיד.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "סוג צמיד", value: "בנגל קשיח" },
      { label: "יהלומי לב", value: "2 יהלומים, 0.50 קראט כל אחד" },
      { label: "משקל יהלומים כולל", value: "1.20 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
    ],
    images: ["/products/bracelet-product-18.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },
  "half-tennis-bracelet-0-50ct": {
    id: "bracelet-product-19",
    slug: "half-tennis-bracelet-0-50ct",
    title: "צמיד חצי טניס 0.50 קראט",
    category: "צמידי חצי טניס",
    price: 3000,
    priceLabel: "₪3,000",
    shortDescription: "צמיד חצי טניס עשוי זהב 14K, משובץ יהלומים במשקל כולל של 0.50 קראט למראה נקי ועדין.",
    specs: [
      { label: "סוג מתכת", value: "זהב 14K" },
      { label: "משקל יהלומים", value: "0.50 קראט" },
      { label: "צבע", value: "D" },
      { label: "ניקיון", value: "VS" },
    ],
    images: ["/products/bracelet-product-19.jpeg"],
    availability: "זמין להזמנה",
    ctaLabel: "לבירור והזמנה",
    options: [
      {
      type: "select",
      name: "goldColor",
      label: "בחירת צבע זהב",
      options: ["זהב צהוב", "זהב לבן", "רוז גולד"]
    },
    ]
  },

};
