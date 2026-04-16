import { API, SUPABASE_ANON } from "./config";

export async function callEdge(payload) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type":"application/json", "Authorization":`Bearer ${SUPABASE_ANON}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export function parseApiError(err) {
  if (err instanceof TypeError && err.message.includes("fetch"))
    return { type:"network", message:"Koneksyon an pa bon, eseye ankò !", detail:"Verifye entènèt ou epi eseye ankò.", icon:"📶", retry:true };
  if (err?.status === 429 || err?.quotaExceeded)
    return { type:"quota", message:"Ou rive nan limit scan ou pou jodi a !", detail:"Tounen demen pou kontinye.", icon:"🔒", retry:false };
  if (err?.status === 403)
    return { type:"auth", message:err?.error || "Aksè refize. Kontakte direksyon lekòl ou.", detail:null, icon:"🚫", retry:false };
  if (err?.status >= 500)
    return { type:"server", message:"Koneksyon an pa bon, eseye ankò !", detail:"Sèvè a gen yon pwoblèm. Eseye nan kèk minit.", icon:"🔧", retry:true };
  if (err?.name === "AbortError")
    return { type:"timeout", message:"Koneksyon an pa bon, eseye ankò !", detail:"Demann an pran twò lontan. Verifye entènèt ou.", icon:"⏱️", retry:true };
  if (err?.error)
    return { type:"api", message:err.error, detail:null, icon:"⚠️", retry:false };
  return { type:"unknown", message:"Koneksyon an pa bon, eseye ankò !", detail:null, icon:"⚠️", retry:true };
}
