const MODEL_MAP = {
  gemini: "gemini-2.5-flash",
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-pro": "gemini-2.5-pro",
  "gemini-2.0-flash": "gemini-2.0-flash",
  "gemini-2.0-flash-lite": "gemini-2.0-flash-lite",
};

const resolveModel = (model) => {
  if (!model) return MODEL_MAP.gemini;
  if (MODEL_MAP[model]) return MODEL_MAP[model];
  if (model.startsWith("gemini-")) return model;
  return null;
};

const mapMessages = (messages) =>
  (messages || []).map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const listGeminiModels = async (apiKey) => {
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

const pickListedModel = (models = []) => {
  const candidates = models
    .filter((model) => model?.supportedGenerationMethods?.includes("generateContent"))
    .map((model) => model?.name?.replace("models/", ""))
    .filter(Boolean);

  return (
    candidates.find((name) => name.includes("gemini-1.5")) ||
    candidates[0] ||
    null
  );
};

export async function createGeminiCompletion({ apiKey, messages, model }) {
  const resolvedModel = resolveModel(model);

  if (!resolvedModel) {
    return { error: "Unsupported model. Choose a Gemini model." };
  }

  try {
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
      for (const fallback of FALLBACK_MODELS) {
        if (fallback === activeModel) continue;
        try {
          activeModel = fallback;
          content = await runCompletion(activeModel);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
        }
      }
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
