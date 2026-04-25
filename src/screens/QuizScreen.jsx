import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge } from "../api";
import { QUIZ_DATA } from "../quizData.js";
import { shuffleArray, shuffleChoices } from "../utils/helpers";
import { scoreToNote20, getMention, saveQuizGrade } from "../utils/quiz";
import { BottomNav } from "../components/UI";

// ─── QUIZ ────────────────────────────────────────────────────────────────────
export function QuizScreen({ user, onNavigate }) {
  const [phase, setPhase] = useState("select");
  const [subject, setSubject] = useState(null);
  const [shuffledQs, setShuffledQs] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [round, setRound] = useState(1);
  const [roundScore, setRoundScore] = useState(0);
  const [usedQKeys, setUsedQKeys] = useState(new Set());
  
  // ─── GESTION DES CATÉGORIES DÉROULANTES ───────────────────────────────────
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // ─── STRUCTURE OFFICIELLE DES MATIÈRES (MENFP) ────────────────────────────
  const categories = [
    {
      id: "SVT",
      name: "SVT",
      fullName: "Sciences de la Vie et de la Terre",
      icon: "🧬",
      color: "#22c55e",
      subjects: ["Biologie", "Géologie", "Chimie"]
    },
    {
      id: "SES",
      name: "SES",
      fullName: "Sciences Économiques et Sociales",
      icon: "🌍",
      color: "#f59e0b",
      subjects: ["Histoire", "Géographie", "Économie", "Philosophie"]
    },
    {
      id: "SMP",
      name: "SMP",
      fullName: "Sciences Mathématiques et Physiques",
      icon: "📐",
      color: "#3b82f6",
      subjects: ["Analyse", "Algèbre", "Suite", "Complexe", "Probabilité", "Géométrie", "Physiques"]
    },
    {
      id: "LLA",
      name: "LLA",      fullName: "Lettres, Langues et Arts",
      icon: "📚",
      color: "#a855f7",
      subjects: [
        "Créole", "Français", "Anglais", "Espagnol",
        "Littérature Haïtienne", "Littérature Française",
        "Dissertation",
        "Éducation Esthétique et Artistique",
        "Éducation Physique et Sportive",
        "Éducation à la Citoyenneté",
        "Numérique et Informatique"
      ]
    }
  ];
  
  // ─── MAPPING ANCIENNES → NOUVELLES CLÉS ───────────────────────────────────
  const subjectMapping = {
    "Art & Mizik Ayisyen": "Éducation Esthétique et Artistique",
    "Informatique, Technologie & Arts": "Numérique et Informatique",
    "Entrepreneuriat Scolaire": "Économie",
    "Physique": "Physiques",
    "SVT": "Biologie",
    "Mathématiques": "Analyse",
    "Sciences Sociales": "Histoire",
    "EPS": "Éducation Physique et Sportive",
    "Éducation Physique": "Éducation Physique et Sportive",
  };
  
  // ─── ICÔNES PAR MATIÈRE ───────────────────────────────────────────────────
  const allIcons = {
    // SVT
    "Biologie": "🧬", "Géologie": "🪨", "Chimie": "⚗️",
    // SES
    "Histoire": "📜", "Géographie": "🗺️", "Économie": "💰", "Philosophie": "🧠",
    // SMP
    "Analyse": "📊", "Algèbre": "🔢", "Suite": "📈", "Complexe": "∞",
    "Probabilité": "🎲", "Géométrie": "📐", "Physiques": "⚡",
    // LLA - Langues
    "Créole": "🇭🇹", "Français": "🇫🇷", "Anglais": "🇬🇧", "Espagnol": "🇪🇸",
    // LLA - Littératures
    "Littérature Haïtienne": "🇭🇹", "Littérature Française": "🇫",
    // LLA - Autres
    "Dissertation": "✍️", "Éducation Esthétique et Artistique": "🎨",
    "Éducation Physique et Sportive": "⚽", "Éducation à la Citoyenneté": "🗳️",
    "Numérique et Informatique": "💻",
  };
  
  // ─── FILTRER LES MATIÈRES DISPONIBLES ─────────────────────────────────────
  const availableCategories = categories.map(cat => ({
    ...cat,    subjects: cat.subjects.filter(sub => {
      // Vérifier si la matière est dans user.subjects
      if (user.subjects.includes(sub)) return true;
      // Vérifier les anciennes clés mappées
      const oldKeys = Object.keys(subjectMapping).filter(k => subjectMapping[k] === sub);
      return oldKeys.some(k => user.subjects.includes(k));
    })
  })).filter(cat => cat.subjects.length > 0);
  
  const currentQ = shuffledQs[qIndex];
  
  // ─── FONCTIONS QUIZ ───────────────────────────────────────────────────────
  const startQCM = (sub) => {
    const all = shuffleArray(QUIZ_DATA[sub] || []);
    if (all.length === 0) return;
    const first10 = all.slice(0, 10).map(shuffleChoices);
    const used = new Set(first10.map(q => q.q));
    setSubject(sub);
    setShuffledQs(first10);
    setUsedQKeys(used);
    setPhase("qcm");
    setQIndex(0); setScore(0); setTotalAnswered(0); setRoundScore(0);
    setHearts(3); setStreak(0); setMaxStreak(0);
    setWrongAnswers([]); setSelected(null); setRound(1);
  };
  
  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  
  const saveScoreToSupabase = async (finalScore, finalTotal, finalStreak) => {
    if (finalTotal === 0 || !subject) return;
    const note20 = scoreToNote20(finalScore, finalTotal);
    saveQuizGrade(user.phone, subject, note20, finalScore, finalTotal);
    try {
      await callEdge({
        action: "save_quiz_score",
        phone: user.phone, schoolCode: user.code,
        name: user.name || user.phone,
        subject, score: finalScore, total: finalTotal,
        note20, streak: finalStreak,
      });
    } catch (e) { console.warn("Score save failed", e); }
  };
  
  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === currentQ.answer;
    setTotalAnswered(t => t + 1);    if (correct) {
      setScore(s => s + 1);
      setRoundScore(r => r + 1);
      setStreak(s => {
        const ns = s + 1;
        setMaxStreak(m => Math.max(m, ns));
        return ns;
      });
    } else {
      setHearts(h => h - 1);
      setStreak(0);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setWrongAnswers(p => [...p.slice(-4), {
        q: currentQ.q, selected: idx, correctIdx: currentQ.answer,
        choices: currentQ.choices, note: currentQ.note,
      }]);
    }
  };
  
  const handleNext = async () => {
    if (hearts <= 0) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("gameover");
      return;
    }
    const next = qIndex + 1;
    if (next >= shuffledQs.length) {
      await saveScoreToSupabase(score, totalAnswered, maxStreak);
      setPhase("bravo");
      return;
    }
    setQIndex(next);
    setSelected(null);
  };
  
  const continueQuiz = () => {
    const all = QUIZ_DATA[subject] || [];
    const unseen = all.filter(q => !usedQKeys.has(q.q));
    const pool = unseen.length >= 10 ? unseen : shuffleArray(all);
    const next10 = shuffleArray(pool).slice(0, 10).map(shuffleChoices);
    const newUsed = new Set([...usedQKeys, ...next10.map(q => q.q)]);
    setShuffledQs(next10);
    setUsedQKeys(newUsed);
    setQIndex(0);
    setSelected(null);
    setRoundScore(0);
    setRound(r => r + 1);
    setPhase("qcm");
  };  
  // ── SELECT ─
  if (phase === "select") return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"rgba(10,15,46,0.98)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width:38, height:38, borderRadius:9, overflow:"hidden", flexShrink:0, background:"#fff", boxShadow:"0 2px 10px #00000044" }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        </div>
        <div>
          <h2 style={{ color:"#E8EEFF", fontWeight:800, fontSize:15, margin:0 }}>Quiz NS4</h2>
          <p style={{ color:"#4B6ABA", fontSize:11, margin:0, marginTop:1 }}>
            {availableCategories.reduce((sum, cat) => sum + cat.subjects.length, 0)} matières disponibles
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Mode Duolingo */}
        <div style={{ background:"linear-gradient(135deg,rgba(232,0,42,0.12),rgba(255,92,53,0.08))", border:"1px solid rgba(232,0,42,0.2)", borderRadius:16, padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22 }}>❤️❤️❤️</span>
          <div>
            <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:12 }}>Mode Duolingo — 3 kè</div>
            <div style={{ color:"#5B7ADB", fontSize:11, marginTop:2 }}>Kesyon enfini • Jwe jouk ou pèdi 3 kè</div>
          </div>
        </div>
        
        {/* Liste des catégories */}
        <div className="space-y-2">
          {availableCategories.map(category => {
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id}>
                {/* Header de catégorie */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  style={{
                    width:"100%", padding:"14px 16px", borderRadius:16, textAlign:"left",
                    display:"flex", alignItems:"center", gap:14, border:"none",
                    background:"rgba(15,28,60,0.90)", border:`1px solid ${category.color}40`,
                    boxShadow:"0 2px 12px rgba(0,0,0,0.2)", cursor:"pointer",
                    transition:"all .2s",
                  }}
                  onTouchStart={e => { e.currentTarget.style.transform="scale(0.98)"; }}
                  onTouchEnd={e => { e.currentTarget.style.transform="scale(1)"; }}
                >
                  <div style={{ 
                    width:44, height:44, borderRadius:12, 
                    background:`${category.color}22`, 
                    display:"flex", alignItems:"center", justifyContent:"center",                     flexShrink:0,
                    border:`1px solid ${category.color}44`
                  }}>
                    <span style={{ fontSize:24 }}>{category.icon}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#E8EEFF", fontWeight:700, fontSize:13 }}>
                      {category.name} <span style={{ fontWeight:400, opacity:0.7 }}>- {category.fullName}</span>
                    </div>
                    <div style={{ color:"#4B5EA8", fontSize:11, marginTop:3 }}>
                      {category.subjects.length} matière{s => category.subjects.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <span style={{ 
                    color:category.color, fontSize:18, 
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition:"transform .2s"
                  }}>
                    ▼
                  </span>
                </button>
                
                {/* Sous-matières (déroulant) */}
                {isExpanded && (
                  <div style={{ 
                    marginTop:8, marginLeft:16, paddingLeft:16, 
                    borderLeft:`2px solid ${category.color}40`,
                    animation:"slideIn .2s ease both"
                  }}>
                    {category.subjects.map(sub => {
                      const hasQuestions = QUIZ_DATA[sub] && QUIZ_DATA[sub].length > 0;
                      return (
                        <button
                          key={sub}
                          onClick={() => hasQuestions && startQCM(sub)}
                          disabled={!hasQuestions}
                          style={{
                            width:"100%", padding:"10px 12px", borderRadius:12, textAlign:"left",
                            display:"flex", alignItems:"center", gap:10, border:"none",
                            background:!hasQuestions ? "rgba(255,255,255,0.03)" : "rgba(37,99,235,0.08)",
                            border:`1px solid ${!hasQuestions ? "rgba(255,255,255,0.05)" : `${category.color}30`}`,
                            cursor:!hasQuestions ? "not-allowed" : "pointer",
                            opacity:!hasQuestions ? 0.5 : 1,
                            transition:"all .2s",
                            marginBottom:6,
                          }}
                          onTouchStart={e => { 
                            if(hasQuestions) {
                              e.currentTarget.style.transform="scale(0.98)";
                              e.currentTarget.style.borderColor=category.color;                            }
                          }}
                          onTouchEnd={e => { 
                            e.currentTarget.style.transform="scale(1)";
                            e.currentTarget.style.borderColor=!hasQuestions ? "rgba(255,255,255,0.05)" : `${category.color}30`;
                          }}
                        >
                          <div style={{ fontSize:18 }}>{allIcons[sub] || "📚"}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ color:"#E8EEFF", fontWeight:600, fontSize:12 }}>{sub}</div>
                            <div style={{ color:"#4B5EA8", fontSize:10 }}>
                              {hasQuestions ? `${QUIZ_DATA[sub].length} kesyon` : "Pa gen kesyon"}
                            </div>
                          </div>
                          {hasQuestions && (
                            <span style={{ color:category.color, fontSize:16 }}>›</span>
                          )}
                        </button>
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
      
      <style>{`
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-10px); }
          to { opacity:1; transform:translateX(0); }
        }
      `}</style>
    </div>
  );
  
  // ── QCM ──
  if (phase === "qcm" && currentQ) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-3 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setPhase("select")} className="text-blue-400 text-xl">←</button>
          <h2 className="text-white font-bold flex-1 text-sm">{subject}</h2>
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#f97316" + "33", border: "1px solid #f9731644" }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <span className="text-orange-400 font-black text-sm">{streak}</span>
            </div>          )}
          <div className="flex gap-1" style={{ animation: shaking ? "shake .4s ease" : "none" }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ fontSize: 20, opacity: i < hearts ? 1 : 0.15, filter: i < hearts ? "none" : "grayscale(1)" }}>❤️</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-500 text-xs">Wònn {round} • {totalAnswered} kesyon</span>
          <span className="text-green-400 text-xs font-bold">{score} ✅</span>
        </div>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#0f1e4a" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: totalAnswered > 0 ? `${(score / totalAnswered) * 100}%` : "0%", background: "linear-gradient(90deg,#22c55e,#86efac)" }} />
        </div>
      </div>
      
      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <div style={{ background:"rgba(15,28,60,0.95)", border:"1px solid rgba(37,99,235,0.15)", borderRadius:18, padding:"18px 18px", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
          <p style={{ color:"#E8EEFF", fontWeight:600, fontSize:15, lineHeight:1.6, margin:0 }}>{currentQ.q}</p>
        </div>
        
        <div className="space-y-3">
          {currentQ.choices.map((choice, idx) => {
            const isCorrect = selected !== null && idx === currentQ.answer;
            const isWrong = selected !== null && idx === selected && idx !== currentQ.answer;
            const letters = ["A","B","C","D"];
            const letterColors = ["#2563EB","#7C3AED","#059669","#D97706"];
            
            return (
              <button key={idx} onClick={() => handleChoice(idx)}
                style={{
                  width:"100%", padding:"14px 16px", borderRadius:14, textAlign:"left",
                  display:"flex", alignItems:"center", gap:12,
                  background: isCorrect ? "rgba(34,197,94,0.12)" : isWrong ? "rgba(239,68,68,0.1)" : "rgba(15,28,60,0.90)",
                  border: `1.5px solid ${isCorrect ? "rgba(34,197,94,0.5)" : isWrong ? "rgba(239,68,68,0.4)" : "rgba(37,99,235,0.12)"}`,
                  color: isCorrect ? "#4ADE80" : isWrong ? "#FC8181" : "#E8EEFF",
                  cursor: selected !== null ? "default" : "pointer",
                  transition:"all .2s",
                  animation: `fadeIn .2s ${idx*0.05}s ease both`,
                  fontSize:14, fontWeight:500,
                }}>
                <span style={{
                  width:28, height:28, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:800, fontSize:12, flexShrink:0,
                  background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}22`,
                  color: isCorrect || isWrong ? "white" : letterColors[idx],
                  border: `1px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}44`}`
                }}>
                  {letters[idx]}                </span>
                <span style={{ flex:1, lineHeight:1.4 }}>{choice}</span>
                {isCorrect && <span style={{ fontSize:16, flexShrink:0 }}>✅</span>}
                {isWrong && <span style={{ fontSize:16, flexShrink:0 }}>❌</span>}
              </button>
            );
          })}
        </div>
        
        {selected !== null && (
          <div style={{ animation: "fadeIn .3s ease both" }}>
            {currentQ.note && (
              <div style={{
                background: selected === currentQ.answer ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.07)",
                border: `1px solid ${selected === currentQ.answer ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.2)"}`,
                borderRadius:14, padding:"12px 14px", marginBottom:12
              }}>
                <p style={{ color: selected === currentQ.answer ? "#86EFAC" : "#FCA5A5", fontSize:12, lineHeight:1.6, margin:0 }}>
                  💡 {currentQ.note}
                </p>
              </div>
            )}
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
              style={{
                background: hearts <= 0 ? "linear-gradient(135deg,#E8002A,#EF4444)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
                boxShadow: hearts <= 0 ? "0 4px 20px rgba(232,0,42,0.3)" : "0 4px 20px rgba(37,99,235,0.3)",
                borderRadius:14, border:"none"
              }}>
              {hearts <= 0 ? "💔 Gade Rezilta" : "Kesyon ki vini apre →"}
            </button>
          </div>
        )}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );
  
  // ── BRAVO ──
  if (phase === "bravo") {
    const note20 = scoreToNote20(roundScore, 10);
    const mention = getMention(note20);
    const allCount = (QUIZ_DATA[subject] || []).length;
    const seenCount = usedQKeys.size;
    const hasMore = (allCount - seenCount) >= 5;
    
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(160deg,#0a0f2e,#0d1b4b,#1a0505)" }}>
        <div className="w-full max-w-sm space-y-5" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          <div className="text-center">            <div style={{ fontSize: 64 }}>🎉</div>
            <h2 className="text-white font-black text-3xl mt-2">Bravo !</h2>
            <p className="text-blue-300 text-sm mt-1">{subject} • Wònn {round}</p>
          </div>
          
          <div className="rounded-3xl px-5 py-5 text-center" style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: 40 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 48, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{roundScore}/10 kòrèk • {streak > 0 ? `🔥 Streak ${streak}` : ""}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: "✅", val: score, label: "Total kòrèk" },
              { icon: "🔥", val: maxStreak, label: "Max streak" },
              { icon: "📚", val: `${seenCount}/${allCount}`, label: "Kesyon wè" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div className="text-white font-black text-base">{s.val}</div>
                <div className="text-blue-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
          
          <p className="text-white font-bold text-center text-lg">Ou vle kontinye ?</p>
          
          <div className="flex gap-3">
            <button onClick={continueQuiz} disabled={!hasMore && seenCount >= allCount}
              className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 20px #22c55e44" }}>
              ✅ Wi
            </button>
            <button onClick={() => setPhase("select")}
              className="flex-1 py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform"
              style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>
              ❌ Non
            </button>
          </div>
          
          {!hasMore && seenCount >= allCount && (
            <p className="text-yellow-400 text-xs text-center">🏆 Ou fini tout {allCount} kesyon yo ! Bravo !</p>
          )}
        </div>
      </div>
    );
  }  
  // ── GAME OVER ──
  if (phase === "gameover") {
    const note20 = scoreToNote20(score, totalAnswered);
    const mention = getMention(note20);
    
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="text-center" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <div style={{ fontSize: 64 }}>💔</div>
            <h2 className="text-white font-black text-3xl mt-2">Game Over</h2>
            <p className="text-blue-400 text-sm mt-1">{subject}</p>
          </div>
          
          <div className="rounded-3xl px-5 py-5 text-center"
            style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: mention.emoji === "🏆" ? 40 : 36 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 52, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl font-bold" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{score}/{totalAnswered} kòrèk • {subject}</div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🔥", val: maxStreak, label: "Max Streak" },
              { icon: "✅", val: score, label: "Kòrèk" },
              { icon: "❓", val: totalAnswered, label: "Total" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ fontSize: 22 }}>{stat.icon}</div>
                <div className="text-white font-black text-xl">{stat.val}</div>
                <div className="text-blue-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {wrongAnswers.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
              <h3 className="text-white font-bold text-sm mb-3">📝 Dènye Erè Ou :</h3>
              <div className="space-y-3">
                {wrongAnswers.slice(-3).map((a, i) => (
                  <div key={i} className="rounded-xl px-3 py-2" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
                    <p className="text-white text-xs font-medium mb-1">{a.q}</p>
                    <p className="text-xs" style={{ color: "#fca5a5" }}>❌ {a.choices[a.selected]}</p>
                    <p className="text-xs text-green-400">✅ {a.choices[a.correctIdx]}</p>
                    {a.note && <p className="text-xs mt-1" style={{ color: "#93c5fd" }}>💡 {a.note}</p>}
                  </div>                ))}
              </div>
            </div>
          )}
          
          <button onClick={() => startQCM(subject)} className="w-full py-4 rounded-2xl font-bold text-white"
            style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>🔄 Eseye Ankò</button>
          <button onClick={() => setPhase("select")} className="w-full py-4 rounded-2xl font-bold"
            style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>← Chwazi lòt matyè</button>
        </div>
        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }
  
  return null;
}

export default QuizScreen;              
