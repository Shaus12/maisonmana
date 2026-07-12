"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoHero } from "@/components/VideoHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLanguage } from "@/components/LanguageProvider";
import { RealStoriesSection } from "@/components/RealStoriesSection";

export function HomeContent() {
  const { t, locale } = useLanguage();
  const isHe = locale === "he";

  return (
    <>
      {/* ── 1. FULLSCREEN VIDEO HERO ─────────────────────────────── */}
      <VideoHero />

      {/* ── 3. CAMPAIGN SECTIONS (SPLIT-SCREEN EDITORIAL ZIG-ZAG) ── */}
      {(() => {
        const campaignSections = [
          {
            id: "necklaces",
            categoryUrl: "/products?category=necklaces",
            seoUrl: "/diamond-necklaces",
            bgImage: "/panther-1.jpg",
            archImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=85",
            titleEn: "NECKLACES",
            titleHe: "שרשראות",
            subtitleEn: "A Dialogue of Elegance",
            subtitleHe: "דיאלוג של אלגנטיות",
            descEn: "Celebrate every milestone with a diamond necklace that captures the light.",
            descHe: "לחגוג כל רגע משמעותי עם שרשרת יהלום הלוכדת את האור.",
            buttonEn: "VIEW NECKLACES TO ORDER",
            buttonHe: "לצפייה בשרשראות להזמנה",
            seoLinkEn: "More about diamond necklaces",
            seoLinkHe: "עוד על שרשראות יהלומים",
            bgAltHe: "שרשרת יהלומים על רקע קמפיין מתוך אוסף השרשראות של Maison Mana",
            archAltHe: "שרשרת יהלום עדינה מתוך אוסף השרשראות של Maison Mana",
            bgClass: "bg-[#F5F2EA]",
          },
          {
            id: "rings",
            categoryUrl: "/products?category=rings",
            seoUrl: "/diamond-rings",
            bgImage: "/rings-campaign.png",
            archImage: "/marquise-diamond-ring-closeup.jpg",
            titleEn: "RINGS",
            titleHe: "טבעות",
            subtitleEn: "A Circle of Perfection",
            subtitleHe: "עיגול של שלמות",
            descEn: "Celebrate every milestone with a bespoke ring that tells your unique story.",
            descHe: "לחגוג כל רגע משמעותי עם טבעת בעיצוב אישי המספרת את הסיפור הייחודי שלך.",
            buttonEn: "VIEW RINGS TO ORDER",
            buttonHe: "לצפייה בטבעות להזמנה",
            seoLinkEn: "More about diamond rings",
            seoLinkHe: "עוד על טבעות יהלום",
            bgAltHe: "טבעת יהלום מתוך אוסף הטבעות של Maison Mana",
            archAltHe: "טבעת יהלום מקרוב מתוך אוסף הטבעות של Maison Mana",
            bgClass: "bg-[#EAE4D6]",
          },
          {
            id: "earrings",
            categoryUrl: "/products?category=earrings",
            seoUrl: "/diamond-earrings",
            bgImage: "/earrings-campaign.jpg",
            archImage: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=85",
            titleEn: "EARRINGS",
            titleHe: "עגילים",
            subtitleEn: "Strength & Symmetry",
            subtitleHe: "עוצמה וסימטריה",
            descEn: "Celebrate every milestone with hand-selected diamonds set in our workshop.",
            descHe: "לחגוג כל רגע משמעותי עם יהלומים שנבחרו ידנית ושובצו בסדנה.",
            buttonEn: "VIEW EARRINGS TO ORDER",
            buttonHe: "לצפייה בעגילים להזמנה",
            seoLinkEn: "More about diamond earrings",
            seoLinkHe: "עוד על עגילי יהלומים",
            bgAltHe: "עגילי יהלומים מתוך אוסף העגילים של Maison Mana",
            archAltHe: "עגילי יהלום בעיצוב עדין מתוך אוסף העגילים של Maison Mana",
            bgClass: "bg-[#E6DEC9]",
          },
          {
            id: "bracelets",
            categoryUrl: "/products?category=bracelets",
            seoUrl: "/tennis-bracelets",
            bgImage: "/panther-3.jpg",
            archImage: "/diamond-bracelet-blue-velvet.jpg",
            titleEn: "BRACELETS",
            titleHe: "צמידים",
            subtitleEn: "Strength & Continuity",
            subtitleHe: "עוצמה והמשכיות",
            descEn: "Celebrate every milestone with a tennis bracelet wrapping the wrist in light.",
            descHe: "לחגוג כל רגע משמעותי עם צמיד טניס העוטף את פרק היד באור.",
            buttonEn: "VIEW BRACELETS TO ORDER",
            buttonHe: "לצפייה בצמידים להזמנה",
            seoLinkEn: "More about tennis bracelets",
            seoLinkHe: "עוד על צמידי טניס",
            bgAltHe: "צמיד יהלומים מתוך אוסף הצמידים של Maison Mana",
            archAltHe: "צמיד יהלומים בזהב מתוך אוסף הצמידים של Maison Mana",
            bgClass: "bg-[#DFDCD4]",
          },
        ];

        return campaignSections.map((section, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <section
              key={section.id}
              className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh] md:min-h-screen relative w-full overflow-hidden border-b border-rule/30"
            >
              {/* Left Column in Grid flow (Parallax Background Image + Title) */}
              <div className={`relative w-full h-[55vh] md:h-auto overflow-hidden group ${isEven ? "md:order-1" : "md:order-2"}`}>
                <Image
                  src={section.bgImage}
                  alt={isHe ? section.bgAltHe : `${section.titleEn} campaign image by Maison Mana`}
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[2000ms] ease-spring group-hover:scale-105"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Brand Monogram Watermark at top-left of image */}
                <div className="absolute top-8 start-8 md:top-12 md:start-12 text-white/50 text-[0.625rem] tracking-[0.25em] uppercase font-body">
                  MAISON MANA · STUDIO
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <ScrollReveal direction="scale">
                    <h2 className="display-lat text-white text-[3rem] md:text-[5rem] tracking-[0.12em] leading-none uppercase select-none">
                      {isHe ? section.titleHe : section.titleEn}
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={1}>
                    <p className="font-body text-white/95 text-xs md:text-sm tracking-[0.22em] uppercase mt-4 select-none">
                      {isHe ? section.subtitleHe : section.subtitleEn}
                    </p>
                  </ScrollReveal>
                </div>

                {/* Social Watermark at bottom-left of image */}
                <div className="absolute bottom-8 start-8 md:bottom-12 md:start-12 text-white/40 text-[0.625rem] tracking-[0.2em] font-body">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">INSTAGRAM</a>
                </div>
              </div>

              {/* Right Column in Grid flow (Arched Product Showcase + CTA) */}
              <div className={`${section.bgClass} flex flex-col items-center justify-center text-center p-8 md:p-16 min-h-[45vh] md:h-auto relative ${isEven ? "md:order-2" : "md:order-1"}`}>
                <ScrollReveal direction="scale" className="flex flex-col items-center justify-center">
                  {/* Arched Frame */}
                  <div className="relative w-[150px] h-[210px] md:w-[240px] md:h-[330px] overflow-hidden rounded-t-full shadow-2xl border border-white/10 transition-transform duration-[800ms] ease-spring hover:scale-[1.03]">
                    <Image
                      src={section.archImage}
                      alt={isHe ? section.archAltHe : `${section.titleEn} piece from Maison Mana`}
                      fill
                      sizes="(max-w-768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={1} className="flex flex-col items-center justify-center">
                  <p className="mt-8 text-ink-soft text-sm md:text-[1.0625rem] leading-relaxed max-w-xs font-body">
                    {isHe ? section.descHe : section.descEn}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={2} className="flex flex-col items-center justify-center mt-6">
                  <Link
                    href={section.categoryUrl}
                    className="inline-block border border-ink/30 hover:border-ink hover:bg-ink hover:text-paper px-8 py-3 rounded-full text-xs md:text-sm font-medium tracking-widest uppercase transition-all duration-300"
                  >
                    {isHe ? section.buttonHe : section.buttonEn}
                  </Link>
                  <Link
                    href={section.seoUrl}
                    className="mt-4 text-[0.8125rem] text-ink-soft underline decoration-ink-mute/30 underline-offset-4 transition-colors hover:text-ink"
                  >
                    {isHe ? section.seoLinkHe : section.seoLinkEn}
                  </Link>
                </ScrollReveal>

                {/* Subtle scroll hint down arrow */}
                {idx < 3 && (
                  <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-40 pointer-events-none">
                    <span className="text-[0.5625rem] tracking-[0.2em] uppercase text-ink-mute">
                      {isHe ? "גללי למטה" : "Scroll"}
                    </span>
                    <svg className="w-3 h-3 text-ink-mute animate-bounce mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            </section>
          );
        });
      })()}

      {/* ── 4. THE STUDIO — VELVET BREAK ─────────────────────────── */}
      <section className="relative overflow-hidden bg-velvet text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -5%, oklch(0.38 0.038 280 / 0.75), transparent 62%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-44">
          <div className="md:col-span-5 md:col-start-1">
            <ScrollReveal>
              <p className="section-label" style={{ color: "oklch(0.74 0.110 78)" }}>
                {t("studio_label")}
              </p>
              <h2 className="display-lat mt-6 text-[2.25rem] leading-[1.07] text-paper md:text-[3.75rem]">
                {t("studio_heading")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed" style={{ color: "oklch(0.985 0.004 75 / 0.82)" }}>
                {t("studio_body")}
              </p>
              <div className="mt-10">
                <Link
                  href="/atelier"
                  className="brass-disc"
                  style={{
                    background: "transparent",
                    color: "oklch(0.985 0.004 75)",
                    borderColor: "oklch(0.74 0.110 78 / 0.75)",
                  }}
                >
                  {t("studio_cta")}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <ScrollReveal delay={2}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "studio_step_a" as const, label: "A" },
                  { key: "studio_step_b" as const, label: "B" },
                  { key: "studio_step_c" as const, label: "C" },
                ].map((step) => (
                  <div
                    key={step.key}
                    className="border bg-velvet-soft/25 px-5 py-7 md:py-10 text-center backdrop-blur-sm"
                    style={{ borderColor: "oklch(0.985 0.004 75 / 0.16)" }}
                  >
                    <span
                      className="display-lat text-[2rem] leading-none"
                      style={{ color: "oklch(0.74 0.110 78)" }}
                    >
                      {step.label}
                    </span>
                    <span
                      className="mt-3 block text-[0.625rem] tracking-[0.22em] uppercase"
                      style={{ color: "oklch(0.985 0.004 75 / 0.65)" }}
                    >
                      {t(step.key)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[0.8125rem] tracking-[0.04em]" style={{ color: "oklch(0.985 0.004 75 / 0.50)" }}>
                {t("studio_step_4")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── REAL STORIES ─────────────────────────────────────────── */}
      <RealStoriesSection />

      {/* ── 5. THE MIRROR ────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-40">
          <ScrollReveal direction="scale" className="md:col-span-6 md:col-start-1">
            <figure className="vellum relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=85"
                alt={isHe ? "תליון יהלום על שרשרת עדינה כחלק מחוויית המראה של Maison Mana" : "Diamond pendant on a fine chain for the Maison Mana Mirror experience"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
              />
              <Bracket position="top-start" />
              <Bracket position="top-end" />
              <Bracket position="bottom-start" />
              <Bracket position="bottom-end" />
            </figure>
          </ScrollReveal>

          <div className="md:col-span-5 md:col-start-8 md:self-center">
            <ScrollReveal direction="right">
              <p className="section-label">{t("mirror_label")}</p>
              <h2 className="display-lat mt-6 text-[2.25rem] leading-[1.08] text-ink md:text-[3.5rem]">
                {t("mirror_heading")}
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={1}>
              <p className="mt-8 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
                {t("mirror_body")}
              </p>
              <div className="mt-10">
                <Link href="/mirror" className="brass-disc">
                  {t("mirror_cta")}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* ── 6. SHOWROOM ──────────────────────────────────────────── */}
      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-14 md:grid-cols-12 md:px-12 md:py-36">
          <ScrollReveal className="md:col-span-4">
            <p className="section-label">{t("showroom_label")}</p>
            <h2 className="display-lat mt-6 text-[1.875rem] leading-[1.1] text-ink md:text-[2.5rem]">
              {t("showroom_heading")}
            </h2>
          </ScrollReveal>
          <div className="md:col-span-6 md:col-start-6">
            <ScrollReveal delay={1} className="editorial">
              <p>{t("showroom_body")}</p>
              <p className="text-ink-soft">{t("showroom_note")}</p>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <Link href="/inquiry" className="brass-disc brass-disc--solid mt-8 inline-flex">
                {t("showroom_cta")}
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Bracket({ position }: { position: "top-start" | "top-end" | "bottom-start" | "bottom-end" }) {
  const base = "absolute h-5 w-5 border-brass";
  const map: Record<string, string> = {
    "top-start":    `${base} top-3 start-3 border-t border-s`,
    "top-end":      `${base} top-3 end-3 border-t border-e`,
    "bottom-start": `${base} bottom-3 start-3 border-b border-s`,
    "bottom-end":   `${base} bottom-3 end-3 border-b border-e`,
  };
  return <span aria-hidden className={map[position]} />;
}
