import { useState } from "react";
import { APP_LOGO } from "../config";
import { callEdge } from "../api";
import { QUIZ_DATA, QUIZ_BRANCHES as FILIERES } from "../data/quizData";
import { shuffleArray, shuffleChoices } from "../utils/helpers";
import { scoreToNote20, getMention, saveQuizGrade } from "../utils/quiz";
import { BottomNav } from "../components/UI";


// ─── SVG ICONS UTILITAIRES ─────────────────────────────────────────────────
const HeartIcon = ({ filled = true, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: filled ? "none" : "grayscale(1)", opacity: filled ? 1 : 0.15 }}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const FireIcon = ({ size = 14, color = "#f97316" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const CheckCircleIcon = ({ size = 16, color = "#22c55e" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon = ({ size = 16, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);

const LightbulbIcon = ({ size = 14, color = "#fbbf24" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5a6 6 0 0 0-11 0c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const RefreshIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const FileTextIcon = ({ size = 24, color = "#3b82f6" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ChevronIcon = ({ open, color = "#fff" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform .25s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// ─── FONCTION D'ICÔNE PAR MATIÈRE ──────────────────────────────────────────
const getSubjectIcon = (subject, size = 22, color = "#fff") => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch(subject) {
    // SVT
    case "Biologie":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3v18"/>
          <path d="M8 8l8 8"/>
          <path d="M16 8l-8 8"/>
        </svg>
      );
    case "Géologie":
      return (
        <svg {...svgProps}>
          <path d="M3 20h18L12 4 3 20z"/>
          <path d="M8 14l4-6 4 6"/>
          <path d="M10 18h4"/>
        </svg>
      );
    case "Chimie":
      return (
        <svg {...svgProps}>
          <path d="M9 3h6v8l-3 9-3-9V3z"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M6 16l2-2"/>
          <path d="M18 16l-2-2"/>
        </svg>
      );
    
    // SES
    case "Histoire":
      return (
        <svg {...svgProps}>
          <path d="M12 8v4l3 3"/>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 2v2"/>
          <path d="M12 20v2"/>
          <path d="M2 12h2"/>
          <path d="M20 12h2"/>
        </svg>
      );
    case "Géographie":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    case "Économie":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 6v12"/>
          <path d="M9 9h6"/>
          <path d="M9 15h6"/>
          <path d="M10 12h4"/>
        </svg>
      );
    case "Philosophie":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 8v8"/>
          <path d="M8 12h8"/>
          <circle cx="12" cy="12" r="2" fill={color}/>
        </svg>
      );
    
    // SMP
    case "Analyse":
      return (
        <svg {...svgProps}>
          <path d="M3 3v18h18"/>
          <path d="M7 16l4-8 4 4 5-10"/>
        </svg>
      );
    case "Algèbre":
      return (
        <svg {...svgProps}>
          <path d="M4 4h16v16H4z"/>
          <path d="M8 8l8 8"/>
          <path d="M16 8l-8 8"/>
          <circle cx="12" cy="12" r="1" fill={color}/>
        </svg>
      );
    case "Suite":
      return (
        <svg {...svgProps}>
          <path d="M3 12h4l3-9 4 18 3-9h4"/>
        </svg>
      );
    case "Complexe":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 3v18"/>
          <path d="M3 12h18"/>
          <circle cx="12" cy="12" r="2" fill={color}/>
        </svg>
      );
    case "Probabilité":
      return (
        <svg {...svgProps}>
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8" cy="8" r="1.5" fill={color}/>
          <circle cx="16" cy="8" r="1.5" fill={color}/>
          <circle cx="8" cy="16" r="1.5" fill={color}/>
          <circle cx="16" cy="16" r="1.5" fill={color}/>
          <circle cx="12" cy="12" r="1.5" fill={color}/>
        </svg>
      );
    case "Géométrie":
      return (
        <svg {...svgProps}>
          <path d="M3 3l7 19 7-19 7 19H3z"/>
          <path d="M12 3v19"/>
        </svg>
      );
    case "Physique":
      return (
        <svg {...svgProps}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      );
    
    // LLA
    case "Créole":
      return (
        <svg {...svgProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          <path d="M8 10h8"/>
          <path d="M8 14h5"/>
        </svg>
      );
    case "Français":
      return (
        <svg {...svgProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <path d="M8 7h8"/>
          <path d="M8 11h6"/>
          <path d="M8 15h8"/>
        </svg>
      );
    case "Anglais":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    case "Espagnol":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
      );
    case "Dissertation":
      return (
        <svg {...svgProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      );
    case "Littérature Haïtienne":
      return (
        <svg {...svgProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <path d="M12 6v12"/>
          <path d="M8 10h8"/>
        </svg>
      );
    case "Littérature Française":
      return (
        <svg {...svgProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <path d="M12 6v12"/>
          <path d="M8 10h8"/>
        </svg>
      );
    case "Éducation Esthétique et Artistique":
      return (
        <svg {...svgProps}>
          <circle cx="13.5" cy="6.5" r="2.5"/>
          <path d="M17 17a5 5 0 0 1-7 0c-1.5-1.5-2-4-1-6 .5-1 1-2 2-2 2 0 3 2 4 3"/>
          <circle cx="8.5" cy="14.5" r="1.5" fill={color}/>
          <circle cx="12" cy="12" r="1" fill={color}/>
          <circle cx="15.5" cy="13.5" r="1" fill={color}/>
        </svg>
      );
    case "Éducation Physique et Sportive":
      return (
        <svg {...svgProps}>
          <circle cx="12" cy="12" r="10"/>
          <path d="M5.5 5.5L18.5 18.5"/>
          <path d="M18.5 5.5L5.5 18.5"/>
          <path d="M12 2v20"/>
          <path d="M2 12h20"/>
        </svg>
      );
    case "Éducation à la Citoyenneté":
      return (
        <svg {...svgProps}>
          <path d="M3 21h18"/>
          <path d="M5 21V7l7-4 7 4v14"/>
          <path d="M9 21v-6h6v6"/>
          <path d="M9 9h.01"/>
          <path d="M15 9h.01"/>
        </svg>
      );
    case "Numérique et Informatique":
      return (
        <svg {...svgProps}>
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="M8 21h8"/>
          <path d="M12 17v4"/>
          <path d="M6 7h4"/>
          <path d="M6 11h2"/>
        </svg>
      );
    
    default:
      return <span style={{ fontSize: 20 }}>📚</span>;
  }
};

// ─── QUIZ SCREEN ─────────────────────────────────────────────────────────────
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
  const [openBranch, setOpenBranch] = useState(null);

  const currentQ = shuffledQs[qIndex];

  // ─── HANDLERS ────────────────────────────────────────────────────────────────
  const startQCM = (sub) => {
    const all = shuffleArray(QUIZ_DATA[sub]);
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
    setTotalAnswered(t => t + 1);
    if (correct) {
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

  // ── SELECT (ACCORDION) ────────────────────────────────────────────────────────
  if (phase === "select") {
    const totalAvailable = Object.values(FILIERES).flatMap(f => f.subjects)
      .filter(s => user.subjects.includes(s) && QUIZ_DATA[s]).length;

    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "rgba(10,15,46,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, overflow: "hidden", flexShrink: 0, background: "#fff", boxShadow: "0 2px 10px #00000044" }}>
            <img src={APP_LOGO} alt="Gid NS4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <h2 style={{ color: "#E8EEFF", fontWeight: 800, fontSize: 15, margin: 0 }}>Quiz NS4</h2>
            <p style={{ color: "#4B6ABA", fontSize: 11, margin: 0, marginTop: 1 }}>
              {totalAvailable} matyè disponib
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

          {/* Info kè */}
          <div style={{ background: "linear-gradient(135deg,rgba(232,0,42,0.12),rgba(255,92,53,0.08))", border: "1px solid rgba(232,0,42,0.2)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => <HeartIcon key={i} filled={true} size={22} />)}
            </div>
            <div>
              <div style={{ color: "#E8EEFF", fontWeight: 700, fontSize: 12 }}>3 kè</div>
              <div style={{ color: "#5B7ADB", fontSize: 11, marginTop: 2 }}>Kesyon enfini • Jwe jouk ou pèdi 3 kè</div>
            </div>
          </div>

          <p style={{ color: "#4B5EA8", fontSize: 11, textAlign: "center", padding: "4px 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Chwazi yon filye
          </p>

          {/* Accordion par branche */}
          {Object.entries(FILIERES).map(([key, filiere]) => {
            const isOpen = openBranch === key;
            const availableInBranch = filiere.subjects.filter(
              s => user.subjects.includes(s) && QUIZ_DATA[s]
            ).length;
            const totalInBranch = filiere.subjects.length;

            return (
              <div key={key} style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${isOpen ? filiere.color + "44" : "rgba(37,99,235,0.12)"}`, transition: "border-color .25s" }}>

                {/* En-tête de branche (cliquable) */}
                <button
                  onClick={() => setOpenBranch(isOpen ? null : key)}
                  style={{
                    width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                    background: isOpen ? `${filiere.color}18` : "rgba(15,28,60,0.90)",
                    border: "none", cursor: "pointer", transition: "background .25s",
                  }}
                  onTouchStart={e => { e.currentTarget.style.opacity = "0.85"; }}
                  onTouchEnd={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {/* Badge filière */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: `${filiere.color}22`,
                    border: `1.5px solid ${filiere.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: filiere.color, fontWeight: 900, fontSize: 13 }}>{key}</span>
                  </div>

                  {/* Label + compteur */}
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ color: "#E8EEFF", fontWeight: 700, fontSize: 13 }}>{key}</div>
                    <div style={{ color: "#4B5EA8", fontSize: 11, marginTop: 2 }}>
                      {availableInBranch}/{totalInBranch} matyè • {filiere.subjects.filter(s => QUIZ_DATA[s]).reduce((acc, s) => acc + (QUIZ_DATA[s]?.length || 0), 0)} kesyon
                    </div>
                  </div>

                  {/* Indicateur disponibilité + chevron */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {availableInBranch > 0 && (
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: filiere.color, boxShadow: `0 0 6px ${filiere.color}` }} />
                    )}
                    <ChevronIcon open={isOpen} color={filiere.color} />
                  </div>
                </button>

                {/* Sous-matières (accordéon ouvert) */}
                {isOpen && (
                  <div style={{ background: "rgba(10,15,40,0.95)", borderTop: `1px solid ${filiere.color}22` }}>
                    {filiere.subjects.map((sub, idx) => {
                      const available = user.subjects.includes(sub) && QUIZ_DATA[sub];
                      const qCount = QUIZ_DATA[sub]?.length || 0;

                      return available ? (
                        <button
                          key={sub}
                          onClick={() => startQCM(sub)}
                          style={{
                            width: "100%", padding: "12px 16px 12px 24px",
                            display: "flex", alignItems: "center", gap: 12,
                            background: "transparent", border: "none",
                            borderBottom: idx < filiere.subjects.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            cursor: "pointer", transition: "background .15s",
                            animation: `fadeIn .2s ${idx * 0.04}s ease both`,
                          }}
                          onTouchStart={e => { e.currentTarget.style.background = `${filiere.color}12`; }}
                          onTouchEnd={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          {/* Ligne verticale de couleur */}
                          <div style={{ width: 3, height: 36, borderRadius: 3, background: filiere.color, flexShrink: 0, opacity: 0.7 }} />

                          {/* Icône SVG */}
                          <div style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: 10, 
                            background: `${filiere.color}22`,
                            border: `1px solid ${filiere.color}44`,
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            flexShrink: 0 
                          }}>
                            {getSubjectIcon(sub, 22, filiere.color)}
                          </div>

                          {/* Nom + nombre de questions */}
                          <div style={{ flex: 1, textAlign: "left" }}>
                            <div style={{ color: "#E8EEFF", fontWeight: 600, fontSize: 13 }}>{sub}</div>
                            <div style={{ color: "#4B5EA8", fontSize: 11, marginTop: 2 }}>
                              {qCount} kesyon
                            </div>
                          </div>

                          <span style={{ color: filiere.color, fontSize: 18, opacity: 0.7 }}>›</span>
                        </button>
                      ) : (
                        /* Matière verrouillée */
                        <div
                          key={sub}
                          style={{
                            padding: "12px 16px 12px 24px",
                            display: "flex", alignItems: "center", gap: 12,
                            borderBottom: idx < filiere.subjects.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                            opacity: 0.3,
                          }}
                        >
                          <div style={{ width: 3, height: 36, borderRadius: 3, background: "#4B5EA8", flexShrink: 0 }} />
                          <div style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: 10, 
                            background: "rgba(75,94,168,0.15)",
                            border: "1px solid rgba(75,94,168,0.2)",
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            flexShrink: 0 
                          }}>
                            {getSubjectIcon(sub, 22, "#4B5EA8")}
                          </div>
                          <div style={{ flex: 1, textAlign: "left" }}>
                            <div style={{ color: "#E8EEFF", fontWeight: 600, fontSize: 13 }}>{sub}</div>
                            <div style={{ color: "#4B5EA8", fontSize: 11, marginTop: 2 }}>Pa disponib ak kòd lekòl ou</div>
                          </div>
                          <span style={{ fontSize: 14 }}>🔒</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <BottomNav active="quiz" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── QCM ──────────────────────────────────────────────────────────────────────
  if (phase === "qcm" && currentQ) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-3 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setPhase("select")} className="text-blue-400 text-xl">←</button>
          <h2 className="text-white font-bold flex-1 text-sm">{subject}</h2>
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "#f97316" + "33", border: "1px solid #f9731644" }}>
              <FireIcon size={14} />
              <span className="text-orange-400 font-black text-sm">{streak}</span>
            </div>
          )}
          <div className="flex gap-1" style={{ animation: shaking ? "shake .4s ease" : "none" }}>
            {[0, 1, 2].map(i => <HeartIcon key={i} filled={i < hearts} size={20} />)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-blue-500 text-xs">Wònn {round} • {totalAnswered} kesyon</span>
          <span className="text-green-400 text-xs font-bold flex items-center gap-1">{score} <CheckCircleIcon size={12} /></span>
        </div>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#0f1e4a" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: totalAnswered > 0 ? `${(score / totalAnswered) * 100}%` : "0%", background: "linear-gradient(90deg,#22c55e,#86efac)" }} />
        </div>
      </div>

      <div className="flex-1 px-4 py-5 flex flex-col gap-4 overflow-y-auto">
        <div style={{ background: "rgba(15,28,60,0.95)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: 18, padding: "18px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
          <p style={{ color: "#E8EEFF", fontWeight: 600, fontSize: 15, lineHeight: 1.6, margin: 0 }}>{currentQ.q}</p>
        </div>

        <div className="space-y-3">
          {currentQ.choices.map((choice, idx) => {
            const isCorrect = selected !== null && idx === currentQ.answer;
            const isWrong = selected !== null && idx === selected && idx !== currentQ.answer;
            const isNeutral = selected === null;
            const letters = ["A", "B", "C", "D"];
            const letterColors = ["#2563EB", "#7C3AED", "#059669", "#D97706"];
            return (
              <button key={idx} onClick={() => handleChoice(idx)}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 14, textAlign: "left",
                  display: "flex", alignItems: "center", gap: 12,
                  background: isCorrect ? "rgba(34,197,94,0.12)" : isWrong ? "rgba(239,68,68,0.1)" : "rgba(15,28,60,0.90)",
                  border: `1.5px solid ${isCorrect ? "rgba(34,197,94,0.5)" : isWrong ? "rgba(239,68,68,0.4)" : "rgba(37,99,235,0.12)"}`,
                  color: isCorrect ? "#4ADE80" : isWrong ? "#FC8181" : "#E8EEFF",
                  cursor: selected !== null ? "default" : "pointer",
                  transition: "all .2s",
                  animation: `fadeIn .2s ${idx * 0.05}s ease both`,
                  fontSize: 14, fontWeight: 500,
                  boxShadow: isCorrect ? "0 4px 20px rgba(34,197,94,0.15)" : isWrong ? "0 4px 20px rgba(239,68,68,0.1)" : "none",
                }}
                onTouchStart={e => { if (isNeutral) e.currentTarget.style.transform = "scale(0.97)"; }}
                onTouchEnd={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 12, flexShrink: 0,
                  background: isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}22`,
                  color: isCorrect || isWrong ? "white" : letterColors[idx],
                  border: `1px solid ${isCorrect ? "#22C55E" : isWrong ? "#EF4444" : `${letterColors[idx]}44`}`,
                }}>
                  {letters[idx]}
                </span>
                <span style={{ flex: 1, lineHeight: 1.4 }}>{choice}</span>
                {isCorrect && <CheckCircleIcon size={16} />}
                {isWrong && <XCircleIcon size={16} />}
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
                borderRadius: 14, padding: "12px 14px", marginBottom: 12,
              }}>
                <p style={{ color: selected === currentQ.answer ? "#86EFAC" : "#FCA5A5", fontSize: 12, lineHeight: 1.6, margin: 0 }} className="flex items-center gap-2">
                  <LightbulbIcon /> {currentQ.note}
                </p>
              </div>
            )}
            <button onClick={handleNext}
              className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
              style={{
                background: hearts <= 0 ? "linear-gradient(135deg,#E8002A,#EF4444)" : "linear-gradient(135deg,#2563EB,#3B82F6)",
                boxShadow: hearts <= 0 ? "0 4px 20px rgba(232,0,42,0.3)" : "0 4px 20px rgba(37,99,235,0.3)",
                borderRadius: 14, border: "none",
              }}>
              {hearts <= 0 ? "💔 Gade Rezilta" : "Kesyon ki vini apre"}
            </button>
          </div>
        )}
      </div>
      <BottomNav active="quiz" onNavigate={onNavigate} />
    </div>
  );

  // ── BRAVO ─────────────────────────────────────────────────────────────────────
  if (phase === "bravo") {
    const note20 = scoreToNote20(roundScore, 10);
    const mention = getMention(note20);
    const allCount = (QUIZ_DATA[subject] || []).length;
    const seenCount = usedQKeys.size;
    const hasMore = (allCount - seenCount) >= 5;

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background: "linear-gradient(160deg,#0a0f2e,#0d1b4b,#1a0505)" }}>
        <div className="w-full max-w-sm space-y-5" style={{ animation: "popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
          <div className="text-center">
            <div style={{ fontSize: 64 }}>🎉</div>
            <h2 className="text-white font-black text-3xl mt-2">Bravo !</h2>
            <p className="text-blue-300 text-sm mt-1">{subject} • Wònn {round}</p>
          </div>

          <div className="rounded-3xl px-5 py-5 text-center" style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 48, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1 flex items-center justify-center gap-1">
              {roundScore}/10 kòrèk {streak > 0 && <><FireIcon size={14} /> Streak {streak}</>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <CheckCircleIcon size={24} color="#22c55e" />, val: score, label: "Total kòrèk" },
              { icon: <FireIcon size={24} color="#f97316" />, val: maxStreak, label: "Max streak" },
              { icon: <span style={{ fontSize: 20 }}>📖</span>, val: `${seenCount}/${allCount}`, label: "Kesyon wè" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{stat.icon}</div>
                <div className="text-white font-black text-base">{stat.val}</div>
                <div className="text-blue-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-white font-bold text-center text-lg">Ou vle kontinye ?</p>

          <div className="flex gap-3">
            <button onClick={continueQuiz}
              disabled={!hasMore && seenCount >= allCount}
              className="flex-1 py-4 rounded-2xl font-black text-white text-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", boxShadow: "0 4px 20px #22c55e44", opacity: (!hasMore && seenCount >= allCount) ? 0.5 : 1, cursor: (!hasMore && seenCount >= allCount) ? "not-allowed" : "pointer" }}>
              <CheckCircleIcon size={22} color="white" /> Wi
            </button>
            <button onClick={() => setPhase("select")}
              className="flex-1 py-4 rounded-2xl font-black text-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>
              <XCircleIcon size={22} color="#93c5fd" /> Non
            </button>
          </div>

          {!hasMore && seenCount >= allCount && (
            <p className="text-yellow-400 text-xs text-center">🏆 Ou fini tout {allCount} kesyon yo ! Bravo !</p>
          )}
        </div>
      </div>
    );
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────────
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

          <div className="rounded-3xl px-5 py-5 text-center" style={{ background: mention.bg, border: `2px solid ${mention.border}` }}>
            <div style={{ fontSize: 36 }}>{mention.emoji}</div>
            <div className="font-black mt-1" style={{ fontSize: 52, color: mention.color, lineHeight: 1 }}>
              {note20}<span className="text-xl font-bold" style={{ color: mention.color + "99" }}>/20</span>
            </div>
            <div className="text-white font-bold text-lg mt-1">{mention.label}</div>
            <div className="text-blue-300 text-sm mt-1">{score}/{totalAnswered} kòrèk • {subject}</div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FireIcon size={22} color="#f97316" />, val: maxStreak, label: "Max Streak" },
              { icon: <CheckCircleIcon size={22} color="#22c55e" />, val: score, label: "Kòrèk" },
              { icon: <FileTextIcon size={22} color="#3b82f6" />, val: totalAnswered, label: "Total" },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>{stat.icon}</div>
                <div className="text-white font-black text-xl">{stat.val}</div>
                <div className="text-blue-500 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>

          {wrongAnswers.length > 0 && (
            <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <FileTextIcon size={16} color="#fca5a5" /> Dènye Erè Ou :
              </h3>
              <div className="space-y-3">
                {wrongAnswers.slice(-3).map((a, i) => (
                  <div key={i} className="rounded-xl px-3 py-2" style={{ background: "#7f1d1d22", border: "1px solid #ef444433" }}>
                    <p className="text-white text-xs font-medium mb-1">{a.q}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "#fca5a5" }}>
                      <XCircleIcon size={10} /> {a.choices[a.selected]}
                    </p>
                    <p className="text-xs flex items-center gap-1 text-green-400">
                      <CheckCircleIcon size={10} /> {a.choices[a.correctIdx]}
                    </p>
                    {a.note && <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#93c5fd" }}>
                      <LightbulbIcon size={10} /> {a.note}
                    </p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => startQCM(subject)} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
            <RefreshIcon /> Eseye Ankò
          </button>
          <button onClick={() => setPhase("select")} className="w-full py-4 rounded-2xl font-bold"
            style={{ background: "#0f1e4a", color: "#93c5fd", border: "1px solid #1e3a8a33" }}>
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