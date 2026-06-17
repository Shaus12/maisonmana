"use client";

import { AtelierConfigurator } from "./AtelierConfigurator";
import { useLanguage } from "./LanguageProvider";
import Link from "next/link";

export function StudioPageContent() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-10 md:px-12 md:pt-36 md:pb-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
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
