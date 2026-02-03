import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";
import { decrypt } from "@/server/lib/crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const savedKey = await UserKey.findOne({ userId, provider: "claude" }).lean();

    if (!savedKey?.encryptedKey) {
      return NextResponse.json(
        { error: "No Claude API key saved." },
        { status: 400 }
      );
    }

    const apiKey = decrypt(savedKey.encryptedKey).replace(/\s+/g, "");

    const response = await fetch("https://api.anthropic.com/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message || "Failed to list Claude models." },
        { status: response.status }
      );
    }

    const models = (payload?.data || [])
      .map((model) => ({
        id: model?.id,
        displayName: model?.display_name || model?.id,
      }))
      .filter((model) => model.id);

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to list Claude models." },
      { status: 500 }
    );
  }
}
