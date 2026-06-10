"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { getProductsByCategory } from "@/lib/catalog";
import { useLanguage } from "@/components/LanguageProvider";
import { type StringKey } from "@/lib/i18n";

const VALID_CATEGORIES = ["rings", "necklaces", "earrings"] as const;
type PublicCategory = (typeof VALID_CATEGORIES)[number];

function isPublicCategory(category: string): category is PublicCategory {
  return VALID_CATEGORIES.includes(category as PublicCategory);
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { t } = useLanguage();

  if (!isPublicCategory(category)) {
    notFound();
  }

  const products = getProductsByCategory(category);

  const labelKey = `col_label_${category}` as StringKey;
  const titleKey = `col_title_${category}` as StringKey;

  return (
    <div className="bg-paper min-h-screen pt-40 pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">

        {/* Header */}
        <header className="mb-24 max-w-2xl fade-in-cascade-1">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-mute mb-4">
            {t(labelKey)}
          </p>
          <h1 className="font-display text-[4rem] md:text-[5.5rem] text-ink mb-6 leading-none">
            {t(titleKey)}
          </h1>
          <p className="text-ink-soft text-lg leading-relaxed font-body">
            {t("col_body")}
          </p>
        </header>

        {/* Product Grid — 2-col staggered, works for any item count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 items-start">
          {products.map((product, idx) => {
            const isOdd = idx % 2 === 1;
            return (
              <div
                key={product.id}
                className={`fade-in-cascade-2 ${isOdd ? "md:pt-20" : ""}`}
              >
                <Link
                  href={`/collections/${category}/${product.id}`}
                  className="group block"
                >
                  <div
                    className={`relative ${
                      isOdd ? "aspect-[3/4]" : "aspect-[4/5]"
                    } bg-vellum overflow-hidden rounded-[0.5rem]`}
                  >
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="mt-6">
                    <h2 className="font-display text-2xl text-ink mb-1 group-hover:text-ink-soft transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-ink-mute text-sm font-medium tracking-wide">
                      {t("col_from")} ₪{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
