import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/lib/auth";

export function createHttpError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function getSessionUserId(session) {
  return session?.user?.email || session?.user?.id || session?.user?.name || null;
}

export async function requireSessionUser() {
  const session = await getServerSession(authOptions);
  const userId = getSessionUserId(session);

  if (!userId) {
    throw createHttpError("Unauthorized.", 401);
  }

  return { session, userId };
}

export function toErrorResponse(error, fallbackMessage) {
  return NextResponse.json(
    { error: error?.message || fallbackMessage },
    { status: error?.status || 500 }
  );
}