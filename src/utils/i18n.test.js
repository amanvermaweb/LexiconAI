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

describe("constants", () => {
  it("exports DEFAULT_LOCALE as 'en'", () => {
    expect(DEFAULT_LOCALE).toBe("en");
  });

  it("exports LOCALE_STORAGE_KEY as 'locale'", () => {
    expect(LOCALE_STORAGE_KEY).toBe("locale");
  });

  it("exports SUPPORTED_LOCALES containing 'en' and 'hi'", () => {
    expect(SUPPORTED_LOCALES).toContain("en");
    expect(SUPPORTED_LOCALES).toContain("hi");
  });
});

describe("normalizeLocale", () => {
  it("returns the locale unchanged when it is supported", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("hi")).toBe("hi");
  });

  it("falls back to DEFAULT_LOCALE for an unsupported locale", () => {
    expect(normalizeLocale("fr")).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale("de")).toBe(DEFAULT_LOCALE);
  });

  it("falls back to DEFAULT_LOCALE for null or undefined", () => {
    expect(normalizeLocale(null)).toBe(DEFAULT_LOCALE);
    expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
  });

  it("falls back to DEFAULT_LOCALE for an empty string", () => {
    expect(normalizeLocale("")).toBe(DEFAULT_LOCALE);
  });
});

describe("getStoredLocale", () => {
  describe("in a server environment (window is undefined)", () => {
    let originalWindow;

    beforeEach(() => {
      originalWindow = global.window;
      delete global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it("returns DEFAULT_LOCALE", () => {
      expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
    });
  });

  describe("in a browser environment", () => {
    let mockGetItem;

    beforeEach(() => {
      mockGetItem = vi.fn();
      global.window = {};
      global.localStorage = { getItem: mockGetItem };
    });

    afterEach(() => {
      delete global.window;
      delete global.localStorage;
    });

    it("returns the locale stored in localStorage when it is supported", () => {
      mockGetItem.mockReturnValue("hi");
      expect(getStoredLocale()).toBe("hi");
      expect(mockGetItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY);
    });

    it("returns DEFAULT_LOCALE when localStorage holds an unsupported value", () => {
      mockGetItem.mockReturnValue("fr");
      expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
    });

    it("returns DEFAULT_LOCALE when localStorage has no stored locale", () => {
      mockGetItem.mockReturnValue(null);
      expect(getStoredLocale()).toBe(DEFAULT_LOCALE);
    });
  });
});

describe("translate", () => {
  it("returns the English translation for a nested key", () => {
    expect(translate("en", "common.cancel")).toBe("Cancel");
  });

  it("returns the Hindi translation for a nested key", () => {
    expect(translate("hi", "common.cancel")).toBe("रद्द करें");
  });

  it("interpolates variables into the template", () => {
    const result = translate("en", "chat.askAnything", { model: "GPT-4o" });
    expect(result).toBe("Ask GPT-4o anything...");
  });

  it("interpolates variables in Hindi templates", () => {
    const result = translate("hi", "settings.savedKeyEnding", {
      provider: "OpenAI",
      lastFour: "1234",
    });
    expect(result).toBe("OpenAI key अंत 1234 के साथ सहेजी गई है।");
  });

  it("leaves unresolved placeholders intact when a variable is missing", () => {
    const result = translate("en", "chat.askAnything", {});
    expect(result).toBe("Ask {model} anything...");
  });

  it("returns the Hindi translation when the key exists in the Hindi dictionary", () => {
    const result = translate("hi", "common.genericError");
    expect(result).toBe("कुछ गलत हो गया।");
  });

  it("falls back to the key itself when it is not found in any dictionary", () => {
    const missingKey = "nonexistent.key.path";
    expect(translate("en", missingKey)).toBe(missingKey);
    expect(translate("hi", missingKey)).toBe(missingKey);
  });

  it("falls back to the English dictionary for an unsupported locale", () => {
    expect(translate("fr", "common.cancel")).toBe("Cancel");
  });

  it("returns translation with no variables when variables object is omitted", () => {
    expect(translate("en", "common.settings")).toBe("Settings");
  });
});

describe("localizeMessage", () => {
  describe("null / empty input", () => {
    it("returns the generic error message in English for null", () => {
      expect(localizeMessage(null)).toBe("Something went wrong.");
    });

    it("returns the generic error message in English for undefined", () => {
      expect(localizeMessage(undefined)).toBe("Something went wrong.");
    });

    it("returns the generic error message in English for an empty string", () => {
      expect(localizeMessage("")).toBe("Something went wrong.");
    });

    it("returns the generic error message in Hindi when locale is 'hi'", () => {
      expect(localizeMessage(null, "hi")).toBe("कुछ गलत हो गया।");
    });
  });

  describe("direct message mapping", () => {
    it("localizes 'Unauthorized.' to the English translation", () => {
      expect(localizeMessage("Unauthorized.", "en")).toBe("Unauthorized.");
    });

    it("localizes 'Unauthorized.' to Hindi", () => {
      expect(localizeMessage("Unauthorized.", "hi")).toBe("अनधिकृत।");
    });

    it("localizes 'API key saved.' to English", () => {
      expect(localizeMessage("API key saved.", "en")).toBe("API key saved.");
    });

    it("localizes 'API key saved.' to Hindi", () => {
      expect(localizeMessage("API key saved.", "hi")).toBe("API key सहेजी गई।");
    });

    it("localizes 'Unable to send message.' correctly", () => {
      expect(localizeMessage("Unable to send message.", "en")).toBe("Unable to send message.");
    });

    it("localizes 'Invalid email or password.' to Hindi", () => {
      expect(localizeMessage("Invalid email or password.", "hi")).toBe(
        "ईमेल या पासवर्ड गलत है।"
      );
    });
  });

  describe("pattern-based messages", () => {
    it("localizes 'Saved {provider} key ending in {lastFour}.' in English", () => {
      expect(localizeMessage("Saved OpenAI key ending in 4321.", "en")).toBe(
        "Saved OpenAI key ending in 4321."
      );
    });

    it("localizes 'Saved {provider} key ending in {lastFour}.' in Hindi", () => {
      expect(localizeMessage("Saved Anthropic key ending in abcd.", "hi")).toBe(
        "Anthropic key अंत abcd के साथ सहेजी गई है।"
      );
    });

    it("localizes '{provider} key removed.' in English", () => {
      expect(localizeMessage("OpenAI key removed.", "en")).toBe("OpenAI key removed.");
    });

    it("localizes '{provider} key removed.' in Hindi", () => {
      expect(localizeMessage("Gemini key removed.", "hi")).toBe("Gemini key हटा दी गई।");
    });

    it("localizes 'Saved ••••{lastFour}' in English", () => {
      expect(localizeMessage("Saved ••••5678", "en")).toBe("Saved ••••5678");
    });

    it("localizes 'Saved ••••{lastFour}' in Hindi", () => {
      expect(localizeMessage("Saved ••••9999", "hi")).toBe("सहेजी गई ••••9999");
    });

    it("localizes 'No {provider} API key saved.' in English", () => {
      expect(localizeMessage("No OpenAI API key saved.", "en")).toBe(
        "No OpenAI API key saved."
      );
    });

    it("localizes 'No {provider} API key saved.' in Hindi", () => {
      expect(localizeMessage("No Anthropic API key saved.", "hi")).toBe(
        "Anthropic के लिए कोई API key सहेजी नहीं गई है।"
      );
    });
  });

  describe("unknown messages", () => {
    it("returns the original message unchanged when it does not match any pattern", () => {
      const unknown = "Some completely unknown message.";
      expect(localizeMessage(unknown, "en")).toBe(unknown);
      expect(localizeMessage(unknown, "hi")).toBe(unknown);
    });
  });
});
