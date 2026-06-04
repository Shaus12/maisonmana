"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function VideoHero() {
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-[100dvh] overflow-hidden bg-velvet-deep">
      {/* Video — starts scaled up to allow parallax room */}
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

      {/* Primary scrim — warm charcoal from bottom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, oklch(0.12 0.010 60 / 0.90) 0%, oklch(0.12 0.010 60 / 0.40) 38%, oklch(0.12 0.010 60 / 0.10) 68%, transparent 100%)",
        }}
      />

      {/* Side vignette — towards inline-end (visual left in RTL) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to inline-end, oklch(0.12 0.010 60 / 0.50) 0%, transparent 55%)",
        }}
      />

      {/* Top gradient — lets masthead be readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.12 0.010 60 / 0.40) 0%, transparent 22%)",
        }}
      />

      {/* Text block — bottom start (right in RTL = natural Hebrew start) */}
      <div className="absolute bottom-0 start-0 px-6 pb-14 md:px-14 md:pb-20 max-w-3xl">
        <p
          className="section-label fade-in"
          style={{ color: "oklch(0.74 0.110 78)", letterSpacing: "0.20em" }}
        >
          מאזון מנא · תל אביב · מאז 2016
        </p>

        <h1
          className="display-he mt-5 leading-[1.0] fade-in"
          style={{
            color: "oklch(0.985 0.004 75)",
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
          }}
        >
          מקום אחד.
          <br />
          זוג אחד.
          <br />
          תכשיט אחד.
        </h1>

        <div className="mt-10 flex flex-wrap items-center gap-6 fade-in-delayed">
          <Link
            href="/inquiry"
            className="brass-disc text-[0.9375rem]"
            style={{
              borderColor: "oklch(0.74 0.110 78 / 0.85)",
              color: "oklch(0.985 0.004 75)",
              background: "transparent",
            }}
          >
            לקביעת צפייה פרטית
          </Link>
          <Link
            href="/collections/rings"
            className="text-[0.9375rem] hairline-link fade-in-delayed"
            style={{ color: "oklch(0.985 0.004 75 / 0.65)" }}
          >
            לצפייה באוספים
          </Link>
        </div>
      </div>

      {/* Scroll indicator — bottom end */}
      <div
        className="absolute bottom-10 end-8 md:end-14 flex flex-col items-center gap-2"
        aria-hidden
      >
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
