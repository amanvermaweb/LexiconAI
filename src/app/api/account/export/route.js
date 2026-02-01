import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

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
    return NextResponse.json(
      { error: error?.message || "Failed to export data." },
      { status: 500 }
    );
  }
}
