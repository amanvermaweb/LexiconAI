"use client";

import { useState, useEffect } from "react";

export default function ApiKeyForm() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Optionally fetch saved key-status (exists or not) from server
    // e.g. GET /api/save-key/status (not implemented yet)
    // For now, nothing to do.
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setStatusMsg(null);
    if (!key || key.trim().length < 10) {
      setStatusMsg({ type: "error", text: "Please paste a valid API key." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/save-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({
          type: "error",
          text: data?.error || data?.detail || "Failed to save key",
        });
        setSaved(false);
      } else {
        setStatusMsg({ type: "success", text: "API key validated and saved." });
        setSaved(true);
        setKey("");
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message || "Network error" });
      setSaved(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/delete-key", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({
          type: "error",
          text: data?.error || "Failed to delete key",
        });
      } else {
        setStatusMsg({ type: "success", text: "API key removed." });
        setSaved(false);
      }
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message || "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="space-y-4 p-4 rounded shadow-sm"
    >
      <label className="block text-sm font-medium">
        OpenAI API Key
      </label>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="sk-..."
        className="w-full border border-gray-200 rounded p-2 text-sm"
        spellCheck={false}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 hover:cursor-pointer"
          disabled={loading}
        >
          {loading ? "Validating..." : "Validate and Save"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded border border-gray-200 hover:bg-gray-900 hover:cursor-pointer"
          disabled={loading}
        >
          Delete Key
        </button>
      </div>

      {statusMsg && (
        <div
          className={`mt-2 text-sm p-2 rounded ${
            statusMsg.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        We store your key encrypted. You are billed by OpenAI for calls made
        with your key. Do not share sensitive keys publicly.
      </div>
    </form>
  );
}
