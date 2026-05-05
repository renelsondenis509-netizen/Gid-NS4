import { useState, useEffect } from "react";

export function useOffline() {
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOn  = () => setOffline(false);
    const goOff = () => setOffline(true);
    window.addEventListener("online",  goOn);
    window.addEventListener("offline", goOff);
    return () => {
      window.removeEventListener("online",  goOn);
      window.removeEventListener("offline", goOff);
    };
  }, []);
  return offline;
}
