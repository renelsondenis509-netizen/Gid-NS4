import { useState, useRef, useEffect } from "react";
import { APP_LOGO, PROF_LAKAY_PHOTO } from "../config";
import { callEdge, parseApiError } from "../api";
import { idbSaveScan } from "../utils/idb";
import { compressImage } from "../utils/helpers";
import { useOffline } from "../utils/useOffline";
import { LatexText } from "../components/LatexText";
import { ErrorToast, ExpiryBanner } from "../components/UI";
import { BottomNav } from "../components/UI";

// ─── Icônes SVG ──────────────────────────────────────────────
const SignalIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.93 4.93A10 10 0 0 1 19.07 19.07"/><path d="M7.76 7.76A6 6 0 0 1 16.24 16.24"/><path d="M10.59 10.59a2 2 0 0 0 2.83 2.83"/><line x1="2" y1="2" x2="22" y2="22"/></svg>);
const AttachmentIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>);
const ClockIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const CheckIcon = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const StarFullIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const StarOutlineIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const CameraIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const SendIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
const CloseIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>);
const SpeakIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const ScrollDownIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>);

export function ChatScreen({ user, onNavigate }) {
  const offline = useOffline();

  const [messages,     setMessages]     = useState([{ role: "assistant", content: `Bonjou **${user.name || ""}** ! Mwen se **Prof Lakay**\n\nJe suis ton assistant IA pour le **Bac NS4**.\n\n**Ann al travay !**` }]);
  const [input,        setInput]        = useState("");
  const [image,        setImage]        = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [apiError,     setApiError]     = useState(null);
  const [lastPayload,  setLastPayload]  = useState(null);
  const [activeSubject,setActiveSubject]= useState(user.subjects?.[0] || null);
  const [showScrollBtn,setShowScrollBtn]= useState(false);
  const [favorites,    setFavorites]    = useState(() => { try { return JSON.parse(localStorage.getItem(`fav_${user.phone}`) || "[]"); } catch { return []; } });

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const chatRef   = useRef(null);

  // ── Compteur unique ──────────────────────────────────────────
  const DAILY_MAX  = user.dailyScans ?? 10;
  const today      = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const _scanKey   = `gid_scan_${user.phone}_${today}`;
  const [scansUsed, setScansUsed] = useState(() => { try { return parseInt(localStorage.getItem(_scanKey) || "0"); } catch { return 0; } });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const el = chatRef.current;
    const onScroll = () => { if (!el) return; setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120); };
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const detectSubject = (text) => {
    const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (t.includes("bio") || t.includes("cellule") || t.includes("adn") || t.includes("genetique")) return "Biologie";
    if (t.includes("geol") || t.includes("roche") || t.includes("mineral")) return "Géologie";
    if (t.includes("chim") || t.includes("molecule") || t.includes("acide")) return "Chimie";
    if (t.includes("phys") || t.includes("vitesse") || t.includes("force") || t.includes("energie")) return "Physique";
    if (t.includes("analyse") || t.includes("limite") || t.includes("derivee")) return "Analyse";
    if (t.includes("algebre") || t.includes("equation") || t.includes("fonction")) return "Algèbre";
    if (t.includes("suite") || t.includes("arithmetique") || t.includes("geometrique")) return "Suite";
    if (t.includes("complexe") || t.includes("imaginaire")) return "Complexe";
    if (t.includes("probabilite") || t.includes("chance")) return "Probabilité";
    if (t.includes("geometrie") || t.includes("triangle") || t.includes("cercle")) return "Géométrie";
    if (t.includes("economie") || t.includes("offre") || t.includes("demande") || t.includes("pib")) return "Économie";
    if (t.includes("philo") || t.includes("socrate")) return "Philosophie";
    if (t.includes("histoire") || t.includes("revolution")) return "Histoire";
    if (t.includes("geo") || t.includes("carte")) return "Géographie";
    if (t.includes("creole")) return "Créole";
    if (t.includes("francais") || t.includes("grammaire")) return "Français";
    if (t.includes("anglais")) return "Anglais";
    if (t.includes("espagnol")) return "Espagnol";
    if (t.includes("dissertation") || t.includes("redaction")) return "Dissertation";
    return (user.subjects && user.subjects[0]) || "Général";
  };

  const sendMessage = async (retryPayload = null) => {
    // Guard offline
    if (offline) { setApiError({ type: "network", message: "Pa gen koneksyon entènèt !", detail: "Konekte epi eseye ankò.", icon: "📶", retry: false }); return; }
    // Guard freemium expiré
    const freemiumExpired = user.freemiumExpiresAt && new Date(user.freemiumExpiresAt) < new Date() && !user.code;
    if (freemiumExpired) { onNavigate("payment"); return; }
    // Guard quota
    if (scansUsed >= DAILY_MAX) return;
    if (loading) return;

    await new Promise(r => setTimeout(r, 300));
    const isImage = retryPayload ? !!retryPayload.isImage : !!image;
    const payload = retryPayload || {
      userMsg:      { role: "user", content: input.trim() || "Analyse cet exercice.", image },
      currentInput: input.trim(),
      isImage:      !!image,
    };
    if (!payload.currentInput && !payload.userMsg.image) return;
    if (!retryPayload) { setMessages(p => [...p, payload.userMsg]); setInput(""); setImage(null); }
    setApiError(null); setLoading(true);

    try {
      const subject = detectSubject(payload.currentInput + " " + (payload.userMsg.content || "")) || activeSubject || "Général";
      const result  = await callEdge({
        action: "ask", phone: user.phone, schoolCode: user.code || "FREEMIUM",
        message:     payload.userMsg.content,
        imageBase64: payload.userMsg.image ? payload.userMsg.image.split(",")[1] : null,
        history:     messages.slice(-6), subject,
      });
      setMessages(p => [...p, { role: "assistant", content: result.reply }]);
      const next = scansUsed + 1;
      setScansUsed(next);
      try { localStorage.setItem(_scanKey, String(next)); } catch {}
      setLastPayload(null);
      await idbSaveScan(user.phone, {
        date:      new Date().toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince" }),
        scanDate:  new Date().toISOString().split("T")[0],
        subject, image: payload.userMsg.image || null, response: result.reply,
        dailyLimit: DAILY_MAX, scansUsed: next,
      });
    } catch (e) {
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
    setFavorites(prev => {
      const exists = prev.findIndex(f => f.id === i);
      const next   = exists >= 0 ? prev.filter(f => f.id !== i) : [...prev, { id: i, content: msg.content, subject: activeSubject, date: new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" }) }];
      try { localStorage.setItem(`fav_${user.phone}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/[#*_~`]/g, "").replace(/\$[^$]*\$/g, "formule").trim());
    utt.lang = "fr-FR"; utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <ExpiryBanner daysRemaining={user.daysRemaining} />

      {/* Banner offline */}
      {offline && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "7px 16px", background: "#78350f", borderBottom: "1px solid #f59e0b55", fontSize: 12, color: "#fcd34d" }}>
          <SignalIcon /> Mode hors-ligne — Istorik ou disponib, pa ka voye nouvo kesyon
          <button onClick={() => onNavigate("history")} style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 8, background: "#f59e0b22", color: "#fcd34d", border: "1px solid #f59e0b55", fontSize: 11, cursor: "pointer" }}>Istorik →</button>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "rgba(10,15,46,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          <img src={APP_LOGO} alt="Gid NS4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Prof Lakay</span>
          {user.isFreemium && (
            <span style={{ marginLeft: 8, fontSize: 10, padding: "1px 7px", borderRadius: 8, background: "#d4002a22", color: "#ff8080", border: "1px solid #d4002a33" }}>
              Freemium — {user.daysRemaining}j
            </span>
          )}
        </div>
        {/* Compteur unique */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 12px", borderRadius: 12, background: allDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)", border: `1px solid ${allDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`, minWidth: 64 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const filled = i < Math.round((scansUsed / DAILY_MAX) * 5);
              return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: filled ? "#d4002a" : "rgba(255,255,255,0.12)", boxShadow: filled ? "0 0 4px #d4002a88" : "none", transition: "all .3s" }} />;
            })}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: allDone ? "#3B4A6B" : "#60A5FA" }}>
            {allDone ? <span style={{ display: "flex", alignItems: "center", gap: 3 }}><CheckIcon /> Fini</span> : `${DAILY_MAX - scansUsed}/${DAILY_MAX} rekèt`}
          </span>
        </div>
      </div>
      {/* EXPIRY BANNER */}
<ExpiryBanner daysRemaining={user.daysRemaining} />
      {/* MESSAGES */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-2" style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "fadeIn .3s ease both" }}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div style={{ maxWidth: "82%" }}>
              {msg.image && <img src={msg.image} alt="scan" style={{ borderRadius: 14, marginBottom: 6, maxHeight: 140, objectFit: "contain", border: "1px solid rgba(255,255,255,0.1)" }} />}
              <div style={{ padding: "11px 15px", fontSize: 14, lineHeight: 1.65, background: msg.role === "user" ? "linear-gradient(135deg,#2563EB,#1D4ED8)" : "rgba(15,28,60,0.95)", border: msg.role === "assistant" ? "1px solid rgba(37,99,235,0.15)" : "none", color: "#E8EEFF", borderRadius: msg.role === "user" ? "18px 18px 5px 18px" : "5px 18px 18px 18px" }}>
                <LatexText content={msg.content} />
              </div>
              {msg.role === "assistant" && (
                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                  <button onClick={() => toggleFav(msg, i)} style={{ padding: "2px 8px", borderRadius: 10, background: "none", border: "none", cursor: "pointer", color: "#fbbf24", display: "inline-flex", alignItems: "center" }}>
                    {favorites.findIndex(f => f.id === i) >= 0 ? <StarFullIcon /> : <StarOutlineIcon />}
                  </button>
                  <button onClick={() => speak(msg.content)} style={{ padding: "2px 8px", borderRadius: 10, background: "none", border: "none", cursor: "pointer", opacity: 0.8, color: "#60a5fa", display: "inline-flex", alignItems: "center" }}>
                    <SpeakIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 items-start">
            <div className="w-8 h-8 rounded-xl flex-shrink-0 overflow-hidden" style={{ background: "#fff" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: "#0f1e4a" }}>
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
                <span className="text-blue-400 text-xs ml-2">Prof Lakay ap ekri...</span>
              </div>
            </div>
          </div>
        )}

        {allDone && !offline && (
          <div className="mx-2 px-4 py-3 rounded-2xl text-sm text-center" style={{ background: "#d4002a22", border: "1px solid #d4002a44", color: "#ff8080", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <ClockIcon /> Ou itilize tout {DAILY_MAX} rekèt ou yo pou jodi a. Tounen demen !
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* SCROLL BUTTON */}
      {showScrollBtn && (
        <button onClick={() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })}
          style={{ position: "absolute", bottom: 130, right: 16, zIndex: 40, width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
          <ScrollDownIcon />
        </button>
      )}

      <ErrorToast error={apiError} onRetry={lastPayload ? () => sendMessage(lastPayload) : null} onDismiss={() => { setApiError(null); setLastPayload(null); }} />

      {/* INPUT */}
      <div style={{ padding: "10px 12px", background: "rgba(10,15,46,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        {image && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 8px", background: "rgba(37,99,235,0.1)", borderRadius: 10, border: "1px solid rgba(37,99,235,0.2)" }}>
            <img src={image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ color: "#6B8ADB", fontSize: 11, flex: 1, display: "flex", alignItems: "center", gap: 6 }}><AttachmentIcon /> Image prête</span>
            <button onClick={() => setImage(null)} style={{ color: "#E8002A", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}><CloseIcon /></button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            onClick={() => { if (!allDone && !offline) fileRef.current?.click(); }}
            disabled={allDone || offline}
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: (allDone || offline) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", cursor: (allDone || offline) ? "not-allowed" : "pointer" }}>
            <CameraIcon />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); sendMessage(); } }}
            placeholder={offline ? "Hors-ligne — pa ka voye kesyon..." : allDone ? "Limit ou a rive..." : "Poze yon kesyon oswa analize yon egzèsis..."}
            rows={1}
            disabled={allDone || offline}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none resize-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", maxHeight: 80, color: "#E8EEFF", borderRadius: 12 }}
            onFocus={e => e.target.style.borderColor = "rgba(37,99,235,0.4)"}
            onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || allDone || offline}
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: (loading || allDone || offline) ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", cursor: (loading || allDone || offline) ? "not-allowed" : "pointer" }}>
            <SendIcon />
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}
