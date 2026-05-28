"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type NavItem = { href: string; he: string };

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="display-he text-[0.9375rem] text-ink"
        aria-expanded={open}
      >
        תפריט
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-paper">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 pt-10 pb-6">
              <span className="display-lat text-[1.75rem] leading-none text-ink">Maison Mana</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="display-he text-[0.9375rem] text-ink"
                aria-label="סגירת תפריט"
              >
                סגירה
              </button>
            </div>
            <div className="optical-rule h-px w-full" />
            <nav aria-label="ניווט נייד" className="flex flex-1 flex-col justify-center gap-8 px-8">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display-he text-[2.5rem] leading-none text-ink"
                >
                  {item.he}
                </Link>
              ))}
            </nav>
            <div className="px-8 pb-12 text-ink-mute text-sm">
              <p>בית מאזון מנא · רמת גן</p>
              <p>בורסת היהלומים · בתיאום מראש בלבד</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
