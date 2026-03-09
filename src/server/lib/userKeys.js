import { connectDB } from "@/server/lib/mongodb";
import { decrypt } from "@/server/lib/crypto";
import UserKey from "@/server/models/UserKey";
import { getProviderLabel, normalizeApiKey } from "@/server/lib/providers";
import { createHttpError } from "@/server/lib/request";

export async function getDecryptedUserKey({ userId, provider, missingMessage }) {
  await connectDB();

  const savedKey = await UserKey.findOne({ userId, provider }).lean();

  if (!savedKey?.encryptedKey) {
    throw createHttpError(
      missingMessage || `No ${getProviderLabel(provider)} API key saved.`,
      400
    );
  }

  return {
    apiKey: normalizeApiKey(decrypt(savedKey.encryptedKey)),
    savedKey,
  };
}