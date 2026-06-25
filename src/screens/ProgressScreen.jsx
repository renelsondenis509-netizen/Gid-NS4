import { useMemo, useEffect, useState } from "react";
import { BottomNav } from "../components/UI";
import { getQuizGrades } from "../utils/quiz";
import { QUIZ_BRANCHES } from "../data/quizData";
import { idbGetExercice, idbGetScans } from "../utils/idb";
import { BADGES, computeBadges } from "../utils/badges";

const ALL_SUBJECTS = Object.values(QUIZ_BRANCHES).flatMap(f => f.subjects);

const noteColor = n => n >= 16 ? "#22c55e" : n >= 12 ? "#f59e0b" : n >= 10 ? "#f97316" : "#ef4444";
const barGrad   = n => n >= 16 ? "linear-gradient(90deg,#16a34a,#22c55e)" : n >= 12 ? "linear-gradient(90deg,#d97706,#f59e0b)" : n >= 10 ? "linear-gradient(90deg,#ea580c,#f97316)" : "linear-gradient(90deg,#dc2626,#ef4444)";

const IcoBack    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IcoTrend   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IcoStar    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoTarget  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const IcoBook    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IcoLock    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2d4080" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IcoFlash   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoChart   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoEval    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>;
const IcoClose   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoAlert   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoPencil  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

function Bar({ value, max = 20, color }) {
  return (
    <div style={{ background:"#1e3a8a33", borderRadius:99, height:7, overflow:"hidden" }}>
      <div style={{ width:`${Math.min((value/max)*100,100)}%`, height:"100%", borderRadius:99, background: color || barGrad(value), transition:"width .7s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function StatChip({ icon, value, label, color }) {
  return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:26, fontWeight:900, color, lineHeight:1.2 }}>{value}</div>
      <div style={{ color:"#4B6ABA", fontSize:9, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center", gap:3 }}>{icon}{label}</div>
    </div>
  );
}

function SubjectCard({ sub, best, last, count, exoCount = 0, highlight }) {
  const trend = last >= best ? "↑" : last < best - 2 ? "↓" : "→";
  const trendColor = trend === "↑" ? "#22c55e" : trend === "↓" ? "#ef4444" : "#f59e0b";
  const bg = highlight === "good" ? "#14532d18" : highlight === "weak" ? "#7f1d1d18" : "rgba(15,28,60,0.7)";
  const border = highlight === "good" ? "#22c55e22" : highlight === "weak" ? "#ef444422" : "#1e3a8a22";
  return (
    <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:"12px 14px", marginBottom:8, animation:"fadeIn .4s ease both" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ color:"#E8EEFF", fontSize:13, fontWeight:700 }}>{sub}</span>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:trendColor, fontSize:13, fontWeight:800 }}>{trend}</span>
          <span style={{ color:"#4B6ABA", fontSize:10 }}>dènye <span style={{ color: noteColor(last) }}>{last}</span></span>
          <span style={{ color: noteColor(best), fontSize:14, fontWeight:900 }}>{best}/20</span>
        </div>
      </div>
      <Bar value={best} />
      <div style={{ display:"flex", gap:12, marginTop:4 }}>
        <span style={{ color:"#4B6ABA", fontSize:10, display:"flex", alignItems:"center", gap:3 }}><IcoBook/> {count} quiz</span>
        {exoCount > 0 && <span style={{ color:"#34d399", fontSize:10, display:"flex", alignItems:"center", gap:3 }}><IcoPencil/> {exoCount} egzèsis</span>}
      </div>
    </div>
  );
}


/* ─── Evalyasyon ─────────────────────────────────────────────── */
function EvalModal({ grades, exoData, scanData, allSubjects, onClose }) {
  const result = useMemo(() => {
    // Scans par matière
    const scanMap = {};
    scanData.forEach(s => {
      const sub = s.subject || s.subjectName || null;
      if (sub) scanMap[sub] = (scanMap[sub] || 0) + 1;
    });

    // Exercices par matière
    const exoMap = {};
    exoData.forEach(e => {
      if (!e.subject) return;
      if (!exoMap[e.subject]) exoMap[e.subject] = [];
      if (e.total > 0) exoMap[e.subject].push(Math.round((e.score / e.total) * 20));
    });

    const tried = Object.keys(grades);
    if (!tried.length) return null;

    const subScores = tried.map(sub => {
      const entries = grades[sub];
      const quizBest = Math.max(...entries.map(e => e.note20));
      const exoAvg = exoMap[sub]?.length
        ? exoMap[sub].reduce((a, b) => a + b, 0) / exoMap[sub].length
        : null;
      const scanBonus = Math.min((scanMap[sub] || 0) * 0.5, 2); // max +2
      const score = exoAvg !== null
        ? quizBest * 0.5 + exoAvg * 0.3 + quizBest * 0.2 + scanBonus
        : quizBest * 0.8 + scanBonus;
      return { sub, score: Math.min(Math.round(score * 10) / 10, 20), quizBest, exoAvg, scans: scanMap[sub] || 0 };
    });

    const globalAvg = Math.round(subScores.reduce((a, b) => a + b.score, 0) / subScores.length * 10) / 10;
    const readiness = Math.round((globalAvg / 20) * 100);
    const strong = subScores.filter(s => s.score >= 14).sort((a, b) => b.score - a.score);
    const weak   = subScores.filter(s => s.score < 12).sort((a, b) => a.score - b.score);
    const mid    = subScores.filter(s => s.score >= 12 && s.score < 14);
    const untried = allSubjects.filter(s => !tried.includes(s));

    let verdict, verdictColor, verdictBg;
    if (readiness >= 75)      { verdict = "✅ Ou prèske pare pou Bak la !";     verdictColor = "#22c55e"; verdictBg = "#14532d22"; }
    else if (readiness >= 55) { verdict = "⚡ Bon chemen, kontinye efò a !";    verdictColor = "#f59e0b"; verdictBg = "#78350f22"; }
    else                      { verdict = "📚 Ou bezwen travay plis chak jou."; verdictColor = "#ef4444"; verdictBg = "#7f1d1d22"; }

    return { readiness, globalAvg, strong, weak, mid, untried, verdict, verdictColor, verdictBg, total: subScores.length };
  }, [grades, exoData, scanData, allSubjects]);

  if (!result) return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", background:"#080e24", borderRadius:"20px 20px 0 0", border:"1px solid rgba(139,92,246,0.3)", padding:"24px 20px 40px" }}>
        <p style={{ color:"#4B6ABA", textAlign:"center" }}>Pako gen done pou evalye. Fè kèk quiz anvan !</p>
        <button onClick={onClose} style={{ display:"block", margin:"16px auto 0", padding:"10px 28px", borderRadius:12, background:"#2563eb", color:"#fff", border:"none", cursor:"pointer", fontWeight:700 }}>Ferme</button>
      </div>
    </div>
  );

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxHeight:"85vh", overflowY:"auto", background:"#080e24", borderRadius:"22px 22px 0 0", border:"1px solid rgba(139,92,246,0.3)", padding:"20px 16px 36px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <span style={{ color:"#e2e8ff", fontWeight:800, fontSize:16, display:"flex", alignItems:"center", gap:8 }}><IcoEval/> Evalyasyon Semènn nan</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#93c5fd" }}><IcoClose/></button>
        </div>

        {/* Score global */}
        <div style={{ background: result.verdictBg, border:`1px solid ${result.verdictColor}33`, borderRadius:16, padding:"16px", marginBottom:14, textAlign:"center" }}>
          <div style={{ fontSize:48, fontWeight:900, color: result.verdictColor, lineHeight:1 }}>{result.readiness}%</div>
          <div style={{ color:"#93c5fd", fontSize:12, marginTop:4 }}>Nivo preparasyon Bak</div>
          <div style={{ color: result.verdictColor, fontSize:13, fontWeight:700, marginTop:8 }}>{result.verdict}</div>
          <div style={{ color:"#4B6ABA", fontSize:11, marginTop:4 }}>Mwayèn global: {result.globalAvg}/20 · {result.total} matyè evalye</div>
        </div>

        {/* Barre visuelle */}
        <div style={{ marginBottom:14 }}>
          <div style={{ background:"#1e3a8a33", borderRadius:99, height:10, overflow:"hidden" }}>
            <div style={{ width:`${result.readiness}%`, height:"100%", borderRadius:99, background: result.readiness >= 75 ? "linear-gradient(90deg,#16a34a,#22c55e)" : result.readiness >= 55 ? "linear-gradient(90deg,#d97706,#f59e0b)" : "linear-gradient(90deg,#dc2626,#ef4444)", transition:"width .8s ease" }} />
          </div>
        </div>

        {/* Matyè fò */}
        {result.strong.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:"#22c55e", fontSize:12, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoStar/> Matyè ou metrize ({result.strong.length})</div>
            {result.strong.map(s => (
              <div key={s.sub} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"#14532d18", border:"1px solid #22c55e22", borderRadius:10, marginBottom:6 }}>
                <span style={{ color:"#e2e8ff", fontSize:13 }}>{s.sub}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {s.exoAvg !== null && <span style={{ color:"#34d399", fontSize:11 }}>Exo: {s.exoAvg}/20</span>}
                  {s.scans > 0 && <span style={{ color:"#60a5fa", fontSize:11 }}>{s.scans} IA</span>}
                  <span style={{ color:"#22c55e", fontWeight:800, fontSize:14 }}>{s.score}/20</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matyè mwayèn */}
        {result.mid.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:"#f59e0b", fontSize:12, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoTarget/> Matyè pou renfòse ({result.mid.length})</div>
            {result.mid.map(s => (
              <div key={s.sub} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"#78350f18", border:"1px solid #f59e0b22", borderRadius:10, marginBottom:6 }}>
                <span style={{ color:"#e2e8ff", fontSize:13 }}>{s.sub}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {s.exoAvg !== null && <span style={{ color:"#fbbf24", fontSize:11 }}>Exo: {s.exoAvg}/20</span>}
                  <span style={{ color:"#f59e0b", fontWeight:800, fontSize:14 }}>{s.score}/20</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matyè fèb */}
        {result.weak.length > 0 && (
          <div style={{ marginBottom:14 }}>
            <div style={{ color:"#ef4444", fontSize:12, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoAlert/> Matyè ki bezwen travay ijan ({result.weak.length})</div>
            {result.weak.map(s => (
              <div key={s.sub} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"#7f1d1d18", border:"1px solid #ef444422", borderRadius:10, marginBottom:6 }}>
                <span style={{ color:"#e2e8ff", fontSize:13 }}>{s.sub}</span>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {s.exoAvg !== null && <span style={{ color:"#fca5a5", fontSize:11 }}>Exo: {s.exoAvg}/20</span>}
                  <span style={{ color:"#ef4444", fontWeight:800, fontSize:14 }}>{s.score}/20</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Matyè poko eseye */}
        {result.untried.length > 0 && (
          <div style={{ marginBottom:8 }}>
            <div style={{ color:"#4B6ABA", fontSize:12, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoLock/> Matyè poko eseye ({result.untried.length})</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {result.untried.slice(0, 8).map(s => (
                <span key={s} style={{ background:"rgba(15,28,60,0.7)", border:"1px solid #1e3a8a22", borderRadius:20, padding:"3px 10px", color:"#2d4080", fontSize:11 }}>{s}</span>
              ))}
              {result.untried.length > 8 && <span style={{ color:"#2d4080", fontSize:11, alignSelf:"center" }}>+{result.untried.length - 8} lòt</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgressScreen({ user, onNavigate }) {
  const grades = useMemo(() => getQuizGrades(user.phone), [user.phone]);
  const [exoData, setExoData] = useState([]);
  const [scanData, setScanData] = useState([]);
  const [showEval, setShowEval] = useState(false);

  useEffect(() => {
    idbGetExercice(user.phone).then(setExoData).catch(() => {});
    idbGetScans(user.phone).then(setScanData).catch(() => {});
  }, [user.phone]);

  const stats = useMemo(() => {
    const subjects = Object.keys(grades);
    if (!subjects.length && !exoData.length) return null;

    // Compter les exercices par matière
    const exoMap = {};
    exoData.forEach(e => {
      if (e.subject) exoMap[e.subject] = (exoMap[e.subject] || 0) + 1;
    });
    const totalExo = exoData.length;

    const subjectStats = subjects.map(sub => {
      const entries = grades[sub];
      const best   = Math.max(...entries.map(e => e.note20));
      const last   = entries[entries.length - 1]?.note20 ?? 0;
      const streak = entries.filter(e => e.note20 >= 16).length;
      return { sub, best, last, count: entries.length, streak, exoCount: exoMap[sub] || 0 };
    });

    if (!subjectStats.length) return null;

    const avg = Math.round(subjectStats.reduce((a, b) => a + b.best, 0) / subjectStats.length * 10) / 10;
    const sorted  = [...subjectStats].sort((a, b) => b.best - a.best);
    const top3    = sorted.slice(0, 3);
    const weak3   = subjectStats.length > 3 ? [...subjectStats].sort((a, b) => a.best - b.best).slice(0, 3) : [];
    const bestStreak = Math.max(...subjectStats.map(s => s.streak));
    const untried = ALL_SUBJECTS.filter(s => !subjects.includes(s));
    const badgeList = computeBadges({ grades, exoCount: totalExo, allSubjectsCount: ALL_SUBJECTS.length, phone: user.phone });

    return { subjectStats: sorted, avg, top3, weak3, bestStreak, untried, totalExo, total: subjectStats.length, max: ALL_SUBJECTS.length, badgeList };
  }, [grades, exoData]);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"linear-gradient(145deg,#04081A,#080E24)" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ padding:"32px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => onNavigate("menu")} style={{ background:"rgba(37,99,235,0.12)", border:"1px solid rgba(37,99,235,0.2)", borderRadius:10, width:36, height:36, color:"#60a5fa", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}><IcoBack/></button>
          <div style={{ flex:1 }}>
            <h1 style={{ color:"#E8EEFF", fontWeight:800, fontSize:18, margin:0, display:"flex", alignItems:"center", gap:8 }}><IcoTrend/> Pwogresyon</h1>
            <p style={{ color:"#4B6ABA", fontSize:11, margin:0 }}>{user.name || user.phone}</p>
          </div>
          <button onClick={() => setShowEval(true)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background:"linear-gradient(135deg,#4c1d95,#7c3aed)", border:"1px solid rgba(139,92,246,0.4)", color:"#e9d5ff", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.3)" }}><IcoEval/> Evalyasyon</button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 90px" }}>
        {!stats ? (
          <div style={{ textAlign:"center", marginTop:80 }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><IcoBook/></div>
            <p style={{ color:"#4B6ABA", fontSize:14, fontWeight:600 }}>Poko gen done</p>
            <p style={{ color:"#2d4080", fontSize:12 }}>Fè premye quiz ou a pou wè pwogresyon ou yo.</p>
            <button onClick={() => onNavigate("quiz")} style={{ marginTop:20, padding:"12px 28px", borderRadius:14, background:"linear-gradient(135deg,#2563eb,#3b82f6)", color:"#fff", fontWeight:800, fontSize:14, border:"none", cursor:"pointer" }}>
              Kòmanse yon Quiz
            </button>
          </div>
        ) : (<>

          {/* Résumé */}
          <div style={{ background:"rgba(37,99,235,0.08)", border:"1px solid rgba(37,99,235,0.18)", borderRadius:18, padding:"16px 12px", marginBottom:16, display:"flex", justifyContent:"space-around", animation:"fadeIn .3s ease both" }}>
            <StatChip icon={<IcoStar/>}  value={stats.avg}        label="Mwayèn /20"  color={noteColor(stats.avg)} />
            <StatChip icon={<IcoBook/>}  value={stats.total}      label="Matye"       color="#60a5fa" />
            <StatChip icon={<IcoFlash/>} value={stats.bestStreak} label="Streak"      color="#fbbf24" />
            <StatChip icon={<IcoPencil/>}value={stats.totalExo}   label="Egzèsis"     color="#34d399" />
            <StatChip icon={<IcoChart/>} value={stats.max}        label="Total"       color="#a855f7" />
          </div>

          {/* Barre couverture */}
          <div style={{ background:"rgba(15,28,60,0.8)", border:"1px solid #1e3a8a33", borderRadius:14, padding:"12px 14px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ color:"#93c5fd", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}><IcoTarget/> Matyè</span>
              <span style={{ color:"#60a5fa", fontSize:12, fontWeight:800 }}>{Math.round(stats.total / stats.max * 100)}%</span>
            </div>
            <Bar value={stats.total} max={stats.max} color="linear-gradient(90deg,#2563eb,#7c3aed)" />
            <div style={{ color:"#2d4080", fontSize:10, marginTop:4 }}>{stats.total} / {stats.max} matye eseye</div>
          </div>

          {/* Matyè ki gen plis pwen */}
          {stats.top3.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <h3 style={{ color:"#22c55e", fontSize:13, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoStar/> Matyè ki gen plis pwen</h3>
              {stats.top3.map(s => <SubjectCard key={s.sub} {...s} highlight="good" />)}
            </div>
          )}

          {/* Pou travay plis */}
          {stats.weak3.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <h3 style={{ color:"#ef4444", fontSize:13, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoTarget/> Pou travay plis</h3>
              {stats.weak3.map(s => <SubjectCard key={s.sub} {...s} highlight="weak" />)}
            </div>
          )}

          {/* Toutes les matières */}
          <div style={{ marginBottom:16 }}>
            <h3 style={{ color:"#93c5fd", fontSize:13, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoChart/> Matyè eseye</h3>
            {stats.subjectStats.map(s => <SubjectCard key={s.sub} {...s} />)}
          </div>


          {/* Badges */}
          <div style={{ marginBottom:16 }}>
            <h3 style={{ color:"#fbbf24", fontSize:13, fontWeight:700, marginBottom:10, display:"flex", alignItems:"center", gap:6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Meday ({stats.badgeList.filter(b=>b.unlocked).length}/{stats.badgeList.length})
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {stats.badgeList.map(b => (
                <div key={b.id} style={{ background: b.unlocked ? `${b.color}18` : "rgba(15,28,60,0.5)", border:`1px solid ${b.unlocked ? b.color+"44" : "#1e3a8a22"}`, borderRadius:14, padding:"10px 8px", textAlign:"center", opacity: b.unlocked ? 1 : 0.4, transition:"opacity .3s" }}>
                  <div style={{ width:28, height:28, margin:"0 auto 6px", filter: b.unlocked ? "none" : "grayscale(1)" }} dangerouslySetInnerHTML={{ __html: b.svg }} />
                  <div style={{ color: b.unlocked ? b.color : "#2d4080", fontSize:10, fontWeight:700, lineHeight:1.2 }}>{b.label}</div>
                  <div style={{ color:"#2d4080", fontSize:9, marginTop:2 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Matières non tentées */}
          {stats.untried.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <h3 style={{ color:"#4B6ABA", fontSize:13, fontWeight:700, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><IcoLock/> Matyè ki poko eseye({stats.untried.length})</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {stats.untried.map(sub => (
                  <span key={sub} style={{ background:"rgba(15,28,60,0.7)", border:"1px solid #1e3a8a22", borderRadius:20, padding:"4px 10px", color:"#2d4080", fontSize:11, display:"flex", alignItems:"center", gap:4 }}><IcoLock/>{sub}</span>
                ))}
              </div>
            </div>
          )}

        </>)}
      </div>
      {showEval && <EvalModal grades={grades} exoData={exoData} scanData={scanData} allSubjects={ALL_SUBJECTS} onClose={() => setShowEval(false)} />}
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}
