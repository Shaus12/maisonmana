"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";

// ── Copy (bilingual) ──────────────────────────────────────────
const COPY = {
  he: {
    idleLabel: "הדמיה ראשונית",
    idleBody: "בחרתם את הפרטים — נוכל ליצור עבורכם הדמיה ויזואלית ראשונית של התכשיט.",
    idleCta: "צרו הדמיה ראשונית",
    modalAria: "יצירת הדמיה ראשונית",
    close: "סגור",
    modalTitle: "יצירת הדמיה ראשונית",
    modalBody: "הזינו אימייל כדי שניצור עבורכם קונספט ויזואלי שיוצג מיד כאן באתר.",
    emailLabel: "כתובת אימייל",
    emailError: "נא להזין כתובת אימייל תקינה",
    modalSubmit: "יצירת הדמיה",
    summaryPrefix: "הסיכום:",
    loadingTitle: "מרכיבים עבורך קונספט ראשוני",
    loadingBody: "אנחנו מתרגמים את הבחירות שלך להדמיה ויזואלית של התכשיט.",
    resultTitle: "ההדמיה הראשונית מוכנה",
    resultAlt: "הדמיה ראשונית של תכשיט Maison Mana",
    resultDisclaimer: "ההדמיה מיועדת להמחשה ראשונית בלבד. בפגישה האישית נדייק יחד את הפרופורציות, האבן, השיבוץ והפרטים הסופיים.",
    download: "הורדת ההדמיה",
    sendToAtelier: "שליחת העיצוב לאטלייה",
    restart: "התחל מחדש",
    blockedTitle: "כבר יצרת הדמיה ראשונית מהדפדפן הזה.",
    blockedBody: "כדי לדייק את העיצוב או ליצור גרסה נוספת, השאירו פרטים ונחזור אליכם להמשך אישי.",
    blockedCta: "שלחו את העיצוב לאטלייה",
    abuseBody: "לא הצלחנו לאמת את הבקשה. נסו שוב בעוד רגע.",
    retry: "נסה שוב",
    errorLabel: "שגיאה",
    errorBody: "לא הצלחנו ליצור את ההדמיה כרגע. נסו שוב בעוד רגע.",
  },
  en: {
    idleLabel: "Initial Preview",
    idleBody: "You have chosen the details — we can now create an initial visual preview of the piece for you.",
    idleCta: "Create an Initial Preview",
    modalAria: "Create an initial preview",
    close: "Close",
    modalTitle: "Create an Initial Preview",
    modalBody: "Enter your email and we will create a visual concept, shown right here on the site.",
    emailLabel: "Email Address",
    emailError: "Please enter a valid email address",
    modalSubmit: "Create Preview",
    summaryPrefix: "Summary:",
    loadingTitle: "Composing your initial concept",
    loadingBody: "We are translating your choices into a visual preview of the piece.",
    resultTitle: "Your initial preview is ready",
    resultAlt: "Initial preview of a Maison Mana piece",
    resultDisclaimer: "The preview is for initial illustration only. In the personal meeting we will refine the proportions, stone, setting, and final details together.",
    download: "Download Preview",
    sendToAtelier: "Send the Design to the Atelier",
    restart: "Start Over",
    blockedTitle: "You have already created an initial preview from this browser.",
    blockedBody: "To refine the design or create another version, leave your details and we will get back to you personally.",
    blockedCta: "Send the Design to the Atelier",
    abuseBody: "We could not verify the request. Please try again in a moment.",
    retry: "Try Again",
    errorLabel: "Error",
    errorBody: "We could not create the preview right now. Please try again in a moment.",
  },
} as const;

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
  const { locale } = useLanguage();
  const c = COPY[locale];
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
      setEmailError(c.emailError);
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
      <div className="mt-10 pt-8 border-t border-rule flex flex-col items-start gap-4">
        <p className="section-label">{c.idleLabel}</p>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft max-w-md">
          {c.idleBody}
        </p>
        <button
          type="button"
          onClick={() => setStage("modal")}
          className="brass-disc brass-disc--solid mt-2"
        >
          {c.idleCta}
        </button>
      </div>
    );
  }

  // ── Email Modal ───────────────────────────────────────────
  if (stage === "modal") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-velvet/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) setStage("idle"); }}
        role="dialog"
        aria-modal="true"
        aria-label={c.modalAria}
      >
        <div className="relative w-full max-w-md bg-paper border border-rule shadow-2xl px-8 py-10">
          {/* Close */}
          <button
            type="button"
            aria-label={c.close}
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
              {c.modalTitle}
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
              {c.modalBody}
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
              <span className="section-label mb-3 block">{c.emailLabel}</span>
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
                {c.modalSubmit}
              </button>
              <p className="text-center text-[0.75rem] text-ink-mute leading-relaxed">
                {c.summaryPrefix} <span className="text-ink-soft" dir="ltr">{designSummary}</span>
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
      <div className="mt-10 pt-8 border-t border-rule">
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
              {c.loadingTitle}
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-ink-soft max-w-sm mx-auto">
              {c.loadingBody}
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
      <div className="mt-10 pt-8 border-t border-rule">
        <div className="flex flex-col gap-6">
          <div>
            <p className="section-label mb-3" dir="ltr">Maison Mana · Initial Render</p>
            <h2 className="display-he text-[1.75rem] text-ink mb-2">{c.resultTitle}</h2>
            <p className="text-[0.875rem] text-ink-mute">{designSummary}</p>
          </div>

          {/* Generated image */}
          <div className="relative w-full aspect-square max-w-md bg-velvet overflow-hidden border border-ink/10">
            <Image
              src={`/api/atelier/proxy-image?url=${encodeURIComponent(imageUrl)}`}
              alt={c.resultAlt}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Disclaimer */}
          <p className="text-[0.8125rem] leading-relaxed text-ink-mute max-w-md border-s border-brass/40 ps-4 italic">
            {c.resultDisclaimer}
          </p>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={handleDownload}
              className="brass-disc brass-disc--solid"
            >
              {c.download}
            </button>
            <a href="#atelier-lead" className="hairline-link text-[0.9375rem]">
              {c.sendToAtelier}
            </a>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => { setStage("idle"); setImageUrl(null); }}
            className="text-[0.8125rem] text-ink-mute hover:text-ink transition-colors self-start"
          >
            {c.restart}
          </button>
        </div>
      </div>
    );
  }

  // ── Rate-limited (blocked) ────────────────────────────────
  if (stage === "blocked") {
    return (
      <div className="mt-10 pt-8 border-t border-rule">
        <div className="vellum px-8 py-10">
          <p className="section-label mb-4" dir="ltr">Atelier</p>
          <h2 className="display-he text-[1.5rem] text-ink mb-4">
            {c.blockedTitle}
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6 max-w-sm">
            {c.blockedBody}
          </p>
          <a href="#atelier-lead" className="brass-disc brass-disc--solid inline-flex">
            {c.blockedCta}
          </a>
        </div>
      </div>
    );
  }

  // ── Abuse-blocked (honeypot / timing) ────────────────────
  if (stage === "abuse-blocked") {
    return (
      <div className="mt-10 pt-8 border-t border-rule">
        <div className="vellum px-8 py-10">
          <p className="section-label mb-4 text-ink-mute" dir="ltr">Atelier</p>
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6">
            {c.abuseBody}
          </p>
          <button
            type="button"
            onClick={() => setStage("modal")}
            className="brass-disc"
          >
            {c.retry}
          </button>
        </div>
      </div>
    );
  }

  // ── Generic error ─────────────────────────────────────────
  return (
    <div className="mt-10 pt-8 border-t border-rule">
      <div className="vellum px-8 py-10">
        <p className="section-label mb-4 text-ink-mute">{c.errorLabel}</p>
        <p className="text-[0.9375rem] leading-relaxed text-ink-soft mb-6">
          {c.errorBody}
        </p>
        <button
          type="button"
          onClick={() => setStage("idle")}
          className="brass-disc"
        >
          {c.retry}
        </button>
      </div>
    </div>
  );
}
