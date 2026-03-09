import { createModelRoute } from "@/server/lib/createModelRoute";
import { listGeminiModels } from "@/server/services/geminiProxy";

const transformGeminiModels = (models) =>
  models.map((model) => ({
    name: model?.name?.replace("models/", "") || model?.name,
    displayName: model?.displayName,
    supportedGenerationMethods: model?.supportedGenerationMethods || [],
  }));

export const GET = createModelRoute({
  provider: "gemini",
  listModels: listGeminiModels,
  transformModels: transformGeminiModels,
  missingKeyMessage: "No Gemini API key saved.",
  failureMessage: "Failed to list models.",
});
