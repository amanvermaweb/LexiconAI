import {
  isSupportedProvider,
  normalizeApiKey,
  normalizeProvider,
} from "@/server/lib/providers";
import {
  getNormalizedEmail,
  getTrimmedString,
  createHttpError,
} from "@/server/lib/request";

const DEFAULT_CHAT_TITLE = "New Chat";

export function parseProviderInput(body, { requireApiKey = false } = {}) {
  const provider = normalizeProvider(body?.provider);
  const apiKey = normalizeApiKey(body?.apiKey);

  if (!provider) {
    throw createHttpError("Provider is required.", 400);
  }

  if (!isSupportedProvider(provider)) {
    throw createHttpError("Unsupported provider.", 400);
  }

  if (requireApiKey && !apiKey) {
    throw createHttpError("Provider and API key are required.", 400);
  }

  return { provider, apiKey };
}

export function parseRegistrationInput(body) {
  const email = getNormalizedEmail(body?.email);
  const password = body?.password || "";
  const confirmPassword = body?.confirmPassword || "";

  if (!email || !password || !confirmPassword) {
    throw createHttpError(
      "Email, password, and confirmation are required.",
      400
    );
  }

  if (password.length < 8) {
    throw createHttpError("Password must be at least 8 characters.", 400);
  }

  if (password !== confirmPassword) {
    throw createHttpError("Passwords do not match.", 400);
  }

  return { email, password, confirmPassword };
}

export function parseCreateChatInput(body) {
  return {
    title: getTrimmedString(body?.title) || DEFAULT_CHAT_TITLE,
  };
}

export function parseChatCompletionInput(body) {
  const message = getTrimmedString(body?.message);
  const model = getTrimmedString(body?.model);
  const chatId = getTrimmedString(body?.chatId);

  if (!message) {
    throw createHttpError("Message content is required.", 400);
  }

  return {
    chatId,
    content: message,
    model,
  };
}