"use client";

import { Mirror } from "@/components/Mirror";
import { useLanguage } from "@/components/LanguageProvider";

export default function MirrorPage() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-10 md:px-12 md:pt-36 md:pb-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">{t("mirror_page_label")}</p>
            <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.25rem]">
              {t("mirror_page_heading")}
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>{t("mirror_page_body")}</p>
          </div>
        </div>
      </div>

      <Mirror />

      <div className="border-t border-rule bg-paper-deep">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12">
          <p className="section-label">{t("mirror_page_privacy_label")}</p>
          <p className="mt-3 max-w-3xl text-[0.875rem] text-ink-soft leading-relaxed">
            {t("mirror_page_privacy_body")}
          </p>
        </div>
      </div>
    </section>
  );
}
