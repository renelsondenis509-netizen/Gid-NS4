import { useState, useEffect } from "react";
import { callEdge } from "../api";

export function PaymentScreen({ onBack }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-[#0a0f2e] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 border-b border-white/10 flex items-center gap-3">
        <button onClick={onBack} className="text-blue-400 text-2xl">←</button>
        <h1 className="text-white text-xl font-bold">Pêman & Aktivasyon</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {/* MonCash */}
        <div className="rounded-2xl bg-[#0f1e4a] border border-[#3b82f655] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="text-white font-bold">MonCash</p>
              <p className="text-blue-400 text-xs">Digicel Haiti</p>
            </div>
          </div>
          <p className="text-blue-300 text-sm mt-2">Nimewo MonCash</p>
          <p className="text-white text-xl font-mono font-bold tracking-wider mt-1">50948695079</p>
          <button
            onClick={() => copyToClipboard("50948695079", "moncash")}
            className="flex items-center gap-2 text-blue-400 text-sm mt-3"
          >
            {copied === "moncash" ? <CheckIcon /> : <CopyIcon />}
            <span>{copied === "moncash" ? "Kopye !" : "Kopye Nimewo a"}</span>
          </button>
          <p className="text-emerald-400 text-xs mt-3">✓ Aktivasyon garanti an mwens 30 minit</p>
        </div>

        {/* NatCash */}
        <div className="rounded-2xl bg-[#0f1e4a] border border-[#3b82f655] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white font-bold">N</div>
            <div>
              <p className="text-white font-bold">NatCash</p>
              <p className="text-blue-400 text-xs">Natcom Haiti</p>
            </div>
          </div>
          <p className="text-blue-300 text-sm mt-2">Nimewo NatCash</p>
          <p className="text-white text-xl font-mono font-bold tracking-wider mt-1">50940669105</p>
          <button
            onClick={() => copyToClipboard("50940669105", "natcash")}
            className="flex items-center gap-2 text-blue-400 text-sm mt-3"
          >
            {copied === "natcash" ? <CheckIcon /> : <CopyIcon />}
            <span>{copied === "natcash" ? "Kopye !" : "Kopye Nimewo a"}</span>
          </button>
          <p className="text-emerald-400 text-xs mt-3">✓ Aktivasyon garanti an mwens 30 minit</p>
        </div>

        {/* Bouton WhatsApp */}
        <a
          href="https://wa.me/50948695079?text=Bonjour%2C%20je%20souhaite%20activer%20mon%20compte%20Gid%20NS4"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-4 rounded-xl text-center font-bold bg-gradient-to-r from-green-600 to-green-500 text-white mt-4"
        >
          Konfime Pêman sou WhatsApp
        </a>
      </div>
    </div>
  );
}
export default PaymentScreen;
