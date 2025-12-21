"use client";
import { useState } from "react";
import { THEMES, getStoredTheme, setTheme } from "@/utils/theme";

export default function ThemeToggle() {
  const [active, setActive] = useState(getStoredTheme());

  const select = (theme) => {
    setActive(theme);
    setTheme(theme);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Theme</p>

      <div className="flex gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme}
            onClick={() => select(theme)}
            className={`px-3 py-1 rounded border text-sm capitalize
              ${active === theme
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-transparent"
              }`}
          >
            {theme}
          </button>
        ))}
      </div>
    </div>
  );
}
