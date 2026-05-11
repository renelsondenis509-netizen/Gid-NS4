import { getNotifications } from "../utils/helpers";

export const GLOBAL_STYLES = `
  @keyframes popIn    { from{opacity:0;transform:scale(.5)}  to{opacity:1;transform:scale(1)} }
  @keyframes pulse    { 0%,100%{opacity:.3} 50%{opacity:1} }
  @keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes fadeIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes heartPop { 0%{transform:scale(1)} 50%{transform:scale(1.4)} 100%{transform:scale(1)} }
  @keyframes ringPulse{ 0%{opacity:.6;transform:scale(1)} 100%{opacity:0;transform:scale(1.15)} }
  @keyframes slideIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
`;

// ─── ERROR TOAST ─────────────────────────────────────────────
export function ErrorToast({ error, onRetry, onDismiss }) {
  if (!error) return null;
  return (
    <div style={{ margin:"0 12px 8px", padding:"12px 14px", borderRadius:18, display:"flex", gap:12, alignItems:"flex-start", background: error.type==="quota"?"rgba(30,58,138,0.2)":"rgba(127,29,29,0.25)", border:`1px solid ${error.type==="quota"?"rgba(59,130,246,0.3)":"rgba(239,68,68,0.3)"}`, animation:"fadeIn .3s ease both" }}>
      <span style={{ fontSize:20, flexShrink:0 }}>{error.icon}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontWeight:700, fontSize:13, margin:"0 0 2px", color: error.type==="quota"?"#93c5fd":"#fca5a5" }}>{error.message}</p>
        {error.detail && <p style={{ fontSize:11, margin:"0 0 8px", color: error.type==="quota"?"#6080c0":"#f87171" }}>{error.detail}</p>}
        <div style={{ display:"flex", gap:8 }}>
          {error.retry && onRetry && (
            <button onClick={onRetry} style={{ padding:"4px 12px", borderRadius:10, fontSize:11, fontWeight:700, color:"#fff", background:"linear-gradient(135deg,#d4002a,#ff6b35)", border:"none", cursor:"pointer" }}>🔄 Eseye Ankò</button>
          )}
          <button onClick={onDismiss} style={{ padding:"4px 12px", borderRadius:10, fontSize:11, fontWeight:600, background:"rgba(255,255,255,0.08)", color:"#94a3b8", border:"none", cursor:"pointer" }}>Fèmen</button>
        </div>
      </div>
    </div>
  );
}

// ─── EXPIRY BANNER ───────────────────────────────────────────
export function ExpiryBanner({ daysRemaining }) {
  if (!daysRemaining || daysRemaining > 7) return null;
  const urgent = daysRemaining <= 2;
  return (
    <div style={{ padding:"8px 16px", textAlign:"center", fontSize:12, fontWeight:600, color:"#fff", background: urgent ? "linear-gradient(90deg,#b91c1c,#dc2626)" : "linear-gradient(90deg,#92400e,#b45309)", borderBottom:`1px solid ${urgent?"rgba(239,68,68,0.3)":"rgba(245,158,11,0.3)"}` }}>
      {urgent ? "🚨" : "⚠️"} Kòd ou a ekspire nan {daysRemaining} jou — Kontakte direksyon lekòl ou
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────
export function BottomNav({ active, onNavigate }) {
  const notif = getNotifications();

  const tabs = [
    {
      id:"chat", label:"Chat", badge:notif.chat,
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={on?"#E8002A":"none"} stroke={on?"#E8002A":"#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      id:"quiz", label:"Quiz", badge:notif.quiz,
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={on?"#E8002A":"none"} stroke={on?"#E8002A":"#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
    {
      id:"leaderboard", label:"Klasman", badge:notif.leaderboard,
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?"#E8002A":"#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
        </svg>
      ),
    },
    {
      id:"history", label:"Istorik", badge:notif.history,
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?"#E8002A":"#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v5h5"/>
          <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
          <path d="M12 7v5l4 2"/>
        </svg>
      ),
    },
    {
      id:"menu", label:"Meni", badge:notif.menu,
      icon: (on) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on?"#E8002A":"#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display:"flex", background:"rgba(6,11,32,0.98)", backdropFilter:"blur(28px)", borderTop:"1px solid rgba(255,255,255,0.06)", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {tabs.map(tab => {
        const on = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 8px", border:"none", background:"none", cursor:"pointer", position:"relative", transition:"transform .15s" }}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.85)"}
            onTouchEnd={e   => e.currentTarget.style.transform="scale(1)"}>

            {/* Pill indicateur actif */}
            {on && (
              <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:36, height:3, borderRadius:"0 0 3px 3px", background:"linear-gradient(90deg,#E8002A,#ff5c35)" }} />
            )}

            {/* Icon avec background si actif */}
            <div style={{ position:"relative", width:40, height:32, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:10, background: on ? "rgba(232,0,42,0.1)" : "transparent", transition:"background .2s" }}>
              {tab.icon(on)}
              {tab.badge > 0 && (
                <div style={{ position:"absolute", top:-2, right:-2, background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", fontSize:9, fontWeight:800, minWidth:16, height:16, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 4px", border:"2px solid rgba(6,11,32,0.98)" }}>
                  {tab.badge > 9 ? "9+" : tab.badge}
                </div>
              )}
            </div>

            <span style={{ fontSize:10, fontWeight: on ? 800 : 500, color: on ? "#E8002A" : "#ffffff", marginTop:2, letterSpacing: on ? "0.02em" : 0 }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
