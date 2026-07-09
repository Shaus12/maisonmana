export type CollectionPageSlug =
  | "engagement-rings"
  | "wedding-rings"
  | "diamond-rings"
  | "tennis-bracelets"
  | "diamond-necklaces"
  | "diamond-earrings"
  | "mens-jewelry"
  | "high-jewelry"
  | "signature";

type Cta = {
  href: string;
  labelKey: string;
};

export type FaqItem = {
  questionKey: string;
  answerKey: string;
};

export type CollectionPage = {
  slug: CollectionPageSlug;
  eyebrowKey: string;
  titleKey: string;
  titleLat?: string;
  descriptionKey: string;
  image: string;
  imageAlt: string;
  detailImages?: {
    src: string;
    alt: string;
    objectPosition?: string;
  }[];
  pointsKeys: string[];
  sections: {
    titleKey: string;
    bodyKey: string;
  }[];
  relatedLinks: Cta[];
  faqs?: FaqItem[];
  primaryCta: Cta;
  secondaryCta?: Cta;
  metaTitle: string;
  metaDescription: string;
};

export const collectionPages: Record<CollectionPageSlug, CollectionPage> = {
  "engagement-rings": {
    slug: "engagement-rings",
    eyebrowKey: "cp_er_eyebrow",
    titleKey: "cp_er_title",
    descriptionKey: "cp_er_desc",
    image: "/bridal-diamond-rings-blue-box.jpg",
    imageAlt: "טבעת יהלום עגולה בקופסה כהה מתוך Bridal Collection של Maison Mana",
    detailImages: [
      {
        src: "/marquise-diamond-ring-closeup.jpg",
        alt: "טבעת יהלום מרקיזה בתקריב בעיצוב אישי של Maison Mana",
      }
    ],
    pointsKeys: ["cp_er_points_0", "cp_er_points_1", "cp_er_points_2"],
    sections: [
      {
        titleKey: "cp_er_sec_1_title",
        bodyKey: "cp_er_sec_1_body",
      },
      {
        titleKey: "cp_er_sec_2_title",
        bodyKey: "cp_er_sec_2_body",
      },
      {
        titleKey: "cp_er_sec_3_title",
        bodyKey: "cp_er_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", labelKey: "link_diamonds_guide" },
      { href: "/atelier", labelKey: "link_atelier" },
      { href: "/inquiry", labelKey: "link_inquiry_private" },
    ],
    faqs: [
      { questionKey: "cp_er_faq_1_q", answerKey: "cp_er_faq_1_a" },
      { questionKey: "cp_er_faq_2_q", answerKey: "cp_er_faq_2_a" },
      { questionKey: "cp_er_faq_3_q", answerKey: "cp_er_faq_3_a" },
      { questionKey: "cp_er_faq_4_q", answerKey: "cp_er_faq_4_a" },
      { questionKey: "cp_er_faq_5_q", answerKey: "cp_er_faq_5_a" },
    ],
    primaryCta: { href: "/atelier", labelKey: "link_atelier" },
    secondaryCta: { href: "/inquiry", labelKey: "link_inquiry_private" },
    metaTitle: "טבעות אירוסין | טבעת אירוסין יהלום בעיצוב אישי | Maison MANA",
    metaDescription: "טבעות אירוסין מבית Maison MANA בעיצוב אישי, עם בחירת טבעת אירוסין יהלום טבעי או יהלום מעבדה, והדמיה ראשונית לפני פגישה פרטית.",
  },
  "wedding-rings": {
    slug: "wedding-rings",
    eyebrowKey: "cp_er_eyebrow",
    titleKey: "cp_wr_title",
    descriptionKey: "cp_wr_desc",
    image: "/rings-campaign.png",
    imageAlt: "טבעות יהלום וזהב מתוך Bridal Collection של Maison Mana",
    pointsKeys: ["cp_wr_points_0", "cp_wr_points_1", "cp_wr_points_2"],
    sections: [
      {
        titleKey: "cp_wr_sec_1_title",
        bodyKey: "cp_wr_sec_1_body",
      },
      {
        titleKey: "cp_wr_sec_2_title",
        bodyKey: "cp_wr_sec_2_body",
      },
      {
        titleKey: "cp_wr_sec_3_title",
        bodyKey: "cp_wr_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/engagement-rings", labelKey: "link_engagement" },
      { href: "/atelier", labelKey: "link_atelier" },
      { href: "/inquiry", labelKey: "link_inquiry_private" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_private" },
    secondaryCta: { href: "/engagement-rings", labelKey: "link_engagement" },
    metaTitle: "טבעות נישואין | טבעות זהב זוגיות | Maison MANA",
    metaDescription: "טבעות נישואין של Maison MANA בעיצוב אישי, סטים של טבעות זוגיות וטבעות זהב. חריטה עדינה ופגישה פרטית להתאמה.",
  },
  "diamond-rings": {
    slug: "diamond-rings",
    eyebrowKey: "col_fine_title",
    titleKey: "cp_dr_title",
    descriptionKey: "cp_dr_desc",
    image: "/high-jewelry-square-diamond-ring-black-glove.jpg",
    imageAlt: "טבעת יהלום קושן בזהב בעבודת יד של Maison Mana",
    detailImages: [
      {
        src: "/bespoke-oval-ring-black-glove.jpg",
        alt: "טבעת יהלומים רחבה עם יהלום טיפה בעיצוב ייחודי של Maison Mana",
      }
    ],
    pointsKeys: ["cp_dr_points_0", "cp_dr_points_1", "cp_dr_points_2"],
    sections: [
      {
        titleKey: "cp_dr_sec_1_title",
        bodyKey: "cp_dr_sec_1_body",
      },
      {
        titleKey: "cp_dr_sec_2_title",
        bodyKey: "cp_dr_sec_2_body",
      },
      {
        titleKey: "cp_dr_sec_3_title",
        bodyKey: "cp_dr_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", labelKey: "link_diamonds_guide" },
      { href: "/engagement-rings", labelKey: "link_engagement" },
      { href: "/inquiry", labelKey: "link_inquiry_private" },
    ],
    primaryCta: { href: "/atelier", labelKey: "link_atelier" },
    secondaryCta: { href: "/inquiry", labelKey: "link_inquiry_collection" },
    metaTitle: "טבעות יהלום | טבעות יהלום מעבדה 2 קראט | Maison MANA",
    metaDescription: "טבעות יהלום של Maison MANA בעיצוב אישי. טבעות יהלום מעבדה ויהלום טבעי, כולל טבעת יהלום 2 קראט זמינה להזמנה.",
  },
  "tennis-bracelets": {
    slug: "tennis-bracelets",
    eyebrowKey: "col_fine_title",
    titleKey: "cp_tb_title",
    descriptionKey: "cp_tb_desc",
    image: "/fine-jewelry-tennis-bracelet-wrist.jpg",
    imageAlt: "צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana",
    detailImages: [
      {
        src: "/bracelet-1.jpg",
        alt: "צמיד יהלומים על בד קטיפה כחול מתוך Maison Mana",
      }
    ],
    pointsKeys: ["cp_tb_points_0", "cp_tb_points_1", "cp_tb_points_2"],
    sections: [
      {
        titleKey: "cp_tb_sec_1_title",
        bodyKey: "cp_tb_sec_1_body",
      },
      {
        titleKey: "cp_tb_sec_2_title",
        bodyKey: "cp_tb_sec_2_body",
      },
      {
        titleKey: "cp_tb_sec_3_title",
        bodyKey: "cp_tb_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
      { href: "/diamond-earrings", labelKey: "link_diamond_earrings" },
      { href: "/inquiry", labelKey: "link_inquiry_viewing" },
    ],
    faqs: [
      { questionKey: "cp_tb_faq_1_q", answerKey: "cp_tb_faq_1_a" },
      { questionKey: "cp_tb_faq_2_q", answerKey: "cp_tb_faq_2_a" },
      { questionKey: "cp_tb_faq_3_q", answerKey: "cp_tb_faq_3_a" },
      { questionKey: "cp_tb_faq_4_q", answerKey: "cp_tb_faq_4_a" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_viewing" },
    secondaryCta: { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
    metaTitle: "צמידי טניס | צמיד טניס יהלומים | Maison MANA",
    metaDescription: "צמידי טניס וצמיד טניס יהלומים מבית Maison MANA. התאמת אורך, סוג זהב, איכות שיבוץ ומפרט יהלומים בפגישה פרטית.",
  },
  "diamond-necklaces": {
    slug: "diamond-necklaces",
    eyebrowKey: "col_fine_title",
    titleKey: "cp_dn_title",
    descriptionKey: "cp_dn_desc",
    image: "/maya.jpg",
    imageAlt: "שרשרת יהלום סוליטר על בובת תצוגה שחורה של Maison Mana",
    pointsKeys: ["cp_dn_points_0", "cp_dn_points_1", "cp_dn_points_2"],
    sections: [
      {
        titleKey: "cp_dn_sec_1_title",
        bodyKey: "cp_dn_sec_1_body",
      },
      {
        titleKey: "cp_dn_sec_2_title",
        bodyKey: "cp_dn_sec_2_body",
      },
      {
        titleKey: "cp_dn_sec_3_title",
        bodyKey: "cp_dn_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/tennis-bracelets", labelKey: "link_tennis_bracelets" },
      { href: "/diamond-earrings", labelKey: "link_diamond_earrings" },
      { href: "/inquiry", labelKey: "link_inquiry_collection" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_collection" },
    secondaryCta: { href: "/tennis-bracelets", labelKey: "link_tennis_bracelets" },
    metaTitle: "שרשראות יהלומים | שרשרת יהלום | Maison MANA",
    metaDescription: "שרשראות יהלומים, שרשרת יהלום סוליטר ושרשרת טניס של Maison MANA בעיצוב אישי ובצפייה פרטית באטלייה.",
  },
  "diamond-earrings": {
    slug: "diamond-earrings",
    eyebrowKey: "col_fine_title",
    titleKey: "cp_de_title",
    descriptionKey: "cp_de_desc",
    image: "/earrings-campaign.jpg",
    imageAlt: "עגילי יהלומים יוקרתיים על כפפה שחורה מתוך High Jewelry של Maison Mana",
    pointsKeys: ["cp_de_points_0", "cp_de_points_1", "cp_de_points_2"],
    sections: [
      {
        titleKey: "cp_de_sec_1_title",
        bodyKey: "cp_de_sec_1_body",
      },
      {
        titleKey: "cp_de_sec_2_title",
        bodyKey: "cp_de_sec_2_body",
      },
      {
        titleKey: "cp_de_sec_3_title",
        bodyKey: "cp_de_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
      { href: "/diamond-rings", labelKey: "link_diamond_rings" },
      { href: "/inquiry", labelKey: "link_inquiry_collection" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_collection" },
    secondaryCta: { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
    metaTitle: "עגילי יהלומים | עגילי יהלום | Maison MANA",
    metaDescription: "עגילי יהלומים של Maison MANA: עגילי יהלום צמודים (stud), חישוק (hoop) וטיפה (drop) בעיצוב נקי ומדויק.",
  },
  "mens-jewelry": {
    slug: "mens-jewelry",
    eyebrowKey: "col_mens_title",
    titleKey: "cp_mj_title",
    descriptionKey: "cp_mj_desc",
    image: "/mens-diamond-bracelets-dark.jpg",
    imageAlt: "צמידי יהלומים עבים בזהב לבן וזהב צהוב מתוך Men’s Collection של Maison Mana",
    pointsKeys: ["cp_mj_points_0", "cp_mj_points_1", "cp_mj_points_2"],
    sections: [
      {
        titleKey: "cp_mj_sec_1_title",
        bodyKey: "cp_mj_sec_1_body",
      },
      {
        titleKey: "cp_mj_sec_2_title",
        bodyKey: "cp_mj_sec_2_body",
      },
      {
        titleKey: "cp_mj_sec_3_title",
        bodyKey: "cp_mj_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/collections", labelKey: "link_all_collections" },
      { href: "/inquiry", labelKey: "link_inquiry_private" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_private" },
    secondaryCta: { href: "/collections", labelKey: "link_all_collections" },
    metaTitle: "תכשיטי גברים | טבעות וצמידי גברים | Maison MANA",
    metaDescription: "תכשיטי גברים של Maison MANA: טבעות גברים, צמידי גברים, שרשראות וחפתים בזהב ויהלומים, בעיצוב אישי ופגישה פרטית.",
  },
  "high-jewelry": {
    slug: "high-jewelry",
    eyebrowKey: "col_high_title",
    titleKey: "cp_hj_title",
    titleLat: "High Jewelry",
    descriptionKey: "cp_hj_desc",
    image: "/high-jewelry-square-diamond-ring-black-glove.jpg",
    imageAlt: "טבעת יהלום ייחודית על כפפה שחורה מתוך High Jewelry של Maison Mana",
    detailImages: [
      {
        src: "/earrings-campaign.jpg",
        alt: "תכשיט יהלומים דרמטי מתוך High Jewelry של Maison Mana",
      }
    ],
    pointsKeys: ["cp_hj_points_0", "cp_hj_points_1", "cp_hj_points_2"],
    sections: [
      {
        titleKey: "cp_hj_sec_1_title",
        bodyKey: "cp_hj_sec_1_body",
      },
      {
        titleKey: "cp_hj_sec_2_title",
        bodyKey: "cp_hj_sec_2_body",
      },
      {
        titleKey: "cp_hj_sec_3_title",
        bodyKey: "cp_hj_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", labelKey: "link_diamonds_guide" },
      { href: "/inquiry", labelKey: "link_inquiry_viewing" },
    ],
    faqs: [
      { questionKey: "cp_hj_faq_1_q", answerKey: "cp_hj_faq_1_a" },
      { questionKey: "cp_hj_faq_2_q", answerKey: "cp_hj_faq_2_a" },
      { questionKey: "cp_hj_faq_3_q", answerKey: "cp_hj_faq_3_a" },
      { questionKey: "cp_hj_faq_4_q", answerKey: "cp_hj_faq_4_a" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_viewing" },
    secondaryCta: { href: "/diamonds", labelKey: "link_diamonds_guide" },
    metaTitle: "High Jewelry | תכשיטי יוקרה ויהלומים גדולים | Maison MANA",
    metaDescription: "High Jewelry של Maison MANA: תכשיטי יוקרה, פריטים חד־פעמיים, יהלומים גדולים ואבנים נדירות לצפייה פרטית באטלייה.",
  },
  signature: {
    slug: "signature",
    eyebrowKey: "col_sig_title",
    titleKey: "cp_sig_title",
    descriptionKey: "cp_sig_desc",
    image: "/panther-1.jpg",
    imageAlt: "תכשיט חתימה מתוך Signature Collection של Maison Mana",
    pointsKeys: ["cp_sig_points_0", "cp_sig_points_1", "cp_sig_points_2"],
    sections: [
      {
        titleKey: "cp_sig_sec_1_title",
        bodyKey: "cp_sig_sec_1_body",
      },
      {
        titleKey: "cp_sig_sec_2_title",
        bodyKey: "cp_sig_sec_2_body",
      },
      {
        titleKey: "cp_sig_sec_3_title",
        bodyKey: "cp_sig_sec_3_body",
      },
    ],
    relatedLinks: [
      { href: "/collections", labelKey: "link_all_collections" },
      { href: "/inquiry", labelKey: "link_inquiry_collection" },
    ],
    primaryCta: { href: "/inquiry", labelKey: "link_inquiry_collection" },
    secondaryCta: { href: "/collections", labelKey: "link_all_collections" },
    metaTitle: "Signature Collection | תכשיטי חתימה בעיצוב Maison MANA",
    metaDescription: "Signature Collection מבית Maison MANA: תכשיטי חתימה, פריטי MM, מהדורות מוגבלות ועיצוב מזוהה לצפייה פרטית.",
  },
};

export const collectionPageSlugs = Object.keys(collectionPages) as CollectionPageSlug[];
