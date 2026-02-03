import Anthropic from "@anthropic-ai/sdk";

const resolveModel = (model) => {
  if (!model) return "claude-3-5-sonnet-20240620";
  return model;
};

const mapMessages = (messages) =>
  (messages || [])
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));

export async function createClaudeCompletion({ apiKey, messages, model }) {
  const resolvedModel = resolveModel(model);

  try {
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
