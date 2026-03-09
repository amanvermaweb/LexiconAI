import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function POST(request) {
  try {
    const { userId } = await requireSessionUser();

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
    return toErrorResponse(error, "Failed to create chat.");
  }
}
