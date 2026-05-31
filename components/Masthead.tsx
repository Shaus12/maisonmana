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
    <header className="masthead absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 md:py-7">
        <Link href="/" className="group flex flex-col items-start gap-1">
          <span className="display-lat text-[1.75rem] md:text-[2.125rem] leading-none text-white">
            Maison Mana
          </span>
          <span className="text-[0.6875rem] tracking-[0.22em] text-white/60 uppercase">
            Atelier&nbsp;·&nbsp;Tel Aviv
          </span>
        </Link>

        <nav aria-label="ניווט ראשי" className="hidden md:flex items-center gap-10">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-[0.9375rem] font-normal text-white/85 transition-colors duration-300 hover:text-white">
              {item.he}
            </Link>
          ))}
        </nav>

        <MobileNav items={NAV} />
      </div>
    </header>
  );
}
