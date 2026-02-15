"use client";

import { useState, useRef, useEffect } from "react";
import { callOpenAI, Message } from "@/lib/openai";

interface ChatPanelProps {
  apiKey: string;
  dashboardContext: Record<string, unknown>;
  onConfigureApi: () => void;
}

const SYSTEM_PROMPT = `You are an AI assistant for a Fraud Detection Dashboard. You help analysts understand claims data, fraud patterns, and system performance.

You have access to the following dashboard data:
{CONTEXT}

Answer questions about this data concisely. If asked about specific claims, providers, or trends, reference the data provided. If you don't have enough data to answer, say so clearly.

Keep responses under 150 words. Use bullet points for lists.`;

export default function ChatPanel({ apiKey, dashboardContext, onConfigureApi }: ChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      onConfigureApi();
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = SYSTEM_PROMPT.replace(
        "{CONTEXT}",
        JSON.stringify(dashboardContext, null, 2)
      );
      const result = await callOpenAI(apiKey, systemPrompt, updatedMessages);
      setMessages([...updatedMessages, { role: "assistant", content: result }]);
    } catch {
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-500 flex items-center justify-center z-40 transition-transform hover:scale-105"
      >
        {isOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-slate-700 bg-blue-600 text-white rounded-t-2xl">
            <h3 className="text-sm font-semibold">AI Assistant</h3>
            <p className="text-xs text-blue-100">Ask about claims, fraud patterns, or dashboard data</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500 mb-3">Try asking:</p>
                <div className="space-y-2">
                  {[
                    "Which claims have the highest risk?",
                    "Summarize fraud by category",
                    "How are the agents performing?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="block w-full text-xs text-left px-3 py-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 text-slate-400"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 px-3 py-2 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700">
            {!apiKey && (
              <button
                onClick={onConfigureApi}
                className="w-full py-2 mb-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs font-medium"
              >
                Configure OpenAI API key to start chatting
              </button>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={apiKey ? "Ask about your data..." : "API key required"}
                disabled={!apiKey}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading || !apiKey}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
