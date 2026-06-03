import { API, SUPABASE_ANON } from "./config";

export async function callEdge(payload) {
  if (!navigator.onLine) {
    throw { type: "offline", offline: true };
  }
  
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  
  try {
    const res = await fetch(API, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${SUPABASE_ANON}`,
      },
      body:   JSON.stringify(payload),
      signal: controller.signal,
    });

    // ✅ CORRECTION : Parsing JSON sécurisé
    let data;
    try {
      data = await res.json();
    } catch (e) {
      // Si la réponse n'est pas du JSON (ex: page d'erreur HTML 502/504 d'un proxy)
      const text = await res.text();
      data = {
        error: "Réponse serveur invalide",
        details: text.substring(0, 150) // On garde juste le début du texte pour éviter les payloads énormes
      };
    }

    // ✅ Vérification du statut après avoir sécurisé les données
    if (!res.ok) {
      throw { status: res.status, ...data };
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function parseApiError(err) {
  if (err?.type === "offline" || err?.offline)
    return { type: "network", message: "Pa gen koneksyon entènèt !", detail: "Konekte epi eseye ankò.", icon: "📶", retry: false };
  if (err instanceof TypeError && err.message.includes("fetch"))
    return { type: "network", message: "Koneksyon an pa bon, eseye ankò !", detail: "Verifye entènèt ou epi eseye ankò.", icon: "📶", retry: true };
  if (err?.status === 429 || err?.quotaExceeded)
    return { type: "quota", message: "Ou rive nan limit scan ou pou jodi a !", detail: "Tounen demen pou kontinye.", icon: "⏳", retry: false };
  if (err?.status === 403)
    return { type: "auth", message: err?.error || "Aksè refize. Kontakte direksyon lekòl ou.", detail: null, icon: "🔒", retry: false };
  if (err?.status >= 500)
    return { type: "server", message: "Koneksyon an pa bon, eseye ankò !", detail: "Sèvè a gen yon pwoblèm. Eseye nan kèk minit.", icon: "⚠️", retry: true };
  if (err?.name === "AbortError")
    return { type: "timeout", message: "Koneksyon an pa bon, eseye ankò !", detail: "Demann an pran twò lontan. Verifye entènèt ou.", icon: "⏱️", retry: true };
  if (err?.error)
    return { type: "api", message: err.error, detail: err.details || null, icon: "⚠️", retry: false };
  return { type: "unknown", message: "Koneksyon an pa bon, eseye ankò !", detail: null, icon: "⚠️", retry: true };
}