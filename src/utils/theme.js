export const THEMES = ["light", "dark", "system"];

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "system";
  return localStorage.getItem("theme") || "system";
};

export const getSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

export const applyTheme = (theme) => {
  const resolved =
    theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle(
    "dark",
    resolved === "dark"
  );
};

export const setTheme = (theme) => {
  localStorage.setItem("theme", theme);
  applyTheme(theme);
};
