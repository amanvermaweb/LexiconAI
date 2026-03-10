import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
  getStoredLocale,
  localizeMessage,
  normalizeLocale,
  translate,
} from "@/utils/i18n";

describe("normalizeLocale", () => {
  it("returns the locale unchanged for each supported locale", () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(normalizeLocale(locale)).toBe(locale);
    }
  });

  it("returns the default locale for an unsupported locale string", () => {
    expect(normalizeLocale("fr")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale("de")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale("zh")).toBe(DEFAULT_LOCALE);
  });

  it("returns the default locale for null", () => {
    expect(normalizeLocale(null)).toBe(DEFAULT_LOCALE);
  });

  it("returns the default locale for undefined", () => {
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("returns the default locale for an empty string", () => {
    expect(normalizeLocale("")).toBe(DEFAULT_LOCALE);
  });
});

describe("getStoredLocale", () => {
  it("returns the default locale on the server (window is undefined)", () => {
    expect(typeof window).toBe("undefined");
    expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
  });

  describe("when window is available", () => {
    let originalWindow;
    let localStorageStore;

    beforeEach(() => {
      originalWindow = global.window;
      localStorageStore = {};
      global.window = {};
      global.localStorage = {
        getItem: (key) => localStorageStore[key] ?? null,
        setItem: (key, value) => {
          localStorageStore[key] = value;
        },
      };
    });

    afterEach(() => {
      global.window = originalWindow;
      delete global.localStorage;
    });

    it("returns a valid stored locale", () => {
      localStorageStore[LOCALE_STORAGE_KEY] = "hi";
      expect(getStoredLocale()).toBe("hi");
    });

    it("returns the default locale when the stored value is unsupported", () => {
      localStorageStore[LOCALE_STORAGE_KEY] = "fr";
      expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
    });

    it("returns the default locale when nothing is stored", () => {
      expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
    });
  });
});

describe("translate", () => {
  it("returns the English translation for a known key", () => {
    expect(translate("en", "common.cancel")).toBe("Cancel");
  });

  it("returns the Hindi translation for a known key", () => {
    expect(translate("hi", "common.cancel")).toBe("रद्द करें");
  });

  it("substitutes a single variable into the template", () => {
    expect(translate("en", "chat.askAnything", { model: "GPT-4o" })).toBe(
      "Ask GPT-4o anything..."
    );
  });

  it("substitutes multiple variables into the template", () => {
    expect(
      translate("en", "settings.savedKeyEnding", {
        provider: "OpenAI",
        lastFour: "abcd",
      })
    ).toBe("Saved OpenAI key ending in abcd.");
  });

  it("keeps the placeholder when a variable is missing", () => {
    expect(translate("en", "chat.askAnything")).toBe("Ask {model} anything...");
  });

  it("falls back to the default locale when the key is missing in the target locale", () => {
    expect(translate("hi", "common.genericError")).toBe("कुछ गलत हो गया।");
  });

  it("falls back to the key itself when it is missing in all locales", () => {
    expect(translate("en", "nonexistent.key")).toBe("nonexistent.key");
  });

  it("falls back to the default locale for an unsupported locale", () => {
    expect(translate("fr", "common.cancel")).toBe("Cancel");
  });
});

describe("localizeMessage", () => {
  it("returns the generic error for a null message", () => {
    expect(localizeMessage(null)).toBe("Something went wrong.");
  });

  it("returns the generic error for an empty string", () => {
    expect(localizeMessage("")).toBe("Something went wrong.");
  });

  it("returns the generic error for undefined", () => {
    expect(localizeMessage(undefined)).toBe("Something went wrong.");
  });

  it("translates a direct-key message in English", () => {
    expect(localizeMessage("Unauthorized.", "en")).toBe("Unauthorized.");
  });

  it("translates a direct-key message in Hindi", () => {
    expect(localizeMessage("Unauthorized.", "hi")).toBe("अनधिकृत।");
  });

  it("localizes the 'Saved X key ending in Y.' pattern", () => {
    expect(
      localizeMessage("Saved OpenAI key ending in abcd.", "en")
    ).toBe("Saved OpenAI key ending in abcd.");
  });

  it("localizes the 'Saved X key ending in Y.' pattern in Hindi", () => {
    expect(
      localizeMessage("Saved OpenAI key ending in abcd.", "hi")
    ).toBe("OpenAI key अंत abcd के साथ सहेजी गई है।");
  });

  it("localizes the 'X key removed.' pattern", () => {
    expect(localizeMessage("OpenAI key removed.", "en")).toBe(
      "OpenAI key removed."
    );
  });

  it("localizes the 'X key removed.' pattern in Hindi", () => {
    expect(localizeMessage("OpenAI key removed.", "hi")).toBe(
      "OpenAI key हटा दी गई।"
    );
  });

  it("localizes the masked saved-key pattern in English", () => {
    expect(localizeMessage("Saved ••••abcd", "en")).toBe("Saved ••••abcd");
  });

  it("localizes the masked saved-key pattern in Hindi", () => {
    expect(localizeMessage("Saved ••••abcd", "hi")).toBe(
      "सहेजी गई ••••abcd"
    );
  });

  it("localizes the 'No X API key saved.' pattern", () => {
    expect(localizeMessage("No OpenAI API key saved.", "en")).toBe(
      "No OpenAI API key saved."
    );
  });

  it("localizes the 'No X API key saved.' pattern in Hindi", () => {
    expect(localizeMessage("No OpenAI API key saved.", "hi")).toBe(
      "OpenAI के लिए कोई API key सहेजी नहीं गई है।"
    );
  });

  it("returns the original message when it does not match any pattern", () => {
    expect(localizeMessage("Some unknown message.", "en")).toBe(
      "Some unknown message."
    );
  });

  it("uses the default locale (English) when no locale is provided", () => {
    const result = localizeMessage("Unauthorized.");
    expect(result).toBe(translate(DEFAULT_LOCALE, "common.unauthorized"));
    expect(result).not.toBe(translate("hi", "common.unauthorized"));
  });
});
