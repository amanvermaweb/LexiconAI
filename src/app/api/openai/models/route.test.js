import { beforeEach, describe, expect, it, vi } from "vitest";

const requireSessionUser = vi.fn();
const toErrorResponse = vi.fn((error, fallbackMessage) =>
  Response.json(
    { error: error?.message || fallbackMessage },
    { status: error?.status || 500 }
  )
);
const getDecryptedUserKey = vi.fn();
const listOpenAIModels = vi.fn();

vi.mock("@/server/lib/request", () => ({
  requireSessionUser,
  toErrorResponse,
}));

vi.mock("@/server/lib/userKeys", () => ({
  getDecryptedUserKey,
}));

vi.mock("@/server/services/openaiProxy", () => ({
  listOpenAIModels,
}));

const { GET } = await import("@/app/api/openai/models/route");

describe("/api/openai/models", () => {
  beforeEach(() => {
    requireSessionUser.mockResolvedValue({ userId: "user-1" });
    getDecryptedUserKey.mockResolvedValue({ apiKey: "openai-key" });
    listOpenAIModels.mockResolvedValue([
      { id: "gpt-4o-mini", displayName: "gpt-4o-mini" },
    ]);
  });

  it("lists models for the authenticated user", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      models: [{ id: "gpt-4o-mini", displayName: "gpt-4o-mini" }],
    });
    expect(getDecryptedUserKey).toHaveBeenCalledWith({
      userId: "user-1",
      provider: "openai",
      missingMessage: "No OpenAI API key saved.",
    });
    expect(listOpenAIModels).toHaveBeenCalledWith("openai-key");
  });

  it("returns helper-driven error responses", async () => {
    requireSessionUser.mockRejectedValueOnce(
      Object.assign(new Error("Unauthorized."), { status: 401 })
    );

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({ error: "Unauthorized." });
    expect(toErrorResponse).toHaveBeenCalled();
  });
});