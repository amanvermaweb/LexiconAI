import { NextResponse } from "next/server";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";
import { getDecryptedUserKey } from "@/server/lib/userKeys";

/**
 * Creates a provider-specific model listing handler with consistent auth,
 * key lookup, and error handling.
 */
export function createModelRoute({
  provider,
  listModels,
  failureMessage,
  transformModels = (models) => models,
  missingKeyMessage,
}) {
  return async function GET() {
    try {
      const { userId } = await requireSessionUser();
      const { apiKey } = await getDecryptedUserKey({
        userId,
        provider,
        missingMessage: missingKeyMessage,
      });

      const models = await listModels(apiKey);

      return NextResponse.json({
        models: transformModels(models),
      });
    } catch (error) {
      return toErrorResponse(error, failureMessage);
    }
  };
}