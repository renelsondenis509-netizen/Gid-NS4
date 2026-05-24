import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge } from "../api";
import { QUIZ_DATA, QUIZ_BRANCHES as FILIERES } from "../data/quizData";
import { shuffleArray, shuffleChoices } from "../utils/helpers";
import { scoreToNote20, getMention, saveQuizGrade } from "../utils/quiz";
import { BottomNav } from "../components/UI";
import { idbSavePendingScore } from "../utils/idb";
import { hasAccess } from "../utils/freemium";

// ─── ICONS ───────────────────────────────────────────────────
const HeartIcon = ({ filled = true, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: filled ? 1 : 0.18 }}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);
const FireIcon = ({ size = 14, color = "#f97316" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);
const CheckCircleIcon = ({ size = 16, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const XCircleIcon = ({ size = 16, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);
const LightbulbIcon = ({ size = 14, color = "#fbbf24" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5a6 6 0 0 0-11 0c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);
const RefreshIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);
const ChevronIcon = ({ open, color = "#fff" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition:"transform .25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

// ─── FILIÈRE CONFIG ──────────────────────────────────────────
const FILIERE_CONFIG = {
  SVT: { gradient:"linear-gradient(135deg,#052e16,#064e3b)", accent:"#22c55e", glow:"#22c55e" },
  SES: { gradient:"linear-gradient(135deg,#1c1003,#2d1f00)", accent:"#f59e0b", glow:"#f59e0b" },
  SMP: { gradient:"linear-gradient(135deg,#0c1a3d,#0f1f4d)", accent:"#3b82f6", glow:"#3b82f6" },
  LLA: { gradient:"linear-gradient(135deg,#1a0533,#220847)", accent:"#a855f7", glow:"#a855f7" },
};

// ─── SUBJECT ICON ────────────────────────────────────────────
const getSubjectIcon = (subject, size = 20, color = "#fff") => {
  const p = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:"2", strokeLinecap:"round", strokeLinejoin:"round" };
  switch(subject) {
    case "Biologie":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M8 8l8 8"/><path d="M16 8l-8 8"/></svg>;
    case "Géologie":     return <svg {...p}><path d="M3 20h18L12 4 3 20z"/><path d="M8 14l4-6 4 6"/></svg>;
    case "Chimie":       return <svg {...p}><path d="M9 3h6v8l-3 9-3-9V3z"/><circle cx="12" cy="12" r="2"/></svg>;
    case "Physique":     return <svg {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
    case "Analyse":      return <svg {...p}><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 5-10"/></svg>;
    case "Algèbre":      return <svg {...p}><path d="M4 4h16v16H4z"/><path d="M8 8l8 8"/><path d="M16 8l-8 8"/></svg>;
    case "Suite":        return <svg {...p}><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>;
    case "Complexe":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>;
    case "Probabilité":  return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5" fill={color}/><circle cx="16" cy="8" r="1.5" fill={color}/><circle cx="8" cy="16" r="1.5" fill={color}/><circle cx="16" cy="16" r="1.5" fill={color}/><circle cx="12" cy="12" r="1.5" fill={color}/></svg>;
    case "Géométrie":    return <svg {...p}><path d="M3 3l7 19 7-19 7 19H3z"/><path d="M12 3v19"/></svg>;
    case "Histoire":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>;
    case "Géographie":   return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "Économie":     return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M9 9h6"/><path d="M9 15h6"/></svg>;
    case "Philosophie":  return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>;
    case "Français":     return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>;
    case "Créole":       return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>;
    case "Anglais":      return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "Espagnol":     return <svg {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "Dissertation": return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    default:             return <svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
  }
};

// ─── QUIZ SCREEN ─────────────────────────────────────────────
export function QuizScreen({ user, onNavigate }) {
  if (!hasAccess(user)) { onNavigate("payment"); return null; }
  const [phase,         setPhase]         = useState("select");
  const [subject,       setSubject]       = useState(null);
  const [shuffledQs,    setShuffledQs]    = useState([]);
  const [qIndex,        setQIndex]        = useState(0);
  const [selected,      setSelected]      = useState(null);
  const [score,         setScore]         = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hearts,        setHearts]        = useState(3);
  const [streak,        setStreak]        = useState(0);
  const [maxStreak,     setMaxStreak]     = useState(0);
  const [wrongAnswers,  setWrongAnswers]  = useState([]);
  const [shaking,       setShaking]       = useState(false);
  const [round,         setRound]         = useState(1);
  const [roundScore,    setRoundScore]    = useState(0);
  const [usedQKeys,     setUsedQKeys]     = useState(new Set());
  const [openBranch,    setOpenBranch]    = useState(null);

  const currentQ = shuffledQs[qIndex];

  const startQCM = (sub) => {
    const all    = shuffleArray(QUIZ_DATA[sub]);
    const first10 = all.slice(0, 10).map(shuffleChoices);
    setSubject(sub); setShuffledQs(first10); setUsedQKeys(new Set(first10.map(q => q.q)));
    setPhase("qcm"); setQIndex(0); setScore(0); setTotalAnswered(0); setRoundScore(0);
    setHearts(3); setStreak(0); setMaxStreak(0); setWrongAnswers([]); setSelected(null); setRound(1);
  };

  const saveScoreToSupabase = async (finalScore, finalTotal, finalStreak) => {
    if (finalTotal === 0 || !subject) return;
    const note20 = scoreToNote20(finalScore, finalTotal);
    saveQuizGrade(user.phone, subject, note20, finalScore, finalTotal);
    try {
      if (!user.isFreemium) {
        try {
          await callEdge({ action:"save_quiz_score", phone:user.phone, schoolCode:user.code, name:user.name||user.phone, subject, score:finalScore, total:finalTotal, note20, streak:finalStreak, source:"quiz" });
        } catch {
          await idbSavePendingScore({ action:"save_quiz_score", phone:user.phone, schoolCode:user.code, name:user.name||user.phone, subject, score:finalScore, total:finalTotal, note20, streak:finalStreak, source:"quiz", ts:Date.now() });
        }
      }
    } catch {}
  };

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.answer;
    setTotalAnswered(t => t + 1);
    if (correct) {
      setScore(s => s + 1); setRoundScore(r => r + 1);
      setStreak(s => { const ns = s + 1; setMaxStreak(m => { const nm = Math.max(m, ns); return nm; }); return ns; });
    } else {
      setHearts(h => h - 1); setStreak(0);
      setShaking(true); setTimeout(() => setShaking(false), 500);
      setWrongAnswers(p => [...p.slice(-4), { q:currentQ.q, selected:idx, correctIdx:currentQ.answer, choices:currentQ.choices, note:currentQ.note }]);
    }
  };

  const handleNext = async () => {
    if (hearts <= 0) { await saveScoreToSupabase(score, totalAnswered, maxStreak); setPhase("gameover"); return; }
    const next = qIndex + 1;
    if (next >= shuffledQs.length) { await saveScoreToSupabase(score, totalAnswered, maxStreak); setPhase("bravo"); return; }
    setQIndex(next); setSelected(null);
  };

  const continueQuiz = () => {
    const all    = QUIZ_DATA[subject] || [];
    const unseen = all.filter(q => !usedQKeys.has(q.q));
    const pool   = unseen.length >= 10 ? unseen : shuffleArray(all);
    const next10 = shuffleArray(pool).slice(0, 10).map(shuffleChoices);
    setShuffledQs(next10); setUsedQKeys(prev => new Set([...prev, ...next10.map(q => q.q)]));
    setQIndex(0); setSelected(null); setRoundScore(0); setRound(r => r + 1); setPhase("qcm");
  };

  // ── SELECT ───────────────────────────────────────────────────
  if (phase === "select") {
    const totalAvailable = Object.values(FILIERES).flatMap(f => f.subjects)
      .filter(s => user.subjects.includes(s) && QUIZ_DATA[s]).length;

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background:"linear-gradient(160deg,#04081A 0%,#070d22 100%)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"rgba(6,11,32,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ width:38, height:38, borderRadius:10, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 10px #00000044" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#f1f5ff", fontWeight:800, fontSize:15 }}>Quiz NS4</div>
            <div style={{ color:"#3b5280", fontSize:11, marginTop:1 }}>{totalAvailable} matyè disponib</div>
          </div>
          {/* Mini stats */}
          <div style={{ display:"flex", gap:4 }}>{[0,1,2].map(i => <HeartIcon key={i} filled size={18}/>)}</div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding:"14px 14px 8px" }}>

          {/* Info banner */}
          <div style={{ background:"linear-gradient(135deg,rgba(232,0,42,0.1),rgba(239,68,68,0.06))", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
            <div style={{ display:"flex", gap:3 }}>{[0,1,2].map(i => <HeartIcon key={i} filled size={20}/>)}</div>
            <div>
              <div style={{ color:"#fca5a5", fontWeight:700, fontSize:12 }}>3 kè • Kesyon enfini</div>
              <div style={{ color:"#6b7280", fontSize:11, marginTop:1 }}>Jwe jouk ou pèdi 3 kè</div>
            </div>
          </div>

          <div style={{ color:"#2d4080", fontSize:10, textAlign:"center", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:12, fontWeight:700 }}>Chwazi yon filye</div>

          {/* Filières accordion */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {Object.entries(FILIERES).map(([key, filiere]) => {
              const cfg = FILIERE_CONFIG[key] || { gradient:"linear-gradient(135deg,#0f172a,#1e293b)", accent:"#3b82f6", glow:"#3b82f6" };
              const isOpen = openBranch === key;
              const availableInBranch = filiere.subjects.filter(s => user.subjects.includes(s) && QUIZ_DATA[s]).length;
              const totalQs = filiere.subjects.filter(s => QUIZ_DATA[s]).reduce((acc, s) => acc + (QUIZ_DATA[s]?.length || 0), 0);

              return (
                <div key={key} style={{ borderRadius:20, overflow:"hidden", border:`1px solid ${isOpen ? cfg.accent+"55" : "rgba(255,255,255,0.07)"}`, boxShadow: isOpen ? `0 8px 32px ${cfg.glow}22` : "0 2px 12px rgba(0,0,0,0.2)", transition:"all .3s" }}>

                  {/* Header filière */}
                  <button onClick={() => setOpenBranch(isOpen ? null : key)}
                    style={{ width:"100%", padding:"16px 18px", display:"flex", alignItems:"center", gap:14, background: isOpen ? cfg.gradient : "rgba(12,18,40,0.95)", border:"none", cursor:"pointer", transition:"background .3s" }}>

                    {/* Badge filière */}
                    <div style={{ width:52, height:52, borderRadius:14, flexShrink:0, background:`${cfg.accent}20`, border:`2px solid ${cfg.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow: isOpen ? `0 0 16px ${cfg.accent}44` : "none", transition:"box-shadow .3s" }}>
                      <span style={{ color:cfg.accent, fontWeight:900, fontSize:14, letterSpacing:"-0.02em" }}>{key}</span>
                    </div>

                    <div style={{ flex:1, textAlign:"left" }}>
                      <div style={{ color:"#f1f5ff", fontWeight:800, fontSize:14 }}>{filiere.name || key}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                        <span style={{ fontSize:11, color:"#3b5280" }}>{availableInBranch}/{filiere.subjects.length} matyè</span>
                        <span style={{ width:3, height:3, borderRadius:"50%", background:"#1e3a8a" }} />
                        <span style={{ fontSize:11, color:"#3b5280" }}>{totalQs} kesyon</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ marginTop:6, height:3, borderRadius:3, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:3, background:cfg.accent, width:`${(availableInBranch/filiere.subjects.length)*100}%`, transition:"width .4s" }} />
                      </div>
                    </div>

                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      {availableInBranch > 0 && <div style={{ width:8, height:8, borderRadius:"50%", background:cfg.accent, boxShadow:`0 0 8px ${cfg.glow}` }} />}
                      <ChevronIcon open={isOpen} color={cfg.accent} />
                    </div>
                  </button>

                  {/* Matières */}
                  {isOpen && (
                    <div style={{ background:"rgba(6,10,28,0.98)", borderTop:`1px solid ${cfg.accent}22` }}>
                      {filiere.subjects.map((sub, idx) => {
                        const available = user.subjects.includes(sub) && QUIZ_DATA[sub];
                        const qCount    = QUIZ_DATA[sub]?.length || 0;

                        return available ? (
                          <button key={sub} onClick={() => startQCM(sub)}
                            style={{ width:"100%", padding:"12px 18px 12px 22px", display:"flex", alignItems:"center", gap:12, background:"transparent", border:"none", borderBottom: idx < filiere.subjects.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor:"pointer", transition:"background .15s", animation:`fadeIn .2s ${idx*0.04}s ease both` }}
                            onTouchStart={e => e.currentTarget.style.background=`${cfg.accent}10`}
                            onTouchEnd={e => e.currentTarget.style.background="transparent"}>
                            {/* Ligne couleur */}
                            <div style={{ width:3, height:38, borderRadius:3, background:cfg.accent, flexShrink:0, opacity:0.6 }} />
                            {/* Icône */}
                            <div style={{ width:42, height:42, borderRadius:12, background:`${cfg.accent}18`, border:`1px solid ${cfg.accent}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:cfg.accent }}>
                              {getSubjectIcon(sub, 22, cfg.accent)}
                            </div>
                            <div style={{ flex:1, textAlign:"left" }}>
                              <div style={{ color:"#e2e8ff", fontWeight:700, fontSize:13 }}>{sub}</div>
                              <div style={{ color:"#3b5280", fontSize:11, marginTop:2 }}>{qCount} kesyon disponib</div>
                            </div>
                            <span style={{ color:`${cfg.accent}88`, fontSize:20 }}>›</span>
                          </button>
                        ) : (
                          <div key={sub} style={{ padding:"12px 18px 12px 22px", display:"flex", alignItems:"center", gap:12, borderBottom: idx < filiere.subjects.length-1 ? "1px solid rgba(255,255,255,0.03)" : "none", opacity:0.25 }}>
                            <div style={{ width:3, height:38, borderRadius:3, background:"#3b5280", flexShrink:0 }} />
                            <div style={{ width:42, height:42, borderRadius:12, background:"rgba(59,82,128,0.15)", border:"1px solid rgba(59,82,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              {getSubjectIcon(sub, 22, "#3b5280")}
                            </div>
                            <div style={{ flex:1 }}>
                              <div style={{ color:"#e2e8ff", fontWeight:700, fontSize:13 }}>{sub}</div>
                              <div style={{ color:"#3b5280", fontSize:11, marginTop:2 }}>Pa disponib ak kòd ou</div>
                            </div>
                            <span style={{ fontSize:13 }}>🔒</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── QCM ──────────────────────────────────────────────────────
  if (phase === "qcm" && currentQ) {
    const progress = (qIndex / shuffledQs.length) * 100;
    const accuracy = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
    const letters  = ["A","B","C","D"];
    const letterColors = ["#2563EB","#7C3AED","#059669","#D97706"];

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background:"linear-gradient(160deg,#04081A 0%,#070d22 100%)" }}>

        {/* Header */}
        <div style={{ padding:"12px 16px", background:"rgba(6,11,32,0.97)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <button onClick={() => setPhase("select")} style={{ width:36, height:36, borderRadius:10, background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.2)", color:"#60a5fa", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:18 }}>←</button>
            <span style={{ color:"#e2e8ff", fontWeight:800, fontSize:14, flex:1 }}>{subject}</span>
            {streak >= 2 && (
              <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 10px", borderRadius:20, background:"rgba(249,115,22,0.2)", border:"1px solid rgba(249,115,22,0.3)" }}>
                <FireIcon size={13}/><span style={{ color:"#fb923c", fontWeight:800, fontSize:13 }}>{streak}</span>
              </div>
            )}
            <div style={{ display:"flex", gap:3, animation: shaking ? "shake .4s ease" : "none" }}>
              {[0,1,2].map(i => <HeartIcon key={i} filled={i < hearts} size={20}/>)}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ color:"#3b5280", fontSize:11 }}>Wònn {round} • {qIndex+1}/{shuffledQs.length}</span>
            <span style={{ color:accuracy >= 60 ? "#22c55e" : "#ef4444", fontSize:11, fontWeight:700 }}>{accuracy}% kòrèk</span>
          </div>

          {/* Progress bar double */}
          <div style={{ height:6, borderRadius:6, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:6, background:"linear-gradient(90deg,#2563eb,#7c3aed)", width:`${progress}%`, transition:"width .4s ease" }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ padding:"16px 14px", display:"flex", flexDirection:"column", gap:12 }}>

          {/* Question */}
          <div style={{ background:"rgba(12,20,50,0.92)", border:"1px solid rgba(37,99,235,0.15)", borderLeft:"4px solid #2563eb", borderRadius:18, padding:"18px 18px" }}>
            <div style={{ color:"#6b8adb", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Kesyon {qIndex+1}</div>
            <p style={{ color:"#e2e8ff", fontWeight:600, fontSize:15, lineHeight:1.65, margin:0 }}>{currentQ.q}</p>
          </div>

          {/* Choix */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {currentQ.choices.map((choice, idx) => {
              const isCorrect = selected !== null && idx === currentQ.answer;
              const isWrong   = selected !== null && idx === selected && idx !== currentQ.answer;
              const isNeutral = selected === null;
              return (
                <button key={idx} onClick={() => handleChoice(idx)}
                  style={{ width:"100%", padding:"14px 16px", borderRadius:16, textAlign:"left", display:"flex", alignItems:"center", gap:12,
                    background: isCorrect ? "rgba(34,197,94,0.1)" : isWrong ? "rgba(239,68,68,0.08)" : "rgba(12,20,50,0.9)",
                    border: `1.5px solid ${isCorrect ? "rgba(34,197,94,0.45)" : isWrong ? "rgba(239,68,68,0.35)" : "rgba(37,99,235,0.1)"}`,
                    cursor: selected !== null ? "default" : "pointer", transition:"all .2s",
                    boxShadow: isCorrect ? "0 4px 20px rgba(34,197,94,0.12)" : isWrong ? "0 4px 20px rgba(239,68,68,0.08)" : "none",
                    animation:`fadeIn .2s ${idx*0.05}s ease both` }}
                  onTouchStart={e => { if(isNeutral) e.currentTarget.style.transform="scale(0.97)"; }}
                  onTouchEnd={e => e.currentTarget.style.transform="scale(1)"}>
                  <span style={{ width:30, height:30, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0,
                    background: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : `${letterColors[idx]}22`,
                    color: isCorrect || isWrong ? "#fff" : letterColors[idx],
                    border:`1px solid ${isCorrect ? "#22c55e" : isWrong ? "#ef4444" : `${letterColors[idx]}44`}` }}>
                    {letters[idx]}
                  </span>
                  <span style={{ flex:1, color: isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8ff", fontSize:14, fontWeight:500, lineHeight:1.4 }}>{choice}</span>
                  {isCorrect && <CheckCircleIcon size={16}/>}
                  {isWrong   && <XCircleIcon size={16}/>}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selected !== null && (
            <div style={{ animation:"fadeIn .3s ease both" }}>
              {currentQ.note && (
                <div style={{ background: selected===currentQ.answer ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.06)", border:`1px solid ${selected===currentQ.answer ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.18)"}`, borderRadius:14, padding:"12px 14px", marginBottom:10 }}>
                  <p style={{ color: selected===currentQ.answer ? "#86efac" : "#fca5a5", fontSize:12, lineHeight:1.6, margin:0, display:"flex", alignItems:"flex-start", gap:6 }}>
                    <LightbulbIcon/> {currentQ.note}
                  </p>
                </div>
              )}
              <button onClick={handleNext}
                style={{ width:"100%", padding:"15px", borderRadius:16, background: hearts<=0 ? "linear-gradient(135deg,#dc2626,#ef4444)" : "linear-gradient(135deg,#1d4ed8,#2563eb)", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", boxShadow: hearts<=0 ? "0 4px 20px rgba(220,38,38,0.3)" : "0 4px 20px rgba(37,99,235,0.3)" }}>
                {hearts <= 0 ? "💔 Gade Rezilta" : qIndex+1 >= shuffledQs.length ? "Wè Rezilta →" : "Kesyon ki vini →"}
              </button>
            </div>
          )}
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── BRAVO ─────────────────────────────────────────────────────
  if (phase === "bravo") {
    const note20   = scoreToNote20(roundScore, shuffledQs.length || 10);
    const mention  = getMention(note20);
    const allCount = (QUIZ_DATA[subject]||[]).length;
    const seenCount = usedQKeys.size;
    const hasMore  = (allCount - seenCount) >= 5;

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-5" style={{ background:"linear-gradient(160deg,#04081A,#0d1b4b,#1a0505)" }}>
        <div style={{ width:"100%", maxWidth:380, display:"flex", flexDirection:"column", gap:16, animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:60 }}>🎉</div>
            <h2 style={{ color:"#fff", fontWeight:900, fontSize:28, margin:"8px 0 4px" }}>Bravo !</h2>
            <p style={{ color:"#3b82f6", fontSize:13, margin:0 }}>{subject} • Wònn {round}</p>
          </div>

          <div style={{ background:mention.bg, border:`2px solid ${mention.border}`, borderRadius:24, padding:"20px 16px", textAlign:"center" }}>
            <div style={{ fontSize:40 }}>{mention.emoji}</div>
            <div style={{ fontSize:52, fontWeight:900, color:mention.color, lineHeight:1, marginTop:6 }}>
              {note20}<span style={{ fontSize:20, color:mention.color+"99" }}>/20</span>
            </div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:18, marginTop:4 }}>{mention.label}</div>
            <div style={{ color:"#60a5fa", fontSize:12, marginTop:4 }}>{roundScore}/10 kòrèk</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { icon:<CheckCircleIcon size={22} color="#22c55e"/>, val:score, label:"Total kòrèk" },
              { icon:<FireIcon size={22} color="#f97316"/>, val:maxStreak, label:"Max streak" },
              { icon:<span style={{fontSize:20}}>📖</span>, val:`${seenCount}/${allCount}`, label:"Wè" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(12,20,50,0.9)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>{s.icon}</div>
                <div style={{ color:"#fff", fontWeight:900, fontSize:16 }}>{s.val}</div>
                <div style={{ color:"#3b5280", fontSize:10, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={continueQuiz} disabled={!hasMore && seenCount >= allCount}
              style={{ flex:1, padding:"15px", borderRadius:16, background:"linear-gradient(135deg,#16a34a,#22c55e)", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor: (!hasMore && seenCount >= allCount) ? "not-allowed" : "pointer", opacity: (!hasMore && seenCount >= allCount) ? 0.5 : 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 20px rgba(34,197,94,0.3)" }}>
              <CheckCircleIcon size={20} color="#fff"/> Wi
            </button>
            <button onClick={() => setPhase("select")}
              style={{ flex:1, padding:"15px", borderRadius:16, background:"rgba(12,20,50,0.9)", border:"1px solid rgba(37,99,235,0.15)", color:"#93c5fd", fontWeight:800, fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <XCircleIcon size={20} color="#93c5fd"/> Non
            </button>
          </div>

          {!hasMore && seenCount >= allCount && (
            <p style={{ color:"#fbbf24", fontSize:12, textAlign:"center" }}>🏆 Ou fini tout {allCount} kesyon yo !</p>
          )}
        </div>
      </div>
    );
  }

  // ── GAME OVER ─────────────────────────────────────────────────
  if (phase === "gameover") {
    const note20  = scoreToNote20(score, totalAnswered);
    const mention = getMention(note20);

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background:"linear-gradient(160deg,#04081A 0%,#070d22 100%)" }}>
        <div className="flex-1 overflow-y-auto" style={{ padding:"24px 14px", display:"flex", flexDirection:"column", gap:14 }}>

          <div style={{ textAlign:"center", animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize:56 }}>💔</div>
            <h2 style={{ color:"#fff", fontWeight:900, fontSize:28, margin:"8px 0 4px" }}>Game Over</h2>
            <p style={{ color:"#3b5280", fontSize:13, margin:0 }}>{subject}</p>
          </div>

          <div style={{ background:mention.bg, border:`2px solid ${mention.border}`, borderRadius:24, padding:"20px 16px", textAlign:"center" }}>
            <div style={{ fontSize:36 }}>{mention.emoji}</div>
            <div style={{ fontSize:52, fontWeight:900, color:mention.color, lineHeight:1, marginTop:6 }}>
              {note20}<span style={{ fontSize:20, color:mention.color+"99" }}>/20</span>
            </div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:18, marginTop:4 }}>{mention.label}</div>
            <div style={{ color:"#60a5fa", fontSize:12, marginTop:4 }}>{score}/{totalAnswered} kòrèk</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { icon:<FireIcon size={22} color="#f97316"/>, val:maxStreak, label:"Max Streak" },
              { icon:<CheckCircleIcon size={22} color="#22c55e"/>, val:score, label:"Kòrèk" },
              { icon:<span style={{fontSize:20}}>📝</span>, val:totalAnswered, label:"Total" },
            ].map((s,i) => (
              <div key={i} style={{ background:"rgba(12,20,50,0.9)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:16, padding:"12px 8px", textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:4 }}>{s.icon}</div>
                <div style={{ color:"#fff", fontWeight:900, fontSize:18 }}>{s.val}</div>
                <div style={{ color:"#3b5280", fontSize:10, marginTop:2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {wrongAnswers.length > 0 && (
            <div style={{ background:"rgba(12,20,50,0.9)", border:"1px solid rgba(37,99,235,0.12)", borderRadius:18, padding:"14px" }}>
              <div style={{ color:"#fca5a5", fontWeight:700, fontSize:13, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
                📋 Dènye Erè Ou
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {wrongAnswers.slice(-3).map((a,i) => (
                  <div key={i} style={{ background:"rgba(127,29,29,0.15)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:12, padding:"10px 12px" }}>
                    <p style={{ color:"#e2e8ff", fontSize:12, fontWeight:600, margin:"0 0 6px" }}>{a.q}</p>
                    <p style={{ color:"#fca5a5", fontSize:11, margin:"0 0 2px", display:"flex", alignItems:"center", gap:4 }}><XCircleIcon size={10}/> {a.choices[a.selected]}</p>
                    <p style={{ color:"#86efac", fontSize:11, margin:0, display:"flex", alignItems:"center", gap:4 }}><CheckCircleIcon size={10}/> {a.choices[a.correctIdx]}</p>
                    {a.note && <p style={{ color:"#93c5fd", fontSize:11, margin:"4px 0 0", display:"flex", alignItems:"center", gap:4 }}><LightbulbIcon size={10}/> {a.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => startQCM(subject)}
            style={{ width:"100%", padding:"15px", borderRadius:16, background:"linear-gradient(135deg,#dc2626,#ef4444)", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:"0 4px 20px rgba(220,38,38,0.25)" }}>
            <RefreshIcon size={18}/> Eseye Ankò
          </button>
          <button onClick={() => setPhase("select")}
            style={{ width:"100%", padding:"15px", borderRadius:16, background:"rgba(12,20,50,0.9)", border:"1px solid rgba(37,99,235,0.15)", color:"#93c5fd", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            ← Chwazi lòt matyè
          </button>
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  return null;
}

export default QuizScreen;
