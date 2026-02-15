"use client";

import { useState } from "react";
import { callOpenAI } from "@/lib/openai";

interface Claim {
  id: string;
  provider: string;
  amount: number;
  risk: string;
  score: number;
  status: string;
}

interface ClaimAnalysisProps {
  claim: Claim;
  apiKey: string;
  onConfigureApi: () => void;
}

const SYSTEM_PROMPT = `You are a senior fraud analyst at a healthcare insurance company. You analyze insurance claims for potential fraud.

Given claim data, provide a concise analysis with:
1. **Risk Assessment**: A 1-2 sentence summary of the fraud risk level and why.
2. **Suspicious Patterns**: 2-3 bullet points of specific patterns or red flags detected.
3. **Recommended Action**: One clear recommendation (approve, flag for review, escalate, or reject).

Keep the response under 200 words. Be specific and actionable. Use plain language.`;

export default function ClaimAnalysis({ claim, apiKey, onConfigureApi }: ClaimAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
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
          content: `Analyze this insurance claim for fraud:
- Claim ID: ${claim.id}
- Provider: ${claim.provider}
- Amount: $${claim.amount.toLocaleString()}
- Risk Score: ${(claim.score * 100).toFixed(0)}% (${claim.risk} risk)
- Current Status: ${claim.status}`,
        },
      ]);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-blue-200 rounded-lg bg-blue-50/50">
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-blue-900">AI Fraud Analysis</h4>
          {!analysis && !loading && (
            <button
              onClick={handleAnalyze}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
            >
              {apiKey ? "Analyze" : "Configure API Key"}
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-3">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-blue-700">Analyzing claim with AI...</span>
          </div>
        )}

        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            {error}
          </div>
        )}

        {analysis && (
          <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </div>
    </div>
  );
}
