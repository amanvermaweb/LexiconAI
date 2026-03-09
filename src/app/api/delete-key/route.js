import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";
import { normalizeProvider } from "@/server/lib/providers";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function DELETE(request) {
  try {
    const { userId } = await requireSessionUser();

    const body = await request.json();
    const provider = normalizeProvider(body?.provider);

    if (!provider) {
      return NextResponse.json(
        { error: "Provider is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const result = await UserKey.findOneAndDelete({ userId, provider });

    if (!result) {
      return NextResponse.json(
        { error: "No API key found for provider." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "API key removed." });
  } catch (error) {
    return toErrorResponse(error, "Failed to delete API key.");
  }
}
