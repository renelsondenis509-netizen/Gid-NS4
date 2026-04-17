import { useState, useEffect } from "react";
import { callEdge, parseApiError } from "../api";
import { BottomNav } from "../components/UI";

function LeaderboardScreen({ user, onNavigate }) {
  const [tab, setTab] = useState("bestNote");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    callEdge({ action: "get_leaderboard", phone: user.phone, schoolCode: user.code })
      .then(d => setData(d))
      .catch(e => setError(parseApiError(e).message))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "bestNote", icon: "🏆", label: "Pi bon nòt", valueLabel: "/20" },
    { id: "totalCorrect", icon: "🔥", label: "Total Kòrèk", valueLabel: " pts" },
    { id: "thisWeek", icon: "📅", label: "Semèn Sa", valueLabel: " pts" },
  ];

  const currentTab = tabs.find(t => t.id === tab);
  const board = data ? data[tab] : [];
  const colors = ["#fbbf24","#94a3b8","#cd7c32","#3b82f6","#22c55e","#a855f7","#f97316","#14b8a6","#ec4899","#6366f1"];
  const medalEmojis = ["🥇","🥈","🥉"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-3">
          <span style={{ fontSize: 24 }}>🏆</span>
          <div>
            <h2 className="text-white font-bold">Klasman</h2>
            <p className="text-blue-400 text-xs">{user.school}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg,#d4002a,#ff6b35)" : "#0f1e4a",
                color: tab === t.id ? "white" : "#4b5ea8",
                border: tab === t.id ? "none" : "1px solid #1e3a8a33",
              }}>
              {t.icon} {t.label}            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman Klasman an...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl px-4 py-4 text-center" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
            <p className="text-red-400 text-sm">⚠️ {error}</p>
            <button onClick={() => { setLoading(true); setError(null); callEdge({ action: "get_leaderboard", phone: user.phone, schoolCode: user.code }).then(d => setData(d)).catch(e => setError(parseApiError(e).message)).finally(() => setLoading(false)); }}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
              🔄 Eseye Ankò
            </button>
          </div>
        )}

        {!loading && !error && board?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <span style={{ fontSize: 56 }}>📊</span>
            <p className="text-blue-400 text-center text-sm">Pa gen done ankò.<br />Fè kèk quiz pou parèt nan klasman an !</p>
            <button onClick={() => onNavigate("quiz")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Quiz</button>
          </div>
        )}

        {!loading && !error && board?.length > 0 && (
          <>
            {/* Top 3 podium */}
            {board.length >= 3 && (
              <div className="flex items-end justify-center gap-3 py-4" style={{ animation: "fadeIn .5s ease both" }}>
                {/* 2nd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🥈</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"12px 8px", height:80, background:"linear-gradient(180deg,rgba(148,163,184,0.15),rgba(148,163,184,0.05))",
                    border:"1px solid rgba(148,163,184,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[1].name || board[1].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#94A3B8", fontSize:15 }}>{board[1].value}{currentTab.valueLabel}</div>                  </div>
                </div>
                {/* 1st */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:36, marginBottom:6, filter:"drop-shadow(0 0 12px #F59E0B)" }}>🥇</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"14px 8px", height:100, background:"linear-gradient(180deg,rgba(251,191,36,0.2),rgba(251,191,36,0.05))",
                    border:"1px solid rgba(251,191,36,0.35)", borderBottom:"none",
                    boxShadow:"0 -4px 20px rgba(251,191,36,0.15)"
                  }}>
                    <div style={{ color:"#FDE68A", fontWeight:800, fontSize:11, textAlign:"center", lineHeight:1.3 }}>{board[0].name || board[0].phone}</div>
                    <div style={{ fontWeight:900, marginTop:6, color:"#FBD04A", fontSize:20 }}>{board[0].value}{currentTab.valueLabel}</div>
                    {board[0].isMe && <div style={{ color:"#F59E0B", fontSize:10, marginTop:4 }}>← Ou</div>}
                  </div>
                </div>
                {/* 3rd */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>🥉</div>
                  <div style={{
                    width:"100%", borderRadius:"14px 14px 0 0", display:"flex", flexDirection:"column", alignItems:"center",
                    padding:"10px 6px", height:65, background:"linear-gradient(180deg,rgba(205,124,50,0.15),rgba(205,124,50,0.05))",
                    border:"1px solid rgba(205,124,50,0.25)", borderBottom:"none"
                  }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:10, textAlign:"center", lineHeight:1.3 }}>{board[2].name || board[2].phone}</div>
                    <div style={{ fontWeight:900, marginTop:5, color:"#CD7C32", fontSize:14 }}>{board[2].value}{currentTab.valueLabel}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste complète */}
            <div className="space-y-2">
              {board.map((entry, i) => (
                <div key={i} style={{
                    display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:14,
                    background: entry.isMe ? "rgba(37,99,235,0.15)" : "rgba(15,28,60,0.80)",
                    border: entry.isMe ? "1.5px solid rgba(37,99,235,0.5)" : "1px solid rgba(255,255,255,0.10)",
                    animation: `slideIn .3s ${i * 0.04}s ease both`,
                    boxShadow: entry.isMe ? "0 4px 20px rgba(37,99,235,0.15)" : "0 2px 8px rgba(0,0,0,0.15)"
                  }}>
                  <div style={{
                    width:32, height:32, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, fontSize:12, flexShrink:0,
                    background:`${colors[i % colors.length]}20`, color:colors[i % colors.length]
                  }}>
                    {i < 3 ? medalEmojis[i] : `#${entry.rank}`}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>                      <span style={{ color:"#E8EEFF", fontWeight:700, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{entry.name || entry.phone}</span>
                      {entry.isMe && (
                        <span style={{ padding:"2px 7px", borderRadius:20, fontSize:10, fontWeight:700, background:"#2563EB", color:"white", flexShrink:0 }}>Ou</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight:900, fontSize:17, color:colors[i % colors.length], flexShrink:0 }}>
                    {entry.value}<span style={{ fontSize:10, fontWeight:400, opacity:0.6 }}>{currentTab.valueLabel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ma position si pas dans top 10 */}
            {data && !board.find(e => e.isMe) && (
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background: "#1a4fd622", border: "1px solid #3b82f633" }}>
                <p className="text-blue-300 text-xs">Fè plis quiz pou parèt nan top 10 lan ! </p>
              </div>
            )}

            {data?.currentWeek && tab === "thisWeek" && (
              <p className="text-blue-800 text-xs text-center">Semèn : {data.currentWeek}</p>
            )}
          </>
        )}
      </div>
      <BottomNav active="leaderboard" onNavigate={onNavigate} />
    </div>
  );
}

export default LeaderboardScreen;
