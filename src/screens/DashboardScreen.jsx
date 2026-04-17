import { useState } from "react";
import { callEdge, parseApiError } from "../api";

// ─── FONCTION DE PARTAGE PDF / RAPPORT ─────────────────────────────────────
const generateAndSharePDF = async (school, stats) => {
  try {
    // Générer le contenu du rapport
    const report = `
📊 RAPÒ GID-NS4 — ${school.name}
🗓️ Dat: ${new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" })}

📈 REZIME:
• Total Scan: ${stats.totalScans}
• Elèv Aktif: ${stats.totalStudents}
• Scan Jodi a: ${stats.scansToday}
• Jou Rete: ${school.daysRemaining}
• Limit Scan/Jou: ${school.dailyScans}
• Max Elèv: ${school.maxStudents}

📚 MATYÈ POPILÈ:
${Object.entries(stats.subjectBreakdown || {})
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([sub, count]) => `• ${sub}: ${count} scan`)
  .join("\n") || "• Pa gen done ankò"}

🔐 Kòd lekòl: ${school.code?.slice(0, 4)}****
✨ Pwodwi ak Gid-NS4 • Prof Lakay
    `.trim();

    // Essayer l'API de partage native (mobile)
    if (navigator.share) {
      await navigator.share({
        title: `Rapò GID-NS4 — ${school.name}`,
        text: report,
      });
      return;
    }

    // Fallback : copier dans le presse-papiers
    await navigator.clipboard.writeText(report);
    alert("📋 Rapò a kopye! Kole l nan WhatsApp oubyen yon lòt app.");

  } catch (err) {
    console.warn("Partage échoué", err);
    // Dernier fallback : ouvrir WhatsApp avec le texte pré-rempli
    const text = encodeURIComponent(
      `Rapò GID-NS4 — ${school.name}\n\n` +
      `Total Scan: ${stats.totalScans}\n` +
      `Elèv Aktif: ${stats.totalStudents}\n` +      `Scan Jodi a: ${stats.scansToday}\n` +
      `Jou Rete: ${school.daysRemaining}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
};

function DashboardScreen({ onBack, userCode }) {
  const [dirCode, setDirCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleAuth = async () => {
    setLoading(true); setError("");
    try {
      const result = await callEdge({ action: "dashboard", schoolCode: userCode, directorCode: dirCode.trim() });
      setStats(result); setAuthorized(true);
    } catch (e) { setError(parseApiError(e).message); }
    setLoading(false);
  };

  // ─── SVG ICONS ───────────────────────────────────────────────────────────
  const LockIcon = () => (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
  const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
  const LoaderIcon = () => (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
  const FileIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );  const SearchIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
  const UsersIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  const CalendarIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
  const BookIcon = ({ color }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
  const ChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
  const CheckIcon = ({ color }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
  const WhatsAppIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );

  if (!authorized) return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>        <h2 className="text-white font-bold">Dashboard Direction</h2>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <LockIcon />
        <h3 className="text-white font-bold text-xl mt-4 mb-2">Aksè Direksyon Sèlman</h3>
        <p className="text-blue-400 text-sm text-center mb-6">Antre kòd espesyal direktè a pou wè rapò a</p>
        <input type="text" value={dirCode} onChange={e => setDirCode(e.target.value.toUpperCase())} placeholder="Kòd Direktè"
          className="w-full max-w-xs rounded-xl px-4 py-3.5 text-white placeholder-blue-800 font-mono font-bold outline-none tracking-widest mb-3"
          style={{ background: "#ffffff0d", border: "1.5px solid #ffffff18" }} />
        {error && (
          <p className="text-red-400 text-sm mb-3 flex items-center gap-2">
            <AlertIcon /> {error}
          </p>
        )}
        <button onClick={handleAuth} disabled={loading}
          className="w-full max-w-xs py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
          style={{ background: loading ? "#333" : "linear-gradient(135deg,#1a4fd6,#2563eb)" }}>
          {loading ? <><LoaderIcon /> Verifikasyon...</> : "Valide"}
        </button>
      </div>
    </div>
  );

  const { school, stats: s } = stats;
  const subjectEntries = Object.entries(s.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxScans = Math.max(...subjectEntries.map(e => e[1]), 1);
  const colors = ["#22c55e","#3b82f6","#f59e0b","#a855f7","#ec4899","#14b8a6","#f97316"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Dashboard</h2>
          <p className="text-blue-400 text-xs">{school.name}</p>
        </div>
        <button onClick={() => generateAndSharePDF(school, s)} className="px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 transition-transform" style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}>
          <FileIcon /> PDF
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-2xl px-4 py-3 flex justify-between items-center"
          style={{ background: school.daysRemaining <= 7 ? "#d4002a22" : "#14532d22", border: `1px solid ${school.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}` }}>
          <div>
            <div className="font-bold text-sm flex items-center gap-2" style={{ color: school.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {school.daysRemaining <= 0 ? (
                <><span style={{color:"#ef4444"}}>●</span> Kòd Ekspire</>
              ) : school.daysRemaining <= 7 ? (
                <><span style={{color:"#f59e0b"}}>●</span> Ekspire byento</>
              ) : (                <><CheckIcon color="#86efac" /> Kòd Aktif</>
              )}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              {school.daysRemaining} jou rete • {school.dailyScans} scan/jou • max {school.maxStudents} elèv
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Scan Total", val: s.totalScans, Icon: SearchIcon, color: "#3b82f6" },
            { label: "Élèves Actifs", val: s.totalStudents, Icon: UsersIcon, color: "#22c55e" },
            { label: "Scan d'aujourd'hui", val: s.scansToday, Icon: CalendarIcon, color: "#f59e0b" },
            { label: "Matières", val: school.subjects.length, Icon: BookIcon, color: "#a855f7" },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
              <item.Icon color={item.color} />
              <div className="font-black text-2xl mt-1" style={{ color: item.color }}>{item.val}</div>
              <div className="text-blue-400 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-4" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
          <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <BookIcon color="#a855f7" /> Matières Autorisées
          </h3>
          <div className="flex flex-wrap gap-2">
            {school.subjects.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: colors[i % colors.length] + "33", color: colors[i % colors.length], border: `1px solid ${colors[i % colors.length]}44` }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        {subjectEntries.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ChartIcon /> Matières les Plus Scannées
            </h3>
            <div className="space-y-3">
              {subjectEntries.map(([sub, count], i) => (
                <div key={sub}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200">{sub}</span>
                    <span className="text-blue-400 font-bold">{count} scan{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#ffffff10" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(count/maxScans)*100}%`, background: colors[i % colors.length] }} />
                  </div>                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => generateAndSharePDF(school, s)} className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}>
          <WhatsAppIcon /> Pataje Rapò PDF sou WhatsApp
        </button>
      </div>
    </div>
  );
}

export default DashboardScreen;
