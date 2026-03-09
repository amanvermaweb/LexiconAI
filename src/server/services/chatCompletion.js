import { createClaudeCompletion } from "@/server/services/claudeProxy";
import { createGeminiCompletion } from "@/server/services/geminiProxy";
import { createOpenAICompletion } from "@/server/services/openaiProxy";
import { createPerplexityCompletion } from "@/server/services/perplexityProxy";

const COMPLETION_CREATORS = {
  openai: createOpenAICompletion,
  perplexity: createPerplexityCompletion,
  gemini: createGeminiCompletion,
  claude: createClaudeCompletion,
};

export async function createChatCompletion({ provider, ...options }) {
  const createCompletion = COMPLETION_CREATORS[provider];

  if (!createCompletion) {
    return {
      error: `Provider ${provider} is not supported yet.`,
    };
  }

  return createCompletion(options);
}