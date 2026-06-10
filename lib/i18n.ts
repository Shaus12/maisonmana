export const locales = ["en", "he"] as const;
export type Locale = (typeof locales)[number];

export const strings = {
  en: {
    // ── Masthead ─────────────────────────────────────────────
    nav_home:        "Home",
    nav_collections: "Collections",
    nav_studio:      "Personal Preview",
    nav_diamonds:    "Diamonds",
    nav_mirror:      "The Mirror",
    nav_about:       "Story",
    nav_contact:     "Appointment",
    nav_menu:        "Menu",
    nav_close:       "Close",
    masthead_sub:    "Studio",

    // ── Hero ─────────────────────────────────────────────────
    hero_tagline:          "Maison Mana",
    hero_h1:               "wear your legacy",
    hero_cta_view:         "Book a Private Viewing",
    hero_cta_collections:  "View Collections",

    // ── Maison statement ─────────────────────────────────────
    statement_label:       "The Maison",
    statement_quote:       "“Maison Mana was built on three rules: never sell what we wouldn’t wear ourselves; never rush to propose what we haven’t listened to; and every diamond that leaves the workshop shall carry a certificate, a name, and a time.”",
    statement_attribution: "— Henri Mana, Goldsmith & Founder",

    // ── Campaign ─────────────────────────────────────────────
    campaign_label:        "The Campaign",
    campaign_heading:      "La Panthère & Le Diamant",
    campaign_intro:        "A dialogue between the wild, untamed grace of the panther and the architectural precision of Maison Mana's bespoke diamonds.",
    campaign_item_1_title: "Chiaroscuro Grace",
    campaign_item_1_desc:  "Contrasting the purity of brilliant-cut diamonds against the midnight silhouette of the panther. Classic, yet untethered.",
    campaign_item_2_title: "The Ornate Salon",
    campaign_item_2_desc:  "Captured behind closed doors in the atelier. A private viewing of high jewelry in its natural environment.",
    campaign_item_3_title: "The Golden Vault",
    campaign_item_3_desc:  "Poised atop the gilded structures of the Diamond Exchange. A statement of strength, symmetry, and eternal value.",

    // ── Signature pieces ─────────────────────────────────────
    pieces_label:   "Showcase",
    pieces_heading: "Three Pieces Selected for the Season",
    pieces_link:    "All Collections",
    pieces_desc_0:  "A round two-carat solitaire on a fine platinum band. The ring you return to after looking at everything else.",
    pieces_desc_1:  "Seventy-two stones set by a single craftsman’s hand. The classic everyone wants to copy and no one can.",
    pieces_desc_2:  "A pear diamond suspended on three claws. Tilted slightly forward to catch the first light of morning.",

    // ── Studio teaser ─────────────────────────────────────────
    studio_label:   "The Studio",
    studio_heading: "The Studio",
    studio_body:    "A full bespoke engagement ring — setting, diamond, metal, band. Your choices become one certificate and one meeting with the goldsmith who will bring it to life.",
    studio_cta:     "Enter the Studio",
    studio_step_a:  "Setting",
    studio_step_b:  "Diamond",
    studio_step_c:  "Metal",
    studio_step_4:  "Fourth step: Band. Concluded at a private meeting with the goldsmith.",

    // ── Mirror teaser ─────────────────────────────────────────
    mirror_label:   "Mirror",
    mirror_heading: "The Mirror",
    mirror_body:    "One photo of you — from the camera or gallery — and one piece from the catalogue. The Mirror shows how they look together. The photo never leaves your device. Nothing is sent, nothing is saved.",
    mirror_cta:     "Enter the Mirror",

    // ── Showroom ─────────────────────────────────────────────
    showroom_label:   "The Maison",
    showroom_heading: "By Appointment Only",
    showroom_body:    "Maison Mana is located in the Diamond Exchange in Ramat Gan, third floor, behind an unmarked door. Entry is accompanied and the appointment lasts up to two hours: you will be welcomed with tea, three pieces selected by prior questionnaire will be presented, and you will be given time to see, try, and return.",
    showroom_note:    "If a purchase follows — it comes after. If not — nothing happened.",
    showroom_cta:     "Book a Viewing",

    // ── Studio page ───────────────────────────────────────────
    studio_page_label:   "Personal Preview",
    studio_page_heading: "The Atelier",
    studio_page_body:    "Choose the direction, see an initial visual preview, and send the summary to the atelier for a private consultation.",

    // ── Mirror page ───────────────────────────────────────────
    mirror_page_label:         "Mirror",
    mirror_page_heading:       "The Mirror",
    mirror_page_body:          "Upload a photo of your hand, neck, ear, or wrist — choose a piece from the catalogue — and the Mirror will show how they look together. Everything happens on your device: the photo is not uploaded to any server, not saved, not sent to anyone.",
    mirror_page_privacy_label: "Privacy",
    mirror_page_privacy_body:  "The Mirror operates using models that run entirely in your browser. We do not upload your photo to a server, do not save it, and do not share it with any third party. Camera permission is valid only for the current session and closes when navigating to another page.",

    // ── Inquiry page ──────────────────────────────────────────
    inquiry_label:   "Contact",
    inquiry_heading: "Book a Viewing",
    inquiry_body:    "We will get back to you within one business day using the contact details you leave. The appointment will be arranged according to your schedule, not the other way around. We accept one appointment per hour — so that you have the time.",

    // ── Contact blocks ────────────────────────────────────────
    contact_maison:       "The Maison",
    contact_hours_label:  "Opening Hours",
    contact_hours_body:   "Sun–Thu · 10:00–19:00\nFri · 9:30–13:00",
    contact_hours_note:   "By appointment only",
    contact_private:      "Private Correspondence",

    // ── 3D viewer ─────────────────────────────────────────────
    viewer_loading:  "Loading 3D Studio…",
    viewer_hint:     "Drag to rotate · 3D Studio",
    viewer_gem:      "With Stone",
    viewer_skeleton: "Skeleton Only",

    // ── Atelier configurator ──────────────────────────────────
    conf_shape:             "Diamond Shape",
    conf_setting:           "Setting",
    conf_metal:             "Metal",
    conf_band:              "Band",
    conf_specs:             "Diamond Specs",
    conf_origin_lab:        "Lab Diamond",
    conf_origin_lab_desc:   "Optically and chemically identical to natural. Created in a laboratory.",
    conf_origin_nat:        "Natural Diamond",
    conf_origin_nat_desc:   "Formed in nature, rare and one of a kind.",
    conf_carat:             "Carat Weight",
    conf_color:             "Colour",
    conf_clarity:           "Clarity",
    conf_summary_label:     "Summary",
    conf_price_label:       "Estimated Price",
    conf_price_note:        "Final price confirmed at the appointment, after wax model approval.",
    conf_send:              "Send to Studio",
    conf_show_all_bands:    "Show all styles",
    conf_more:              "more",
    currency:               "₪",

    // Mobile nav footer
    mobile_footer_1: "Maison Mana",
    mobile_footer_2: "Diamond Exchange, Ramat Gan",
    mobile_footer_3: "By appointment only",

    // ── Collections category page ─────────────────────────────
    col_label_rings:     "Rings",
    col_label_necklaces: "Necklaces",
    col_label_earrings:  "Earrings",
    col_title_rings:     "Engagement Rings",
    col_title_necklaces: "Bespoke Necklaces",
    col_title_earrings:  "Diamond Earrings",
    col_body:            "Every piece is made to order in our Tel Aviv atelier, pairing structural integrity with lab-grown diamonds of uncompromising quality.",
    col_from:            "From",

    // ── Product detail page ───────────────────────────────────
    col_breadcrumb_home:  "Home",
    col_specifications:   "Specifications",
    col_metals:           "Metals",
    col_shapes:           "Shapes",
    col_settings:         "Settings",
    col_cta_atelier:      "Customize in Atelier",
    col_cta_inquiry:      "Private Inquiry",
    col_handcrafted:      "Handcrafted in Tel Aviv",
  },

  he: {
    nav_home:        "הבית",
    nav_collections: "האוספים",
    nav_studio:      "הדמיה אישית",
    nav_diamonds:    "יהלומים",
    nav_mirror:      "המראה",
    nav_about:       "הסיפור",
    nav_contact:     "תיאום פגישה",
    nav_menu:        "תפריט",
    nav_close:       "סגירה",
    masthead_sub:    "אטלייה",

    hero_tagline:          "מאזון מנא",
    hero_h1:               "wear your legacy",
    hero_cta_view:         "לקביעת צפייה פרטית",
    hero_cta_collections:  "לצפייה באוספים",

    statement_label:       "בית המאזון",
    statement_quote:       "“מאזון מנא נבנה על שלושה כללים: שלא נמכור דבר שלא נלבש בעצמנו; שלא נחפוז להציע מה שלא הקשבנו לו; ושכל יהלום שיוצא מן הסדנה יישא תעודה, ושם, ושעה.”",
    statement_attribution: "— אנרי מנא, צורף ומייסד",

    campaign_label:        "הקמפיין",
    campaign_heading:      "הפנתר והיהלום",
    campaign_intro:        "דיאלוג בין החן הפראי והבלתי מרוסן של הפנתר לבין הדיוק האדריכלי של יהלומי מאזון מנא.",
    campaign_item_1_title: "חן הקונטרסט",
    campaign_item_1_desc:  "ניגוד בין הטוהר של יהלומים בחיתוך בריליאנט לבין צללית חצות של הפנתר. קלאסי, אך חופשי.",
    campaign_item_2_title: "הסלון המעוטר",
    campaign_item_2_desc:  "מאחורי דלתות סגורות באטלייה. הצגה פרטית של תכשיטי עילית בסביבתם הטבעית.",
    campaign_item_3_title: "כיפת הזהב",
    campaign_item_3_desc:  "משקיף מראש מבני הזהב של בורסת היהלומים. הצהרה של עוצמה, סימטריה וערך נצחי.",

    pieces_label:   "חלון התצוגה",
    pieces_heading: "שלוש יצירות שנבחרו לעונה",
    pieces_link:    "לכל האוספים",
    pieces_desc_0:  "סוליטר עגול שתי קראט על להקה דקה מפלטינה. הטבעת שאליה חוזרים אחרי שמסתכלים בכל השאר.",
    pieces_desc_1:  "שבעים ושתיים אבנים ביד אחת של אומן. הקלאסי שכולם רוצים להעתיק ואף אחד לא מצליח.",
    pieces_desc_2:  "יהלום אגס תלוי על שלוש מצולות. נוטה קלות קדימה, כדי לתפוס את האור הראשון של הבוקר.",

    studio_label:   "חדר היצירה",
    studio_heading: "האטלייה",
    studio_body:    "עיצוב מלא של טבעת כלולות בהזמנה אישית — בסיס, יהלום, מתכת, להקה. הבחירה שלך הופכת לתעודה אחת, ולפגישה אחת עם הצורף שיוציא אותה לפועל.",
    studio_cta:     "לכניסה לאטלייה",
    studio_step_a:  "בסיס",
    studio_step_b:  "יהלום",
    studio_step_c:  "מתכת",
    studio_step_4:  "שלב רביעי: להקה. סיום בפגישה פרטית עם הצורף.",

    mirror_label:   "מראה",
    mirror_heading: "המראה",
    mirror_body:    "צילום אחד שלך, מהמצלמה או מהגלריה, ויצירה אחת מן הקטלוג — והמראה מציגה כיצד הן נראות יחד. הצילום לא יוצא מן המכשיר שלך. דבר אינו נשלח, דבר אינו נשמר.",
    mirror_cta:     "לכניסה למראה",

    showroom_label:   "בית המאזון",
    showroom_heading: "צפייה בתיאום מראש",
    showroom_body:    "בית מאזון מנא ממוקם בבורסת היהלומים שברמת גן, בקומה שלישית, מאחורי דלת ללא שלט. הכניסה היא בליווי, והפגישה היא של עד שעתיים: בה תתקבלי בכוס תה, יוצגו לך שלוש יצירות שנבחרו לפי שאלון מוקדם, וניתן לך הזמן לראות, למדוד, ולחזור.",
    showroom_note:    "אם תרצי להמשיך — זה יקרה אחרי הפגישה. ואם לא — נשאיר את הרגע כפי שהיה.",
    showroom_cta:     "לקביעת המועד",

    studio_page_label:   "הדמיה אישית",
    studio_page_heading: "האטלייה",
    studio_page_body:    "בחרו כיוון, ראו הדמיה ראשונית ושלחו את סיכום הבחירות לאטלייה לקראת פגישה פרטית.",

    mirror_page_label:         "מראה",
    mirror_page_heading:       "המראה",
    mirror_page_body:          "העלי צילום של יד, צוואר, אוזן או פרק — בחרי יצירה מן הקטלוג — והמראה תציג כיצד הם נראים יחד. ההכל מתרחש במכשיר שלך: הצילום לא עולה לשרת, לא נשמר, לא נשלח לאיש.",
    mirror_page_privacy_label: "פרטיות",
    mirror_page_privacy_body:  "המראה פועלת באמצעות מודלים שרצים כולם בדפדפן שלך. אנו לא מעלים את הצילום לשרת, לא שומרים אותו, ולא משתפים אותו עם צד שלישי. רישיון המצלמה תקף רק לסשן הנוכחי, ונסגר בעת מעבר לעמוד אחר.",

    inquiry_label:   "פנייה",
    inquiry_heading: "לקביעת מועד",
    inquiry_body:    "נחזור אליך תוך יום עסקים אחד, על פי פרטי הקשר שתשאירי. הפגישה תתואם לפי לוח הזמנים שלך, ולא להפך. אנו מקבלים פגישה אחת בלבד בכל שעה — כדי שתהיה הזמן.",

    contact_maison:       "בית המאזון",
    contact_hours_label:  "שעות קבלה",
    contact_hours_body:   "ראשון–חמישי · 10:00–19:00\nשישי · 9:30–13:00",
    contact_hours_note:   "בתיאום מראש בלבד",
    contact_private:      "התכתבות פרטית",

    viewer_loading:  "טוען סטודיו תלת-ממד...",
    viewer_hint:     "גרור לסובב · 3D Atelier",
    viewer_gem:      "טבעת משובצת",
    viewer_skeleton: "שלד בלבד",

    conf_shape:             "צורת היהלום",
    conf_setting:           "שיבוץ",
    conf_metal:             "מתכת",
    conf_band:              "להקה",
    conf_specs:             "מפרט היהלום",
    conf_origin_lab:        "יהלום מעבדה",
    conf_origin_lab_desc:   "זהה לחלוטין אופטית וכימית, נוצר במעבדה.",
    conf_origin_nat:        "יהלום טבעי",
    conf_origin_nat_desc:   "נוצר בטבע, נדיר וחד פעמי.",
    conf_carat:             "משקל קראט",
    conf_color:             "צבע",
    conf_clarity:           "ניקיון",
    conf_summary_label:     "סיכום",
    conf_price_label:       "הערכת מחיר",
    conf_price_note:        "המחיר הסופי נקבע בפגישה, לאחר אישור מודל שעווה.",
    conf_send:              "לשליחה לאטלייה",
    conf_show_all_bands:    "הצג את כל הסגנונות",
    conf_more:              "נוספים",
    currency:               'ש"ח',

    mobile_footer_1: "בית מאזון מנא",
    mobile_footer_2: "בורסת היהלומים, רמת גן",
    mobile_footer_3: "בתיאום מראש בלבד",

    // ── Collections category page ─────────────────────────────
    col_label_rings:     "טבעות",
    col_label_necklaces: "שרשראות",
    col_label_earrings:  "עגילים",
    col_title_rings:     "טבעות אירוסין",
    col_title_necklaces: "שרשראות ייחודיות",
    col_title_earrings:  "עגילי יהלומים",
    col_body:            "כל יצירה נעשית לפי הזמנה באטלייה שלנו בתל אביב, בשילוב יהלומי מעבדה ברמה שאין בה פשרות.",
    col_from:            "החל מ",

    // ── Product detail page ───────────────────────────────────
    col_breadcrumb_home:  "בית",
    col_specifications:   "מפרט",
    col_metals:           "מתכות",
    col_shapes:           "צורות",
    col_settings:         "שיבוצים",
    col_cta_atelier:      "התאמה אישית באטלייה",
    col_cta_inquiry:      "לפנייה פרטית",
    col_handcrafted:      "עבודת יד, תל אביב",
  },
} satisfies Record<Locale, Record<string, string>>;

export type StringKey = keyof typeof strings.en;
