"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { diamondTopics, diamondFaqs } from "@/lib/diamonds-content";

export function DiamondsContent() {
  const { locale } = useLanguage();
  const isHe = locale === "he";

  return (
    <section className="bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-6">
          <p className="section-label">Diamond Consultation</p>
          <h1 className="display-he mt-6 text-[2.75rem] leading-[1.08] text-ink md:text-[4.5rem]">
            {isHe ? "מדריך היהלומים" : "The Diamond Guide"}
          </h1>
        </div>
        <div className="md:col-span-5 md:col-start-8 md:self-end">
          <p className="text-[1.125rem] leading-relaxed text-ink-soft">
            {isHe
              ? "עמוד היהלומים מרכז את השאלות החשובות לפני בחירת אבן: מקור, צבע, ניקיון, חיתוך, משקל ותעודה."
              : "This page gathers the questions that matter before choosing a stone: origin, color, clarity, cut, weight, and certification."}
          </p>
          <div className="mt-8">
            <Link href="/inquiry" className="brass-disc brass-disc--solid">
              {isHe ? "לתיאום ייעוץ יהלומים" : "Book a Diamond Consultation"}
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-x-12 gap-y-14 px-6 py-16 md:grid-cols-3 md:px-12 md:py-24">
          {diamondTopics.map((topic) => (
            <article key={topic.id} id={topic.id} className="scroll-mt-28 border-t border-rule pt-6">
              <h2 className="display-he text-[1.625rem] leading-tight text-ink">
                {isHe ? topic.titleHe : topic.titleEn}
              </h2>
              <p className="mt-5 text-[0.9875rem] leading-relaxed text-ink-soft">
                {isHe ? topic.bodyHe : topic.bodyEn}
              </p>
            </article>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1000px] px-6 py-16 md:px-12 md:py-24">
        <p className="section-label">{isHe ? "שאלות נפוצות" : "Frequently Asked Questions"}</p>
        <div className="mt-8 divide-y divide-rule">
          {diamondFaqs.map((faq) => (
            <details key={faq.questionHe} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-start">
                <h2 className="display-he text-[1.25rem] leading-tight text-ink md:text-[1.5rem]">
                  {isHe ? faq.questionHe : faq.questionEn}
                </h2>
                <span className="text-ink-mute transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-[0.9875rem] leading-relaxed text-ink-soft">
                {isHe ? faq.answerHe : faq.answerEn}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="section-label">Private Appointment</p>
        <h2 className="display-he mt-5 text-[2rem] leading-[1.15] text-ink md:text-[2.75rem]">
          {isHe ? "ייעוץ לפני בחירת האבן" : "A Consultation Before Choosing the Stone"}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {isHe
            ? "בפגישה פרטית אפשר להשוות בין אבנים, להבין את התעודות ולבחור מפרט שמתאים לתכשיט ולא רק לטבלה."
            : "In a private meeting you can compare stones, understand the certificates, and choose a specification that suits the piece — not just the chart."}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-6">
          <Link href="/inquiry" className="hairline-link">
            {isHe ? "לתיאום פגישה פרטית" : "Book a Private Meeting"}
          </Link>
          <Link href="/engagement-rings" className="hairline-link">
            {isHe ? "טבעות אירוסין" : "Engagement Rings"}
          </Link>
          <Link href="/diamond-rings" className="hairline-link">
            {isHe ? "טבעות יהלום" : "Diamond Rings"}
          </Link>
        </div>
      </section>
    </section>
  );
}
