"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Error({ error, reset }) {
  const { t } = useLocale();

  return (
  <div className="min-h-dvh w-full flex items-center justify-center px-4 py-6 text-slate-900 dark:text-white">
  <div className="w-full max-w-lg rounded-3xl border border-(--border) surface-panel p-10 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
          {t("states.somethingWentWrong")}
        </h2>

        <p className="mt-3 max-w-md mx-auto text-sm text-slate-600 dark:text-white/60">
          {t("states.unexpectedError")}
        </p>

        <button
          onClick={() => reset()}
          className="mt-7 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-700 hover:to-purple-700"
        >
          {t("common.retry")}
        </button>
      </div>
    </div>
  );
}
