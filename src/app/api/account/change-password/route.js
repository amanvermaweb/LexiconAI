import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({
      message:
        "Password changes are managed by your OAuth provider. Please update it in GitHub.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to process request." },
      { status: 500 }
    );
  }
}
