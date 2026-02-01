"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

const MODEL_OPTIONS = [
  { value: "gpt-4", label: "GPT-4", provider: "openai" },
  { value: "gpt-3.5", label: "GPT-3.5 Turbo", provider: "openai" },
  { value: "claude-3", label: "Claude-3", provider: "claude" },
  { value: "perplexity", label: "Perplexity", provider: "perplexity" },
  { value: "gemini-1.5-flash-latest", label: "Gemini 1.5 Flash", provider: "gemini" },
  { value: "gemini-1.5-pro-latest", label: "Gemini 1.5 Pro", provider: "gemini" },
];

export default function ModelSelector({ defaultModel, setDefaultModel }) {
  const { data: session } = useSession();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      if (!session?.user) {
        setProviders([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/keys");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load providers.");
        }

        setProviders((payload?.providers || []).map((entry) => entry.provider));
      } catch (error) {
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [session?.user]);

  const availableOptions = useMemo(() => {
    if (!providers.length) return [];
    return MODEL_OPTIONS.filter((option) => providers.includes(option.provider));
  }, [providers]);

  useEffect(() => {
    if (!availableOptions.length) {
      setDefaultModel("");
      return;
    }
    if (!availableOptions.some((option) => option.value === defaultModel)) {
      setDefaultModel(availableOptions[0].value);
    }
  }, [availableOptions, defaultModel, setDefaultModel]);

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
        Default model
      </label>
      <select
        className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/8 dark:focus-visible:ring-offset-zinc-950 hover:cursor-pointer"
        value={defaultModel}
        onChange={(e) => setDefaultModel(e.target.value)}
        disabled={!availableOptions.length}
      >
        {availableOptions.length === 0 ? (
          <option
            className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            value=""
          >
            {loading ? "Loading models..." : "Save an API key to enable models"}
          </option>
        ) : (
          availableOptions.map((option) => (
            <option
              key={option.value}
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
              value={option.value}
            >
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
