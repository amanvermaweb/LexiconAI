import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function GET() {
  try {
    const { userId } = await requireSessionUser();

    await connectDB();

    const keys = await UserKey.find({ userId }).lean();

    const providers = keys.map((entry) => ({
      provider: entry.provider,
      lastFour: entry.lastFour || null,
      updatedAt: entry.updatedAt,
    }));

    return NextResponse.json({ providers });
  } catch (error) {
    return toErrorResponse(error, "Failed to load key metadata.");
  }
}
