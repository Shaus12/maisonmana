"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/catalog";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProductPage() {
  const params = useParams();
  const category = params.category as string;
  const productId = params.productId as string;
  const { t } = useLanguage();

  const product = getProductById(productId);

  if (!product || product.category !== category) {
    notFound();
  }

  const isRing = category === "rings";

  return (
    <div className="bg-paper min-h-screen pt-40 pb-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-ink-mute mb-16 uppercase tracking-[0.2em] font-body">
          <Link href="/" className="hover:text-ink transition-colors">
            {t("col_breadcrumb_home")}
          </Link>
          <span className="mx-3">/</span>
          <Link
            href={`/collections/${category}`}
            className="hover:text-ink transition-colors"
          >
            {t(`col_label_${category}` as Parameters<typeof t>[0])}
          </Link>
          <span className="mx-3">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Image */}
          <div className="md:col-span-7 relative aspect-[4/5] bg-vellum rounded-[1rem] overflow-hidden fade-in-cascade-1">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="md:col-span-5 flex flex-col fade-in-cascade-2 md:sticky md:top-40">
            <h1 className="font-display text-[3.5rem] md:text-[4.5rem] text-ink leading-[1.0] mb-6 tracking-tight">
              {product.name}
            </h1>
            <p className="text-2xl text-ink font-body mb-8">
              ₪{product.price.toLocaleString()}
            </p>

            <div className="h-px w-12 bg-rule mb-8" />

            <p className="text-ink-soft text-lg leading-relaxed mb-12 font-body">
              {product.description}
            </p>

            <div className="pt-8 border-t border-rule mb-12">
              <h3 className="font-display text-xl text-ink mb-6">
                {t("col_specifications")}
              </h3>
              <ul className="text-ink-soft space-y-3 text-sm font-body">
                <li className="flex justify-between border-b border-rule-soft pb-2">
                  <span className="text-ink-mute uppercase tracking-wider text-xs">
                    {t("col_metals")}
                  </span>
                  <span className="text-ink">{product.metalOptions.join(", ")}</span>
                </li>
                {product.shapeOptions && (
                  <li className="flex justify-between border-b border-rule-soft pb-2">
                    <span className="text-ink-mute uppercase tracking-wider text-xs">
                      {t("col_shapes")}
                    </span>
                    <span className="text-ink">{product.shapeOptions.join(", ")}</span>
                  </li>
                )}
                {product.settingOptions && (
                  <li className="flex justify-between border-b border-rule-soft pb-2">
                    <span className="text-ink-mute uppercase tracking-wider text-xs">
                      {t("col_settings")}
                    </span>
                    <span className="text-ink">{product.settingOptions.join(", ")}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-auto pt-4 flex flex-col gap-4">
              <Link
                href={isRing ? "/atelier" : "/inquiry"}
                className="hero-btn-solid w-full text-center"
              >
                {isRing ? t("col_cta_atelier") : t("col_cta_inquiry")}
              </Link>
              <p className="text-center text-xs text-ink-mute uppercase tracking-widest mt-4">
                {t("col_handcrafted")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
