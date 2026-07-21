import { getClient } from "../../lib/clients";
import { buildSystemPrompt } from "../../lib/languages";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { clientSlug, messages, languageCode } = req.body;
  if (!clientSlug || !messages || !Array.isArray(messages)) return res.status(400).json({ error: "Missing fields" });
  const client = getClient(clientSlug);
  if (!client) return res.status(404).json({ error: "Client not found" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not set" });
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system: buildSystemPrompt(client, languageCode || "auto"), messages }),
    });
    const data = await response.json();
    return res.status(200).json({ reply: data.content?.[0]?.text || "" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
