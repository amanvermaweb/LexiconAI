import OpenAI from "openai";

export async function validateKey(apiKey) {
  if (!apiKey) {
    return {
      valid: false,
      error: "API key missing",
    };
  }

  try {
    const client = new OpenAI({
      apiKey,
    });

    await client.models.list();

    return {
      valid: true,
    };
  } catch (error) {
    if (error.status === 401) {
      return {
        valid: false,
        error: "Invalid API key",
      };
    }

    return {
      valid: false,
      error: "Key validation failed",
    };
  }
}
