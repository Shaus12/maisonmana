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
  label: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type CollectionPage = {
  slug: CollectionPageSlug;
  eyebrow: string;
  title: string;
  titleLat?: string;
  description: string;
  image: string;
  imageAlt: string;
  points: string[];
  sections: {
    title: string;
    body: string;
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
    eyebrow: "Bridal Collection",
    title: "טבעות אירוסין",
    description:
      "טבעת אירוסין ב-Maison Mana מתחילה בסגנון אישי ובבחירת יהלום מדויקת, וממשיכה להדמיה ראשונית ולפגישה פרטית באטלייה.",
    image: "/bridal-diamond-rings-blue-box.jpg",
    imageAlt: "טבעות יהלום בקופסה כחולה מתוך Bridal Collection של Maison Mana",
    points: ["טבעת אירוסין בעיצוב אישי", "בחירת יהלום טבעי או יהלום מעבדה", "הדמיה ראשונית לפני פגישה פרטית"],
    sections: [
      {
        title: "בחירת היהלום",
        body: "בפגישה בוחנים צורה, קראט, צבע, ניקיון ותעודה. אפשר לבחור יהלום טבעי או יהלום מעבדה לפי העדפה, תקציב ונוכחות על היד.",
      },
      {
        title: "מתכת ופרופורציה",
        body: "זהב צהוב, זהב לבן, זהב ורוד או פלטינה משנים את אופי הטבעת. גם רוחב הלהקה, גובה השיבוץ והנוחות היומיומית נבחנים יחד.",
      },
      {
        title: "מהדמיה לפגישה",
        body: "ההדמיה האישית מסמנת כיוון ראשוני. לאחר מכן מתאמים פגישה פרטית כדי לדייק את האבן, המתכת והפרטים הקטנים לפני ייצור.",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", label: "מדריך היהלומים" },
      { href: "/atelier", label: "הדמיה אישית" },
      { href: "/inquiry", label: "תיאום פגישה פרטית" },
    ],
    faqs: [
      {
        question: "כמה זמן לוקח לעצב טבעת אירוסין?",
        answer: "משך התהליך משתנה לפי זמינות האבן ורמת המורכבות, אך לרוב מתחילים בהדמיה ובפגישה פרטית לפני קביעת לוח זמנים מדויק.",
      },
      {
        question: "האם אפשר לבחור יהלום טבעי או יהלום מעבדה?",
        answer: "כן. Maison Mana מלווה בבחירת יהלום טבעי או יהלום מעבדה לפי מראה, מפרט, תעודה ותקציב.",
      },
      {
        question: "האם אפשר להגיע עם תמונת השראה?",
        answer: "כן. תמונת השראה עוזרת להבין את הכיוון, ולאחר מכן מתרגמים אותה לעיצוב אישי שמתאים לאבן וליד.",
      },
      {
        question: "האם מקבלים תעודה ליהלום?",
        answer: "כאשר האבן נבחרת עם תעודה, פרטי התעודה כגון GIA, IGI או HRD נמסרים כחלק ממפרט התכשיט.",
      },
      {
        question: "האם הפגישה בתיאום מראש?",
        answer: "כן. כל פגישה ב-Maison Mana מתקיימת בתיאום מראש בלבד כדי לשמור על תהליך פרטי ושקט.",
      },
    ],
    primaryCta: { href: "/atelier", label: "להדמיה אישית" },
    secondaryCta: { href: "/inquiry", label: "לתיאום פגישה פרטית" },
    metaTitle: "טבעות אירוסין | Maison Mana",
    metaDescription:
      "טבעות אירוסין של Maison Mana בעיצוב אישי, עם בחירת יהלום טבעי או יהלום מעבדה, מתכת והדמיה ראשונית לפני פגישה פרטית.",
  },
  "wedding-rings": {
    slug: "wedding-rings",
    eyebrow: "Bridal Collection",
    title: "טבעות נישואין",
    description:
      "טבעות נישואין בעבודת אטלייה נקייה, מזוגות קלאסיים ועד טבעות משובצות שנוצרות לצד טבעת האירוסין.",
    image: "/rings-campaign.png",
    imageAlt: "טבעות יהלום וזהב מתוך Bridal Collection של Maison Mana",
    points: ["סטים לזוגות", "חריטה אישית ועדינה", "התאמה לטבעת אירוסין קיימת"],
    sections: [
      {
        title: "זוג טבעות עם שפה משותפת",
        body: "אפשר ליצור זוג טבעות תואמות או שתי טבעות שונות עם פרט משותף: חתך, מתכת, חריטה או יחס עדין לטבעת האירוסין.",
      },
      {
        title: "חריטה ופרטים אישיים",
        body: "חריטה פנימית, גימור מט או מבריק ושיבוץ יהלומים עדין מאפשרים להפוך טבעת נישואין קלאסית לפריט אישי בלי להעמיס עליה.",
      },
      {
        title: "נוחות לאורך שנים",
        body: "הפרופיל, העובי והקימור נבחרים לפי ענידה יומיומית. המטרה היא טבעת שנראית מדויקת ומרגישה טבעית על היד.",
      },
    ],
    relatedLinks: [
      { href: "/engagement-rings", label: "טבעות אירוסין" },
      { href: "/atelier", label: "הדמיה אישית" },
      { href: "/inquiry", label: "תיאום פגישה פרטית" },
    ],
    primaryCta: { href: "/inquiry", label: "לתיאום פגישה פרטית" },
    secondaryCta: { href: "/engagement-rings", label: "טבעות אירוסין" },
    metaTitle: "טבעות נישואין | Maison Mana",
    metaDescription:
      "טבעות נישואין של Maison Mana בעיצוב אישי, סטים לזוגות, חריטה עדינה ופגישה פרטית להתאמת מתכת, פרופיל ושיבוץ.",
  },
  "diamond-rings": {
    slug: "diamond-rings",
    eyebrow: "Fine Jewelry",
    title: "טבעות יהלום",
    description:
      "טבעות יהלום לאירוע, ליום יום או כיצירת חתימה אישית, עם בחירה מדויקת של חיתוך יהלום, מתכת ופרופורציה.",
    image: "/ring-close.jpg",
    imageAlt: "טבעת יהלום מקרוב מתוך Fine Jewelry של Maison Mana",
    points: ["חיתוכי יהלומים שונים", "יהלום טבעי או יהלום מעבדה", "עיצוב אישי סביב האבן"],
    sections: [
      {
        title: "חיתוך היהלום משנה את האופי",
        body: "עגול, אובל, אמרלד, כרית או טיפה מעניקים לטבעת נוכחות אחרת. בחירת החיתוך נעשית לצד שיקולי אור, יד וסגנון אישי.",
      },
      {
        title: "טבעת יהלום שאינה בהכרח טבעת אירוסין",
        body: "טבעות יהלום יכולות להיות פריט יום-יום מדויק, טבעת קוקטייל או מתנה לציון רגע אישי. העיצוב נבנה סביב השימוש ולא רק סביב האבן.",
      },
      {
        title: "מפרט לפני החלטה",
        body: "אפשר להשוות בין יהלום טבעי ליהלום מעבדה, להבין את התעודה ולבחור מתכת ושיבוץ שמתאימים לתקציב ולמראה המבוקש.",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", label: "מדריך היהלומים" },
      { href: "/engagement-rings", label: "טבעות אירוסין" },
      { href: "/inquiry", label: "תיאום פגישה פרטית" },
    ],
    primaryCta: { href: "/atelier", label: "להדמיה אישית" },
    secondaryCta: { href: "/inquiry", label: "לבירור על האוסף" },
    metaTitle: "טבעות יהלום | Maison Mana",
    metaDescription:
      "טבעות יהלום של Maison Mana בעיצוב אישי, עם חיתוכי יהלומים, יהלום טבעי או יהלום מעבדה ופגישה פרטית.",
  },
  "tennis-bracelets": {
    slug: "tennis-bracelets",
    eyebrow: "Fine Jewelry",
    title: "צמידי טניס",
    description:
      "צמיד טניס ב-Maison Mana נבחן דרך רצף היהלומים, איכות השיבוץ, סוג הזהב והנוחות על פרק כף היד.",
    image: "/fine-jewelry-tennis-bracelet-wrist.jpg",
    imageAlt: "צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana",
    points: ["שיבוץ יהלומים רציף ומדויק", "זהב לבן, צהוב או ורוד", "התאמת אורך וסוגר"],
    sections: [
      {
        title: "רצף אור על פרק היד",
        body: "צמיד טניס טוב נמדד באחידות היהלומים, במרווחי השיבוץ ובדרך שבה הוא נע על היד בלי לאבד את הקו הנקי שלו.",
      },
      {
        title: "בחירת זהב ומבנה",
        body: "זהב לבן מדגיש בהירות, זהב צהוב מוסיף חום וזהב ורוד יוצר רכות. גם גובה השיבוץ וסוג הסוגר משפיעים על התחושה.",
      },
      {
        title: "התאמה אישית ולא מדף",
        body: "אורך הצמיד, משקל היהלומים והבחירה בין יהלומים טבעיים ליהלומי מעבדה נקבעים בפגישה פרטית לפי היד והתקציב.",
      },
    ],
    relatedLinks: [
      { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
      { href: "/diamond-earrings", label: "עגילי יהלומים" },
      { href: "/inquiry", label: "תיאום צפייה פרטית" },
    ],
    faqs: [
      {
        question: "מהו צמיד טניס?",
        answer: "צמיד טניס הוא צמיד רציף המשובץ בדרך כלל ביהלומים לאורך כל ההיקף, כך שנוצר קו אור נקי וגמיש על פרק היד.",
      },
      {
        question: "האם אפשר לבחור את סוג הזהב?",
        answer: "כן. ניתן להתאים את הצמיד לזהב לבן, צהוב או ורוד בהתאם למראה המבוקש ולשילוב עם תכשיטים קיימים.",
      },
      {
        question: "האם אפשר להתאים את אורך הצמיד?",
        answer: "כן. אורך הצמיד והתחושה על היד נבדקים בפגישה כדי לשמור על נוחות, ביטחון ונפילה נכונה.",
      },
      {
        question: "האם הצמיד מגיע עם יהלומים טבעיים או מעבדה?",
        answer: "אפשר לבחון שתי אפשרויות. הבחירה נעשית לפי מפרט, מראה, תעודות ותקציב.",
      },
    ],
    primaryCta: { href: "/inquiry", label: "לתיאום צפייה פרטית" },
    secondaryCta: { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
    metaTitle: "צמידי טניס | Maison Mana",
    metaDescription:
      "צמידי טניס וצמידי יהלומים של Maison Mana, בהתאמת אורך, סוג זהב, איכות שיבוץ ומפרט יהלומים בפגישה פרטית.",
  },
  "diamond-necklaces": {
    slug: "diamond-necklaces",
    eyebrow: "Fine Jewelry",
    title: "שרשראות יהלומים",
    description:
      "שרשראות ותליוני יהלומים בעיצוב נקי, מתליון יחיד ועד שרשרת טניס, עם התאמה אישית של האבן, האורך והנוכחות.",
    image: "/panther-1.jpg",
    imageAlt: "שרשרת יהלומים מתוך אוסף השרשראות של Maison Mana",
    points: ["תליון יהלום או שרשרת טניס", "התאמת אורך ונוכחות", "בחירת יהלום טבעי או יהלום מעבדה"],
    sections: [
      {
        title: "תליון יהלום אישי",
        body: "תליון יהלום יכול להיות עדין ויומיומי או בעל נוכחות ברורה. צורת האבן, אורך השרשרת וסוג המתכת משנים את כל האופי.",
      },
      {
        title: "שרשרת טניס",
        body: "שרשרת טניס דורשת איזון בין אחידות היהלומים, גמישות על הצוואר ותחושת משקל. כל פרט משפיע על הנוחות והמראה.",
      },
      {
        title: "התאמה לסגנון ולשכבות",
        body: "בפגישה אפשר להתאים את השרשרת לענידה לבד או בשכבות, ולבחור אורך שמחמיא למבנה הצוואר ולתכשיטים קיימים.",
      },
    ],
    relatedLinks: [
      { href: "/tennis-bracelets", label: "צמידי טניס" },
      { href: "/diamond-earrings", label: "עגילי יהלומים" },
      { href: "/inquiry", label: "לבירור על האוסף" },
    ],
    primaryCta: { href: "/inquiry", label: "לבירור על האוסף" },
    secondaryCta: { href: "/tennis-bracelets", label: "צמידי טניס" },
    metaTitle: "שרשראות יהלומים | Maison Mana",
    metaDescription:
      "שרשראות יהלומים, תליון יהלום ושרשרת טניס של Maison Mana בעיצוב אישי ובצפייה פרטית באטלייה.",
  },
  "diamond-earrings": {
    slug: "diamond-earrings",
    eyebrow: "Fine Jewelry",
    title: "עגילי יהלומים",
    description:
      "עגילי יהלומים צמודים, חישוקים ועגילי drop בעיצוב מדויק, עם דגש על סימטריה, אור ונוחות ענידה.",
    image: "/earrings-campaign.jpg",
    imageAlt: "עגילי יהלומים מתוך אוסף העגילים של Maison Mana",
    points: ["Stud, hoop ו-drop", "עגילים ליומיום ולאירועים", "התאמה לפי צורת יהלום וסגנון אישי"],
    sections: [
      {
        title: "Stud, hoop או drop",
        body: "עגילים צמודים מדגישים ניקיון ואור, חישוקים נותנים תנועה יומיומית, ועגילי drop מוסיפים אורך ונוכחות לאירוע.",
      },
      {
        title: "סימטריה ונוחות",
        body: "בבחירת עגילי יהלומים חשוב להתייחס למשקל, לסגירה ולמרחק מהאוזן. תכשיט יפה צריך להרגיש נכון גם אחרי כמה שעות.",
      },
      {
        title: "יהלומים שמתאימים לזוג",
        body: "האבנים נבחרות כזוג מבחינת צבע, ניקיון, קוטר ואופי החיתוך כדי ליצור מראה אחיד ומדויק.",
      },
    ],
    relatedLinks: [
      { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
      { href: "/diamond-rings", label: "טבעות יהלום" },
      { href: "/inquiry", label: "לבירור על האוסף" },
    ],
    primaryCta: { href: "/inquiry", label: "לבירור על האוסף" },
    secondaryCta: { href: "/diamond-necklaces", label: "שרשראות יהלומים" },
    metaTitle: "עגילי יהלומים | Maison Mana",
    metaDescription:
      "עגילי יהלומים של Maison Mana: stud, hoop ו-drop בעיצוב נקי ומדויק, עם התאמת יהלומים ומתכת בפגישה פרטית.",
  },
  "mens-jewelry": {
    slug: "mens-jewelry",
    eyebrow: "Men's Collection",
    title: "תכשיטי גברים",
    description:
      "תכשיטי גברים בזהב ויהלומים, מטבעות וצמידים ועד שרשראות וחפתים בקווים חזקים, נקיים ומדויקים.",
    image: "/mens-diamond-bracelets-dark.jpg",
    imageAlt: "צמידי יהלומים עבים בזהב לבן וזהב צהוב מתוך Men’s Collection של Maison Mana",
    points: ["טבעות גברים", "צמידים, שרשראות וחפתים", "עיצוב אישי לפי פרופורציה ונוכחות"],
    sections: [
      {
        title: "נוכחות בלי עודף",
        body: "תכשיטי גברים ב-Maison Mana נשענים על קווים ברורים, משקל נכון וחומרים שמרגישים מדויקים ולא מקושטים מדי.",
      },
      {
        title: "טבעות, צמידים ושרשראות",
        body: "אפשר להתחיל מטבעת יהלום לגבר, צמיד זהב, שרשרת נקייה או חפתים אישיים, ולבנות את הפרופורציה סביב הגוף והסגנון.",
      },
      {
        title: "פגישה פרטית למדידה",
        body: "רוחב טבעת, אורך צמיד או משקל שרשרת נבחרים בצורה הטובה ביותר בפגישה שבה אפשר למדוד ולהרגיש את התכשיט.",
      },
    ],
    relatedLinks: [
      { href: "/collections", label: "כל האוספים" },
      { href: "/inquiry", label: "תיאום פגישה פרטית" },
    ],
    primaryCta: { href: "/inquiry", label: "לתיאום פגישה פרטית" },
    secondaryCta: { href: "/collections", label: "כל האוספים" },
    metaTitle: "תכשיטי גברים | Maison Mana",
    metaDescription:
      "תכשיטי גברים של Maison Mana: טבעות גברים, צמידים, שרשראות וחפתים בזהב ויהלומים, בעיצוב אישי ופגישה פרטית.",
  },
  "high-jewelry": {
    slug: "high-jewelry",
    eyebrow: "High Jewelry",
    title: "תכשיטי יוקרה חד־פעמיים",
    titleLat: "High Jewelry",
    description:
      "High Jewelry ב-Maison Mana נוצר סביב אבנים נדירות, יהלומים גדולים ועבודת יד מדויקת לצפייה פרטית בלבד.",
    image: "/high-jewelry-square-diamond-ring-black-glove.jpg",
    imageAlt: "טבעת יהלום ייחודית על כפפה שחורה מתוך High Jewelry של Maison Mana",
    points: ["יצירות חד־פעמיות", "יהלומים גדולים ואבנים נדירות", "צפייה פרטית ותהליך דיסקרטי"],
    sections: [
      {
        title: "האבן מובילה את העיצוב",
        body: "ב-High Jewelry מתחילים לרוב מאבן משמעותית: יהלום גדול, צורה נדירה או גוון יוצא דופן. העיצוב נבנה כדי לשרת אותה.",
      },
      {
        title: "יצירה אחת, תהליך אחד",
        body: "כל פריט נבחן כיצירה חד־פעמית. המתכת, השיבוץ והפרופורציה מפותחים סביב האבן והאדם שעבורו היא מיועדת.",
      },
      {
        title: "צפייה פרטית",
        body: "פריטי High Jewelry מוצגים בפגישה פרטית בלבד, עם זמן לשיחה, מדידה והבנת מקור האבן והמפרט שלה.",
      },
    ],
    relatedLinks: [
      { href: "/diamonds", label: "ייעוץ יהלומים" },
      { href: "/inquiry", label: "תיאום צפייה פרטית" },
    ],
    faqs: [
      {
        question: "מה נחשב High Jewelry?",
        answer: "High Jewelry מתייחס ליצירות חד־פעמיות או נדירות במיוחד, לרוב סביב אבנים משמעותיות ועבודת יד ברמת אטלייה גבוהה.",
      },
      {
        question: "האם ניתן לראות פריטים בפגישה פרטית?",
        answer: "כן. פריטי High Jewelry מוצגים בתיאום צפייה פרטית בלבד כדי לשמור על דיסקרטיות ועל זמן בחינה מתאים.",
      },
      {
        question: "האם ניתן לבחור אבן נדירה מראש?",
        answer: "כן. אפשר להתחיל מבחירת אבן מסוימת או מבקשה לאתר אבן נדירה לפי צורה, גודל, צבע או תעודה.",
      },
      {
        question: "האם כל פריט מיוצר בעבודת יד?",
        answer: "פריטי High Jewelry מפותחים ומיוצרים בתהליך אטלייה מוקפד, עם עבודת יד בשלבי השיבוץ והגימור.",
      },
    ],
    primaryCta: { href: "/inquiry", label: "לתיאום צפייה פרטית" },
    secondaryCta: { href: "/diamonds", label: "ייעוץ יהלומים" },
    metaTitle: "High Jewelry | תכשיטי יוקרה חד־פעמיים | Maison Mana",
    metaDescription:
      "High Jewelry של Maison Mana: תכשיטי יוקרה חד־פעמיים, יהלומים גדולים, אבנים נדירות וצפייה פרטית באטלייה.",
  },
  signature: {
    slug: "signature",
    eyebrow: "Signature Collection",
    title: "Signature Collection",
    description:
      "Signature Collection מרכזת את פריטי ה-MM והעיצובים המזוהים עם Maison Mana, בקווים אישיים ומהדורות מוגבלות.",
    image: "/signature-gold-mm-bracelet.jpg",
    imageAlt: "צמיד זהב משובץ יהלומים עם אלמנט מרכזי מתוך Signature Collection של Maison Mana",
    points: ["פריטי MM", "מהדורות מוגבלות", "עיצובי Maison Mana מזוהים"],
    sections: [
      {
        title: "שפת בית מזוהה",
        body: "הפריטים בקולקציית Signature נשענים על צורות, פרופורציות ופרטי MM שמזוהים עם Maison Mana.",
      },
      {
        title: "מהדורות מוגבלות",
        body: "חלק מהפריטים נוצרים בכמויות קטנות או סביב חומרים זמינים לזמן מוגבל, ולכן מתאימים לצפייה ובירור אישי.",
      },
      {
        title: "אפשרות להתאמה אישית",
        body: "ניתן לבחון התאמות עדינות כמו מתכת, אורך, שיבוץ או חריטה, תוך שמירה על האופי המקורי של העיצוב.",
      },
    ],
    relatedLinks: [
      { href: "/collections", label: "כל האוספים" },
      { href: "/inquiry", label: "לבירור על האוסף" },
    ],
    primaryCta: { href: "/inquiry", label: "לבירור על האוסף" },
    secondaryCta: { href: "/collections", label: "כל האוספים" },
    metaTitle: "Signature Collection | Maison Mana",
    metaDescription:
      "Signature Collection של Maison Mana: פריטי MM, מהדורות מוגבלות ועיצובי בית מזוהים לצפייה פרטית.",
  },
};

export const collectionPageSlugs = Object.keys(collectionPages) as CollectionPageSlug[];
