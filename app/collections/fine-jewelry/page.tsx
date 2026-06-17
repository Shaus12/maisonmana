import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Fine Jewelry | Maison Mana",
  description:
    "Fine Jewelry של Maison Mana — טבעות יהלום, צמידי טניס, שרשראות יהלומים ועגילי יהלומים בעיצוב נקי ועל־זמני.",
  path: "/collections/fine-jewelry",
});

const subcategories = [
  {
    title: "טבעות יהלום",
    body: "טבעות יהלום בעיצוב אישי או מתוך קווים קיימים, עם בחירת אבן, חיתוך ומתכת.",
    href: "/diamond-rings",
    cta: "לטבעות יהלום",
  },
  {
    title: "צמידי טניס",
    body: "צמידי טניס וצמידי יהלומים בעבודת שיבוץ מדויקת, בזהב לבן, צהוב או ורוד.",
    href: "/tennis-bracelets",
    cta: "לצמידי טניס",
  },
  {
    title: "שרשראות יהלומים",
    body: "שרשראות יהלומים, תליוני סוליטר ושרשראות טניס בהתאמה אישית.",
    href: "/diamond-necklaces",
    cta: "לשרשראות יהלומים",
  },
  {
    title: "עגילי יהלומים",
    body: "עגילי יהלומים ליומיום, לאירוע או לעיצוב אישי — Stud, Hoop, Drop ועוד.",
    href: "/diamond-earrings",
    cta: "לעגילי יהלומים",
  },
];

export default function FineJewelryPage() {
  return (
    <main className="min-h-screen bg-paper" dir="rtl">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
        <div className="grid gap-12 md:grid-cols-12 items-start">

          {/* Left — text */}
          <div className="md:col-span-5 md:self-center">
            {/* Back */}
            <div className="mb-8">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-[0.875rem] text-ink-mute hover:text-ink transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
                חזרה לאוספים
              </Link>
            </div>

            <p className="section-label mb-6" dir="ltr">Fine Jewelry</p>

            <h1 className="display-lat text-[2.75rem] md:text-[4rem] leading-[1.05] text-ink mb-8">
              Fine Jewelry
            </h1>

            <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-5 max-w-lg">
              תכשיטי יהלומים בעיצוב נקי, מדויק ועל־זמני — טבעות, צמידים, שרשראות ועגילים שנועדו ללוות רגעים יומיומיים ורגעים מיוחדים באותה מידה.
            </p>
            <p className="text-[0.9875rem] leading-relaxed text-ink-soft max-w-lg">
              ב־Maison Mana כל פריט נבחר או נוצר מתוך תשומת לב לפרופורציות, לאבן, למתכת ולדרך שבה התכשיט ירגיש על הגוף — לא רק איך הוא נראה בתמונה.
            </p>
          </div>

          {/* Right — editorial image */}
          <div className="md:col-span-6 md:col-start-7">
            <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
              <Image
                src="/fine-jewelry-tennis-bracelet-wrist.jpg"
                alt="צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* ── Subcategory navigation ───────────────────────────── */}
      <section className="bg-paper-deep">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
          <p className="section-label mb-12" dir="ltr">בתוך Fine Jewelry</p>
          <div className="grid gap-0 md:grid-cols-2 divide-y divide-rule md:divide-y-0 md:divide-x md:divide-x-reverse">
            {subcategories.map((sub) => (
              <div key={sub.href} className="py-8 md:px-10 first:md:pl-0 last:md:pr-0">
                <div className="border-t border-brass/30 pt-6">
                  <h2 className="display-he text-[1.375rem] text-ink mb-3">{sub.title}</h2>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-5">{sub.body}</p>
                  <Link
                    href={sub.href}
                    className="hairline-link text-[0.875rem] tracking-widest text-ink"
                  >
                    {sub.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="section-label mb-5">Maison Mana</p>
        <h2 className="display-he text-[1.875rem] md:text-[2.5rem] leading-[1.15] text-ink mb-6">
          מחפשים פריט מסוים?
        </h2>
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft mx-auto max-w-xl mb-9">
          נשמח לעזור בבחירת תכשיט יהלומים מתוך האוסף או ביצירה אישית לפי סגנון, אבן ותקציב.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link href="/inquiry?topic=fine-jewelry" className="hairline-link text-[0.9375rem]">
            לתיאום פגישה פרטית
          </Link>
          <Link href="/atelier" className="hairline-link text-[0.9375rem]">
            להדמיה אישית
          </Link>
        </div>
      </section>

    </main>
  );
}
