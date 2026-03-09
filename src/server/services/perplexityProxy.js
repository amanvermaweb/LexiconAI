import OpenAI from "openai";

const BASE_URL = "https://api.perplexity.ai";
const DEFAULT_MODEL = "sonar";
const GENERIC_MODELS = new Set(["", "perplexity", "sonar"]);

export async function listPerplexityModels(apiKey) {
  const client = new OpenAI({
    apiKey,
    baseURL: BASE_URL,
  });

  const response = await client.models.list();

  return (response?.data || [])
    .map((model) => model?.id)
    .filter(Boolean)
    .filter((id) => id.startsWith("sonar"))
    .map((id) => ({
      id,
      displayName: id,
    }));
}

const resolveModel = async (apiKey, model) => {
  if (model && !GENERIC_MODELS.has(model)) {
    return model;
  }

  const models = await listPerplexityModels(apiKey);
  return models[0]?.id || DEFAULT_MODEL;
};

export async function createPerplexityCompletion({ apiKey, messages, model }) {
  try {
    const resolvedModel = await resolveModel(apiKey, model);
    const client = new OpenAI({
      apiKey,
      baseURL: BASE_URL,
    });

    const completion = await client.chat.completions.create({
      model: resolvedModel,
      messages,
      temperature: 0.7,
    });

    const content = completion?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return { error: "No response returned from model." };
    }

    return { content };
  } catch (error) {
    if (error?.status === 401) {
      return { error: "Invalid API key." };
    }
    return { error: error?.message || "Model request failed." };
  }
}