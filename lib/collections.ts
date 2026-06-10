export interface CollectionItem {
  key: string;
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  objectPosition?: string;
  imageFit?: "cover" | "contain";
  imagePadding?: boolean;
  href: string;
  linkText: string;
  secondaryLinks?: {
    href: string;
    label: string;
  }[];
  featured?: boolean;
}

export const collectionImages = {
  bridal: "/bridal-diamond-rings-blue-box.jpg",
  fineJewelry: "/fine-jewelry-tennis-bracelet-wrist.jpg",
  signature: "/signature-gold-mm-bracelet.jpg",
  highJewelry: "/high-jewelry-square-diamond-ring-black-glove.jpg",
  mens: "/mens-diamond-bracelets-dark.jpg",
  bespoke: "/bespoke-oval-ring-black-glove.jpg",
};

export const collections: CollectionItem[] = [
  {
    key: "bridal",
    label: "BRIDAL COLLECTION",
    title: "Bridal Collection",
    description: "טבעות אירוסין, טבעות נישואין וסטים לזוגות — תכשיטים לרגע שבו סיפור הופך להתחייבות.",
    image: collectionImages.bridal,
    alt: "טבעות יהלום בקופסה כחולה מתוך Bridal Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/engagement-rings",
    linkText: "טבעות אירוסין",
    secondaryLinks: [
      { href: "/wedding-rings", label: "טבעות נישואין" },
    ],
    featured: true
  },
  {
    key: "fineJewelry",
    label: "FINE JEWELRY",
    title: "Fine Jewelry",
    description: "שרשראות, עגילים, צמידים וטבעות יהלומים בעיצוב נקי, מדויק ועל־זמני.",
    image: collectionImages.fineJewelry,
    alt: "צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/diamond-rings",
    linkText: "טבעות יהלום",
    secondaryLinks: [
      { href: "/tennis-bracelets", label: "צמידי טניס" },
      { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
      { href: "/diamond-earrings", label: "עגילי יהלומים" },
    ],
    featured: true
  },
  {
    key: "highJewelry",
    label: "HIGH JEWELRY",
    title: "High Jewelry",
    description: "יצירות חד־פעמיות, אבנים נדירות ועבודת יד ברמת אטלייה. זמינות לצפייה פרטית בלבד.",
    image: collectionImages.highJewelry,
    alt: "טבעת יהלום ייחודית על כפפה שחורה מתוך High Jewelry של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/high-jewelry",
    linkText: "High Jewelry"
  },
  {
    key: "signature",
    label: "SIGNATURE COLLECTION",
    title: "Signature Collection",
    description: "העיצובים המזוהים עם Maison MANA — קווים אישיים, פריטי MM ומהדורות מוגבלות.",
    image: collectionImages.signature,
    alt: "צמיד זהב משובץ יהלומים עם אלמנט מרכזי מתוך Signature Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "contain",
    imagePadding: true,
    href: "/signature",
    linkText: "Signature Collection"
  },
  {
    key: "bespoke",
    label: "BESPOKE",
    title: "Bespoke",
    description: "תכשיט שנוצר מהתחלה עבור אדם אחד — מהרעיון, דרך האבן והמתכת, ועד הדמיה ראשונית לפני פגישה.",
    image: collectionImages.bespoke,
    alt: "טבעת יהלום אובלית על כפפה שחורה כחלק מתהליך עיצוב אישי ב-Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/atelier",
    linkText: "להדמיה אישית"
  },
  {
    key: "mens",
    label: "MEN’S COLLECTION",
    title: "Men’s Collection",
    description: "טבעות, צמידים, שרשראות וחפתים בעיצוב גברי נקי, חזק ומדויק.",
    image: collectionImages.mens,
    alt: "צמידי יהלומים עבים בזהב לבן וזהב צהוב מתוך Men’s Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/mens-jewelry",
    linkText: "תכשיטי גברים"
  }
];
