
import { useState, useEffect } from "react";
import { callEdge } from "../api";

export function PaymentScreen({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hardcode direct des numéros (contourne l'edge function)
    setPayments([
      { method: "Digicel", number: "+509 48 69 50 79" },
      { method: "Natcom", number: "+509 40 66 91 05" }
    ]);
    setLoading(false);
  }, []);

  const copy = (num, key) => {
    navigator.clipboard.writeText(num).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  // Icônes SVG (reste identique)
  const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 1 1-2-2V4a2 2 0 0 1 2-2h5" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  // Rendu JSX (exemple simple, adapte selon ton design)
  if (loading) return <div className="text-white p-4">Chargement...</div>;

  return (
    <div className="fixed inset-0 bg-[#0a0f2e] flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center">
        <button onClick={onBack} className="text-blue-400 text-xl mr-4">←</button>
        <h2 className="text-white font-bold text-lg">Peyman & Aktivasyon</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-blue-300 text-sm mb-2">Konfime Pêman sou WhatsApp</p>
        {payments.map((p, idx) => (
          <div key={idx} className="bg-[#0f1e4a] rounded-2xl p-4 border border-[#3b82f655]">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">{p.method}</span>
              <button
                onClick={() => copy(p.number, idx)}
                className="text-blue-400 flex items-center gap-1"
              >
                {copied === idx ? <CheckIcon /> : <CopyIcon />}
                <span className="text-xs">{copied === idx ? "Kopye!" : "Kopye"}</span>
              </button>
            </div>
            <p className="text-gray-300 text-sm mt-1 font-mono">{p.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PaymentScreen;
