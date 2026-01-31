export default function ApiKeyForm({ apiKey, setApiKey }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
        API key
      </label>
      <input
        placeholder="Enter your API key"
        className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/90 dark:placeholder:text-white/40 dark:hover:bg-white/8"
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <p className="mt-2 text-xs text-slate-500 dark:text-white/50">
        Your key stays local and is used for requests you send.
      </p>
    </div>
  );
}
