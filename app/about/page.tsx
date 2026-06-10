import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "הסיפור שלנו | Maison Mana",
  description:
    "הכירו את Maison Mana — בית תכשיטים פרטי המתמחה בעיצוב אישי, טבעות אירוסין ותכשיטי יהלומים.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="bg-paper" dir="rtl">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-5">
          <p className="section-label">Maison Mana</p>
          <h1 className="display-he mt-6 text-[2.75rem] leading-[1.08] text-ink md:text-[4.5rem]">
            הסיפור שלנו
          </h1>
        </div>
        <div className="editorial md:col-span-6 md:col-start-7 md:self-end">
          <p>
            Maison Mana הוא בית תכשיטים פרטי בבורסת היהלומים ברמת גן, שנבנה סביב פגישות אישיות, בחירת אבנים מדויקת ועבודת אטלייה שקטה.
          </p>
          <p className="text-ink-soft">
            האתר מוביל אל האוספים, אל הדמיה אישית ואל פגישה פרטית. התהליך נשאר אישי, מדוד ודיסקרטי.
          </p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link href="/collections" className="hairline-link">
              לאוספים
            </Link>
            <Link href="/inquiry" className="hairline-link">
              לתיאום פגישה פרטית
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

