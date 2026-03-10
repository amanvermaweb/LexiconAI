import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";
import {
  readJsonBody,
  requireSessionUser,
  toErrorResponse,
} from "@/server/lib/request";
import { parseProviderInput } from "@/server/lib/validation";

export async function DELETE(request) {
  try {
    const { userId } = await requireSessionUser();

    const body = await readJsonBody(request);
    const { provider } = parseProviderInput(body);

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
