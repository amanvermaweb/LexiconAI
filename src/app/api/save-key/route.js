import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import { encrypt } from "@/server/lib/crypto";
import { validateKey } from "@/server/lib/validateKey";
import UserKey from "@/server/models/UserKey";
import {
  readJsonBody,
  requireSessionUser,
  toErrorResponse,
} from "@/server/lib/request";
import { parseProviderInput } from "@/server/lib/validation";

export async function POST(request) {
  try {
    const { userId } = await requireSessionUser();

    const body = await readJsonBody(request);
    const { apiKey, provider } = parseProviderInput(body, {
      requireApiKey: true,
    });

    let warning = null;

    if (["openai", "perplexity"].includes(provider)) {
      const validation = await validateKey(apiKey, provider);
      if (!validation?.valid) {
        warning = validation?.error || "Unable to validate API key right now.";
      }
    }

    await connectDB();

    const encryptedKey = encrypt(apiKey);
    const lastFour = apiKey.slice(-4);

    await UserKey.findOneAndUpdate(
      { userId, provider },
      { encryptedKey, lastFour },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      provider,
      message: "API key saved.",
      lastFour,
      warning,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to save API key.");
  }
}
