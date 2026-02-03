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

    const savedKey = await UserKey.findOne({ userId, provider: "gemini" }).lean();

    if (!savedKey?.encryptedKey) {
      return NextResponse.json(
        { error: "No Gemini API key saved." },
        { status: 400 }
      );
    }

    const apiKey = decrypt(savedKey.encryptedKey).replace(/\s+/g, "");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error?.message || "Failed to list models." },
        { status: response.status }
      );
    }

    const models = (payload?.models || []).map((model) => ({
      name: model?.name?.replace("models/", "") || model?.name,
      displayName: model?.displayName,
      supportedGenerationMethods: model?.supportedGenerationMethods || [],
    }));

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to list models." },
      { status: 500 }
    );
  }
}
