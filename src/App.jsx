import React, { useState, useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { sessionSave, sessionLoad, sessionClear } from "./utils/helpers";
import { callEdge } from "./api";
import { getFreemiumStatus, hasAccess } from "./utils/freemium";
import { requestNotificationPermission, scheduleDailyReminder, scheduleExpiryReminder } from "./utils/notifications";
import { SplashScreen }      from "./screens/SplashScreen";
import { LoginScreen }       from "./screens/LoginScreen";
import { ChatScreen }        from "./screens/ChatScreen";
import { QuizScreen }        from "./screens/QuizScreen";
import { ExerciceScreen }    from "./screens/ExerciceScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { HistoryScreen }     from "./screens/HistoryScreen";
import { MenuScreen }        from "./screens/MenuScreen";
import { PaymentScreen }     from "./screens/PaymentScreen";
import { DashboardScreen }   from "./screens/DashboardScreen";
import { PartnerScreen }     from "./screens/PartnerScreen";
import { FavoritesScreen }   from "./screens/FavoritesScreen";
import AdminScreen       from "./screens/AdminScreen";
import { ProgressScreen }   from "./screens/ProgressScreen";
import { AboutScreen }      from "./screens/AboutScreen";
import { OfflineBanner }     from "./components/OfflineBanner";
import { idbGetPendingScores, idbDeletePendingScore } from "./utils/idb";

function enrichUser(u) {
  const { isFreemium, daysRemaining: freemiumDays } = getFreemiumStatus(u);
  const daysRemaining = isFreemium
    ? freemiumDays
    : u.expiresAt
      ? Math.ceil((new Date(u.expiresAt) - Date.now()) / 86_400_000)
      : (u.daysRemaining ?? 0);
  return { ...u, isFreemium, daysRemaining, freemiumExpiresAt: u.freemiumExpiresAt ?? null };
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error("ErrorBoundary:", error); this.setState({ hasError: false }); }
  render() { return this.props.children; }
}

export default function App() {
  const [screen,     setScreen]     = useState("splash");
  const [user,       setUser]       = useState(null);
  const [activeScan, setActiveScan] = useState(null);
  const [isOffline,  setIsOffline]  = useState(!navigator.onLine);

  const nav = (s) => setScreen(s);

useEffect(() => {
  const checkConn = async () => {
    try {
      const r = await fetch("https://thxtnnjubzucisrujloe.supabase.co/functions/v1/ask-prof-lakay",
        { method: "HEAD", signal: AbortSignal.timeout(4000) });
      setIsOffline(!r.ok && r.status !== 401);
    } catch { setIsOffline(true); }
  };
  const on  = () => { setIsOffline(false); };
  const off = () => { setIsOffline(true); };
  window.addEventListener("online",  on);
  window.addEventListener("offline", off);
  checkConn();
  const interval = setInterval(checkConn, 60000);
  return () => {
    window.removeEventListener("online",  on);
    window.removeEventListener("offline", off);
    clearInterval(interval);
  };
}, []);

useEffect(() => {
    const saved = sessionLoad();
    if (saved?.phone && saved?.code) {
      const enriched = enrichUser(saved);
      setUser(enriched);
      requestNotificationPermission().then(granted => {
        if (granted && enriched.daysRemaining <= 7) scheduleExpiryReminder(enriched.daysRemaining);
      });
      // Refresh données école en arrière-plan (throttle 5 min)
      const lastRefresh = parseInt(localStorage.getItem("gid_last_refresh") || "0");
      const now = Date.now();
      if (navigator.onLine && (now - lastRefresh > 5 * 60 * 1000)) {
        localStorage.setItem("gid_last_refresh", String(now));
        const refreshAction = saved.code === "FREEMIUM" ? "freemium_login" : "validate_code";
        const refreshPayload = saved.code === "FREEMIUM"
          ? { action: "freemium_login", phone: saved.phone, name: saved.name || saved.phone }
          : { action: "validate_code", phone: saved.phone, schoolCode: saved.code };
        callEdge(refreshPayload)
          .then(result => {
            if (saved.code === "FREEMIUM") {
              if (result?.freemiumExpiresAt) {
                const fresh = enrichUser({ ...saved, freemiumExpiresAt: result.freemiumExpiresAt, daysRemaining: result.daysRemaining, scansToday: result.scansToday ?? 0, dailyTextScans: result.dailyTextScans ?? 3, dailyImageScans: result.dailyImageScans ?? 1, dailyScans: result.dailyScans ?? 3 });
                sessionSave(fresh);
                setUser(fresh);
                // Sync compteur local avec serveur
                const today = new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
                try { localStorage.setItem(`gid_scan_${saved.phone}_${today}`, String(result.scansToday ?? 0)); } catch {}
              }
            } else if (result?.valid && result?.school) {
              const fresh = enrichUser({ ...saved, ...result.school, code: saved.code, phone: saved.phone, name: saved.name, dailyScans: result.school.dailyScans, dailyImageScans: result.school.dailyImageScans, dailyTextScans: result.school.dailyTextScans, expiresAt: result.school.expiresAt, subjects: result.school.subjects, isAdmin: result.isAdmin ?? saved.isAdmin ?? false, scansToday: result.scansToday ?? saved.scansToday ?? 0,
              });
              sessionSave(fresh);
              setUser(fresh);
              // Sync compteur local avec serveur
              const today = new Date().toLocaleString("sv-SE", { timeZone:"America/Port-au-Prince" }).split(" ")[0];
              try { localStorage.setItem(`gid_scan_${saved.phone}_${today}`, String(result.scansToday ?? 0)); } catch {}
            }
          }).catch(() => {});
      }
    }
  }, []);

  // Sync pending scores au retour en ligne
  useEffect(() => {
    const sync = async () => {
      if (!navigator.onLine) return;
      try {
        const pending = await idbGetPendingScores();
        for (const score of pending) {
          try {
            await callEdge({ action: "save_quiz_score", ...score });
            await idbDeletePendingScore(score.id);
          } catch {}
        }
      } catch {}
    };
    window.addEventListener("online", sync);
    sync();
    return () => window.removeEventListener("online", sync);
  }, []);

  useEffect(() => {
    const handler = CapApp.addListener("backButton", ({ canGoBack }) => {
      if (screen === "chat") { CapApp.exitApp(); return; }
      if (screen === "login" || screen === "splash") { CapApp.exitApp(); return; }
      if (screen === "partner" || screen === "payment" || screen === "about") { setScreen("menu"); return; }
      if (screen === "progress" || screen === "favorites" || screen === "leaderboard" || screen === "history" || screen === "quiz") { setScreen("chat"); return; }
      setScreen("chat");
    });
    return () => { handler.then(h => h.remove()); };
  }, [screen]);


  const handleLogin = (u) => {
    const enriched = enrichUser(u);
    sessionSave(enriched);
    setUser(enriched);
    setScreen("chat");
    requestNotificationPermission().then(granted => {
      if (granted) {
        scheduleDailyReminder();
        if (enriched.daysRemaining <= 7) scheduleExpiryReminder(enriched.daysRemaining);
      }
    });
  };

  const handleLogout = () => {
  sessionClear();
  // Supprimer le cache dashboard de ce directeur
  if (user?.code && user?.phone) {
    localStorage.removeItem(`gid_dir_v3_${user.code}_${user.phone}`);
  }
  setUser(null);
  setScreen("login");
};

  function renderContent() {
    if (screen === "splash")      return <SplashScreen onDone={() => { const s = sessionLoad(); if (s?.phone && s?.code) { setUser(enrichUser(s)); setScreen("chat"); } else setScreen("login"); }} />;
    if (user && !hasAccess(user)) return <LoginScreen onLogin={handleLogin} onNavigate={nav} expired={true} />;
    if (screen === "login")       return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
    if (screen === "chat")        return <ChatScreen user={user} onNavigate={nav} isOffline={isOffline} />;
    if (screen === "quiz")        return <QuizScreen user={user} onNavigate={nav} />;
    if (screen === "leaderboard") return <LeaderboardScreen user={user} onNavigate={nav} />;
    if (screen === "history")     return <HistoryScreen user={user} onNavigate={nav} onStartExercice={(scan) => { setActiveScan({ ...scan, _isRedo: !!scan.questions?.length }); setScreen("exercice"); }} />;
    if (screen === "menu")        return <MenuScreen user={user} onNavigate={nav} onLogout={handleLogout} />;
    if (screen === "payment")     return <PaymentScreen onBack={() => nav(user ? "menu" : "login")} />;
    if (screen === "dashboard") return <DashboardScreen onBack={() => nav("menu")} userCode={user?.code} userPhone={user?.phone} />;
    if (screen === "partner")     return <PartnerScreen onBack={() => nav(user ? "menu" : "login")} />;
    if (screen === "exercice")    return <ExerciceScreen user={user} scan={activeScan} onBack={() => setScreen("history")} onNavigate={nav} />;
    if (screen === "favorites")   return <FavoritesScreen user={user} onNavigate={nav} />;
    if (screen === "admin")       return <AdminScreen onBack={() => nav("menu")} />;
    if (screen === "progress")    return <ProgressScreen user={user} onNavigate={nav} />;
    if (screen === "about")       return <AboutScreen onNavigate={nav} />;
    return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
  }

  return (
    <>
      <div className="blob-bg"><div className="diag"/></div>
      {isOffline && <OfflineBanner />}
      <ErrorBoundary key={screen}>{renderContent()}</ErrorBoundary>
    </>
  );
}
