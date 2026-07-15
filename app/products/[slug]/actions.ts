"use server";

import { sendInquiryWebhook } from "@/lib/inquiry-webhook";

export type ProductInquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: string }
  | { status: "ok"; reference: string };

export async function submitProductInquiry(
  _prev: ProductInquiryState,
  formData: FormData
): Promise<ProductInquiryState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const originPage = String(formData.get("originPage") ?? "").trim();
  const productJson = String(formData.get("product") ?? "{}").trim();
  const selectedOptionsJson = String(formData.get("selectedOptions") ?? "{}").trim();

  // `message` carries an i18n key (see lib/i18n.ts) translated on the client
  if (!fullName || fullName.length < 2) {
    return { status: "error", message: "err_full_name", field: "fullName" };
  }
  if (!phone && !email) {
    return {
      status: "error",
      message: "err_contact",
      field: "phone",
    };
  }
  if (phone && !/^[0-9+\-\s()]{7,}$/.test(phone)) {
    return { status: "error", message: "err_phone", field: "phone" };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "err_email", field: "email" };
  }

  let product = {};
  try {
    product = JSON.parse(productJson);
  } catch (e) {
    // fallback empty
  }

  let selectedOptions = {};
  try {
    selectedOptions = JSON.parse(selectedOptionsJson);
  } catch (e) {
    // fallback empty
  }

  const reference = `MM-PRD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const payload = {
    source: "product_detail_inquiry",
    originPage,
    leadType: "product_inquiry",
    fullName,
    phone,
    email: email || undefined,
    message: message || undefined,
    product,
    selectedOptions,
    createdAt: new Date().toISOString(),
  };

  try {
    await sendInquiryWebhook(payload);
  } catch (err) {
    console.error("[Maison Mana · Product Webhook] failed to deliver", err);
  }

  return { status: "ok", reference };
}
