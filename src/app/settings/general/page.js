"use client";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSelector from "../components/LanguageSelector";
import { useLocale } from "@/context/LocaleContext";

const GeneralPage = () => {
  const { t } = useLocale();

  return (
  <div className="space-y-8 p-4 sm:p-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {t("settings.general")}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-white/60">
          {t("settings.generalDescription")}
        </p>
      </div>

  <section className="rounded-3xl border border-(--border) surface-card p-5 space-y-4">
        <ThemeToggle />
        <LanguageSelector />
      </section>
    </div>
  );
};

export default GeneralPage;
