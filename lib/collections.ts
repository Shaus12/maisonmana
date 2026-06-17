export interface CollectionItem {
  key: string;
  label: string;
  titleKey: any;
  descKey: any;
  image: string;
  alt: string;
  objectPosition?: string;
  imageFit?: "cover" | "contain";
  imagePadding?: boolean;
  /** If set, the card image + title will be a clickable link to this href */
  href?: string;
  links: {
    href: string;
    labelKey: any;
  }[];
  featured?: boolean;
}

export const collectionImages = {
  bridal: "/bridal-diamond-rings-blue-box.jpg",
  fineJewelry: "/fine-jewelry-tennis-bracelet-wrist.jpg",
  signature: "/panther-1.jpg",
  highJewelry: "/high-jewelry-square-diamond-ring-black-glove.jpg",
  mens: "/mens-diamond-bracelets-dark.jpg",
  bespoke: "/bespoke-oval-ring-black-glove.jpg",
};

export const collections: CollectionItem[] = [
  {
    key: "bridal",
    label: "BRIDAL COLLECTION",
    titleKey: "col_bridal_title",
    descKey: "col_bridal_desc",
    image: collectionImages.bridal,
    alt: "טבעות יהלום בקופסה כחולה מתוך Bridal Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    links: [
      { href: "/engagement-rings", labelKey: "link_engagement" },
      { href: "/wedding-rings", labelKey: "link_wedding" },
    ],
    featured: true
  },
  {
    key: "fineJewelry",
    label: "FINE JEWELRY",
    titleKey: "col_fine_title",
    descKey: "col_fine_desc",
    image: collectionImages.fineJewelry,
    alt: "צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    href: "/collections/fine-jewelry",
    links: [
      { href: "/diamond-rings", labelKey: "link_diamond_rings" },
      { href: "/tennis-bracelets", labelKey: "link_tennis_bracelets" },
      { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
      { href: "/diamond-earrings", labelKey: "link_diamond_earrings" },
    ],
    featured: true
  },
  {
    key: "highJewelry",
    label: "HIGH JEWELRY",
    titleKey: "col_high_title",
    descKey: "col_high_desc",
    image: collectionImages.highJewelry,
    alt: "טבעת יהלום ייחודית על כפפה שחורה מתוך High Jewelry של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    links: [
      { href: "/high-jewelry", labelKey: "link_high_jewelry" }
    ]
  },
  {
    key: "signature",
    label: "SIGNATURE COLLECTION",
    titleKey: "col_sig_title",
    descKey: "col_sig_desc",
    image: collectionImages.signature,
    alt: "צמיד זהב משובץ יהלומים עם אלמנט מרכזי מתוך Signature Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "contain",
    imagePadding: true,
    links: [
      { href: "/signature", labelKey: "link_signature" }
    ]
  },
  {
    key: "bespoke",
    label: "BESPOKE",
    titleKey: "col_bespoke_title",
    descKey: "col_bespoke_desc",
    image: collectionImages.bespoke,
    alt: "טבעת יהלום אובלית על כפפה שחורה כחלק מתהליך עיצוב אישי ב-Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    links: [
      { href: "/atelier", labelKey: "link_atelier" }
    ]
  },
  {
    key: "mens",
    label: "MEN’S COLLECTION",
    titleKey: "col_mens_title",
    descKey: "col_mens_desc",
    image: collectionImages.mens,
    alt: "צמידי יהלומים עבים בזהב לבן וזהב צהוב מתוך Men’s Collection של Maison Mana",
    objectPosition: "center center",
    imageFit: "cover",
    links: [
      { href: "/mens-jewelry", labelKey: "link_mens" }
    ]
  }
];