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

  // `message` carries an i18n key (see lib/i18n.ts) translated on the client
  if (!name) return { status: "error", message: "err_name", field: "name" };
  if (!phone && !email)
    return {
      status: "error",
      message: "err_contact",
      field: "phone",
    };
  if (phone && !/^[0-9+\-\s()]{7,}$/.test(phone))
    return { status: "error", message: "err_phone", field: "phone" };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { status: "error", message: "err_email", field: "email" };

  const reference = `MM-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const payload = {
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
  };

  try {
    await fetch(
      "https://n8n.srv877545.hstgr.cloud/webhook/3d30f03a-5a30-4e3e-b175-a3e4fb4dd294",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    // Log but don't surface webhook errors to the user
    console.error("[Maison Mana · Webhook] failed to deliver", err);
  }

  return { status: "ok", reference };
}
