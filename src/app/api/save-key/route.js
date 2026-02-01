import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import { encrypt } from "@/server/lib/crypto";
import { validateKey } from "@/server/lib/validateKey";
import UserKey from "@/server/models/UserKey";

const PROVIDERS = ["openai", "claude", "perplexity", "gemini"];

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const apiKey = body?.apiKey
      ? body.apiKey.replace(/\s+/g, "").trim()
      : null;
    const provider = body?.provider?.toLowerCase()?.trim();

    if (!apiKey || !provider) {
      return NextResponse.json(
        { error: "Provider and API key are required." },
        { status: 400 }
      );
    }

    if (!PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: "Unsupported provider." },
        { status: 400 }
      );
    }

    if (provider === "openai") {
      const validation = await validateKey(apiKey);
      if (!validation?.valid) {
        return NextResponse.json(
          { error: validation?.error || "Invalid API key." },
          { status: 400 }
        );
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to save API key." },
      { status: 500 }
    );
  }
}
