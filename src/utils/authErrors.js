const MONGODB_CONNECTION_PATTERN =
  /Could not connect to any servers in your MongoDB Atlas cluster/i;

import { DEFAULT_LOCALE, localizeMessage, translate } from "@/utils/i18n";

function safeDecode(value) {
  if (typeof value !== "string") {
    return "";
  }

  try {
    return decodeURIComponent(value.replace(/\+/g, "%20"));
  } catch {
    return value;
  }
}

export function getAuthErrorMessage(errorOrCode, locale = DEFAULT_LOCALE) {
  const rawValue =
    typeof errorOrCode === "string"
      ? errorOrCode
      : errorOrCode?.message || "";

  const message = safeDecode(rawValue).trim();

  if (!message) {
    return translate(locale, "auth.signInUnavailable");
  }

  if (/CredentialsSignin/i.test(message)) {
    return translate(locale, "auth.invalidCredentials");
  }

  if (/OAuthAccountNotLinked/i.test(message)) {
    return translate(locale, "auth.oauthLinked");
  }

  if (/AccessDenied/i.test(message)) {
    return translate(locale, "auth.accessDenied");
  }

  if (/Configuration/i.test(message)) {
    return translate(locale, "auth.authConfiguration");
  }

  if (/Please define MONGODB_URI/i.test(message)) {
    return translate(locale, "auth.databaseMissing");
  }

  if (MONGODB_CONNECTION_PATTERN.test(message)) {
    return translate(locale, "auth.databaseBlocked");
  }

  return localizeMessage(message, locale);
}