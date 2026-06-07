"use client";

import { InquirySheet } from "@/components/InquirySheet";
import { pieceBySlug } from "@/lib/pieces";
import { useLanguage } from "@/components/LanguageProvider";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function InquiryContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const pieceSlug = searchParams.get("piece") ?? undefined;
  const piece = pieceSlug ? pieceBySlug(pieceSlug) : undefined;
  const presetPiece = piece ? `${piece.nameHe} · ${piece.reference}` : undefined;
  const presetBespoke = searchParams.get("bespoke") ?? undefined;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 pt-28 pb-12 md:px-12 md:pt-36 md:pb-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="section-label">{t("inquiry_label")}</p>
            <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.25rem]">
              {t("inquiry_heading")}
            </h1>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:self-end editorial">
            <p>{t("inquiry_body")}</p>
          </div>
        </div>
      </div>

      <div className="bg-paper-deep py-20 md:py-28">
        <div className="px-6 md:px-12">
          <InquirySheet presetPiece={presetPiece} presetBespoke={presetBespoke} />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:grid-cols-3 md:px-12">
        <ContactBlock label={t("contact_maison")}>
          Diamond Exchange<br />Ramat Gan, Israel<br />Third Floor, No Sign
        </ContactBlock>
        <ContactBlock label={t("contact_hours_label")}>
          Sun–Thu · 10:00–19:00<br />Fri · 9:30–13:00<br />
          <span className="text-ink-mute">{t("contact_hours_note")}</span>
        </ContactBlock>
        <ContactBlock label={t("contact_private")}>
          <a href="mailto:salon@maisonmana.co.il" className="hairline-link">salon@maisonmana.co.il</a>
          <br />
          <a href="https://wa.me/972500000000" className="hairline-link">WhatsApp · Private Enquiry</a>
        </ContactBlock>
      </div>
    </section>
  );
}

function ContactBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-6">
      <p className="section-label">{label}</p>
      <div className="mt-4 text-[0.9375rem] text-ink leading-relaxed">{children}</div>
    </div>
  );
}

export default function InquiryPage() {
  return (
    <Suspense>
      <InquiryContent />
    </Suspense>
  );
}
