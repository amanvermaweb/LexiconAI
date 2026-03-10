"use client";

import { useLocale } from "@/context/LocaleContext";

const LanguageSelector = () => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 dark:text-white/80 mb-2">
        {t("settings.language")}
      </label>
      <select
        className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-zinc-900 outline-none transition hover:bg-(--surface-1) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface-0) dark:text-white hover:cursor-pointer"
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
      >
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="en"
        >
          {t("settings.english")}
        </option>
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="hi"
        >
          {t("settings.hindi")}
        </option>
      </select>
    </div>
  );
};

export default LanguageSelector;
