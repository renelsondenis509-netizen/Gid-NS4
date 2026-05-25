import { useState, useEffect } from "react";
import { sessionSave, sessionLoad, sessionClear } from "./utils/helpers";
import { idbGetPendingScores, idbDeletePendingScore } from "./utils/idb";
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
import { OfflineBanner }     from "./components/OfflineBanner";

function enrichUser(u) {
  const { isFreemium, daysRemaining: freemiumDays } = getFreemiumStatus(u);
  const daysRemaining = isFreemium
    ? freemiumDays
    : u.expiresAt
      ? Math.ceil((new Date(u.expiresAt) - Date.now()) / 86_400_000)
      : (u.daysRemaining ?? 0);
  return { ...u, isFreemium, daysRemaining, freemiumExpiresAt: u.freemiumExpiresAt ?? null };
}

export default function App() {
  const [screen,     setScreen]     = useState("splash");
  const [user,       setUser]       = useState(null);
  const [activeScan, setActiveScan] = useState(null);
  const [isOffline,  setIsOffline]  = useState(!navigator.onLine);

  const nav = (s) => setScreen(s);

  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => {
    async function syncPendingScores() {
      if (!navigator.onLine) return;
      try {
        const pending = await idbGetPendingScores();
        for (const score of pending) {
          try {
            const { id, ts, ...payload } = score;
            await callEdge(payload);
            await idbDeletePendingScore(id);
          } catch { break; }
        }
      } catch {}
    }
    syncPendingScores();
    window.addEventListener("online", syncPendingScores);
    return () => window.removeEventListener("online", syncPendingScores);
  }, []);

  useEffect(() => {
    const saved = sessionLoad();
    if (saved?.phone && saved?.code) {
      const enriched = enrichUser(saved);
      setUser(enriched);
      requestNotificationPermission().then(granted => {
        if (granted && enriched.daysRemaining <= 7) scheduleExpiryReminder(enriched.daysRemaining);
      });
    }
  }, []);

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

  const handleLogout = () => { sessionClear(); setUser(null); setScreen("login"); };

  function renderContent() {
    if (screen === "splash")      return <SplashScreen onDone={() => { const s = sessionLoad(); if (s?.phone && s?.code) { setUser(enrichUser(s)); setScreen("chat"); } else setScreen("login"); }} />;
    if (user && !hasAccess(user)) return <LoginScreen onLogin={handleLogin} onNavigate={nav} expired={true} />;
    if (screen === "login")       return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
    if (screen === "chat")        return <ChatScreen user={user} onNavigate={nav} />;
    if (screen === "quiz")        return <QuizScreen user={user} onNavigate={nav} />;
    if (screen === "leaderboard") return <LeaderboardScreen user={user} onNavigate={nav} />;
    if (screen === "history")     return <HistoryScreen user={user} onNavigate={nav} onStartExercice={(scan) => { setActiveScan({ ...scan, _isRedo: !!scan.questions?.length }); setScreen("exercice"); }} />;
    if (screen === "menu")        return <MenuScreen user={user} onNavigate={nav} onLogout={handleLogout} />;
    if (screen === "payment")     return <PaymentScreen onBack={() => nav(user ? "menu" : "login")} />;
    if (screen === "dashboard")   return <DashboardScreen onBack={() => nav("menu")} userCode={user?.code} />;
    if (screen === "partner")     return <PartnerScreen onBack={() => nav(user ? "menu" : "login")} />;
    if (screen === "exercice")    return <ExerciceScreen user={user} scan={activeScan} onBack={() => setScreen("history")} onNavigate={nav} />;
    if (screen === "favorites")   return <FavoritesScreen user={user} onNavigate={nav} />;
    if (screen === "admin")       return <AdminScreen onBack={() => nav("menu")} />;
    if (screen === "progress")    return <ProgressScreen user={user} onNavigate={nav} />;
    return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
  }

  return (
    <>
      {isOffline && <OfflineBanner />}
      {renderContent()}
    </>
  );
}
