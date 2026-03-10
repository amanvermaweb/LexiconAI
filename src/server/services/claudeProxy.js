import Anthropic from "@anthropic-ai/sdk";
import {
  createCompletionResult,
  normalizeProviderError,
  resolveRequestedModel,
} from "@/server/services/providerUtils";

const GENERIC_MODELS = new Set(["", "claude", "claude-3"]);

export async function listClaudeModels(apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/models", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || "Failed to list Claude models.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return (payload?.data || [])
    .map((model) => ({
      id: model?.id,
      displayName: model?.display_name || model?.id,
    }))
    .filter((model) => model.id);
}

const resolveModel = async (apiKey, model) => {
  return resolveRequestedModel({
    apiKey,
    model,
    genericModels: GENERIC_MODELS,
    listModels: listClaudeModels,
  });
};

const mapMessages = (messages) =>
  (messages || [])
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));

export async function createClaudeCompletion({ apiKey, messages, model }) {
  try {
    const resolvedModel = await resolveModel(apiKey, model);

    if (!resolvedModel) {
      return { error: "Unable to resolve a Claude model right now." };
    }

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: resolvedModel,
      max_tokens: 1024,
      messages: mapMessages(messages),
    });

    return createCompletionResult(response?.content?.[0]?.text);
  } catch (error) {
    return normalizeProviderError(error);
  }
}
