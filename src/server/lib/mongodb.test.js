import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const connect = vi.fn();
const mockedMongoose = {
  connect,
  connection: {
    readyState: 0,
  },
};

vi.mock("mongoose", () => ({
  default: mockedMongoose,
}));

describe("connectDB", () => {
  const originalMongoUri = process.env.MONGODB_URI;

  beforeEach(() => {
    vi.resetModules();
    connect.mockReset();
    mockedMongoose.connection.readyState = 0;
    process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test";
    delete global._mongoose;
  });

  afterEach(() => {
    if (originalMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoUri;
    }

    delete global._mongoose;
  });

  it("retries a failed connection attempt", async () => {
    const failure = new Error("Atlas blocked this IP");
    const connection = { connection: { readyState: 1 } };

    connect.mockRejectedValueOnce(failure).mockResolvedValueOnce(connection);

    const { connectDB } = await import("@/server/lib/mongodb");

    await expect(connectDB()).rejects.toThrow("Atlas blocked this IP");
    await expect(connectDB()).resolves.toBe(connection);
    expect(connect).toHaveBeenCalledTimes(2);
  });

  it("reconnects when a cached connection is no longer ready", async () => {
    const firstConnection = { connection: { readyState: 1 } };
    const secondConnection = { connection: { readyState: 1 } };

    connect.mockResolvedValueOnce(firstConnection).mockResolvedValueOnce(secondConnection);

    const { connectDB } = await import("@/server/lib/mongodb");

    mockedMongoose.connection.readyState = 1;
    await expect(connectDB()).resolves.toBe(firstConnection);

    mockedMongoose.connection.readyState = 0;
    await expect(connectDB()).resolves.toBe(secondConnection);
    expect(connect).toHaveBeenCalledTimes(2);
  });
});