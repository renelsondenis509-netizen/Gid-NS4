import { useState, useEffect } from "react";
import { LatexText } from "../components/LatexText";
import { BottomNav } from "../components/UI";

// 🎤 Icônes SVG pour la synthèse vocale
const IcoVolumeUp = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const IcoStop = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>;

export function FavoritesScreen({ user, onNavigate }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fav_${user.phone}`) || "[]"); } catch { return []; }
  });
  const [selected, setSelected] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);

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

  // Nettoyer la synthèse vocale quand le composant est démonté
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const removeFav = (id) => {
    const next = favorites.filter(f => f.id !== id);
    setFavorites(next);
    try { localStorage.setItem(`fav_${user.phone}`, JSON.stringify(next)); } catch {}
    if (selected?.id === id) setSelected(null);
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  };

  if (selected) return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ background:"rgba(10,15,46,0.98)", borderColor:"#ffffff10" }}>
        <button onClick={() => setSelected(null)} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Favori</h2>
          <p className="text-blue-400 text-xs">{selected.subject} • {selected.date}</p>
        </div>
        <button onClick={() => removeFav(selected.id)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
          style={{ background:"#d4002a22", color:"#ff8080", border:"1px solid #d4002a33" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Retire
        </button>
        {/* 🎤 Bouton lecture vocale dans la vue détail */}
        <button
          onClick={() => handleSpeak(selected.content, selected.id)}
          className="p-2 rounded-xl transition-colors"
          style={{ background: speakingId === selected.id ? "#d4002a22" : "#1e3a8a22", border: "1px solid #3b82f633" }}
        >
          {speakingId === selected.id ? <IcoStop /> : <IcoVolumeUp />}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="rounded-2xl p-4" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
          <LatexText content={selected.content} />
        </div>
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
      <div className="px-4 py-4 border-b" style={{ background:"rgba(10,15,46,0.98)", borderColor:"#ffffff10" }}>
        <h2 className="text-white font-bold flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Repons Favori
        </h2>
        <p className="text-blue-400 text-xs mt-0.5">{favorites.length} favori{favorites.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <p className="text-blue-400 text-center text-sm">Pa gen favori encore.<br/>Klike sou ☆ anba repons Prof Lakay!</p>
            <button onClick={() => onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>→ Ale nan Chat</button>
          </div>
        )}
        {favorites.map((f, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
            <button onClick={() => setSelected(f)} className="w-full text-left active:scale-95 transition-transform">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize:12 }}>⭐</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background:"#d4002a22", color:"#ff8080" }}>{f.subject}</span>
                  <span className="text-blue-800 text-xs ml-auto">{f.date}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color:"#93c5fd", display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {f.content?.slice(0, 120)}...
                </p>
              </div>
            </button>
            {/* 🎤 Bouton lecture vocale dans la liste */}
            <div className="px-4 pb-3 flex justify-end">
              <button
                onClick={() => handleSpeak(f.content, f.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: speakingId === f.id ? "#d4002a22" : "#1e3a8a22", border: "1px solid #3b82f633" }}
              >
                {speakingId === f.id ? <IcoStop /> : <IcoVolumeUp />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}

export default FavoritesScreen;