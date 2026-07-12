"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const subcategories = [
  {
    titleHe: "טבעות יהלום",
    titleEn: "Diamond Rings",
    bodyHe: "טבעות יהלום בעיצוב אישי או מתוך קווים קיימים, עם בחירת אבן, חיתוך ומתכת.",
    bodyEn: "Diamond rings, bespoke or from existing lines, with your choice of stone, cut, and metal.",
    href: "/diamond-rings",
    ctaHe: "לטבעות יהלום",
    ctaEn: "View Diamond Rings",
  },
  {
    titleHe: "צמידי טניס",
    titleEn: "Tennis Bracelets",
    bodyHe: "צמידי טניס וצמידי יהלומים בעבודת שיבוץ מדויקת, בזהב לבן, צהוב או ורוד.",
    bodyEn: "Tennis and diamond bracelets with precise setting work, in white, yellow, or rose gold.",
    href: "/tennis-bracelets",
    ctaHe: "לצמידי טניס",
    ctaEn: "View Tennis Bracelets",
  },
  {
    titleHe: "שרשראות יהלומים",
    titleEn: "Diamond Necklaces",
    bodyHe: "שרשראות יהלומים, תליוני סוליטר ושרשראות טניס בהתאמה אישית.",
    bodyEn: "Diamond necklaces, solitaire pendants, and tennis necklaces, made to order.",
    href: "/diamond-necklaces",
    ctaHe: "לשרשראות יהלומים",
    ctaEn: "View Diamond Necklaces",
  },
  {
    titleHe: "עגילי יהלומים",
    titleEn: "Diamond Earrings",
    bodyHe: "עגילי יהלומים ליומיום, לאירוע או לעיצוב אישי — Stud, Hoop, Drop ועוד.",
    bodyEn: "Diamond earrings for everyday, occasions, or bespoke design — stud, hoop, drop, and more.",
    href: "/diamond-earrings",
    ctaHe: "לעגילי יהלומים",
    ctaEn: "View Diamond Earrings",
  },
];

export function FineJewelryContent() {
  const { t, locale } = useLanguage();
  const isHe = locale === "he";

  return (
    <main className="min-h-screen bg-paper">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-6 pt-28 pb-16 md:px-12 md:pt-36 md:pb-24">
        <div className="grid gap-12 md:grid-cols-12 items-start">

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
                {t("seo_back_collections")}
              </Link>
            </div>

            <p className="section-label mb-6" dir="ltr">Fine Jewelry</p>

            <h1 className="display-lat text-[2.75rem] md:text-[4rem] leading-[1.05] text-ink mb-8">
              Fine Jewelry
            </h1>

            <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-5 max-w-lg">
              {isHe
                ? "תכשיטי יהלומים בעיצוב נקי, מדויק ועל־זמני — טבעות, צמידים, שרשראות ועגילים שנועדו ללוות רגעים יומיומיים ורגעים מיוחדים באותה מידה."
                : "Diamond jewelry in a clean, precise, timeless design — rings, bracelets, necklaces, and earrings made to accompany everyday moments and special ones alike."}
            </p>
            <p className="text-[0.9875rem] leading-relaxed text-ink-soft max-w-lg">
              {isHe
                ? "ב־Maison Mana כל פריט נבחר או נוצר מתוך תשומת לב לפרופורציות, לאבן, למתכת ולדרך שבה התכשיט ירגיש על הגוף — לא רק איך הוא נראה בתמונה."
                : "At Maison Mana every piece is chosen or created with attention to proportion, stone, metal, and the way it will feel on the body — not just how it looks in a photo."}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
              <Image
                src="/fine-jewelry-tennis-bracelet-wrist.jpg"
                alt={isHe
                  ? "צמיד טניס משובץ יהלומים על פרק כף היד מתוך Fine Jewelry של Maison Mana"
                  : "Diamond tennis bracelet on the wrist from Maison Mana's Fine Jewelry collection"}
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
          <p className="section-label mb-12" dir="ltr">
            {isHe ? "בתוך Fine Jewelry" : "Inside Fine Jewelry"}
          </p>
          <div className="grid gap-0 md:grid-cols-2 divide-y divide-rule md:divide-y-0 md:divide-x md:divide-x-reverse">
            {subcategories.map((sub) => (
              <div key={sub.href} className="py-8 md:px-10 first:md:pl-0 last:md:pr-0">
                <div className="border-t border-brass/30 pt-6">
                  <h2 className="display-he text-[1.375rem] text-ink mb-3">
                    {isHe ? sub.titleHe : sub.titleEn}
                  </h2>
                  <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-5">
                    {isHe ? sub.bodyHe : sub.bodyEn}
                  </p>
                  <Link
                    href={sub.href}
                    className="hairline-link text-[0.875rem] tracking-widest text-ink"
                  >
                    {isHe ? sub.ctaHe : sub.ctaEn}
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
          {isHe ? "מחפשים פריט מסוים?" : "Looking for a Specific Piece?"}
        </h2>
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft mx-auto max-w-xl mb-9">
          {isHe
            ? "נשמח לעזור בבחירת תכשיט יהלומים מתוך האוסף או ביצירה אישית לפי סגנון, אבן ותקציב."
            : "We would be glad to help you choose a diamond piece from the collection, or create one to your style, stone, and budget."}
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link href="/inquiry?topic=fine-jewelry" className="hairline-link text-[0.9375rem]">
            {isHe ? "לתיאום פגישה פרטית" : "Book a Private Meeting"}
          </Link>
          <Link href="/atelier" className="hairline-link text-[0.9375rem]">
            {isHe ? "להדמיה אישית" : "Start a Personal Preview"}
          </Link>
        </div>
      </section>
    </main>
  );
}
