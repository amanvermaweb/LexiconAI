"use client";
import { useEffect, useSyncExternalStore } from "react";
import {
  THEMES,
  applyTheme,
  getStoredTheme,
  subscribeToTheme,
  setTheme,
  watchSystemTheme,
} from "@/utils/theme";

export default function ThemeToggle() {
  const active = useSyncExternalStore(
    subscribeToTheme,
    () => getStoredTheme(),
    () => "system",
  );

  useEffect(() => {
    applyTheme(active);
  }, [active]);

  useEffect(() => {
    if (active !== "system") return undefined;
    return watchSystemTheme(() => applyTheme("system"));
  }, [active]);

  const select = (theme) => setTheme(theme);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-slate-700 dark:text-white/80">
        Theme
      </p>

  <div className="flex flex-wrap gap-2 rounded-2xl border border-(--border) surface-soft p-2">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => select(theme)}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold capitalize transition hover:cursor-pointer motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0
              ${
                active === theme
                  ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-(--surface-1) dark:text-white/70 border "
              }`}
            value={theme}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
