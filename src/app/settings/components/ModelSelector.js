import React from "react";

export default function ModelSelector({ defaultModel, setDefaultModel }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
        Default model
      </label>
      <select
        className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/8 dark:focus-visible:ring-offset-zinc-950 hover:cursor-pointer"
        value={defaultModel}
        onChange={(e) => setDefaultModel(e.target.value)}
      >
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="gpt-4"
        >
          GPT-4
        </option>
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="gpt-3.5"
        >
          GPT-3.5 Turbo
        </option>
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="claude-3"
        >
          Claude-3
        </option>
        <option
          className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
          value="perplexity"
        >
          Perplexity
        </option>
      </select>
    </div>
  );
}
