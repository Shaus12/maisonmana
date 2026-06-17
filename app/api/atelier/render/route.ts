import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, consumeRateLimit } from "@/lib/atelier/rateLimit";
import { buildImagePrompt } from "@/lib/atelier/renderPrompt";
import crypto from "crypto";

// ── Helpers ───────────────────────────────────────────────────

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function normalizeRenderData(data: unknown): { imageUrl?: string; imageBase64?: string; mimeType: string } | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  const dataObj = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : {};

  const imageUrl =
    obj.imageUrl ??
    obj.image_url ??
    obj.url ??
    obj.photo ??
    dataObj.imageUrl ??
    dataObj.image_url ??
    dataObj.photo;

  const imageBase64 =
    obj.imageBase64 ??
    obj.image_base64 ??
    obj.base64 ??
    dataObj.imageBase64 ??
    dataObj.image_base64;

  const mimeType =
    obj.mimeType ??
    obj.mime_type ??
    dataObj.mimeType ??
    dataObj.mime_type ??
    "image/png";

  const result: any = { mimeType: typeof mimeType === "string" ? mimeType : "image/png" };
  if (typeof imageUrl === "string") result.imageUrl = imageUrl;
  if (typeof imageBase64 === "string") result.imageBase64 = imageBase64;

  if (!result.imageUrl && !result.imageBase64) return null;
  return result;
}

const INQUIRY_WEBHOOK =
  "https://n8n.srv877545.hstgr.cloud/webhook/3d30f03a-5a30-4e3e-b175-a3e4fb4dd294";

// ── POST /api/atelier/render ──────────────────────────────────
//
// Validation order (every check that fails BEFORE calling the
// expensive render webhook is intentional to protect cost):
//
//   1. Parse + required field validation
//   2. Email format
//   3. Design selections presence
//   4. Honeypot
//   5. Minimum submit time (≥ 4 000 ms)
//   6. IP detection + hash
//   7. Rate limit (session / IP / email)
//   8. [Only now] lead webhook → prompt build → render webhook

export async function POST(req: NextRequest) {
  // ── 1. Parse body ─────────────────────────────────────────
  let body: {
    email?: string;
    sessionId?: string;
    designSelections?: unknown;
    designSummary?: string;
    website?: string;          // honeypot field
    formStartedAt?: number;    // anti-bot timing
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const {
    email,
    sessionId,
    designSelections,
    designSummary,
    website,
    formStartedAt,
  } = body;

  // ── 2. Validate required fields ───────────────────────────
  if (!email || typeof email !== "string") {
    return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== "string" || sessionId.length < 8) {
    return NextResponse.json({ success: false, error: "Invalid sessionId" }, { status: 400 });
  }
  if (!designSelections || typeof designSelections !== "object") {
    return NextResponse.json({ success: false, error: "Missing design selections" }, { status: 400 });
  }
  if (!designSummary || typeof designSummary !== "string" || designSummary.trim().length < 3) {
    return NextResponse.json({ success: false, error: "Missing design summary" }, { status: 400 });
  }
  if (typeof formStartedAt !== "number") {
    return NextResponse.json({ success: false, error: "Missing form timing" }, { status: 400 });
  }

  // ── 3. Validate email format ──────────────────────────────
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
  }

  // ── 4. Validate design selections are non-empty ───────────
  const sel = designSelections as Record<string, unknown>;
  const hasSelections = Object.keys(sel).length > 0 &&
    Object.values(sel).some((v) => v !== undefined && v !== null && v !== "");
  if (!hasSelections) {
    return NextResponse.json({ success: false, error: "No design selections found" }, { status: 400 });
  }

  // ── 5. Honeypot check ─────────────────────────────────────
  // If the hidden `website` field has any value, this is a bot.
  // Return a generic block — do NOT call the render webhook.
  if (website && website.trim().length > 0) {
    console.warn("[Maison Mana · Atelier] Honeypot triggered — blocking request");
    return NextResponse.json(
      { success: false, blocked: true, reason: "abuse_protection" },
      { status: 400 }
    );
  }

  // ── 6. Minimum submit time check ─────────────────────────
  // Real humans take at least 4 seconds to open a modal, read it, and submit.
  const elapsedMs = Date.now() - formStartedAt;
  if (elapsedMs < 4000) {
    console.warn("[Maison Mana · Atelier] Form submitted too quickly (%d ms) — blocking", elapsedMs);
    return NextResponse.json(
      { success: false, blocked: true, reason: "abuse_protection" },
      { status: 400 }
    );
  }

  // ── 7. IP detection + rate limit ─────────────────────────
  const ip = getIp(req);
  const ipHash = hashIp(ip);
  const limit = checkRateLimit(sessionId, ipHash, email);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, blocked: true, reason: "rate_limited" },
      { status: 429 }
    );
  }

  // ── 8a. Send lead to inquiry webhook (non-blocking) ───────
  const leadPayload = {
    source:           "atelier_ai_render_email",
    topic:            "Atelier AI Render",
    originPage:       "/atelier",
    leadType:         "atelier_ai_render",
    email,
    message:          "User requested an initial AI jewelry render from the Atelier.",
    designSelections: sel,
    designSummary:    designSummary.trim(),
    createdAt:        new Date().toISOString(),
    // Legacy fields expected by the inquiry webhook schema
    reference:        `MM-ATL-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    receivedAt:       new Date().toISOString(),
    intent:           "atelier_ai_render",
    name:             email,
    phone:            "",
    preferred:        "",
    piece:            null,
    bespoke:          designSummary.trim(),
  };

  try {
    await fetch(INQUIRY_WEBHOOK, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(leadPayload),
    });
  } catch (err) {
    // Lead saving failure must NOT block the render
    console.error("[Maison Mana · Atelier] Lead webhook failed:", err);
  }

  // ── 8b. Build image prompt ────────────────────────────────
  const imagePrompt = buildImagePrompt(
    sel as Parameters<typeof buildImagePrompt>[0],
    designSummary.trim()
  );

  // ── 8c. Call AI render webhook ────────────────────────────
  // URL is server-side only — never exposed to the browser.
  const renderWebhookUrl = process.env.ATELIER_RENDER_WEBHOOK_URL;
  if (!renderWebhookUrl) {
    console.error("[Maison Mana · Atelier] ATELIER_RENDER_WEBHOOK_URL is not set");
    return NextResponse.json(
      { success: false, error: "Render service is not configured" },
      { status: 500 }
    );
  }

  const renderPayload = {
    email,
    source:           "maison_mana_atelier_ai_render",
    sessionId,
    ipHash,
    designSelections: sel,
    designSummary:    designSummary.trim(),
    imagePrompt,       // ← key addition
    language:         "he",
  };

  let imageUrl: string | null = null;
  try {
    const renderRes = await fetch(renderWebhookUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(renderPayload),
    });

    if (!renderRes.ok) {
      const text = await renderRes.text().catch(() => "");
      console.error("[Maison Mana · Atelier] Render webhook returned", renderRes.status, text);
      return NextResponse.json(
        { success: false, error: "Render service returned an error" },
        { status: 502 }
      );
    }

    const renderData = await renderRes.json();
    const renderDataPayload = normalizeRenderData(renderData);

    if (!renderDataPayload) {
      console.error("[Maison Mana · Atelier] No valid image data in response:", renderData);
      return NextResponse.json(
        { success: false, error: "Render service did not return an image" },
        { status: 502 }
      );
    }

    // ── 9. Consume rate limit ONLY after success ──────────────
    // If the render webhook failed we already returned early above,
    // so the slot is never wasted on a failed attempt.
    consumeRateLimit(sessionId, ipHash, email);

    return NextResponse.json({
      success: true,
      imageUrl: renderDataPayload.imageUrl,
      imageBase64: renderDataPayload.imageBase64,
      mimeType: renderDataPayload.mimeType,
    });
  } catch (error) {
    console.error("[Maison Mana · Atelier] Render webhook call failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not connect to the render service" },
      { status: 502 }
    );
  }
}
