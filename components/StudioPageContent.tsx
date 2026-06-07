"use client";

import { AtelierConfigurator } from "./AtelierConfigurator";
import { useLanguage } from "./LanguageProvider";

export function StudioPageContent() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-10 md:px-12 md:pt-36 md:pb-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">{t("studio_page_label")}</p>
            <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.25rem]">
              {t("studio_page_heading")}
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>{t("studio_page_body")}</p>
          </div>
        </div>
      </div>

      <AtelierConfigurator />
    </section>
  );
}
