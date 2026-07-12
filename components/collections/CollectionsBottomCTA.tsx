"use client";

import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLanguage } from "@/components/LanguageProvider";

export function CollectionsBottomCTA() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper pb-24 md:pb-40 px-6 md:px-12">
      <div className="mx-auto max-w-[800px]">
        <div className="h-px w-full bg-brass/20 mb-16" />
        <ScrollReveal className="text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-ink mb-6">
            {t("col_index_not_found" as any)}
          </h2>
          <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-10 max-w-xl mx-auto">
            {t("col_index_custom" as any)}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/atelier"
              className="inline-flex border-b border-ink/30 pb-1 text-sm tracking-widest hover:border-ink transition-colors"
            >
              {t("col_index_cta_custom" as any)}
            </Link>
            <Link
              href="/inquiry"
              className="inline-flex border-b border-ink/30 pb-1 text-sm tracking-widest hover:border-ink transition-colors"
            >
              {t("col_index_cta_meeting" as any)}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
