const GENERIC_MODELS = new Set(["", "gemini"]);

const mapMessages = (messages) =>
  (messages || []).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

export const listGeminiModels = async (apiKey) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.message || "Failed to list Gemini models.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload?.models || [];
};

const normalizeModelName = (model) => model?.name?.replace("models/", "") || model?.name;

export const pickListedModel = (models = []) => {
  const candidates = models
    .filter((model) => model?.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => normalizeModelName(model))
    .filter(Boolean);

  return candidates[0] || null;
};

const resolveModel = async (apiKey, model) => {
  if (model && !GENERIC_MODELS.has(model)) {
    return model;
  }

  const models = await listGeminiModels(apiKey);
  return pickListedModel(models);
};

export async function createGeminiCompletion({ apiKey, messages, model }) {
  try {
    const resolvedModel = await resolveModel(apiKey, model);

    if (!resolvedModel) {
      return { error: "Unable to resolve a Gemini model right now." };
    }

    const contents = mapMessages(messages);
    let activeModel = resolvedModel;
    let content = null;
    let lastError = null;

    const runCompletion = async (modelName) => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          payload?.error?.message ||
          `Gemini request failed for ${modelName}.`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text?.trim();
    };

    try {
      content = await runCompletion(activeModel);
    } catch (error) {
      lastError = error;
    }

    if (!content) {
      try {
        const models = await listGeminiModels(apiKey);
        const listedModel = pickListedModel(models);
        if (listedModel && listedModel !== activeModel) {
          activeModel = listedModel;
          content = await runCompletion(activeModel);
          lastError = null;
        }
      } catch (error) {
        lastError = error;
      }
    }

    if (!content) {
      return {
        error: lastError?.message || "No response returned from model.",
      };
    }

    return { content };
  } catch (error) {
    if (error?.status === 401) {
      return { error: "Invalid API key." };
    }
    return { error: error?.message || "Model request failed." };
  }
}
