"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type NavItem = { href: string; he: string };

export function MobileNav({ items, isLight = false }: { items: NavItem[]; isLight?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`masthead-mobile-btn display-he text-[0.9375rem]${isLight ? "" : ""}`}
        aria-expanded={open}
        aria-label="פתיחת תפריט"
      >
        תפריט
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-paper"
          style={{ animation: "fadeIn 340ms var(--ease-expo) both" }}
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-5">
              <span className="display-lat text-[1.625rem] leading-none text-ink">Maison Mana</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="display-he text-[0.875rem] text-ink-mute hover:text-ink transition-colors"
                aria-label="סגירת תפריט"
              >
                סגירה
              </button>
            </div>
            <div className="optical-rule h-px w-full" />

            {/* Nav items */}
            <nav aria-label="ניווט נייד" className="flex flex-1 flex-col justify-center gap-6 px-8">
              {items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display-he text-[2.25rem] leading-none text-ink hover:text-ink-soft transition-colors"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item.he}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-8 pb-10 text-ink-mute text-[0.8125rem] leading-relaxed">
              <p>בית מאזון מנא</p>
              <p>בורסת היהלומים, רמת גן</p>
              <p className="mt-2 text-[0.75rem]">בתיאום מראש בלבד</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
