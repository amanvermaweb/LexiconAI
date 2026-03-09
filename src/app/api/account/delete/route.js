import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { requireSessionUser, toErrorResponse } from "@/server/lib/request";

export async function DELETE() {
  try {
    const { userId } = await requireSessionUser();

    await connectDB();

    const [messageResult, chatResult] = await Promise.all([
      Message.deleteMany({ userId }),
      Chat.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      deletedMessages: messageResult.deletedCount || 0,
      deletedChats: chatResult.deletedCount || 0,
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to delete account data.");
  }
}
