"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export function AboutContent() {
  const { locale } = useLanguage();
  const isHe = locale === "he";

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-5">
          <p className="section-label">Maison Mana</p>
          <h1 className="display-he mt-6 text-[2.75rem] leading-[1.08] text-ink md:text-[4.5rem]">
            {isHe ? "הסיפור שלנו" : "Our Story"}
          </h1>
        </div>
        <div className="editorial md:col-span-6 md:col-start-7 md:self-end">
          <p>
            {isHe
              ? "Maison Mana הוא בית תכשיטים פרטי בבורסת היהלומים ברמת גן, שנבנה סביב פגישות אישיות, בחירת אבנים מדויקת ועבודת אטלייה שקטה."
              : "Maison Mana is a private jewelry house at the Diamond Exchange in Ramat Gan, built around personal meetings, precise stone selection, and quiet atelier work."}
          </p>
          <p className="text-ink-soft">
            {isHe
              ? "האתר מוביל אל האוספים, אל הדמיה אישית ואל פגישה פרטית. התהליך נשאר אישי, מדוד ודיסקרטי."
              : "The site leads to the collections, to a personal preview, and to a private meeting. The process remains personal, measured, and discreet."}
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link href="/collections" className="hairline-link">
              {isHe ? "לאוספים" : "View Collections"}
            </Link>
            <Link href="/inquiry" className="hairline-link">
              {isHe ? "לתיאום פגישה פרטית" : "Book a Private Meeting"}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
