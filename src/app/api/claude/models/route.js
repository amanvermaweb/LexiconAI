import { createModelRoute } from "@/server/lib/createModelRoute";
import { listClaudeModels } from "@/server/services/claudeProxy";

export const GET = createModelRoute({
  provider: "claude",
  listModels: listClaudeModels,
  missingKeyMessage: "No Claude API key saved.",
  failureMessage: "Failed to list Claude models.",
});
