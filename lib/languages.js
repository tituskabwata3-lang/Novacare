export const LANGUAGES = [
  { code: "auto", label: "Auto-detect", flag: "🌍", nativeName: "Auto" },
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "bem", label: "Bemba", flag: "🇿🇲", nativeName: "IciBemba" },
  { code: "nya", label: "Nyanja/Chewa", flag: "🇿🇲", nativeName: "Chinyanja" },
  { code: "ton", label: "Tonga", flag: "🇿🇲", nativeName: "ciTonga" },
  { code: "loz", label: "Lozi", flag: "🇿🇲", nativeName: "Silozi" },
];
export function buildSystemPrompt(client, languageCode) {
  const lang = LANGUAGES.find(l => l.code === languageCode) || LANGUAGES[0];
  const languageInstruction = lang.code === "auto"
    ? "LANGUAGE RULE: Detect the language the customer writes in and reply in that exact language. If unclear, default to English."
    : `LANGUAGE RULE: This session is locked to ${lang.label} (${lang.nativeName}). Respond in ${lang.label} throughout.`;
  return `You are ${client.agentName}, a professional AI customer support agent for ${client.name}, serving customers across Zambia 24/7.\n\n${languageInstruction}\n\nCORE BEHAVIOUR:\n- Be concise: 2-4 sentences per reply\n- Be warm and culturally aware\n- Never ask for passwords or PINs\n- Plain text only\n\n${client.systemPromptExtra}\n\nBegin by greeting the customer warmly and asking how you can help.`;
}
