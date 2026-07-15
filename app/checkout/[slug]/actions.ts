"use server";

import { redirect } from "next/navigation";
import { products, type Product, type ProductOption } from "@/lib/products";
import { sendInquiryWebhook } from "@/lib/inquiry-webhook";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: string };

export async function submitCheckoutDetails(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const slug = String(formData.get("slug") ?? "").trim();
  const product = Object.values(products).find((candidate) => candidate.slug === slug);

  if (!product) {
    return { status: "error", message: "לא מצאנו את הפריט המבוקש. חזרו לעמוד הפריט ונסו שוב." };
  }

  if (product.isPurchasable === false || !product.paymentUrl) {
    return {
      status: "error",
      message: "פריט זה זמין כעת להזמנה אישית דרך נציג Maison MANA.",
    };
  }

  if (!/^https?:\/\//.test(product.paymentUrl)) {
    return {
      status: "error",
      message: "קישור התשלום לפריט זה עדיין לא הוגדר. צרו איתנו קשר ונשלים את ההזמנה באופן אישי.",
    };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const termsAccepted = formData.get("termsAccepted") === "on";

  if (!fullName || fullName.length < 2) {
    return { status: "error", message: "יש למלא שם מלא.", field: "fullName" };
  }
  if (!phone) {
    return { status: "error", message: "יש למלא מספר טלפון.", field: "phone" };
  }
  if (!/^[0-9+\-\s()]{7,}$/.test(phone)) {
    return { status: "error", message: "מספר הטלפון אינו תקין.", field: "phone" };
  }
  if (!email) {
    return { status: "error", message: "יש למלא כתובת אימייל.", field: "email" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "כתובת האימייל אינה תקינה.", field: "email" };
  }
  if (!termsAccepted) {
    return { status: "error", message: "יש לאשר את תנאי השימוש ומדיניות הפרטיות.", field: "termsAccepted" };
  }

  const optionsResult = validateSelectedOptions(product, formData);
  if (!optionsResult.ok) {
    return { status: "error", message: optionsResult.message, field: optionsResult.field };
  }

  const orderReference = generateOrderReference();
  const payload = {
    source: "product_checkout",
    leadType: "purchase",
    intent: "buy",
    originPage: `/checkout/${product.slug}`,
    orderReference,
    fullName,
    phone,
    email,
    message: message || undefined,
    product: {
      id: product.id,
      slug: product.slug,
      title: product.title.he,
      category: product.category.he,
      price: product.price,
      priceLabel: product.priceLabel,
    },
    selectedOptions: optionsResult.selectedOptions,
    payment: {
      provider: "SUMIT",
      status: "redirecting_to_payment",
      paymentUrlConfigured: true,
    },
    createdAt: new Date().toISOString(),
  };

  try {
    await sendInquiryWebhook(payload, 9000);
  } catch (error) {
    console.error("[Maison Mana · Checkout Webhook] failed to deliver", error);
    return {
      status: "error",
      message: "לא הצלחנו לשמור את פרטי ההזמנה. נסו שוב או צרו איתנו קשר.",
    };
  }

  redirect(product.paymentUrl);
}

type OptionsResult =
  | { ok: true; selectedOptions: Record<string, string> }
  | { ok: false; message: string; field: string };

function validateSelectedOptions(product: Product, formData: FormData): OptionsResult {
  const selectedOptions: Record<string, string> = {};

  for (const option of product.options ?? []) {
    const field = `option.${option.name}`;
    const value = String(formData.get(field) ?? "").trim();

    if (option.type === "select") {
      const validValue = findValidSelectValue(option, value);
      if (!validValue) {
        return { ok: false, message: `יש לבחור ${option.label.he}.`, field };
      }
      selectedOptions[option.name] = validValue;
      continue;
    }

    if (!value) {
      return { ok: false, message: `יש למלא ${option.label.he}.`, field };
    }

    if (option.name === "nameText" && value.length > 5) {
      return { ok: false, message: "שם לתליון יכול לכלול עד 5 אותיות.", field };
    }

    selectedOptions[option.name] = value;
  }

  return { ok: true, selectedOptions };
}

function findValidSelectValue(option: Extract<ProductOption, { type: "select" }>, value: string) {
  const normalizedValue = normalizeOptionValue(value);

  return option.options.find((candidate) => {
    return [candidate.he, candidate.en].some((allowed) => normalizeOptionValue(allowed) === normalizedValue);
  })?.he;
}

function normalizeOptionValue(value: string) {
  return value.trim().replace(/-/g, " ").replace(/\s+/g, " ");
}

function generateOrderReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `MANA-${date}-${random}`;
}
