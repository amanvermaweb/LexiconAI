import {
  createOpenAICompatibleCompletion,
  listOpenAICompatibleModels,
  resolveRequestedModel,
} from "@/server/services/providerUtils";

const BASE_URL = "https://api.perplexity.ai";
const DEFAULT_MODEL = "sonar";
const GENERIC_MODELS = new Set(["", "perplexity", "sonar"]);

export async function listPerplexityModels(apiKey) {
  return listOpenAICompatibleModels({
    apiKey,
    baseURL: BASE_URL,
    filterModel: (id) => id.startsWith("sonar"),
  });
}

const resolveModel = async (apiKey, model) => {
  return resolveRequestedModel({
    apiKey,
    model,
    genericModels: GENERIC_MODELS,
    listModels: listPerplexityModels,
    fallbackModel: DEFAULT_MODEL,
  });
};

export async function createPerplexityCompletion({ apiKey, messages, model }) {
  return createOpenAICompatibleCompletion({
    apiKey,
    baseURL: BASE_URL,
    messages,
    model,
    resolveModel,
  });
}