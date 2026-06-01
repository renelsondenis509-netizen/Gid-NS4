import { useState, useEffect } from "react";
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
    const saved = sessionLoad();
    if (saved?.phone && saved?.code) {
      const enriched = enrichUser(saved);
      setUser(enriched);
      requestNotificationPermission().then(granted => {
        if (granted && enriched.daysRemaining <= 7) scheduleExpiryReminder(enriched.daysRemaining);
      });
      // Refresh données école en arrière-plan
      if (navigator.onLine && saved.code !== "FREEMIUM") {
        callEdge({ action: "validate_code", phone: saved.phone, schoolCode: saved.code })
          .then(result => {
            if (result?.valid && result?.school) {
              const fresh = enrichUser({ ...saved, ...result.school, code: saved.code, phone: saved.phone, name: saved.name, dailyScans: result.school.dailyScans, dailyImageScans: result.school.dailyImageScans, dailyTextScans: result.school.dailyTextScans, expiresAt: result.school.expiresAt, subjects: result.school.subjects });
              sessionSave(fresh);
              setUser(fresh);
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
            await callEdge({ action: "save_score", ...score });
            await idbDeletePendingScore(score.id);
          } catch {}
        }
      } catch {}
    };
    window.addEventListener("online", sync);
    sync();
    return () => window.removeEventListener("online", sync);
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
    if (screen === "chat")        return <ChatScreen key={user?.dailyTextScans} user={user} onNavigate={nav} />;
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
    if (screen === "about")       return <AboutScreen onNavigate={nav} />;
    return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
  }

  return (
    <>
      {isOffline && <OfflineBanner />}
      {renderContent()}
    </>
  );
}
