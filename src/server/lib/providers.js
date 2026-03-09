export const SUPPORTED_PROVIDERS = ["openai", "claude", "perplexity", "gemini"];

const PROVIDER_LABELS = {
  openai: "OpenAI",
  claude: "Claude",
  perplexity: "Perplexity",
  gemini: "Gemini",
};

export function normalizeProvider(provider) {
  return provider?.toLowerCase()?.trim() || "";
}

export function isSupportedProvider(provider) {
  return SUPPORTED_PROVIDERS.includes(normalizeProvider(provider));
}

export function getProviderLabel(provider) {
  return PROVIDER_LABELS[normalizeProvider(provider)] || provider;
}

export function normalizeApiKey(apiKey) {
  return apiKey?.replace(/\s+/g, "").trim() || "";
}

export function resolveProviderFromModel(model) {
  const normalizedModel = model?.trim() || "";

  if (!normalizedModel) {
    return "openai";
  }

  if (normalizedModel.startsWith("gemini")) {
    return "gemini";
  }

  if (normalizedModel.startsWith("claude")) {
    return "claude";
  }

  if (normalizedModel.startsWith("sonar") || normalizedModel === "perplexity") {
    return "perplexity";
  }

  return "openai";
}