"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, resolveProduct } from "@/lib/products";
import { useLanguage } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

export function ProductGrid({
  products,
  titleKey,
  subtitleKey,
  showHeader = true,
}: {
  products: Product[];
  titleKey?: StringKey;
  subtitleKey?: StringKey;
  showHeader?: boolean;
}) {
  const { t, locale } = useLanguage();

  return (
    <section className="bg-paper border-t border-rule">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-12 md:py-24">
        {showHeader && (
          <div className="mb-12 md:mb-16 md:text-center">
            <h2 className="display-he text-[2rem] text-ink md:text-[2.75rem]">
              {t(titleKey ?? "prod_grid_title")}
            </h2>
            {subtitleKey && (
              <p className="mt-4 text-[1.0625rem] text-ink-soft max-w-2xl mx-auto">
                {t(subtitleKey)}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((sourceProduct) => {
            const product = resolveProduct(sourceProduct, locale);
            const firstImage = product.images[0];

            const optionsSummary = product.options && product.options.length > 0
              ? `${t("prod_options_label")}: ${product.options.map((opt) => opt.label).join(", ")}`
              : null;

            return (
              <div key={product.slug} className="group flex flex-col">
                <Link href={`/products/${product.slug}`} className="mb-3 block relative aspect-[4/5] w-full overflow-hidden bg-velvet md:mb-6">
                  {firstImage ? (
                    <Image
                      src={firstImage.src}
                      alt={firstImage.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-mute bg-paper-deep">
                      {t("prod_no_image")}
                    </div>
                  )}
                </Link>

                <div className="flex flex-col flex-grow">
                  <p className="mb-1 text-[0.625rem] uppercase tracking-[0.14em] text-ink-mute md:mb-2 md:text-[0.75rem] md:tracking-widest">
                    {product.category}
                  </p>
                  <h3 className="display-he mb-2 text-[1rem] leading-snug text-ink md:mb-3 md:text-[1.375rem]">
                    {product.title}
                  </h3>
                  <p className="mb-4 text-[0.9375rem] text-ink-soft md:mb-6 md:text-[1.125rem]">
                    {product.priceLabel}
                  </p>

                  <ul className="mb-6 hidden flex-grow space-y-1.5 text-[0.875rem] text-ink-soft md:block">
                    {product.specs.slice(0, 4).map((spec, i) => (
                      <li key={i}>
                        <span className="text-ink">{spec.label}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>

                  {optionsSummary && (
                    <p className="mb-8 hidden border-t border-rule pt-4 text-[0.875rem] text-ink-mute md:block">
                      {optionsSummary}
                    </p>
                  )}

                  <div className="mt-auto pt-2 md:pt-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="brass-disc brass-disc--solid flex w-full justify-center px-3 py-2 text-center text-[0.8125rem] md:py-3 md:text-[0.9375rem]"
                    >
                      {t("prod_view_order")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
