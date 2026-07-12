"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitInquiry, type InquiryState } from "@/app/inquiry/actions";
import { useLanguage } from "@/components/LanguageProvider";
import type { StringKey } from "@/lib/i18n";

type Props = {
  presetPiece?: string;
  presetBespoke?: string;
};

const initial: InquiryState = { status: "idle" };

export function InquirySheet({ presetPiece, presetBespoke }: Props) {
  const { t } = useLanguage();
  const [state, action] = useActionState(submitInquiry, initial);
  const [intent, setIntent] = useState<"viewing" | "bespoke" | "general">(
    presetBespoke ? "bespoke" : presetPiece ? "viewing" : "general"
  );

  const errorText = (code: string) => t(code as StringKey);

  if (state.status === "ok") {
    return (
      <div className="vellum mx-auto max-w-2xl px-8 py-20 text-center md:px-16 md:py-24">
        <div className="monogram mx-auto" aria-hidden>
          MM
        </div>
        <h2 className="display-he mt-10 text-[2.25rem] leading-[1.15] text-ink md:text-[2.75rem]">
          {t("inq_success_title")}
        </h2>
        <p className="mt-6 text-ink-soft text-[1.0625rem] leading-relaxed">
          {t("inq_success_body")}{" "}
          <a href="tel:+972507099933" className="underline font-bold text-ink" dir="ltr">
            +972 50-709-9933
          </a>
          .
        </p>
        <p className="mt-10 text-[0.6875rem] tracking-[0.18em] uppercase text-ink-mute display-lat">
          Reference&nbsp;·&nbsp;<bdi dir="ltr">{state.reference}</bdi>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="vellum mx-auto max-w-3xl px-6 py-12 md:px-14 md:py-16">
      <header className="mb-10 flex items-baseline justify-between">
        <div>
          <p className="section-label">{t("inq_sheet_label")}</p>
          <h2 className="display-he mt-3 text-[1.875rem] leading-[1.1] text-ink md:text-[2.25rem]">
            {t("inq_sheet_heading")}
          </h2>
        </div>
        <span className="monogram hidden md:inline-grid" aria-hidden>MM</span>
      </header>

      {/* Intent */}
      <fieldset className="mb-10">
        <legend className="section-label mb-4">{t("inq_type_legend")}</legend>
        <div className="flex flex-wrap gap-3" role="radiogroup">
          {([
            { id: "viewing", labelKey: "inq_type_viewing" },
            { id: "bespoke", labelKey: "inq_type_bespoke" },
            { id: "general", labelKey: "inq_type_general" },
          ] as const).map((opt) => (
            <label
              key={opt.id}
              className={`cursor-pointer border px-5 py-3 text-[0.9375rem] transition-colors duration-[280ms] ${
                intent === opt.id ? "border-brass bg-paper text-ink" : "border-rule text-ink-soft hover:border-ink-mute"
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={opt.id}
                className="sr-only"
                checked={intent === opt.id}
                onChange={() => setIntent(opt.id)}
              />
              {t(opt.labelKey)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Preset context, if arriving from a piece or atelier */}
      {presetPiece && (
        <input type="hidden" name="piece" value={presetPiece} />
      )}
      {presetBespoke && (
        <input type="hidden" name="bespoke" value={presetBespoke} />
      )}
      {(presetPiece || presetBespoke) && (
        <div className="mb-8 border-s-2 border-brass bg-paper px-5 py-4 text-[0.875rem] text-ink-soft">
          {presetPiece && <p>{t("inq_preset_piece")} <span className="text-ink">{presetPiece}</span></p>}
          {presetBespoke && <p>{t("inq_preset_bespoke")} <span className="text-ink">{presetBespoke}</span></p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        <Field
          name="name"
          label={t("inq_field_name")}
          required
          autoComplete="name"
          error={state.status === "error" && state.field === "name" ? errorText(state.message) : undefined}
        />
        <Field
          name="phone"
          label={t("inq_field_phone")}
          inputMode="tel"
          autoComplete="tel"
          dir="ltr"
          error={state.status === "error" && state.field === "phone" ? errorText(state.message) : undefined}
        />
        <Field
          name="email"
          label={t("inq_field_email")}
          type="email"
          autoComplete="email"
          dir="ltr"
          error={state.status === "error" && state.field === "email" ? errorText(state.message) : undefined}
        />
        <Field
          name="preferred"
          label={t("inq_field_preferred")}
          placeholder={t("inq_ph_preferred")}
        />
      </div>

      <div className="mt-10">
        <label className="block">
          <span className="section-label mb-3 block">{t("inq_field_notes")}</span>
          <textarea
            name="message"
            rows={5}
            placeholder={t("inq_ph_notes")}
            className="block w-full resize-y border-0 border-b border-rule bg-transparent py-3 text-[1rem] leading-relaxed text-ink placeholder:text-ink-mute focus:border-brass focus:outline-none"
          />
        </label>
      </div>

      {state.status === "error" && !state.field && (
        <p className="mt-6 text-[0.875rem] italic text-ink-soft">{errorText(state.message)}</p>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
        <p className="text-[0.75rem] text-ink-mute max-w-md leading-relaxed">
          {t("inq_privacy")}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}

function Field({
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

function SubmitButton() {
  const { t } = useLanguage();
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="brass-disc brass-disc--solid">
      {pending ? t("inq_sending") : t("conf_send")}
    </button>
  );
}
