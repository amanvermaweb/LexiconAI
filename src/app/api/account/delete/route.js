import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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
    return NextResponse.json(
      { error: error?.message || "Failed to delete account data." },
      { status: 500 }
    );
  }
}
