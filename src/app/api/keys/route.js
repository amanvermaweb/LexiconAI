import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectDB();

    const keys = await UserKey.find({ userId }).lean();

    const providers = keys.map((entry) => ({
      provider: entry.provider,
      lastFour: entry.lastFour || null,
      updatedAt: entry.updatedAt,
    }));

    return NextResponse.json({ providers });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to load key metadata." },
      { status: 500 }
    );
  }
}
