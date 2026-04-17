import { getNotifications } from "../utils/helpers";

// ─── BUG FIX 1 : keyframes ringPulse + fadeUp + slideIn ajoutés ─────────────
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

// ─── ERROR TOAST ─────────────────────────────────────────────────────────────
export function ErrorToast({ error, onRetry, onDismiss }) {
  if (!error) return null;
  return (
    <div className="mx-3 mb-2 px-4 py-3 rounded-2xl flex gap-3 items-start"
      style={{ background: error.type==="quota"?"#1e3a8a22":"#7f1d1d33", border:`1px solid ${error.type==="quota"?"#3b82f644":"#ef444444"}`, animation:"fadeIn .3s ease both" }}>
      <span style={{ fontSize:20, flexShrink:0 }}>{error.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm" style={{ color: error.type==="quota"?"#93c5fd":"#fca5a5" }}>{error.message}</p>
        {error.detail && <p className="text-xs mt-0.5" style={{ color: error.type==="quota"?"#6080c0":"#f87171" }}>{error.detail}</p>}
        <div className="flex gap-2 mt-2">
          {error.retry && onRetry && (
            <button onClick={onRetry} className="px-3 py-1 rounded-lg text-xs font-bold text-white"
              style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          )}
          <button onClick={onDismiss} className="px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background:"#ffffff15", color:"#94a3b8" }}>Fèmen</button>
        </div>
      </div>
    </div>
  );
}

// ─── EXPIRY BANNER ───────────────────────────────────────────────────────────
export function ExpiryBanner({ daysRemaining }) {
  if (!daysRemaining || daysRemaining > 7) return null;
  const urgent = daysRemaining <= 2;
  return (
    <div className="px-4 py-2 text-xs text-center font-semibold" style={{ background: urgent?"#d4002a":"#92400e", color:"white" }}>
      {urgent?"🚨":"⚠️"} Kòd ou a ekspire nan {daysRemaining} jou — Kontakte direksyon lekòl ou
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
export function BottomNav({ active, onNavigate }) {
  const notif = getNotifications();
  const tabs = [
    { id:"chat",        label:"Chat",    badge:notif.chat,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id:"quiz",        label:"Quiz",    badge:notif.quiz,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id:"leaderboard", label:"Klasman", badge:notif.leaderboard,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> },
    { id:"history",     label:"Istwa",   badge:notif.history,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg> },
    { id:"menu",        label:"Meni",    badge:notif.menu,
      icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg> },
  ];
  return (
    <div style={{ display:"flex", background:"rgba(10,15,46,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.10)", paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
      {tabs.map(tab => {
        const on = active === tab.id;
        return (
          <button key={tab.id} onClick={() => onNavigate(tab.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"10px 0 8px", border:"none", background:"none", position:"relative" }}
            onTouchStart={e => e.currentTarget.style.transform="scale(0.88)"}
            onTouchEnd={e   => e.currentTarget.style.transform="scale(1)"}>
            {on && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:32, height:2, borderRadius:2, background:"linear-gradient(90deg,#E8002A,#FF5C35)" }} />}
            <span style={{ color:on?"#FF5C35":"#4B5EA8", position:"relative" }}>
              {tab.icon}
              {tab.badge > 0 && (
                <div style={{ position:"absolute", top:-8, right:-8, background:"linear-gradient(135deg,#EF4444,#DC2626)", color:"#fff", fontSize:10, fontWeight:800, minWidth:18, height:18, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px", border:"2px solid #0a0f2e" }}>
                  {tab.badge > 9 ? "9+" : tab.badge}
                </div>
              )}
            </span>
            <span style={{ fontSize:9, fontWeight:on?700:500, color:on?"#FF5C35":"#4B5EA8", marginTop:2 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

