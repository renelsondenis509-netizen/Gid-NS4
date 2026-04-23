import { APP_LOGO } from "../config";
import { BottomNav } from "../components/UI";

export function MenuScreen({ user, onNavigate, onLogout }) {
  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const KeyIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#6B8ADB" }}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  const AlertIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ff8080" }}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#86efac" }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  const ChartBarIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
      <rect x="2" y="20" width="20" height="2" rx="1" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );

  const HandshakeIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#f59e0b" }}>
      <path d="m11 17 2 2a1 1 0 1 0 3-1.732l-9.163-9.163a3 3 0 0 1 4.243 0l.132.132a1 1 0 0 0 1.414 0l.132-.132a3 3 0 0 1 4.243 0L20 11.268" />
      <path d="m13 7-2-2a1 1 0 1 0-3 1.732l9.163 9.163a3 3 0 0 1-4.243 0l-.132-.132a1 1 0 0 0-1.414 0l-.132.132a3 3 0 0 1-4.243 0L4 12.732" />
    </svg>
  );
  const LockIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#22c55e" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  // ─── MENU ITEMS DATA ─────────────────────────────────────────────────────
  const menuItems = [
    { icon: <ChartBarIcon />, label: "Aksè Direksyon", screen: "dashboard" },
    { icon: <CreditCardIcon />, label: "Pèman", screen: "payment" },
    { icon: <HandshakeIcon />, label: "Patenarya", screen: "partner" },
  ];
// ─── BADGES ──────────────────────────────────────────────────────────────
const computeBadges = () => {
  const badges = [];
  try {
    const grades = JSON.parse(localStorage.getItem(`grades_${user.phone}`) || "{}");
    const allGrades = Object.values(grades);
    const totalQuizzes = allGrades.length;
    const perfect = allGrades.filter(g => g.note20 >= 20).length;
    const subjects20 = new Set(Object.keys(grades).filter(k => grades[k]?.note20 >= 20));

    const imgKey  = `gid_img_${user.phone}`;
    const txtKey  = `gid_txt_${user.phone}`;
    const imgTotal = Object.keys(localStorage).filter(k => k.startsWith(imgKey)).reduce((a, k) => a + parseInt(localStorage.getItem(k) || "0"), 0);
    const txtTotal = Object.keys(localStorage).filter(k => k.startsWith(txtKey)).reduce((a, k) => a + parseInt(localStorage.getItem(k) || "0"), 0);
    const totalScans = imgTotal + txtTotal;

    if (totalScans >= 1)   badges.push({ icon:"🎯", label:"Premye Kesyon", color:"#fbbf24" });
    if (totalScans >= 50)  badges.push({ icon:"📚", label:"Elèv Asidu",    color:"#3b82f6" });
    if (totalQuizzes >= 1) badges.push({ icon:"⭐", label:"Premye Quiz",   color:"#f59e0b" });
    if (perfect >= 1)      badges.push({ icon:"🏆", label:"Pafè 20/20",    color:"#fbbf24" });
    if (subjects20.size >= 3) badges.push({ icon:"💎", label:"Maèt",       color:"#a855f7" });
    if (totalScans >= 100) badges.push({ icon:"🔥", label:"Eksplozif",     color:"#ef4444" });
  } catch {}
  return badges;
};

const badges = computeBadges();
Puis dans la Profile Card, juste après le bloc <div style={{ color:"#3B5BA8"...}}>{user.school}</div>, ajoute :
{badges.length > 0 && (
  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
    {badges.map((b, i) => (
      <div key={i} style={{
        display:"flex", alignItems:"center", gap:4,
        padding:"3px 8px", borderRadius:20,
        background:`${b.color}18`, border:`1px solid ${b.color}44`,
        fontSize:10, fontWeight:700, color:b.color
      }}>
        <span style={{ fontSize:12 }}>{b.icon}</span> {b.label}
      </div>
    ))}
  </div>
)}
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div style={{ padding:"32px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        {/* Profile Card */}
        <div style={{
          background:"rgba(15,28,60,0.80)", backdropFilter:"blur(20px)",
          border:"1px solid rgba(255,255,255,0.12)", borderRadius:20,
          padding:"16px", display:"flex", alignItems:"center", gap:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <div style={{ width:52, height:52, borderRadius:14, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 4px 16px rgba(0,0,0,0.3)" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name || user.phone}</div>
            <div style={{ color:"#4B6ABA", fontSize:11, marginTop:2 }}>{user.phone}</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:4 }}>
              <span style={{ 
                background:"rgba(37,99,235,0.15)", 
                border:"1px solid rgba(37,99,235,0.25)", 
                borderRadius:20, 
                padding:"2px 8px", 
                color:"#6B8ADB", 
                fontSize:10, 
                fontWeight:600,
                display: "flex",
                alignItems: "center",
                gap: 4
              }}>
                <KeyIcon /> {user.code}
              </span>
            </div>
          </div>
        </div>
        <div style={{ color:"#3B5BA8", fontSize:11, textAlign:"center", marginTop:10 }}>{user.school}</div>        <div className="mt-4 rounded-xl px-4 py-3 flex justify-between items-center"
          style={{ background: user.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${user.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>
            <div className="text-xs font-bold flex items-center gap-2" style={{ color: user.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {user.daysRemaining <= 7 ? <><AlertIcon /> Ekspire byento</> : <><CheckIcon /> Kòd Aktif</>}
            </div>
            <div className="text-xs mt-0.5" style={{ color: user.daysRemaining <= 7 ? "#ff6060" : "#6ee7b7" }}>
              {user.daysRemaining} jou rete • {user.dailyScans} scan/jou
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-400">{user.subjects.length} matière{user.subjects.length > 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>
      <div className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item, i) => (
          <button key={item.screen} onClick={() => onNavigate(item.screen)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left active:scale-95 transition-transform"
            style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <div style={{ flexShrink: 0 }}>{item.icon}</div>
            <span className="text-white font-medium">{item.label}</span>
            <span className="ml-auto text-blue-600">›</span>
          </button>
        ))}
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: "#14532d15", border: "1px solid #22c55e22" }}>
          <div style={{ flexShrink: 0 }}><LockIcon /></div>
          <div>
            <div className="text-green-300 text-sm font-semibold">Koneksyon Sekirize</div>
            <div className="text-green-800 text-xs">Kle API pwoteje</div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button onClick={onLogout} className="w-full py-4 rounded-2xl text-red-400 font-semibold"
          style={{ background: "#d4002a15", border: "1px solid #d4002a30" }}>Dekonekte</button>
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}

export default MenuScreen;
