import { useState, useRef, useEffect } from "react";
import { getClient, clients } from "../../lib/clients";
import { LANGUAGES } from "../../lib/languages";
function Message({ msg, client }) {
  const isAgent = msg.role === "assistant";
  return (
    <div style={{ display:"flex", flexDirection:isAgent?"row":"row-reverse", alignItems:"flex-end", gap:10, marginBottom:14 }}>
      {isAgent && <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${client.primaryColor},${client.accentColor})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>{client.logo}</div>}
      <div style={{ maxWidth:"72%", background:isAgent?"#1a1f2e":`linear-gradient(135deg,${client.accentColor},${client.primaryColor}88)`, color:isAgent?"#c8d0e0":"#fff", padding:"10px 14px", borderRadius:isAgent?"4px 12px 12px 12px":"12px 4px 12px 12px", fontSize:14, lineHeight:1.6 }}>
        {msg.content}
        <div style={{ fontSize:10, marginTop:5, opacity:0.45, textAlign:isAgent?"left":"right" }}>{msg.time}</div>
      </div>
    </div>
  );
}
export default function ChatPage({ client, slug }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [language, setLanguage] = useState(client.defaultLanguage || "auto");
  const [conversationHistory, setConversationHistory] = useState([]);
  const bottomRef = useRef(null);
  const timerRef = useRef(null);
  const availableLangs = LANGUAGES.filter(l => client.languages.includes(l.code));
  const quickPrompts = client.quickPrompts?.[language] || client.quickPrompts?.["en"] || [];
  const nowTime = () => new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  const formatTime = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const pc = client.primaryColor; const ac = client.accentColor;
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isTyping]);
  useEffect(() => {
    if (isCallActive) { timerRef.current = setInterval(() => setSessionTime(t => t+1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [isCallActive]);
  const callAPI = async (history) => {
    const res = await fetch("/api/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientSlug:slug, messages:history, languageCode:language }) });
    const data = await res.json();
    return data.reply;
  };
  const startCall = async () => {
    setIsCallActive(true); setSessionTime(0); setMessages([]); setConversationHistory([]); setIsTyping(true);
    const initMsg = [{ role:"user", content:"Hello, I need some help." }];
    try {
      const reply = await callAPI(initMsg);
      setConversationHistory([...initMsg, { role:"assistant", content:reply }]);
      setMessages([{ role:"assistant", content:reply, time:nowTime() }]);
    } catch { setMessages([{ role:"assistant", content:`Hello! Welcome to ${client.name} support. How can I help?`, time:nowTime() }]); }
    setIsTyping(false);
  };
  const endCall = () => { setIsCallActive(false); setMessages([]); setConversationHistory([]); setSessionTime(0); setInput(""); };
  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isTyping) return;
    setInput("");
    setMessages(prev => [...prev, { role:"user", content:userText, time:nowTime() }]);
    setIsTyping(true);
    const newHistory = [...conversationHistory, { role:"user", content:userText }];
    try {
      const reply = await callAPI(newHistory);
      setConversationHistory([...newHistory, { role:"assistant", content:reply }]);
      setMessages(prev => [...prev, { role:"assistant", content:reply, time:nowTime() }]);
    } catch { setMessages(prev => [...prev, { role:"assistant", content:"Connection issue — please try again.", time:nowTime() }]); }
    setIsTyping(false);
  };
  const handleKey = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  return (
    <div style={{ minHeight:"100vh", background:"#0b0e1a", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"rgba(11,14,26,0.97)", borderBottom:"1px solid #1e2436", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:`${pc}22`, border:`1px solid ${pc}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:pc }}>{client.logo}</div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>{client.name}</div>
            <div style={{ fontSize:11, color:pc, fontWeight:500 }}>{client.agentName} · {client.tagline}</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:pc }} />
          <span style={{ fontSize:11, color:"#64748b" }}>Live</span>
        </div>
      </div>
      <div style={{ flex:1, padding:"20px 24px", maxWidth:760, width:"100%", alignSelf:"center", display:"flex", flexDirection:"column", gap:14 }}>
        {!isCallActive ? (
          <div style={{ background:"#111627", border:"1px solid #1e2436", borderRadius:16, padding:28, textAlign:"center" }}>
            <div style={{ width:60, height:60, borderRadius:"50%", margin:"0 auto 16px", background:`${pc}15`, border:`2px solid ${pc}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🎧</div>
            <div style={{ fontSize:17, fontWeight:700, marginBottom:6, color:"#e2e8f0" }}>Ready to assist customers</div>
            <div style={{ fontSize:13, color:"#64748b", marginBottom:22 }}>Select a language or let {client.agentName} auto-detect</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:24 }}>
              {availableLangs.map(l => (
                <button key={l.code} onClick={() => setLanguage(l.code)} style={{ background:language===l.code?`${pc}22`:"transparent", border:`1px solid ${language===l.code?pc:"#2a3044"}`, color:language===l.code?pc:"#64748b", borderRadius:20, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            <button onClick={startCall} style={{ background:`linear-gradient(135deg,${pc},${pc}99)`, color:"#fff", border:"none", borderRadius:10, padding:"12px 36px", fontSize:14, fontWeight:700, cursor:"pointer" }}>▶ Start Call</button>
          </div>
        ) : (
          <>
            <div style={{ background:"#111627", border:`1px solid ${pc}33`, borderRadius:12, padding:"11px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:pc }} />
                <span style={{ fontSize:13, fontWeight:600, color:pc }}>Call Active</span>
                <span style={{ fontSize:13, color:"#64748b", fontFamily:"monospace" }}>{formatTime(sessionTime)}</span>
                <span style={{ fontSize:11, fontWeight:600, color:"#a78bfa", background:"rgba(124,58,237,0.12)", border:"1px solid #2a1f4a", borderRadius:20, padding:"2px 10px" }}>{currentLang.flag} {currentLang.label}</span>
              </div>
              <button onClick={endCall} style={{ background:"#ef444420", border:"1px solid #ef444440", color:"#ef4444", borderRadius:8, padding:"6px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>✕ End Call</button>
            </div>
            <div style={{ background:"#0f1422", border:"1px solid #1e2436", borderRadius:16, display:"flex", flexDirection:"column", height:400 }}>
              <div style={{ flex:1, overflowY:"auto", padding:16 }}>
                {messages.map((msg, i) => <Message key={i} msg={msg} client={client} />)}
                {isTyping && <div style={{ display:"flex", gap:6, padding:"10px 14px", background:"#1a1f2e", borderRadius:12, width:"fit-content", marginBottom:8 }}>{[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:"50%", background:pc, animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }} />)}</div>}
                <div ref={bottomRef} />
              </div>
              {messages.length <= 1 && !isTyping && quickPrompts.length > 0 && (
                <div style={{ padding:"0 14px 12px", display:"flex", flexWrap:"wrap", gap:6 }}>
                  {quickPrompts.map(p => <button key={p} onClick={() => sendMessage(p)} style={{ background:`${ac}15`, border:`1px solid ${ac}33`, color:"#a78bfa", borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight:500, cursor:"pointer" }}>{p}</button>)}
                </div>
              )}
              <div style={{ borderTop:"1px solid #1e2436", padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-end" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type a message…" rows={1} style={{ flex:1, background:"#1a1f2e", border:"1px solid #2a3044", borderRadius:10, padding:"10px 14px", color:"#e2e8f0", fontSize:14, resize:"none", outline:"none", fontFamily:"inherit", lineHeight:1.4 }} />
                <button onClick={() => sendMessage()} disabled={!input.trim()||isTyping} style={{ background:input.trim()&&!isTyping?`linear-gradient(135deg,${ac},${pc})`:"#1e2436", border:"none", borderRadius:10, width:42, height:42, cursor:input.trim()&&!isTyping?"pointer":"default", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0 }}>→</button>
              </div>
            </div>
          </>
        )}
      </div>
      <div style={{ textAlign:"center", padding:12, fontSize:11, color:"#1e2436", borderTop:"1px solid #1e2436" }}>Powered by NovaCare · {client.name} AI Support</div>
    </div>
  );
}
export async function getStaticPaths() {
  return { paths: Object.keys(clients).map(slug => ({ params:{ slug } })), fallback:false };
}
export async function getStaticProps({ params }) {
  const client = getClient(params.slug);
  if (!client) return { notFound:true };
  return { props:{ client, slug:params.slug } };
}
