import { useState, useRef, useEffect } from "react";
import { APP_LOGO, PROF_LAKAY_PHOTO } from "../config";
import { callEdge, parseApiError } from "../api";
import { idbSaveScan } from "../utils/idb";
import { compressImage } from "../utils/helpers";
import { useOffline } from "../utils/useOffline";
import { LatexText } from "../components/LatexText";
import { ErrorToast, ExpiryBanner } from "../components/UI";
import { BottomNav } from "../components/UI";

// ─── Icônes SVG ───────────────────────────────────────────────────────────────
const SignalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.93 4.93A10 10 0 0 1 19.07 19.07" />
    <path d="M7.76 7.76A6 6 0 0 1 16.24 16.24" />
    <path d="M10.59 10.59a2 2 0 0 0 2.83 2.83" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const AttachmentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarFullIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarOutlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CameraIconSmall = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EditIconSmall = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export function ChatScreen({ user, onNavigate }) {
  const offline = useOffline();

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: `Bonjou **${user.name || ""}** ! Mwen se **Prof Lakay**\n\nJe suis ton assistant IA pour le **Bac NS4**.\n\n**Ann al travay !**`,
  }]);
  const [input,         setInput]         = useState("");
  const [image,         setImage]         = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [apiError,      setApiError]      = useState(null);
  const [lastPayload,   setLastPayload]   = useState(null);
  const [activeSubject, setActiveSubject] = useState(user.subjects?.[0] || null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [favorites,     setFavorites]     = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fav_${user.phone}`) || "[]"); } catch { return []; }
  });

  const bottomRef = useRef(null);
  const fileRef   = useRef(null);
  const chatRef   = useRef(null);

  const IMG_MAX  = user.dailyImageScans ?? 1;
  const TEXT_MAX = user.dailyTextScans  ?? 4;
  const today    = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const _imgKey  = `gid_img_${user.phone}_${today}`;
  const _txtKey  = `gid_txt_${user.phone}_${today}`;

  const [imgUsed,  setImgUsed]  = useState(() => { try { return parseInt(localStorage.getItem(_imgKey)  || "0"); } catch { return 0; } });
  const [textUsed, setTextUsed] = useState(() => { try { return parseInt(localStorage.getItem(_txtKey) || "0"); } catch { return 0; } });

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const el = chatRef.current;
    const onScroll = () => {
      if (!el) return;
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
    };
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const detectSubject = (text) => {
    const t = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (t.includes("bio") || t.includes("cellule") || t.includes("adn") || t.includes("génétique")) return "Biologie";
    if (t.includes("géol") || t.includes("roche") || t.includes("minéral")) return "Géologie";
    if (t.includes("physiol") || t.includes("organe") || t.includes("système")) return "Physiologie";
    if (t.includes("chim") || t.includes("molécule") || t.includes("acide")) return "Chimie";
    if (t.includes("phys") || t.includes("vitesse") || t.includes("force") || t.includes("énergie")) return "Physiques";
    if (t.includes("analyse") || t.includes("limite") || t.includes("dérivée")) return "Analyse";
    if (t.includes("algèbre") || t.includes("équation") || t.includes("fonction")) return "Algèbre";
    if (t.includes("suite") || t.includes("arithmétique") || t.includes("géométrique")) return "Suite";
    if (t.includes("complexe") || t.includes("imaginaire")) return "Complexe";
    if (t.includes("probabilité") || t.includes("chance") || t.includes("dé")) return "Probabilité";
    if (t.includes("géométrie") || t.includes("triangle") || t.includes("cercle")) return "Géométrie";
    if (t.includes("économie") || t.includes("microéconomie") || t.includes("macroéconomie") || t.includes("offre") || t.includes("demande") || t.includes("pib")) return "Économie";
    if (t.includes("philo") || t.includes("socrate")) return "Philosophie";
    if (t.includes("histoire") || t.includes("révolution")) return "Histoire";
    if (t.includes("géo") || t.includes("carte")) return "Géographie";
    if (t.includes("créole")) return "Créole";
    if (t.includes("français") || t.includes("grammaire")) return "Français";
    if (t.includes("anglais")) return "Anglais";
    if (t.includes("espagnol")) return "Espagnol";
    if (t.includes("dissertation") || t.includes("rédaction")) return "Dissertation";
    return (user.subjects && user.subjects[0]) || "Général";
  };

  const sendMessage = async (retryPayload = null) => {
    if (offline) {
      setApiError({ type: "network", message: "Pa gen koneksyon entènèt !", detail: "Konekte epi eseye ankò.", icon: "📶", retry: false });
      return;
    }
    await new Promise(r => setTimeout(r, 300));
    const isImage = retryPayload ? !!retryPayload.isImage : !!image;
    const payload = retryPayload || {
      userMsg:      { role: "user", content: input.trim() || "Analyse cet exercice.", image },
      currentInput: input.trim(),
      isImage:      !!image,
    };
    if (!payload.currentInput && !payload.userMsg.image) return;
    if (loading) return;
    if (isImage  && imgUsed  >= IMG_MAX)  return;
    if (!isImage && textUsed >= TEXT_MAX) return;
    if (!retryPayload) { setMessages(p => [...p, payload.userMsg]); setInput(""); setImage(null); }
    setApiError(null); setLoading(true);
    try {
      const subject = detectSubject(payload.currentInput) || activeSubject || "Général";
      const result  = await callEdge({
        action: "ask", phone: user.phone, schoolCode: user.code,
        message:      payload.userMsg.content,
        imageBase64:  payload.userMsg.image ? payload.userMsg.image.split(",")[1] : null,
        history:      messages.slice(-6), subject,
      });
      setMessages(p => [...p, { role: "assistant", content: result.reply }]);
      if (isImage) {
        setImgUsed(n => { const next = n + 1; try { localStorage.setItem(_imgKey, String(next)); } catch {} return next; });
      } else {
        setTextUsed(n => { const next = n + 1; try { localStorage.setItem(_txtKey, String(next)); } catch {} return next; });
      }
      setLastPayload(null);
      const scansUsed = isImage ? imgUsed + 1 : textUsed + 1;
      await idbSaveScan(user.phone, {
        date:      new Date().toLocaleString("fr-HT", { timeZone: "America/Port-au-Prince" }),
        scanDate:  new Date().toISOString().split("T")[0],
        subject, image: payload.userMsg.image || null, response: result.reply,
        dailyLimit: IMG_MAX + TEXT_MAX, scansUsed,
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

  const imgDone  = imgUsed  >= IMG_MAX;
  const textDone = textUsed >= TEXT_MAX;
  const allDone  = imgDone && textDone;

  const toggleFav = (msg, i) => {
    setFavorites(prev => {
      const exists = prev.findIndex(f => f.id === i);
      const next   = exists >= 0
        ? prev.filter(f => f.id !== i)
        : [...prev, { id: i, content: msg.content, subject: activeSubject, date: new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" }) }];
      try { localStorage.setItem(`fav_${user.phone}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/[#*_~`]/g, "").replace(/\$[^$]*\$/g, "formule").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang  = "fr-FR";
    utt.rate  = 0.9;
    utt.pitch = 1;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <ExpiryBanner daysRemaining={user.daysRemaining} />

      {offline && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "7px 16px", background: "#78350f",
          borderBottom: "1px solid #f59e0b55", fontSize: 12, color: "#fcd34d",
        }}>
          <SignalIcon />
          <span>Mode hors-ligne — Istorik ou disponib, pa ka voye nouvo kesyon</span>
          <button
            onClick={() => onNavigate("history")}
            style={{ marginLeft: 8, padding: "2px 10px", borderRadius: 8, background: "#f59e0b22", color: "#fcd34d", border: "1px solid #f59e0b55", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            Istorik <ArrowRightIcon />
          </button>
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
        {/* Token image */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 9px", borderRadius: 12, background: imgDone ? "rgba(255,255,255,0.04)" : "rgba(212,0,42,0.15)", border: `1px solid ${imgDone ? "rgba(255,255,255,0.08)" : "rgba(212,0,42,0.35)"}`, minWidth: 52 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.round((imgUsed / IMG_MAX) * 5);
              return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: filled ? "#d4002a" : "rgba(255,255,255,0.12)", boxShadow: filled ? "0 0 4px #d4002a88" : "none", transition: "all .3s" }} />;
            })}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: imgDone ? "#3B4A6B" : "#ff6b35" }}>
            {imgDone ? (<span style={{ display: "flex", alignItems: "center", gap: 3 }}><CheckIcon /> Fini</span>) : (<span style={{ display: "flex", alignItems: "center", gap: 3 }}>{IMG_MAX - imgUsed}/{IMG_MAX} <CameraIconSmall /></span>)}
          </span>
        </div>
        {/* Token texte */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 9px", borderRadius: 12, background: textDone ? "rgba(255,255,255,0.04)" : "rgba(37,99,235,0.15)", border: `1px solid ${textDone ? "rgba(255,255,255,0.08)" : "rgba(37,99,235,0.35)"}`, minWidth: 52 }}>
          <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.round((textUsed / TEXT_MAX) * 5);
              return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: filled ? "#2563EB" : "rgba(255,255,255,0.12)", boxShadow: filled ? "0 0 4px #2563EB88" : "none", transition: "all .3s" }} />;
            })}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: textDone ? "#3B4A6B" : "#60A5FA" }}>
            {textDone ? (<span style={{ display: "flex", alignItems: "center", gap: 3 }}><CheckIcon /> Fini</span>) : (<span style={{ display: "flex", alignItems: "center", gap: 3 }}>{TEXT_MAX - textUsed}/{TEXT_MAX} <EditIconSmall /></span>)}
          </span>
        </div>
      </div>

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
                <button onClick={() => toggleFav(msg, i)} style={{ marginTop: 4, padding: "2px 8px", borderRadius: 10, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#fbbf24", display: "inline-flex", alignItems: "center" }}>
                  {favorites.findIndex(f => f.id === i) >= 0 ? <StarFullIcon /> : <StarOutlineIcon />}
                </button>
              )}
            </div>
            {msg.role === "assistant" && (
              <button onClick={() => speak(msg.content)} style={{ marginTop: 2, padding: "2px 8px", borderRadius: 10, background: "none", border: "none", cursor: "pointer", fontSize: 14, opacity: 0.8, color: "#60a5fa" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </button>
            )}
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
            <ClockIcon /> Ou itilize tout scan ak kesyon ou yo pou jodi a. Tounen demen !
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* SCROLL BUTTON */}
      {showScrollBtn && (
        <button
          onClick={() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })}
          style={{ position: "absolute", bottom: 130, right: 16, zIndex: 40, width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      )}

      <ErrorToast error={apiError} onRetry={lastPayload ? () => sendMessage(lastPayload) : null} onDismiss={() => { setApiError(null); setLastPayload(null); }} />

      {/* INPUT */}
      <div style={{ padding: "10px 12px", background: "rgba(10,15,46,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        {image && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 8px", background: "rgba(37,99,235,0.1)", borderRadius: 10, border: "1px solid rgba(37,99,235,0.2)" }}>
            <img src={image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            <span style={{ color: "#6B8ADB", fontSize: 11, flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <AttachmentIcon /> Image prête
            </span>
            <button onClick={() => setImage(null)} style={{ color: "#E8002A", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <CloseIcon />
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <button
            onClick={() => { if (!imgDone && !offline) fileRef.current?.click(); }}
            disabled={imgDone || offline}
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: (imgDone || offline) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", cursor: (imgDone || offline) ? "not-allowed" : "pointer" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={(imgDone || offline) ? "#3B4A6B" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ position: "absolute", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); sendMessage(); } }}
            placeholder={offline ? "Hors-ligne — pa ka voye kesyon..." : allDone ? "Limit ou a rive..." : imgDone ? "Poze yon kesyon tèks..." : "Poze yon kesyon oswa analize yon egzèsis..."}
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
            style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: (loading || allDone || offline) ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg,#2563EB,#3B82F6)", border: "none", cursor: (loading || allDone || offline) ? "not-allowed" : "pointer" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
      <BottomNav active="chat" onNavigate={onNavigate} />
    </div>
  );
}