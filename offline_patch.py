code = open('src/App.jsx').read()

old = '''  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);'''

new = '''  useEffect(() => {
    const checkConn = async () => {
      try {
        const r = await fetch(
          "https://thxtnnjubzucisrujloe.supabase.co/functions/v1/ask-prof-lakay",
          { method: "HEAD", signal: AbortSignal.timeout(4000) }
        );
        setIsOffline(r.status === 0);
      } catch { setIsOffline(true); }
    };
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener("online",  on);
    window.addEventListener("offline", off);
    checkConn();
    const iv = setInterval(checkConn, 15000);
    return () => {
      window.removeEventListener("online",  on);
      window.removeEventListener("offline", off);
      clearInterval(iv);
    };
  }, []);'''

if old in code:
    open('src/App.jsx', 'w').write(code.replace(old, new))
    print("OK - offline patch applique")
else:
    print("ERREUR: bloc non trouve, verifie l'indentation")
