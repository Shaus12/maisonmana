"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import type { CollectionPage } from "@/lib/collection-pages";
import { canCheckoutProduct, getFeaturedProductsByCategory, resolveProduct, type Product } from "@/lib/products";

export function CollectionSeoPage({
  page,
  children,
  afterIntroContent,
  heroExtraCta
}: {
  page: CollectionPage,
  children?: React.ReactNode,
  afterIntroContent?: React.ReactNode,
  heroExtraCta?: { href: string; labelKey: string }
}) {
  const { t } = useLanguage();
  const previewProducts = page.productPreview
    ? getFeaturedProductsByCategory(page.productPreview.category, page.productPreview.limit)
    : [];

  const faqJsonLd = page.faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((faq) => ({
          "@type": "Question",
          name: t(faq.questionKey as any),
          acceptedAnswer: {
            "@type": "Answer",
            text: t(faq.answerKey as any),
          },
        })),
      }
    : undefined;

  return (
    <section className="bg-paper">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-28 pb-16 md:grid-cols-12 md:px-12 md:pt-36 md:pb-24">
        <div className="md:col-span-5 md:self-start">
          <div className="mb-8">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-[0.875rem] text-ink-mute hover:text-ink transition-colors"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
              {t("seo_back_collections" as any)}
            </Link>
          </div>
          <p className="section-label" dir="ltr">
            {t(page.eyebrowKey as any)}
          </p>
          <h1 className="display-lat mt-6 text-[2.75rem] leading-[1.05] text-ink md:text-[4.75rem]">
            {page.titleLat ? (
              <>
                <span dir="ltr">{page.titleLat}</span>
                <span className="mt-3 block display-he text-[2rem] md:text-[2.75rem]">
                  {t(page.titleKey as any)}
                </span>
              </>
            ) : (
              t(page.titleKey as any)
            )}
          </h1>
          <p className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {t(page.descriptionKey as any)}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link href={page.primaryCta.href} className="brass-disc brass-disc--solid">
              {t(page.primaryCta.labelKey as any)}
            </Link>
            {page.secondaryCta && (
              <Link href={page.secondaryCta.href} className="hairline-link text-[0.9375rem]">
                {t(page.secondaryCta.labelKey as any)}
              </Link>
            )}
            {heroExtraCta && (
              <a href={heroExtraCta.href} className="brass-disc">
                {t(heroExtraCta.labelKey as any)}
              </a>
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
          {page.pointsKeys.map((pointKey) => (
            <div key={pointKey} className="border-t border-rule pt-6">
              <p className="text-[1rem] leading-relaxed text-ink-soft">{t(pointKey as any)}</p>
            </div>
          ))}
        </div>
      </div>

      {afterIntroContent}

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className={`grid gap-10 ${page.detailImages && page.detailImages.length === 1 ? "md:col-span-7 md:grid-cols-2" : "md:col-span-12 md:grid-cols-3"}`}>
            {page.sections.map((section) => (
              <article key={section.titleKey} className="border-t border-rule pt-6">
                <h2 className="display-he text-[1.625rem] leading-tight text-ink">
                  {t(section.titleKey as any)}
                </h2>
                <p className="mt-5 text-[0.9875rem] leading-relaxed text-ink-soft">
                  {t(section.bodyKey as any)}
                </p>
              </article>
            ))}
          </div>
          {page.detailImages && page.detailImages.length === 1 && (
            <div className="md:col-span-4 md:col-start-9">
              <figure className="relative aspect-[3/4] w-full overflow-hidden border border-ink/10 bg-velvet mt-6 md:mt-0">
                <Image
                  src={page.detailImages[0].src}
                  alt={page.detailImages[0].alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: page.detailImages[0].objectPosition || "center center" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </figure>
            </div>
          )}
        </div>
      </section>

      {page.detailImages && page.detailImages.length > 1 && (
        <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-12">
          <h2 className="display-he text-[1.25rem] text-ink mb-10 text-center tracking-wide">
            {t("seo_details" as any)}
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            {page.detailImages.map((img, i) => (
              <figure key={i} className="relative w-full md:w-[320px] aspect-[4/5] overflow-hidden border border-ink/10 bg-velvet">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: img.objectPosition || "center center" }}
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {page.productPreview && (
        <CollectionProductPreview
          products={previewProducts}
          title={t(page.productPreview.titleKey as any)}
          body={t(page.productPreview.bodyKey as any)}
          ctaHref={page.shopCta.href}
          ctaLabel={t(page.shopCta.labelKey as any)}
          consultationHref={page.consultationCta.href}
          consultationLabel={t(page.consultationCta.labelKey as any)}
        />
      )}

      {page.faqs && (
        <section className="bg-paper-deep">
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12 md:py-24">
            <p className="section-label">{t("seo_faqs" as any)}</p>
            <div className="mt-8 divide-y divide-rule">
              {page.faqs.map((faq) => (
                <details key={faq.questionKey} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-start">
                    <h2 className="display-he text-[1.25rem] leading-tight text-ink md:text-[1.5rem]">
                      {t(faq.questionKey as any)}
                    </h2>
                    <span className="text-ink-mute transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl text-[0.9875rem] leading-relaxed text-ink-soft">
                    {t(faq.answerKey as any)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {children}

      <section className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-12 md:py-24">
        <p className="section-label">Maison Mana</p>
        <h2 className="display-he mt-5 text-[2rem] leading-[1.15] text-ink md:text-[2.75rem]">
          {t("seo_continue_title" as any)}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {t("seo_continue_body" as any)}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href={page.shopCta.href} className="brass-disc brass-disc--solid">
            {t(page.shopCta.labelKey as any)}
          </Link>
          <Link href={page.consultationCta.href} className="brass-disc">
            {t(page.consultationCta.labelKey as any)}
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {page.relatedLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hairline-link">
              {t(link.labelKey as any)}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function CollectionProductPreview({
  products,
  title,
  body,
  ctaHref,
  ctaLabel,
  consultationHref,
  consultationLabel,
}: {
  products: Product[];
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  consultationHref: string;
  consultationLabel: string;
}) {
  const { locale, t } = useLanguage();
  const visibleProducts = products.slice(0, 4);

  if (visibleProducts.length === 0) {
    return (
      <section className="bg-paper px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-[980px] border-y border-rule bg-paper-deep/45 px-6 py-12 text-center md:px-12 md:py-16">
          <p className="section-label">{t("preview_label" as any)}</p>
          <h2 className="display-he mt-5 text-[2rem] leading-[1.15] text-ink md:text-[2.6rem]">
            {t("preview_empty_title" as any)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
            {t("preview_empty_body" as any)}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={consultationHref} className="brass-disc brass-disc--solid">
              {consultationLabel}
            </Link>
            <Link href={ctaHref} className="brass-disc">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (visibleProducts.length === 1) {
    const sourceProduct = visibleProducts[0];
    const product = resolveProduct(sourceProduct, locale);
    const canCheckout = canCheckoutProduct(sourceProduct);
    const image = product.images[0];

    return (
      <section className="bg-paper px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-[1180px] border-y border-rule bg-paper-deep/45">
          <div className="grid gap-0 md:grid-cols-2">
            <figure className="relative min-h-[360px] overflow-hidden bg-velvet md:min-h-[520px]">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-paper-deep text-ink-mute">
                  {t("prod_no_image" as any)}
                </div>
              )}
            </figure>

            <div className="flex flex-col justify-center px-6 py-10 text-start md:px-12 md:py-16">
              <p className="section-label">{t("preview_label" as any)}</p>
              <h2 className="display-he mt-5 text-[2rem] leading-[1.12] text-ink md:text-[2.75rem]">
                {t("preview_featured_title" as any)}
              </h2>
              <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
                {t("preview_featured_body" as any)}
              </p>

              <div className="mt-8 border-t border-rule pt-7">
                <p className="text-[0.75rem] uppercase tracking-[0.16em] text-ink-mute">
                  {product.category}
                </p>
                <h3 className="mt-3 display-he text-[1.75rem] leading-tight text-ink md:text-[2.15rem]">
                  {product.title}
                </h3>
                <p className="mt-3 text-[1.125rem] text-ink-soft">
                  {product.priceLabel}
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-4">
                <Link href={canCheckout ? `/checkout/${product.slug}` : `/products/${product.slug}`} className="brass-disc brass-disc--solid">
                  {canCheckout ? "לרכישה" : t("prod_view_order" as any)}
                </Link>
                <Link href={ctaHref} className="brass-disc">
                  {ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-rule bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="section-label">{t("preview_label" as any)}</p>
            <h2 className="display-he mt-5 text-[2rem] leading-[1.12] text-ink md:text-[2.75rem]">
              {title}
            </h2>
            <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              {body}
            </p>
            <Link href={ctaHref} className="brass-disc brass-disc--solid mt-8 inline-flex">
              {ctaLabel}
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:col-span-8 lg:grid-cols-4">
            {visibleProducts.map((sourceProduct) => {
              const product = resolveProduct(sourceProduct, locale);
              const image = product.images[0];

              return (
                <article key={product.slug} className="group">
                  <Link href={`/products/${product.slug}`} className="block">
                    <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
                      {image ? (
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 18vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-paper-deep text-ink-mute">
                          {t("prod_no_image" as any)}
                        </div>
                      )}
                    </figure>
                    <p className="mt-5 text-[0.75rem] uppercase tracking-[0.16em] text-ink-mute">
                      {product.category}
                    </p>
                    <h3 className="mt-2 display-he text-[1.25rem] leading-snug text-ink">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-[1rem] text-ink-soft">
                      {product.priceLabel}
                    </p>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
