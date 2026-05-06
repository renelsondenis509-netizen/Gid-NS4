import { useState, useEffect } from "react";
import { PROF_LAKAY_PHOTO } from "../config";
import { idbGetScans, idbDeleteScan, idbGetExercice, idbDeleteExercice } from "../utils/idb";
import { LatexText } from "../components/LatexText";
import { BottomNav } from "../components/UI";

const IcoClipboard = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>);
const IcoDatabase = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>);
const IcoWarning = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>);
const IcoCamera = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>);
const IcoChat = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
const IcoChart = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>);
const IcoInbox = () => (<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>);
const IcoTrash = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>);
const IcoLoader = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>);
const IcoVolumeUp = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>);
const IcoStop = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/></svg>);
const IcoPencil = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>);

export function HistoryScreen({ user, onNavigate, onStartExercice }) {
  const [tab,      setTab]      = useState("history");
  const [history,  setHistory]  = useState([]);
  const [exercices,setExercices]= useState([]);
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [speakingId,setSpeakingId]=useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([idbGetScans(user.phone), idbGetExercice(user.phone)])
      .then(([scans, exos]) => { setHistory(scans); setExercices(exos); })
      .finally(() => setLoading(false));
  }, [user.phone]);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const handleSpeak = (text, id) => {
    if (speakingId === id) { window.speechSynthesis.cancel(); setSpeakingId(null); }
    else {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
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

  const dailyMap = {};
  history.forEach(h => {
    const day = h.scanDate || h.date?.split(",")[0] || "?";
    dailyMap[day] = (dailyMap[day] || 0) + 1;
  });

  if (selected) return (
    <div className="fixed inset-0 flex flex-col" style={{background:"#0a0f2e"}}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{background:"rgba(10,15,46,0.98)",borderColor:"#ffffff10"}}>
        <button onClick={() => setSelected(null)} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Detay rekèt la</h2>
          <p className="text-blue-400 text-xs">{selected.date}</p>
        </div>
        <button onClick={() => handleDeleteScan(selected)} disabled={deleting===selected.id}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
          style={{background:"#d4002a22",color:"#ff8080",border:"1px solid #d4002a33"}}>
          {deleting===selected.id?<IcoLoader/>:<IcoTrash/>} Efase
        </button>
        <button onClick={() => onStartExercice(selected)}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1"
          style={{background:"#1e3a8a22",color:"#60a5fa",border:"1px solid #3b82f633"}}>
          <IcoPencil/> Egzèsis
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!selected._fallback
          ? <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:"#14532d22",border:"1px solid #22c55e22"}}><span style={{color:"#86efac"}}><IcoDatabase/></span><span className="text-green-300 text-xs">• Image disponible hors-ligne</span></div>
          : <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{background:"#78350f22",border:"1px solid #f59e0b22"}}><span style={{color:"#fcd34d"}}><IcoWarning/></span><span className="text-yellow-300 text-xs">Mode fallback — Image non disponible hors-ligne</span></div>
        }
        {selected.image
          ? <div><p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1"><IcoCamera/> Imaj ki analize</p><img src={selected.image} alt="scan" className="w-full rounded-2xl object-contain max-h-56" style={{border:"1px solid #1e3a8a44"}}/></div>
          : <div className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{background:"#1e3a8a11",border:"1px solid #1e3a8a22"}}><IcoChat/><span className="text-blue-600 text-xs">Kesyon tèks sèlman. Pa gen imaj.</span></div>
        }
        <div className="rounded-2xl p-4" style={{background:"#0f1e4a",border:"1px solid #1e3a8a33"}}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl overflow-hidden" style={{background:"#fff"}}>
                <img src={PROF_LAKAY_PHOTO} alt="Prof Lakay" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <span className="text-white font-bold text-sm">Repons Prof Lakay</span>
            </div>
            <button onClick={() => handleSpeak(selected.response, selected.id)}
              className="p-2 rounded-xl" style={{background:speakingId===selected.id?"#d4002a22":"#1e3a8a22",border:"1px solid #3b82f633"}}>
              {speakingId===selected.id?<IcoStop/>:<IcoVolumeUp/>}
            </button>
          </div>
          <div className="text-sm leading-relaxed" style={{color:"#e0e8ff"}}>
            <LatexText content={selected.response}/>
          </div>
        </div>
        <div className="rounded-2xl px-4 py-3 flex justify-between" style={{background:"#0f1e4a",border:"1px solid #1e3a8a22"}}>
          <span className="text-blue-400 text-xs">Rekèt itilize jou sa</span>
          <span className="text-orange-300 font-bold text-xs">{selected.scansUsed}/{selected.dailyLimit||user.dailyScans}</span>
        </div>
      </div>
      <BottomNav active="history" onNavigate={onNavigate}/>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{background:"#0a0f2e"}}>
      <div className="px-4 py-4 border-b" style={{background:"rgba(10,15,46,0.98)",borderColor:"#ffffff10"}}>
        <h2 className="text-white font-bold flex items-center gap-2"><IcoClipboard/> Istorik & Egzèsis</h2>
        <div className="flex gap-2 mt-3">
          {[{key:"history",label:`Istorik (${history.length})`},{key:"exercices",label:`Egzèsis (${exercices.length})`}].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={tab===t.key?{background:"linear-gradient(135deg,#d4002a,#ff6b35)",color:"#fff"}:{background:"#1e3a8a22",color:"#60a5fa",border:"1px solid #3b82f633"}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex gap-2">{[0,1,2].map(i=><div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{animation:`bounce 1s ${i*0.2}s infinite`}}/>)}</div>
            <p className="text-blue-500 text-sm">Chajman...</p>
          </div>
        )}

        {!loading && tab==="history" && (
          <>
            {Object.keys(dailyMap).length>0 && (
              <div className="rounded-2xl p-4" style={{background:"#0f1e4a",border:"1px solid #1e3a8a33"}}>
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><IcoChart/> Rekèt pa jou</h3>
                <div className="space-y-2">
                  {Object.entries(dailyMap).slice(0,7).map(([day,count]) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-blue-400 text-xs w-24 flex-shrink-0">{day}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{background:"#1e3a8a44"}}>
                        <div className="h-full rounded-full" style={{width:`${Math.min((count/user.dailyScans)*100,100)}%`,background:count>=user.dailyScans?"#ef4444":"linear-gradient(90deg,#d4002a,#ff6b35)"}}/>
                      </div>
                      <span className="text-orange-300 text-xs font-bold w-10 text-right">{count}/{user.dailyScans}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {history.length===0
              ? <div className="flex flex-col items-center justify-center py-16 space-y-3"><IcoInbox/><p className="text-blue-400 text-center text-sm">Istorik la poko kreye.<br/>Fè yon premye rekèt nan chat la!</p><button onClick={()=>onNavigate("chat")} className="px-6 py-3 rounded-xl font-bold text-white text-sm" style={{background:"linear-gradient(135deg,#d4002a,#ff6b35)"}}>Ale nan chat la</button></div>
              : <>
                  <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Tout rekèt yo</p>
                  {history.map(h => (
                    <div key={h.id} className="rounded-2xl overflow-hidden" style={{background:"#0f1e4a",border:"1px solid #1e3a8a33"}}>
                      <button onClick={() => setSelected(h)} className="w-full text-left active:scale-95 transition-transform">
                        <div className="flex gap-3 p-4">
                          {h.image
                            ? <img src={h.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{border:"1px solid #1e3a8a44"}}/>
                            : <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#1e3a8a33"}}><IcoChat/></div>
                          }
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed" style={{color:"#93c5fd",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{h.response?.slice(0,100)}...</p>
                            <p className="text-blue-800 text-xs mt-1">{h.date}</p>
                          </div>
                          <span className="text-blue-700 text-lg self-center">›</span>
                        </div>
                      </button>
                      <div className="px-4 pb-3 flex justify-between items-center">
                        <button onClick={() => handleSpeak(h.response,h.id)} className="p-2 rounded-lg" style={{background:speakingId===h.id?"#d4002a22":"#1e3a8a22",border:"1px solid #3b82f633"}}>
                          {speakingId===h.id?<IcoStop/>:<IcoVolumeUp/>}
                        </button>
                        <button onClick={() => handleDeleteScan(h)} disabled={deleting===h.id} className="px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1" style={{background:"#d4002a15",color:"#ff8080",border:"1px solid #d4002a22"}}>
                          {deleting===h.id?<IcoLoader/>:<IcoTrash/>} Efase
                        </button>
                      </div>
                    </div>
                  ))}
                </>
            }
          </>
        )}

        {!loading && tab==="exercices" && (
          <>
            {exercices.length===0
              ? <div className="flex flex-col items-center justify-center py-16 space-y-3"><IcoPencil/><p className="text-blue-400 text-center text-sm">Pa gen egzèsis ankò.<br/>Kòmanse yon egzèsis depi nan istorik la!</p></div>
              : <>
                  <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider">Egzèsis sove yo</p>
                  {exercices.map(exo => (
                    <div key={exo.id} className="rounded-2xl overflow-hidden" style={{background:"#0f1e4a",border:"1px solid #1e3a8a33"}}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{exo.questions?.[0]?.q?.slice(0,60)||"Egzèsis"}…</p>
                            <p className="text-blue-400 text-xs mt-0.5">{exo.date}</p>
                            <p className="text-blue-600 text-xs mt-1">{exo.questions?.length||0} kesyon • {exo.score}/{exo.total}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => onStartExercice(exo)} className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1" style={{background:"#1e3a8a22",color:"#60a5fa",border:"1px solid #3b82f633"}}>
                              <IcoPencil/> Refè
                            </button>
                            <button onClick={() => handleDeleteExercice(exo)} disabled={deleting===exo.id} className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1" style={{background:"#d4002a15",color:"#ff8080",border:"1px solid #d4002a22"}}>
                              {deleting===exo.id?<IcoLoader/>:<IcoTrash/>}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
