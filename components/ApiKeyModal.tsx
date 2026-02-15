"use client";

import { useState } from "react";
import { testApiKey } from "@/lib/openai";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (key: string) => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey,
  onSave,
}: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!inputKey.trim()) return;
    setTesting(true);
    setStatus("idle");
    const valid = await testApiKey(inputKey.trim());
    setStatus(valid ? "valid" : "invalid");
    setTesting(false);
  };

  const handleSave = () => {
    onSave(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey("");
    setStatus("idle");
    onSave("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl p-5 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">
            OpenAI API Settings
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            x
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setStatus("idle");
              }}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status === "valid" && (
            <p className="text-xs text-green-600 font-medium">
              Connected successfully
            </p>
          )}
          {status === "invalid" && (
            <p className="text-xs text-red-500 font-medium">
              Invalid API key. Please check and try again.
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!inputKey.trim() || testing}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button
              onClick={handleSave}
              disabled={!inputKey.trim()}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={handleClear}
              className="py-2 px-3 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100"
            >
              Clear
            </button>
          </div>

          <p className="text-xs text-gray-400">
            Your API key is stored in memory only and never persisted to disk.
            You can also set OPENAI_API_KEY as a Vercel environment variable.
          </p>
        </div>
      </div>
    </div>
  );
}
