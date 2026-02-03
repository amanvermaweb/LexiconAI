"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

const MODEL_OPTIONS = [
  { value: "gpt-4", label: "GPT-4", provider: "openai" },
  { value: "gpt-3.5", label: "GPT-3.5 Turbo", provider: "openai" },
  { value: "claude-3", label: "Claude-3", provider: "claude" },
  { value: "perplexity", label: "Perplexity", provider: "perplexity" },
];

export default function ModelSelector({ defaultModel, setDefaultModel }) {
  const { data: session } = useSession();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geminiModels, setGeminiModels] = useState([]);
  const [openAiModels, setOpenAiModels] = useState([]);
  const [claudeModels, setClaudeModels] = useState([]);

  useEffect(() => {
    const loadProviders = async () => {
      if (!session?.user) {
        setProviders([]);
        setGeminiModels([]);
        setOpenAiModels([]);
        setClaudeModels([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/keys");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Unable to load providers.");
        }

        const providerList = (payload?.providers || []).map((entry) => entry.provider);
        setProviders(providerList);

        if (providerList.includes("openai")) {
          const openAiResponse = await fetch("/api/openai/models");
          const openAiPayload = await openAiResponse.json();

          if (openAiResponse.ok) {
            const models = (openAiPayload?.models || []).map((model) => ({
              value: model.id,
              label: model.displayName || model.id,
              provider: "openai",
            }));
            setOpenAiModels(models);
          } else {
            setOpenAiModels([]);
          }
        } else {
          setOpenAiModels([]);
        }

        if (providerList.includes("claude")) {
          const claudeResponse = await fetch("/api/claude/models");
          const claudePayload = await claudeResponse.json();

          if (claudeResponse.ok) {
            const models = (claudePayload?.models || []).map((model) => ({
              value: model.id,
              label: model.displayName || model.id,
              provider: "claude",
            }));
            setClaudeModels(models);
          } else {
            setClaudeModels([]);
          }
        } else {
          setClaudeModels([]);
        }

        if (providerList.includes("gemini")) {
          const modelResponse = await fetch("/api/gemini/models");
          const modelPayload = await modelResponse.json();

          if (!modelResponse.ok) {
            throw new Error(modelPayload?.error || "Unable to load Gemini models.");
          }

          const models = (modelPayload?.models || [])
            .filter((model) => model?.supportedGenerationMethods?.includes("generateContent"))
            .map((model) => ({
              value: model.name,
              label: model.displayName || model.name,
              provider: "gemini",
            }));

          setGeminiModels(models);
        } else {
          setGeminiModels([]);
        }
      } catch (error) {
        setProviders([]);
        setGeminiModels([]);
        setOpenAiModels([]);
        setClaudeModels([]);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [session?.user]);

  const availableOptions = useMemo(() => {
    if (!providers.length) return [];
    const baseOptions = MODEL_OPTIONS.filter((option) => providers.includes(option.provider));
    const openAiOptions = providers.includes("openai")
      ? openAiModels.length
        ? openAiModels
        : baseOptions.filter((option) => option.provider === "openai")
      : [];
    const claudeOptions = providers.includes("claude")
      ? claudeModels.length
        ? claudeModels
        : baseOptions.filter((option) => option.provider === "claude")
      : [];
    const geminiOptions = providers.includes("gemini") ? geminiModels : [];
    const otherOptions = baseOptions.filter(
      (option) => !["openai", "claude"].includes(option.provider)
    );
    return [...otherOptions, ...openAiOptions, ...claudeOptions, ...geminiOptions];
  }, [providers, geminiModels, openAiModels, claudeModels]);

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
        className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-zinc-900 outline-none transition hover:bg-(--surface-1) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface-0) dark:text-white hover:cursor-pointer"
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
