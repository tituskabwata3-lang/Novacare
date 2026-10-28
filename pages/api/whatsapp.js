import { getClient, clients } from "../../lib/clients";
import { buildSystemPrompt } from "../../lib/languages";
import { createSession, getSession, appendToSession } from "../../lib/voiceSessions";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const from = req.body?.From || "";
  const to = req.body?.To || "";
  const text = (req.body?.Body || "").trim();
  let slug = "demo";
  for (const [s, c] of Object.entries(clients)) {
    if (c.whatsappNumber && c.whatsappNumber === to) { slug = s; break; }
  }
  const client = getClient(slug);
  let reply = "Sorry, please send your question as a text message.";
  if (text) {
    const key = `wa:${slug}:${from}`;
    if (!getSession(key)) createSession(key, slug, "auto");
    appendToSession(key, "user", text);
    const history = getSession(key).history.map(m => ({ role: m.role, content: m.content }));
    reply = "Sorry, I'm having a technical issue. Please try again shortly.";
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 500,
          system: buildSystemPrompt(client, "auto") + "\nThis is a WhatsApp chat. Keep replies under 600 characters.",
          messages: history,
        }),
      });
      const d = await r.json();
      if (d.content?.[0]?.text) { reply = d.content[0].text; appendToSession(key, "assistant", reply); }
    } catch (e) {}
  }
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${esc(reply)}</Message></Response>`);
}
EOFcat > pages/api/whatsapp.js << 'EOF'
import { getClient, clients } from "../../lib/clients";
import { buildSystemPrompt } from "../../lib/languages";
import { createSession, getSession, appendToSession } from "../../lib/voiceSessions";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const from = req.body?.From || "";
  const to = req.body?.To || "";
  const text = (req.body?.Body || "").trim();
  let slug = "demo";
  for (const [s, c] of Object.entries(clients)) {
    if (c.whatsappNumber && c.whatsappNumber === to) { slug = s; break; }
  }
  const client = getClient(slug);
  let reply = "Sorry, please send your question as a text message.";
  if (text) {
    const key = `wa:${slug}:${from}`;
    if (!getSession(key)) createSession(key, slug, "auto");
    appendToSession(key, "user", text);
    const history = getSession(key).history.map(m => ({ role: m.role, content: m.content }));
    reply = "Sorry, I'm having a technical issue. Please try again shortly.";
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 500,
          system: buildSystemPrompt(client, "auto") + "\nThis is a WhatsApp chat. Keep replies under 600 characters.",
          messages: history,
        }),
      });
      const d = await r.json();
      if (d.content?.[0]?.text) { reply = d.content[0].text; appendToSession(key, "assistant", reply); }
    } catch (e) {}
  }
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${esc(reply)}</Message></Response>`);
}
