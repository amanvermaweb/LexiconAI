"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useModel } from "@/context/ModelContext";

const MODEL_OPTIONS = [
  { value: "gpt", label: "GPT", provider: "openai" },
  { value: "claude", label: "Claude", provider: "claude" },
  { value: "perplexity", label: "Perplexity", provider: "perplexity" },
  { value: "gemini-1.5-flash-latest", label: "Gemini 1.5 Flash", provider: "gemini" },
  { value: "gemini-1.5-pro-latest", label: "Gemini 1.5 Pro", provider: "gemini" },
];

const ModelSelector = () => {
  const { model, setModel } = useModel();
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
      setModel("");
      return;
    }
    if (!availableOptions.some((option) => option.value === model)) {
      setModel(availableOptions[0].value);
    }
  }, [availableOptions, model, setModel]);

  return (
    <select
      value={model}
      onChange={(e) => setModel(e.target.value)}
      disabled={!availableOptions.length}
      className="w-full rounded-xl border border-zinc-300 bg-white p-2 text-zinc-900 outline-none transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/8 dark:focus-visible:ring-offset-zinc-950 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
  );
};

export default ModelSelector;
