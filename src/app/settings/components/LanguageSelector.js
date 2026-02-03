
const LanguageSelector = () => {
  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 dark:text-white/80 mb-2">
        Language
      </label>
  <select className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-zinc-900 outline-none transition hover:bg-(--surface-1) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface-0) dark:text-white hover:cursor-pointer">
        <option className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white" value="english">
          English
        </option>
        <option className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white" value="spanish">
          Spanish
        </option>
        <option className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white" value="french">
          French
        </option>
        <option className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white" value="german">
          German
        </option>
      </select>
    </div>
  );
};

export default LanguageSelector;
