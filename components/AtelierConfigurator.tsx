"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageProvider";

const Ring3D = dynamic(() => import("./Ring3D").then((mod) => mod.Ring3D), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-ink-mute">
      Loading 3D preview...
    </div>
  ),
});
import {
  SETTING_OPTIONS,
  SHAPE_OPTIONS,
  METAL_OPTIONS,
  BAND_OPTIONS,
  CARAT_OPTIONS,
  CLARITY_OPTIONS,
  JEWELRY_TYPE_OPTIONS,
  FANCY_COLOR_OPTIONS,
  estimatePriceILS,
  type SettingOption,
  type ShapeOption,
  type MetalOption,
  type BandOption,
  type JewelryType,
  type FancyColorOption,
} from "@/lib/atelier-options";
import { formatPriceILS } from "@/lib/format";

// ── Earring setting options ──────────────────────────────────
const EARRING_SETTING_OPTIONS = [
  { id: "stud", he: "עגילים צמודים", en: "Stud Earrings", description: "שיבוץ צמוד קלאסי, היהלום מונח על האוזן.", descriptionEn: "Classic stud setting, diamond sits close to the ear." },
  { id: "hoop", he: "עגילי חישוק", en: "Hoop Earrings", description: "חישוק זהב עדין משובץ ביהלומי מיקרו.", descriptionEn: "Delicate gold hoops set with micro diamonds." },
];

// ── Diamond shape SVG silhouettes (Supports all 10 shapes) ───
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
      {shape === "oval" && (
        <ellipse cx="20" cy="20" rx="14" ry="9" transform="rotate(-45 20 20)" />
      )}
      {shape === "cushion" && (
        <rect x="10" y="10" width="20" height="20" rx="6" ry="6" />
      )}
      {shape === "princess" && <rect x="9" y="9" width="22" height="22" />}
      {shape === "emerald" && (
        <path d="M13 8L27 8L34 14L34 26L27 32L13 32L6 26L6 14Z" />
      )}
      {shape === "pear" && (
        <path d="M20 7C26 7 32 12.5 32 19.5C32 27.5 20 35 20 35C20 35 8 27.5 8 19.5C8 12.5 14 7 20 7Z" />
      )}
      {shape === "marquise" && (
        <path d="M20 5C28 11.5 35 15.5 35 20C35 24.5 28 28.5 20 35C12 28.5 5 24.5 5 20C5 15.5 12 11.5 20 5Z" />
      )}
      {shape === "radiant" && (
        <path d="M12 9h16l4 4v14l-4 4H12l-4-4V13l4-4z" />
      )}
      {shape === "asscher" && (
        <path d="M12 12h16l4 4v8l-4 4H12l-4-4v-8l4-4z" />
      )}
      {shape === "heart" && (
        <path d="M20 34C18 31 7 24.5 7 15.5C7 10.5 11 7 15.5 7C17.5 7 19 8.5 20 10.5C21 8.5 22.5 7 24.5 7C29 7 33 10.5 33 15.5C33 24.5 22 31 20 34Z" />
      )}
    </svg>
  );
}

// ── Section header (Dynamic Hebrew Alphabet Steps) ───────────
function SectionHead({ step, children }: { step: number; children: React.ReactNode }) {
  const hebrewLetters = ["א", "ב", "ג", "ד", "ה", "ו", "ז"];
  return (
    <div className="flex items-baseline gap-4 border-t border-rule pt-7 mb-5 md:pt-10 md:mb-6">
      <span
        className="display-he text-[1.375rem] leading-none font-bold"
        style={{ color: "oklch(0.74 0.110 78)" }}
      >
        {hebrewLetters[step - 1] || step}
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

const POPULAR_BAND_IDS = [
  "classic", "knife-edge", "twisted", "pave-band",
  "split-shank", "bypass", "milgrain", "chevron",
] as const;

export function AtelierConfigurator() {
  const { t, locale } = useLanguage();
  const [jewelryType, setJewelryType] = useState<JewelryType>("ring");
  const [setting, setSetting]         = useState<SettingOption>(SETTING_OPTIONS[0]);
  const [earringSetting, setEarringSetting] = useState(EARRING_SETTING_OPTIONS[0]);
  const [shape, setShape]             = useState<ShapeOption>(SHAPE_OPTIONS[0]);
  const [origin, setOrigin]           = useState<"natural" | "lab-grown">("lab-grown");
  const [carat, setCarat]             = useState(2.0);
  const [color, setColor]             = useState<FancyColorOption["id"]>("colorless");
  const [clarity, setClarity]         = useState<typeof CLARITY_OPTIONS[number]["value"]>("VS1");
  const [metal, setMetal]             = useState<MetalOption>(METAL_OPTIONS[3]);
  const [band, setBand]               = useState<BandOption>(BAND_OPTIONS[0]);
  const [showAllBands, setShowAllBands] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const estimate = useMemo(
    () => estimatePriceILS({
      jewelryType,
      origin,
      carat,
      color,
      clarity,
      metal: metal.id,
      setting: jewelryType === "earring" ? earringSetting.id as any : setting.id,
      band: band.id
    }),
    [jewelryType, origin, carat, color, clarity, metal.id, setting.id, earringSetting.id, band.id]
  );

  // Dynamic names and labels based on language
  const typeName = locale === "he"
    ? JEWELRY_TYPE_OPTIONS.find(t => t.id === jewelryType)?.he
    : JEWELRY_TYPE_OPTIONS.find(t => t.id === jewelryType)?.en;

  const shapeName = locale === "he"
    ? shape.he
    : shape.id.charAt(0).toUpperCase() + shape.id.slice(1);

  const settingName = jewelryType === "earring"
    ? (locale === "he" ? earringSetting.he : earringSetting.en)
    : (locale === "he" ? setting.he : setting.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "));

  const metalName = locale === "he"
    ? metal.he
    : metal.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const bandName = locale === "he"
    ? band.he
    : band.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const colorName = locale === "he"
    ? FANCY_COLOR_OPTIONS.find(c => c.id === color)?.he
    : FANCY_COLOR_OPTIONS.find(c => c.id === color)?.en;

  const originLabel = origin === "natural" ? t("conf_origin_nat") : t("conf_origin_lab");

  const summaryShort = `${typeName} · ${carat.toFixed(2)} ct · ${metalName}`;
  const summaryFull = useMemo(() => {
    let parts = [typeName, `${carat.toFixed(2)} ct`, colorName, clarity, metalName];
    if (jewelryType === "ring") {
      parts.push(settingName);
      parts.push(bandName);
      parts.push(shapeName);
    } else if (jewelryType === "necklace") {
      parts.push(shapeName);
    } else if (jewelryType === "earring") {
      parts.push(settingName);
      parts.push(shapeName);
    }
    parts.push(`(${originLabel})`);
    return parts.join(" · ");
  }, [jewelryType, typeName, carat, colorName, clarity, metalName, settingName, bandName, shapeName, originLabel]);

  const stageKey = `${jewelryType}-${setting.id}-${earringSetting.id}-${shape.id}-${metal.id}-${band.id}-${carat}-${color}`;
  const displayedBands = showAllBands
    ? BAND_OPTIONS
    : BAND_OPTIONS.filter((b) => POPULAR_BAND_IDS.includes(b.id as typeof POPULAR_BAND_IDS[number]));

  // Step counter logic
  let currentStep = 1;

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
                    {locale === "he" ? "תכשיט משובץ" : t("viewer_gem")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSkeleton(true)}
                    className={`rounded-full px-5 py-1.5 transition-all duration-300 ${
                      showSkeleton ? "bg-ink text-paper" : "text-ink-mute hover:text-ink-soft"
                    }`}
                  >
                    {locale === "he" ? "שלד מתכת" : t("viewer_skeleton")}
                  </button>
                </div>
              </div>

              {/* 3D stage */}
              <div
                key={stageKey}
                className="stage-crossfade min-h-0 flex-1 overflow-hidden px-4 py-2 [min-height:260px] md:[min-height:0]"
              >
                <Ring3D
                  jewelryType={jewelryType}
                  shape={shape.id}
                  metal={metal}
                  setting={jewelryType === "earring" ? earringSetting.id : setting.id}
                  band={band.id}
                  carat={carat}
                  diamondColor={FANCY_COLOR_OPTIONS.find(c => c.id === color)?.hex}
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
                      {t("conf_price_label")}
                    </p>
                    <p className="num not-italic text-[1.5rem] md:text-[1.875rem] leading-none text-ink">
                      <bdi dir="ltr">
                        {formatPriceILS(estimate).replace(' ש"ח', "")}
                      </bdi>
                      <span className="ms-1.5 font-body text-[0.875rem] text-ink-mute">
                        {t("currency")}
                      </span>
                    </p>
                    <p className="mt-1 text-[0.6875rem] text-ink-mute leading-snug max-w-[18rem]">
                      {t("conf_price_note")}
                    </p>
                  </div>

                  <Link
                    href={{ pathname: "/inquiry", query: { bespoke: summaryFull } }}
                    className="brass-disc brass-disc--solid whitespace-nowrap"
                  >
                    {t("conf_send")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Scrollable Options ─────────────────────── */}
          <div className="md:col-span-6 px-6 pb-20 md:px-12 md:pb-36">

            {/* ── Step 1. Jewelry Type ── */}
            <SectionHead step={currentStep++}>
              {locale === "he" ? "סוג התכשיט" : "Jewelry Type"}
            </SectionHead>
            <div className="flex flex-wrap gap-2.5">
              {JEWELRY_TYPE_OPTIONS.map((opt) => (
                <Pill
                  key={opt.id}
                  selected={jewelryType === opt.id}
                  onClick={() => setJewelryType(opt.id)}
                >
                  {locale === "he" ? opt.he : opt.en}
                </Pill>
              ))}
            </div>

            {/* ── Step 2. Diamond Shape (Only for Ring, Necklace, Earring) ── */}
            {jewelryType !== "bracelet" && (
              <>
                <SectionHead step={currentStep++}>{t("conf_shape")}</SectionHead>
                <div className="grid grid-cols-5 gap-3 sm:grid-cols-5">
                  {SHAPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setShape(opt)}
                      aria-pressed={shape.id === opt.id}
                      className={`group flex flex-col items-center gap-2 border px-1.5 py-3.5 text-center transition-all duration-[280ms] ${
                        shape.id === opt.id
                          ? "border-ink bg-paper-deep text-ink"
                          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      <ShapeIcon shape={opt.id} />
                      <span className="text-[0.75rem] tracking-[0.01em] leading-tight mt-1">
                        {locale === "he" ? opt.he : opt.en}
                      </span>
                    </button>
                  ))}
                </div>
                {shape && (
                  <p className="mt-3 text-[0.8125rem] text-ink-mute">
                    {locale === "he" ? shape.description : shape.descriptionEn}
                  </p>
                )}
              </>
            )}

            {/* ── Step 3. Setting (Only for Ring, Earring) ── */}
            {jewelryType === "ring" && (
              <>
                <SectionHead step={currentStep++}>{t("conf_setting")}</SectionHead>
                <div className="flex flex-wrap gap-2.5">
                  {SETTING_OPTIONS.map((opt) => (
                    <Pill
                      key={opt.id}
                      selected={setting.id === opt.id}
                      onClick={() => setSetting(opt)}
                    >
                      {locale === "he" ? opt.he : opt.en}
                    </Pill>
                  ))}
                </div>
                {setting && (
                  <p className="mt-3 text-[0.8125rem] text-ink-mute leading-snug">
                    {locale === "he" ? setting.description : setting.descriptionEn}
                  </p>
                )}
              </>
            )}

            {jewelryType === "earring" && (
              <>
                <SectionHead step={currentStep++}>{t("conf_setting")}</SectionHead>
                <div className="flex flex-wrap gap-2.5">
                  {EARRING_SETTING_OPTIONS.map((opt) => (
                    <Pill
                      key={opt.id}
                      selected={earringSetting.id === opt.id}
                      onClick={() => setEarringSetting(opt)}
                    >
                      {locale === "he" ? opt.he : opt.en}
                    </Pill>
                  ))}
                </div>
                {earringSetting && (
                  <p className="mt-3 text-[0.8125rem] text-ink-mute leading-snug">
                    {locale === "he" ? earringSetting.description : earringSetting.descriptionEn}
                  </p>
                )}
              </>
            )}

            {/* ── Step 4. Metal (All Types) ── */}
            <SectionHead step={currentStep++}>{t("conf_metal")}</SectionHead>
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
                    {locale === "he" ? opt.he : opt.en}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Step 5. Band Style (Only for Ring) ── */}
            {jewelryType === "ring" && (
              <>
                <SectionHead step={currentStep++}>{t("conf_band")}</SectionHead>
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
                      {locale === "he" ? opt.he : opt.en}
                    </button>
                  ))}
                </div>
                {!showAllBands && (
                  <button
                    type="button"
                    onClick={() => setShowAllBands(true)}
                    className="mt-3 text-[0.8125rem] text-ink-mute hairline-link"
                  >
                    {t("conf_show_all_bands")} ({BAND_OPTIONS.length - displayedBands.length} {t("conf_more")})
                  </button>
                )}
                {band && (
                  <p className="mt-3 text-[0.8125rem] text-ink-mute">
                    {locale === "he" ? band.description : band.descriptionEn}
                  </p>
                )}
              </>
            )}

            {/* ── Step 6. Specs (All Types) ── */}
            <SectionHead step={currentStep++}>{t("conf_specs")}</SectionHead>

            {/* Origin (Only if not a pure fancy diamond which is natural, but we can let them select for colorless/others) */}
            <div className="flex gap-3 mb-8">
              {(["lab-grown", "natural"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setOrigin(id)}
                  aria-pressed={origin === id}
                  className={`flex-1 border px-4 py-3.5 text-start transition-all duration-[280ms] ${
                    origin === id
                      ? "border-ink bg-paper-deep text-ink"
                      : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                  }`}
                >
                  <span className="block text-[0.875rem] leading-snug">
                    {id === "lab-grown" ? t("conf_origin_lab") : t("conf_origin_nat")}
                  </span>
                  <span className="mt-1 block text-[0.75rem] text-ink-mute leading-snug">
                    {id === "lab-grown" ? t("conf_origin_lab_desc") : t("conf_origin_nat_desc")}
                  </span>
                </button>
              ))}
            </div>

            {/* Carat */}
            <p className="section-label mb-3">{t("conf_carat")}</p>
            <div className="flex flex-wrap gap-2 mb-8">
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
            <div className="grid grid-cols-1 gap-8">
              {/* Fancy Colors */}
              <div>
                <p className="section-label mb-3">{locale === "he" ? "צבע היהלום (טבעי + מעבדה)" : "Diamond Color (Natural + Lab)"}</p>
                <div className="flex flex-wrap gap-2.5">
                  {FANCY_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setColor(opt.id)}
                      aria-pressed={color === opt.id}
                      className={`flex items-center gap-2.5 border px-3.5 py-2.5 text-[0.8125rem] transition-all duration-[280ms] ${
                        color === opt.id
                          ? "border-ink bg-paper-deep text-ink font-medium"
                          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      <span
                        className="inline-block h-4.5 w-4.5 rounded-full border border-rule-soft"
                        style={{
                          backgroundColor: opt.hex,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1) inset"
                        }}
                      />
                      <span className="display-he">
                        {locale === "he" ? opt.he : opt.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clarity */}
              <div>
                <p className="section-label mb-3">{t("conf_clarity")}</p>
                <div className="flex flex-wrap gap-2">
                  {CLARITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setClarity(opt.value)}
                      aria-pressed={clarity === opt.value}
                      className={`border px-3.5 py-2 text-[0.75rem] transition-all duration-[280ms] ${
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
              <p className="section-label mb-2">{t("conf_summary_label")}</p>
              <p className="text-[0.9375rem] text-ink leading-relaxed">{summaryFull}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
