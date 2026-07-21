const sessions = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
function cleanup() {
  const now = Date.now();
  for (const [sid, session] of sessions.entries()) {
    if (now - session.createdAt > SESSION_TTL_MS) sessions.delete(sid);
  }
}
export function createSession(callSid, clientSlug, langCode) {
  cleanup();
  sessions.set(callSid, { history: [], clientSlug, langCode, createdAt: Date.now(), turnCount: 0 });
}
export function getSession(callSid) { return sessions.get(callSid) || null; }
export function appendToSession(callSid, role, content) {
  const session = sessions.get(callSid);
  if (!session) return;
  session.history.push({ role, content });
  if (role === "assistant") session.turnCount++;
  if (session.history.length > 40) session.history = session.history.slice(-40);
}
export function deleteSession(callSid) { sessions.delete(callSid); }
