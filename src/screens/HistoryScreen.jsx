import { useState, useEffect } from "react";
import { PROF_LAKAY_PHOTO } from "../config";
import { idbGetScans, idbDeleteScan } from "../utils/idb";
import { LatexText } from "../components/LatexText";
import { BottomNav } from "../components/UI";

const IcoClipboard = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
const IcoDatabase = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
const IcoWarning = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoCamera = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IcoChat = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoChart = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoInbox = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
const IcoTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IcoLoader = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

// 🎤 Icônes SVG plus visibles pour la synthèse vocale
const IcoVolumeUp = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const IcoStop = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>;

export function HistoryScreen({ user, onNavigate, onStartExercice }) {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    idbGetScans(user.phone).then(data => setHistory(data)).finally(() => setLoading(false));
  }, []);

  // 🎤 Fonction pour lire le texte
  const handleSpeak = (text, id) => {
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
      setSpeakingId(id);
    }
  };

  // Nettoyer la synthèse vocale
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleDelete = async (entry) => {
    setDeleting(entry.id);
    await idbDeleteScan(entry.id);
    setHistory(h => h.filter(x => x.id !== entry.id));
    if (selected?.id === entry.id) setSelected(null);
    if (speakingId === entry.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
    setDeleting(null);
  };

  const dailyMap = {};
  history.forEach(h => {
    const day = h.scanDate || h.date?.split(",")[0] || "?";
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day]++;
  });

  if (selected) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <button onClick={() => setSelected(null)} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg">Detay rekèt yo</h2>
          <p className="text-blue-300 text-sm">{selected.subject} • {selected.date}</p>
        </div>
        <button onClick={() => handleDelete(selected)} disabled={deleting === selected.id}
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background: "#d4002a33", color: "#ff9999", border: "1px solid #d4002a55" }}>
          {deleting === selected.id ? <IcoLoader /> : <IcoTrash />} Efase
        </button>
        <button onClick={() => onStartExercice(selected)}
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
          style={{ background:"#1e3a8a44", color:"#93c5fd", border:"1px solid #60a5fa" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          Egzèsis
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!selected._fallback ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#14532d44", border: "1px solid #22c55e66" }}>
            <span style={{ color:"#86efac" }}><IcoDatabase /></span>
            <span className="text-green-300 text-sm">• Image disponible hors-ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#78350f44", border: "1px solid #f59e0b66" }}>
            <span style={{ color:"#fcd34d" }}><IcoWarning /></span>
            <span className="text-yellow-300 text-sm">Mode fallback — Image non disponible hors-ligne</span>
          </div>
        )}
        {selected.image ? (
          <div>
            <p className="text-blue-300 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
              <IcoCamera /> Imaj ki analize
            </p>
            <img src={selected.image} alt="scan" className="w-full rounded-2xl object-contain max-h-56" style={{ border: "1px solid #3b82f655" }} />
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#1e3a8a33", border: "1px solid #3b82f644" }}>
            <IcoChat />
            <span className="text-blue-300 text-sm">Kesyon tèks sèlman. Pa gen imaj.</span>
          </div>
        )}
        <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #3b82f655" }}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl overflow-hidden" style={{ background: "#fff" }}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span className="text-white font-bold text-base">Repons Prof Lakay</span>
            </div>
            {/* 🎤 Bouton lecture vocale plus visible */}
            <button
              onClick={() => handleSpeak(selected.response, selected.id)}
              className="p-2.5 rounded-xl transition-colors flex items-center gap-1"
              style={{ 
                background: speakingId === selected.id ? "#d4002a44" : "#2563eb44", 
                border: speakingId === selected.id ? "1px solid #ff6666" : "1px solid #60a5fa",
                boxShadow: "0 0 8px rgba(37,99,235,0.3)"
              }}
            >
              {speakingId === selected.id ? <IcoStop /> : <IcoVolumeUp />}
              <span className="text-xs font-medium" style={{ color: speakingId === selected.id ? "#ff9999" : "#93c5fd" }}>
                {speakingId === selected.id ? "Stop" : "Li"}
              </span>
            </button>
          </div>
          <div className="text-base leading-relaxed" style={{ color: "#e0e8ff", fontSize: "15px" }}>
            <LatexText content={selected.response} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 flex justify-between" style={{ background: "#0f1e4a", border: "1px solid #3b82f644" }}>
          <span className="text-blue-300 text-sm">Rekèt itilize jou sa</span>
          <span className="text-orange-300 font-bold text-sm">{selected.scansUsed}/{selected.dailyLimit || user.dailyScans}</span>
        </div>
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <h2 className="text-white font-bold flex items-center gap-2 text-lg"><IcoClipboard /> Istorik Rekèt Yo, Kesyon/Repons Ou Yo</h2>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-blue-300 text-sm">{history.length} scan{history.length !== 1 ? "s" : ""} total</p>
          <span className="text-sm px-2 py-0.5 rounded-full font-medium flex items-center gap-1" style={{ background: "#14532d44", color: "#86efac", border: "1px solid #22c55e66" }}>
            <IcoDatabase /> Hors-ligne
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-300 text-base">Chajman istorik ou a...</p>
          </div>
        )}
        {!loading && Object.keys(dailyMap).length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #3b82f655" }}>
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2"><IcoChart /> Rekèt pa jou</h3>
            <div className="space-y-2">
              {Object.entries(dailyMap).slice(0, 7).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-blue-300 text-sm w-24 flex-shrink-0">{day}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1e3a8a66" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / user.dailyScans) * 100}%`, background: count >= user.dailyScans ? "#ef4444" : "linear-gradient(90deg,#d4002a,#ff6b35)" }} />
                  </div>
                  <span className="text-orange-300 text-sm font-bold w-10 text-right">{count}/{user.dailyScans}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <IcoInbox />
            <p className="text-blue-300 text-center text-base">Poko gen istwa.<br />Fè yon premye rekèt nan chat la!</p>
            <button onClick={() => onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-base"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>Ale nan chat la</button>
          </div>
        )}
        {!loading && history.length > 0 && (
          <>
            <h3 className="text-blue-300 text-sm font-semibold uppercase tracking-wider">Tout rekèt, kesyon/repons ou yo</h3>
            {history.map(h => (
              <div key={h.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f1e4a", border: "1px solid #3b82f655" }}>
                <button onClick={() => setSelected(h)} className="w-full text-left active:scale-95 transition-transform">
                  <div className="flex gap-3 p-4">
                    {h.image ? (
                      <img src={h.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid #3b82f644" }} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1e3a8a66" }}>
                        <IcoChat />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#d4002a33", color: "#ff9999" }}>{h.subject}</span>
                        {h.image && <span style={{ color:"#86efac" }}><IcoDatabase /></span>}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#c7d2fe", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {h.response?.slice(0, 100)}...
                      </p>
                      <p className="text-blue-400 text-xs mt-1">{h.date}</p>
                    </div>
                    <span className="text-blue-400 text-xl self-center">›</span>
                  </div>
                </button>
                <div className="px-4 pb-3 flex justify-between items-center gap-2">
                  {/* 🎤 Bouton lecture vocale plus visible */}
                  <button
                    onClick={() => handleSpeak(h.response, h.id)}
                    className="p-2.5 rounded-lg transition-colors flex items-center gap-1"
                    style={{ 
                      background: speakingId === h.id ? "#d4002a44" : "#2563eb44", 
                      border: speakingId === h.id ? "1px solid #ff6666" : "1px solid #60a5fa",
                    }}
                  >
                    {speakingId === h.id ? <IcoStop /> : <IcoVolumeUp />}
                    <span className="text-xs font-medium" style={{ color: speakingId === h.id ? "#ff9999" : "#93c5fd" }}>
                      {speakingId === h.id ? "Stop" : "Li"}
                    </span>
                  </button>
                  <button onClick={() => handleDelete(h)} disabled={deleting === h.id}
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1"
                    style={{ background: "#d4002a33", color: "#ff9999", border: "1px solid #d4002a55" }}>
                    {deleting === h.id ? <IcoLoader /> : <IcoTrash />} Efase
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );
}

export default HistoryScreen;