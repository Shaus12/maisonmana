import Link from "next/link";
import { MobileNav } from "./MobileNav";

const NAV = [
  { href: "/", he: "הבית" },
  { href: "/collections", he: "האוספים" },
  { href: "/atelier", he: "האטלייה" },
  { href: "/mirror", he: "המראה" },
  { href: "/inquiry", he: "יצירת קשר" },
];

export function Masthead() {
  return (
    <header className="relative z-30 bg-paper">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between px-6 pt-10 pb-6 md:px-12 md:pt-14">
        <Link href="/" className="group flex flex-col items-start gap-1">
          <span className="display-lat text-[1.75rem] md:text-[2.125rem] leading-none text-ink">
            Maison Mana
          </span>
          <span className="text-[0.6875rem] tracking-[0.22em] text-ink-mute uppercase">
            Atelier&nbsp;·&nbsp;Tel Aviv
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hairline-link text-[0.9375rem] font-normal text-ink">
              {item.he}
            </Link>
          ))}
        </nav>

        <MobileNav items={NAV} />
      </div>
      <div className="optical-rule h-px w-full" />
    </header>
  );
}
