import OpenAI from "openai";

const OPENAI_COMPATIBLE_PROVIDERS = {
  openai: null,
  perplexity: "https://api.perplexity.ai",
};

export async function validateKey(apiKey, provider = "openai") {
  if (!apiKey) {
    return {
      valid: false,
      error: "API key missing",
    };
  }

  if (!(provider in OPENAI_COMPATIBLE_PROVIDERS)) {
    return {
      valid: true,
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
      ...(OPENAI_COMPATIBLE_PROVIDERS[provider]
        ? { baseURL: OPENAI_COMPATIBLE_PROVIDERS[provider] }
        : {}),
    });

    await client.models.list();

    return {
      valid: true,
    };
  } catch (error) {
    if (error?.status === 401) {
      return {
        valid: false,
        error: "Invalid API key",
      };
    }

    return {
      valid: false,
      error: "Key validation failed",
    };
  }
}
