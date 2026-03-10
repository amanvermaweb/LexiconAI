const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

function buildRequestBody(body) {
  if (body === undefined || body === null) {
    return undefined;
  }

  return typeof body === "string" ? body : JSON.stringify(body);
}

export async function requestJson(
  url,
  {
    method = "GET",
    headers,
    body,
    defaultErrorMessage = "Request failed.",
    ...options
  } = {}
) {
  const response = await fetch(url, {
    method,
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: buildRequestBody(body),
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || defaultErrorMessage);
  }

  return payload;
}