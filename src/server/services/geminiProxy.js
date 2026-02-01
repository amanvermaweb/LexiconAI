import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_MAP = {
  gemini: "gemini-1.5-flash-latest",
  "gemini-1.5-flash": "gemini-1.5-flash-latest",
  "gemini-1.5-pro": "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest": "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest": "gemini-1.5-pro-latest",
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
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
];

export async function createGeminiCompletion({ apiKey, messages, model }) {
  const resolvedModel = resolveModel(model);

  if (!resolvedModel) {
    return { error: "Unsupported model. Choose a Gemini model." };
  }

  try {
    const client = new GoogleGenerativeAI(apiKey);
    const contents = mapMessages(messages);
    let activeModel = resolvedModel;

    const runCompletion = async (modelName) => {
      const geminiModel = client.getGenerativeModel({ model: modelName });
      const result = await geminiModel.generateContent({ contents });
      return result?.response?.text?.();
    };

    let content = null;
    let lastError = null;

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
      return {
        error:
          lastError?.message || "No response returned from model.",
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
