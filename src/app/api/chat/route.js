import { NextResponse } from "next/server";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { createOpenAICompletion } from "@/server/services/openaiProxy";

const serializeMessage = (message) => ({
  id: message._id.toString(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required." },
        { status: 400 }
      );
    }

    await connectDB();
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      chatId,
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to load messages." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const content = body?.message?.trim();
    const apiKey = body?.apiKey?.trim();
    const model = body?.model || "gpt";

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required." },
        { status: 400 }
      );
    }

    await connectDB();

    let chat = null;
    let chatId = body?.chatId || null;

    if (chatId) {
      chat = await Chat.findById(chatId);
    }

    if (!chat) {
      chat = await Chat.create({
        title: content.slice(0, 60) || "New Chat",
        lastMessageAt: new Date(),
      });
      chatId = chat._id.toString();
    }

    await Message.create({
      chatId,
      role: "user",
      content,
    });

    const contextMessages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    const openAiMessages = contextMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const completion = await createOpenAICompletion({
      apiKey,
      model,
      messages: openAiMessages,
    });

    if (completion?.error) {
      return NextResponse.json({ error: completion.error }, { status: 400 });
    }

    await Message.create({
      chatId,
      role: "assistant",
      content: completion.content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessageAt: new Date(),
      title: chat.title || content.slice(0, 60),
    });

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({
      chatId,
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Failed to send message." },
      { status: 500 }
    );
  }
}
