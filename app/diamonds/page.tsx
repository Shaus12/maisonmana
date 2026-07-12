import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { DiamondsContent } from "@/components/DiamondsContent";
import { diamondFaqs } from "@/lib/diamonds-content";

export const metadata: Metadata = buildMetadata({
  title: "יהלומים | יהלום טבעי, יהלום מעבדה ומדריך ה-4Cs | Maison MANA",
  description:
    "מדריך היהלומים של Maison MANA. הכל על יהלום טבעי, יהלום מעבדה, ה-4Cs (צבע, ניקיון, חיתוך, קראט), ותעודות IGI ו-GIA.",
  path: "/diamonds",
});

export default function DiamondsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: diamondFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.questionHe,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answerHe,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DiamondsContent />
    </>
  );
}
