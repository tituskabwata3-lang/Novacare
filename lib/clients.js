export const clients = {
  demo: {
    name: "NovaCare Support", tagline: "AI Customer Support · 24/7",
    primaryColor: "#00d4aa", accentColor: "#7c3aed", logo: "N", agentName: "Nova",
    languages: ["auto","en","bem","nya","ton","loz"], defaultLanguage: "auto",
    voice: { twilioNumber: "+260XXXXXXXXX", humanAgentNumber: "+260XXXXXXXXX", defaultLanguage: "auto" },
    systemPromptExtra: "You are a general-purpose support agent for NovaCare, a Zambian AI support platform. Handle questions about pricing, setup, how it works, and onboarding.",
    quickPrompts: { en: ["How does this work?","What does it cost?","How do I get started?","Can I try it for free?"], bem: ["Iyi ilebombela shani?","Ikoste shinga?","Natandika shani?"], nya: ["Izi zimagwira ntchito bwanji?","Ndalama zingati?","Ndiyambe bwanji?"] },
  },
  zamloan: {
    name: "Zamloan", tagline: "Loan Support · 24/7",
    primaryColor: "#f59e0b", accentColor: "#b45309", logo: "Z", agentName: "Zara",
    languages: ["auto","en","bem","nya"], defaultLanguage: "auto",
    voice: { twilioNumber: "+260XXXXXXXXX", humanAgentNumber: "+260211123456", defaultLanguage: "auto" },
    systemPromptExtra: "You are Zara, support agent for Zamloan — a Zambian mobile lending platform. Help with loan status, repayments, Airtel Money (*778#), MTN MoMo (*303#), Zamtel Kwacha (*322#). Loans range K200-K10,000. Late payment: 5% penalty per week.",
    quickPrompts: { en: ["Check my loan status","How do I repay?","I missed a payment","Apply for a loan"], bem: ["Tazya ku loan yandi","Nalipila shani?","Nafumina ukulipila"] },
  },
  airtel: {
    name: "Airtel Money", tagline: "Mobile Money Support · 24/7",
    primaryColor: "#ef4444", accentColor: "#991b1b", logo: "A", agentName: "Amara",
    languages: ["auto","en","bem","nya","ton","loz"], defaultLanguage: "auto",
    voice: { twilioNumber: "+260XXXXXXXXX", humanAgentNumber: "+2600977123456", defaultLanguage: "auto" },
    systemPromptExtra: "You are Amara, support agent for Airtel Money Zambia. Help with sending money (*778#), airtime, bills, Village Banking, lost PINs, reversals. Never ask for PINs. Fraud: escalate to 0977-123456.",
    quickPrompts: { en: ["Send money","Buy airtime","Pay a bill","Check my balance"], bem: ["Tuma ifyuma","Gula airtime","Lipila bill"] },
  },
};
export function getClient(slug) { return clients[slug] || null; }
export function listClients() { return Object.keys(clients).map(slug => ({ slug, name: clients[slug].name, agentName: clients[slug].agentName })); }
