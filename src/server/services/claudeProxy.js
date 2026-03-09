import Anthropic from "@anthropic-ai/sdk";

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
  if (model && !GENERIC_MODELS.has(model)) {
    return model;
  }

  const models = await listClaudeModels(apiKey);
  return models[0]?.id || null;
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

    const content = response?.content?.[0]?.text?.trim();

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
