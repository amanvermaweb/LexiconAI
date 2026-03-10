import {
  createOpenAICompatibleCompletion,
  listOpenAICompatibleModels,
  resolveRequestedModel,
} from "@/server/services/providerUtils";

const DEFAULT_MODEL = "gpt-4o-mini";
const GENERIC_MODELS = new Set(["", "openai", "gpt", "gpt-4", "gpt-3.5"]);
const CHAT_MODEL_PATTERNS = [/^gpt-/, /^chatgpt-/, /^o\d/];

const isChatCapableModel = (id) =>
  CHAT_MODEL_PATTERNS.some((pattern) => pattern.test(id));

export async function listOpenAIModels(apiKey) {
  return listOpenAICompatibleModels({
    apiKey,
    filterModel: isChatCapableModel,
  });
}

const resolveModel = async (apiKey, model) => {
  return resolveRequestedModel({
    apiKey,
    model,
    genericModels: GENERIC_MODELS,
    listModels: listOpenAIModels,
    fallbackModel: DEFAULT_MODEL,
  });
};

export async function createOpenAICompletion({ apiKey, messages, model }) {
  return createOpenAICompatibleCompletion({
    apiKey,
    messages,
    model,
    resolveModel,
  });
}
