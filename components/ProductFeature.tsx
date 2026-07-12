"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, resolveProduct } from "@/lib/products";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";

export function ProductFeature({ product: sourceProduct }: { product: Product }) {
  const { t, locale } = useLanguage();
  const product = resolveProduct(sourceProduct, locale);
  const [currentIndex, setCurrentIndex] = useState(0);

  const mainImage = product.images[currentIndex] ?? product.images[0];

  return (
    <section className="bg-paper border-t border-rule">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12 md:mb-16 md:text-center">
          <h2 className="display-he text-[2rem] text-ink md:text-[2.75rem]">
            {t("prod_feature_title")}
          </h2>
          <p className="mt-4 text-[1.0625rem] text-ink-soft max-w-2xl mx-auto">
            {t("prod_feature_sub")}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-12 md:gap-16 items-start">
          <div className="md:col-span-6 flex flex-col gap-4">
            <figure className="relative aspect-square w-full overflow-hidden bg-velvet">
              <Image
                src={mainImage.src}
                alt={mainImage.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </figure>
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3 mt-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`relative aspect-square overflow-hidden bg-velvet border-2 transition-colors ${
                      currentIndex === i ? "border-ink" : "border-transparent hover:border-ink/50"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="20vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-6 flex flex-col pt-4 md:pt-12">
            <p className="text-[0.875rem] text-ink-mute tracking-wide mb-3">
              {product.category}
            </p>
            <h3 className="display-he text-[2rem] leading-tight text-ink mb-4">
              {product.title}
            </h3>
            <p className="text-[1.25rem] text-ink mb-6">
              {product.priceLabel}
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-10">
              {product.shortDescription}
            </p>

            <div className="border-t border-rule mb-8">
              <dl className="divide-y divide-rule">
                {product.specs.map((spec, index) => (
                  <div key={index} className="py-4 flex justify-between gap-4">
                    <dt className="text-ink-soft">{spec.label}</dt>
                    <dd className="text-ink text-end">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-[0.875rem] text-ink-mute mt-4">
                {t("prod_feature_note")}
              </p>
            </div>

            <div className="mt-auto">
              <Link
                href={`/inquiry?product=${product.slug}`}
                className="brass-disc brass-disc--solid w-full text-center flex justify-center"
              >
                {product.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
