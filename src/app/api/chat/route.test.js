import { beforeEach, describe, expect, it, vi } from "vitest";

const requireSessionUser = vi.fn();
const toErrorResponse = vi.fn((error, fallbackMessage) =>
  Response.json(
    { error: error?.message || fallbackMessage },
    { status: error?.status || 500 }
  )
);
const createErrorResponse = vi.fn((message, status = 400) =>
  Response.json({ error: message }, { status })
);
const createHttpError = vi.fn((message, status = 500) =>
  Object.assign(new Error(message), { status })
);
const getTrimmedString = vi.fn((value) =>
  typeof value === "string" ? value.trim() : ""
);
const readJsonBody = vi.fn(async (request) => request.json());

const getDecryptedUserKey = vi.fn();
const createChatCompletion = vi.fn();

const chatFindOne = vi.fn();
const chatCreate = vi.fn();
const chatFindByIdAndUpdate = vi.fn();

const messageFind = vi.fn();
const messageCreate = vi.fn();

vi.mock("@/server/lib/request", () => ({
  createErrorResponse,
  getTrimmedString,
  requireSessionUser,
  readJsonBody,
  toErrorResponse,
  createHttpError,
}));

vi.mock("@/server/lib/userKeys", () => ({
  getDecryptedUserKey,
}));

vi.mock("@/server/services/chatCompletion", () => ({
  createChatCompletion,
}));

vi.mock("@/server/models/Chat", () => ({
  default: {
    findOne: chatFindOne,
    create: chatCreate,
    findByIdAndUpdate: chatFindByIdAndUpdate,
  },
}));

vi.mock("@/server/models/Message", () => ({
  default: {
    find: messageFind,
    create: messageCreate,
  },
}));

const { POST } = await import("@/app/api/chat/route");

function createObjectId(value) {
  return {
    toString: () => value,
  };
}

function createMessageQuery(result) {
  return {
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockResolvedValue(result),
  };
}

function queueMessageQueries(...results) {
  for (const result of results) {
    messageFind.mockImplementationOnce(() => createMessageQuery(result));
  }
}

describe("/api/chat POST", () => {
  beforeEach(() => {
    requireSessionUser.mockResolvedValue({ userId: "user-1" });
    getDecryptedUserKey.mockResolvedValue({ apiKey: "provider-key" });
    createChatCompletion.mockResolvedValue({ content: "Assistant reply" });
    chatCreate.mockResolvedValue({
      _id: createObjectId("chat-1"),
      title: "Hello world",
    });
    chatFindOne.mockReset();
    chatFindByIdAndUpdate.mockResolvedValue(undefined);
    messageCreate.mockResolvedValue(undefined);
  });

  it.each([
    ["gpt-4o-mini", "openai"],
    ["claude-3-5-sonnet", "claude"],
    ["gemini-2.0-flash", "gemini"],
    ["sonar", "perplexity"],
  ])("dispatches %s to %s", async (model, provider) => {
    const contextMessages = [
      { role: "user", content: "Hello world" },
    ];
    const finalMessages = [
      {
        _id: createObjectId("message-1"),
        role: "user",
        content: "Hello world",
        createdAt: "2026-03-10T00:00:00.000Z",
      },
      {
        _id: createObjectId("message-2"),
        role: "assistant",
        content: "Assistant reply",
        createdAt: "2026-03-10T00:00:01.000Z",
      },
    ];

    queueMessageQueries(contextMessages, finalMessages);

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello world",
        model,
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(getDecryptedUserKey).toHaveBeenCalledWith({
      userId: "user-1",
      provider,
    });
    expect(createChatCompletion).toHaveBeenCalledWith({
      provider,
      apiKey: "provider-key",
      model,
      messages: [{ role: "user", content: "Hello world" }],
    });
    expect(payload).toEqual({
      chatId: "chat-1",
      messages: [
        {
          id: "message-1",
          role: "user",
          content: "Hello world",
          createdAt: "2026-03-10T00:00:00.000Z",
        },
        {
          id: "message-2",
          role: "assistant",
          content: "Assistant reply",
          createdAt: "2026-03-10T00:00:01.000Z",
        },
      ],
    });
    expect(messageCreate).toHaveBeenNthCalledWith(1, {
      chatId: "chat-1",
      userId: "user-1",
      role: "user",
      content: "Hello world",
    });
    expect(messageCreate).toHaveBeenNthCalledWith(2, {
      chatId: "chat-1",
      userId: "user-1",
      role: "assistant",
      content: "Assistant reply",
    });
  });

  it("returns completion errors as bad requests", async () => {
    queueMessageQueries([{ role: "user", content: "Hello world" }]);
    createChatCompletion.mockResolvedValueOnce({ error: "Provider failed." });

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello world",
        model: "gpt-4o-mini",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({ error: "Provider failed." });
  });
});