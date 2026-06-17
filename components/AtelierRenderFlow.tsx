"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// ── sessionId helpers ─────────────────────────────────────────
function getOrCreateSessionId(): string {
  const key = "maison_atelier_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `session_${crypto.randomUUID()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ── Types ─────────────────────────────────────────────────────
type Stage =
  | "idle"          // main button visible
  | "modal"         // email input modal
  | "loading"       // calling API
  | "result"        // image returned
  | "blocked"       // rate limited
  | "abuse-blocked" // honeypot / timing / abuse
  | "error";        // generic error

interface AtelierRenderFlowProps {
  designSelections: Record<string, unknown>;
  designSummary: string;
  onResult?: (result: { imageUrl?: string; imageBase64?: string; mimeType: string }) => void;
}

// ── Component ─────────────────────────────────────────────────
export function AtelierRenderFlow({
  designSelections,
  designSummary,
  onResult,
}: AtelierRenderFlowProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Track when the modal opened for min-time check
  const formStartedAtRef = useRef<number | null>(null);

  // Focus email input when modal opens + record open time
  useEffect(() => {
    if (stage === "modal") {
      formStartedAtRef.current = Date.now();
      setTimeout(() => emailRef.current?.focus(), 60);
    }
  }, [stage]);

  // Close modal on Escape
  useEffect(() => {
    if (stage !== "modal") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStage("idle");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("נא להזין כתובת אימייל תקינה");
      return;
    }
    setEmailError("");
    setStage("loading");

    const sessionId = getOrCreateSessionId();

    // Gather honeypot value from form (hidden field)
    const form = (e.target as HTMLFormElement);
    const website = (form.elements.namedItem("website") as HTMLInputElement)?.value ?? "";
    const formStartedAt = formStartedAtRef.current ?? Date.now();

    try {
      const res = await fetch("/api/atelier/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sessionId,
          designSelections,
          designSummary,
          website,       // honeypot
          formStartedAt, // anti-bot timing
        }),
      });

      const data = await res.json();

      if (res.status === 429 || (data.blocked && data.reason === "rate_limited")) {
        setStage("blocked");
        return;
      }

      if (data.blocked && data.reason === "abuse_protection") {
        setStage("abuse-blocked");
        return;
      }

      if (!res.ok || !data.success || (!data.imageUrl && !data.imageBase64)) {
        setStage("error");
        return;
      }

      setImageUrl(data.imageUrl); // Fallback for old internal logic if any
      if (onResult) {
        onResult({
          imageUrl: data.imageUrl,
          imageBase64: data.imageBase64,
          mimeType: data.mimeType || "image/png",
        });
      } else {
        setStage("result");
      }
    } catch {
      setStage("error");
    }
  }

  async function handleDownload() {
    if (!imageUrl) return;
    try {
      // Fetch via proxy to avoid client-side CORS errors
      const proxyUrl = `/api/atelier/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "maison-mana-render.jpg";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // CORS fallback — open in new tab
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  }

  // ── Idle — main trigger button ────────────────────────────
  if (stage === "idle") {
    return (
      <div className="mt-10 pt-8 border-t border-rule flex flex-col items-start gap-4" dir="rtl">
        <p className="section-label">הדמיה ראשונית</p>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft max-w-md">
          בחרתם את הפרטים — נוכל ליצור עבורכם הדמיה ויזואלית ראשונית של התכשיט.
        </p>
        <button
          type="button"
          onClick={() => setStage("modal")}
          className="brass-disc brass-disc--solid mt-2"
        >
          צרו הדמיה ראשונית
        </button>
      </div>
    );
  }

  // ── Email Modal ───────────────────────────────────────────
  if (stage === "modal") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-velvet/60 backdrop-blur-sm"
        dir="rtl"
        onClick={(e) => { if (e.target === e.currentTarget) setStage("idle"); }}
        role="dialog"
        aria-modal="true"
        aria-label="יצירת הדמיה ראשונית"
      >
        <div className="relative w-full max-w-md bg-paper border border-rule shadow-2xl px-8 py-10">
          {/* Close */}
          <button
            type="button"
            aria-label="סגור"
            onClick={() => setStage("idle")}
            className="absolute start-5 top-5 text-ink-mute hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-8">
            <p className="section-label mb-4" dir="ltr">Maison Mana · Atelier</p>
            <h2 className="display-he text-[1.75rem] leading-tight text-ink mb-3">
              יצירת הדמיה ראשונית
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
              הזינו אימייל כדי שניצור עבורכם קונספט ויזואלי שיוצג מיד כאן באתר.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/*
             * Honeypot field — hidden from real users via CSS.
             * Bots fill all fields; we block if this has any value.
             * Never use display:none or visibility:hidden (some bots skip those).
             * Position off-screen instead.
             */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-9999px",
                top: "-9999px",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              <label htmlFor="website_hp">Website</label>
              <input
                id="website_hp"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Email field — the only field users see */}
            <label className="block mb-6">
              <span className="section-label mb-3 block">כתובת אימייל</span>
              <input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="your@email.com"
                dir="ltr"
                autoComplete="email"
                className={`block w-full border-0 border-b bg-transparent py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none ${
                  emailError ? "border-ink-soft" : "border-rule focus:border-brass"
                }`}
              />
              {emailError && (
                <p className="mt-2 text-[0.8125rem] italic text-ink-soft">{emailError}</p>
              )}
            </label>

            <div className="mt-2 flex flex-col gap-3">
              <button type="submit" className="brass-disc brass-disc--solid w-full justify-center">
                יצירת הדמיה
              </button>
              <p className="text-center text-[0.75rem] text-ink-mute leading-relaxed">
                הסיכום: <span className="text-ink-soft" dir="ltr">{designSummary}</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────
  if (stage === "loading") {
    return (
      <div className="mt-10 pt-8 border-t border-rule" dir="rtl">
        <div className="vellum px-8 py-12 flex flex-col items-center text-center gap-6">
          {/* Brass spinner */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border border-brass/20" />
            <div
              className="absolute inset-0 rounded-full border border-t-brass animate-spin"
              style={{ animationDuration: "1.4s" }}
            />
          </div>
          <div>
            <h2 className="display-he text-[1.5rem] text-ink mb-3">
              מרכיבים עבורך קונספט ראשוני
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-ink-soft max-w-sm mx-auto">
              אנחנו מתרגמים את הבחירות שלך להדמיה ויזואלית של התכשיט.
            </p>
          </div>
          <p className="text-[0.75rem] text-ink-mute tracking-widest uppercase" dir="ltr">
            Maison Mana · Atelier
          </p>
        </div>
      </div>
    );
  }

  // ── Result ────────────────────────────────────────────────
  if (stage === "result" && imageUrl) {
    return (
      <div className="mt-10 pt-8 border-t border-rule" dir="rtl">
        <div className="flex flex-col gap-6">
          <div>
            <p className="section-label mb-3" dir="ltr">Maison Mana · Initial Render</p>
            <h2 className="display-he text-[1.75rem] text-ink mb-2">ההדמיה הראשונית מוכנה</h2>
            <p className="text-[0.875rem] text-ink-mute">{designSummary}</p>
          </div>

          {/* Generated image */}
          <div className="relative w-full aspect-square max-w-md bg-velvet overflow-hidden border border-ink/10">
            <Image
              src={`/api/atelier/proxy-image?url=${encodeURIComponent(imageUrl)}`}
              alt="הדמיה ראשונית של תכשיט Maison Mana"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Disclaimer */}
          <p className="text-[0.8125rem] leading-relaxed text-ink-mute max-w-md border-s border-brass/40 ps-4 italic">
            ההדמיה מיועדת להמחשה ראשונית בלבד. בפגישה האישית נדייק יחד את הפרופורציות, האבן, השיבוץ והפרטים הסופיים.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={handleDownload}
              className="brass-disc brass-disc--solid"
            >
              הורדת ההדמיה
            </button>
            <a href="#atelier-lead" className="hairline-link text-[0.9375rem]">
              שליחת העיצוב לאטלייה
            </a>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => { setStage("idle"); setImageUrl(null); }}
            className="text-[0.8125rem] text-ink-mute hover:text-ink transition-colors self-start"
          >
            התחל מחדש
          </button>
        </div>
      </div>
    );
  }

  // ── Rate-limited (blocked) ────────────────────────────────
  if (stage === "blocked") {
    return (
      <div className="mt-10 pt-8 border-t border-rule" dir="rtl">
        <div className="vellum px-8 py-10">
          <p className="section-label mb-4" dir="ltr">Atelier</p>
          <h2 className="display-he text-[1.5rem] text-ink mb-4">
            כבר יצרת הדמיה ראשונית מהדפדפן הזה.
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6 max-w-sm">
            כדי לדייק את העיצוב או ליצור גרסה נוספת, השאירו פרטים ונחזור אליכם להמשך אישי.
          </p>
          <a href="#atelier-lead" className="brass-disc brass-disc--solid inline-flex">
            שלחו את העיצוב לאטלייה
          </a>
        </div>
      </div>
    );
  }

  // ── Abuse-blocked (honeypot / timing) ────────────────────
  if (stage === "abuse-blocked") {
    return (
      <div className="mt-10 pt-8 border-t border-rule" dir="rtl">
        <div className="vellum px-8 py-10">
          <p className="section-label mb-4 text-ink-mute" dir="ltr">Atelier</p>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6">
            לא הצלחנו לאמת את הבקשה. נסו שוב בעוד רגע.
          </p>
          <button
            type="button"
            onClick={() => setStage("modal")}
            className="brass-disc"
          >
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  // ── Generic error ─────────────────────────────────────────
  return (
    <div className="mt-10 pt-8 border-t border-rule" dir="rtl">
      <div className="vellum px-8 py-10">
        <p className="section-label mb-4 text-ink-mute" dir="ltr">שגיאה</p>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6">
          לא הצלחנו ליצור את ההדמיה כרגע. נסו שוב בעוד רגע.
        </p>
        <button
          type="button"
          onClick={() => setStage("idle")}
          className="brass-disc"
        >
          נסה שוב
        </button>
      </div>
    </div>
  );
}
