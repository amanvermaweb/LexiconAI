import { createModelRoute } from "@/server/lib/createModelRoute";
import { listOpenAIModels } from "@/server/services/openaiProxy";

export const GET = createModelRoute({
  provider: "openai",
  listModels: listOpenAIModels,
  missingKeyMessage: "No OpenAI API key saved.",
  failureMessage: "Failed to list OpenAI models.",
});
