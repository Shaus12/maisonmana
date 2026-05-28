"use server";

export type InquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: string }
  | { status: "ok"; reference: string };

export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData
): Promise<InquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const preferred = String(formData.get("preferred") ?? "").trim();
  const intent = String(formData.get("intent") ?? "viewing").trim();
  const piece = String(formData.get("piece") ?? "").trim();
  const bespoke = String(formData.get("bespoke") ?? "").trim();

  if (!name) return { status: "error", message: "נא להזין שם.", field: "name" };
  if (!phone && !email)
    return {
      status: "error",
      message: "נא להשאיר טלפון או דוא״ל ליצירת קשר.",
      field: "phone",
    };
  if (phone && !/^[0-9+\-\s()]{7,}$/.test(phone))
    return { status: "error", message: "מספר הטלפון אינו תקין.", field: "phone" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { status: "error", message: "כתובת הדוא״ל אינה תקינה.", field: "email" };

  // Brief artificial latency to communicate considered handling
  await new Promise((r) => setTimeout(r, 700));

  // v1: log to server console; in production this connects to the salon CRM / WhatsApp.
  const reference = `MM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  console.log("[Maison Mana · Inquiry]", {
    reference,
    receivedAt: new Date().toISOString(),
    intent,
    name,
    phone,
    email,
    preferred,
    piece: piece || null,
    bespoke: bespoke || null,
    message,
  });

  return { status: "ok", reference };
}
