import { useState, useEffect } from "react";
import { callEdge } from "../api";
import { BottomNav } from "../components/UI";

export function ExerciceScreen({ user, scan, onBack, onNavigate }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [score, setScore]         = useState(0);
  const [done, setDone]           = useState(false);
  const [answers, setAnswers]     = useState([]);

  useEffect(() => {
    callEdge({ action:"generate_quiz", content: scan.response, subject: scan.subject })
      .then(data => setQuestions(data.questions || []))
      .catch(() => setError("Imposib jenere egzèsis la. Eseye ankò."))
      .finally(() => setLoading(false));
  }, []);

  const handleChoice = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { ...questions[current], selected: idx, correct }]);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
  };

  const q = questions[current];

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background:"#0a0f2e" }}>
      <div className="flex gap-2 mb-4">
        {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-blue-400" style={{ animation:`bounce 1s ${i*0.2}s infinite` }} />)}
      </div>
      <p className="text-blue-400 text-sm">Prof Lakay ap kreye egzèsis ou...</p>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background:"#0a0f2e" }}>
      <p className="text-red-400 text-center mb-4">{error}</p>
      <button onClick={onBack} className="px-6 py-3 rounded-xl font-bold text-white"
        style={{ background:"linear-gradient(135deg,#d4002a,#ff6b35)" }}>← Retounen</button>
    </div>
  );

  if (done) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-6" style={{ background:"linear-gradient(160deg,#0a0f2e,#0d1b4b)" }}>
      <div className="w-full max-w-sm space-y-4" style={{ animation:"popIn .5s cubic-bezier(.34,1.56,.64,1) both" }}>
        <div className="text-center">
          <div style={{ fontSize:56, textAlign:"center" }}>🎊</div>
          <h2 className="text-white font-black text-2xl mt-2">Egzèsis Fini !</h2>
          <p className="text-blue-300 text-sm mt-1">{scan.subject}</p>
        </div>
        <div className="rounded-3xl px-5 py-5 text-center" style={{ background:"rgba(37,99,235,0.15)", border:"2px solid rgba(37,99,235,0.35)" }}>
          <div className="font-black mt-1" style={{ fontSize:52, color:"#60a5fa", lineHeight:1 }}>
            {score}<span className="text-xl" style={{ color:"#60a5fa99" }}>/{questions.length}</span>
          </div>
          <div className="text-white font-bold text-lg mt-1">
            {score === questions.length ? "Pafè !" : score >= questions.length/2 ? "Bien !" : "Kontinye travay !"}
          </div>
        </div>
        <div className="space-y-3">
          {answers.map((a, i) => (
            <div key={i} className="rounded-2xl p-3" style={{ background: a.correct ? "#14532d22" : "#7f1d1d22", border:`1px solid ${a.correct ? "#22c55e33" : "#ef444433"}` }}>
              <p className="text-white text-xs font-bold mb-1">{i+1}. {a.q}</p>
              <p className="text-xs" style={{ color: a.correct ? "#86efac" : "#fca5a5" }}>
                {a.correct ? "✔" : "✕"} {a.choices[a.selected]}
              </p>
              {!a.correct && <p className="text-green-400 text-xs">✔ {a.choices[a.answer]}</p>}
              {a.explanation && <p className="text-blue-400 text-xs mt-1 italic">{a.explanation}</p>}
            </div>
          ))}
        </div>
        <button onClick={onBack} className="w-full py-4 rounded-2xl font-bold text-white"
          style={{ background:"linear-gradient(135deg,#2563eb,#3b82f6)" }}>← Retounen nan Istwa</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background:"#0a0f2e" }}>
      <div className="px-4 py-4 border-b flex items-center gap-3" style={{ background:"rgba(10,15,46,0.98)", borderColor:"#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Egzèsis</h2>
          <p className="text-blue-400 text-xs">{scan.subject} • {current+1}/{questions.length}</p>
        </div>
        <div className="text-blue-400 text-sm font-bold">{score} ✔</div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="w-full h-1.5 rounded-full mb-6" style={{ background:"#1e3a8a33" }}>
          <div className="h-full rounded-full transition-all" style={{ width:`${((current)/questions.length)*100}%`, background:"linear-gradient(90deg,#2563eb,#3b82f6)" }} />
        </div>
        <div className="rounded-2xl p-5 mb-6" style={{ background:"#0f1e4a", border:"1px solid #1e3a8a33" }}>
          <p className="text-white font-bold text-base leading-relaxed">{q.q}</p>
        </div>
        <div className="space-y-3">
          {q.choices.map((choice, idx) => {
            const isSelected = selected === idx;
            const isCorrect  = idx === q.answer;
            let bg = "#0f1e4a", border = "#1e3a8a33", color = "#E8EEFF";
            if (selected !== null) {
              if (isCorrect)        { bg = "#14532d33"; border = "#22c55e55"; color = "#86efac"; }
              else if (isSelected)  { bg = "#7f1d1d33"; border = "#ef444455"; color = "#fca5a5"; }
            } else if (isSelected) {
              bg = "#1e3a8a33"; border = "#3b82f655";
            }
            return (
              <button key={idx} onClick={() => handleChoice(idx)}
                className="w-full text-left rounded-2xl px-4 py-4 font-medium transition-all active:scale-95"
                style={{ background:bg, border:`1.5px solid ${border}`, color }}>
                <span className="font-bold mr-2">{["A","B","C","D"][idx]}.</span>{choice}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <div className="mt-4">
            {q.explanation && (
              <div className="rounded-xl px-4 py-3 mb-3" style={{ background:"#1e3a8a22", border:"1px solid #3b82f633" }}>
                <p className="text-blue-300 text-xs italic">{q.explanation}</p>
              </div>
            )}
            <button onClick={next} className="w-full py-4 rounded-2xl font-bold text-white"
              style={{ background:"linear-gradient(135deg,#2563eb,#3b82f6)" }}>
              {current + 1 >= questions.length ? "Wè Rezilta" : "Kesyon Swivan →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciceScreen;
