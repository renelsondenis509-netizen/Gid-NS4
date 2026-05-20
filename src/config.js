const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("[Gid NS4] Variables VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquantes dans .env");
}

export const SUPABASE_URL     = url;
export const SUPABASE_ANON    = anon;
export const API               = `${url}/functions/v1/ask-prof-lakay`;
export const APP_LOGO          = "/logo.png?v=2";
export const PROF_LAKAY_PHOTO  = "https://i.postimg.cc/MH8V3LKv/Jpgpro-out-bfea41d353cc11eb57c8fc16e3b40ffa.jpg";
