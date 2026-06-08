"use client";

import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";

export default function MirrorPage() {
  const { locale, t } = useLanguage();
  const isHe = locale === "he";

  return (
    <section className="bg-paper min-h-[90vh] flex flex-col justify-between pt-28 md:pt-36">
      <div className="mx-auto max-w-[1440px] w-full px-6 md:px-12 flex-1 flex flex-col justify-center py-12">
        <div className="grid gap-12 md:grid-cols-12 items-center">
          <div className="md:col-span-5">
            <p className="section-label">{t("mirror_page_label")}</p>
            <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.25rem]">
              {t("mirror_page_heading")}
            </h1>
            <p className="mt-8 text-ink-soft text-lg leading-relaxed font-body">
              {isHe 
                ? "חוויה דיגיטלית מתקדמת המאפשרת לך למדוד את התכשיטים שלנו בזמן אמת באמצעות המצלמה. המערכת מבוססת על מודלים של בינה מלאכותית הפועלים ישירות בדפדפן שלך — ללא שמירה או שליחה של המידע."
                : "An advanced digital experience allowing you to try on our bespoke pieces in real-time using your camera. Powered by on-device computer vision models, your data never leaves your device."}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="relative overflow-hidden rounded-2xl bg-velvet text-paper p-8 md:p-12 shadow-2xl border border-white/5 flex flex-col items-center justify-center text-center min-h-[340px]">
              {/* Decorative radial gradient glow */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen"
                style={{
                  background: "radial-gradient(circle at center, oklch(0.38 0.038 280 / 0.75), transparent 70%)"
                }}
              />
              
              {/* Coming soon text */}
              <div className="relative z-10 space-y-4">
                <span className="text-[0.6875rem] tracking-[0.3em] uppercase text-paper/40 block">
                  {isHe ? "פיתוח בלעדי" : "Exclusive Feature"}
                </span>
                <h2 className="display-lat text-4xl md:text-5xl tracking-wide font-light">
                  {isHe ? "בקרוב" : "Coming Soon"}
                </h2>
                <div className="w-12 h-px bg-brass mx-auto my-6" />
                <p className="text-sm text-paper/60 max-w-sm leading-relaxed mx-auto font-body">
                  {isHe
                    ? "אנחנו משלימים את כיוונוני המודל והדיוק של הדמיות התלת-ממד למראה מושלם וטבעי. היכנסי בקרוב להתנסות."
                    : "We are calibrating our computer vision models to ensure flawless, real-time fitting of our jewelry. Check back soon for the official release."}
                </p>
                
                <div className="pt-6">
                  <Link 
                    href="/atelier" 
                    className="inline-block border border-paper/20 hover:border-paper bg-white/5 hover:bg-white/10 px-8 py-3 rounded-full text-sm font-medium tracking-wider uppercase transition-all duration-300"
                  >
                    {isHe ? "כניסה לאטלייה תלת-ממד" : "Go to 3D Atelier"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-rule bg-paper-deep w-full">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12">
          <p className="section-label">{t("mirror_page_privacy_label")}</p>
          <p className="mt-3 max-w-3xl text-[0.875rem] text-ink-soft leading-relaxed font-body">
            {t("mirror_page_privacy_body")}
          </p>
        </div>
      </div>
    </section>
  );
}
