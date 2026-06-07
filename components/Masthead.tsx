"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "./MobileNav";
import { useLanguage } from "./LanguageProvider";

export function Masthead() {
  const { t, locale, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const NAV = [
    { href: "/",                label: t("nav_home") },
    { href: "/collections/rings", label: t("nav_collections") },
    { href: "/atelier",         label: t("nav_studio") },
    { href: "/mirror",          label: t("nav_mirror") },
    { href: "/inquiry",         label: t("nav_contact") },
  ];

  return (
    <header className={`masthead-fixed${scrolled ? " is-scrolled" : ""}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 md:py-6">

        {/* Wordmark */}
        <Link href="/" className="flex flex-col items-start gap-1">
          <span className="masthead-wordmark display-lat text-[1.625rem] md:text-[1.875rem] leading-none">
            Maison Mana
          </span>
          <span className="masthead-sub text-[0.5625rem] tracking-[0.26em] uppercase">
            {t("masthead_sub")}
          </span>
        </Link>

        {/* Desktop nav + lang toggle */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <nav aria-label="Primary navigation" className="flex items-center gap-8 lg:gap-10">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="masthead-nav-link text-[0.875rem] tracking-[0.01em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="masthead-nav-link text-[0.75rem] tracking-[0.12em] uppercase border border-current/30 px-2.5 py-1 rounded-full transition-all hover:border-current/70"
          >
            {locale === "en" ? "עב" : "EN"}
          </button>
        </div>

        {/* Mobile: lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            aria-label="Switch language"
            className="masthead-mobile-btn text-[0.6875rem] tracking-[0.14em] uppercase border border-current/30 px-2 py-0.5 rounded-full"
          >
            {locale === "en" ? "עב" : "EN"}
          </button>
          <MobileNav items={NAV} isLight={!scrolled} />
        </div>
      </div>
    </header>
  );
}
