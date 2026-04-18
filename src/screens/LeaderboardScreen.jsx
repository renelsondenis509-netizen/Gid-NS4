import { useState, useEffect } from "react";
import { callEdge, parseApiError } from "../api";
import { BottomNav } from "../components/UI";

const IcoTrophy  = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IcoFlame   = ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const IcoCalendar= ({size=20}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoWarning = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoRefresh = ({size=13}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>;
const IcoChart   = ({size=48}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

const Medal = ({ rank }) => {
  const configs = {
    0: { color:"#FBD04A", bg:"rgba(251,191,36,0.2)", border:"rgba(251,191,36,0.35)", shadow:"rgba(251,191,36,0.3)" },
    1: { color:"#94A3B8", bg:"rgba(148,163,184,0.15)", border:"rgba(148,163,184,0.25)", shadow:"transparent" },
    2: { color:"#CD7C32", bg:"rgba(205,124,50,0.15)", border:"rgba(205,124,50,0.25)", shadow:"transparent" },
  };
  const c = configs[rank];
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ filter: rank===0?`drop-shadow(0 0 6px ${c.shadow})`:"none" }}>
      <circle cx="12" cy="14" r="7" fill={c.bg} stroke={c.border}/>
      <path d="M7.5 4.27l.94 1.63M5.5 6.18l1.63.94M3 9h2M5.5 11.82l1.63-.94M7.5 13.73l.94-1.63" stroke={c.color}/>
      <text x="12" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill={c.color} stroke="none">{rank+1}</text>
    </svg>
  );
};

export function LeaderboardScreen({ user, onNavigate }) {
  const [tab, setTab] = useState("bestNote");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true); setError(null);
    callEdge({ action:"get_leaderboard", phone:user.phone, schoolCode:user.code })
      .then(d => setData(d))
      .catch(e => setError(parseApiError(e).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const tabs = [
    { id:"bestNote",    Icon:IcoTrophy,   label:"Pi bon nòt",  valueLabel:"/20" },
    { id:"totalCorrect",Icon:IcoFlame,    label:"Total Kòrèk", valueLabel:" pts" },
    { id:"thisWeek",    Icon:IcoCalendar, label:"Semèn Sa",    valueLabel:" pts" },
  ];

  const currentTab = tabs.find(t => t.id === tab);
  const board = data ? data[tab] : [];
  const colors = ["#fbbf24","#94a3b8","#cd7c32","#3b82f6","#22c55e","#a855f7","#f97316","#14b8a6","#ec4899","#6366f1"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background:"rgba(10,15,46,0.98)", borderColor:"#ffffff10" }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ color:"#fbbf24" }}><IcoTrophy size={24}/></span>
          <div>
            <h2 className="text-white font-bold">Klasman</h2>
            <p className="text-blue-400 text-xs">{user.school}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {tabs.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
              style={{ background:tab===id?"linear-gradient(135deg,#d4002a,#ff6b35)":"#0f1e4a", color:tab===id?"white":"#4b5ea8", border:tab===id?"none":"1px solid #1e3a8a33" }}>
              <Icon size={13}/> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation:`bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman Klasman an...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background:"#7f1d1d22", border:"1px solid #ef444433" }}>
            <p className="text-red-400 text-sm flex items-center justify-center gap-2"><IcoWarning/> {error}</p>
            <button onClick={load} className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1 mx-auto"
              style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>
              <IcoRefresh/> Eseye Ankò
            </button>
          </div>
        )}

        {!loading && !error && board?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <IcoChart/>
            <p className="text-blue-400 text-center text-sm">Pa gen done ankò.<br/>Fè kèk quiz pou parèt nan klasman an !</p>
            <button onClick={() => onNavigate("quiz")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Quiz</button>
          </div>
        )}

        {!loading && !error && board?.length > 0 && (
          <>
            {board.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4" style={{ animation:"fadeIn .5s ease both" }}>
                {[1,0,2].map(rank => {
                  const entry = board[rank];
                  const heights = [100,80,65];
                  return (
                    <div key={rank} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                      <div style={{ marginBottom:6 }}><Medal rank={rank}/></div>
                      <div style={{
                        width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column",
                        alignItems:"center", padding:"10px 6px", height:heights[rank],
                        background:`linear-gradient(180deg,${colors[rank]}18,${colors[rank]}05)`,
                        border:`1px solid ${colors[rank]}40`, borderBottom:"none"
                      }}>
                        <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:10, textAlign:"center", lineHeight:1.3 }}>{entry.name||entry.phone}</div>
                        <div style={{ fontWeight:900, marginTop:5, color:colors[rank], fontSize:rank===0?20:14 }}>{entry.value}{currentTab.valueLabel}</div>
                        {entry.isMe && <div style={{ color:colors[rank], fontSize:10, marginTop:3 }}>← Ou</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              {board.map((entry, i) => (
                <div key={i} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14,
                  background:entry.isMe?"rgba(37,99,235,0.15)":"rgba(15,28,60,0.80)",
                  border:entry.isMe?"1.5px solid rgba(37,99,235,0.5)":"1px solid rgba(255,255,255,0.10)",
                  animation:`slideIn .3s ${i*0.04}s ease both`
                }}>
                  <div style={{ width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0, background:`${colors[i%colors.length]}20`, color:colors[i%colors.length] }}>
                    {i < 3 ? <Medal rank={i}/> : `#${entry.rank}`}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ color:"#E8EEFF", fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.name||entry.phone}</span>
                      {entry.isMe && <span style={{ padding:"2px 7px", borderRadius:20, fontSize:10, fontWeight:700, background:"#2563EB", color:"white", flexShrink:0 }}>Ou</span>}
                    </div>
                  </div>
                  <div style={{ fontWeight:900, fontSize:17, color:colors[i%colors.length], flexShrink:0 }}>
                    {entry.value}<span style={{ fontSize:10, fontWeight:400, opacity:0.6 }}>{currentTab.valueLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {data && !board.find(e => e.isMe) && (
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background:"#1a4fd622", border:"1px solid #3b82f633" }}>
                <p className="text-blue-300 text-xs">Fè plis quiz pou parèt nan top 10 lan !</p>
              </div>
            )}
            {data?.currentWeek && tab==="thisWeek" && (
              <p className="text-blue-800 text-xs text-center">Semèn : {data.currentWeek}</p>
            )}
          </>
        )}
      </div>
      <BottomNav active="leaderboard" onNavigate={onNavigate}/>
    </div>
  );
}

export default LeaderboardScreen;