export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function callOpenAI(
  apiKey: string,
  systemPrompt: string,
  messages: Message[]
): Promise<string> {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, systemPrompt, messages }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "OpenAI request failed");
  }

  return data.content;
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    await callOpenAI(apiKey, "Reply with OK", [
      { role: "user", content: "test" },
    ]);
    return true;
  } catch {
    return false;
  }
}
