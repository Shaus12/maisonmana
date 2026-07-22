"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import { useLanguage } from "./LanguageProvider";
import { submitInquiry, type InquiryState } from "@/app/inquiry/actions";
import { AtelierRenderFlow } from "./AtelierRenderFlow";

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
      className="mx-auto h-8 w-8"
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
      className={`relative border px-4 py-4 text-[0.9375rem] leading-snug transition-[border-color,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] ${
        selected
          ? "border-ink bg-paper-deep text-ink"
          : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"
      } ${className}`}
    >
      {children}
      {selected && (
        <span aria-hidden className="absolute end-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.625rem] leading-none text-paper">
          ✓
        </span>
      )}
    </button>
  );
}

function SelectionIndicator({ selected }: { selected: boolean }) {
  if (!selected) return null;
  return (
    <span aria-hidden className="absolute end-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.625rem] leading-none text-paper">
      ✓
    </span>
  );
}

const POPULAR_BAND_IDS = [
  "classic", "knife-edge", "twisted", "pave-band",
  "split-shank", "bypass", "milgrain", "chevron",
] as const;

const initialInquiryState: InquiryState = { status: "idle" };

let hasSeenAtelierInteractionHint = false;

type WizardStepId = "type" | "shape" | "setting" | "metal" | "band" | "carat" | "details";

const WIZARD_COPY = {
  he: {
    type: { title: "בחרו את סוג התכשיט", instruction: "הבחירה קובעת אילו שלבים יוצגו בהמשך." },
    shape: { title: "בחרו את צורת היהלום", instruction: "צורת האבן תתעדכן מיד בתצוגה." },
    setting: { title: "בחרו את סגנון השיבוץ", instruction: "השיבוץ קובע כיצד האבן מתחברת לתכשיט." },
    metal: { title: "בחרו את המתכת", instruction: "הגוון והגימור יתעדכנו מיד בתצוגה." },
    band: { title: "בחרו את סגנון הלהקה", instruction: "אפשר לחזור ולשנות את המבנה בכל שלב." },
    carat: { title: "בחרו את משקל היהלום", instruction: "משקל הקראט משפיע על נוכחות האבן בתצוגה." },
    details: { title: "השלימו את פרטי היהלום", instruction: "בחרו מקור, צבע ורמת ניקיון." },
    previous: "חזרה",
    next: "המשך",
    finish: "סיום העיצוב",
    step: "שלב",
    of: "מתוך",
  },
  en: {
    type: { title: "Choose the jewelry type", instruction: "Your choice determines which steps appear next." },
    shape: { title: "Choose the diamond shape", instruction: "The stone shape updates immediately in the preview." },
    setting: { title: "Choose the setting", instruction: "The setting determines how the stone meets the piece." },
    metal: { title: "Choose the metal", instruction: "The color and finish update immediately in the preview." },
    band: { title: "Choose the band style", instruction: "You can return and change the construction at any time." },
    carat: { title: "Choose the diamond weight", instruction: "Carat weight changes the stone's presence in the preview." },
    details: { title: "Complete the diamond details", instruction: "Choose origin, color, and clarity." },
    previous: "Back",
    next: "Continue",
    finish: "Finish Design",
    step: "Step",
    of: "of",
  },
} as const;

const COMPLETION_COPY = {
  he: {
    eyebrow: "העיצוב שלכם מוכן",
    title: "הפכו את העיצוב להדמיה מציאותית",
    body: "יצרנו עבורכם מודל אינטראקטיבי בהתאם לבחירות שביצעתם. כעת ניתן ליצור הדמיה פוטוריאליסטית ראשונית של התכשיט.",
    disclaimer: "ההדמיה היא המחשה ראשונית. הפרופורציות, השיבוץ והפרטים הסופיים יעברו התאמה מדויקת בפגישה האישית.",
    edit: "חזרה לעריכת העיצוב",
    labels: {
      type: "סוג התכשיט",
      shape: "צורת היהלום",
      setting: "שיבוץ",
      metal: "מתכת",
      band: "סגנון הלהקה",
      carat: "משקל",
      origin: "מקור היהלום",
      color: "צבע היהלום",
      clarity: "ניקיון",
    },
  },
  en: {
    eyebrow: "Your design is ready",
    title: "Turn Your Design into a Realistic Preview",
    body: "We created an interactive model from your selections. You can now create an initial photorealistic preview of the jewelry.",
    disclaimer: "The preview is an initial illustration. Proportions, setting, and final details will be refined during your personal appointment.",
    edit: "Back to editing",
    labels: {
      type: "Jewelry type",
      shape: "Diamond shape",
      setting: "Setting",
      metal: "Metal",
      band: "Band style",
      carat: "Weight",
      origin: "Diamond origin",
      color: "Diamond color",
      clarity: "Clarity",
    },
  },
} as const;

export function AtelierConfigurator() {
  const { t, locale } = useLanguage();
  const [leadState, leadAction] = useActionState(submitInquiry, initialInquiryState);
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
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(true);
  const [renderResult, setRenderResult] = useState<{ imageUrl?: string; imageBase64?: string; mimeType: string } | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [wizardComplete, setWizardComplete] = useState(false);
  const [showInteractionHint, setShowInteractionHint] = useState(false);
  const [shapePage, setShapePage] = useState(0);

  useEffect(() => {
    if (hasSeenAtelierInteractionHint) return;

    setShowInteractionHint(true);
    const timer = window.setTimeout(() => {
      hasSeenAtelierInteractionHint = true;
      setShowInteractionHint(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (renderResult) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [renderResult]);

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
  const clarityName = locale === "he"
    ? CLARITY_OPTIONS.find((option) => option.value === clarity)?.he
    : CLARITY_OPTIONS.find((option) => option.value === clarity)?.en;
  const selectedCaratLabel = CARAT_OPTIONS.find((option) => option.value === carat)?.label ?? carat.toFixed(2);
  const completionCopy = COMPLETION_COPY[locale];
  const completionRows = ([
    { label: completionCopy.labels.type, value: typeName, visible: true },
    { label: completionCopy.labels.shape, value: shapeName, visible: jewelryType !== "bracelet" },
    { label: completionCopy.labels.setting, value: settingName, visible: jewelryType === "ring" || jewelryType === "earring" },
    { label: completionCopy.labels.metal, value: metalName, visible: true },
    { label: completionCopy.labels.band, value: bandName, visible: jewelryType === "ring" },
    { label: completionCopy.labels.carat, value: locale === "he" ? `${selectedCaratLabel} קראט` : `${selectedCaratLabel} ct`, visible: true },
    { label: completionCopy.labels.origin, value: originLabel, visible: true },
    { label: completionCopy.labels.color, value: colorName, visible: true },
    { label: completionCopy.labels.clarity, value: clarityName, visible: true },
  ] satisfies Array<{ label: string; value: string | undefined; visible: boolean }>)
    .filter((row) => row.visible && Boolean(row.value))
    .map((row) => ({ label: row.label, value: row.value as string }));

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

  const visibleStepIds = useMemo<WizardStepId[]>(() => {
    if (jewelryType === "ring") return ["type", "shape", "setting", "metal", "band", "carat", "details"];
    if (jewelryType === "earring") return ["type", "shape", "setting", "metal", "carat", "details"];
    if (jewelryType === "necklace") return ["type", "shape", "metal", "carat", "details"];
    return ["type", "metal", "carat", "details"];
  }, [jewelryType]);

  useEffect(() => {
    setActiveStepIndex((index) => Math.min(index, visibleStepIds.length - 1));
  }, [visibleStepIds.length]);

  const activeStepId = visibleStepIds[activeStepIndex];
  const wizardCopy = WIZARD_COPY[locale];
  const isFirstStep = activeStepIndex === 0;
  const isFinalStep = activeStepIndex === visibleStepIds.length - 1;
  const shapePageCount = Math.ceil(SHAPE_OPTIONS.length / 6);
  const visibleMobileShapes = SHAPE_OPTIONS.slice(shapePage * 6, shapePage * 6 + 6);

  useEffect(() => {
    if (activeStepId !== "shape") return;
    const selectedIndex = SHAPE_OPTIONS.findIndex((option) => option.id === shape.id);
    setShapePage(Math.max(0, Math.floor(selectedIndex / 6)));
  }, [activeStepId, shape.id]);
  const breadcrumbItems = visibleStepIds
    .slice(0, wizardComplete ? activeStepIndex + 1 : activeStepIndex)
    .flatMap((stepId) => {
      if (stepId === "type") return [typeName];
      if (stepId === "shape") return [shapeName];
      if (stepId === "setting") return [settingName];
      if (stepId === "metal") return [metalName];
      if (stepId === "band") return [bandName];
      if (stepId === "details") return [originLabel, colorName];
      return [];
    })
    .filter((item): item is string => Boolean(item));

  function dismissInteractionHint() {
    if (!showInteractionHint) return;
    hasSeenAtelierInteractionHint = true;
    setShowInteractionHint(false);
  }

  function selectJewelryType(nextType: JewelryType) {
    setJewelryType(nextType);
    setWizardComplete(false);
  }

  function goToPreviousStep() {
    setWizardComplete(false);
    setActiveStepIndex((index) => Math.max(0, index - 1));
  }

  function goToNextStep() {
    if (isFinalStep) {
      setWizardComplete(true);
      return;
    }
    setActiveStepIndex((index) => Math.min(visibleStepIds.length - 1, index + 1));
  }

  async function handleDownloadImage(result: NonNullable<typeof renderResult>) {
    try {
      if (result.imageBase64) {
        const byteCharacters = atob(result.imageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: result.mimeType });
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "maison-mana-render.png";
        a.click();
        URL.revokeObjectURL(objectUrl);
        return;
      }
      
      if (result.imageUrl) {
        const proxyUrl = `/api/atelier/proxy-image?url=${encodeURIComponent(result.imageUrl)}&download=1`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = "maison-mana-render.jpg";
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      if (result.imageUrl) window.open(result.imageUrl, "_blank", "noopener,noreferrer");
    }
  }

  // ── FULL WIDTH RESULT LAYOUT ─────────────────────────────────
  if (renderResult) {
    const displaySrc = renderResult.imageBase64
      ? `data:${renderResult.mimeType};base64,${renderResult.imageBase64}`
      : renderResult.imageUrl
      ? `/api/atelier/proxy-image?url=${encodeURIComponent(renderResult.imageUrl)}`
      : "";

    return (
      <div className="bg-paper min-h-screen py-16 px-6 md:py-24">
        <div className="mx-auto max-w-[920px] flex flex-col items-center text-center">
          <p className="section-label mb-4" dir="ltr">MAISON MANA · INITIAL RENDER</p>
          <h2 className="display-he text-[2.5rem] md:text-[3rem] text-ink mb-3 leading-tight">
            {locale === "he" ? "ההדמיה הראשונית מוכנה" : "Your initial preview is ready"}
          </h2>
          <p className="text-[1rem] text-ink-soft mb-12 max-w-2xl">{summaryFull}</p>

          {/* Large Hero Image using regular <img> */}
          <div className="relative w-full aspect-square md:aspect-[4/3] bg-velvet border border-ink/10 mb-8 p-0 md:p-8 flex items-center justify-center overflow-hidden">
            <img
              src={displaySrc}
              alt={locale === "he" ? "הדמיה ראשונית של תכשיט Maison Mana" : "Initial preview of a Maison Mana piece"}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                // If proxy fails or image is dead, hide image and show fallback
                (e.target as HTMLImageElement).style.display = "none";
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<p class="text-ink-mute text-sm">${locale === "he" ? "לא ניתן לטעון את התמונה." : "The image could not be loaded."}</p>`;
                }
              }}
            />
          </div>

          {/* Disclaimer */}
          <p className="text-[0.875rem] leading-relaxed text-ink-mute max-w-2xl mx-auto italic mb-10 border-s border-brass/40 ps-4 text-start">
            {locale === "he"
              ? "ההדמיה מיועדת להמחשה ראשונית בלבד. היא נוצרה באמצעות מודל בינה מלאכותית על בסיס הבחירות שלך. בפגישה האישית באטלייה נדייק יחד את הפרופורציות, האבן, השיבוץ והפרטים הסופיים."
              : "The preview is for initial illustration only. It was created by an AI model based on your choices. In the personal meeting at the atelier we will refine the proportions, stone, setting, and final details together."}
          </p>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-5 items-center justify-center w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() => handleDownloadImage(renderResult)}
              className="brass-disc brass-disc--solid w-full justify-center"
            >
              {locale === "he" ? "הורדת ההדמיה" : "Download Preview"}
            </button>
            <button
              type="button"
              onClick={() => setRenderResult(null)}
              className="hairline-link text-[0.9375rem]"
            >
              {locale === "he" ? "חזרה לעריכה" : "Back to Editing"}
            </button>
          </div>

          {/* Inquiry form section */}
          <div id="atelier-lead" className="w-full mt-16 border-t border-rule pt-16 mb-24 md:mb-0 text-start">
            {leadState.status === "ok" ? (
              <div className="vellum px-6 py-10 text-center">
                <p className="section-label">Maison Mana</p>
                <h2 className="display-he mt-4 text-[2rem] leading-tight text-ink">
                  {t("inq_success_title")}
                </h2>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {locale === "he" ? "נחזור אליך תוך יום עסקים אחד לתיאום פגישה פרטית." : "We will get back to you within one business day to arrange a private meeting."}
                </p>
              </div>
            ) : (
              <form action={leadAction} className="vellum px-6 py-8 md:px-12 md:py-16 mx-auto max-w-2xl">
                <input type="hidden" name="intent" value="bespoke" />
                <input type="hidden" name="bespoke" value={summaryFull} />
                <header className="mb-10 text-center">
                  <p className="section-label">{locale === "he" ? "פגישה פרטית" : "Private Meeting"}</p>
                  <h2 className="display-he mt-3 text-[1.875rem] leading-tight text-ink">
                    {locale === "he" ? "שליחת העיצוב לאטלייה" : "Send the Design to the Atelier"}
                  </h2>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {locale === "he" ? "הפרטים יישלחו יחד עם ההדמיה וסיכום הבחירות כדי שנוכל להכין שיחה מדויקת." : "Your details will be sent together with the preview and choice summary so we can prepare a precise conversation."}
                  </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                  <AtelierField
                    name="name"
                    label={t("inq_field_name")}
                    required
                    autoComplete="name"
                    error={leadState.status === "error" && leadState.field === "name" ? t(leadState.message as any) : undefined}
                  />
                  <AtelierField
                    name="phone"
                    label={t("inq_field_phone")}
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    error={leadState.status === "error" && leadState.field === "phone" ? t(leadState.message as any) : undefined}
                  />
                  <AtelierField
                    name="preferred"
                    label={locale === "he" ? "מועד מבוקש" : "Preferred time"}
                    placeholder={locale === "he" ? "לדוגמה: שלישי בערב" : "e.g. Tuesday evening"}
                  />
                </div>

                <label className="mt-8 block text-start">
                  <span className="section-label mb-3 block">{locale === "he" ? "הערות קצרות" : "Short notes"}</span>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder={locale === "he" ? "מה חשוב שנדע לפני הפגישה?" : "What should we know before the meeting?"}
                    className="block w-full resize-y border-0 border-b border-rule bg-transparent py-3 text-[1rem] leading-relaxed text-ink placeholder:text-ink-mute focus:border-brass focus:outline-none"
                  />
                </label>

                {leadState.status === "error" && !leadState.field && (
                  <p className="mt-5 text-[0.875rem] italic text-ink-soft text-start">{t(leadState.message as any)}</p>
                )}

                <div className="mt-10 flex flex-wrap items-center justify-between gap-5">
                  <p className="max-w-sm text-[0.75rem] leading-relaxed text-ink-mute text-start">
                    {locale === "he" ? "הפרטים משמשים לתיאום הפגישה בלבד." : "Your details are used to arrange the meeting only."}
                  </p>
                  <AtelierSubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── NORMAL 2-COLUMN CONFIGURATOR LAYOUT ──────────────────────
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-[1440px]">
        <div className={`atelier-composer lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(22rem,1fr)] lg:items-start ${wizardComplete ? "is-complete" : ""}`}>
          {!wizardComplete && (
            <header className="atelier-mobile-progress" aria-label={locale === "he" ? "התקדמות בעיצוב" : "Design progress"}>
              <p className="text-[0.875rem] font-medium tracking-[0.06em] text-ink-soft" aria-live="polite">
                {wizardCopy.step} {activeStepIndex + 1} {wizardCopy.of} {visibleStepIds.length}
              </p>
              <div
                className="mt-2 h-0.5 overflow-hidden bg-rule"
                role="progressbar"
                aria-label={`${wizardCopy.step} ${activeStepIndex + 1} ${wizardCopy.of} ${visibleStepIds.length}`}
                aria-valuemin={1}
                aria-valuemax={visibleStepIds.length}
                aria-valuenow={activeStepIndex + 1}
              >
                <div
                  className="h-full bg-ink-soft/70 transition-[width] duration-300 ease-out motion-reduce:transition-none"
                  style={{ width: `${((activeStepIndex + 1) / visibleStepIds.length) * 100}%` }}
                />
              </div>
            </header>
          )}

          {/* ── LEFT: Sticky 3D Preview ──────────────────────── */}
          <div className="atelier-preview-region lg:sticky lg:top-[5.5rem] lg:self-start lg:[height:calc(100dvh-5.5rem)]">
            <div className="flex h-full flex-col border-b border-rule lg:border-b-0 lg:border-e">

              {/* Mobile: collapse/expand toggle */}
              <button
                type="button"
                onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
                className="atelier-preview-collapse flex items-center justify-between border-b border-rule bg-paper-deep px-5 py-3 lg:hidden"
              >
                <span className="text-[0.75rem] uppercase tracking-[0.14em] text-ink-mute">
                  {locale === "he" ? "תצוגה מקדימה" : "3D Preview"}
                </span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-4 w-4 text-ink-mute transition-transform duration-300 ${mobilePreviewOpen ? "rotate-180" : ""}`}
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Mobile: collapsible 3D area */}
              <div className={`atelier-preview-content overflow-hidden transition-[max-height] duration-200 ease-out motion-reduce:transition-none lg:contents ${mobilePreviewOpen ? "max-h-[500px]" : "max-h-0"}`}>
                {/* Skeleton toggle */}
                <div className="atelier-preview-mode flex justify-center border-b border-rule px-6 py-2.5 lg:py-3">
                  <div className="flex rounded-full border border-rule p-0.5 text-[0.8125rem]">
                    <button
                      type="button"
                      onClick={() => setShowSkeleton(false)}
                      className={`rounded-full px-4 py-1 md:px-5 md:py-1.5 transition-all duration-300 ${
                        !showSkeleton ? "bg-ink text-paper" : "text-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      {locale === "he" ? "תכשיט משובץ" : t("viewer_gem")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSkeleton(true)}
                      className={`rounded-full px-4 py-1 md:px-5 md:py-1.5 transition-all duration-300 ${
                        showSkeleton ? "bg-ink text-paper" : "text-ink-mute hover:text-ink-soft"
                      }`}
                    >
                      {locale === "he" ? "שלד מתכת" : t("viewer_skeleton")}
                    </button>
                  </div>
                </div>

                {/* 3D stage */}
                <div
                  className="atelier-preview-stage relative min-h-0 flex-1 overflow-hidden px-4 py-2 lg:[&>div:first-child]:rounded-b-none"
                  onPointerDownCapture={dismissInteractionHint}
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
                  <div key={stageKey} aria-hidden className="stage-crossfade pointer-events-none absolute inset-0 bg-paper/0" />
                  {showInteractionHint && (
                    <div
                      className="atelier-interaction-hint pointer-events-none absolute bottom-20 left-1/2 z-10 whitespace-nowrap rounded-full border border-paper/20 bg-ink/75 px-4 py-2 text-[0.75rem] text-paper shadow-sm backdrop-blur-sm"
                      role="status"
                    >
                      <span aria-hidden className="me-1.5">↻</span>
                      {locale === "he" ? "גררו כדי לסובב את התכשיט" : "Drag to rotate the jewelry"}
                    </div>
                  )}
                </div>
              </div>

              {/* Live summary + CTA — desktop only (mobile gets sticky bar) */}
              <div className="mx-4 -mt-2 hidden rounded-b-xl border border-rule bg-paper-deep px-8 py-6 lg:block">
                <p className="text-[0.6875rem] text-ink-mute tracking-[0.09em] uppercase">
                  {summaryShort}
                </p>

                <div className="mt-3 flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink-mute mb-1">
                      {locale === "he" ? "הצעת מחיר" : "Pricing"}
                    </p>
                    <p className="font-display text-[1.875rem] leading-none text-ink">
                      {locale === "he" ? "לפי דרישה" : "Upon Request"}
                    </p>
                    <p className="mt-1.5 text-[0.6875rem] text-ink-mute leading-snug max-w-[18rem]">
                      {locale === "he"
                        ? "*המחיר הסופי ייקבע בהתאם לבחירת האבן והמפרט המדויק."
                        : "*Final price is determined based on exact stone specifications."}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* ── RIGHT: Step-by-step controls ──────────────────── */}
          <div className="atelier-controls-region px-6 pb-20 pt-8 sm:px-8 lg:min-h-[calc(100dvh-5.5rem)] lg:border-s lg:border-rule lg:px-10 lg:pb-28 lg:pt-10 xl:px-12">
            {wizardComplete ? (
              <section
                aria-labelledby="atelier-completion-title"
                className="atelier-completion-panel mx-auto flex min-h-[34rem] max-w-[34rem] flex-col justify-center"
              >
                <p className="section-label">{completionCopy.eyebrow}</p>
                <h2 id="atelier-completion-title" className="display-he mt-4 text-[2.125rem] leading-[1.12] text-ink md:text-[2.5rem]">
                  {completionCopy.title}
                </h2>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                  {completionCopy.body}
                </p>

                <dl className="atelier-completion-summary mt-7 divide-y divide-rule border-y border-rule" aria-label={locale === "he" ? "סיכום הבחירות" : "Selection summary"}>
                  {completionRows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[minmax(7rem,0.8fr)_minmax(0,1fr)] gap-4 py-2.5 text-[0.8125rem] leading-relaxed">
                      <dt className="text-ink-mute">{row.label}</dt>
                      <dd className="text-ink">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 border-s border-brass/35 ps-3 text-[0.75rem] leading-relaxed text-ink-mute">
                  {completionCopy.disclaimer}
                </p>

                <div className="mt-7">
                  <AtelierRenderFlow
                    presentation="completion"
                    designSelections={{
                      jewelryType,
                      setting: jewelryType === "earring" ? earringSetting.id : setting.id,
                      shape: shape.id,
                      origin,
                      carat,
                      color,
                      clarity,
                      metal: metal.id,
                      band: band.id,
                    }}
                    designSummary={summaryFull}
                    onResult={setRenderResult}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setWizardComplete(false)}
                  className="mt-5 self-start text-[0.8125rem] text-ink-mute underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60"
                >
                  {completionCopy.edit}
                </button>
              </section>
            ) : (
            <section aria-labelledby="atelier-step-title" className="atelier-wizard-panel mx-auto flex min-h-[34rem] max-w-[34rem] flex-col">
              <header className="atelier-step-header mb-9 text-start">
                <p className="atelier-desktop-step-count text-[0.875rem] font-medium tracking-[0.06em] text-ink-soft" aria-live="polite">
                  {wizardCopy.step} {activeStepIndex + 1} {wizardCopy.of} {visibleStepIds.length}
                </p>
                <div
                  className="atelier-desktop-progress mt-4 h-0.5 overflow-hidden bg-rule"
                  role="progressbar"
                  aria-label={`${wizardCopy.step} ${activeStepIndex + 1} ${wizardCopy.of} ${visibleStepIds.length}`}
                  aria-valuemin={1}
                  aria-valuemax={visibleStepIds.length}
                  aria-valuenow={activeStepIndex + 1}
                >
                  <div
                    className="h-full bg-ink-soft/70 transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: `${((activeStepIndex + 1) / visibleStepIds.length) * 100}%` }}
                  />
                </div>
                {breadcrumbItems.length > 0 && (
                  <div
                    className="atelier-desktop-breadcrumbs mt-3 flex flex-wrap gap-1.5"
                    dir={locale === "he" ? "rtl" : "ltr"}
                    aria-label={locale === "he" ? "הבחירות שהושלמו" : "Completed selections"}
                  >
                    {breadcrumbItems.map((item, index) => (
                      <span key={`${item}-${index}`} className="atelier-breadcrumb-chip rounded-full bg-paper-deep px-2.5 py-1 text-[0.75rem] leading-none text-ink-mute">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <h2 id="atelier-step-title" className="display-he mt-6 text-[2.125rem] leading-[1.12] text-ink md:text-[2.5rem]">
                  {wizardCopy[activeStepId].title}
                </h2>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                  {wizardCopy[activeStepId].instruction}
                </p>
              </header>

              <div
                key={activeStepId}
                className="atelier-options-scroll atelier-wizard-step flex-1"
                role="group"
                aria-labelledby="atelier-step-title"
                aria-label={locale === "he" ? "אפשרויות השלב הנוכחי" : "Current step options"}
              >
                {activeStepId === "type" && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-3">
                    {JEWELRY_TYPE_OPTIONS.map((opt) => (
                      <Pill key={opt.id} selected={jewelryType === opt.id} onClick={() => selectJewelryType(opt.id)} className="min-h-16 w-full text-start">
                        {locale === "he" ? opt.he : opt.en}
                      </Pill>
                    ))}
                  </div>
                )}

                {activeStepId === "shape" && (
                  <>
                    <div className="hidden gap-3 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))]">
                      {SHAPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setShape(opt)}
                          aria-pressed={shape.id === opt.id}
                          className={`relative flex min-h-28 flex-col items-center justify-center gap-3 border px-4 py-5 text-center transition-[border-color,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] ${shape.id === opt.id ? "border-ink bg-paper-deep text-ink" : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"}`}
                        >
                          <SelectionIndicator selected={shape.id === opt.id} />
                          <ShapeIcon shape={opt.id} />
                          <span className="text-[0.8125rem] font-medium leading-tight">{locale === "he" ? opt.he : opt.en}</span>
                        </button>
                      ))}
                    </div>
                    <MobileOptionPager
                      page={shapePage}
                      pageCount={shapePageCount}
                      onPageChange={setShapePage}
                      locale={locale}
                      label={locale === "he" ? "עמודי צורות יהלום" : "Diamond shape pages"}
                    >
                      <div className="grid grid-cols-3 gap-2.5">
                        {visibleMobileShapes.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setShape(opt)}
                            aria-pressed={shape.id === opt.id}
                            className={`relative flex min-h-24 flex-col items-center justify-center gap-2 border px-2 py-3 text-center transition-[border-color,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] ${shape.id === opt.id ? "border-ink bg-paper-deep text-ink" : "border-rule text-ink-mute"}`}
                          >
                            <SelectionIndicator selected={shape.id === opt.id} />
                            <ShapeIcon shape={opt.id} />
                            <span className="text-[0.75rem] font-medium leading-tight">{locale === "he" ? opt.he : opt.en}</span>
                          </button>
                        ))}
                      </div>
                    </MobileOptionPager>
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">{locale === "he" ? shape.description : shape.descriptionEn}</p>
                  </>
                )}

                {activeStepId === "setting" && (
                  <>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(jewelryType === "earring" ? EARRING_SETTING_OPTIONS : SETTING_OPTIONS).map((opt) => {
                        const selected = jewelryType === "earring" ? earringSetting.id === opt.id : setting.id === opt.id;
                        return (
                          <Pill
                            key={opt.id}
                            selected={selected}
                            onClick={() => jewelryType === "earring" ? setEarringSetting(opt as typeof EARRING_SETTING_OPTIONS[number]) : setSetting(opt as SettingOption)}
                            className="min-h-16 w-full text-start"
                          >
                            {locale === "he" ? opt.he : opt.en}
                          </Pill>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">
                      {jewelryType === "earring"
                        ? (locale === "he" ? earringSetting.description : earringSetting.descriptionEn)
                        : (locale === "he" ? setting.description : setting.descriptionEn)}
                    </p>
                  </>
                )}

                {activeStepId === "metal" && (
                  <div className="grid grid-cols-2 gap-3">
                    {METAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMetal(opt)}
                        aria-pressed={metal.id === opt.id}
                        className={`relative flex min-h-28 items-center gap-5 border px-5 py-5 text-start transition-[border-color,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] ${metal.id === opt.id ? "border-ink bg-paper-deep text-ink" : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"}`}
                      >
                        <SelectionIndicator selected={metal.id === opt.id} />
                        <span className="block h-12 w-12 shrink-0 rounded-full border border-rule-soft" style={{ background: `radial-gradient(circle at 32% 28%, ${opt.glow}, ${opt.swatch} 52%, ${opt.ring})` }} />
                        <span className="text-[0.875rem] font-medium leading-snug">{locale === "he" ? opt.he : opt.en}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeStepId === "band" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {displayedBands.map((opt) => (
                        <Pill key={opt.id} selected={band.id === opt.id} onClick={() => setBand(opt)} className="min-h-16 w-full text-start">
                          {locale === "he" ? opt.he : opt.en}
                        </Pill>
                      ))}
                    </div>
                    {!showAllBands && (
                      <button type="button" onClick={() => setShowAllBands(true)} className="mt-5 hairline-link text-[0.8125rem] text-ink-mute">
                        {t("conf_show_all_bands")} ({BAND_OPTIONS.length - displayedBands.length} {t("conf_more")})
                      </button>
                    )}
                    <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-mute">{locale === "he" ? band.description : band.descriptionEn}</p>
                  </>
                )}

                {activeStepId === "carat" && (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-3">
                    {CARAT_OPTIONS.map((opt) => (
                      <Pill key={opt.value} selected={carat === opt.value} onClick={() => setCarat(opt.value)} className="min-h-16 w-full text-center">
                        <bdi dir="ltr">{opt.label} ct</bdi>
                      </Pill>
                    ))}
                  </div>
                )}

                {activeStepId === "details" && (
                  <div className="space-y-8">
                    <div>
                      <p className="section-label mb-3">{locale === "he" ? "מקור היהלום" : "Diamond Origin"}</p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {(["lab-grown", "natural"] as const).map((id) => (
                          <Pill key={id} selected={origin === id} onClick={() => setOrigin(id)} className="min-h-24 w-full text-start">
                            <span className="block pe-4">
                              <span className="block text-[0.875rem]">{id === "lab-grown" ? t("conf_origin_lab") : t("conf_origin_nat")}</span>
                              <span className="mt-1 block text-[0.75rem] leading-relaxed text-ink-mute">{id === "lab-grown" ? t("conf_origin_lab_desc") : t("conf_origin_nat_desc")}</span>
                            </span>
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="section-label mb-3">{locale === "he" ? "צבע היהלום" : "Diamond Color"}</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {FANCY_COLOR_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setColor(opt.id)}
                            aria-pressed={color === opt.id}
                            className={`relative flex min-h-16 items-center gap-3 border px-4 py-4 text-start text-[0.875rem] transition-[border-color,background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.98] ${color === opt.id ? "border-ink bg-paper-deep text-ink" : "border-rule text-ink-mute hover:border-ink-mute hover:text-ink-soft"}`}
                          >
                            <SelectionIndicator selected={color === opt.id} />
                            <span className="h-4 w-4 shrink-0 rounded-full border border-rule-soft" style={{ backgroundColor: opt.hex }} />
                            <span>{locale === "he" ? opt.he : opt.en}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="section-label mb-3">{t("conf_clarity")}</p>
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {CLARITY_OPTIONS.map((opt) => (
                          <Pill key={opt.value} selected={clarity === opt.value} onClick={() => setClarity(opt.value)} className="min-h-14 w-full px-2 text-center text-[0.8125rem]">
                            <bdi dir="ltr">{opt.value}</bdi>
                          </Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <nav dir="ltr" aria-label={locale === "he" ? "ניווט בין שלבי העיצוב" : "Design step navigation"} className="atelier-wizard-nav mt-12 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 border-t border-rule pt-7">
                <button
                  type="button"
                  dir={locale === "he" ? "rtl" : "ltr"}
                  onClick={goToPreviousStep}
                  disabled={isFirstStep}
                  className={`min-h-12 px-5 text-[0.875rem] transition-[color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 active:scale-[0.98] ${isFirstStep ? "invisible" : "border border-rule text-ink-soft hover:border-ink-mute hover:text-ink"}`}
                >
                  {wizardCopy.previous}
                </button>
                <button type="button" dir={locale === "he" ? "rtl" : "ltr"} onClick={goToNextStep} className="brass-disc brass-disc--solid min-h-12 w-full justify-center whitespace-nowrap text-[0.875rem] lg:min-h-14 lg:text-[0.9375rem] active:scale-[0.98]">
                  {isFinalStep ? wizardCopy.finish : wizardCopy.next}
                </button>
              </nav>
            </section>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

function MobileOptionPager({
  page,
  pageCount,
  onPageChange,
  locale,
  label,
  children,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  locale: "he" | "en";
  label: string;
  children: React.ReactNode;
}) {
  const touchStartX = useRef<number | null>(null);
  const previousLabel = locale === "he" ? "עמוד קודם" : "Previous page";
  const nextLabel = locale === "he" ? "עמוד הבא" : "Next page";

  function changePage(nextPage: number) {
    onPageChange(Math.max(0, Math.min(pageCount - 1, nextPage)));
  }

  return (
    <div
      className="atelier-option-pager lg:hidden"
      aria-label={label}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = touchStartX.current - endX;
        touchStartX.current = null;
        if (Math.abs(delta) < 40) return;
        const pageDirection = locale === "he" ? -Math.sign(delta) : Math.sign(delta);
        changePage(page + pageDirection);
      }}
    >
      <div key={page} className="atelier-option-page">{children}</div>
      <div className="mt-2.5 flex items-center justify-center gap-3" dir="ltr">
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={page === 0}
          aria-label={previousLabel}
          className="flex h-11 w-11 items-center justify-center text-lg text-ink-soft disabled:opacity-25"
        >
          ‹
        </button>
        <div className="flex items-center" aria-label={`${page + 1} / ${pageCount}`}>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => changePage(index)}
              aria-label={`${locale === "he" ? "עמוד" : "Page"} ${index + 1}`}
              aria-current={page === index ? "page" : undefined}
              className="atelier-page-dot flex h-8 w-8 items-center justify-center"
            >
              <span
                aria-hidden
                className={`block h-2 w-2 rounded-full border border-ink-soft transition-[width,background-color] duration-200 ${page === index ? "w-5 bg-ink-soft" : "bg-transparent"}`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={page === pageCount - 1}
          aria-label={nextLabel}
          className="flex h-11 w-11 items-center justify-center text-lg text-ink-soft disabled:opacity-25"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function AtelierField({
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  dir,
  placeholder,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  dir?: "ltr" | "rtl";
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="section-label mb-3 block">
        {label}
        {required && <span className="ms-1 text-brass">·</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        dir={dir}
        placeholder={placeholder}
        className={`block w-full border-0 border-b bg-transparent py-3 text-[1rem] text-ink placeholder:text-ink-mute focus:outline-none ${
          error ? "border-ink-soft" : "border-rule focus:border-brass"
        }`}
      />
      {error && <p className="mt-2 text-[0.8125rem] italic text-ink-soft">{error}</p>}
    </label>
  );
}

function AtelierSubmitButton() {
  const { t } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="brass-disc brass-disc--solid">
      {pending ? t("inq_sending") : t("col_index_cta_meeting")}
    </button>
  );
}
