import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function GET() {
  try {
    const { userId } = await requireSessionUser();

    await connectDB();

    const [chatsCount, messagesCount] = await Promise.all([
      Chat.countDocuments({ userId }),
      Message.countDocuments({ userId }),
    ]);

    return NextResponse.json({
      chatsCount,
      messagesCount,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to load usage.");
  }
}
