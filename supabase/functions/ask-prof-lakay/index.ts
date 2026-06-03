// supabase/functions/ask-prof-lakay/index.ts
// Version corrigee - Cache fonctionnel + syntaxe reparee

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fonction utilitaire pour obtenir la date en Haiti (UTC-5)
function getHaitiDate(): string {
  const now = new Date();
  const haitiTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Port-au-Prince" }));
  const year = haitiTime.getFullYear();
  const month = String(haitiTime.getMonth() + 1).padStart(2, "0");
  const day = String(haitiTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
