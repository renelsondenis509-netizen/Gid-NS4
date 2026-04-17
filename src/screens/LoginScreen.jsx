import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge, parseApiError } from "../api";

export function LoginScreen({ onLogin, onNavigate }) {
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Antre non ou ki valid (omwen 2 lèt)."); return; }
    if (!phone.trim() || phone.length < 8)       { setError("Antre yon nimewo telefòn valid."); return; }
    if (!code.trim())                             { setError("Antre kòd lekòl ou a."); return; }
    setLoading(true);
    try {
      const result = await callEdge({ action:"validate_code", phone:phone.trim(), schoolCode:code.toUpperCase().trim() });
      if (!result.valid) { setError(result.reason || "Kòd la pa valid."); setLoading(false); return; }
      onLogin({
        name: name.trim(), phone: phone.trim(),
        code: code.toUpperCase().trim(),
        school:          result.school.name,
        subjects:        result.school.subjects,
        dailyScans:      result.school.dailyScans,
        dailyImageScans: result.school.dailyImageScans ?? 1,
        dailyTextScans:  result.school.dailyTextScans  ?? 4,
        daysRemaining:   result.school.daysRemaining,
        expiresAt:       result.school.expiresAt,
        scansToday:      result.scansToday,
      });
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  const inputs = [
    { label:"Non Konplè",      type:"text", val:name,  fn:e=>setName(e.target.value),                   ph:"Marie Joseph",  extra:{} },
    { label:"Nimewo Telefòn",  type:"tel",  val:phone, fn:e=>setPhone(e.target.value),                  ph:"50934567890",   extra:{} },
    { label:"Kòd Etablisman",  type:"text", val:code,  fn:e=>setCode(e.target.value.toUpperCase()),     ph:"DEMO-2026",     extra:{ fontFamily:"monospace", letterSpacing:"0.12em", fontWeight:700 } },
  ];

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ background:"linear-gradient(145deg,#04081A 0%,#080E24 60%,#0D0A1E 100%)" }}>
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#2563EB0F,transparent 65%)", top:"-10%", right:"-20%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,#E8002A0A,transparent 65%)", bottom:"0%", left:"-15%", pointerEvents:"none" }} />
      <div className="flex-1 flex flex-col items-center justify-center px-5" style={{ animation:"fadeUp .5s ease both" }}>
        <div style={{ width:80, height:80, borderRadius:20, background:"#fff", overflow:"hidden", boxShadow:"0 0 0 1px #2563EB22, 0 12px 40px #00000055", marginBottom:14 }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <p style={{ color:"#4B6ABA", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:24 }}>Asistan IA pou elèv NS4</p>
        <div className="w-full" style={{ maxWidth:380, background:"rgba(15,28,60,0.80)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:24, padding:"28px 24px", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
          {inputs.map(({ label, type, val, fn, ph, extra }, i) => (
            <div key={i} style={{ marginBottom:16 }}>
              <label style={{ display:"block", color:"#5B7ADB", fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8 }}>{label}</label>
              <input type={type} value={val} onChange={fn} placeholder={ph}
                style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:"13px 16px", color:"#E8EEFF", fontSize:15, outline:"none", boxSizing:"border-box", ...extra }}
                onFocus={e=>{ e.target.style.borderColor="#2563EB66"; e.target.style.boxShadow="0 0 0 3px #2563EB18"; }}
                onBlur={e =>{ e.target.style.borderColor="rgba(255,255,255,0.1)"; e.target.style.boxShadow="none"; }} />
            </div>
          ))}
          {error && (
            <div style={{ background:"#E8002A15", border:"1px solid #E8002A33", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#FF7070", fontSize:13 }}>
              ⚠️ {error}
            </div>
          )}
          <button onClick={handleLogin} disabled={loading}
            style={{ width:"100%", padding:"15px", borderRadius:14, background:loading?"#2E4080":"linear-gradient(135deg,#E8002A,#FF5C35)", color:"white", fontWeight:800, fontSize:15, border:"none", boxShadow:loading?"none":"0 6px 24px #E8002A33", cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "⏳ Ap verifye..." : "Rantre"}
          </button>
          <div style={{ textAlign:"center", marginTop:16 }}>
            <span style={{ color:"#4b5ea8", fontSize:12 }}>Pa gen kòd ? </span>
            <span style={{ color:"#4B6ABA", fontSize:12 }}>Pale ak direksyon lekòl ou a.</span>
          </div>
        </div>
      </div>
      <div style={{ paddingBottom:24, display:"flex", justifyContent:"center", gap:24 }}>
        <button onClick={() => onNavigate("payment")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Pèman</button>
        <span style={{ color:"#2E4080", fontSize:12 }}>·</span>
        <button onClick={() => onNavigate("partner")} style={{ color:"#3B5BA8", fontSize:12, background:"none", border:"none" }}>Vin Patnè</button>
      </div>
    </div>
  );
}
