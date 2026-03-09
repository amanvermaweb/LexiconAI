"use client";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useModel } from "@/context/ModelContext";

const PROVIDER_LABELS = {
  openai: "OpenAI",
  claude: "Claude",
  perplexity: "Perplexity",
  gemini: "Gemini",
};

const buildFallbackOption = (provider) => ({
  value: provider,
  label: PROVIDER_LABELS[provider] || provider,
  provider,
});

const ModelSelector = () => {
  const { model, setModel } = useModel();
  const { data: session } = useSession();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geminiModels, setGeminiModels] = useState([]);
  const [openAiModels, setOpenAiModels] = useState([]);
  const [claudeModels, setClaudeModels] = useState([]);
  const [perplexityModels, setPerplexityModels] = useState([]);

  useEffect(() => {
    const loadProviders = async () => {
      if (!session?.user) {
        setProviders([]);
        setGeminiModels([]);
        setOpenAiModels([]);
        setClaudeModels([]);
        setPerplexityModels([]);
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

        if (providerList.includes("perplexity")) {
          const perplexityResponse = await fetch("/api/perplexity/models");
          const perplexityPayload = await perplexityResponse.json();

          if (perplexityResponse.ok) {
            const models = (perplexityPayload?.models || []).map((model) => ({
              value: model.id,
              label: model.displayName || model.id,
              provider: "perplexity",
            }));
            setPerplexityModels(models);
          } else {
            setPerplexityModels([]);
          }
        } else {
          setPerplexityModels([]);
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
        setPerplexityModels([]);
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [session?.user]);

  const availableOptions = useMemo(() => {
    if (!providers.length) return [];
    const openAiOptions = providers.includes("openai")
      ? openAiModels.length
        ? openAiModels
        : [buildFallbackOption("openai")]
      : [];
    const claudeOptions = providers.includes("claude")
      ? claudeModels.length
        ? claudeModels
        : [buildFallbackOption("claude")]
      : [];
    const perplexityOptions = providers.includes("perplexity")
      ? perplexityModels.length
        ? perplexityModels
        : [buildFallbackOption("perplexity")]
      : [];
    const geminiOptions = providers.includes("gemini")
      ? geminiModels.length
        ? geminiModels
        : [buildFallbackOption("gemini")]
      : [];
    return [
      ...openAiOptions,
      ...claudeOptions,
      ...perplexityOptions,
      ...geminiOptions,
    ];
  }, [providers, geminiModels, openAiModels, claudeModels, perplexityModels]);

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
  className="w-full rounded-xl border border-(--border) surface-soft p-2 text-zinc-900 outline-none transition hover:bg-(--surface-1) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface-0) dark:text-white hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {availableOptions.length === 0 ? (
        <option className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white" value="">
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
