const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("[Gid NS4] Variables VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquantes dans .env");
}

export const SUPABASE_URL     = url;
export const SUPABASE_ANON    = anon;
export const API               = `${url}/functions/v1/ask-prof-lakay`;
export const APP_LOGO          = "/logo.png";
export const APP_LOGO_ICON     = "/logo_icon.png?v=1";
export const PROF_LAKAY_PHOTO  = "/prof-lakay.jpg";
