import Image from "next/image";
import Link from "next/link";
import type { CollectionPage } from "@/lib/collection-pages";

export function CollectionSeoPage({ page }: { page: CollectionPage }) {
  const faqJsonLd = page.faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : undefined;

  return (
    <section className="bg-paper" dir="rtl">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-5 md:self-center">
          <p className="section-label" dir="ltr">
            {page.eyebrow}
          </p>
          <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.75rem]">
            {page.titleLat ? (
              <>
                <span dir="ltr">{page.titleLat}</span>
                <span className="mt-3 block display-he text-[2rem] md:text-[2.75rem]">
                  {page.title}
                </span>
              </>
            ) : (
              page.title
            )}
          </h1>
          <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {page.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href={page.primaryCta.href} className="brass-disc brass-disc--solid">
              {page.primaryCta.label}
            </Link>
            {page.secondaryCta && (
              <Link href={page.secondaryCta.href} className="hairline-link text-[0.9375rem]">
                {page.secondaryCta.label}
              </Link>
            )}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
            <Image
              src={page.image}
              alt={page.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </figure>
        </div>
      </div>

      <div className="bg-paper-deep">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 md:grid-cols-3 md:px-12 md:py-20">
          {page.points.map((point) => (
            <div key={point} className="border-t border-rule pt-6">
              <p className="text-[1rem] leading-relaxed text-ink-soft">{point}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.title} className="border-t border-rule pt-6">
              <h2 className="display-he text-[1.625rem] leading-tight text-ink">
                {section.title}
              </h2>
              <p className="mt-5 text-[0.9875rem] leading-relaxed text-ink-soft">
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {page.faqs && (
        <section className="bg-paper-deep">
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12 md:py-24">
            <p className="section-label">שאלות נפוצות</p>
            <div className="mt-8 divide-y divide-rule">
              {page.faqs.map((faq) => (
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
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="section-label">Maison Mana</p>
        <h2 className="display-he mt-5 text-[2rem] leading-[1.15] text-ink md:text-[2.75rem]">
          המשך אישי ושקט
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          לאחר בחירת הכיוון, אפשר להתחיל בהדמיה אישית או לתאם פגישה פרטית עם האטלייה לבחירת אבן, מתכת ופרופורציה.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hairline-link">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
