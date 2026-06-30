import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "יהלומים | יהלום טבעי, יהלום מעבדה ומדריך ה-4Cs | Maison MANA",
  description:
    "מדריך היהלומים של Maison MANA. הכל על יהלום טבעי, יהלום מעבדה, ה-4Cs (צבע, ניקיון, חיתוך, קראט), ותעודות IGI ו-GIA.",
  path: "/diamonds",
});

const diamondTopics = [
  {
    id: "natural-lab",
    title: "יהלומים טבעיים ויהלומי מעבדה",
    body: "שני המסלולים יכולים להתאים לתכשיט אישי. הבחירה נעשית לפי מקור האבן, תקציב, נדירות והתחושה שחשובה לך.",
  },
  {
    id: "color",
    title: "צבע היהלום",
    body: "צבע נבחן בסקאלה מקצועית, אך הבחירה הנכונה תלויה גם במתכת, בגודל האבן ובאופי התכשיט.",
  },
  {
    id: "clarity",
    title: "ניקיון",
    body: "ניקיון מתאר סימנים פנימיים וחיצוניים באבן. בפגישה נבחן מה נראה לעין ומה משמעותי רק בתעודה.",
  },
  {
    id: "cut",
    title: "חיתוך",
    body: "החיתוך משפיע על אור, ברק ותנועה. לעיתים הוא חשוב יותר מנתון קראט גבוה יותר.",
  },
  {
    id: "carat",
    title: "קראט",
    body: "קראט הוא משקל, לא רק גודל נראה לעין. צורת האבן והשיבוץ משפיעים מאוד על הנוכחות שלה.",
  },
  {
    id: "certificates",
    title: "תעודות",
    body: "Maison Mana עובדת עם אבנים בעלות תיעוד מקצועי כגון GIA, IGI ו-HRD כאשר הדבר רלוונטי למפרט האבן.",
  },
];

const diamondFaqs = [
  {
    question: "מה ההבדל בין יהלום טבעי ליהלום מעבדה?",
    answer:
      "יהלום טבעי נוצר בטבע לאורך זמן רב, ויהלום מעבדה נוצר בסביבה מבוקרת. שניהם יכולים להיות יהלומים אמיתיים, והבחירה תלויה במקור, תקציב, תעודה והעדפה אישית.",
  },
  {
    question: "מהי תעודת GIA או IGI?",
    answer:
      "תעודה של GIA או IGI מתארת את מאפייני היהלום כגון משקל, צבע, ניקיון וחיתוך. היא עוזרת להשוות בין אבנים בצורה מקצועית יותר.",
  },
  {
    question: "מה חשוב יותר: קראט, צבע או ניקיון?",
    answer:
      "אין נתון אחד שחשוב תמיד יותר. בטבעת או תכשיט מסוים החיתוך, הפרופורציה והמראה בעין יכולים להיות משמעותיים לא פחות מנתוני התעודה.",
  },
  {
    question: "האם אפשר לבחור יהלום לפי תקציב?",
    answer:
      "כן. בפגישה פרטית אפשר להגדיר טווח תקציב ולבחון אבנים שמתאימות למראה הרצוי ולתכשיט המתוכנן.",
  },
];

export default function DiamondsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: diamondFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="bg-paper" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-6">
          <p className="section-label">Diamond Consultation</p>
          <h1 className="display-he mt-6 text-[2.75rem] leading-[1.08] text-ink md:text-[4.5rem]">
            מדריך היהלומים
          </h1>
        </div>
        <div className="md:col-span-5 md:col-start-8 md:self-end">
          <p className="text-[1.125rem] leading-relaxed text-ink-soft">
            עמוד היהלומים מרכז את השאלות החשובות לפני בחירת אבן: מקור, צבע, ניקיון, חיתוך, משקל ותעודה.
          </p>
          <div className="mt-8">
            <Link href="/inquiry" className="brass-disc brass-disc--solid">
              לתיאום ייעוץ יהלומים
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-x-12 gap-y-14 px-6 py-16 md:grid-cols-3 md:px-12 md:py-24">
          {diamondTopics.map((topic) => (
            <article key={topic.title} id={topic.id} className="scroll-mt-28 border-t border-rule pt-6">
              <h2 className="display-he text-[1.625rem] leading-tight text-ink">{topic.title}</h2>
              <p className="mt-5 text-[0.9875rem] leading-relaxed text-ink-soft">{topic.body}</p>
            </article>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1000px] px-6 py-16 md:px-12 md:py-24">
        <p className="section-label">שאלות נפוצות</p>
        <div className="mt-8 divide-y divide-rule">
          {diamondFaqs.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-start">
                <h2 className="display-he text-[1.25rem] leading-tight text-ink md:text-[1.5rem]">
                  {faq.question}
                </h2>
                <span className="text-ink-mute transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-3xl text-[0.9875rem] leading-relaxed text-ink-soft">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="section-label">Private Appointment</p>
        <h2 className="display-he mt-5 text-[2rem] leading-[1.15] text-ink md:text-[2.75rem]">
          ייעוץ לפני בחירת האבן
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          בפגישה פרטית אפשר להשוות בין אבנים, להבין את התעודות ולבחור מפרט שמתאים לתכשיט ולא רק לטבלה.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-6">
          <Link href="/inquiry" className="hairline-link">
            לתיאום פגישה פרטית
          </Link>
          <Link href="/engagement-rings" className="hairline-link">
            טבעות אירוסין
          </Link>
          <Link href="/diamond-rings" className="hairline-link">
            טבעות יהלום
          </Link>
        </div>
      </section>
    </section>
  );
}
