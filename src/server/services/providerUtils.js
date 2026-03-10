import OpenAI from "openai";

const DEFAULT_COMPLETION_ERROR = "Model request failed.";
const EMPTY_COMPLETION_ERROR = "No response returned from model.";
const INVALID_KEY_ERROR = "Invalid API key.";

export async function resolveRequestedModel({
  apiKey,
  model,
  genericModels,
  listModels,
  pickModel = (models) => models[0]?.id || null,
  fallbackModel = null,
}) {
  if (model && !genericModels.has(model)) {
    return model;
  }

  const models = await listModels(apiKey);
  return pickModel(models) || fallbackModel;
}

export function normalizeProviderError(error, fallbackMessage = DEFAULT_COMPLETION_ERROR) {
  if (error?.status === 401) {
    return { error: INVALID_KEY_ERROR };
  }

  return { error: error?.message || fallbackMessage };
}

export function createCompletionResult(content) {
  const normalizedContent = content?.trim();

  if (!normalizedContent) {
    return { error: EMPTY_COMPLETION_ERROR };
  }

  return { content: normalizedContent };
}

export async function listOpenAICompatibleModels({
  apiKey,
  baseURL,
  filterModel = () => true,
  mapModel = (id) => ({ id, displayName: id }),
}) {
  const client = new OpenAI({ apiKey, baseURL });
  const response = await client.models.list();

  return (response?.data || [])
    .map((model) => model?.id)
    .filter(Boolean)
    .filter((id) => filterModel(id))
    .map((id) => mapModel(id));
}

export async function createOpenAICompatibleCompletion({
  apiKey,
  baseURL,
  messages,
  model,
  resolveModel,
  temperature = 0.7,
}) {
  try {
    const resolvedModel = await resolveModel(apiKey, model);
    const client = new OpenAI({ apiKey, baseURL });
    const completion = await client.chat.completions.create({
      model: resolvedModel,
      messages,
      temperature,
    });

    return createCompletionResult(completion?.choices?.[0]?.message?.content);
  } catch (error) {
    return normalizeProviderError(error);
  }
}