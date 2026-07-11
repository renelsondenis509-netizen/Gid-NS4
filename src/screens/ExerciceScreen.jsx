import { useState, useEffect } from "react";
import { BottomNav } from "../components/UI";
import { idbSaveExercice } from "../utils/idb";
import { callEdge } from "../api";
import { hasAccess } from "../utils/freemium";

import { cacheGet, cacheSet, cacheClear } from "../utils/cache";
const IcoArrowLeft = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>);
const IcoArrowRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>);
const IcoCheck = ({ size = 13 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);
const IcoX = ({ size = 13 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
const IcoGraduation = () => (<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>);
const IcoTrophy = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17l-1 7a5 5 0 0 1-8 0L7 4z"/><path d="M4 7c0 0-1 5 3 6"/><path d="M20 7c0 0 1 5-3 6"/></svg>);
const IcoThumbUp = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#86efac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>);
const IcoTarget = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);

export function ExerciceScreen({ user, scan, onBack, onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [score,     setScore]     = useState(0);
  const [done,      setDone]      = useState(false);
  const [answers,   setAnswers]   = useState([]);

  useEffect(() => {
    if (scan.questions?.length > 0) {
      setQuestions(scan.questions);
      setLoading(false);
      return;
    }
    const cacheKey = `exercice_${scan.id}`;
    const cached = cacheGet(cacheKey);
    if (cached) { setQuestions(cached); setLoading(false); return; }
    callEdge({ action: "generate_quiz", content: scan.response, subject: scan.subject || "Général", phone: user.phone, schoolCode: user.code })
      .then(r => {
        if (r.questions?.length > 0) {
          cacheSet(cacheKey, r.questions, 30 * 60 * 1000);
          setQuestions(r.questions);
        } else setError("Pa gen ase kontni pou jenere egzèsis la.");
      })
      .catch(() => setError("Enposib pou jenere egzèsis la. Eseye ankò."))
      .finally(() => setLoading(false));
  }, []);


  if (!hasAccess(user)) { onNavigate("payment"); return null; }

  const handleChoice = (idx) => {
    if (selected!==null) return;
    setSelected(idx);
    const correct=idx===questions[current].answer;
    if (correct) setScore(s=>s+1);
    setAnswers(a=>[...a,{...questions[current],selected:idx,correct}]);
  };

  const next = () => {
    const isLast=current+1>=questions.length;
    if (isLast) {
      idbSaveExercice(user.phone, {
        title:`${scan.subject||"Egzèsis"} — ${new Date().toLocaleDateString("fr-HT",{timeZone:"America/Port-au-Prince"})}`,
        subject:scan.subject, score, total:questions.length,
        questions, answers,
        date:new Date().toLocaleString("fr-HT",{timeZone:"America/Port-au-Prince"}),
        scanId:scan.id,
      });
      const note20 = Math.round((score / questions.length) * 20 * 10) / 10;
      if (user.code && user.code !== "FREEMIUM") callEdge({
        action: "save_quiz_score",
        phone: user.phone,
        schoolCode: user.code || "FREEMIUM",
        subject: scan.subject || "Général",
        score, total: questions.length,
        note20, streak: score === questions.length ? 1 : 0,
        name: user.name, source: "exercice",
      }).then(() => cacheClear(`leaderboard_${user.phone}_${user.code}`)).catch(() => {});
      setDone(true); return;
    }
    setCurrent(c=>c+1); setSelected(null);
  };
  const handleShare = async () => {
    const note20 = Math.round((score / questions.length) * 20 * 10) / 10;
    const mention = score === questions.length ? "Pafe !" : score >= questions.length / 2 ? "Byen !" : "Kontinye travay !";
    const text = "Gid NS4 - Rezilta Egzesis | Matye: " + (scan.subject||"") + " | Not: " + score + "/" + questions.length + " (" + note20 + "/20) | " + mention + " | Telechaje Gid NS4 sou Google Play !";
    if (navigator && navigator.share) {
      try { navigator.share({ title: "Rezilta Gid NS4", text: text }); return; } catch(e) {}
    }
    try { navigator.clipboard.writeText(text).then(function(){ alert("Rezilta kopye ! Ou ka kole li kote ou vle."); }); } catch(e) { alert(text); }
  };
  const q=questions[current];

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{background:"#0a0f2e"}}>
      <div className="flex gap-2 mb-4">{[0,1,2].map(i=><div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{animation:`bounce 1s ${i*0.2}s infinite`}}/>)}</div>
      <p className="text-blue-400 text-sm">Prof Lakay ap prepare egzèsis ou a...</p>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{background:"#0a0f2e"}}>
      <p className="text-red-400 text-center mb-4">{error}</p>
      <button onClick={onBack} className="px-6 py-3 rounded-xl font-bold text-white" style={{background:"linear-gradient(135deg,#d4002a,#ff6b35)"}}>Retounen</button>
    </div>
  );

  if (done) {
    const isPerfect=score===questions.length, isGood=score>=questions.length/2;
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{background:"linear-gradient(160deg,#0a0f2e,#0d1b4b)"}}>
        <div className="w-full max-w-sm space-y-4" style={{animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both"}}>
          <div className="text-center">
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><IcoGraduation/></div>
            <h2 className="text-white font-black text-2xl">Egzèsis la fini !</h2>
            <p className="text-blue-300 text-sm mt-1">{scan.subject}</p>
          </div>
          <div className="rounded-3xl px-5 py-5 text-center" style={{background:"rgba(37,99,235,0.15)",border:"2px solid rgba(37,99,235,0.35)"}}>
            <div className="font-black mt-1" style={{fontSize:52,color:"#60a5fa",lineHeight:1}}>
              {score}<span className="text-xl" style={{color:"#60a5fa99"}}>/{questions.length}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              {isPerfect?<IcoTrophy/>:isGood?<IcoThumbUp/>:<IcoTarget/>}
              <span className="text-white font-bold text-base">{isPerfect?"Pafè !":isGood?"Byen !":"Kontinye travay !"}</span>
            </div>
          </div>
          <div className="space-y-3" style={{maxHeight:300,overflowY:"auto"}}>
            {answers.map((a,i) => (
              <div key={i} className="rounded-2xl p-3" style={{background:a.correct?"#14532d22":"#7f1d1d22",border:`1px solid ${a.correct?"#22c55e33":"#ef444433"}`}}>
                <p className="text-white text-xs font-bold mb-1">{i+1}. {a.q}</p>
                <p className="flex items-center gap-1 text-xs" style={{color:a.correct?"#86efac":"#fca5a5"}}>
                  <span>{a.correct?<IcoCheck/>:<IcoX/>}</span>{a.choices[a.selected]}
                </p>
                {!a.correct&&<p className="flex items-center gap-1 text-green-400 text-xs mt-0.5"><span style={{color:"#86efac"}}><IcoCheck/></span>{a.choices[a.answer]}</p>}
              </div>
            ))}
          </div>
          <button onClick={onBack} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#2563eb,#3b82f6)"}}>
            <IcoArrowLeft/> Retounen nan istorik
          </button>
          <button onClick={handleShare} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#059669,#10b981)",marginTop:8}}>
            📤 Pataje Rezilta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{background:"#0a0f2e"}}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{background:"rgba(10,15,46,0.98)",borderColor:"#ffffff10"}}>
        <button onClick={onBack} className="text-blue-400 flex items-center"><IcoArrowLeft/></button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Egzèsis</h2>
          <p className="text-blue-400 text-xs">{scan.subject} • {current+1}/{questions.length}</p>
        </div>
        <div className="flex items-center gap-1 text-blue-400 text-sm font-bold">
          {score} <span style={{color:"#86efac"}}><IcoCheck size={14}/></span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full h-1.5 rounded-full mb-6" style={{background:"#1e3a8a33"}}>
          <div className="h-full rounded-full transition-all" style={{width:`${(current/questions.length)*100}%`,background:"linear-gradient(90deg,#2563eb,#3b82f6)"}}/>
        </div>
        <div className="rounded-2xl p-5 mb-6" style={{background:"#0f1e4a",border:"1px solid #1e3a8a33"}}>
          <p className="text-white font-bold text-base leading-relaxed">{q.q}</p>
        </div>
        <div className="space-y-3">
          {q.choices.map((choice,idx) => {
            const isSelected=selected===idx, isCorrect=idx===q.answer;
            let bg="#0f1e4a",border="#1e3a8a33",color="#E8EEFF";
            if (selected!==null) {
              if (isCorrect) {bg="#14532d33";border="#22c55e55";color="#86efac";}
              else if (isSelected) {bg="#7f1d1d33";border="#ef444455";color="#fca5a5";}
            }
            return (
              <button key={idx} onClick={()=>handleChoice(idx)}
                className="w-full text-left rounded-2xl px-4 py-4 font-medium transition-all active:scale-95 flex items-center gap-3"
                style={{background:bg,border:`1.5px solid ${border}`,color}}>
                <span className="font-black text-sm w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:"rgba(255,255,255,0.07)"}}>{["A","B","C","D"][idx]}</span>
                <span className="flex-1">{choice}</span>
                {selected!==null&&isCorrect&&<span style={{color:"#86efac"}}><IcoCheck size={16}/></span>}
                {selected!==null&&isSelected&&!isCorrect&&<span style={{color:"#fca5a5"}}><IcoX size={16}/></span>}
              </button>
            );
          })}
        </div>
        {selected!==null&&(
          <div className="mt-4">
            <button onClick={next} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2" style={{background:"linear-gradient(135deg,#2563eb,#3b82f6)"}}>
              {current+1>=questions.length?<><IcoCheck size={18}/><span>Wè Rezilta</span></>:<><span>Kesyon Swivan</span><IcoArrowRight/></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciceScreen;
