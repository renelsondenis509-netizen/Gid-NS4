import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge, parseApiError } from "../api";

export function LoginScreen({ onLogin, onNavigate, expired = false }) {
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [code,  setCode]  = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasTriedFreemium] = useState(() => {
    const exp = localStorage.getItem("gid_freemium_expires");
    if (!exp) return false;
    return new Date(exp) > new Date(); // masque seulement si encore actif
  });

const handleLogin = async () => {
  try {
    const result = await callEdge({ action:"validate_code", phone:phone.trim(), schoolCode:code.toUpperCase().trim() });
  if (!result.valid) { setError(result.reason || "Kòd la pa valid."); setLoading(false); return; }

  // ✅ FIX : sync localStorage avec valeur serveur (indépendant de l'appareil)
  const _today = new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
  try { localStorage.setItem(`gid_scan_${phone.trim()}_${_today}`, String(result.scansToday ?? 0)); } catch {}

      onLogin({
          name:            name.trim(),
          phone:           phone.trim(),
          code:            code.toUpperCase().trim(),
          school:          result.school.name,
          subjects:        result.school.subjects,
          dailyScans:      result.school.dailyScans,
          dailyImageScans: result.school.dailyImageScans ?? 1,
          dailyTextScans:  result.school.dailyTextScans  ?? 4,
          daysRemaining:   result.school.daysRemaining,
          expiresAt:       result.school.expiresAt,
          freemiumExpiresAt: null,
          isAdmin:         result.isAdmin ?? false,
          scansToday:      result.scansToday,
      });
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  const handleFreemium = async () => {
    setError("");
    if (!name.trim() || name.trim().length < 2) { setError("Antre non ou ki valid (omwen 2 lèt)."); return; }
    if (!phone.trim() || phone.trim().length < 8)       { setError("Antre yon nimewo telefòn valid."); return; }
    setLoading(true);
    try {
      const result = await callEdge({ action:"freemium_login", phone:phone.trim(), name:name.trim() });
      localStorage.setItem("gid_freemium_expires", result.freemiumExpiresAt ?? new Date(Date.now()+3*86400000).toISOString());
      const _today = new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
      try { localStorage.setItem(`gid_scan_${phone.trim()}_${_today}`, String(result.scansToday ?? 0)); } catch {}
      onLogin({
        name: name.trim(), phone: phone.trim(),
        code: "FREEMIUM", school: "Freemium",
        subjects: ["Créole","Français","Anglais","Espagnol","Dissertation","Littérature Haïtienne","Littérature Française","Éducation Esthétique et Artistique","Éducation Physique et Sportive","Éducation à la Citoyenneté","Numérique et Informatique"],
        dailyScans: result.dailyScans ?? 3, dailyImageScans: result.dailyImageScans ?? 1, dailyTextScans: result.dailyTextScans ?? 3,
        daysRemaining: result.daysRemaining,
        expiresAt: result.freemiumExpiresAt,
        freemiumExpiresAt: result.freemiumExpiresAt,
        scansToday: result.scansToday ?? 0,
      });
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  const fields = [
    { label:"Non Konplè",     type:"text", val:name,  fn:e=>setName(e.target.value),               ph:"Marie Joseph",  extra:{} },
    { label:"Nimewo Telefòn", type:"tel",  val:phone, fn:e=>setPhone(e.target.value),              ph:"50934567890",   extra:{} },
    { label:"Kòd Etablisman", type:"text", val:code,  fn:e=>setCode(e.target.value.toUpperCase()), ph:"DNMM-0000",     extra:{ fontFamily:"monospace", letterSpacing:"0.14em", fontWeight:700 } },
  ];

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", overflow:"hidden", background:"linear-gradient(160deg,#03060F 0%,#06091A 50%,#0A0720 100%)" }}>

      {expired && (
        <div style={{ position:"relative", zIndex:10, background:"linear-gradient(90deg,#7f1d1d,#991b1b)", padding:"10px 16px", textAlign:"center", fontSize:13, color:"#fca5a5", fontWeight:600 }}>
          ⚠️ Kòd ou a ekspire — Kontakte direksyon lekòl ou pou renouvle.
        </div>
      )}
      {/* Orbes décoratifs */}
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,#2563EB0D,transparent 60%)", top:"-20%", right:"-25%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#7C3AED08,transparent 60%)", bottom:"-10%", left:"-20%", pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,#E8002A07,transparent 60%)", top:"30%", left:"-10%", pointerEvents:"none" }} />

      {/* Contenu centré */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px 20px 0", animation:"fadeUp .5s ease both" }}>

        {/* Logo + titre */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
          <div style={{ width:76, height:76, borderRadius:22, background:"#fff", overflow:"hidden", boxShadow:"0 0 0 1px rgba(37,99,235,0.15), 0 16px 48px rgba(0,0,0,0.5), 0 0 0 8px rgba(37,99,235,0.06)", marginBottom:14 }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <h1 style={{ color:"#f1f5ff", fontWeight:900, fontSize:22, margin:"0 0 4px", letterSpacing:"-0.02em" }}>Gid NS4</h1>
          <p style={{ color:"#2d4080", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", margin:0, fontWeight:600 }}>Asistan IA pou elèv NS4</p>
        </div>

        {/* Card */}
        <div style={{ width:"100%", maxWidth:380, background:"rgba(10,18,45,0.85)", backdropFilter:"blur(28px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:28, padding:"26px 22px", boxShadow:"0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)" }}>

          {/* Champs */}
          {fields.map(({ label, type, val, fn, ph, extra }, i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <label style={{ display:"block", color:"#3b5ba8", fontSize:10, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:7 }}>{label}</label>
              <input type={type} value={val} onChange={fn} placeholder={ph}
                style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"13px 16px", color:"#e2e8ff", fontSize:15, outline:"none", boxSizing:"border-box", transition:"border-color .2s, box-shadow .2s", ...extra }}
                onFocus={e=>{ e.target.style.borderColor="rgba(37,99,235,0.5)"; e.target.style.boxShadow="0 0 0 3px rgba(37,99,235,0.1)"; }}
                onBlur={e =>{ e.target.style.borderColor="rgba(255,255,255,0.08)"; e.target.style.boxShadow="none"; }} />
            </div>
          ))}

          {/* Erreur */}
          {error && (
            <div style={{ background:"rgba(232,0,42,0.08)", border:"1px solid rgba(232,0,42,0.25)", borderRadius:12, padding:"10px 14px", marginBottom:14, color:"#fca5a5", fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:15 }}>⚠️</span> {error}
            </div>
          )}

          {/* Bouton principal */}
          <button onClick={handleLogin} disabled={loading}
            style={{ width:"100%", padding:"15px", borderRadius:16, background: loading ? "rgba(37,99,235,0.3)" : "linear-gradient(135deg,#E8002A,#c8001f)", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor: loading?"not-allowed":"pointer", boxShadow: loading?"none":"0 8px 28px rgba(232,0,42,0.3)", transition:"all .2s", letterSpacing:"0.02em" }}>
            {loading ? "Verifikasyon..." : "Rantre"}
          </button>

          {/* Bouton freemium */}
          <button onClick={handleFreemium} disabled={loading}
              style={{ width:"100%", padding:"13px", borderRadius:16, background:"rgba(37,99,235,0.06)", color:"#60a5fa", fontWeight:700, fontSize:14, border:"1px solid rgba(37,99,235,0.2)", cursor: loading?"not-allowed":"pointer", marginTop:10, transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span style={{ fontSize:12 }}>✦</span> {hasTriedFreemium ? "Konekte kont gratis ou" : "Eseye gratis — 3 jou"}
            </button>

          {/* Hint */}
          <p style={{ textAlign:"center", marginTop:14, marginBottom:0, color:"#2d4080", fontSize:12 }}>
            Ou poko gen kòd? <span style={{ color:"#3b5ba8" }}>Pale ak direksyon lekòl ou a.</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:"16px 0 24px", display:"flex", justifyContent:"center", alignItems:"center", gap:20 }}>
        <button onClick={()=>onNavigate("payment")} style={{ color:"#2d4080", fontSize:12, background:"none", border:"none", cursor:"pointer" }}>Pèman</button>
        <span style={{ color:"#1a2a50", fontSize:14 }}>·</span>
        <button onClick={()=>onNavigate("partner")} style={{ color:"#2d4080", fontSize:12, background:"none", border:"none", cursor:"pointer" }}>Vin Patnè</button>
        <span style={{ color:"#1a2a50", fontSize:14 }}>·</span>
        <a href="https://renelsondenis509-netizen.github.io/Gid-NS4/privacy-policy.html" target="_blank" rel="noopener noreferrer" style={{ color:"#2d4080", fontSize:12, textDecoration:"none" }}>Politik Konfidansyalite</a>
      </div>
    </div>
  );
}
