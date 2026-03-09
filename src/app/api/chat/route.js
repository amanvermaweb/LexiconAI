import { NextResponse } from "next/server";
import Chat from "@/server/models/Chat";
import Message from "@/server/models/Message";
import { createHttpError, requireSessionUser, toErrorResponse } from "@/server/lib/request";
import { resolveProviderFromModel } from "@/server/lib/providers";
import { getDecryptedUserKey } from "@/server/lib/userKeys";
import { createChatCompletion } from "@/server/services/chatCompletion";

const CHAT_TITLE_LENGTH = 60;
const CONTEXT_MESSAGE_LIMIT = 20;

const serializeMessage = (message) => ({
  id: message._id.toString(),
  role: message.role,
  content: message.content,
  createdAt: message.createdAt,
});

const toCompletionMessages = (messages) =>
  messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

async function findUserChat({ chatId, userId }) {
  if (!chatId) {
    return null;
  }

  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    throw createHttpError("Chat not found.", 404);
  }

  return chat;
}

async function listChatMessages({ chatId, userId, limit }) {
  const query = Message.find({ chatId, userId }).sort({ createdAt: 1 });

  if (limit) {
    query.limit(limit);
  }

  return query.lean();
}

async function ensureChat({ chatId, content, userId }) {
  const existingChat = await findUserChat({ chatId, userId });

  if (existingChat) {
    return existingChat;
  }

  return Chat.create({
    title: content.slice(0, CHAT_TITLE_LENGTH) || "New Chat",
    lastMessageAt: new Date(),
    userId,
  });
}

export async function GET(request) {
  try {
    const { userId } = await requireSessionUser();

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required." },
        { status: 400 }
      );
    }

    await findUserChat({ chatId, userId });
    const messages = await listChatMessages({ chatId, userId });

    return NextResponse.json({
      chatId,
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to load messages.");
  }
}

export async function POST(request) {
  try {
    const { userId } = await requireSessionUser();

    const body = await request.json();
    const content = body?.message?.trim();
    const model = body?.model?.trim() || "";

    if (!content) {
      return NextResponse.json(
        { error: "Message content is required." },
        { status: 400 }
      );
    }

    const provider = resolveProviderFromModel(model);
    const { apiKey } = await getDecryptedUserKey({ userId, provider });
    const chat = await ensureChat({
      chatId: body?.chatId,
      content,
      userId,
    });
    const chatId = chat._id.toString();

    await Message.create({
      chatId,
      userId,
      role: "user",
      content,
    });

    const contextMessages = await listChatMessages({
      chatId,
      userId,
      limit: CONTEXT_MESSAGE_LIMIT,
    });

    const completion = await createChatCompletion({
      provider,
      apiKey,
      model,
      messages: toCompletionMessages(contextMessages),
    });

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
      title: chat.title || content.slice(0, CHAT_TITLE_LENGTH),
    });

    const messages = await listChatMessages({ chatId, userId });

    return NextResponse.json({
      chatId,
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return toErrorResponse(error, "Failed to send message.");
  }
}
