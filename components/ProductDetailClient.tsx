"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, resolveProduct } from "@/lib/products";
import { submitProductInquiry } from "@/app/products/[slug]/actions";
import { useLanguage } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

export function ProductDetailClient({ product: sourceProduct }: { product: Product }) {
  const { t, locale } = useLanguage();
  const product = resolveProduct(sourceProduct, locale);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Select choices are stored by index so they survive a language switch;
  // free-text values are stored as-is.
  const [selectedIndexes, setSelectedIndexes] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    sourceProduct.options?.forEach((opt) => {
      if (opt.type === "select" && opt.options.length > 0) defaults[opt.name] = 0;
    });
    return defaults;
  });
  const [textValues, setTextValues] = useState<Record<string, string>>({});

  const [state, formAction, isPending] = useActionState(submitProductInquiry, { status: "idle" });
  const isSuccess = state.status === "ok";
  const errorText = (code: string) => t(code as StringKey);

  const mainImage = product.images[currentImageIndex] ?? product.images[0];

  const selectedOptions: Record<string, string> = {};
  product.options?.forEach((opt) => {
    if (opt.type === "select") {
      selectedOptions[opt.name] = opt.options[selectedIndexes[opt.name] ?? 0] ?? "";
    } else if (textValues[opt.name]) {
      selectedOptions[opt.name] = textValues[opt.name];
    }
  });

  const productContextPayload = {
    id: product.id,
    slug: product.slug,
    title: sourceProduct.title.he,
    category: sourceProduct.category.he,
    price: product.price,
    priceLabel: product.priceLabel,
  };

  return (
    <section className="bg-paper min-h-screen pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[0.875rem] text-ink-mute hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            {t("prod_back_catalog")}
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Images: first in reading order on mobile, opposite the text on desktop */}
          <div className="lg:col-span-7 flex flex-col order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-velvet mb-4">
              {mainImage ? (
                <Image
                  src={mainImage.src}
                  alt={mainImage.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-mute bg-paper-deep">
                  {t("prod_no_image")}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`relative aspect-[4/5] overflow-hidden bg-velvet border transition-colors ${
                      currentImageIndex === i ? "border-ink" : "border-transparent hover:border-ink/50"
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="15vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col order-2 lg:order-1 lg:pt-8">
            <p className="text-[0.875rem] text-ink-mute tracking-widest uppercase mb-3">
              {product.category}
            </p>
            <h1 className="display-he text-[2rem] leading-[1.1] text-ink md:text-[2.75rem] mb-4">
              {product.title}
            </h1>
            <p className="text-[1.5rem] text-ink mb-6">
              {product.priceLabel}
            </p>
            <p className="text-[1.0625rem] leading-relaxed text-ink-soft mb-8">
              {product.shortDescription}
            </p>

            <div className="border-t border-rule pt-8 mb-8">
              {product.options && product.options.length > 0 && (
                <div className="flex flex-col gap-6 mb-10">
                  {product.options.map((option) => (
                    <div key={option.name} className="flex flex-col gap-2">
                      <label htmlFor={`option-${option.name}`} className="text-[0.9375rem] text-ink font-medium">
                        {option.label}
                      </label>
                      {option.type === "select" ? (
                        <select
                          id={`option-${option.name}`}
                          className="w-full appearance-none border border-rule bg-transparent px-4 py-3 text-[1rem] text-ink focus:border-ink focus:outline-none focus:ring-0"
                          value={selectedIndexes[option.name] ?? 0}
                          onChange={(e) =>
                            setSelectedIndexes((prev) => ({ ...prev, [option.name]: Number(e.target.value) }))
                          }
                        >
                          {option.options.map((opt, i) => (
                            <option key={i} value={i}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id={`option-${option.name}`}
                          placeholder={option.placeholder}
                          className="w-full border border-rule bg-transparent px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none focus:ring-0"
                          value={textValues[option.name] || ""}
                          onChange={(e) =>
                            setTextValues((prev) => ({ ...prev, [option.name]: e.target.value }))
                          }
                        />
                      )}
                      {option.type === "text" && option.note && (
                        <p className="text-[0.8125rem] text-ink-mute mt-1">
                          {option.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-paper-deep p-6 border border-rule/50">
                <h3 className="display-he text-[1.5rem] text-ink mb-4">{t("prod_order_form_title")}</h3>

                {isSuccess ? (
                  <div className="text-center py-8">
                    <p className="text-[1.25rem] text-ink mb-2">{t("prod_thanks_title")}</p>
                    <p className="text-ink-soft">{t("prod_thanks_body")}</p>
                  </div>
                ) : (
                  <form action={formAction} className="flex flex-col gap-4">
                    <input type="hidden" name="originPage" value={`/products/${product.slug}`} />
                    <input type="hidden" name="product" value={JSON.stringify(productContextPayload)} />
                    <input type="hidden" name="selectedOptions" value={JSON.stringify(selectedOptions)} />

                    {state.status === "error" && !state.field && (
                      <p className="text-red-700 text-[0.875rem]">{errorText(state.message)}</p>
                    )}

                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder={t("prod_ph_full_name")}
                        className={`w-full border bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none focus:ring-0 ${
                          state.status === "error" && state.field === "fullName" ? "border-red-700" : "border-rule focus:border-ink"
                        }`}
                        required
                      />
                      {state.status === "error" && state.field === "fullName" && (
                        <p className="text-red-700 text-[0.8125rem] mt-1">{errorText(state.message)}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t("prod_ph_phone")}
                        className={`w-full border bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none focus:ring-0 ${
                          state.status === "error" && state.field === "phone" ? "border-red-700" : "border-rule focus:border-ink"
                        }`}
                        required
                        dir="ltr"
                        style={{ textAlign: locale === "he" ? "right" : "left" }}
                      />
                      {state.status === "error" && state.field === "phone" && (
                        <p className="text-red-700 text-[0.8125rem] mt-1">{errorText(state.message)}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder={t("prod_ph_email")}
                        className={`w-full border bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none focus:ring-0 ${
                          state.status === "error" && state.field === "email" ? "border-red-700" : "border-rule focus:border-ink"
                        }`}
                        dir="ltr"
                        style={{ textAlign: locale === "he" ? "right" : "left" }}
                      />
                      {state.status === "error" && state.field === "email" && (
                        <p className="text-red-700 text-[0.8125rem] mt-1">{errorText(state.message)}</p>
                      )}
                    </div>

                    <div>
                      <textarea
                        name="message"
                        placeholder={t("prod_ph_notes")}
                        rows={3}
                        className="w-full border border-rule bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none focus:ring-0 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="brass-disc brass-disc--solid w-full mt-2 py-3 disabled:opacity-50"
                    >
                      {isPending ? t("prod_sending") : t("prod_submit")}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specs lower on page */}
        <div className="mt-20 lg:mt-32 border-t border-rule pt-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="display-he text-[1.75rem] text-ink mb-8 text-center">
              {t("prod_specs_title")}
            </h2>
            <dl className="divide-y divide-rule border-t border-rule">
              {product.specs.map((spec, index) => (
                <div key={index} className="py-4 flex justify-between gap-4">
                  <dt className="text-ink-soft w-1/3">{spec.label}</dt>
                  <dd className="text-ink text-end font-medium w-2/3">{spec.value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-[0.875rem] text-ink-mute mt-8 text-center">
              {t("prod_specs_note")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
