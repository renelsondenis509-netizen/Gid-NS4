import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge } from "../api";
import { QUIZ_DATA } from "../quizData.js";
import { shuffleArray, shuffleChoices } from "../utils/helpers";
import { scoreToNote20, getMention, saveQuizGrade } from "../utils/quiz";
import { BottomNav } from "../components/UI";

export function QuizScreen({ user, onNavigate }) {
  const [phase, setPhase]           = useState("select");
  const [subject, setSubject]       = useState(null);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [qIndex, setQIndex]         = useState(0);
  const [selected, setSelected]     = useState(null);
  const [score, setScore]           = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hearts, setHearts]         = useState(3);
  const [streak, setStreak]         = useState(0);
  const [maxStreak, setMaxStreak]   = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [shaking, setShaking]       = useState(false);
  const [round, setRound]           = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [usedQKeys, setUsedQKeys]   = useState(new Set());

  const available = Object.keys(QUIZ_DATA).filter(s => user.subjects.includes(s));
  const currentQ  = shuffledQs[qIndex];

  const startQCM = (sub) => {
    const first10 = shuffleArray(QUIZ_DATA[sub]).slice(0, 10).map(shuffleChoices);
    setSubject(sub); setShuffledQs(first10); setUsedQKeys(new Set(first10.map(q => q.q)));
    setPhase("qcm"); setQIndex(0); setScore(0); setTotalAnswered(0); setRoundScore(0);
    setHearts(3); setStreak(0); setMaxStreak(0); setWrongAnswers([]); setSelected(null); setRound(1);
  };

  const saveScore = async (s, t, ms) => {
    if (t === 0 || !subject) return;
    const note20 = scoreToNote20(s, t);
    saveQuizGrade(user.phone, subject, note20, s, t);
    try {
      await callEdge({ action:"save_quiz_score", phone:user.phone, schoolCode:user.code, name:user.name||user.phone, subject, score:s, total:t, note20, streak:ms });
    } catch(e) { console.warn("Score save failed", e); }
  };

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.answer;
    setTotalAnswered(t => t+1);
    if (correct) {      setScore(s => s+1); setRoundScore(r => r+1);
      setStreak(s => { const ns=s+1; setMaxStreak(m => Math.max(m,ns)); return ns; });
    } else {
      setHearts(h => h-1); setStreak(0);
      setShaking(true); setTimeout(() => setShaking(false), 500);
      setWrongAnswers(p => [...p.slice(-4), { q:currentQ.q, selected:idx, correctIdx:currentQ.answer, choices:currentQ.choices, note:currentQ.note }]);
    }
  };

  const handleNext = async () => {
    if (hearts <= 0) { await saveScore(score, totalAnswered, maxStreak); setPhase("gameover"); return; }
    const next = qIndex + 1;
    if (next >= shuffledQs.length) { await saveScore(score, totalAnswered, maxStreak); setPhase("bravo"); return; }
    setQIndex(next); setSelected(null);
  };

  const continueQuiz = () => {
    const all    = QUIZ_DATA[subject] || [];
    const unseen = all.filter(q => !usedQKeys.has(q.q));
    const pool   = unseen.length >= 10 ? unseen : shuffleArray(all);
    const next10 = shuffleArray(pool).slice(0, 10).map(shuffleChoices);
    setShuffledQs(next10); setUsedQKeys(new Set([...usedQKeys, ...next10.map(q => q.q)]));
    setQIndex(0); setSelected(null); setRoundScore(0); setRound(r => r+1); setPhase("qcm");
  };

  const icons = {
    "SVT (Sciences de la Vie et de la Terre)":"🧬","Physique":"⚡","Chimie":"⚗️",
    "Philosophie & Dissertation":"🧠","Sciences Sociales & Citoyenneté":"🌍",
    "Littérature Haïtienne":"🇭🇹","Littérature Française":"🗼","Mathématiques":"📐",
    "Kreyòl Ayisyen":"🗣️","Art & Mizik Ayisyen":"🎵","Anglais":"🇬🇧","Espagnol":"🇪🇸",
    "Entrepreneuriat Scolaire":"💼","Informatique, Technologie & Arts":"💻",
  };

  // ── SELECT ──
  if (phase === "select") return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:38, height:38, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#fff" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h2 style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, margin:0 }}>Quiz NS4</h2>
          <p style={{ color:"#4B6ABA", fontSize:11, margin:0 }}>{available.length} matière{available.length>1?"s":""} disponib</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <div style={{ background:"linear-gradient(135deg,rgba(232,0,42,0.12),rgba(255,92,53,0.08))", border:"1px solid rgba(232,0,42,0.2)", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>❤️❤️❤️</span>
          <div>
            <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:12 }}>Mode Duolingo — 3 kè</div>            <div style={{ color:"#5B7ADB", fontSize:11, marginTop:2 }}>Kesyon enfini • Jwe jouk ou pèdi 3 kè</div>
          </div>
        </div>
        <p style={{ color:"#4B5EA8", fontSize:11, textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase" }}>— Chwazi yon matière —</p>
        {available.map(sub => (
          <button key={sub} onClick={() => startQCM(sub)}
            style={{ width:"100%", padding:"14px 16px", borderRadius:16, textAlign:"left", display:"flex", alignItems:"center", gap:14, border:"1px solid rgba(37,99,235,0.12)", background:"rgba(15,28,60,0.90)", boxShadow:"0 2px 12px rgba(0,0,0,0.2)", cursor:"pointer", animation:"slideIn .3s ease both" }}
            onTouchStart={e=>{ e.currentTarget.style.transform="scale(0.97)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.4)"; }}
            onTouchEnd={e  =>{ e.currentTarget.style.transform="scale(1)"; e.currentTarget.style.borderColor="rgba(37,99,235,0.12)"; }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:24 }}>{icons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:3 }}>{QUIZ_DATA[sub].length} kesyon • Mode infini 🔄</div>
            </div>
            <span style={{ color:"#4B5EA8", fontSize:18 }}>›</span>
          </button>
        ))}
        {Object.keys(QUIZ_DATA).filter(s => !user.subjects.includes(s)).map(sub => (
          <div key={sub} style={{ width:"100%", padding:"14px 16px", borderRadius:16, display:"flex", alignItems:"center", gap:14, background:"rgba(12,21,48,0.4)", border:"1px solid rgba(37,99,235,0.05)", opacity:0.3, boxSizing:"border-box" }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(37,99,235,0.06)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontSize:22 }}>{icons[sub]}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ color:"#E8EEFF", fontWeight:600, fontSize:13 }}>{sub}</div>
              <div style={{ color:"#4B5EA8", fontSize:11, marginTop:2 }}>Pa disponib ak kòd lekòl ou</div>
            </div>
            <span style={{ fontSize:14 }}>🔒</span>
          </div>
        ))}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );

  // ── QCM ──
  if (phase === "qcm" && currentQ) {
    const letters      = ["A","B","C","D"];
    const letterColors = ["#2563EB","#7C3AED","#059669","#D97706"];
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
        <div className="px-4 py-3 border-b" style={{ background:"rgba(10,15,46,0.98)", borderColor:"#ffffff10" }}>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={() => setPhase("select")} className="text-blue-400 text-xl">←</button>
            <h2 className="text-white font-bold flex-1 text-sm">{subject}</h2>
            {streak >= 2 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background:"#f9731633", border:"1px solid #f9731644" }}>
                <span style={{ fontSize:14 }}>🔥</span>
                <span className="text-orange-400 font-black text-sm">{streak}</span>              </div>
            )}
            <div className="flex gap-1" style={{ animation:shaking?"shake .4s ease":"none" }}>
              {[0,1,2].map(i => <span key={i} style={{ fontSize:20, opacity:i<hearts?1:0.15, filter:i<hearts?"none":"grayscale(1)" }}>❤️</span>)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-500 text-xs">Wònn {round} • {totalAnswered} kesyon</span>
            <span className="text-green-400 text-xs font-bold">{score} ✅</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background:"#0f1e4a" }}>
            <div className="h-full rounded-full" style={{ width:totalAnswered>0?`${(score/totalAnswered)*100}%`:"0%", background:"linear-gradient(90deg,#22c55e,#86efac)", transition:"width .5s" }} />
          </div>
        </div>
        <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
          <div style={{ background:"rgba(15,28,60,0.95)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:18, padding:"18px", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
            <p style={{ color:"#E8EEFF", fontWeight:600, fontSize:15, lineHeight:1.6, margin:0 }}>{currentQ.q}</p>
          </div>
          <div className="space-y-3">
            {currentQ.choices.map((choice, idx) => {
              const isCorrect = selected!==null && idx===currentQ.answer;
              const isWrong   = selected!==null && idx===selected && idx!==currentQ.answer;
              return (
                <button key={idx} onClick={() => handleChoice(idx)}
                  style={{ width:"100%", padding:"14px 16px", borderRadius:14, textAlign:"left", display:"flex", alignItems:"center", gap:12, background:isCorrect?"rgba(34,197,94,0.12)":isWrong?"rgba(239,68,68,0.1)":"rgba(15,28,60,0.90)", border:`1.5px solid ${isCorrect?"rgba(34,197,94,0.5)":isWrong?"rgba(239,68,68,0.4)":"rgba(37,99,235,0.12)"}`, color:isCorrect?"#4ADE80":isWrong?"#FC8181":"#E8EEFF", cursor:selected!==null?"default":"pointer", fontSize:14, fontWeight:500, animation:`fadeIn .2s ${idx*0.05}s ease both` }}
                  onTouchStart={e=>{ if(selected===null) e.currentTarget.style.transform="scale(0.97)"; }}
                  onTouchEnd={e  =>{ e.currentTarget.style.transform="scale(1)"; }}>
                  <span style={{ width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0, background:isCorrect?"#22C55E":isWrong?"#EF4444":`${letterColors[idx]}22`, color:isCorrect||isWrong?"white":letterColors[idx], border:`1px solid ${isCorrect?"#22C55E":isWrong?"#EF4444":`${letterColors[idx]}44`}` }}>
                    {letters[idx]}
                  </span>
                  <span style={{ flex:1, lineHeight:1.4 }}>{choice}</span>
                  {isCorrect && <span style={{ fontSize:16 }}>✅</span>}
                  {isWrong   && <span style={{ fontSize:16 }}>❌</span>}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div style={{ animation:"fadeIn .3s ease both" }}>
              {currentQ.note && (
                <div style={{ background:selected===currentQ.answer?"rgba(34,197,94,0.08)":"rgba(239,68,68,0.07)", border:`1px solid ${selected===currentQ.answer?"rgba(34,197,94,0.25)":"rgba(239,68,68,0.2)"}`, borderRadius:14, padding:"12px 14px", marginBottom:12 }}>
                  <p style={{ color:selected===currentQ.answer?"#86EFAC":"#FCA5A5", fontSize:12, lineHeight:1.6, margin:0 }}>💡 {currentQ.note}</p>
                </div>
              )}
              <button onClick={handleNext} className="w-full py-4 rounded-2xl font-bold text-white"
                style={{ background:hearts<=0?"linear-gradient(135deg,#E8002A,#EF4444)":"linear-gradient(135deg,#2563EB,#3B82F6)", borderRadius:14, border:"none" }}>
                {hearts<=0 ? "💔 Gade Rezilta" : "Kesyon ki vini apre →"}
              </button>
            </div>
          )}        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── BRAVO ──
  if (phase === "bravo") {
    const note20   = scoreToNote20(roundScore, 10);
    const mention  = getMention(note20);
    const allCount = (QUIZ_DATA[subject]||[]).length;
    const hasMore  = (allCount - usedQKeys.size) >= 5;
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background:"linear-gradient(160deg,#0a0f2e,#0d1b4b,#1a0505)" }}>
        <div className="w-full max-w-sm space-y-5" style={{ animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          <div className="text-center">
            <div style={{ fontSize:64 }}>🎊</div>
            <h2 className="text-white font-black text-3xl mt-2">Bravo !</h2>
            <p className="text-blue-300 text-sm mt-1">{subject} • Wònn {round}</p>
          </div>
          <div className="rounded-3xl px-5 py-5 text-center" style={{ background:mention.bg, border:`2px solid ${mention.border}` }}>
            <div style={{ fontSize:40 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize:48, color:mention.color, lineHeight:1 }}>{note20}<span className="text-xl" style={{ color:mention.color+"99" }}>/20</span></div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{roundScore}/10 kòrèk {streak>0?`• 🔥 Streak ${streak}`:""}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{icon:"✔",color:"#22c55e",val:score,label:"Total kòrèk"},{icon:"♦",color:"#f97316",val:maxStreak,label:"Max streak"},{icon:"▣",color:"#3b82f6",val:`${usedQKeys.size}/${allCount}`,label:"Kesyon wè"}].map((s,i)=>(
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
                <div style={{ fontSize:18, color:s.color, fontWeight:900 }}>{s.icon}</div>
                <div className="text-white font-black text-base">{s.val}</div>
                <div className="text-blue-500 text-xs">{s.label}</div>
              </div>
            ))}
          <p className="text-white font-bold text-center text-lg">Ou vle kontinye ?</p>
          <div className="flex gap-3">
            <button onClick={continueQuiz} disabled={!hasMore && usedQKeys.size >= allCount}
              className="flex-1 py-4 rounded-2xl font-black text-white text-lg"
              style={{ background:"linear-gradient(135deg,#22c55e,#16a34a)" }}>✔ Wi<
            <button onClick={() => setPhase("select")}
              className="flex-1 py-4 rounded-2xl font-black text-lg"
              style={{ background:"#0f1e4a", color:"#93c5fd", border:"1px solid #1e3a8a33" }}>✕ Non<
          </div>
          {!hasMore && usedQKeys.size >= allCount && (
            <p className="text-yellow-400 text-xs text-center">🏆 Ou fini tout {allCount} kesyon yo ! Bravo !</p>
          ))}
          </div>
      </div>
    );  }

  // ── GAME OVER ──
  if (phase === "gameover") {
    const note20  = scoreToNote20(score, totalAnswered);
    const mention = getMention(note20);
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="text-center" style={{ animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize:64 }}>💔</div>
            <h2 className="text-white font-black text-3xl mt-2">Game Over</h2>
            <p className="text-blue-400 text-sm mt-1">{subject}</p>
          </div>
          <div className="rounded-3xl px-5 py-5 text-center" style={{ background:mention.bg, border:`2px solid ${mention.border}` }}>
            <div style={{ fontSize:36 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize:52, color:mention.color, lineHeight:1 }}>{note20}<span className="text-xl" style={{ color:mention.color+"99" }}>/20</span></div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{score}/{totalAnswered} kòrèk</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{icon:"🔥",val:maxStreak,label:"Max Streak"},{icon:"✅",val:score,label:"Kòrèk"},{icon:"❓",val:totalAnswered,label:"Total"}].map((s,i)=>(
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
                <div style={{ fontSize:22 }}>{s.icon}</div>
                <div className="text-white font-black text-xl">{s.val}</div>
                <div className="text-blue-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
          {wrongAnswers.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
              <h3 className="text-white font-bold text-sm mb-3">📝 Dènye Erè Ou :</h3>
              <div className="space-y-3">
                {wrongAnswers.slice(-3).map((a,i) => (
                  <div key={i} className="rounded-xl px-3 py-2" style={{ background:"#7f1d1d22", border:"1px solid #ef444433" }}>
                    <p className="text-white text-xs font-medium mb-1">{a.q}</p>
                    <p className="text-xs" style={{ color:"#fca5a5" }}>❌ {a.choices[a.selected]}</p>
                    <p className="text-xs text-green-400">✅ {a.choices[a.correctIdx]}</p>
                    {a.note && <p className="text-xs mt-1" style={{ color:"#93c5fd" }}>💡 {a.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <button onClick={() => startQCM(subject)} className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          <button onClick={() => setPhase("select")} className="w-full py-4 rounded-2xl font-bold"
            style={{ background:"#0f1e4a", color:"#93c5fd", border:"1px solid #1e3a8a33" }}>← Chwazi lòt matyè</button>
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />      </div>
    );
  }
  return null;
}
