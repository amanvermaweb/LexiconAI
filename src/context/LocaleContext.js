"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getStoredLocale,
  LOCALE_STORAGE_KEY,
  normalizeLocale,
  translate,
} from "@/utils/i18n";

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => getStoredLocale());

  useEffect(() => {
    const nextLocale = normalizeLocale(locale);
    localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  }, [locale]);

  const setLocale = (value) => {
    setLocaleState(normalizeLocale(value));
  };

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key, variables) => translate(locale, key, variables),
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider");
  }

  return context;
}