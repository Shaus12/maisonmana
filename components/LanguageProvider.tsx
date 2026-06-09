"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Locale, type StringKey, strings } from "@/lib/i18n";

// ─────────────────────────────────────────────────────────────

type LanguageContextValue = {
  locale: Locale;
  toggle: () => void;
  t: (key: StringKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("he");

  // Restore saved preference
  useEffect(() => {
    const saved = localStorage.getItem("mm-locale");
    if (saved === "he" || saved === "en") setLocale(saved);
  }, []);

  // Sync dir attribute + save
  useEffect(() => {
    document.documentElement.setAttribute("dir", locale === "he" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", locale);
    localStorage.setItem("mm-locale", locale);
  }, [locale]);

  const toggle = useCallback(
    () => setLocale((prev) => (prev === "en" ? "he" : "en")),
    []
  );

  const t = useCallback(
    (key: StringKey) => strings[locale][key] ?? strings.en[key],
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
