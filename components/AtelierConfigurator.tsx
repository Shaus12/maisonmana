"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Ring3D } from "./Ring3D";
import {
  SETTING_OPTIONS,
  SHAPE_OPTIONS,
  METAL_OPTIONS,
  BAND_OPTIONS,
  CARAT_OPTIONS,
  COLOR_OPTIONS,
  CLARITY_OPTIONS,
  ORIGIN_OPTIONS,
  estimatePriceILS,
  type SettingOption,
  type ShapeOption,
  type MetalOption,
  type BandOption,
} from "@/lib/atelier-options";
import { formatPriceILS } from "@/lib/format";

// ── Diamond shape SVG silhouettes ────────────────────────────
function ShapeIcon({ shape }: { shape: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-7 w-7 mx-auto"
      aria-hidden
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      {shape === "round" && <circle cx="20" cy="20" r="13" />}
      {shape === "pear" && (
        <path d="M20 7C26 7 32 12.5 32 19.5C32 27.5 20 35 20 35C20 35 8 27.5 8 19.5C8 12.5 14 7 20 7Z" />
      )}
      {shape === "marquise" && (
        <path d="M20 5C28 11.5 35 15.5 35 20C35 24.5 28 28.5 20 35C12 28.5 5 24.5 5 20C5 15.5 12 11.5 20 5Z" />
      )}
      {shape === "princess" && <rect x="9" y="9" width="22" height="22" />}
      {shape === "heart" && (
        <path d="M20 34C18 31 7 24.5 7 15.5C7 10.5 11 7 15.5 7C17.5 7 19 8.5 20 10.5C21 8.5 22.5 7 24.5 7C29 7 33 10.5 33 15.5C33 24.5 22 31 20 34Z" />
      )}
      {shape === "emerald" && (
        <path d="M13 8L27 8L34 14L34 26L27 32L13 32L6 26L6 14Z" />
      )}
    </svg>
  );
}

// ── Section header ────────────────────────────────────────────
function SectionHead({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 border-t border-rule pt-7 mb-5 md:pt-10 md:mb-6">
      <span
        className="display-he text-[1.375rem] leading-none"
        style={{ color: "oklch(0.74 0.110 78)" }}
      >
        {["א", "ב", "ג", "ד", "ה"][step - 1]}
      </span>
      <p className="section-label tracking-[0.14em]">{children}</p>
    </div>
  );
}

// ── Pill button ───────────────────────────────────────────────
function Pill({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`border px-4 py-2.5 text-[0.875rem] transition-all duration-[280ms] ${
        selected
          ? "border-ink bg-paper-deep text-ink"
          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────

const POPULAR_BAND_IDS = [
  "classic", "knife-edge", "twisted", "pave-band",
  "split-shank", "bypass", "milgrain", "chevron",
] as const;

export function AtelierConfigurator() {
  const [setting, setSetting]   = useState<SettingOption>(SETTING_OPTIONS[0]);
  const [shape,   setShape]     = useState<ShapeOption>(SHAPE_OPTIONS[0]);
  const [origin,  setOrigin]    = useState<"natural" | "lab-grown">("lab-grown");
  const [carat,   setCarat]     = useState(2.0);
  const [color,   setColor]     = useState<typeof COLOR_OPTIONS[number]["value"]>("E");
  const [clarity, setClarity]   = useState<typeof CLARITY_OPTIONS[number]["value"]>("VS1");
  const [metal,   setMetal]     = useState<MetalOption>(METAL_OPTIONS[3]);
  const [band,    setBand]      = useState<BandOption>(BAND_OPTIONS[0]);
  const [showAllBands, setShowAllBands] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const estimate = useMemo(
    () => estimatePriceILS({ origin, carat, color, clarity, metal: metal.id, setting: setting.id, band: band.id }),
    [origin, carat, color, clarity, metal.id, setting.id, band.id]
  );

  const summaryShort  = `${shape.he} · ${carat.toFixed(2)} ct · ${metal.he}`;
  const summaryFull   = `${setting.he} · ${shape.he} (${origin === "natural" ? "טבעי" : "מעבדה"}) · ${carat.toFixed(2)} ct · ${color}/${clarity} · ${metal.he} · להקה ${band.he}`;
  const stageKey      = `${setting.id}-${shape.id}-${metal.id}-${band.id}-${carat}`;
  const displayedBands = showAllBands
    ? BAND_OPTIONS
    : BAND_OPTIONS.filter((b) => POPULAR_BAND_IDS.includes(b.id as typeof POPULAR_BAND_IDS[number]));

  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1440px]">
        <div className="md:grid md:grid-cols-11">

          {/* ── LEFT: Sticky 3D Preview ──────────────────────── */}
          <div className="md:col-span-5 md:sticky md:top-[5.5rem] md:self-start md:[height:calc(100dvh-5.5rem)]">
            <div className="flex flex-col border-b md:border-b-0 md:border-e border-rule h-full">

              {/* Skeleton toggle */}
              <div className="flex justify-center border-b border-rule px-6 py-3">
                <div className="flex rounded-full border border-rule p-0.5 text-[0.8125rem]">
                  <button
                    type="button"
                    onClick={() => setShowSkeleton(false)}
                    className={`rounded-full px-5 py-1.5 transition-all duration-300 ${
                      !showSkeleton ? "bg-ink text-paper" : "text-ink-mute hover:text-ink-soft"
                    }`}
                  >
                    טבעת משובצת
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkeleton(true)}
                    className={`rounded-full px-5 py-1.5 transition-all duration-300 ${
                      showSkeleton ? "bg-ink text-paper" : "text-ink-mute hover:text-ink-soft"
                    }`}
                  >
                    שלד בלבד
                  </button>
                </div>
              </div>

              {/* 3D stage */}
              <div
                key={stageKey}
                className="stage-crossfade min-h-0 flex-1 overflow-hidden px-4 py-2 [min-height:260px] md:[min-height:0]"
              >
                <Ring3D
                  shape={shape.id}
                  metal={metal}
                  setting={setting.id}
                  band={band.id}
                  carat={carat}
                  showSkeleton={showSkeleton}
                />
              </div>

              {/* Live summary + CTA */}
              <div className="border-t border-rule px-6 py-5 md:px-8 md:py-6 bg-paper-deep">
                <p className="text-[0.6875rem] text-ink-mute tracking-[0.09em] uppercase">
                  {summaryShort}
                </p>

                <div className="mt-3 flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink-mute mb-1">
                      הערכת מחיר ראשונית
                    </p>
                    <p className="num not-italic text-[1.5rem] md:text-[1.875rem] leading-none text-ink">
                      <bdi dir="ltr">
                        {formatPriceILS(estimate).replace(' ש"ח', "")}
                      </bdi>
                      <span className="ms-1.5 font-body text-[0.875rem] text-ink-mute">
                        ש"ח
                      </span>
                    </p>
                    <p className="mt-1 text-[0.6875rem] text-ink-mute leading-snug max-w-[18rem]">
                      המחיר הסופי נקבע בפגישה, לאחר אישור מודל שעווה.
                    </p>
                  </div>

                  <Link
                    href={{ pathname: "/inquiry", query: { bespoke: summaryFull } }}
                    className="brass-disc brass-disc--solid whitespace-nowrap"
                  >
                    לשליחה לאטלייה
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Scrollable Options ─────────────────────── */}
          <div className="md:col-span-6 px-6 pb-20 md:px-12 md:pb-36">

            {/* ── 1. Diamond Shape ── */}
            <SectionHead step={1}>צורת היהלום</SectionHead>
            <div className="grid grid-cols-3 gap-3">
              {SHAPE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setShape(opt)}
                  aria-pressed={shape.id === opt.id}
                  className={`group flex flex-col items-center gap-2.5 border px-3 py-4 text-center transition-all duration-[280ms] ${
                    shape.id === opt.id
                      ? "border-ink bg-paper-deep text-ink"
                      : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                  }`}
                >
                  <ShapeIcon shape={opt.id} />
                  <span className="text-[0.8125rem] tracking-[0.01em] leading-tight">
                    {opt.he.replace("יהלום ", "")}
                  </span>
                </button>
              ))}
            </div>
            {shape && (
              <p className="mt-3 text-[0.8125rem] text-ink-mute">{shape.description}</p>
            )}

            {/* ── 2. Setting ── */}
            <SectionHead step={2}>שיבוץ</SectionHead>
            <div className="flex flex-wrap gap-2.5">
              {SETTING_OPTIONS.map((opt) => (
                <Pill
                  key={opt.id}
                  selected={setting.id === opt.id}
                  onClick={() => setSetting(opt)}
                >
                  {opt.he}
                </Pill>
              ))}
            </div>
            {setting && (
              <p className="mt-3 text-[0.8125rem] text-ink-mute leading-snug">
                {setting.description}
              </p>
            )}

            {/* ── 3. Metal ── */}
            <SectionHead step={3}>מתכת</SectionHead>
            <div className="flex gap-7">
              {METAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMetal(opt)}
                  aria-pressed={metal.id === opt.id}
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`block h-12 w-12 rounded-full transition-all duration-[280ms] ring-offset-[3px] ring-offset-paper ${
                      metal.id === opt.id
                        ? "ring-2 ring-ink scale-105"
                        : "ring-0 scale-100 group-hover:scale-105"
                    }`}
                    style={{
                      background: `radial-gradient(circle at 32% 28%, ${opt.glow}, ${opt.swatch} 52%, ${opt.ring})`,
                    }}
                  />
                  <span
                    className={`text-[0.75rem] tracking-[0.04em] transition-colors ${
                      metal.id === opt.id ? "text-ink" : "text-ink-mute group-hover:text-ink-soft"
                    }`}
                  >
                    {opt.he}
                  </span>
                </button>
              ))}
            </div>

            {/* ── 4. Band ── */}
            <SectionHead step={4}>להקה</SectionHead>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {displayedBands.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBand(opt)}
                  aria-pressed={band.id === opt.id}
                  className={`border px-4 py-3 text-start text-[0.8125rem] leading-snug transition-all duration-[280ms] ${
                    band.id === opt.id
                      ? "border-ink bg-paper-deep text-ink"
                      : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                  }`}
                >
                  {opt.he}
                </button>
              ))}
            </div>
            {!showAllBands && (
              <button
                type="button"
                onClick={() => setShowAllBands(true)}
                className="mt-3 text-[0.8125rem] text-ink-mute hairline-link"
              >
                הצג את כל הסגנונות ({BAND_OPTIONS.length - displayedBands.length} נוספים)
              </button>
            )}
            {band && (
              <p className="mt-3 text-[0.8125rem] text-ink-mute">{band.description}</p>
            )}

            {/* ── 5. Diamond Specs ── */}
            <SectionHead step={5}>מפרט היהלום</SectionHead>

            {/* Origin */}
            <div className="flex gap-3 mb-8">
              {ORIGIN_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOrigin(opt.id as "natural" | "lab-grown")}
                  aria-pressed={origin === opt.id}
                  className={`flex-1 border px-4 py-3.5 text-start transition-all duration-[280ms] ${
                    origin === opt.id
                      ? "border-ink bg-paper-deep text-ink"
                      : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                  }`}
                >
                  <span className="block text-[0.875rem] leading-snug">{opt.he}</span>
                  <span className="mt-1 block text-[0.75rem] text-ink-mute leading-snug">
                    {opt.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Carat */}
            <p className="section-label mb-3">משקל קראט</p>
            <div className="flex flex-wrap gap-2">
              {CARAT_OPTIONS.map((opt) => (
                <Pill
                  key={opt.value}
                  selected={carat === opt.value}
                  onClick={() => setCarat(opt.value)}
                >
                  <bdi dir="ltr">{opt.label} ct</bdi>
                </Pill>
              ))}
            </div>

            {/* Color + Clarity */}
            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <p className="section-label mb-3">צבע</p>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      aria-pressed={color === opt.value}
                      className={`h-10 w-10 border text-[0.875rem] transition-all duration-[280ms] ${
                        color === opt.value
                          ? "border-ink bg-paper-deep text-ink"
                          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      <bdi dir="ltr">{opt.value}</bdi>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="section-label mb-3">ניקיון</p>
                <div className="flex flex-wrap gap-2">
                  {CLARITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setClarity(opt.value)}
                      aria-pressed={clarity === opt.value}
                      className={`border px-2.5 py-2 text-[0.75rem] transition-all duration-[280ms] ${
                        clarity === opt.value
                          ? "border-ink bg-paper-deep text-ink"
                          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      <bdi dir="ltr">{opt.value}</bdi>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full summary row */}
            <div className="mt-16 border-t border-rule pt-10">
              <p className="section-label mb-2">סיכום</p>
              <p className="text-[0.9375rem] text-ink leading-relaxed">{summaryFull}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
