export type Product = {
  slug: string;
  title: string;
  category: string;
  price: number;
  priceLabel: string;
  shortDescription: string;
  specs: { label: string; value: string }[];
  images: { src: string; alt: string }[];
  availability: string;
  ctaLabel: string;
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
  }
};
