import { NextResponse } from "next/server";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function POST() {
  try {
    await requireSessionUser();

    return NextResponse.json({
      message:
        "Password changes are managed by your OAuth provider. Please update it in GitHub.",
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to process request.");
  }
}
