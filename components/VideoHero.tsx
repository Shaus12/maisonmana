"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLanguage } from "./LanguageProvider";

export function VideoHero() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let raf: number;
    const handleScroll = () => {
      raf = requestAnimationFrame(() => {
        if (!videoRef.current) return;
        const y = Math.min(window.scrollY * 0.25, 180);
        videoRef.current.style.transform = `translateY(${y}px) scale(1.12)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => { window.removeEventListener("scroll", handleScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-velvet-deep">
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ willChange: "transform", transform: "scale(1.12)" }}
      />

      {/* Warm charcoal gradient scrim */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.12 0.010 60 / 0.90) 0%, oklch(0.12 0.010 60 / 0.40) 38%, oklch(0.12 0.010 60 / 0.10) 68%, transparent 100%)",
        }}
      />

      {/* Text block — bottom start */}
      <div className="absolute bottom-0 start-0 px-6 pb-14 md:px-14 md:pb-20 max-w-3xl">
        <p
          className="section-label fade-in"
          style={{ color: "oklch(0.74 0.110 78)", letterSpacing: "0.20em" }}
        >
          {t("hero_tagline")}
        </p>
        <h1
          className="display-lat mt-5 leading-[1.0] fade-in"
          style={{ color: "oklch(0.985 0.004 75)", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          {t("hero_h1_1")}<br />
          {t("hero_h1_2")}<br />
          {t("hero_h1_3")}
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 fade-in-delayed">
          <Link
            href="/inquiry"
            className="brass-disc text-[0.875rem] sm:text-[0.9375rem]"
            style={{
              borderColor: "oklch(0.74 0.110 78 / 0.85)",
              color: "oklch(0.985 0.004 75)",
              background: "transparent",
            }}
          >
            {t("hero_cta_view")}
          </Link>
          <Link
            href="/collections/rings"
            className="text-[0.8125rem] tracking-[0.08em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "oklch(0.985 0.004 75 / 0.65)" }}
          >
            {t("hero_cta_collections")}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 end-8 md:end-14 flex flex-col items-center gap-2" aria-hidden>
        <div
          className="w-px h-12 scroll-line"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.74 0.110 78 / 0.75), oklch(0.74 0.110 78 / 0.0))",
          }}
        />
      </div>
    </section>
  );
}
