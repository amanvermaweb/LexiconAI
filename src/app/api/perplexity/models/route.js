import { createModelRoute } from "@/server/lib/createModelRoute";
import { listPerplexityModels } from "@/server/services/perplexityProxy";

export const GET = createModelRoute({
  provider: "perplexity",
  listModels: listPerplexityModels,
  missingKeyMessage: "No Perplexity API key saved.",
  failureMessage: "Failed to list Perplexity models.",
});