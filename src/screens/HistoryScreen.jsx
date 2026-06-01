import { useState, useEffect } from "react";
import { PROF_LAKAY_PHOTO } from "../config";
import { idbGetScans, idbDeleteScan, idbGetExercice, idbDeleteExercice } from "../utils/idb";
import { LatexText } from "../components/LatexText";
import { BottomNav } from "../components/UI";
import { hasAccess } from "../utils/freemium";

/* ─── Icons ─────────────────────────────────────────────────────────── */
const IcoClipboard  = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>);
const IcoDatabase   = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>);
const IcoWarning    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IcoCamera     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const IcoChat       = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const IcoChart      = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IcoInbox      = () => (<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>);
const IcoTrash      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>);
const IcoLoader     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const IcoVolumeUp   = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const IcoStop       = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>);
const IcoPencil     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);
const IcoBook       = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2C9.243 2 7 4.243 7 7v9c0 .55.45 1 1 1s1-.45 1-1V7c0-1.654 1.346-3 3-3s3 1.346 3 3v9c0 .55.45 1 1 1s1-.45 1-1V7c0-2.757-2.243-5-5-5zm-5 16H5V7c0-.55-.45-1-1-1s-1 .45-1 1v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-.55-.45-1-1-1s-1 .45-1 1v11H7z"/></svg>);
const IcoStar       = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>);

/* ─── Palette matières ───────────────────────────────────────────────── */
const SUBJECT_COLORS = {
  /* ── Créole ── */
  "Matematik":      { bg: "#1e3a8a", accent: "#60a5fa", glow: "#3b82f6" },
  "Fizik":          { bg: "#4c1d95", accent: "#c084fc", glow: "#9333ea" },
  "Chimie":         { bg: "#064e3b", accent: "#34d399", glow: "#10b981" },
  "Byoloji":        { bg: "#14532d", accent: "#86efac", glow: "#22c55e" },
  "Istwa":          { bg: "#78350f", accent: "#fbbf24", glow: "#f59e0b" },
  "Filozofi":       { bg: "#3b0764", accent: "#e879f9", glow: "#a855f7" },
  "Franse":         { bg: "#7f1d1d", accent: "#fca5a5", glow: "#ef4444" },
  "Angle":          { bg: "#0c4a6e", accent: "#38bdf8", glow: "#0ea5e9" },
  "Espayòl":        { bg: "#431407", accent: "#fb923c", glow: "#f97316" },
  "Ekonomi":        { bg: "#1c1917", accent: "#a8a29e", glow: "#78716c" },
  "Jeyografi":      { bg: "#052e16", accent: "#4ade80", glow: "#16a34a" },
  "SVT":            { bg: "#14532d", accent: "#86efac", glow: "#22c55e" },
  "SES":            { bg: "#1e3a8a", accent: "#93c5fd", glow: "#3b82f6" },
  "SMP":            { bg: "#4c1d95", accent: "#c084fc", glow: "#9333ea" },
  "LLA":            { bg: "#7f1d1d", accent: "#fca5a5", glow: "#ef4444" },
  /* ── Français (noms sauvegardés par ChatScreen) ── */
  "Mathématiques":  { bg: "#1e3a8a", accent: "#60a5fa", glow: "#3b82f6" },
  "Maths":          { bg: "#1e3a8a", accent: "#60a5fa", glow: "#3b82f6" },
  "Physique":       { bg: "#4c1d95", accent: "#c084fc", glow: "#9333ea" },
  "Biologie":       { bg: "#14532d", accent: "#86efac", glow: "#22c55e" },
  "Histoire":       { bg: "#78350f", accent: "#fbbf24", glow: "#f59e0b" },
  "Philosophie":    { bg: "#3b0764", accent: "#e879f9", glow: "#a855f7" },
  "Français":       { bg: "#7f1d1d", accent: "#fca5a5", glow: "#ef4444" },
  "Anglais":        { bg: "#0c4a6e", accent: "#38bdf8", glow: "#0ea5e9" },
  "Espagnol":       { bg: "#431407", accent: "#fb923c", glow: "#f97316" },
  "Économie":       { bg: "#1c1917", accent: "#a8a29e", glow: "#78716c" },
  "Géographie":     { bg: "#052e16", accent: "#4ade80", glow: "#16a34a" },
  "Sciences":       { bg: "#14532d", accent: "#86efac", glow: "#22c55e" },
  "Informatique":   { bg: "#0c4a6e", accent: "#38bdf8", glow: "#0ea5e9" },
  "Géologie":                          { bg: "#1c1917", accent: "#fcd34d", glow: "#eab308" },
  "Analyse":                           { bg: "#0f1e3d", accent: "#60a5fa", glow: "#2563eb" },
  "Algèbre":                           { bg: "#0f172a", accent: "#818cf8", glow: "#6366f1" },
  "Suite":                             { bg: "#0f1e3d", accent: "#93c5fd", glow: "#3b82f6" },
  "Complexe":                          { bg: "#1e1033", accent: "#a78bfa", glow: "#7c3aed" },
  "Probabilité":                       { bg: "#1a2e1a", accent: "#4ade80", glow: "#15803d" },
  "Géométrie":                         { bg: "#0d2238", accent: "#38bdf8", glow: "#0369a1" },
  "Créole":                            { bg: "#1a0012", accent: "#f472b6", glow: "#be185d" },
  "Dissertation":                      { bg: "#0a0a1a", accent: "#a5b4fc", glow: "#4f46e5" },
  "Littérature Haïtienne":             { bg: "#1a0a00", accent: "#fcd34d", glow: "#d97706" },
  "Littérature Française":             { bg: "#001204", accent: "#86efac", glow: "#166534" },
  "Éducation Esthétique et Artistique":{ bg: "#1a001a", accent: "#f9a8d4", glow: "#db2777" },
  "Éducation Physique et Sportive":    { bg: "#001a0a", accent: "#bbf7d0", glow: "#16a34a" },
  "Éducation à la Citoyenneté":        { bg: "#00101a", accent: "#7dd3fc", glow: "#0284c7" },
  "Numérique et Informatique":         { bg: "#0a1a0a", accent: "#4ade80", glow: "#15803d" },
};
const DEFAULT_COLOR = { bg: "#1e3a8a", accent: "#60a5fa", glow: "#3b82f6" };

const getSubjectColor = (subject) => {
  if (!subject) return DEFAULT_COLOR;
  const key = Object.keys(SUBJECT_COLORS).find(k =>
    subject.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(subject.toLowerCase())
  );
  return key ? SUBJECT_COLORS[key] : DEFAULT_COLOR;
};

/* ─── SubjectPill ────────────────────────────────────────────────────── */
const SubjectPill = ({ subject }) => {
  if (!subject) return null;
  const { accent, glow } = getSubjectColor(subject);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 99, fontSize: 12, fontWeight: 700,
      letterSpacing: "0.04em", color: accent,
      background: `${glow}22`,
      border: `1px solid ${glow}44`,
      boxShadow: `0 0 8px ${glow}22`,
    }}>
      <IcoBook /> {subject}
    </span>
  );
};

/* ─── ScoreRing (exercices) ──────────────────────────────────────────── */
const ScoreRing = ({ score, total }) => {
  if (!total) return null;
  const pct = Math.round((score / total) * 100);
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444";
  const r = 14, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
      <svg width="38" height="38" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="19" cy="19" r={r} fill="none" stroke="#ffffff10" strokeWidth="3"/>
        <circle cx="19" cy="19" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}/>
      </svg>
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 9, fontWeight: 800, color }}>
        {pct}%
      </span>
    </div>
  );
};

/* ─── HistoryCard ────────────────────────────────────────────────────── */
const HistoryCard = ({ h, onSelect, onSpeak, onDelete, speakingId, deleting }) => {
  const subject = h.subject || h.matiere || h.subjectName || null;
  const { glow } = getSubjectColor(subject);
  return (
    <div style={{
      borderRadius: 18,
      background: "linear-gradient(145deg,#0f1e4a,#0a1535)",
      border: `1px solid ${subject ? glow + "44" : "#1e3a8a33"}`,
      boxShadow: subject ? `0 0 18px ${glow}18` : "none",
      transition: "box-shadow 0.3s",
    }}>
      {/* Tap zone */}
      <div onClick={() => onSelect(h)}
        style={{ cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 14px 10px" }}>
          {/* Thumbnail */}
          {h.image
            ? <img src={h.image} alt="" style={{ width: 56, height: 56, borderRadius: 14,
                objectFit: "cover", flexShrink: 0, border: "1px solid #1e3a8a55" }}/>
            : <div style={{ width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                background: "#1e3a8a22", display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid #1e3a8a33" }}>
                <IcoChat/>
              </div>
          }
          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
            {subject && <div style={{ marginBottom: 4 }}><SubjectPill subject={subject}/></div>}
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>{h.date}</span>
            </div>
            <p style={{
              fontSize: 14, color: "#93c5fd", lineHeight: 1.5,
              overflow: "hidden", maxHeight: "3em",
            }}>
              {h.response?.slice(0, 110)}…
            </p>
          </div>
          <span style={{ color: "#1e3a8a", fontSize: 18, alignSelf: "center" }}>›</span>
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 14px 12px" }}>
        <button onClick={() => onSpeak(h.response, h.id)}
          style={{
            padding: "6px 10px", borderRadius: 10, display: "flex", alignItems: "center", gap: 5,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: speakingId === h.id ? "rgba(212,0,42,0.2)" : "rgba(37,99,235,0.12)",
            border: `1px solid ${speakingId === h.id ? "#d4002a55" : "rgba(37,99,235,0.4)"}`,
            color: speakingId === h.id ? "#ff8080" : "#60a5fa",
          }}>
          {speakingId === h.id ? <IcoStop/> : <IcoVolumeUp/>}
          {speakingId === h.id ? "Stop" : "Tande"}
        </button>
        <button onClick={() => onDelete(h)} disabled={deleting === h.id}
          style={{
            padding: "6px 12px", borderRadius: 10, display: "flex", alignItems: "center", gap: 5,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            background: "#d4002a15", color: "#ff8080", border: "1px solid #d4002a22",
          }}>
          {deleting === h.id ? <IcoLoader/> : <IcoTrash/>} Efase
        </button>
      </div>
    </div>
  );
};

/* ─── ExerciceCard ───────────────────────────────────────────────────── */
const ExerciceCard = ({ exo, onRedo, onDelete, deleting }) => {
  const subject = exo.subject || exo.matiere || exo.subjectName || null;
  const { glow } = getSubjectColor(subject);
  return (
    <div style={{
      borderRadius: 18, background: "linear-gradient(145deg,#0f1e4a,#0a1535)",
      border: `1px solid ${subject ? glow + "44" : "#1e3a8a33"}`,
      boxShadow: subject ? `0 0 14px ${glow}14` : "none",
      padding: "14px 14px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <ScoreRing score={exo.score} total={exo.total}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          {subject && <div style={{ marginBottom: 4 }}><SubjectPill subject={subject}/></div>}
          <p style={{ color: "#e0e8ff", fontWeight: 600, fontSize: 15, marginBottom: 3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {exo.questions?.[0]?.q?.slice(0, 55) || "Egzèsis"}…
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#475569" }}>{exo.date}</span>
            <span style={{ fontSize: 12, color: "#60a5fa", fontWeight: 600 }}>
              {exo.questions?.length || 0} kesyon
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3,
              fontSize: 12, fontWeight: 700,
              color: (exo.score / exo.total) >= 0.7 ? "#4ade80" :
                     (exo.score / exo.total) >= 0.4 ? "#fbbf24" : "#f87171" }}>
              <IcoStar/> {exo.score}/{exo.total}
            </span>
          </div>
        </div>
        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button onClick={() => onRedo(exo)}
            style={{ padding: "6px 12px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 4, cursor: "pointer",
              background: "#1e3a8a22", color: "#60a5fa", border: "1px solid #3b82f633" }}>
            <IcoPencil/> Refè
          </button>
          <button onClick={() => onDelete(exo)} disabled={deleting === exo.id}
            style={{ padding: "6px 10px", borderRadius: 10, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer",
              background: "#d4002a15", color: "#ff8080", border: "1px solid #d4002a22" }}>
            {deleting === exo.id ? <IcoLoader/> : <IcoTrash/>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────── */
export function HistoryScreen({ user, onNavigate, onStartExercice }) {
  const [tab,       setTab]       = useState("history");
  const [history,   setHistory]   = useState([]);
  const [exercices, setExercices] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);
  const [speakingId,setSpeakingId]= useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([idbGetScans(user.phone), idbGetExercice(user.phone)])
      .then(([scans, exos]) => { setHistory(scans); setExercices(exos); })
      .finally(() => setLoading(false));
  }, [user.phone]);

  useEffect(() => () => window.speechSynthesis.cancel(), []);
  if (!hasAccess(user)) { onNavigate("payment"); return null; }

  const cleanForTTS = (text) => (text || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_{1,2}(.*?)_{1,2}/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, ", ")
    .trim();

  const handleSpeak = (text, id) => {
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); }
    else {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(cleanForTTS(text));
      utt.lang = "fr-FR"; utt.rate = 0.9;
      utt.onend = () => setSpeakingId(null);
      utt.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utt);
      setSpeakingId(id);
    }
  };

  const handleDeleteScan = async (entry) => {
    setDeleting(entry.id);
    await idbDeleteScan(entry.id);
    setHistory(h => h.filter(x => x.id !== entry.id));
    if (selected?.id === entry.id) setSelected(null);
    if (speakingId === entry.id) { window.speechSynthesis.cancel(); setSpeakingId(null); }
    setDeleting(null);
  };

  const handleDeleteExercice = async (exo) => {
    setDeleting(exo.id);
    await idbDeleteExercice(exo.id);
    setExercices(e => e.filter(x => x.id !== exo.id));
    setDeleting(null);
  };

  /* Daily bar chart data */
  const dailyMap = {};
  history.forEach(h => {
    const day = h.scanDate || h.date?.split(",")[0] || "?";
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  /* ── Detail View ────────────────────────────────────────────────── */
  if (selected) {
    const subject = selected.subject || selected.matiere || selected.subjectName || null;
    const { accent, glow } = getSubjectColor(subject);
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
        {/* Header */}
        <div style={{
          padding: "16px 16px 14px",
          background: "rgba(10,15,46,0.98)",
          borderBottom: "1px solid #ffffff10",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <button onClick={() => setSelected(null)}
            style={{ color: "#60a5fa", fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>
            ←
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>Detay rekèt la</h2>
              {subject && <SubjectPill subject={subject}/>}
            </div>
            <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>{selected.date}</p>
          </div>
          <button onClick={() => handleDeleteScan(selected)} disabled={deleting === selected.id}
            style={{ padding: "6px 12px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
              background: "#d4002a22", color: "#ff8080", border: "1px solid #d4002a33" }}>
            {deleting === selected.id ? <IcoLoader/> : <IcoTrash/>} Efase
          </button>
          <button onClick={() => onStartExercice(selected)}
            style={{ padding: "6px 12px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
              background: "#1e3a8a22", color: "#60a5fa", border: "1px solid #3b82f633" }}>
            <IcoPencil/> Egzèsis
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Image */}
          {selected.image
            ? <div>
                <p style={{ color: "#60a5fa", fontSize: 13, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                  <IcoCamera/> Imaj ki analize
                </p>
                <img src={selected.image} alt="scan"
                  style={{ width: "100%", borderRadius: 16, objectFit: "contain", maxHeight: 220,
                    border: `1px solid ${glow}33`, boxShadow: `0 0 20px ${glow}18` }}/>
              </div>
            : <div style={{ borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
                background: "#1e3a8a11", border: "1px solid #1e3a8a22" }}>
                <IcoChat/>
                <span style={{ color: "#3b82f6", fontSize: 14 }}>Kesyon tèks sèlman. Pa gen imaj.</span>
              </div>
          }

          {/* Response card */}
          <div style={{ borderRadius: 18, padding: 16,
            background: `linear-gradient(145deg, #0f1e4a, #0a1535)`,
            border: `1px solid ${subject ? glow + "33" : "#1e3a8a33"}`,
            boxShadow: subject ? `0 0 24px ${glow}14` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                  <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}/>
                </div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Repons Prof Lakay</span>
              </div>
              <button onClick={() => handleSpeak(selected.response, selected.id)}
                style={{ padding: 8, borderRadius: 10, cursor: "pointer",
                  background: speakingId === selected.id ? "#d4002a22" : "#1e3a8a22",
                  border: `1px solid ${speakingId === selected.id ? "#d4002a55" : "#3b82f633"}`,
                  color: speakingId === selected.id ? "#ff8080" : "#60a5fa",
                  display: "flex", alignItems: "center" }}>
                {speakingId === selected.id ? <IcoStop/> : <IcoVolumeUp/>}
              </button>
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.65, color: "#e0e8ff" }}>
              <LatexText content={selected.response}/>
            </div>
          </div>

          {/* Quota row */}
          <div style={{ borderRadius: 14, padding: "10px 14px", display: "flex",
            justifyContent: "space-between", alignItems: "center",
            background: "#0f1e4a", border: "1px solid #1e3a8a22", marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#60a5fa" }}>Rekèt itilize jou sa</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fb923c" }}>
              {selected.scansUsed}/{selected.dailyLimit || user.dailyScans}
            </span>
          </div>
        </div>

        <BottomNav active="history" onNavigate={onNavigate}/>
      </div>
    );
  }

  /* ── List View ──────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      {/* Header */}
      <div style={{
        padding: "16px 16px 12px",
        background: "rgba(10,15,46,0.98)",
        borderBottom: "1px solid #ffffff10",
      }}>
        {/* Title + stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 17, margin: 0,
            display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#60a5fa" }}><IcoClipboard/></span> Istorik & Egzèsis
          </h2>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ padding: "3px 9px", borderRadius: 99, fontSize: 12, fontWeight: 700,
              background: "#1e3a8a33", color: "#60a5fa", border: "1px solid #3b82f622" }}>
              {history.length} rekèt
            </span>
            <span style={{ padding: "3px 9px", borderRadius: 99, fontSize: 12, fontWeight: 700,
              background: "#14532d22", color: "#4ade80", border: "1px solid #22c55e22" }}>
              {exercices.length} egzèsis
            </span>
          </div>
        </div>
        {/* Tab pills */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { key: "history",   label: `Istorik (${history.length})` },
            { key: "exercices", label: `Egzèsis (${exercices.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 14, fontWeight: 700,
                cursor: "pointer", transition: "all 0.2s",
                ...(tab === t.key
                  ? { background: "linear-gradient(135deg,#d4002a,#ff6b35)", color: "#fff",
                      boxShadow: "0 4px 14px #d4002a44" }
                  : { background: "#1e3a8a22", color: "#60a5fa", border: "1px solid #3b82f633" }),
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", paddingTop: 64, gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#60a5fa",
                  animation: `bounce 1s ${i * 0.2}s infinite` }}/>
              ))}
            </div>
            <p style={{ color: "#3b82f6", fontSize: 15 }}>Chajman...</p>
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {!loading && tab === "history" && (
          <>
            {/* Daily chart */}
            {Object.keys(dailyMap).length > 0 && (
              <div style={{ borderRadius: 18, padding: 16,
                background: "linear-gradient(145deg,#0f1e4a,#0a1535)",
                border: "1px solid #1e3a8a33" }}>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 12px",
                  display: "flex", alignItems: "center", gap: 6 }}>
                  <IcoChart/> Rekèt pa jou
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(dailyMap).slice(0, 7).map(([day, count]) => (
                    <div key={day} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#60a5fa", fontSize: 12, width: 90, flexShrink: 0 }}>{day}</span>
                      <div style={{ flex: 1, height: 6, borderRadius: 99, background: "#1e3a8a44", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99,
                          width: `${Math.min((count / (user.dailyTextScans ?? user.dailyScans)) * 100, 100)}%`,
                          background: count >= user.dailyScans
                            ? "#ef4444"
                            : "linear-gradient(90deg,#d4002a,#ff6b35)",
                          transition: "width 0.6s ease",
                        }}/>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#fb923c", width: 36, textAlign: "right" }}>
                        {count}/{user.dailyTextScans ?? user.dailyScans}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty */}
            {history.length === 0
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", paddingTop: 56, gap: 14 }}>
                  <div style={{ padding: 20, borderRadius: 24, background: "#1e3a8a15",
                    border: "1px solid #1e3a8a22", marginBottom: 4 }}>
                    <IcoInbox/>
                  </div>
                  <p style={{ color: "#60a5fa", textAlign: "center", fontSize: 15, lineHeight: 1.6 }}>
                    Istorik la poko kreye.<br/>Fè yon premye rekèt nan chat la!
                  </p>
                  <button onClick={() => onNavigate("chat")}
                    style={{ padding: "12px 24px", borderRadius: 14, fontWeight: 800, fontSize: 15,
                      color: "#fff", cursor: "pointer",
                      background: "linear-gradient(135deg,#d4002a,#ff6b35)",
                      boxShadow: "0 6px 20px #d4002a44" }}>
                    Ale nan chat la
                  </button>
                </div>

              : <>
                  <p style={{ color: "#475569", fontSize: 12, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Tout rekèt yo
                  </p>
                  {history.map(h => (
                    <HistoryCard key={h.id} h={h}
                      onSelect={setSelected}
                      onSpeak={handleSpeak}
                      onDelete={handleDeleteScan}
                      speakingId={speakingId}
                      deleting={deleting}/>
                  ))}
                  <div style={{ height: 16 }}/>
                </>
            }
          </>
        )}

        {/* ── EXERCICES TAB ── */}
        {!loading && tab === "exercices" && (
          <>
            {exercices.length === 0
              ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", paddingTop: 56, gap: 14 }}>
                  <div style={{ padding: 20, borderRadius: 24, background: "#1e3a8a15",
                    border: "1px solid #1e3a8a22", marginBottom: 4, color: "#3b82f6" }}>
                    <IcoPencil/>
                  </div>
                  <p style={{ color: "#60a5fa", textAlign: "center", fontSize: 15, lineHeight: 1.6 }}>
                    Pa gen egzèsis ankò.<br/>Kòmanse yon egzèsis depi nan istorik la!
                  </p>
                </div>

              : <>
                  <p style={{ color: "#475569", fontSize: 12, fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Egzèsis sove yo
                  </p>
                  {exercices.map(exo => (
                    <ExerciceCard key={exo.id} exo={exo}
                      onRedo={onStartExercice}
                      onDelete={handleDeleteExercice}
                      deleting={deleting}/>
                  ))}
                  <div style={{ height: 16 }}/>
                </>
            }
          </>
        )}
      </div>

      <BottomNav active="history" onNavigate={onNavigate}/>
    </div>
  );
}

export default HistoryScreen;
