"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function CollectionsIntro() {
  const { t } = useLanguage();
  const isHe = t("col_intro_label" as any) !== "Collections";

  return (
    <section className="bg-paper px-6 pt-16 pb-14 md:pt-24 md:pb-20" dir={isHe ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[900px] text-center">
        <h1 className="display-he text-[3.5rem] md:text-[5rem] text-ink leading-[1.05] mb-8">
          {t("col_intro_label" as any)}
        </h1>
        <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-4 max-w-2xl mx-auto">
          {t("col_intro_title" as any)}
        </p>
        <p className="text-[0.9375rem] leading-relaxed text-ink-mute max-w-xl mx-auto">
          {t("col_intro_body" as any)}
        </p>
      </div>
    </section>
  );
}

