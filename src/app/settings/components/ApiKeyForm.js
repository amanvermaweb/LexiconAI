import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "@/context/LocaleContext";
import { localizeMessage } from "@/utils/i18n";

const PROVIDERS = [
  { id: "openai", label: "OpenAI (GPT)" },
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
];

export default function ApiKeyForm({ apiKey, setApiKey }) {
  const { data: session } = useSession();
  const { locale, t } = useLocale();
  const [provider, setProvider] = useState(PROVIDERS[0].id);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [savedKeys, setSavedKeys] = useState({});

  const activeStatus = useMemo(() => savedKeys[provider], [provider, savedKeys]);

  const loadSavedKeys = useCallback(async () => {
    if (!session?.user) {
      setSavedKeys({});
      return;
    }

    setLoadingKeys(true);
    try {
      const response = await fetch("/api/keys");
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.loadKeysError"), locale),
        );
      }

      const mapped = (payload?.providers || []).reduce((acc, entry) => {
        acc[entry.provider] = {
          lastFour: entry.lastFour || "••••",
          updatedAt: entry.updatedAt || null,
        };
        return acc;
      }, {});

      setSavedKeys(mapped);
    } catch (error) {
      setStatus({
        type: "error",
        message: localizeMessage(
          error?.message || t("settings.loadKeyStatusError"),
          locale,
        ),
      });
    } finally {
      setLoadingKeys(false);
    }
  }, [locale, session?.user, t]);

  useEffect(() => {
    loadSavedKeys();
  }, [loadSavedKeys]);

  const handleSave = async () => {
    setStatus(null);

    if (!apiKey) {
      setStatus({ type: "error", message: t("settings.apiKeyRequired") });
      return;
    }

    if (!session?.user) {
      setStatus({
        type: "error",
        message: t("settings.signInToSaveKeys"),
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/save-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.saveApiKeyError"), locale),
        );
      }

      if (payload?.warning) {
        setStatus({
          type: "warning",
          message: `${t("settings.savedKeyEnding", {
            provider,
            lastFour: payload?.lastFour || "••••",
          })} ${localizeMessage(payload.warning, locale)}`,
        });
      } else {
        setStatus({
          type: "success",
          message: t("settings.savedKeyEnding", {
            provider,
            lastFour: payload?.lastFour || "••••",
          }),
        });
      }
      await loadSavedKeys();
    } catch (error) {
      setStatus({
        type: "error",
        message: localizeMessage(
          error?.message || t("settings.saveApiKeyError"),
          locale,
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (targetProvider) => {
    setStatus(null);
    setSaving(true);
    try {
      const response = await fetch("/api/delete-key", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: targetProvider }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          localizeMessage(payload?.error || t("settings.deleteApiKeyError"), locale),
        );
      }

      setStatus({
        type: "success",
        message: t("settings.removedProviderKey", { provider: targetProvider }),
      });
      await loadSavedKeys();
    } catch (error) {
      setStatus({
        type: "error",
        message: localizeMessage(
          error?.message || t("settings.deleteApiKeyError"),
          locale,
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
          {t("settings.provider")}
        </label>
        <select
          className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-zinc-900 outline-none transition hover:bg-(--surface-1) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--surface-0) dark:text-white hover:cursor-pointer"
          value={provider}
          onChange={(event) => setProvider(event.target.value)}
        >
          {PROVIDERS.map((option) => (
            <option
              key={option.id}
              value={option.id}
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
          {t("settings.apiKey")}
        </label>
        <input
          placeholder={t("settings.apiKeyPlaceholder")}
          className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-(--surface-1) dark:text-white/90 dark:placeholder:text-white/40"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      {activeStatus ? (
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-600 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          {t("settings.savedKeyEnding", {
            provider,
            lastFour: activeStatus.lastFour,
          })}
        </div>
      ) : (
  <div className="rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-600 shadow-sm dark:text-white/60">
          {loadingKeys
            ? t("settings.checkingSavedKeys")
            : t("settings.noSavedKey")}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-semibold shadow-sm transition py-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {saving ? t("settings.saving") : t("settings.saveApiKey")}
      </button>

      <p className="text-xs text-slate-500 dark:text-white/50">
        {t("settings.encryptedHint")}
      </p>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-white/80">
          {t("settings.savedKeys")}
        </p>
        <div className="space-y-2">
          {PROVIDERS.map((option) => {
            const saved = savedKeys[option.id];
            return (
              <div
                key={option.id}
                className="flex items-center justify-between rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-700 dark:text-white/70"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-white/50">
                    {saved
                      ? t("settings.savedKeyMasked", { lastFour: saved.lastFour })
                      : t("settings.noKeySaved")}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(option.id)}
                  disabled={!saved || saving}
                  className="rounded-xl border border-rose-200/70 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition dark:border-rose-400/20 dark:text-rose-200 dark:hover:bg-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {t("common.delete")}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {status && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
            status.type === "success"
              ? "border-emerald-200/70 bg-emerald-50/80 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              : status.type === "warning"
                ? "border-amber-200/70 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200"
                : "border-rose-200/70 bg-rose-50/80 text-rose-600 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200"
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
