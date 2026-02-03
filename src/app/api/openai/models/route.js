import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
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

    const savedKey = await UserKey.findOne({ userId, provider: "openai" }).lean();

    if (!savedKey?.encryptedKey) {
      return NextResponse.json(
        { error: "No OpenAI API key saved." },
        { status: 400 }
      );
    }

    const apiKey = decrypt(savedKey.encryptedKey).replace(/\s+/g, "");
    const client = new OpenAI({ apiKey });
    const response = await client.models.list();
    const models = (response?.data || [])
      .map((model) => model?.id)
      .filter(Boolean)
      .filter((id) => id.startsWith("gpt-") || id.startsWith("o1"))
      .map((id) => ({
        id,
        displayName: id,
      }));

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to list OpenAI models." },
      { status: 500 }
    );
  }
}
