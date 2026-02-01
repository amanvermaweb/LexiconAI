import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/server/lib/mongodb";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { createOpenAICompletion } from "@/server/services/openaiProxy";
import { createGeminiCompletion } from "@/server/services/geminiProxy";
import UserKey from "@/server/models/UserKey";
import { decrypt } from "@/server/lib/crypto";
import { authOptions } from "@/server/lib/auth";

const serializeMessage = (message) => ({
  id: message._id.toString(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required." },
        { status: 400 }
      );
    }

    await connectDB();

    const chat = await Chat.findOne({ _id: chatId, userId }).lean();

    if (!chat) {
      return NextResponse.json({ error: "Chat not found." }, { status: 404 });
    }

    const messages = await Message.find({ chatId, userId })
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
    const session = await getServerSession(authOptions);
    const userId = session?.user?.email || session?.user?.id || session?.user?.name;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const content = body?.message?.trim();
    const model = body?.model || "gpt";

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required." },
        { status: 400 }
      );
    }

    const resolveProvider = (modelValue) => {
      if (!modelValue) return "openai";
      if (modelValue.startsWith("gemini")) return "gemini";
      if (modelValue.startsWith("claude")) return "claude";
      if (modelValue.startsWith("perplexity")) return "perplexity";
      return "openai";
    };

    await connectDB();

    const provider = resolveProvider(model);
    const savedKey = await UserKey.findOne({ userId, provider }).lean();

    if (!savedKey?.encryptedKey) {
      return NextResponse.json(
        { error: `No API key saved for ${provider}.` },
        { status: 400 }
      );
    }

  const apiKey = decrypt(savedKey.encryptedKey).replace(/\s+/g, "");

    let chat = null;
    let chatId = body?.chatId || null;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });

      if (!chat) {
        return NextResponse.json({ error: "Chat not found." }, { status: 404 });
      }
    }

    if (!chat) {
      chat = await Chat.create({
        title: content.slice(0, 60) || "New Chat",
        lastMessageAt: new Date(),
        userId,
      });
      chatId = chat._id.toString();
    }

    await Message.create({
      chatId,
      userId,
      role: "user",
      content,
    });

    const contextMessages = await Message.find({ chatId, userId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    const openAiMessages = contextMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    let completion = null;

    if (provider === "openai") {
      completion = await createOpenAICompletion({
        apiKey,
        model,
        messages: openAiMessages,
      });
    } else if (provider === "gemini") {
      completion = await createGeminiCompletion({
        apiKey,
        model,
        messages: openAiMessages,
      });
    } else {
      return NextResponse.json(
        { error: `Provider ${provider} is not supported yet.` },
        { status: 400 }
      );
    }

    if (completion?.error) {
      return NextResponse.json({ error: completion.error }, { status: 400 });
    }

    await Message.create({
      chatId,
      userId,
      role: "assistant",
      content: completion.content,
    });

    await Chat.findByIdAndUpdate(chatId, {
      lastMessageAt: new Date(),
      title: chat.title || content.slice(0, 60),
    });

    const messages = await Message.find({ chatId, userId })
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
