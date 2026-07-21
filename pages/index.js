import { clients } from "../lib/clients";
import Link from "next/link";
export default function Home({ clientList }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0b0e1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px" }}>
      <div style={{ textAlign:"center", maxWidth:540, marginBottom:48 }}>
        <h1 style={{ fontSize:42, fontWeight:800, letterSpacing:"-1.5px", lineHeight:1.1, marginBottom:16, color:"#e2e8f0" }}>NovaCare <span style={{ color:"#00d4aa" }}>AI Support</span></h1>
        <p style={{ fontSize:16, color:"#64748b", lineHeight:1.6 }}>White-label AI customer support for Zambian businesses.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:16, width:"100%", maxWidth:860 }}>
        {clientList.map(c => (
          <Link key={c.slug} href={`/chat/${c.slug}`} style={{ textDecoration:"none" }}>
            <div style={{ background:"#111627", border:"1px solid #1e2436", borderRadius:16, padding:24, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${c.primaryColor}22`, border:`1px solid ${c.primaryColor}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:c.primaryColor }}>{c.logo}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:"#e2e8f0" }}>{c.name}</div>
                  <div style={{ fontSize:11, color:"#64748b" }}>Agent: {c.agentName}</div>
                </div>
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:c.primaryColor }}>Open chat →</div>
            </div>
          </Link>
        ))}
      </div>
      <p style={{ marginTop:48, fontSize:12, color:"#2a3044" }}>Powered by Claude · NovaCare AI Infrastructure · Zambia</p>
    </div>
  );
}
export async function getStaticProps() {
  const clientList = Object.entries(clients).map(([slug, c]) => ({ slug, name:c.name, agentName:c.agentName, primaryColor:c.primaryColor, logo:c.logo }));
  return { props: { clientList } };
}
