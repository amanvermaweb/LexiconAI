import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import UserKey from "@/server/models/UserKey";

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const provider = body?.provider?.toLowerCase()?.trim();

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
    return NextResponse.json(
      { error: error?.message || "Failed to delete API key." },
      { status: 500 }
    );
  }
}
