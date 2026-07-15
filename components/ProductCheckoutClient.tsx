"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitCheckoutDetails, type CheckoutState } from "@/app/checkout/[slug]/actions";
import type { Product } from "@/lib/products";

type CheckoutProduct = Omit<Product, "paymentUrl">;

const initialState: CheckoutState = { status: "idle" };

export function ProductCheckoutClient({ product }: { product: CheckoutProduct }) {
  const searchParams = useSearchParams();
  const [state, formAction, isPending] = useActionState(submitCheckoutDetails, initialState);

  const optionDefaults = useMemo(() => getOptionDefaults(product, searchParams), [product, searchParams]);
  const [optionValues, setOptionValues] = useState<Record<string, string>>(optionDefaults);

  const mainImage = product.images[0];
  const selectedOptions = (product.options ?? [])
    .map((option) => ({ label: option.label.he, value: optionValues[option.name] }))
    .filter((option) => Boolean(option.value));

  useEffect(() => {
    fireAnalyticsEvent("begin_checkout", product);
  }, [product]);

  return (
    <section className="min-h-screen bg-paper pt-28 pb-16 md:pt-36 md:pb-24" dir="rtl">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        <Link
          href={`/products/${product.slug}`}
          className="mb-8 inline-flex items-center gap-2 text-[0.875rem] text-ink-mute transition-colors hover:text-ink"
        >
          <span aria-hidden="true">→</span>
          חזרה לפריט
        </Link>

        <div className="mb-10 max-w-3xl text-right">
          <p className="section-label">Checkout</p>
          <h1 className="display-he mt-4 text-[2.25rem] leading-[1.08] text-ink md:text-[3.5rem]">
            השלמת פרטי ההזמנה
          </h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft md:text-[1.1875rem]">
            מלאו את פרטי ההזמנה וההתאמות הרצויות. בשלב הבא תועברו לעמוד התשלום המאובטח של SUMIT.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16" style={{ direction: "ltr" }}>
          <aside className="lg:col-span-5" dir="rtl">
            <div className="sticky top-28">
              <figure className="relative aspect-[4/5] overflow-hidden bg-velvet">
                {mainImage ? (
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt.he}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-paper-deep text-ink-mute">
                    אין תמונה זמינה
                  </div>
                )}
              </figure>

              <div className="border-x border-b border-rule bg-paper px-5 py-6 text-right md:px-7">
                <p className="text-[0.75rem] uppercase tracking-[0.16em] text-ink-mute">
                  {product.category.he}
                </p>
                <h2 className="display-he mt-3 text-[1.75rem] leading-tight text-ink">
                  {product.title.he}
                </h2>
                <p className="mt-3 text-[1.25rem] text-ink">{product.priceLabel}</p>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {product.shortDescription.he}
                </p>
                <p className="mt-5 border-t border-rule pt-4 text-[0.875rem] text-ink-mute">
                  {product.availability.he}
                </p>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-7" dir="rtl">
            <form
              action={formAction}
              onSubmit={() => fireAnalyticsEvent("checkout_details_submitted", product)}
              className="border border-rule bg-paper-deep p-5 text-right md:p-8 lg:p-10"
            >
              <input type="hidden" name="slug" value={product.slug} />

              {state.status === "error" && !state.field && (
                <p className="mb-6 border border-red-700/30 bg-red-50 px-4 py-3 text-[0.9375rem] text-red-800">
                  {state.message}
                </p>
              )}

              {product.options && product.options.length > 0 && (
                <section className="border-b border-rule pb-8">
                  <h2 className="display-he text-[1.75rem] leading-tight text-ink">התאמות הפריט</h2>
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {product.options.map((option) => {
                      const fieldName = `option.${option.name}`;
                      const hasError = state.status === "error" && state.field === fieldName;

                      return (
                        <div key={option.name} className="flex flex-col gap-2 md:col-span-1">
                          <label htmlFor={fieldName} className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                            {option.label.he}
                            <RequiredMark />
                          </label>

                          {option.type === "select" ? (
                            <select
                              id={fieldName}
                              name={fieldName}
                              required
                              value={optionValues[option.name] ?? ""}
                              onChange={(event) =>
                                setOptionValues((current) => ({ ...current, [option.name]: event.target.value }))
                              }
                              className={`w-full appearance-none border bg-paper px-4 py-3 text-[1rem] text-ink focus:outline-none focus:ring-0 ${
                                hasError ? "border-red-700" : "border-rule focus:border-ink"
                              }`}
                            >
                              <option value="">בחרו {option.label.he}</option>
                              {option.options.map((value) => (
                                <option key={value.he} value={value.he}>
                                  {value.he}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={fieldName}
                              name={fieldName}
                              type="text"
                              required
                              maxLength={option.name === "nameText" ? 5 : undefined}
                              placeholder={option.placeholder?.he}
                              value={optionValues[option.name] ?? ""}
                              onChange={(event) =>
                                setOptionValues((current) => ({ ...current, [option.name]: event.target.value }))
                              }
                              className={`w-full border bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none focus:ring-0 ${
                                hasError ? "border-red-700" : "border-rule focus:border-ink"
                              }`}
                            />
                          )}

                          {option.type === "text" && option.note && (
                            <p className="text-[0.8125rem] leading-relaxed text-ink-mute">{option.note.he}</p>
                          )}
                          {hasError && <p className="text-[0.8125rem] text-red-700">{state.message}</p>}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="border-b border-rule py-8">
                <h2 className="display-he text-[1.75rem] leading-tight text-ink">פרטי המזמין</h2>
                <p className="mt-2 text-[0.8125rem] text-ink-mute">שדות המסומנים בכוכבית אדומה נדרשים להמשך לתשלום.</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <CheckoutInput
                    name="fullName"
                    label="שם מלא"
                    autoComplete="name"
                    error={state.status === "error" && state.field === "fullName" ? state.message : undefined}
                  />
                  <CheckoutInput
                    name="phone"
                    label="טלפון"
                    type="tel"
                    autoComplete="tel"
                    dir="ltr"
                    error={state.status === "error" && state.field === "phone" ? state.message : undefined}
                  />
                  <CheckoutInput
                    name="email"
                    label="אימייל"
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    error={state.status === "error" && state.field === "email" ? state.message : undefined}
                  />
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="text-[0.9375rem] font-medium text-ink">
                      הערות / בקשה מיוחדת
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-2 w-full resize-none border border-rule bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:border-ink focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </section>

              <section className="py-8">
                <h2 className="display-he text-[1.75rem] leading-tight text-ink">סיכום ההזמנה</h2>
                <div className="mt-6 divide-y divide-rule border-y border-rule">
                  <SummaryRow label="פריט" value={product.title.he} />
                  <SummaryRow label="קטגוריה" value={product.category.he} />
                  {selectedOptions.map((option) => (
                    <SummaryRow key={option.label} label={option.label} value={option.value} />
                  ))}
                  <div className="flex items-end justify-between gap-6 py-5">
                    <span className="text-[1rem] text-ink-soft">סה״כ לתשלום</span>
                    <span className="text-[1.75rem] leading-none text-ink">{product.priceLabel}</span>
                  </div>
                </div>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  לאחר התשלום ניצור איתכם קשר לאישור ההתאמות, המידה, הזמינות ומועד האספקה.
                </p>
              </section>

              <div className="border-t border-rule pt-7">
                <label className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    required
                    className="mt-1 h-4 w-4 border-rule accent-ink"
                  />
                  <span>
                    אני מאשר/ת את תנאי השימוש ומדיניות הפרטיות <RequiredMark />
                  </span>
                </label>
                {state.status === "error" && state.field === "termsAccepted" && (
                  <p className="mt-2 text-[0.8125rem] text-red-700">{state.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="brass-disc brass-disc--solid mt-6 flex w-full justify-center px-5 py-3 text-center text-[1rem] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "שומרים את פרטי ההזמנה..." : "מעבר לתשלום מאובטח"}
                </button>
                <p className="mt-4 text-center text-[0.875rem] leading-relaxed text-ink-mute">
                  התשלום מתבצע בעמוד מאובטח של SUMIT. פרטי האשראי אינם נשמרים באתר Maison MANA.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckoutInput({
  name,
  label,
  type = "text",
  autoComplete,
  dir = "rtl",
  error,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  dir?: "rtl" | "ltr";
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
        {label}
        <RequiredMark />
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        dir={dir}
        className={`mt-2 w-full border bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none focus:ring-0 ${
          error ? "border-red-700" : "border-rule focus:border-ink"
        }`}
      />
      {error && <p className="mt-1 text-[0.8125rem] text-red-700">{error}</p>}
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="text-[1rem] font-medium leading-none text-red-700" aria-label="שדה חובה">
      *
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 py-4 text-[0.9375rem]">
      <span className="text-ink-soft">{label}</span>
      <span className="max-w-[65%] text-left text-ink">{value}</span>
    </div>
  );
}

function getOptionDefaults(product: CheckoutProduct, searchParams: { get(name: string): string | null }) {
  const defaults: Record<string, string> = {};

  for (const option of product.options ?? []) {
    const rawValue = searchParams.get(option.name);
    if (!rawValue) continue;

    if (option.type === "select") {
      const normalizedValue = normalizeOptionValue(rawValue);
      const match = option.options.find((candidate) =>
        [candidate.he, candidate.en].some((allowed) => normalizeOptionValue(allowed) === normalizedValue)
      );
      if (match) defaults[option.name] = match.he;
    } else {
      defaults[option.name] = option.name === "nameText" ? rawValue.slice(0, 5) : rawValue;
    }
  }

  return defaults;
}

function normalizeOptionValue(value: string) {
  return value.trim().replace(/-/g, " ").replace(/\s+/g, " ");
}

function fireAnalyticsEvent(eventName: string, product: CheckoutProduct) {
  const win = window as typeof window & {
    gtag?: (event: "event", eventName: string, params: Record<string, unknown>) => void;
  };

  try {
    win.gtag?.("event", eventName, {
      product_slug: product.slug,
      product_id: product.id,
      price: product.price,
      category: product.category.he,
    });
  } catch {
    // Analytics must never block checkout.
  }
}
