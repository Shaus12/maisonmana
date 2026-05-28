"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RingSVG } from "./RingSVG";
import {
  SETTING_OPTIONS,
  SHAPE_OPTIONS,
  METAL_OPTIONS,
  BAND_OPTIONS,
  CARAT_OPTIONS,
  COLOR_OPTIONS,
  CLARITY_OPTIONS,
  estimatePriceILS,
  type SettingOption,
  type ShapeOption,
  type MetalOption,
  type BandOption,
} from "@/lib/atelier-options";
import { formatPriceILS } from "@/lib/format";

type StepId = "base" | "diamond" | "metal" | "band";

const STEPS: { id: StepId; letter: string; he: string }[] = [
  { id: "base",    letter: "א", he: "בסיס"   },
  { id: "diamond", letter: "ב", he: "יהלום"  },
  { id: "metal",   letter: "ג", he: "מתכת"   },
  { id: "band",    letter: "ד", he: "להקה"   },
];

export function AtelierConfigurator() {
  const [setting, setSetting] = useState<SettingOption>(SETTING_OPTIONS[0]);
  const [shape, setShape] = useState<ShapeOption>(SHAPE_OPTIONS[0]);
  const [carat, setCarat] = useState(2.0);
  const [color, setColor] = useState<typeof COLOR_OPTIONS[number]["value"]>("E");
  const [clarity, setClarity] = useState<typeof CLARITY_OPTIONS[number]["value"]>("VS1");
  const [metal, setMetal] = useState<MetalOption>(METAL_OPTIONS[3]);
  const [band, setBand] = useState<BandOption>(BAND_OPTIONS[0]);
  const [step, setStep] = useState<StepId>("base");

  const estimate = useMemo(
    () =>
      estimatePriceILS({
        carat, color, clarity, metal: metal.id, setting: setting.id, band: band.id,
      }),
    [carat, color, clarity, metal.id, setting.id, band.id]
  );

  const summary = `${setting.he} · ${shape.he} · ${carat.toFixed(2)} ct · ${color}/${clarity} · ${metal.he} · להקה ${band.he}`;

  const stageKey = `${setting.id}-${shape.id}-${metal.id}-${band.id}-${carat}`;

  return (
    <div className="bg-paper">
      {/* THE STAGE */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 10%, oklch(0.42 0.045 280 / 0.85), oklch(0.18 0.025 280) 60%), oklch(0.22 0.025 280)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, oklch(0.88 0.060 82 / 0.5), transparent)" }}
        />
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-center px-6 py-16 md:px-12 md:py-24">
          {/* Diamond crosshair label */}
          <p
            className="display-lat mb-2 text-[0.6875rem] tracking-[0.28em] uppercase"
            style={{ color: "oklch(0.88 0.060 82 / 0.85)" }}
          >
            Atelier · Live Preview
          </p>

          <div key={stageKey} className="stage-crossfade">
            <RingSVG
              shape={shape.id}
              metal={metal}
              setting={setting.id}
              band={band.id}
              carat={carat}
              width={560}
            />
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="display-he text-[1.5rem] leading-tight text-paper">
              {shape.he} · {carat.toFixed(2)} ct
            </p>
            <p className="text-[0.8125rem] tracking-[0.04em] text-paper/70">
              {setting.he} · {metal.he} · להקה {band.he}
            </p>
          </div>
        </div>
      </section>

      {/* STEPS TAB BAR */}
      <div className="border-y border-rule bg-paper">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-0 px-6 md:px-12">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className="group relative flex flex-1 items-baseline justify-center gap-3 px-4 py-6 transition-colors duration-[280ms] md:flex-none md:px-12"
              aria-pressed={step === s.id}
            >
              <span
                className={`display-he text-[1.5rem] leading-none transition-colors duration-[280ms] ${
                  step === s.id ? "text-brass" : "text-ink-mute"
                }`}
              >
                {s.letter}
              </span>
              <span
                className={`text-[0.9375rem] transition-colors duration-[280ms] ${
                  step === s.id ? "text-ink" : "text-ink-soft"
                }`}
              >
                {s.he}
              </span>
              <span
                className={`absolute inset-x-6 bottom-0 h-px origin-end transition-transform duration-[420ms] ease-[var(--ease-quart)] ${
                  step === s.id ? "scale-x-100 bg-brass" : "scale-x-0 bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE PANEL */}
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 md:py-20">
        {step === "base" && (
          <Panel title="בחירת בסיס" subtitle="הצורה הראשונה של הטבעת — איך היהלום יושב על האצבע.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SETTING_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.id}
                  selected={setting.id === opt.id}
                  onClick={() => { setSetting(opt); advance("base", setStep); }}
                  title={opt.he}
                  description={opt.description}
                />
              ))}
            </div>
          </Panel>
        )}

        {step === "diamond" && (
          <Panel title="בחירת יהלום" subtitle="חיתוך, משקל, צבע, ניקיון.">
            <Subhead>חיתוך</Subhead>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {SHAPE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.id}
                  selected={shape.id === opt.id}
                  onClick={() => setShape(opt)}
                  title={opt.he}
                  description={opt.description}
                  small
                />
              ))}
            </div>

            <Subhead className="mt-12">משקל קראט</Subhead>
            <div className="flex flex-wrap gap-3">
              {CARAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCarat(opt.value)}
                  className={`min-w-[5.5rem] border px-5 py-3 text-center transition-colors duration-[280ms] ${
                    carat === opt.value
                      ? "border-brass bg-paper-deep text-ink"
                      : "border-rule text-ink-soft hover:border-ink-mute"
                  }`}
                >
                  <span className="num text-[1.25rem] not-italic">
                    <bdi dir="ltr">{opt.label}</bdi>
                  </span>
                  <span className="ms-1 text-[0.6875rem] text-ink-mute">ct</span>
                </button>
              ))}
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div>
                <Subhead>צבע</Subhead>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`border px-4 py-2 text-[0.875rem] transition-colors duration-[280ms] ${
                        color === opt.value
                          ? "border-brass bg-paper-deep text-ink"
                          : "border-rule text-ink-soft hover:border-ink-mute"
                      }`}
                    >
                      <bdi dir="ltr">{opt.value}</bdi>
                      <span className="ms-2 text-[0.75rem] text-ink-mute">{opt.he.split(" — ")[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Subhead>ניקיון</Subhead>
                <div className="flex flex-wrap gap-3">
                  {CLARITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setClarity(opt.value)}
                      className={`border px-4 py-2 text-[0.875rem] transition-colors duration-[280ms] ${
                        clarity === opt.value
                          ? "border-brass bg-paper-deep text-ink"
                          : "border-rule text-ink-soft hover:border-ink-mute"
                      }`}
                    >
                      <bdi dir="ltr">{opt.value}</bdi>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        )}

        {step === "metal" && (
          <Panel title="בחירת מתכת" subtitle="כיסוי המתכת קובע את החום של הטבעת כולה.">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {METAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setMetal(opt); advance("metal", setStep); }}
                  className={`group relative border p-5 text-start transition-colors duration-[280ms] ${
                    metal.id === opt.id ? "border-brass bg-paper-deep" : "border-rule hover:border-ink-mute"
                  }`}
                  aria-pressed={metal.id === opt.id}
                >
                  <span
                    className="block h-16 w-full"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${opt.glow}, ${opt.swatch} 55%, ${opt.ring})`,
                    }}
                  />
                  <span className="mt-4 block display-he text-[1.25rem] text-ink">{opt.he}</span>
                  <span className="mt-1 block text-[0.75rem] tracking-[0.04em] text-ink-mute">{opt.id === "platinum" ? "Platinum 950" : "18k"}</span>
                  {metal.id === opt.id && (
                    <span aria-hidden className="absolute inset-x-5 bottom-3 h-px bg-brass" />
                  )}
                </button>
              ))}
            </div>
          </Panel>
        )}

        {step === "band" && (
          <Panel title="בחירת להקה" subtitle="הקשת שנוגעת באצבע, יום אחרי יום.">
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {BAND_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.id}
                  selected={band.id === opt.id}
                  onClick={() => setBand(opt)}
                  title={opt.he}
                  description={opt.description}
                />
              ))}
            </div>
          </Panel>
        )}

        {/* SUMMARY + REQUEST */}
        <div className="mt-20 border-t border-rule pt-12">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="section-label">סיכום היצירה</p>
              <p className="mt-4 display-he text-[1.5rem] leading-snug text-ink">{summary}</p>
              <p className="mt-5 text-[0.875rem] text-ink-mute leading-relaxed">
                המחיר המוערך מבוסס על שערי השוק ועל מורכבות העבודה ההנדסית. הוא נסגר סופית במעמד אישור מודל השעווה, בפגישה.
              </p>
            </div>
            <div className="md:col-span-5 md:text-end">
              <p className="section-label">הערכה ראשונית</p>
              <p className="num mt-3 text-[2.5rem] text-ink not-italic">
                <bdi dir="ltr">{formatPriceILS(estimate).replace(' ש"ח', "")}</bdi>
                <span className="ms-2 text-[1.125rem] font-body text-ink-mute">ש"ח</span>
              </p>
              <Link
                href={{ pathname: "/inquiry", query: { bespoke: summary } }}
                className="brass-disc brass-disc--solid mt-8 inline-flex"
              >
                לשליחה לאטלייה ולקביעת פגישה
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function advance(current: StepId, setStep: (s: StepId) => void) {
  const order: StepId[] = ["base", "diamond", "metal", "band"];
  const idx = order.indexOf(current);
  if (idx < order.length - 1) {
    setTimeout(() => setStep(order[idx + 1]), 480);
  }
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="mb-10 max-w-2xl">
        <h2 className="display-he text-[2rem] leading-[1.1] text-ink md:text-[2.5rem]">{title}</h2>
        <p className="mt-3 text-ink-soft text-[1rem]">{subtitle}</p>
      </header>
      <div>{children}</div>
    </div>
  );
}

function Subhead({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`section-label mb-4 ${className}`}>{children}</p>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  description,
  small = false,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative block w-full border p-5 text-start transition-colors duration-[280ms] ${
        selected ? "border-brass bg-paper-deep" : "border-rule hover:border-ink-mute"
      }`}
      aria-pressed={selected}
    >
      <span className={`block display-he text-ink ${small ? "text-[1.125rem]" : "text-[1.375rem]"}`}>
        {title}
      </span>
      <span className="mt-2 block text-[0.8125rem] text-ink-mute leading-snug">{description}</span>
      {selected && (
        <span aria-hidden className="absolute inset-x-5 bottom-3 h-px bg-brass" />
      )}
    </button>
  );
}
