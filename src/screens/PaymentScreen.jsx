export function PaymentScreen({ onBack }) {
  const InfoIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#60a5fa" }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );

  const SchoolIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold text-lg">Aktivasyon</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center text-center gap-5">
        <InfoIcon />

        <div>
          <h3 className="text-white font-bold text-lg mb-2">Aksè a ekspire oswa poko aktive</h3>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
            Pou kontinye itilize Gid NS4, ou bezwen yon kòd valid ki bay pa direksyon lekòl ou a.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-2xl p-5 flex items-start gap-3" style={{ background: "rgba(37,99,235,0.10)", border: "1px solid rgba(37,99,235,0.25)" }}>
          <SchoolIcon />
          <p className="text-blue-200 text-sm text-left leading-relaxed">
            Kontakte direksyon lekòl ou pou jwenn oswa renouvle kòd aksè a. Se lekòl la ki jere abònman an ak Gid NS4.
          </p>
        </div>

        <p className="text-white/40 text-xs max-w-xs mx-auto mt-2">
          Ou gen deja yon kòd ? Tounen nan ekran koneksyon an pou antre li.
        </p>
      </div>
    </div>
  );
}
export default PaymentScreen;
