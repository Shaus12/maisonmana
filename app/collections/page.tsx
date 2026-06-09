import { Metadata } from "next";
import Link from "next/link";
import { CollectionsIntro } from "@/components/collections/CollectionsIntro";
import { CollectionIndex } from "@/components/collections/CollectionIndex";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "אוספים | Maison MANA",
  description: "עולמות התכשיטים של Maison MANA — מטבעות אירוסין ועיצוב אישי ועד תכשיטי יהלומים, פריטי חתימה ויצירות חד־פעמיות.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-paper pt-12 md:pt-20">
      {/* Editorial Intro */}
      <CollectionsIntro />

      {/* Grid */}
      <CollectionIndex />

      {/* Bottom Note */}
      <section className="bg-paper pb-24 md:pb-40 px-6 md:px-12" dir="rtl">
        <div className="mx-auto max-w-[800px]">
          <div className="h-px w-full bg-brass/20 mb-16" />
          <ScrollReveal className="text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-ink mb-6">
              לא מצאתם את האוסף המדויק?
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-10 max-w-xl mx-auto">
              Maison MANA יוצרת גם תכשיטים בעיצוב אישי — טבעות, שרשראות, צמידים ופריטים חד־פעמיים שנוצרים לפי סיפור, אבן או רעיון אישי.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/atelier"
                className="inline-flex border-b border-ink/30 pb-1 text-sm tracking-widest hover:border-ink transition-colors"
              >
                לעיצוב אישי
              </Link>
              <Link
                href="/inquiry"
                className="inline-flex border-b border-ink/30 pb-1 text-sm tracking-widest hover:border-ink transition-colors"
              >
                לתיאום פגישה
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
