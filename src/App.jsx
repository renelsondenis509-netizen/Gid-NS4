import { useState, useEffect } from "react";
import { sessionSave, sessionLoad, sessionClear } from "./utils/helpers";
import { SplashScreen }      from "./screens/SplashScreen";
import { LoginScreen }       from "./screens/LoginScreen";
import { ChatScreen }        from "./screens/ChatScreen";
import { QuizScreen }        from "./screens/QuizScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { HistoryScreen }     from "./screens/HistoryScreen";
import { MenuScreen }        from "./screens/MenuScreen";
import { PaymentScreen }     from "./screens/PaymentScreen";
import { DashboardScreen }   from "./screens/DashboardScreen";
import { PartnerScreen }     from "./screens/PartnerScreen";

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [user, setUser]     = useState(null);
  const nav = (s) => setScreen(s);

  useEffect(() => {
    const saved = sessionLoad();
    if (saved?.phone && saved?.code) setUser(saved);
  }, []);

  const handleLogin = (u) => { sessionSave(u); setUser(u); setScreen("chat"); };
  const handleLogout = () => { sessionClear(); setUser(null); setScreen("login"); };

  if (screen === "splash")      return <SplashScreen onDone={() => { const s=sessionLoad(); setScreen(s?.phone&&s?.code?"chat":"login"); }} />;
  if (screen === "login")       return <LoginScreen onLogin={handleLogin} onNavigate={nav} />;
  if (screen === "chat")        return <ChatScreen user={user} onNavigate={nav} />;
  if (screen === "quiz")        return <QuizScreen user={user} onNavigate={nav} />;
  if (screen === "leaderboard") return <LeaderboardScreen user={user} onNavigate={nav} />;
  if (screen === "history")     return <HistoryScreen user={user} onNavigate={nav} />;
  if (screen === "menu")        return <MenuScreen user={user} onNavigate={nav} onLogout={handleLogout} />;
  if (screen === "payment")     return <PaymentScreen onBack={() => nav(user?"menu":"login")} />;
  if (screen === "dashboard")   return <DashboardScreen onBack={() => nav("menu")} userCode={user?.code} />;
  if (screen === "partner")     return <PartnerScreen onBack={() => nav(user?"menu":"login")} />;
}

// Exports nommés pour les tests
export { parseApiError } from "./api";
export { scoreToNote20, getMention, getQuizGrades, saveQuizGrade } from "./utils/quiz";
export { idbSaveScan, idbGetScans, idbDeleteScan } from "./utils/idb";
export { LoginScreen }   from "./screens/LoginScreen";
export { ChatScreen }    from "./screens/ChatScreen";
export { QuizScreen }    from "./screens/QuizScreen";
