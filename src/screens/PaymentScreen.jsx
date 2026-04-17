import { useState, useEffect } from "react";
import { callEdge } from "../api";

function PaymentScreen({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callEdge({ action: "get_payment_numbers" })
      .then(d => setPayments(d.payments || []))
      .catch(() => setPayments([{ method: "MonCash", number: "50948695079" }, { method: "NatCash", number: "50940669105" }]))
      .finally(() => setLoading(false));
  }, []);

  const copy = (num, key) => {
    navigator.clipboard?.writeText(num).catch(() => {});
    setCopied(key); setTimeout(() => setCopied(null), 2500);
  };

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  const LightningIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  const CreditCardIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#666" }}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />    </svg>
  );
  const cardStyle = {
    MonCash: { grad: "linear-gradient(135deg,#c0392b,#e74c3c)", icon: "https://i.postimg.cc/J4h15HZC/telechargement.jpg", sub: "Digicel Haiti" },
    NatCash: { grad: "linear-gradient(135deg,#e67e22,#f39c12)", icon: "https://i.postimg.cc/1zXmJhDn/file-00000000ae3c71f788921fb0d044db44.jpg", sub: "Natcom Haiti" },
  };

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold text-lg">Pèman & Aktivasyon</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex gap-2">{[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400" style={{ animation: `bounce 1s ${i*0.2}s infinite` }} />)}</div>
          </div>
        ) : payments.map(p => {
          const style = cardStyle[p.method] || { grad: "linear-gradient(135deg,#333,#555)", icon: null, sub: "" };
          return (
            <div key={p.method} className="rounded-3xl" style={{ background: style.grad }}>
              <div className="px-5 py-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center" style={{ overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    {style.icon ? (
                      <img 
                        src={style.icon} 
                        alt={p.method}
                        style={{ width: "70%", height: "70%", objectFit: "contain" }}
                      />
                    ) : (
                      <CreditCardIcon />
                    )}
                  </div>
                  <div><div className="text-white font-black text-xl">{p.method}</div><div className="text-white/70 text-xs">{style.sub}</div></div>
                </div>
                <div className="bg-white/15 rounded-2xl px-4 py-3 mb-4">
                  <div className="text-white/70 text-xs mb-1">Nimewo {p.method}</div>
                  <div className="text-white font-black text-2xl tracking-widest">{p.number}</div>
                </div>
                <button onClick={() => copy(p.number, p.method)}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{ 
                    background: copied === p.method ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.2)", 
                    border: "1px solid rgba(255,255,255,0.3)",
                    backdropFilter: "blur(8px)"
                  }}>
                  {copied === p.method ? (
                    <><CheckIcon /> Kopye !</>                  ) : (
                    <><CopyIcon /> Kopye Nimewo a</>
                  )}
                </button>
                <p className="text-white/60 text-xs text-center mt-3 flex items-center justify-center gap-1">
                  <LightningIcon /> Aktivasyon garanti an mwens 30 minit
                </p>
              </div>
            </div>
          );
        })}
        <button onClick={() => window.open("https://wa.me/50900000000?text=Bonjou%2C%20mwen%20vle%20aktive%20Gid%20NS4.", "_blank")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <WhatsAppIcon /> Konfime Pèman sou WhatsApp
        </button>
      </div>
    </div>
  );
}

export default PaymentScreen;
