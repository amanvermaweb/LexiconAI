import OpenAI from "openai";

const MODEL_MAP = {
  gpt: "gpt-4o-mini",
  "gpt-4": "gpt-4o-mini",
  "gpt-3.5": "gpt-3.5-turbo",
};

const resolveModel = (model) => {
  if (!model) return MODEL_MAP.gpt;
  if (MODEL_MAP[model]) return MODEL_MAP[model];
  if (model.startsWith("gpt-")) return model;
  return null;
};

export async function createOpenAICompletion({ apiKey, messages, model }) {
  const resolvedModel = resolveModel(model);

  if (!resolvedModel) {
    return {
      error: "Unsupported model. Choose a GPT model for now.",
    };
  }

  try {
    const client = new OpenAI({ apiKey });

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
