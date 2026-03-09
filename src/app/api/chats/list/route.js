import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function GET() {
  try {
    const { userId } = await requireSessionUser();

    await connectDB();
    const chats = await Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .select({ title: 1, updatedAt: 1 })
      .lean();

    const payload = chats.map((chat) => ({
      id: chat._id.toString(),
      title: chat.title,
      updatedAt: chat.updatedAt,
    }));

    return NextResponse.json({ chats: payload });
  } catch (error) {
    return toErrorResponse(error, "Failed to load chats.");
  }
}
