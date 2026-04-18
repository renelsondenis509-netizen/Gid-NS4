import { BottomNav } from "../components/UI";

export function PartnerScreen({ onBack, onNavigate }) {
  // ─── SVG ICONS (Components) ──────────────────────────────────────────────
  const SchoolIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <path d="M3 21h18M5 21v-7l8-4 8 4v7M9 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M10 21v-2h4v2" />
    </svg>
  );

  const KeyIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#22c55e" }}>
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  );

  const SlidersIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );

  const UsersIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#3b82f6" }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const BookOpenIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ef4444" }}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );

  const TrophyIcon = () => (    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );

  const ShieldLockIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#eab308" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M12 15v-2" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  // ─── AVANTAGES PARTENARIAT ───────────────────────────────────────────────
  const benefits = [
    { icon: <KeyIcon />, title: "Kòd lekòl pèsonalize", desc: "Chak elèv resevwa yon kòd inik pou gen aksè" },
    { icon: <SlidersIcon />, title: "Kontwòl total", desc: "Tout matyè yo disponib ak dire abònman" },
    { icon: <UsersIcon />, title: "Jiska 500 elèv", desc: "Jere tout klas nan yon sèl tablodbò" },
    { icon: <BookOpenIcon />, title: "Tout matyè NS4 yo", desc: "Sipò konplè pou program Ministè a" },
    { icon: <TrophyIcon />, title: "Rapò detaye", desc: "Swiv pwogrè elèv yo an tan reyèl" },
    { icon: <ShieldLockIcon />, title: "Done pwoteje", desc: "Chifreman ak konfòmite done elèv yo" },
  ];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <h2 className="text-white font-bold text-lg">Vin Patnè</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        {/* En-tête */}
        <div className="text-center py-4">
          <SchoolIcon />
          <h3 className="text-white font-bold text-xl mt-4">Rejwenn Gid-NS4</h3>
          <p className="text-blue-400 text-sm mt-2">Ofri yon asistan IA pwofesyonèl a tout elèv ou yo 24/24, 7/7</p>
        </div>

        {/* Avantages */}        <div className="space-y-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
              <div style={{ flexShrink: 0 }}>{b.icon}</div>
              <div>
                <div className="text-white font-semibold text-sm">{b.title}</div>
                <div className="text-blue-400 text-xs mt-1">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA WhatsApp */}
        <button onClick={() => window.open("https://wa.me/50900000000?text=Bonjou,%20mwen%20represente%20yon%20lekòl%20e%20mwen%20vle%20vin%20patnè%20Gid-NS4.", "_blank")}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <WhatsAppIcon /> Kontakte nou sou WhatsApp
        </button>

        {/* Note légale */}
        <p className="text-blue-800 text-xs text-center px-4">
          * Kontakte dirèkteman responsab yo pou jwenn yon abònman.
        </p>
      </div>
      <BottomNav active="menu" onNavigate={onNavigate} />
    </div>
  );
}

export default PartnerScreen;
