import re

path = "src/App.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

def safe_replace(content, old, new, label, expected=1):
    count = content.count(old)
    print(f"{label}: {count} occurrence(s) trouvee(s)")
    if count != expected:
        print(f"  -> ATTENTION: {expected} attendu(s), {count} trouve(s). Remplacement ignore.")
        return content, False
    return content.replace(old, new, expected), True

# A. Ajoute l'etat history + remplace nav + ajoute goBack
old_A = '  const nav = (s) => setScreen(s);'
new_A = '''  const [history, setHistory] = useState([]);

  const nav = (next) => {
    setScreen(prevScreen => {
      setHistory(h => [...h, prevScreen]);
      return next;
    });
  };

  const goBack = () => {
    setHistory(h => {
      if (h.length === 0) {
        CapApp.exitApp();
        return h;
      }
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  };'''
content, ok_A = safe_replace(content, old_A, new_A, "A. nav/goBack")

# B. Remplace le useEffect backButton par une version basee sur goBack
pattern_B = re.compile(
    r'useEffect\(\(\) => \{\s*const handler = CapApp\.addListener\("backButton".*?\}, \[screen\]\);',
    re.DOTALL
)
matches_B = pattern_B.findall(content)
print(f"B. useEffect backButton: {len(matches_B)} occurrence(s) trouvee(s)")
if len(matches_B) == 1:
    new_B = '''useEffect(() => {
    const handler = CapApp.addListener("backButton", () => { goBack(); });
    return () => { handler.then(h => h.remove()); };
  }, []);'''
    content = pattern_B.sub(new_B, content, count=1)
else:
    print("  -> ATTENTION: remplacement B ignore.")

# C. handleLogin reset history
old_C = '''    sessionSave(enriched);
    setUser(enriched);
    setScreen("chat");'''
new_C = '''    sessionSave(enriched);
    setUser(enriched);
    setHistory([]);
    setScreen("chat");'''
content, ok_C = safe_replace(content, old_C, new_C, "C. handleLogin")

# D. handleLogout reset history
old_D = '''  setUser(null);
  setScreen("login");
};'''
new_D = '''  setUser(null);
  setHistory([]);
  setScreen("login");
};'''
content, ok_D = safe_replace(content, old_D, new_D, "D. handleLogout")

# E. SplashScreen onDone reset history
old_E = 'if (screen === "splash")      return <SplashScreen onDone={() => { const s = sessionLoad(); if (s?.phone && s?.code) { setUser(enrichUser(s)); setScreen("chat"); } else setScreen("login"); }} />;'
new_E = 'if (screen === "splash")      return <SplashScreen onDone={() => { const s = sessionLoad(); setHistory([]); if (s?.phone && s?.code) { setUser(enrichUser(s)); setScreen("chat"); } else setScreen("login"); }} />;'
content, ok_E = safe_replace(content, old_E, new_E, "E. SplashScreen onDone")

# F. onStartExercice utilise nav au lieu de setScreen
old_F = 'onStartExercice={(scan) => { setActiveScan({ ...scan, _isRedo: !!scan.questions?.length }); setScreen("exercice"); }}'
new_F = 'onStartExercice={(scan) => { setActiveScan({ ...scan, _isRedo: !!scan.questions?.length }); nav("exercice"); }}'
content, ok_F = safe_replace(content, old_F, new_F, "F. onStartExercice")

# G1. PaymentScreen onBack
old_G1 = '<PaymentScreen onBack={() => nav(user ? "menu" : "login")} />'
new_G1 = '<PaymentScreen onBack={goBack} />'
content, ok_G1 = safe_replace(content, old_G1, new_G1, "G1. PaymentScreen onBack")

# G2. PartnerScreen onBack
old_G2 = '<PartnerScreen onBack={() => nav(user ? "menu" : "login")} />'
new_G2 = '<PartnerScreen onBack={goBack} />'
content, ok_G2 = safe_replace(content, old_G2, new_G2, "G2. PartnerScreen onBack")

# H. DashboardScreen onBack
old_H = 'onBack={() => nav("menu")} userCode={user?.code} userPhone={user?.phone} />'
new_H = 'onBack={goBack} userCode={user?.code} userPhone={user?.phone} />'
content, ok_H = safe_replace(content, old_H, new_H, "H. DashboardScreen onBack")

# I. ExerciceScreen onBack
old_I = 'onBack={() => setScreen("history")}'
new_I = 'onBack={goBack}'
content, ok_I = safe_replace(content, old_I, new_I, "I. ExerciceScreen onBack")

# J. AdminScreen onBack
old_J = '<AdminScreen onBack={() => nav("menu")} />'
new_J = '<AdminScreen onBack={goBack} />'
content, ok_J = safe_replace(content, old_J, new_J, "J. AdminScreen onBack")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

all_ok = all([ok_A, ok_C, ok_D, ok_E, ok_F, ok_G1, ok_G2, ok_H, ok_I, ok_J])
print()
print("TOUT OK" if all_ok else "CERTAINS REMPLACEMENTS ONT ECHOUE - verification manuelle necessaire")
