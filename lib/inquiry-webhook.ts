import "server-only";

const INQUIRY_WEBHOOK_URL =
  "https://n8n.srv877545.hstgr.cloud/webhook/3d30f03a-5a30-4e3e-b175-a3e4fb4dd294";

export async function sendInquiryWebhook(payload: unknown, timeoutMs = 8000): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(INQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
}
