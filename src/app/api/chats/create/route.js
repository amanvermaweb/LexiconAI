import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import { authOptions } from "@/server/lib/auth";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    await connectDB();

    const title = body?.title?.trim() || "New Chat";
    const chat = await Chat.create({
      title,
      lastMessageAt: null,
      userId,
    });

    return NextResponse.json({
      chat: {
        id: chat._id.toString(),
        title: chat.title,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to create chat." },
      { status: 500 }
    );
  }
}
