export interface CollectionItem {
  key: string;
  label: string;
  title: string;
  description: string;
  image: string;
  objectPosition?: string;
  imageFit?: "cover" | "contain";
  imagePadding?: boolean;
  href: string;
  linkText: string;
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
    objectPosition: "center center",
    imageFit: "cover",
    href: "/atelier?collection=bridal",
    linkText: "לעיצוב טבעת אישית",
    featured: true
  },
  {
    key: "fineJewelry",
    label: "FINE JEWELRY",
    title: "Fine Jewelry",
    description: "שרשראות, עגילים, צמידים וטבעות יהלומים בעיצוב נקי, מדויק ועל־זמני.",
    image: collectionImages.fineJewelry,
    objectPosition: "center center",
    imageFit: "cover",
    href: "/inquiry?topic=fine-jewelry",
    linkText: "לבירור על האוסף",
    featured: true
  },
  {
    key: "highJewelry",
    label: "HIGH JEWELRY",
    title: "High Jewelry",
    description: "יצירות חד־פעמיות, אבנים נדירות ועבודת יד ברמת אטלייה. זמינות לצפייה פרטית בלבד.",
    image: collectionImages.highJewelry,
    objectPosition: "center center",
    imageFit: "cover",
    href: "/inquiry?topic=high-jewelry",
    linkText: "לתיאום צפייה פרטית"
  },
  {
    key: "signature",
    label: "SIGNATURE COLLECTION",
    title: "Signature Collection",
    description: "העיצובים המזוהים עם Maison MANA — קווים אישיים, פריטי MM ומהדורות מוגבלות.",
    image: collectionImages.signature,
    objectPosition: "center center",
    imageFit: "contain",
    imagePadding: true,
    href: "/inquiry?topic=signature",
    linkText: "לבירור על האוסף"
  },
  {
    key: "bespoke",
    label: "BESPOKE",
    title: "Bespoke",
    description: "תכשיט שנוצר מהתחלה עבור אדם אחד — מהרעיון, דרך האבן והמתכת, ועד הדמיה ראשונית לפני פגישה.",
    image: collectionImages.bespoke,
    objectPosition: "center center",
    imageFit: "cover",
    href: "/atelier",
    linkText: "להתחלת עיצוב אישי"
  },
  {
    key: "mens",
    label: "MEN’S COLLECTION",
    title: "Men’s Collection",
    description: "טבעות, צמידים, שרשראות וחפתים בעיצוב גברי נקי, חזק ומדויק.",
    image: collectionImages.mens,
    objectPosition: "center center",
    imageFit: "cover",
    href: "/inquiry?topic=mens",
    linkText: "לבירור על האוסף"
  }
];
