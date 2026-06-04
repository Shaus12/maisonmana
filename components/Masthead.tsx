"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/", he: "הבית" },
  { href: "/collections/rings", he: "האוספים" },
  { href: "/atelier", he: "האטלייה" },
  { href: "/mirror", he: "המראה" },
  { href: "/inquiry", he: "יצירת קשר" },
];

export function Masthead() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 72);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`masthead-fixed${scrolled ? " is-scrolled" : ""}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
        {/* Wordmark */}
        <Link href="/" className="flex flex-col items-start gap-1">
          <span className="masthead-wordmark display-lat text-[1.625rem] md:text-[1.875rem] leading-none">
            Maison Mana
          </span>
          <span className="masthead-sub text-[0.5625rem] tracking-[0.26em] uppercase">
            Atelier&nbsp;·&nbsp;Tel Aviv
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="masthead-nav-link text-[0.875rem] tracking-[0.01em]"
            >
              {item.he}
            </Link>
          ))}
        </nav>

        {/* Mobile trigger */}
        <MobileNav items={NAV} isLight={!scrolled} />
      </div>
    </header>
  );
}
