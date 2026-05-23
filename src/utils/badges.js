// ─── utils/badges.js ─────────────────────────────────────────────────────────
// Badges partagés entre MenuScreen et ProgressScreen

export const BADGES = [
  // ── Activité ──
  { id:"first_scan",    svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',            label:"Premye Kesyon",  color:"#fbbf24", desc:"1e rekèt voye"       },
  { id:"first_quiz",    svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',        label:"Premye Quiz",    color:"#f59e0b", desc:"1e quiz fini"        },
  { id:"perfect",       svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>',label:"Pafè 20/20",    color:"#fbbf24", desc:"20/20 nan yon matye"  },
  { id:"master",        svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',            label:"Kòrèk",           color:"#a855f7", desc:"3 matye ak 20/20"    },
  // ── Quiz ──
  { id:"quiz_10",       svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>',label:"Entèlektyèl",   color:"#3b82f6", desc:"10 quiz fini"         },
  { id:"quiz_50",       svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',                                   label:"Enpresyonan",    color:"#6366f1", desc:"50 quiz fini"         },
  // ── Exercices ──
  { id:"first_exo",     svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',label:"Pratisyen",     color:"#34d399", desc:"1e egzèsis fini"     },
  { id:"exo_10",        svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',               label:"Pèseveran",         color:"#10b981", desc:"10 egzèsis fini"     },
  // ── Couverture ──
  { id:"cover_25",      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',                             label:"Eksploratè",     color:"#f97316", desc:"25% matye eseye"     },
  { id:"cover_50",      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',                                                                  label:"Mèt",      color:"#ef4444", desc:"50% matye eseye"     },
  { id:"cover_100",     svg:'<svg viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',                                   label:"Konplè",         color:"#fbbf24", desc:"100% matye eseye"   },
  // ── Excellence ──
  { id:"avg_16",        svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',                 label:"Ekselan",        color:"#22c55e", desc:"Mwayèn >= 16/20"    },
  { id:"streak_5",      svg:'<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',                                                                                label:"Ekspè",       color:"#f59e0b", desc:"5 fwa 16+ nan yon matye" },
];

export function computeBadges({ grades, exoCount, allSubjectsCount }) {
  const unlocked = new Set();
  try {
    const allGrades  = Object.values(grades).flat();
    const subjects   = Object.keys(grades);
    const perfect    = allGrades.filter(g => g.note20 >= 20).length;
    const subjects20 = subjects.filter(k => grades[k].some(e => e.note20 >= 20));
    const avg        = subjects.length ? allGrades.reduce((a,b) => a + b.note20, 0) / allGrades.length : 0;
    const maxStreak  = Math.max(0, ...subjects.map(k => grades[k].filter(e => e.note20 >= 16).length));
    const coverage   = subjects.length / allSubjectsCount;
    const today      = new Date().toLocaleDateString("fr-HT", { timeZone:"America/Port-au-Prince" });
    const imgUsed    = parseInt(localStorage.getItem(`gid_img_undefined_${today}`) || "0");
    const txtUsed    = parseInt(localStorage.getItem(`gid_txt_undefined_${today}`) || "0");

    if (imgUsed + txtUsed >= 1 || allGrades.length >= 1) unlocked.add("first_scan");
    if (allGrades.length >= 1)   unlocked.add("first_quiz");
    if (perfect >= 1)            unlocked.add("perfect");
    if (subjects20.length >= 3)  unlocked.add("master");
    if (allGrades.length >= 10)  unlocked.add("quiz_10");
    if (allGrades.length >= 50)  unlocked.add("quiz_50");
    if (exoCount >= 1)           unlocked.add("first_exo");
    if (exoCount >= 10)          unlocked.add("exo_10");
    if (coverage >= 0.25)        unlocked.add("cover_25");
    if (coverage >= 0.50)        unlocked.add("cover_50");
    if (coverage >= 1.00)        unlocked.add("cover_100");
    if (avg >= 16)               unlocked.add("avg_16");
    if (maxStreak >= 5)          unlocked.add("streak_5");
  } catch {}
  return BADGES.map(b => ({ ...b, unlocked: unlocked.has(b.id) }));
}
