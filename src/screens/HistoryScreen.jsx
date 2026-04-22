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

export function HistoryScreen({ user, onNavigate }) {
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    idbGetScans(user.phone).then(data => setHistory(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (entry) => {
    setDeleting(entry.id);
    await idbDeleteScan(entry.id);
    setHistory(h => h.filter(x => x.id !== entry.id));
    if (selected?.id === entry.id) setSelected(null);
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
          <h2 className="text-white font-bold">Detay Scan</h2>
          <p className="text-blue-400 text-xs">{selected.subject} • {selected.date}</p>
        </div>
        <button onClick={() => handleDelete(selected)} disabled={deleting === selected.id}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
          style={{ background: "#d4002a22", color: "#ff8080", border: "1px solid #d4002a33" }}>
          {deleting === selected.id ? <IcoLoader /> : <IcoTrash />} Efase
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!selected._fallback ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#14532d22", border: "1px solid #22c55e22" }}>
            <span style={{ color:"#86efac" }}><IcoDatabase /></span>
            <span className="text-green-300 text-xs">• Image disponible hors-ligne</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#78350f22", border: "1px solid #f59e0b22" }}>
            <span style={{ color:"#fcd34d" }}><IcoWarning /></span>
            <span className="text-yellow-300 text-xs">Mode fallback — Image non disponible hors-ligne</span>
          </div>
        )}
        {selected.image ? (
          <div>
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
              <IcoCamera /> Imaj ki analize
            </p>
            <img src={selected.image} alt="scan" className="w-full rounded-2xl object-contain max-h-56" style={{ border: "1px solid #1e3a8a44" }} />
          </div>
        ) : (
          <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: "#1e3a8a11", border: "1px solid #1e3a8a22" }}>
            <IcoChat />
            <span className="text-blue-600 text-xs">Kesyon tèks. Pa gen imaj</span>
          </div>
        )}
        <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-xl overflow-hidden" style={{ background: "#fff" }}>
              <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span className="text-white font-bold text-sm">Repons Prof Lakay</span>
          </div>
          <div className="text-sm leading-relaxed" style={{ color: "#e0e8ff" }}>
            <LatexText content={selected.response} />
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 flex justify-between" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a22" }}>
          <span className="text-blue-400 text-xs">Scan itilize jou sa</span>
          <span className="text-orange-300 font-bold text-xs">{selected.scansUsed}/{selected.dailyLimit || user.dailyScans}</span>
        </div>
      </div>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background: "rgba(10,15,46,0.98)", borderColor: "#ffffff10" }}>
        <h2 className="text-white font-bold flex items-center gap-2"><IcoClipboard /> Istwa Scan, Kesyon/Repons Ou Yo</h2>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-blue-400 text-xs">{history.length} scan{history.length !== 1 ? "s" : ""} total</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1" style={{ background: "#14532d22", color: "#86efac", border: "1px solid #22c55e22" }}>
            <IcoDatabase />  • Hors-ligne
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">
              {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}
            </div>
            <p className="text-blue-500 text-sm">Chajman istwa ou a...</p>
          </div>
        )}
        {!loading && Object.keys(dailyMap).length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><IcoChart /> Scan pa Jou</h3>
            <div className="space-y-2">
              {Object.entries(dailyMap).slice(0, 7).map(([day, count]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-blue-400 text-xs w-24 flex-shrink-0">{day}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#1e3a8a44" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / user.dailyScans) * 100}%`, background: count >= user.dailyScans ? "#ef4444" : "linear-gradient(90deg,#d4002a,#ff6b35)" }} />
                  </div>
                  <span className="text-orange-300 text-xs font-bold w-10 text-right">{count}/{user.dailyScans}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <IcoInbox />
            <p className="text-blue-400 text-center text-sm">Poko gen istwa.<br />Fè premye scan, kesyon ou nan Chat la!</p>
            <button onClick={() => onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>Ale nan Chat</button>
          </div>
        )}
        {!loading && history.length > 0 && (
          <>
            <h3 className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Tout Scan, Kesyon/Repons Ou Yo</h3>
            {history.map(h => (
              <div key={h.id} className="rounded-2xl overflow-hidden" style={{ background: "#0f1e4a", border: "1px solid #1e3a8a33" }}>
                <button onClick={() => setSelected(h)} className="w-full text-left active:scale-95 transition-transform">
                  <div className="flex gap-3 p-4">
                    {h.image ? (
                      <img src={h.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid #1e3a8a44" }} />
                    ) : (
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1e3a8a33" }}>
                        <IcoChat />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#d4002a22", color: "#ff8080" }}>{h.subject}</span>
                        {h.image && <span style={{ color:"#86efac" }}><IcoDatabase /></span>}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "#93c5fd", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {h.response?.slice(0, 100)}...
                      </p>
                      <p className="text-blue-800 text-xs mt-1">{h.date}</p>
                    </div>
                    <span className="text-blue-700 text-lg self-center">›</span>
                  </div>
                </button>
                <div className="px-4 pb-3 flex justify-end">
                  <button onClick={() => handleDelete(h)} disabled={deleting === h.id}
                    className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
                    style={{ background: "#d4002a15", color: "#ff8080", border: "1px solid #d4002a22" }}>
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
