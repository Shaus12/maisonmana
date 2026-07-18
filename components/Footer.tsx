"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

type FooterLink = { href: string; labelKey?: StringKey; label?: string };

const collectionLinks: FooterLink[] = [
  { href: "/engagement-rings", labelKey: "link_engagement" },
  { href: "/wedding-rings", labelKey: "link_wedding" },
  { href: "/diamond-rings", labelKey: "link_diamond_rings" },
  { href: "/tennis-bracelets", labelKey: "link_tennis_bracelets" },
  { href: "/diamond-necklaces", labelKey: "link_diamond_necklaces" },
  { href: "/diamond-earrings", labelKey: "link_diamond_earrings" },
  { href: "/mens-jewelry", labelKey: "footer_mens" },
  { href: "/high-jewelry", label: "High Jewelry" },
  { href: "/signature", label: "Signature Collection" },
];

const serviceLinks: FooterLink[] = [
  { href: "/products", labelKey: "nav_shop" },
  { href: "/atelier", labelKey: "nav_studio" },
  { href: "/atelier", labelKey: "footer_bespoke_design" },
  { href: "/inquiry", labelKey: "link_inquiry_private" },
  { href: "/diamonds", labelKey: "footer_diamond_consult" },
  { href: "/about", labelKey: "footer_our_story" },
];

const diamondLinks: FooterLink[] = [
  { href: "/diamonds", labelKey: "link_diamonds_guide" },
  { href: "/diamonds#natural-lab", labelKey: "footer_natural" },
  { href: "/diamonds#natural-lab", labelKey: "footer_lab" },
  { href: "/diamonds#certificates", labelKey: "footer_certified" },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-40 bg-paper-deep">
      <div className="optical-rule h-px w-full" />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 lg:grid-cols-7 lg:gap-8 lg:px-12 lg:py-20">
        <div className="lg:col-span-2">
          <p className="display-lat text-[2rem] leading-none text-ink">Maison Mana</p>
          <p className="mt-2 text-[0.6875rem] tracking-[0.22em] text-ink-mute uppercase">
            Atelier
          </p>
          <p className="mt-8 max-w-sm text-ink-soft text-[0.9375rem] leading-relaxed">
            {t("footer_tagline")}
          </p>
        </div>

        <FooterGroup title={t("footer_collections")} links={collectionLinks} />
        <FooterGroup title={t("footer_services")} links={serviceLinks} />
        <FooterGroup title={t("footer_diamonds")} links={diamondLinks} />

        <div className="lg:col-span-2">
          <p className="section-label">{t("contact_maison")}</p>
          <address className="mt-4 not-italic text-[0.9375rem] text-ink leading-relaxed">
            {t("footer_address_1")}
            <br />
            {t("footer_address_2")}
            <br />
            <span className="text-ink-mute">{t("contact_hours_note")}</span>
          </address>
          <div className="mt-5 space-y-2 text-[0.9375rem]">
            <a href="mailto:salon@maisonmana.co.il" className="hairline-link">
              salon@maisonmana.co.il
            </a>
            <br />
            <a href="https://wa.me/972507099933" target="_blank" rel="noopener noreferrer" className="hairline-link">
              WhatsApp · +972 50-709-9933
            </a>
            <br />
            <a href="https://www.instagram.com/maisonmana.diamonds" target="_blank" rel="noopener noreferrer" className="hairline-link">
              Instagram · @maisonmana.diamonds
            </a>
          </div>
        </div>
      </div>

      <div className="optical-rule h-px w-full" />
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-8 text-[0.75rem] text-ink-mute md:flex-row md:items-center md:justify-between md:px-12">
        <p>
          © <bdi dir="ltr">{new Date().getFullYear()}</bdi> Maison Mana. {t("footer_rights")}
          <span className="mx-2">|</span>
          <span>
            Built by{" "}
            <a
              href="https://futureproof-ai.tech/web"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink transition-colors underline underline-offset-2 font-medium"
            >
              FutureProofAI
            </a>
          </span>
        </p>
        <p className="display-lat tracking-[0.18em] uppercase text-[0.6875rem]">
          Bespoke · Bridal · Made by Hand
        </p>
      </div>
    </footer>
  );
}

function FooterGroup({ title, links }: { title: string; links: FooterLink[] }) {
  const { t } = useLanguage();
  return (
    <div>
      <p className="section-label">{title}</p>
      <ul className="mt-4 space-y-2 text-[0.9375rem]">
        {links.map((link) => {
          const label = link.labelKey ? t(link.labelKey) : link.label;
          return (
            <li key={`${link.href}-${label}`}>
              <Link href={link.href} className="hairline-link">
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
