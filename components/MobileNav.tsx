"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "./LanguageProvider";

type NavItem = { href: string; label: string };

export function MobileNav({ items, isLight = false }: { items: NavItem[]; isLight?: boolean }) {
  const { t } = useLanguage();
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
        className="masthead-mobile-btn text-[0.9375rem]"
        aria-expanded={open}
        aria-label="Open menu"
      >
        {t("nav_menu")}
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
                className="text-[0.875rem] text-ink-mute hover:text-ink transition-colors tracking-[0.04em]"
                aria-label="Close menu"
              >
                {t("nav_close")}
              </button>
            </div>
            <div className="optical-rule h-px w-full" />

            {/* Nav items */}
            <nav aria-label="Mobile navigation" className="flex flex-1 flex-col justify-center gap-6 px-8">
              {items.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display-lat text-[2rem] leading-none text-ink hover:text-ink-soft transition-colors"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-8 pb-10 text-ink-mute text-[0.8125rem] leading-relaxed">
              <p>{t("mobile_footer_1")}</p>
              <p>{t("mobile_footer_2")}</p>
              <p className="mt-2 text-[0.75rem]">{t("mobile_footer_3")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
