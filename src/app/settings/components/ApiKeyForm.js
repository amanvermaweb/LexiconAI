import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

const PROVIDERS = [
  { id: "openai", label: "OpenAI (GPT)" },
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
];

export default function ApiKeyForm({ apiKey, setApiKey }) {
  const { data: session } = useSession();
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
        throw new Error(payload?.error || "Unable to load keys.");
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
        message: error?.message || "Unable to load key status.",
      });
    } finally {
      setLoadingKeys(false);
    }
  }, [session?.user]);

  useEffect(() => {
    loadSavedKeys();
  }, [loadSavedKeys]);

  const handleSave = async () => {
    setStatus(null);

    if (!apiKey) {
      setStatus({ type: "error", message: "Please enter an API key." });
      return;
    }

    if (!session?.user) {
      setStatus({
        type: "error",
        message: "Please sign in to save API keys securely.",
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
        throw new Error(payload?.error || "Unable to save API key.");
      }

      if (payload?.warning) {
        setStatus({
          type: "warning",
          message: `Saved ${provider} key ending in ${payload?.lastFour || "••••"}. ${payload.warning}`,
        });
      } else {
        setStatus({
          type: "success",
          message: `Saved ${provider} key ending in ${payload?.lastFour || "••••"}.`,
        });
      }
      await loadSavedKeys();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Unable to save API key.",
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
        throw new Error(payload?.error || "Unable to delete API key.");
      }

      setStatus({
        type: "success",
        message: `${targetProvider} key removed.`,
      });
      await loadSavedKeys();
    } catch (error) {
      setStatus({
        type: "error",
        message: error?.message || "Unable to delete API key.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2 dark:text-white/80">
          Provider
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
          API key
        </label>
        <input
          placeholder="Enter your API key"
          className="w-full rounded-2xl border border-(--border) surface-soft px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition hover:bg-(--surface-1) dark:text-white/90 dark:placeholder:text-white/40"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>

      {activeStatus ? (
        <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-600 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
          {`Saved ${provider} key ending in ${activeStatus.lastFour}.`}
        </div>
      ) : (
  <div className="rounded-2xl border border-(--border) surface-soft px-4 py-3 text-sm text-slate-600 shadow-sm dark:text-white/60">
          {loadingKeys
            ? "Checking saved keys..."
            : "No saved key for this provider yet."}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-2xl bg-linear-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white text-sm font-semibold shadow-sm transition py-3 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {saving ? "Saving..." : "Save API key"}
      </button>

      <p className="text-xs text-slate-500 dark:text-white/50">
        Your key is encrypted before it is stored. Keys are never shown again.
      </p>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 dark:text-white/80">
          Saved keys
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
                      ? `Saved ••••${saved.lastFour}`
                      : "No key saved"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(option.id)}
                  disabled={!saved || saving}
                  className="rounded-xl border border-rose-200/70 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50/80 transition dark:border-rose-400/20 dark:text-rose-200 dark:hover:bg-rose-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Delete
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
