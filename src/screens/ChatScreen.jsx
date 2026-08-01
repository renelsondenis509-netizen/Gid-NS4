import { cleanForTTS } from "../utils/ttsClean";
import { useState, useRef, useEffect } from "react";
import { APP_LOGO, PROF_LAKAY_PHOTO } from "../config";
import { callEdge, parseApiError } from "../api";
import { idbSaveScan } from "../utils/idb";
import { compressImage } from "../utils/helpers";
import { useOffline } from "../utils/useOffline";
import { LatexText } from "../components/LatexText";
import { ErrorToast, ExpiryBanner } from "../components/UI";
import { BottomNav } from "../components/UI";
import { cacheClear } from "../utils/cache";
import { TextToSpeech } from "@capacitor-community/text-to-speech";
import { LocalNotifications } from "@capacitor/local-notifications";
import { pushBackHandler, popBackHandler } from "../utils/backHandlerStack";

// ─── Couleurs par matière ─────────────────────────────────────
const SUBJECT_COLORS = {
  "Biologie":                        { bg:"#052e16", active:"#16a34a", dot:"#22c55e" },
  "Géologie":                        { bg:"#1c1917", active:"#a16207", dot:"#eab308" },
  "Chimie":                          { bg:"#0c1a2e", active:"#0ea5e9", dot:"#38bdf8" },
  "Physique":                        { bg:"#1a0533", active:"#9333ea", dot:"#c084fc" },
  "Analyse":                         { bg:"#0f1e3d", active:"#2563eb", dot:"#60a5fa" },
  "Algèbre":                         { bg:"#0f172a", active:"#6366f1", dot:"#818cf8" },
  "Suite":                           { bg:"#0f1e3d", active:"#3b82f6", dot:"#93c5fd" },
  "Complexe":                        { bg:"#1e1033", active:"#7c3aed", dot:"#a78bfa" },
  "Probabilité":                     { bg:"#1a2e1a", active:"#15803d", dot:"#4ade80" },
  "Géométrie":                       { bg:"#0d2238", active:"#0369a1", dot:"#38bdf8" },
  "Économie":                        { bg:"#1a1000", active:"#b45309", dot:"#fbbf24" },
  "Philosophie":                     { bg:"#200d2a", active:"#7e22ce", dot:"#d8b4fe" },
  "Histoire":                        { bg:"#1a0a00", active:"#c2410c", dot:"#fb923c" },
  "Géographie":                      { bg:"#021a1a", active:"#0f766e", dot:"#2dd4bf" },
  "Créole":                          { bg:"#1a0012", active:"#be185d", dot:"#f472b6" },
  "Français":                        { bg:"#001a10", active:"#047857", dot:"#34d399" },
  "Anglais":                         { bg:"#00101a", active:"#0e7490", dot:"#22d3ee" },
  "Espagnol":                        { bg:"#1a0000", active:"#dc2626", dot:"#f87171" },
  "Dissertation":                    { bg:"#0a0a1a", active:"#4f46e5", dot:"#a5b4fc" },
  "Littérature Haïtienne":           { bg:"#1a0a00", active:"#d97706", dot:"#fcd34d" },
  "Littérature Française":           { bg:"#001204", active:"#166534", dot:"#86efac" },
  "Éducation Esthétique et Artistique":{ bg:"#1a001a", active:"#db2777", dot:"#f9a8d4" },
  "Éducation Physique et Sportive":  { bg:"#001a0a", active:"#16a34a", dot:"#bbf7d0" },
  "Éducation à la Citoyenneté":      { bg:"#00101a", active:"#0284c7", dot:"#7dd3fc" },
  "Numérique et Informatique":       { bg:"#0a1a0a", active:"#15803d", dot:"#4ade80" },
};
const getSubjectColor = (s) => SUBJECT_COLORS[s] || { bg:"#0f172a", active:"#2563eb", dot:"#60a5fa" };

// ─── Icônes SVG ──────────────────────────────────────────────
const SignalIcon    = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.93 4.93A10 10 0 0 1 19.07 19.07"/><path d="M7.76 7.76A6 6 0 0 1 16.24 16.24"/><path d="M10.59 10.59a2 2 0 0 0 2.83 2.83"/><line x1="2" y1="2" x2="22" y2="22"/></svg>);
const AttachmentIcon= () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>);
const ClockIcon     = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const CheckIcon     = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const StarFullIcon  = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const StarOutlineIcon=() => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const CameraIcon    = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const SendIcon      = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const CloseIcon     = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>);
const SpeakIcon     = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const ScrollDownIcon= () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>);
const EnvelopeIcon  = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const CopyIcon      = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const FlagIcon = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>);

export function ChatScreen({ user, onNavigate, isOffline: isOfflineProp }) {
  const offlineLocal = useOffline();
  const offline = isOfflineProp ?? offlineLocal;

  const [messages,      setMessages]      = useState([{ role:"assistant", content:`Bonjou **${user.name||""}** ! Mwen se **Prof Lakay**\n\nJe suis ton assistant IA pour le **Bac NS4**.\n\n**Ann al travay !**` }]);
  const [input,         setInput]         = useState("");
  const [image,         setImage]         = useState(null);
  const [zoomImage,     setZoomImage]     = useState(null);

  useEffect(() => {
    if (!zoomImage) return;
    const closeHandler = () => setZoomImage(null);
    pushBackHandler(closeHandler);
    return () => popBackHandler(closeHandler);
  }, [zoomImage]);
  const [loading,       setLoading]       = useState(false);
  const [apiError,      setApiError]      = useState(null);
  const [lastPayload,   setLastPayload]   = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [favorites,     setFavorites]     = useState(() => { try { return JSON.parse(localStorage.getItem(`fav_${user.phone}`) || "[]"); } catch { return []; } });
  const [reportingMsg, setReportingMsg] = useState(null);

  useEffect(() => {
    if (!reportingMsg && reportingMsg !== 0) return;
    const closeHandler = () => setReportingMsg(null);
    pushBackHandler(closeHandler);
    return () => popBackHandler(closeHandler);
  }, [reportingMsg]);
  const [reportSent,   setReportSent]   = useState(false);

 const formatTime = () => new Date().toLocaleTimeString("fr-HT", { hour:"2-digit", minute:"2-digit", timeZone:"America/Port-au-Prince" });
  const [msgTimes]  = useState(() => ({}));
  const getTime = (i) => { if (!msgTimes[i]) msgTimes[i] = formatTime(); return msgTimes[i]; };

  const copyText = (text, i) => {
    const clean = text.replace(/\*\*(.*?)\*\*/g,"$1").replace(/[#*_~`]/g,"").trim();
    navigator.clipboard?.writeText(clean).then(() => { setCopiedId(i); setTimeout(()=>setCopiedId(null), 2000); });
  };

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const chatRef   = useRef(null);

  const DAILY_MAX = user.dailyTextScans ?? user.dailyScans ?? 10;
  const today     = new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
  const getToday = () => new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
  const getScanKey = () => `gid_scan_${user.phone}_${getToday()}`;
  const _scanKey  = `gid_scan_${user.phone}_${today}`;
  const [scansUsed, setScansUsed] = useState(0);

  const refreshScans = () => {
    try {
      const raw = localStorage.getItem(getScanKey());
      setScansUsed(raw !== null ? parseInt(raw) : 0);
    } catch {}
  };

  useEffect(() => { refreshScans(); }, [_scanKey]);

  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refreshScans(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);
  useEffect(() => {
    const el = chatRef.current;
    const onScroll = () => { if(!el) return; setShowScrollBtn(el.scrollHeight-el.scrollTop-el.clientHeight > 120); };
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

const [announcements,     setAnnouncements]     = useState([]);
const [showAnnouncements, setShowAnnouncements] = useState(false);

  useEffect(() => {
    if (!showAnnouncements) return;
    const closeHandler = () => setShowAnnouncements(false);
    pushBackHandler(closeHandler);
    return () => popBackHandler(closeHandler);
  }, [showAnnouncements]);
const [copiedId, setCopiedId] = useState(null);
const [unreadCount,       setUnreadCount]       = useState(0);
const [dismissedIds, setDismissedIds] = useState(() => {
  try { return JSON.parse(localStorage.getItem(`annonce_dismissed_${user.phone}`) || "[]"); } catch { return []; }
});

useEffect(() => {
  if (!user.code || user.code === "FREEMIUM") return;
  const annKey = `annonce_ts_${user.code}`;
  const annCacheKey = `annonce_data_${user.code}`;
  const annTs = parseInt(localStorage.getItem(annKey) || "0");
  const cached = localStorage.getItem(annCacheKey);
  if (cached) {
    try {
      const list = JSON.parse(cached);
      const dismissed = JSON.parse(localStorage.getItem(`annonce_dismissed_${user.phone}`) || "[]");
      const visible = list.filter(a => !dismissed.includes(String(a.id)));
      setAnnouncements(visible);
      const lastSeen = localStorage.getItem(`annonce_seen_${user.phone}`) ?? "";
      const unread = lastSeen ? visible.filter(a => new Date(a.created_at) > new Date(lastSeen)).length : visible.length;
      if (unread > 0) {
  setUnreadCount(unread);
  try {
    const ann = visible.filter(a => !lastSeen || new Date(a.created_at) > new Date(lastSeen));
    LocalNotifications.schedule({ notifications: [{
      id: 9001,
      title: "📢 Nouvo mesaj — Gid NS4",
      body: ann[0]?.message?.slice(0, 100) ?? `${unread} nouvo mesaj`,
      channelId: "gidns4_default",
      smallIcon: "ic_stat_notify",
      schedule: { at: new Date(Date.now() + 500) },
    }]}).catch(()=>{});
  } catch {}
}
    } catch {}
  }
  if (Date.now() - annTs < 10 * 60 * 1000) return;
  localStorage.setItem(annKey, String(Date.now()));
  callEdge({ action: "get_announcements", schoolCode: user.code })
    .then(async res => {
      const list = (res.announcements ?? []).filter(a => !a.expires_at || new Date(a.expires_at) > new Date());
const dismissed = JSON.parse(localStorage.getItem(`annonce_dismissed_${user.phone}`) || "[]");
const visible = list.filter(a => !dismissed.includes(String(a.id)));
setAnnouncements(visible);
try { localStorage.setItem(annCacheKey, JSON.stringify(list)); } catch {}
if (visible.length === 0) return;
const lastSeen = localStorage.getItem(`annonce_seen_${user.phone}`) ?? "";
const unread = lastSeen
  ? visible.filter(a => new Date(a.created_at) > new Date(lastSeen)).length
  : visible.length;
if (unread > 0) setUnreadCount(unread);
    })
    .catch(() => {});
}, [user.code]);

const openAnnouncements = () => {
  setShowAnnouncements(true);
  setUnreadCount(0);
const maxDate = announcements.reduce((m, a) => a.created_at > m ? a.created_at : m, "");
  if (maxDate) localStorage.setItem(`annonce_seen_${user.phone}`, maxDate);
};  const detectSubject = (text) => {
    const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    if (t.includes("bio")||t.includes("cellule")||t.includes("adn")||t.includes("genetique")) return "Biologie";
    if (t.includes("geol")||t.includes("roche")||t.includes("mineral")) return "Géologie";
    if (t.includes("chim")||t.includes("molecule")||t.includes("acide")) return "Chimie";
    if (t.includes("phys")||t.includes("vitesse")||t.includes("force")||t.includes("energie")) return "Physique";
    if (t.includes("analyse")||t.includes("limite")||t.includes("derivee")) return "Analyse";
    if (t.includes("algebre")||t.includes("equation")||t.includes("fonction")) return "Algèbre";
    if (t.includes("suite")||t.includes("arithmetique")||t.includes("geometrique")) return "Suite";
    if (t.includes("complexe")||t.includes("imaginaire")) return "Complexe";
    if (t.includes("probabilite")||t.includes("chance")) return "Probabilité";
    if (t.includes("geometrie")||t.includes("triangle")||t.includes("cercle")) return "Géométrie";
    if (t.includes("economie")||t.includes("offre")||t.includes("demande")||t.includes("pib")) return "Économie";
    if (t.includes("philo")||t.includes("socrate")) return "Philosophie";
    if (t.includes("histoire")||t.includes("revolution")) return "Histoire";
    if (t.includes("geo")||t.includes("carte")) return "Géographie";
    if (t.includes("creole")) return "Créole";
    if (t.includes("francais")||t.includes("grammaire")) return "Français";
    if (t.includes("anglais")) return "Anglais";
    if (t.includes("espagnol")) return "Espagnol";
    if (t.includes("dissertation")||t.includes("redaction")) return "Dissertation";
    return "Général";
  };

  const sendMessage = async (retryPayload = null) => {
    if (user.subjects?.length > 0 && !activeSubject) {
    setApiError({ type:"warning", message:"Chwazi yon matyè anvan !", detail:"Klike sou yon matyè anwo a anvan ou voye kesyon an.", icon:"📚", retry:false });
    return;
  }
  if (offline) { setApiError({ type:"network", message:"Pa gen koneksyon entènèt !", detail:"Konekte epi eseye ankò.", icon:"📶", retry:false }); return; }
    const freemiumExpired = user.code === "FREEMIUM" && (user.daysRemaining ?? 0) <= 0;
    if (freemiumExpired) { onNavigate("partner"); return; }
    const currentScans = (() => { try { const raw = localStorage.getItem(getScanKey()); return raw !== null ? parseInt(raw) : scansUsed; } catch { return scansUsed; } })();
    if (currentScans >= DAILY_MAX) return;
    setScansUsed(currentScans);
    if (loading) return;
    await new Promise(r => setTimeout(r, 300));
    const payload = retryPayload || {
      userMsg:      { role:"user", content:input.trim()||"Analyse cet exercice.", image },
      currentInput: input.trim(),
      isImage:      !!image,
    };
    if (!payload.currentInput && !payload.userMsg.image) return;
    if (!retryPayload) { setMessages(p => [...p, payload.userMsg]); setInput(""); setImage(null); }
    setApiError(null); setLoading(true);
    try {
      const subject = activeSubject || detectSubject(payload.currentInput+" "+(payload.userMsg.content||"")) || "Général";
      const result  = await callEdge({
        action:"ask", phone:user.phone, schoolCode:user.code||"FREEMIUM", name:user.name||"",
        message:     payload.userMsg.content,
        imageBase64: payload.userMsg.image ? payload.userMsg.image.split(",")[1] : null,
        history:     messages.slice(-6), subject,
      });
      {
        const fullReply = result.reply;
        const words = fullReply.split(/(\s+)/);
        const totalMs = Math.min(4000, Math.max(600, words.length * 28));
        const stepMs  = totalMs / words.length;
        let msgIndex;
        setMessages(p => { msgIndex = p.length; return [...p, { role:"assistant", content:"", subject, typing:true }]; });
        let w = 0;
        const typer = setInterval(() => {
          w++;
          setMessages(p => {
            const copy = [...p];
            if (!copy[msgIndex]) { clearInterval(typer); return p; }
            copy[msgIndex] = { ...copy[msgIndex], content: words.slice(0, w).join(""), typing: w < words.length };
            return copy;
          });
          if (w >= words.length) clearInterval(typer);
        }, stepMs);
      }
      const next = result.scansUsed ?? (scansUsed + 1);
      setScansUsed(next);
      cacheClear(`leaderboard_${user.phone}_${user.code}`);
      try { localStorage.setItem(getScanKey(), String(next)); localStorage.setItem(`gid_first_scan_${user.phone}`, "1"); } catch {}
      setLastPayload(null);
      await idbSaveScan(user.phone, {
        date:     new Date().toLocaleString("fr-HT", { timeZone:"America/Port-au-Prince" }),
        scanDate: new Date().toISOString().split("T")[0],
        subject, image:payload.userMsg.image||null, response:result.reply,
        query: payload.userMsg.content||payload.currentInput||"",
        dailyLimit:DAILY_MAX, scansUsed:next,
      });
      if ((result.reply || "").length > 150) {
        callEdge({ action: "generate_quiz", content: result.reply, subject, phone: user.phone, schoolCode: user.code })
          .catch(() => {});
      }
    } catch(e) {
      const parsed = parseApiError(e);
      setApiError(parsed);
      if (parsed.retry) setLastPayload(payload);
    }
    setLoading(false);
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => { setImage(await compressImage(ev.target.result)); };
    reader.readAsDataURL(file);
  };

  const allDone = scansUsed >= DAILY_MAX;

  const toggleFav = (msg, i) => {
    const stableId = `${msg.subject||"gen"}_${(msg.content||"").slice(0,32).replace(/\s/g,"_")}`;
    setFavorites(prev => {
      const exists = prev.findIndex(f => f.id === stableId);
      const next   = exists >= 0 ? prev.filter(f => f.id !== stableId) : [...prev, { id:stableId, content:msg.content, subject:msg.subject||activeSubject, date:new Date().toLocaleDateString("fr-HT",{timeZone:"America/Port-au-Prince"}) }];
      try { localStorage.setItem(`fav_${user.phone}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const speak = async (text) => {
    const cleaned = cleanForTTS(text).slice(0, 3000);
    try { await TextToSpeech.stop(); } catch {}
    try {
      await TextToSpeech.speak({ text: cleaned, lang: "fr-FR", rate: 0.9, pitch: 1.0, volume: 1.0, queueStrategy: 1 });
    } catch(e) { console.warn("TTS:", e); }
  };

const submitReport = async (msg, reason) => {
  try {
    await callEdge({ action:"report_message", phone:user.phone, schoolCode:user.code||"FREEMIUM", subject: msg.subject||activeSubject||"Général", message: msg.content, reason });
  } catch {}
  setReportSent(true);
  setTimeout(() => { setReportingMsg(null); setReportSent(false); }, 1500);
};

  const activeColor = activeSubject ? getSubjectColor(activeSubject) : null;

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"linear-gradient(180deg,#060b20 0%,#0a0f2e 100%)" }}>

      {/* Subtle grid background */}


      {/* Banner offline */}
      {offline && (
        <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"7px 16px", background:"linear-gradient(90deg,#78350f,#92400e)", borderBottom:"1px solid #f59e0b44", fontSize:12, color:"#fcd34d" }}>
          <SignalIcon /> Mode hors-ligne — Istorik ou disponib
          <button onClick={()=>onNavigate("history")} style={{ marginLeft:8, padding:"2px 10px", borderRadius:8, background:"#f59e0b22", color:"#fcd34d", border:"1px solid #f59e0b55", fontSize:11, cursor:"pointer" }}>Istorik →</button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ position:"relative", zIndex:10, display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:"rgba(6,11,32,0.95)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>

        <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:2 }}>
          <span style={{ color:"#fff", fontWeight:800, fontSize:15, letterSpacing:"-0.01em" }}>Gid NS4</span>
            {(user.isFreemium||user.code==="FREEMIUM") && user.daysRemaining > 0 && (
              <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(220,38,38,0.15)", color:"#fca5a5", border:"1px solid rgba(220,38,38,0.25)", fontWeight:600 }}>
                Freemium {user.daysRemaining}j
              </span>
            )}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
            {!offline
              ? <span style={{ color:"#22C55E", fontSize:11, fontWeight:500, display:"flex", alignItems:"center", gap:4 }}><span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block", boxShadow:"0 0 6px #22c55e" }} />En ligne</span>
              : <span style={{ color:"#f59e0b", fontSize:11, fontWeight:500 }}>Hors-ligne</span>
            }
            {activeSubject && (
              <span style={{ fontSize:10, padding:"1px 8px", borderRadius:20, background:`${activeColor.active}22`, color:activeColor.dot, border:`1px solid ${activeColor.active}44`, fontWeight:600 }}>
                {activeSubject}
              </span>
            )}
          </div>
        </div>

        {/* Compteur circulaire */}
<button onClick={openAnnouncements} style={{ position:"relative", width:38, height:38, borderRadius:12, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#ffffff", flexShrink:0, opacity:1 }}>
  <EnvelopeIcon />
  {unreadCount > 0 && <span style={{ position:"absolute", top:-5, right:-5, minWidth:18, height:18, borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 6px #ef4444", color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>{unreadCount}</span>}
</button>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ position:"relative", width:44, height:44 }}>
            <svg width="44" height="44" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3"/>
              <circle cx="22" cy="22" r="18" fill="none"
                stroke={allDone ? "#374151" : "#ffffff"}
                strokeWidth="3"
                strokeDasharray={`${2*Math.PI*18}`}
                strokeDashoffset={`${2*Math.PI*18*(1-scansUsed/DAILY_MAX)}`}
                strokeLinecap="round"
                style={{ transition:"stroke-dashoffset .4s ease" }}
              />
            </svg>
            <span style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:0 }}>
              {allDone ? <span style={{color:"#374151"}}><CheckIcon/></span> : <><span style={{fontSize:13,fontWeight:900,color:"#ffffff",lineHeight:1}}>{scansUsed}</span><span style={{fontSize:13,fontWeight:900,color:"#e2e8ff",lineHeight:1}}>/{DAILY_MAX}</span></>}
            </span>
          </div>
          <span style={{ fontSize:10, color:"#ffffff", fontWeight:700, letterSpacing:"0.05em" }}>REKÈT</span>
        </div>
      </div>
<div style={{ textAlign:"center", padding:"4px 12px", fontSize:10, color:"#4b6cb7", background:"rgba(255,255,255,0.02)" }}>
  ℹ️ Repons Gid NS4 yo jenere pa yon Entelijans Atifisyèl (IA)
</div>

      {/* EXPIRY BANNER */}
      {user.daysRemaining > 0 && <ExpiryBanner daysRemaining={user.daysRemaining} />}

      {/* MESSAGES */}
      <div ref={chatRef} className="flex-1 overflow-y-auto" style={{ position:"relative", zIndex:1, padding:"16px 12px 8px", display:"flex", flexDirection:"column", gap:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:"flex", gap:10, justifyContent:msg.role==="user"?"flex-end":"flex-start", animation:"fadeIn .3s ease both" }}>
            {msg.role === "assistant" && (
              <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, overflow:"hidden", background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,0.4)", marginTop:2 }}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }} />
              </div>
            )}
            <div style={{ maxWidth:"80%" }}>
              {msg.image && <img src={msg.image} alt="scan" onClick={() => setZoomImage(msg.image)} style={{ borderRadius:14, marginBottom:6, maxHeight:140, objectFit:"contain", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" }} />}
              <div style={{
                padding:"12px 16px",
                fontSize:14,
                lineHeight:1.7,
                borderRadius: msg.role==="user" ? "20px 20px 6px 20px" : "6px 20px 20px 20px",
                background: msg.role==="user"
                  ? "linear-gradient(135deg,#1d4ed8,#2563eb)"
                  : "rgba(12,20,50,0.92)",
                border: msg.role==="assistant"
                  ? `1px solid rgba(37,99,235,0.12)`
                  : "none",
                borderLeft: msg.role==="assistant" && msg.subject
                  ? `3px solid ${getSubjectColor(msg.subject).active}`
                  : msg.role==="assistant" ? "3px solid rgba(37,99,235,0.3)" : "none",
                color:"#e2e8ff",
                boxShadow: msg.role==="user"
                  ? "0 4px 20px rgba(37,99,235,0.25)"
                  : "0 2px 12px rgba(0,0,0,0.3)",
              }}>
                <LatexText content={msg.content} />
              </div>
              {msg.role === "assistant" && !msg.typing && (
                <div style={{ display:"flex", gap:4, marginTop:6, paddingLeft:4 }}>
                  <button onClick={()=>toggleFav(msg,i)} style={{ width:28, height:28, borderRadius:8, background:"none", border:"none", cursor:"pointer", color:"#fbbf24", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    {favorites.findIndex(f=>f.id===`${msg.subject||"gen"}_${(msg.content||"").slice(0,32).replace(/\s/g,"_")}`)>=0 ? <StarFullIcon/> : <StarOutlineIcon/>}
                  </button>
                  <button onClick={()=>speak(msg.content)} style={{ width:28, height:28, borderRadius:8, background:"rgba(37,99,235,0.1)", border:"1px solid rgba(37,99,235,0.2)", cursor:"pointer", color:"#60a5fa", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                    <SpeakIcon/>
                  </button>
                  <button onClick={()=>copyText(msg.content, i)} style={{ width:28, height:28, borderRadius:8, background:copiedId===i?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.05)", border:copiedId===i?"1px solid rgba(34,197,94,0.4)":"1px solid rgba(255,255,255,0.1)", cursor:"pointer", color:copiedId===i?"#4ade80":"#6b7280", display:"inline-flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
                    <CopyIcon/>
                  </button>
                  <button onClick={()=>setReportingMsg(i)} style={{ width:28, height:28, borderRadius:8, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)", cursor:"pointer", color:"#f87171", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
  <FlagIcon/>
</button>
                  <span style={{ fontSize:10, color:"#2d3f6e", marginLeft:2, alignSelf:"center" }}>{getTime(i)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
            <div style={{ width:34, height:34, borderRadius:10, flexShrink:0, overflow:"hidden", background:"#fff", boxShadow:"0 2px 12px rgba(0,0,0,0.4)" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }} />
            </div>
            <div style={{ padding:"14px 18px", borderRadius:"6px 20px 20px 20px", background:"rgba(12,20,50,0.92)", border:"1px solid rgba(37,99,235,0.12)", borderLeft:"3px solid rgba(37,99,235,0.3)" }}>
              <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#3b82f6", animation:`bounce 1.2s ${i*0.2}s infinite` }} />
                ))}
                <span style={{ color:"#4b6cb7", fontSize:12, marginLeft:6, fontStyle:"italic" }}>Prof Lakay ap ekri...</span>
              </div>
            </div>
          </div>
        )}

        {allDone && !offline && (
          <div style={{ margin:"0 4px", padding:"12px 16px", borderRadius:16, background:"rgba(220,38,38,0.08)", border:"1px solid rgba(220,38,38,0.2)", color:"#fca5a5", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:13 }}>
            <ClockIcon/> Ou itilize tout {DAILY_MAX} rekèt ou yo pou jodi a. Tounen demen !
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* SCROLL BUTTON */}
      {showScrollBtn && (
        <button onClick={()=>chatRef.current?.scrollTo({top:chatRef.current.scrollHeight,behavior:"smooth"})}
          style={{ position:"absolute", bottom:138, right:14, zIndex:40, width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#1d4ed8,#2563eb)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:"none", cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,0.4)" }}>
          <ScrollDownIcon/>
        </button>
      )}

      {showAnnouncements && (
  <div onClick={() => setShowAnnouncements(false)} style={{ position:"fixed", inset:0, zIndex:50, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end" }}>
    <div onClick={e => e.stopPropagation()} style={{ width:"100%", maxHeight:"70vh", overflowY:"auto", background:"#080e24", borderRadius:"20px 20px 0 0", border:"1px solid rgba(37,99,235,0.2)", padding:"20px 16px 32px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <span style={{ color:"#e2e8ff", fontWeight:800, fontSize:15 }}>📢 Mesaj Lekòl</span>
        <button onClick={() => setShowAnnouncements(false)} style={{ background:"none", border:"none", color:"#4b6cb7", cursor:"pointer" }}><CloseIcon /></button>
      </div>
      {announcements.map((a, i) => (
<div key={a.id ?? i} style={{ marginBottom:12, padding:"14px 16px", borderRadius:14, background:"rgba(15,28,60,0.80)", border:"1px solid rgba(37,99,235,0.15)", borderLeft:"3px solid #2563eb" }}>
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
    <div style={{ color:"#93c5fd", fontWeight:700, fontSize:13, marginBottom:6 }}>{a.title}</div>
  <button onClick={() => { const id = String(a.id ?? i); setAnnouncements(prev => prev.filter((_, j) => j !== i)); setDismissedIds(prev => { const next = [...prev, id]; localStorage.setItem(`annonce_dismissed_${user.phone}`, JSON.stringify(next)); return next; }); }} style={{ background:"none", border:"none", color:"#4b6cb7", cursor:"pointer", fontSize:16, lineHeight:1, padding:"0 0 0 8px" }}>✕</button>
  </div>
  <div style={{ color:"#c8d8ff", fontSize:13, lineHeight:1.6 }}>{a.message}</div>
  <div style={{ color:"#2d3f6e", fontSize:11, marginTop:8 }}>
    {new Date(a.created_at).toLocaleDateString("fr-HT", { timeZone:"America/Port-au-Prince", day:"2-digit", month:"short", year:"numeric" })}
  </div>
</div>
      ))}
    </div>
  </div>
)}

{reportingMsg !== null && (
  <div onClick={()=>setReportingMsg(null)} style={{ position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end" }}>
    <div onClick={e=>e.stopPropagation()} style={{ width:"100%", background:"#080e24", borderRadius:"20px 20px 0 0", border:"1px solid rgba(239,68,68,0.2)", padding:"20px 16px 32px" }}>
      {!reportSent ? (
        <>
          <div style={{ color:"#e2e8ff", fontWeight:800, fontSize:15, marginBottom:14 }}>🚩 Rapòte repons sa</div>
          {["Repons ki pa kòrèk","Kontni deranjan oswa ofansan","Lang ki pa apwopriye","Lòt rezon"].map(r => (
            <button key={r} onClick={()=>submitReport(messages[reportingMsg], r)} style={{ display:"block", width:"100%", textAlign:"left", padding:"12px 14px", marginBottom:8, borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"#c8d8ff", fontSize:13, cursor:"pointer" }}>{r}</button>
          ))}
        </>
      ) : (
        <div style={{ textAlign:"center", padding:"20px 0", color:"#4ade80", fontWeight:700 }}>✅ Mèsi, nou resevwa rapò a</div>
      )}
    </div>
  </div>
)}
    
     <ErrorToast error={apiError} onRetry={lastPayload?()=>sendMessage(lastPayload):null} onDismiss={()=>{setApiError(null);setLastPayload(null);}} />

      {/* ZONE INPUT */}
      <div style={{ position:"relative", zIndex:10, padding:"8px 12px 4px", background:"rgba(6,11,32,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(255,255,255,0.06)" }}>

        {/* SÉLECTEUR MATIÈRE */}
        {user.subjects && user.subjects.length > 0 && (
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none", WebkitMaskImage:"linear-gradient(to right, black 85%, transparent 100%)", maskImage:"linear-gradient(to right, black 85%, transparent 100%)" }}>
            {user.subjects.map(s => {
              const c = getSubjectColor(s);
              const isActive = activeSubject === s;
              return (
                <button key={s} onClick={()=>setActiveSubject(s===activeSubject?null:s)}
                  style={{ flexShrink:0, padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:700, border:"1px solid", cursor:"pointer", whiteSpace:"nowrap", transition:"all .2s",
                    background: isActive ? c.active : "rgba(255,255,255,0.03)",
                    color: isActive ? "#fff" : "#4b6cb7",
                    borderColor: isActive ? c.active : "rgba(255,255,255,0.08)",
                    boxShadow: isActive ? `0 0 12px ${c.active}55` : "none",
                  }}>
                  {isActive && <span style={{ marginRight:5, fontSize:8 }}>●</span>}
                  {s}
                </button>
              );
            })}
            </div>
          </div>
        )}

        {image && (
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, padding:"6px 10px", background:"rgba(37,99,235,0.08)", borderRadius:12, border:"1px solid rgba(37,99,235,0.15)" }}>
            <img src={image} alt="" style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }} />
            <span style={{ color:"#4b6cb7", fontSize:11, flex:1, display:"flex", alignItems:"center", gap:6 }}><AttachmentIcon/> Image prête</span>
            <button onClick={()=>setImage(null)} style={{ color:"#ef4444", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center" }}><CloseIcon/></button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ position:"absolute", width:0, height:0, opacity:0, pointerEvents:"none" }} />
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, background:"rgba(255,255,255,0.04)", border:`1px solid ${activeColor?activeColor.active+"44":"rgba(255,255,255,0.1)"}`, borderRadius:16, padding:"8px 8px 8px 12px", transition:"border-color .2s" }}
          onFocus={e=>e.currentTarget.style.borderColor=activeColor?activeColor.active+"99":"rgba(37,99,235,0.5)"}
          onBlur={e=>e.currentTarget.style.borderColor=activeColor?activeColor.active+"44":"rgba(255,255,255,0.1)"}>
          <button
            onClick={()=>{ if(!allDone&&!offline) fileRef.current?.click(); }}
            disabled={allDone||offline}
            style={{ flexShrink:0, background:"none", border:"none", cursor:(allDone||offline)?"not-allowed":"pointer", color:(allDone||offline)?"rgba(255,255,255,0.2)":"#ffffff", display:"flex", alignItems:"center", padding:"4px 2px", marginBottom:2 }}>
            <CameraIcon/>
          </button>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();sendMessage();} }}
            placeholder={offline?"Hors-ligne...":allDone?"Limit ou a rive...":activeSubject?`Poze yon kesyon sou ${activeSubject}...`:"Chwazi yon matyè anvan..."}
            rows={1}
            disabled={allDone||offline}
            style={{ flex:1, background:"none", border:"none", color:"#e2e8ff", fontSize:14, outline:"none", resize:"none", maxHeight:120, fontFamily:"inherit", padding:"4px 0", lineHeight:1.5 }}
          />
          <button
            onClick={()=>sendMessage()}
            disabled={loading||allDone||offline||(user.subjects?.length>0&&!activeSubject)}
            style={{ flexShrink:0, width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", background:(loading||allDone||offline)?"rgba(37,99,235,0.2)":"linear-gradient(135deg,#1d4ed8,#2563eb)", border:"none", cursor:(loading||allDone||offline)?"not-allowed":"pointer", boxShadow:(loading||allDone||offline)?"none":"0 4px 14px rgba(37,99,235,0.35)" }}>
            <SendIcon/>
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={onNavigate} />
      {zoomImage && (
        <div onClick={() => setZoomImage(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20, cursor:"zoom-out" }}>
          <img src={zoomImage} alt="scan agrandi" style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain", borderRadius:8 }} />
        </div>
      )}
    </div>
  );
}
