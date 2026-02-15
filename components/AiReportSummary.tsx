"use client";

import { useState } from "react";
import { callOpenAI } from "@/lib/openai";

interface AiReportSummaryProps {
  apiKey: string;
  dashboardData: Record<string, unknown>;
  onConfigureApi: () => void;
}

const SYSTEM_PROMPT = `You are a senior data analyst generating an executive summary for a Fraud Detection System report.

Given the dashboard data, write a concise executive summary that includes:
1. **Overview**: 2-3 sentences summarizing the current state of fraud detection.
2. **Key Findings**: 3-4 bullet points highlighting the most important trends or metrics.
3. **Risks & Concerns**: 1-2 bullet points about areas needing attention.
4. **Recommendations**: 2-3 actionable recommendations for the next period.

Keep the total response under 250 words. Use professional language suitable for C-level executives. Be data-driven — reference specific numbers from the provided data.`;

export default function AiReportSummary({ apiKey, dashboardData, onConfigureApi }: AiReportSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!apiKey) {
      onConfigureApi();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await callOpenAI(apiKey, SYSTEM_PROMPT, [
        {
          role: "user",
          content: `Generate an executive summary based on this dashboard data:\n${JSON.stringify(dashboardData, null, 2)}`,
        },
      ]);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white text-sm">AI Executive Summary</h3>
          <p className="text-xs text-slate-500">Powered by OpenAI</p>
        </div>
        {!loading && (
          <button
            onClick={handleGenerate}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {summary ? "Regenerate" : apiKey ? "Generate Summary" : "Configure API Key"}
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-4">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-blue-400">Generating executive summary...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400">
          {error}
        </div>
      )}

      {summary && !loading && (
        <div className="p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</div>
        </div>
      )}

      {!summary && !loading && !error && (
        <div className="py-4 text-center">
          <p className="text-xs text-slate-500">
            {apiKey
              ? "Click \"Generate Summary\" to create an AI-powered executive summary from your dashboard data."
              : "Configure your OpenAI API key to enable AI-powered summaries."}
          </p>
        </div>
      )}
    </div>
  );
}
