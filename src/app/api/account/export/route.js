import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function GET() {
  try {
    const { session, userId } = await requireSessionUser();

    await connectDB();

    const [chats, messages] = await Promise.all([
      Chat.find({ userId }).sort({ updatedAt: -1 }).lean(),
      Message.find({ userId }).sort({ createdAt: 1 }).lean(),
    ]);

    return NextResponse.json({
      user: {
        name: session?.user?.name || null,
        email: session?.user?.email || null,
      },
      chats,
      messages,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to export data.");
  }
}
