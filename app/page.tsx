"use client";

import Image from "next/image";
import Link from "next/link";
import { PieceTile } from "@/components/PieceTile";
import { VideoHero } from "@/components/VideoHero";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PIECES } from "@/lib/pieces";
import { useLanguage } from "@/components/LanguageProvider";

const HOME_FEATURED = ["anna-solitaire", "tennis-classique", "adria-tear"];

export default function Home() {
  const { t } = useLanguage();

  const featured = HOME_FEATURED.map(
    (slug) => PIECES.find((p) => p.slug === slug)!
  );

  return (
    <>
      {/* ── 1. FULLSCREEN VIDEO HERO ─────────────────────────────── */}
      <VideoHero />

      {/* ── 2. MAISON STATEMENT ──────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 md:grid-cols-12 md:gap-12 md:px-12 md:py-40">
          <ScrollReveal className="md:col-span-3">
            <p className="section-label">{t("statement_label")}</p>
          </ScrollReveal>
          <div className="md:col-span-8 md:col-start-5">
            <ScrollReveal delay={1}>
              <blockquote className="display-lat text-[1.375rem] leading-[1.55] text-ink md:text-[1.75rem]">
                {t("statement_quote")}
              </blockquote>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="mt-7 text-ink-mute text-[0.875rem] tracking-[0.04em]">
                {t("statement_attribution")}
              </p>
            </ScrollReveal>
          </div>
        </div>
        <div className="optical-rule h-px w-full" />
      </section>

      {/* ── 3. SIGNATURE PIECES ──────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-36">
          <ScrollReveal>
            <header className="flex items-end justify-between gap-8 pb-10 md:pb-16 border-b border-rule">
              <div>
                <p className="section-label">{t("pieces_label")}</p>
                <h2 className="display-lat mt-4 text-[1.75rem] leading-[1.1] text-ink md:text-[2.625rem]">
                  {t("pieces_heading")}
                </h2>
              </div>
              <Link href="/collections/rings" className="hairline-link text-[0.875rem] whitespace-nowrap text-ink-mute">
                {t("pieces_link")}
              </Link>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 pt-10 md:gap-y-20 md:grid-cols-12 md:pt-16">
            <ScrollReveal delay={1} className="md:col-span-5 md:col-start-1">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[0]} scale="lg" priority />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                {t("pieces_desc_0")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={2} className="md:col-span-5 md:col-start-7 md:mt-28">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[1]} scale="lg" />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                {t("pieces_desc_1")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={3} className="md:col-span-5 md:col-start-2 md:mt-14">
              <div className="piece-tile-wrap">
                <PieceTile piece={featured[2]} scale="lg" />
              </div>
              <p className="mt-5 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
                {t("pieces_desc_2")}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

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

      {/* ── 5. THE MIRROR ────────────────────────────────────────── */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:grid-cols-12 md:gap-12 md:px-12 md:py-40">
          <ScrollReveal direction="scale" className="md:col-span-6 md:col-start-1">
            <figure className="vellum relative aspect-[4/5] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=85"
                alt="Diamond pendant on a fine chain"
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
