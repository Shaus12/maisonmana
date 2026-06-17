/**
 * MVP in-memory rate limiter for the Atelier AI render endpoint.
 *
 * This is MVP-only. In production this should be replaced with
 * Redis / Vercel KV for persistent, cross-instance rate limiting.
 * Provider-level Safe-Spend Limits are configured on the image API key
 * as the final cost backstop.
 *
 * Limits (per 24-hour rolling window):
 *   - 1 successful render per sessionId
 *   - 3 successful renders per IP hash
 *   - 2 successful renders per normalized email
 *
 * Only successful renders consume a slot. If the render webhook fails,
 * the slot is NOT consumed.
 */

const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// Map<key, list of success timestamps within the window>
const store = new Map<string, number[]>();

function getRecent(key: string): number[] {
  const now = Date.now();
  const entries = (store.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS);
  store.set(key, entries);
  return entries;
}

function markUsed(key: string): void {
  const entries = getRecent(key);
  entries.push(Date.now());
  store.set(key, entries);
}

type LimitConfig = { key: string; max: number; label: string };

function checkKey({ key, max, label }: LimitConfig): { allowed: boolean; reason?: string } {
  if (getRecent(key).length >= max) {
    return { allowed: false, reason: `${label}_rate_limited` };
  }
  return { allowed: true };
}

// ── Public API ────────────────────────────────────────────────

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function checkRateLimit(
  sessionId: string,
  ipHash: string,
  email: string
): { allowed: boolean; reason?: string } {
  const normalizedEmail = normalizeEmail(email);

  const checks: LimitConfig[] = [
    { key: `atelier:session:${sessionId}`, max: 1, label: "session" },
    { key: `atelier:ip:${ipHash}`,         max: 3, label: "ip" },
    { key: `atelier:email:${normalizedEmail}`, max: 2, label: "email" },
  ];

  for (const cfg of checks) {
    const result = checkKey(cfg);
    if (!result.allowed) return result;
  }
  return { allowed: true };
}

export function consumeRateLimit(
  sessionId: string,
  ipHash: string,
  email: string
): void {
  const normalizedEmail = normalizeEmail(email);
  markUsed(`atelier:session:${sessionId}`);
  markUsed(`atelier:ip:${ipHash}`);
  markUsed(`atelier:email:${normalizedEmail}`);
}
