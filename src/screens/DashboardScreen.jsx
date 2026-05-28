import { callEdge, parseApiError } from "../api";
import { useState, useEffect, useRef } from "react";

const generateAndSharePDF = async (school, stats) => {
  try {
  const date = new Date().toLocaleDateString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const time = new Date().toLocaleTimeString("fr-HT", { timeZone: "America/Port-au-Prince" });
  const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210, M = 14;
  let y = 0, page = 1;

  // ── Utilitaires ──────────────────────────────────────────────────────
  const newPage = () => {
    doc.setFontSize(8); doc.setTextColor(120,120,160);
    doc.text(`Page ${page}`, W - M, 290, { align: "right" });
    doc.addPage(); page++; y = 20;
  };
  const check = (h = 8) => { if (y + h > 278) newPage(); };
  const txt = (text, x, fontSize = 10, bold = false, color = [30,30,60], align = "left") => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    doc.text(String(text), x, y, { align });
  };
  const line = (text, fontSize = 10, bold = false, color = [30,30,60]) => {
    check(fontSize * 0.5 + 3);
    doc.setFontSize(fontSize); doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - M * 2);
    lines.forEach(l => { doc.text(l, M, y); y += fontSize * 0.45; });
    y += 2;
  };
  const sep = (color = [37,99,235]) => {
    check(6);
    doc.setDrawColor(...color); doc.setLineWidth(0.4);
    doc.line(M, y, W - M, y); y += 5;
  };
  const sectionTitle = (title, color = [37,99,235]) => {
    check(14);
    doc.setFillColor(...color);
    doc.rect(M, y - 4, W - M * 2, 9, "F");
    doc.setFontSize(11); doc.setFont("helvetica", "bold");
    doc.setTextColor(255,255,255);
    doc.text(title, M + 3, y + 2);
    y += 9;
  };
  const kv = (label, value, labelColor = [80,100,160], valColor = [220,0,42]) => {
    check(7);
    txt(label + ":", M, 10, false, labelColor);
    txt(value, W - M, 10, true, valColor, "right");
    y += 6;
  };
  const bar = (pct, color = [37,99,235]) => {
    const bW = W - M * 2;
    doc.setFillColor(240,240,245); doc.rect(M, y, bW, 4, "F");
    const r = Math.round(color[0]), g = Math.round(color[1]), b = Math.round(color[2]);
    doc.setFillColor(r,g,b); doc.rect(M, y, bW * Math.min(pct,1), 4, "F");
    y += 7;
  };

  // ── EN-TÊTE ──────────────────────────────────────────────────────────
  doc.setFillColor(10,15,46);
  doc.rect(0, 0, W, 38, "F");
  doc.setFontSize(20); doc.setFont("helvetica","bold");
  doc.setTextColor(255,255,255);
  doc.text("RAPÒ OFISYÈL — GID NS4", W/2, 14, { align:"center" });
  doc.setFontSize(12); doc.setFont("helvetica","normal");
  doc.text(school.name || "", W/2, 23, { align:"center" });
  doc.setFontSize(9); doc.setTextColor(147,197,253);
  doc.text(`${date}  •  ${time}`, W/2, 30, { align:"center" });
  doc.setFontSize(8); doc.setTextColor(100,140,220);
  doc.text(`Kòd: ${school.code || "—"}`, W/2, 36, { align:"center" });
  y = 48;

  // ── 1. INFO ÉCOLE ────────────────────────────────────────────────────
  sectionTitle("1. ENFÒMASYON LEKÒL LA", [10,15,46]);
  y += 2;
  kv("Non lekòl", school.name || "—");
  kv("Kòd aksè", school.code || "—");
  kv("Jou ki rete", `${school.daysRemaining ?? "—"} jou`);
  kv("Rekèt pa jou", `${school.dailyScans ?? "—"} max`);
  kv("Elèv maksimòm", `${school.maxStudents ?? "—"}`);
  kv("Matyè disponib", `${school.subjects?.length ?? 0}`);
  y += 3;

  // ── 2. REZIME JENERAL ────────────────────────────────────────────────
  sectionTitle("2. REZIME JENERAL", [37,99,235]);
  y += 2;
  const totalScans = stats.totalScans ?? 0;
  const imgScans   = stats.imageScans ?? 0;
  const txtScans   = stats.textScans  ?? 0;
  const imgPct     = totalScans > 0 ? Math.round((imgScans/totalScans)*100) : 0;
  const txtPct     = totalScans > 0 ? Math.round((txtScans/totalScans)*100) : 0;
  const utilPct    = (school.dailyScans && stats.scansToday)
    ? Math.min(stats.scansToday / school.dailyScans, 1) : 0;

  kv("Total Rekèt", String(totalScans));
  kv("Elèv Aktif", `${stats.totalStudents ?? 0} / ${school.maxStudents ?? "?"}`);
  kv("Rekèt Jodi a", String(stats.scansToday ?? 0));
  kv("Scan Imaj", `${imgScans}  (${imgPct}%)`);
  kv("Scan Tèks", `${txtScans}  (${txtPct}%)`);

  check(10);
  line("Taux itilizasyon jodi a:", 9, false, [80,100,160]);
  bar(utilPct, [37,99,235]);
  y += 2;

  // ── 3. TOUT MATYÈ ────────────────────────────────────────────────────
  sectionTitle("3. TOUT MATYÈ SCANNÉES", [67,56,202]);
  y += 2;
  const entries = Object.entries(stats.subjectBreakdown || {}).sort((a,b) => b[1]-a[1]);
  const maxCount = Math.max(...entries.map(e=>e[1]), 1);
  const barColors = [
    [34,197,94],[59,130,246],[245,158,11],[168,85,247],[236,72,153],
    [20,184,166],[249,115,22],[239,68,68],[99,102,241],[16,185,129],
  ];
  if (entries.length === 0) {
    line("Pa gen done disponib.", 9, false, [120,120,160]);
  } else {
    entries.forEach(([sub, count], i) => {
      check(14);
      const pct = count / maxCount;
      const col = barColors[i % barColors.length];
      doc.setFontSize(9); doc.setFont("helvetica","normal");
      doc.setTextColor(...col);
      doc.text(`${i+1}. ${sub}`, M, y);
      doc.setFont("helvetica","bold");
      doc.text(`${count} rekèt`, W-M, y, { align:"right" });
      y += 5;
      bar(pct, col);
    });
  }
  y += 2;

// ── 4. AKTIVITE PA SEMÈN ─────────────────────────────────────────────
  sectionTitle("4. AKTIVITE PA SEMÈN", [168,85,247]);
  y += 2;
  const weeks = Object.entries(stats.weeklyActivity || {}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-8);
  const maxWeek = Math.max(...weeks.map(w=>w[1]),1);
  if (weeks.length === 0) {
    line("Pa gen done semèn.", 9, false, [120,120,160]);
  } else {
    weeks.forEach(([week, count]) => {
      check(12);
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(168,85,247);
      doc.text(week, M, y);
      doc.setFont("helvetica","bold"); doc.setTextColor(220,0,42);
      doc.text(`${count}`, W-M, y, { align:"right" });
      y += 4;
      bar(count/maxWeek, [168,85,247]);
    });
  }
  y += 2;

  // ── 5. AKTIVITE 7 DÈNYE JOU ──────────────────────────────────────────
  sectionTitle("5. AKTIVITE 7 DÈNYE JOU", [14,116,144]);
  y += 2;
  const days = Object.entries(stats.dailyActivity || {}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-7);
  const maxDay = Math.max(...days.map(d=>d[1]),1);
  if (days.length === 0) {
    line("Pa gen done aktivite.", 9, false, [120,120,160]);
  } else {
    days.forEach(([day, count]) => {
      check(12);
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80,120,200);
      doc.text(day, M, y);
      doc.setFont("helvetica","bold"); doc.setTextColor(220,0,42);
      doc.text(`${count}`, W-M, y, { align:"right" });
      y += 4;
      bar(count/maxDay, [37,99,235]);
    });
  }
  y += 2;

  // ── 6. QUIZ — PÈFÒMANS PA MATYÈ ─────────────────────────────────────
  sectionTitle("6. PÈFÒMANS QUIZ PA MATYÈ", [168,85,247]);
  y += 2;
  const quizBySubject = stats.quizStats?.bySubject || [];
  if (quizBySubject.length === 0) {
    line("Pa gen done quiz pa matyè ankò.", 9, false, [120,120,160]);
  } else {
    quizBySubject.sort((a,b) => b.avg - a.avg).forEach((q, i) => {
      check(12);
      const col = barColors[i % barColors.length];
      doc.setFontSize(9); doc.setFont("helvetica","normal"); doc.setTextColor(80,100,160);
      doc.text(`${q.subject}`, M, y);
      doc.setFont("helvetica","bold"); doc.setTextColor(col[0],col[1],col[2]);
      doc.text(`${q.avg}/20  (${q.count} quiz)`, W-M, y, { align:"right" });
      y += 4;
      bar(q.avg/20, col);
    });
  }
  kv("Mwayèn jeneral", `${stats.quizStats?.avgNote ?? "—"}/20`);
  kv("Total quiz", String(stats.quizStats?.totalQuizzes ?? 0));
  y += 2;

  // ── 7. TOP 10 ELÈV QUIZ ──────────────────────────────────────────────
  sectionTitle("7. TOP 10 ELÈV QUIZ", [245,158,11]);
  y += 2;
  const top = (stats.quizStats?.topStudents || []).slice(0,10);
  if (top.length === 0) {
    line("Pa gen done elèv ankò.", 9, false, [120,120,160]);
  } else {
    top.forEach((s, i) => {
      check(7);
      const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`;
      doc.setFontSize(9);
      doc.setFont("helvetica", i < 3 ? "bold" : "normal");
      doc.setTextColor(i<3?[245,158,11][0]:80, i<3?[245,158,11][1]:100, i<3?[245,158,11][2]:160);
      doc.text(`${medal} ${s.name}`, M, y);
      doc.setFont("helvetica","bold"); doc.setTextColor(34,197,94);
      doc.text(`${s.avg}/20  (${s.count} quiz)`, W-M, y, { align:"right" });
      y += 7;
    });
  }
  y += 2;

  // ── 8. REKÒMANDASYON ─────────────────────────────────────────────────
  sectionTitle("8. REKÒMANDASYON", [220,0,42]);
  y += 2;
  const weak = stats.quizStats?.weakSubject;
  const best = stats.quizStats?.topStudents?.[0];
  if (weak) {
    line(`⚠ Matyè ki bezwen plis atansyon: ${weak.subject} (moy. ${weak.avg}/20)`, 10, true, [220,0,42]);
    line("Elèv yo dwe konsacre plis tan sou matyè sa a.", 9, false, [80,80,80]);
    y += 2;
  }
  if (best) {
    line(`★ Pi bon elèv: ${best.name} — ${best.avg}/20 (${best.count} quiz)`, 10, true, [34,197,94]);
    y += 2;
  }
  if (utilPct >= 0.9) {
    line("📈 Quota jounalye prèske atenn — konsidere ogmante limit la.", 9, false, [245,158,11]);
    y += 2;
  }
  if (!weak && !best) {
    line("Pa gen done sifizan pou yon rekòmandasyon.", 9, false, [120,120,160]);
  }

  // ── PIED DE PAGE DERNIÈRE PAGE ────────────────────────────────────────
  doc.setFontSize(8); doc.setTextColor(120,120,160);
  doc.text(`Page ${page}`, W - M, 290, { align: "right" });
  doc.setFillColor(10,15,46);
  doc.rect(0, 284, W, 13, "F");
  doc.setFontSize(8); doc.setTextColor(147,197,253);
  doc.text("Pwodwi ak Gid NS4  •  Prof Lakay  •  Konfidansyèl", W/2, 292, { align:"center" });

    const pdfBlob = doc.output("blob");
    const fileName = `rapport-${school.name}-${date}.pdf`;
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Rapò Gid NS4", text: `Rapò ofisyèl — ${school.name}` });
    } else {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    alert('Enposib jenere PDF la. Verifye koneksyon entènèt ou (jsPDF bezwen entènèt premye fwa).');
  }
};


export function DashboardScreen({ onBack, userCode }) {
  const [dirCode, setDirCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const _dirKey = `gid_dir_v3_${userCode}`;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null); // init done in useEffect

  const FREEMIUM_DEMO = {
    school: { school_name: "Lekòl Demo — Gid NS4", code: "FREEMIUM", active: true, expires_at: new Date(Date.now()+3*86400000).toISOString(), daily_scans: 3, max_students: 30, subjects: ["Biologie","Chimie","Physique","Histoire","Géographie","Mathématiques","Créole","Français","Anglais","Géologie","Économie","Philosophie"] },
    stats: {
      totalStudents: 28, totalScans: 312, scansToday: 14, imageScans: 87, textScans: 225,
      subjectBreakdown: {"Biologie":98,"Chimie":74,"Physique":61,"Mathématiques":55,"Histoire":42},
      dailyData: [["Lun",40],["Mar",55],["Mer",38],["Jeu",62],["Ven",70],["Sam",30],["Dim",17]].map(([d,v])=>({date:d,count:v})),
      weeklyData: [["S1",180],["S2",220],["S3",195],["S4",310]].map(([w,v])=>({week:w,count:v})),
      recentScans: [{name:"Marie J.",subject:"Biologie",created_at:new Date().toISOString()},{name:"Jean P.",subject:"Chimie",created_at:new Date().toISOString()},{name:"Rose M.",subject:"Physique",created_at:new Date().toISOString()}],
      quizData: [{subject:"Biologie",avg_note:16.4,count:45},{subject:"Chimie",avg_note:14.2,count:32}],
    },
  };


const hasFetched = useRef(false);

useEffect(() => {
  if (userCode === "FREEMIUM") {
    setStats(FREEMIUM_DEMO);
    setAuthorized(true);
    return;
  }

  // Cache window — vérifié à chaque remount
const _winKey = `_gns4_dash_${userCode}`;
if (window[_winKey]) {
  const _cached = window[_winKey];
  const _days = _cached?.school?.daysRemaining ?? _cached?.daysRemaining ?? 1;
  if (_days > 0) {
    setStats(_cached);
    setAuthorized(true);
    return;
  }
  delete window[_winKey]; // cache expiré → forcer un nouvel appel
}

  // Guard anti-double-appel (StrictMode)
  if (hasFetched.current) return;
  hasFetched.current = true;

  const saved = localStorage.getItem(_dirKey);
  if (!saved) return;
  const parsed = JSON.parse(saved);
  const { directorCode: _enc } = parsed._auth || {};
  let directorCode; try { directorCode = _enc ? atob(_enc) : undefined; } catch { directorCode = _enc; }
  if (!directorCode) return;

  setLoading(true);
  callEdge({ action: "dashboard", schoolCode: userCode, directorCode })
    .then(result => {
      const full = { ...result, _auth: { directorCode } };
      setStats(full);
      setAuthorized(true);
      localStorage.setItem(_dirKey, JSON.stringify(full));
      window[`_gns4_dash_${userCode}`] = full;
    })
    .catch(() => {
      setStats(parsed);
      setAuthorized(true);
    })
    .finally(() => setLoading(false));
}, []);

  const getDeviceId = () => {
    const key = "gid_device_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now());
      localStorage.setItem(key, id);
    }
    return id;
  };
  const handleAuth = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await callEdge({ action: "dashboard", schoolCode: userCode, directorCode: dirCode.trim(), deviceId: getDeviceId() });
      setStats(result);
      setAuthorized(true);
      const fullData = { ...result, _auth: { directorCode: btoa(dirCode.trim()) } };
      localStorage.setItem(_dirKey, JSON.stringify(fullData));
      window[`_gns4_dash_${userCode}`] = fullData;
    } catch (e) {
      setError(parseApiError(e).message);
    }
    setLoading(false);
  };

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
  );

  const SearchIcon = ({ color }) => (
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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );

  if (!authorized) {
    return (
      <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
        <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
          <button onClick={onBack} className="text-blue-400 text-xl">←</button>
          <button
  onClick={async () => {
    setLoading(true);
    try {
      const saved = localStorage.getItem(_dirKey);
      const { _auth } = JSON.parse(saved);
      let directorCode; try { directorCode = atob(_auth.directorCode); } catch { directorCode = _auth.directorCode; }
      const result = await callEdge({ action: "dashboard", schoolCode: userCode, directorCode });
      const full = { ...result, _auth };
      setStats(full);
      localStorage.setItem(_dirKey, JSON.stringify(full));
      window[`_gns4_dash_${userCode}`] = full;
    } catch {}
    setLoading(false);
  }}
  disabled={loading}
  style={{ padding:"6px 12px", borderRadius:12, fontSize:13, fontWeight:700,
    display:"flex", alignItems:"center", gap:5, cursor:"pointer",
    background:"#1e3a8a22", color:"#60a5fa", border:"1px solid #3b82f633" }}>
  {loading
    ? <LoaderIcon/>
    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
  }
  Refresh
       </button>  
        <h2 className="text-white font-bold">Dashboard Direction</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <LockIcon />
          <h3 className="text-white font-bold text-xl mt-4 mb-2">Aksè Direksyon Sèlman</h3>
          <p className="text-blue-400 text-sm text-center mb-6">Antre kòd espesyal direktè a pou wè rapò a</p>
          <input
            type="text"
            value={dirCode}
            onChange={e => setDirCode(e.target.value.toUpperCase())}
            placeholder="Kòd Direktè"
            className="w-full max-w-xs rounded-xl px-4 py-3.5 text-white placeholder-blue-800 font-mono font-bold outline-none tracking-widest mb-3"
            style={{ background: "#ffffff0d", border: "1.5px solid #ffffff18" }}
          />
          {error && (
            <p className="text-red-400 text-sm mb-3 flex items-center gap-2">
              <AlertIcon /> {error}
            </p>
          )}
          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full max-w-xs py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
            style={{ background: loading ? "#333" : "linear-gradient(135deg,#1a4fd6,#2563eb)" }}
          >
            {loading ? <><LoaderIcon /> Verifikasyon...</> : "Valide"}
          </button>
        </div>
      </div>
    );
  }

  if (!stats?.school || !stats?.stats) return null;
  const { school, stats: s } = stats;
  const subjectEntries = Object.entries(s.subjectBreakdown || {}).sort((a, b) => b[1] - a[1]);
  const maxScans = Math.max(...subjectEntries.map(e => e[1]), 1);
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899", "#14b8a6", "#f97316"];

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: "linear-gradient(145deg,#04081A,#080E24)" }}>
      <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "#ffffff10" }}>
        <button onClick={onBack} className="text-blue-400 text-xl">←</button>
        <div className="flex-1">
          <h2 className="text-white font-bold">Dashboard</h2>
          <p className="text-blue-400 text-xs">{school.name}</p>
        </div>
        <button
          onClick={() => generateAndSharePDF(school, s)}
          className="px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#d4002a,#ff6b35)" }}
        >
          <FileIcon /> PDF
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(_dirKey);
            setAuthorized(false);
            setStats(null);
          }}
          style={{
            background: "rgba(212,0,42,0.12)",
            border: "1px solid rgba(212,0,42,0.35)",
            borderRadius: "12px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            transition: "all 0.2s",
            color: "#ff8080",
            fontSize: 12,
            fontWeight: 600,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(212,0,42,0.25)";
            e.currentTarget.style.borderColor = "rgba(212,0,42,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(212,0,42,0.12)";
            e.currentTarget.style.borderColor = "rgba(212,0,42,0.35)";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff8080" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div
          className="rounded-2xl px-4 py-3 flex justify-between items-center"
          style={{
            background: school.daysRemaining <= 7 ? "#d4002a22" : "#14532d22",
            border: `1px solid ${school.daysRemaining <= 7 ? "#d4002a44" : "#22c55e33"}`,
          }}
        >
          <div>
            <div className="font-bold text-sm flex items-center gap-2" style={{ color: school.daysRemaining <= 7 ? "#ff8080" : "#86efac" }}>
              {school.daysRemaining <= 0 ? (
                <><span style={{ color: "#ef4444" }}>●</span> Kòd Ekspire</>
              ) : school.daysRemaining <= 7 ? (
                <><span style={{ color: "#f59e0b" }}>●</span> Ekspire byento</>
              ) : (
                <><CheckIcon color="#86efac" /> Kòd Aktif</>
              )}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "#93c5fd" }}>
              {school.daysRemaining} jou ki rete • {school.dailyScans} rekèt/jou • max {school.maxStudents} elèv
            </div>
          </div>
        </div>

{(() => {
  const used = s.scansToday ?? 0;
  const max = school.dailyScans ?? 1;
  const pct = Math.min(Math.round((used/max)*100), 100);
  const col = pct>=90?"#ef4444":pct>=70?"#f59e0b":"#22c55e";
  return (
    <div className="rounded-2xl p-4" style={{background:"#ffffff08",border:`1px solid ${col}33`}}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white font-bold text-sm">Quota Jodi a</span>
        <span className="font-bold text-sm" style={{color:col}}>{used}/{max} rekèt</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{background:"#ffffff10"}}>
        <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:col}}/>
      </div>
      <p className="text-xs mt-2" style={{color:col}}>
        {pct>=90?"⚠ Limit prèske atenn !":pct>=70?"📈 Itilizasyon wo":"✅ Nòmal"}
        {" • "}{100-pct}% disponib
      </p>
    </div>
  );
})()}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Requêtes Totales", val: s.totalScans, Icon: SearchIcon, color: "#3b82f6" },
            { label: "Élèves Actifs", val: s.totalStudents, Icon: UsersIcon, color: "#22c55e" },
            { label: "Requêtes d'aujourd'hui", val: s.scansToday, Icon: CalendarIcon, color: "#f59e0b" },
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
            <BookIcon color="#a855f7" /> Matières
          </h3>
          <div className="flex flex-wrap gap-2">
            {school.subjects.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: colors[i % colors.length] + "33",
                  color: colors[i % colors.length],
                  border: `1px solid ${colors[i % colors.length]}44`,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {subjectEntries.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <ChartIcon /> Matières les plus sollicitées
            </h3>
            <div className="space-y-3">
              {subjectEntries.map(([sub, count], i) => (
                <div key={sub}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200">{sub}</span>
                    <span className="text-blue-400 font-bold">{count} requête{count > 1 ? "s" : ""}</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#ffffff10" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(count / maxScans) * 100}%`, background: colors[i % colors.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{s.quizStats?.bySubject?.length > 0 && (
  <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
      <ChartIcon /> Pèfòmans Quiz pa Matyè
    </h3>
    <p className="text-blue-400 text-xs mb-4">Mwayèn sou 20 • Nòmb quiz</p>
    <div className="space-y-3">
      {[...s.quizStats.bySubject].sort((a,b)=>b.avg-a.avg).map((q,i)=>{
        const pct = Math.round((q.avg/20)*100);
        const col = pct>=70?"#22c55e":pct>=50?"#f59e0b":"#ef4444";
        return (
          <div key={q.subject}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-200">{q.subject}</span>
              <span className="font-bold" style={{color:col}}>{q.avg}/20 <span className="text-blue-400 font-normal">({q.count} quiz)</span></span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{background:"#ffffff10"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:col}}/>
            </div>
          </div>
        );
      })}
    </div>
    <div className="mt-4 pt-3 flex justify-between text-xs" style={{borderTop:"1px solid #ffffff10"}}>
      <span className="text-blue-400">Mwayèn jeneral</span>
      <span className="font-bold text-white">{s.quizStats.avgNote ?? "—"}/20</span>
    </div>
    {s.quizStats.weakSubject && (
      <div className="mt-3 px-3 py-2 rounded-xl text-xs" style={{background:"#d4002a15",border:"1px solid #d4002a33",color:"#fca5a5"}}>
        ⚠ Matyè ki pi fèb : <span className="font-bold">{s.quizStats.weakSubject.subject}</span> — {s.quizStats.weakSubject.avg}/20
      </div>
    )}
  </div>
)}
{Object.keys(s.weeklyActivity||{}).length > 0 && (
  <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
      <ChartIcon /> Aktivite pa Semèn
    </h3>
    <p className="text-blue-400 text-xs mb-4">Nòmb rekèt pa semèn</p>
    <div className="space-y-2">
      {Object.entries(s.weeklyActivity).sort((a,b)=>a[0].localeCompare(b[0])).slice(-8).map(([week,count])=>{
        const max = Math.max(...Object.values(s.weeklyActivity),1);
        const pct = Math.round((count/max)*100);
        return (
          <div key={week}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-200">{week}</span>
              <span className="font-bold text-blue-400">{count} rekèt</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{background:"#ffffff10"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:"linear-gradient(90deg,#a855f7,#3b82f6)"}}/>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
{Object.keys(s.dailyActivity||{}).length > 0 && (
  <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
      <CalendarIcon color="#14b8a6" /> Aktivite 7 Dènye Jou
    </h3>
    <p className="text-blue-400 text-xs mb-4">Nòmb rekèt pa jou</p>
    <div className="space-y-2">
      {Object.entries(s.dailyActivity).sort((a,b)=>a[0].localeCompare(b[0])).slice(-7).map(([day,count])=>{
        const max = Math.max(...Object.values(s.dailyActivity),1);
        const pct = Math.round((count/max)*100);
        return (
          <div key={day}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-200">{day}</span>
              <span className="font-bold text-blue-400">{count} rekèt</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{background:"#ffffff10"}}>
              <div className="h-full rounded-full transition-all" style={{width:`${pct}%`,background:"linear-gradient(90deg,#14b8a6,#3b82f6)"}}/>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}
{s.quizStats?.topStudents?.length > 0 && (
  <div className="rounded-2xl p-5" style={{ background: "#ffffff08", border: "1px solid #ffffff10" }}>
    <h3 className="text-white font-bold mb-1 flex items-center gap-2">
      <UsersIcon color="#f59e0b" /> Top 10 Elèv
    </h3>
    <p className="text-blue-400 text-xs mb-4">Klase pa mwayèn quiz</p>
    <div className="space-y-2">
      {s.quizStats.topStudents.slice(0,10).map((st,i)=>{
        const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`;
        const pct = Math.round((st.avg/20)*100);
        const col = pct>=70?"#22c55e":pct>=50?"#f59e0b":"#ef4444";
        return (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{background:"#ffffff06",border:"1px solid #ffffff08"}}>
            <span className="text-base w-6 text-center">{medal}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{st.name}</p>
              <p className="text-blue-400 text-xs">{st.count} egzèsis/quiz</p>
            </div>
            <span className="font-bold text-sm" style={{color:col}}>{st.avg}/20</span>
          </div>
        );
      })}
    </div>
  </div>
)}
        <button
          onClick={() => generateAndSharePDF(school, s)}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 16px rgba(37,211,102,0.3)" }}
        >
          <WhatsAppIcon /> Telechaje PDF
        </button>
      </div>
    </div>
  );
}

export default DashboardScreen;
