import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";

export async function GET() {
  try {
    await connectDB();

    const [chatsCount, messagesCount] = await Promise.all([
      Chat.countDocuments(),
      Message.countDocuments(),
    ]);

    return NextResponse.json({
      chatsCount,
      messagesCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to load usage." },
      { status: 500 }
    );
  }
}
