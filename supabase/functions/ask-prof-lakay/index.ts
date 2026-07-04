// supabase/functions/ask-prof-lakay/index.ts
// Version corrigée – Cache fonctionnel + syntaxe réparée

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fonction utilitaire pour obtenir la date en Haïti (UTC-5)
function getHaitiDate(): string {
  const now = new Date();
  const haitiTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Port-au-Prince" }));
  const year = haitiTime.getFullYear();
  const month = String(haitiTime.getMonth() + 1).padStart(2, "0");
  const day = String(haitiTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}



function getHaitiMidnightISO(): string {
  const now = new Date();
  const haitiDate = getHaitiDate();
  const haitiNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Port-au-Prince" }));
  const offsetMs = now.getTime() - haitiNow.getTime();
  const midnightUTC = new Date(new Date(`${haitiDate}T00:00:00.000`).getTime() + offsetMs);
  return midnightUTC.toISOString();
}
function addStatistique(subjects: string[]): string[] {
  const smpSubjects = ['Analyse', 'Algèbre', 'Suite', 'Complexe', 'Probabilité', 'Géométrie', 'Physique'];
  if (!subjects.includes("Statistique") && subjects.some(s => smpSubjects.includes(s))) {
    return [...subjects, "Statistique"];
  }
  return subjects;
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

// ─── Timeout helper ───────────────────────────────────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms = 35000): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms)
  );
  return Promise.race([promise, timeout]);
}

// ─── Clés fournisseurs ────────────────────────────────────────────
const OPENROUTER_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const GROQ_KEY       = Deno.env.get("GROQ_API_KEY") ?? "";
const SAMBANOVA_KEY  = Deno.env.get("SAMBANOVA_API_KEY") ?? "";
const MISTRAL_KEY    = Deno.env.get("MISTRAL_API_KEY") ?? "";
const LLM7_KEY       = Deno.env.get("LLM7_API_KEY") ?? "";
const CF_ACCOUNT_ID  = Deno.env.get("CF_ACCOUNT_ID") ?? "";
const CF_API_TOKEN   = Deno.env.get("CF_API_TOKEN") ?? "";


// ─── Chargement ordre fallback depuis app_config ──────────────────────────────
async function loadFallbackOrder(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "fallback_order")
      .single();
    if (data?.value && Array.isArray(data.value)) return data.value as string[];
  } catch (_) { /* utilise défaut */ }
  return ["groq", "sambanova", "openrouter"];
}

// ─── Providers texte-seulement ────────────────────────────────────────────────
const TEXT_ONLY_PROVIDERS = new Set(["groq", "mistral", "llm7"]);

// ─── Dispatcher dynamique ─────────────────────────────────────────────────────
async function callProvider(
  name: string,
  systemPrompt: string,
  userText: string,
  userContent: unknown[]
): Promise<string> {
  switch (name) {
    case "groq":       return await callGroq(systemPrompt, userText);
    case "sambanova":  return await callSambaNova(systemPrompt, userContent);
    case "openrouter": return await callOpenRouter(systemPrompt, userContent);
    case "mistral":    return await callMistral(systemPrompt, userText);
    case "llm7":       return await callLLM7(systemPrompt, userText);
    case "cloudflare": return await callCloudflare(systemPrompt, userContent);
    default: throw new Error(`Provider inconnu: ${name}`);
  }
}

// ─── Niveau 1 — OpenRouter (vision + texte) ───────────────────────────────
async function callOpenRouter(systemPrompt: string, userContent: unknown[]): Promise<string> {
  const res = await withTimeout(fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: "openrouter/auto",                   
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent.length > 1 ? userContent : userContent[0] },
      ],
    }),
  }));
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("OpenRouter: réponse vide");
  return reply;
}

// ─── Niveau 2 — SambaNova (vision + texte) ────────────────────────────────────
async function callSambaNova(systemPrompt: string, userContent: unknown[]): Promise<string> {
  const res = await withTimeout(fetch("https://api.sambanova.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SAMBANOVA_KEY}`,
    },
    body: JSON.stringify({
      model: "gemma-4-31B-it",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent.length > 1 ? userContent : userContent[0] },
      ],
    }),
  }));
  if (!res.ok) throw new Error(`SambaNova ${res.status}`);
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("SambaNova: réponse vide");
  return reply;
}

// ─── Niveau 3 — Groq (texte seulement) ───────────────────────────────────────
async function callGroq(systemPrompt: string, userText: string): Promise<string> {
  const res = await withTimeout(fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Math.random() < 0.5 ? GROQ_KEY : (Deno.env.get("GROQ_KEY_2") || GROQ_KEY)}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    }),
  }));
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Groq: réponse vide");
  return reply;
}

// ─── Niveau 4 — Mistral AI (texte seulement) ─────────────────────────────────
async function callMistral(systemPrompt: string, userText: string): Promise<string> {
  const res = await withTimeout(fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${MISTRAL_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    }),
  }));
  if (!res.ok) throw new Error(`Mistral ${res.status}`);
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Mistral: réponse vide");
  return reply;
}

// ─── Niveau 5 — LLM7.io (texte seulement) ────────────────────────────────────
async function callLLM7(systemPrompt: string, userText: string): Promise<string> {
  const res = await withTimeout(fetch("https://api.llm7.io/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LLM7_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
    }),
  }));
  if (!res.ok) throw new Error(`LLM7 ${res.status}`);
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error("LLM7: réponse vide");
  return reply;
}

// ─── Niveau 6 — Cloudflare Workers AI (vision + texte) ───────────────────────
async function callCloudflare(systemPrompt: string, userContent: unknown[]): Promise<string> {
  const res = await withTimeout(fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.2-11b-vision-instruct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${CF_API_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent.length > 1 ? userContent : userContent[0] },
        ],
      }),
    }
  ));
  if (!res.ok) throw new Error(`Cloudflare ${res.status}`);
  const data = await res.json();
  const reply = data.result?.response;
  if (!reply) throw new Error("Cloudflare: réponse vide");
  return reply;
}

// ─── Appel principal avec fallback automatique ────────────────────────────────
async function callAIProvider(prompt: string, imageBase64?: string | null): Promise<string> {
  const [systemPart, ...userParts] = prompt.split("\n\nÉlève:");
  const userText = userParts.join("\n\nÉlève:").trim() || prompt;
  const systemPrompt = systemPart.trim();

  const userContent: unknown[] = [];
  if (imageBase64) {
    userContent.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } });
    userContent.push({ type: "text", text: userText });
  } else {
    userContent.push(userText);
  }

  const hasImage = !!imageBase64;

  // Fallback dynamique — ordre lu depuis app_config
  const order = await loadFallbackOrder();
  const errors: string[] = [];
  for (const provider of order) {
    if (hasImage && TEXT_ONLY_PROVIDERS.has(provider)) continue;
    try {
      const reply = await callProvider(provider, systemPrompt, userText, userContent);
      console.log(`✅ Fournisseur utilisé: ${provider}`);
      return reply;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`❌ ${provider} échoué:`, msg);
      errors.push(`${provider}: ${msg}`);
    }
  }
  throw { status: 503, error: `Tous les fournisseurs ont échoué: ${errors.join(" | ")}` };
}

// ─── Système haïtien de mentions ─────────────────────────────────────────────
function getMention(note20: number): string {
  if (note20 >= 16) return "Excellent";
  if (note20 >= 14) return "Bien";
  if (note20 >= 12) return "Assez Bien";
  if (note20 >= 10) return "Passable";
  return "Insuffisant";
}

function maskPhone(phone: string): string {
  if (phone.length <= 6) return "***";
  const start = phone.slice(0, 3);
  const end   = phone.slice(-4);
  return `${start}***${end}`;
}

function getWeekKey(): string {
  const now  = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const week  = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// ─── Normalisation et hash ─────────────────────────────────────────────────
function normalizeMessage(msg: string): string {
  return msg
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function hashMessage(msg: string): Promise<string> {
  const normalized = normalizeMessage(msg);
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

// ─── Récupérer depuis le cache ─────────────────────────────────────────────
async function getCachedAnswer(db: ReturnType<typeof createClient>, subject: string, hash: string): Promise<string | null> {
  try {
    const { data, error } = await db
      .from("question_cache")
      .select("id, answer, hit_count")
      .eq("subject", subject)
      .eq("question_hash", hash)
      .maybeSingle();

    if (error) {
      console.error("❌ getCachedAnswer DB error:", error.message);
      return null;
    }
    if (!data) {
      console.log("📭 Cache miss:", subject, hash);
      return null;
    }

    if (!data.answer || typeof data.answer !== "string") {
      console.warn("⚠️ Cache answer invalide pour", subject, hash);
      return null;
    }

    console.log("✅ Cache hit, answer length:", data.answer.length);

    // Mise à jour hit_count sans bloquer
    (async () => {
      try {
        await db.from("question_cache")
          .update({ hit_count: (data.hit_count || 0) + 1 })
          .eq("id", data.id);
      } catch (e) {
        console.warn("hit_count update failed", e);
      }
    })();

    return data.answer;
  } catch (err) {
    console.error("❌ getCachedAnswer exception:", err);
    return null;
  }
}

// ─── Sauvegarder dans le cache (avec gestion des conflits) ─────────────────
async function saveCache(db: ReturnType<typeof createClient>, subject: string, hash: string, question: string, answer: string): Promise<boolean> {
  try {
    const { error } = await db
      .from("question_cache")
      .insert({
        subject,
        question_hash: hash,
        question,
        answer,
        hit_count: 1,
        created_at: new Date().toISOString()
      });

    if (error) {
      if (error.code === "23505") {
        console.log("⚠️ Doublon détecté, mise à jour pour", subject, hash);
        const { error: updateError } = await db
          .from("question_cache")
          .update({ answer, created_at: new Date().toISOString() })
          .eq("subject", subject)
          .eq("question_hash", hash);
        if (updateError) throw updateError;
        console.log("✅ Cache mis à jour (conflit résolu)");
        return true;
      }
      console.error("❌ saveCache error:", JSON.stringify(error));
      return false;
    }
    console.log("✅ Cache sauvegardé:", subject, hash);
    return true;
  } catch (err) {
    console.error("❌ saveCache exception:", err);
    return false;
  }
}

// ─── ACTION : validate_code ───────────────────────────────────────────────────
async function validateCode(
  db: ReturnType<typeof createClient>,
  body: { phone: string; schoolCode: string }
) {
  const { phone, schoolCode } = body;

  // ✅ Cas spécial Freemium (inchangé)
  if (schoolCode === "FREEMIUM") {
    const fr = await freemiumLogin(db, { phone, name: body.name || phone });
    return { 
      valid: true, 
      ...fr, 
      school: { 
        name: "Freemium", 
        daily_scans: 3, 
        dailyScans: 3, 
        dailyImageScans: 1, 
        dailyTextScans: 2, 
        subjects: [], 
        daysRemaining: fr.daysRemaining, 
        expiresAt: fr.freemiumExpiresAt 
      } 
    };
  }

  // ✅ ÉTAPE 1 : Toutes les requêtes indépendantes en PARALLÈLE
  const [
    schoolRes,
    teacherRes,
    otherSchoolRes,
    studentCountRes,
    existingProfileRes
  ] = await Promise.all([
    // 1. Récupérer l'école
    db.from("schools").select("*").eq("code", schoolCode).single(),
    
    // 2. Vérifier si c'est un prof
    db.from("teachers").select("phone").eq("phone", phone).maybeSingle(),
    
    // 3. Vérifier si déjà dans une autre école
    db.from("profiles")
      .select("school_code")
      .eq("phone", phone)
      .neq("school_code", schoolCode)
      .neq("school_code", "FREEMIUM")
      .maybeSingle(),
    
    // 4. Compter les étudiants de l'école
    db.from("profiles")
      .select("*", { count: "exact", head: true })      .eq("school_code", schoolCode),
    
    // 5. Vérifier si le profil existe déjà dans cette école
    db.from("profiles")
      .select("id")
      .eq("phone", phone)
      .eq("school_code", schoolCode)
      .maybeSingle()
  ]);

  // ✅ Déstructuration des résultats
  const { data: school, error: schoolError } = schoolRes;
  const { data: isTeacher } = teacherRes;
  const { data: existingOtherSchool } = otherSchoolRes;
  const { count: studentCount } = studentCountRes;
  const { data: existingProfile } = existingProfileRes;

  // ✅ ÉTAPE 2 : Vérifications logiques (inchangées)
  if (schoolError || !school) return { valid: false, reason: "Kòd la pa valid." };
  if (!school.active) return { valid: false, reason: "Kòd sa a dezaktive. Kontakte direksyon lekòl ou." };

  const now     = new Date();
  const expires = new Date(school.expires_at);
  if (now > expires) {
    const days = Math.floor((now.getTime() - expires.getTime()) / 86400000);
    return { valid: false, reason: `Kòd ou a ekspire depi ${days} jou.` };
  }

  const starts = new Date(school.starts_at);
  if (now < starts) return { valid: false, reason: "Kòd sa a poko aktif. Kontakte lekòl ou." };

  // Vérification : si pas prof et déjà dans une autre école
  if (!isTeacher && existingOtherSchool) {
    return { valid: false, reason: "Nimewo sa a deja anrejistre ak yon lòt kòd. Kontakte direksyon lekòl ou." };
  }

  // Vérification : limite d'étudiants
  if (!existingProfile && (studentCount ?? 0) >= school.max_students) {
    return { valid: false, reason: `Limit ${school.max_students} elèv rive pou kòd sa a.` };
  }

  // ✅ ÉTAPE 3 : Upsert du profil
  await db.from("profiles").upsert(
    { phone, school_code: schoolCode, last_seen: new Date().toISOString() },
    { onConflict: "phone,school_code" }
  );

  // ✅ ÉTAPE 4 : Requêtes finales en PARALLÈLE
  const [profileRes, scansRes] = await Promise.all([
    // Récupérer freemium_expires_at
    db.from("profiles")
      .select("freemium_expires_at")
      .eq("phone", phone)
      .eq("school_code", schoolCode)
      .maybeSingle(),
    
    // Compter les scans du jour
    db.from("scans")
      .select("*", { count: "exact", head: true })
      .eq("phone", phone)
      .eq("school_code", schoolCode)
      .gte("created_at", getHaitiMidnightISO())
  ]);

  const { data: profile } = profileRes;
  const { count: scansToday } = scansRes;

  // ✅ Construction de la réponse finale
  const daysRemaining = Math.ceil((expires.getTime() - now.getTime()) / 86400000);
  const ADMIN_PHONE = Deno.env.get("ADMIN_PHONE") ?? "";

  return {
    valid: true,
    isAdmin: ADMIN_PHONE !== "" && phone === ADMIN_PHONE,
    school: {
      name:            school.school_name,
      subjects:        addStatistique(school.subjects ?? []),
      dailyScans:      school.daily_scans ?? 5,
      dailyImageScans: school.daily_image_scans ?? 1,
      dailyTextScans:  school.daily_text_scans  ?? 4,
      daysRemaining,
      expiresAt:       school.expires_at,
      maxStudents:     school.max_students,
    },
    scansToday: scansToday ?? 0,
    freemiumExpiresAt: profile?.freemium_expires_at ?? null,
    dailyScans: schoolCode === "FREEMIUM" ? 3 : (school.daily_scans ?? 5),
  };
}

// ─── ACTION : ask (avec cache amélioré) ───────────────────────────────────────
async function processAsk(
  db: ReturnType<typeof createClient>,
  gemini: typeof callAIProvider,
  body: {
    phone: string;
    schoolCode: string;
    message: string;
    subject: string;
    imageBase64: string | null;
    history: Array<{ role: string; content: string }>;
  }
) {
  const { phone, schoolCode, message, subject, imageBase64, history, name } = body;

  let allowedSubjects: string[];
  let dailyLimitOverride: number | null = null;

  if (schoolCode === "FREEMIUM") {
    const { data: profile } = await db.from("profiles").select("freemium_expires_at").eq("phone", phone).maybeSingle();
    if (!profile?.freemium_expires_at || new Date() > new Date(profile.freemium_expires_at)) {
      throw { status: 403, error: "Peryòd gratis ou a fini. Kontakte direksyon lekòl ou." };
    }
    allowedSubjects = ["Créole","Français","Anglais","Espagnol","Dissertation","Littérature Haïtienne","Littérature Française","Éducation Esthétique et Artistique","Éducation Physique et Sportive","Éducation à la Citoyenneté","Numérique et Informatique"];
    dailyLimitOverride = 3;
  } else {
    const { data: school } = await db
      .from("schools")
      .select("subjects, daily_scans, active, expires_at")
      .eq("code", schoolCode)
      .single();

    if (!school || !school.active) throw { status: 403, error: "Kòd la pa valid oswa dezaktive." };
    if (new Date() > new Date(school.expires_at)) throw { status: 403, error: "Kòd ou a ekspire. Kontakte direksyon lekòl ou." };
    let rawSubjects = school.subjects ?? [];
  if (!rawSubjects.includes("Statistique") && rawSubjects.some((s: string) => ["Analyse","Algèbre","Suite","Complexe","Probabilité","Géométrie","Physique"].includes(s))) {
    rawSubjects = [...rawSubjects, "Statistique"];
  }
  allowedSubjects = rawSubjects;
    dailyLimitOverride = school.daily_scans ?? 5;
    if (subject !== "Général" && !allowedSubjects.includes(subject)) {
      throw { status: 403, error: `Matière ${subject} pa otorize ak kòd sa a.` };
    }
  }

  const today = getHaitiDate();
  const { count: scansToday } = await db
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("phone", phone)
    .eq("school_code", schoolCode)
    .gte("created_at", getHaitiMidnightISO());

  const dailyLimit = dailyLimitOverride ?? 5;
  if ((scansToday ?? 0) >= dailyLimit) {
    throw { status: 429, quotaExceeded: true, error: `Ou rive nan limit ${dailyLimit} scan pou jodi a. Tounen demen !` };
  }

  const creoleWords = message.toLowerCase().split(/\s+/);
  const creoleMarkers = ["mwen","nou","yo","ak","pou","nan","gen","ap","kay","lekòl","egzèsis","kisa","kijan","poukisa","fòmil","repons","konprann","annou","pran","jwenn","wè","rele","ba","di","fe","ale","vini","mwenmenm","noumenm"];
  const creoleCount = creoleMarkers.filter(w => creoleWords.includes(w)).length;
  const detectedLang = creoleCount >= 2 ? "ht" : "fr";
  const langRule = detectedLang === "ht"
    ? "RÈGLE LANGUE: Réponds UNIQUEMENT en créole haïtien standard (IPN/CSLC). INTERDIT: mots anglais, mots français, répéter la question, traduire en anglais. Écris directement ta réponse sans préambule."
    : "RÈGLE LANGUE: L'élève écrit en français. Réponds UNIQUEMENT en français. Zéro mot créole dans ta réponse.";
  const systemPrompt = `${langRule}

Tu es Prof Lakay, un professeur expert pour les élèves de NS4 (Bac haïtien).
${history && history.length === 0 && name ? `RÈGLE ENCOURAGEMENT: Commence par un court mot d'encouragement STRICTEMENT DANS LA MÊME LANGUE QUE TA RÉPONSE COMPLÈTE. Si tu réponds en français: "Bonne question !", "Très bien !", "Excellent !". Si tu réponds en créole: "Bèl kesyon !", "Ekselan !". Maximum 4 mots, pas de mélange.` : ""}
RÈGLE TUTOIEMENT: Tutoie TOUJOURS l'élève. Utilise "tu", "ton", "ta", "tes". Jamais "vous", "votre", "vos".
RÈGLE ABSOLUE 1: La langue de réponse est définie par la RÈGLE LANGUE ci-dessus. Ne jamais mélanger français et créole haïtien dans une même réponse.
RÈGLE ABSOLUE 2: Tu réponds UNIQUEMENT aux questions scolaires liées au programme NS4. Si une image est présente, c'est TOUJOURS un exercice scolaire — analyse-la sans hésitation. Si la question porte sur une matière de la liste (${allowedSubjects.join(", ")}), réponds TOUJOURS même si la formulation est informelle. Refuse SEULEMENT si la question est CLAIREMENT hors-programme : chansons populaires, jeux vidéo, politique, ragots, recettes de cuisine, sport professionnel. En cas de doute, réponds à la question.
Tu es pédagogique et bienveillant : tu expliques étape par étape en vérifiant la compréhension à chaque phase, tu encourages, tu cites les formules importantes. Ne jamais donner la réponse directe sans explication. Toujours guider l'élève vers la découverte. Ne jamais faire les devoirs à la place de l'élève.
Tu as accès à : ${allowedSubjects.join(", ")}.
${subject !== "Général" ? `RÈGLE MATIÈRE: Tu réponds aux questions liées à "${subject}". Refuse SEULEMENT si la question est CLAIREMENT sur une autre discipline sans rapport. Si la question touche de près ou de loin à "${subject}", RÉPONDS TOUJOURS. En cas de doute, RÉPONDS plutôt que refuser.` : "Réponds selon la matière que l'élève mentionne dans sa question."}
Si tu vois une image, analyse-la en détail comme un correcteur du BUNEXE.
Formate les formules mathématiques en LaTeX inline ($...$) ou display ($$...$$).
Sois simple mais précis. Évite le jargon inutile — les élèves lisent sur téléphone. Définis les termes techniques quand ils apparaissent.`;

  const historyText = history
    .slice(-4)
    .map((m) => `${m.role === "user" ? "Élève" : "Prof Lakay"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `${systemPrompt}\n\n${historyText ? `Contexte récent:\n${historyText}\n\n` : ""}Élève: ${message}`;

  let reply: string;
  const hasImage = !!imageBase64;

  if (!hasImage) {
    const hash = await hashMessage(message);
    const cached = await getCachedAnswer(db, subject, hash);
    if (cached) {
      reply = cached;
      console.log("📦 Cache hit for", subject, hash);
    } else {
      reply = await gemini(fullPrompt, null);
      await saveCache(db, subject, hash, message, reply);
      console.log("💾 Cache saved for", subject, hash);
    }
  } else {
    // Ne pas cacher les réponses avec image (trop variables)
    reply = await gemini(fullPrompt, imageBase64);
  }

 await db.from("scans").insert({
    phone,
    school_code: schoolCode,
    subject,
    has_image: hasImage,
    created_at: new Date().toISOString(),
  });
if (!reply || typeof reply !== "string" || reply.trim().length === 0) {
  console.error("❌ Reply invalide avant retour:", reply);
  throw new Error("Réponse générée invalide (vide)");
}
console.log("✅ Reply valide, longueur:", reply.length);

  return { reply, scansUsed: (scansToday ?? 0) + 1, dailyLimit };
}

// ─── ACTION : save_quiz_score ─────────────────────────────────────────────────
async function saveQuizScore(
  db: ReturnType<typeof createClient>,
  body: {
    phone: string; schoolCode: string; subject: string;
    score: number; total: number; note20: number; streak: number; name?: string; source?: string;
  }
) {
  const { phone, schoolCode, subject, score, total, note20, streak, name, source } = body;
  await db.from("quiz_scores").insert({
    phone, school_code: schoolCode, subject, score, total, note20, streak,
    name: name || phone, week: getWeekKey(), created_at: new Date().toISOString(), source: source || "quiz",
  });
  return { saved: true };
}

// ─── ACTION : get_leaderboard (corrigé) ───────────────────────────────────────
async function getLeaderboard(
  db: ReturnType<typeof createClient>,
  body: { phone: string }
) {
  const { phone } = body;

  // ✅ Fetch quiz scores + scans en parallèle
  const [{ data: allScores }, { data: allScansData }, { data: weekScoresData }] = await Promise.all([
    db.from("quiz_scores").select("phone, name, note20, school_code, subject"),
    db.from("scans").select("phone, school_code, created_at"),
    db.from("quiz_scores").select("phone").eq("week", getWeekKey()),
  ]);

  // ── Noms des écoles ──
  const codes = [...new Set((allScores ?? []).map((r: any) => r.school_code).filter(Boolean))];
  const { data: schools } = codes.length
    ? await db.from("schools").select("code, school_name").in("code", codes)
    : { data: [] };

  const schoolNameMap: Record<string, string> = {};
  (schools ?? []).forEach((s: any) => { schoolNameMap[s.code] = s.school_name; });

  // ── Agrégation globale ──
  const totalCorrectMap: Record<string, number> = {};
  const bestNoteMap: Record<string, number> = {};
  const nameMap: Record<string, string> = {};
  const schoolMap: Record<string, string> = {};

  // 1. Meilleure note par matière pour chaque utilisateur
  const bestPerSubject: Record<string, Record<string, number>> = {};
  (allScores ?? []).forEach((row: any) => {
    if (!bestPerSubject[row.phone]) bestPerSubject[row.phone] = {};
    const cur = bestPerSubject[row.phone][row.subject] ?? 0;
    if (row.note20 > cur) bestPerSubject[row.phone][row.subject] = row.note20;
  });

  // bestNoteMap = somme des meilleures notes par matière
  Object.entries(bestPerSubject).forEach(([p, subjects]) => {
    const vals = Object.values(subjects);
    bestNoteMap[p] = Math.round(vals.reduce((a, b) => a + b, 0) * 10) / 10;
  });

  // 2. Remplir les autres maps (totalCorrect, name, school)
  (allScores ?? []).forEach((row: any) => {
    totalCorrectMap[row.phone] = (totalCorrectMap[row.phone] ?? 0) + 5;
    if (row.name) nameMap[row.phone] = row.name;
    if (row.school_code) schoolMap[row.phone] = schoolNameMap[row.school_code] ?? row.school_code;
  });

  // ── Classement semaine (quiz uniquement) ──
  const weekMap: Record<string, number> = {};
  (weekScoresData ?? []).forEach((row: any) => {
    weekMap[row.phone] = (weekMap[row.phone] ?? 0) + 5;
  });

  // ✅ FIX : Classement activité = total des requêtes AI (scans) par téléphone
  const activityMap: Record<string, number> = {};
  (allScansData ?? []).forEach((row: any) => {
    activityMap[row.phone] = (activityMap[row.phone] ?? 0) + 1;
    if (!schoolMap[row.phone] && row.school_code) {
      schoolMap[row.phone] = schoolNameMap[row.school_code] ?? row.school_code;
    }
  });

// Les requêtes AI comptent aussi dans "Pi bon nòt"
  Object.entries(activityMap).forEach(([p, count]) => {
    totalCorrectMap[p] = (totalCorrectMap[p] ?? 0) + count;
  });

  const formatBoard = (map: Record<string, number>, myPhone: string) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([p, val], i) => ({
        rank: i + 1,
        phone: maskPhone(p),
        name: nameMap[p] || maskPhone(p),
        school: schoolMap[p] ?? null,
        isMe: p === myPhone,
        value: val,
      }));

  return {
    bestNote:     formatBoard(bestNoteMap, phone),
    totalCorrect: formatBoard(totalCorrectMap, phone),
    thisWeek:     formatBoard(weekMap, phone),
    activity:     formatBoard(activityMap, phone),
    currentWeek:  getWeekKey(),
  };
}

// ─── ACTION : dashboard ───────────────────────────────────────────────────────
async function processDashboard(
  db: ReturnType<typeof createClient>,
  body: { schoolCode: string; directorCode: string }
) {
  const { schoolCode, directorCode } = body;

  const { data: school } = await db.from("schools").select("*").eq("code", schoolCode).single();
  if (!school || school.director_code !== directorCode) throw { status: 403, error: "Kòd direktè a pa kòrèk." };
  // Verrouillage appareil
  if (body.deviceId) {
    if (!school.device_id) {
      // Premier login — enregistre l'appareil
      await db.from("schools").update({ device_id: body.deviceId }).eq("code", schoolCode);
    } else if (school.device_id !== body.deviceId) {
      throw { status: 403, error: "Kont sa a deja aktif sou yon lòt aparèy. Kontakte direksyon Gid NS4." };
    }
  }

  const today = getHaitiDate();
  const currentWeek = getWeekKey();

  const [
    { count: totalStudents },
    { count: totalScans },
    { count: scansToday },
    { count: imageScans },
    { count: textScans },
    { data: subjectData },
    { data: dailyData },
    { data: weeklyData },
    { data: recentScans },
    { data: quizData },
  ] = await Promise.all([
    db.from("profiles").select("*", { count: "exact", head: true }).eq("school_code", schoolCode),
    db.from("scans").select("*", { count: "exact", head: true }).eq("school_code", schoolCode),
    db.from("scans").select("*", { count: "exact", head: true }).eq("school_code", schoolCode).gte("created_at", getHaitiMidnightISO()),
    db.from("scans").select("*", { count: "exact", head: true }).eq("school_code", schoolCode).eq("has_image", true),
    db.from("scans").select("*", { count: "exact", head: true }).eq("school_code", schoolCode).eq("has_image", false),
    db.from("scans").select("subject").eq("school_code", schoolCode),
    db.from("scans").select("created_at").eq("school_code", schoolCode).gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString()),
    db.from("scans").select("created_at").eq("school_code", schoolCode).gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
    db.from("scans").select("created_at, subject, has_image").eq("school_code", schoolCode).order("created_at", { ascending: false }).limit(10),
    db.from("quiz_scores").select("phone, name, note20, score, total, subject, created_at").eq("school_code", schoolCode).order("created_at", { ascending: false }).limit(20),
  ]);

  const subjectBreakdown: Record<string, number> = {};
  (subjectData ?? []).forEach((s: { subject: string }) => {
    subjectBreakdown[s.subject] = (subjectBreakdown[s.subject] ?? 0) + 1;
  });

  const dailyActivity: Record<string, number> = {};
  (dailyData ?? []).forEach((s: { created_at: string }) => {
    const day = new Date(s.created_at).toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }).split(" ")[0];
    dailyActivity[day] = (dailyActivity[day] ?? 0) + 1;
  });

  const weeklyActivity: Record<string, number> = {};
  (weeklyData ?? []).forEach((s: { created_at: string }) => {
    const d = new Date(s.created_at);
    const year = d.getFullYear();
    const start = new Date(year, 0, 1);
    const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    const key = `${year}-W${String(week).padStart(2, "0")}`;
    weeklyActivity[key] = (weeklyActivity[key] ?? 0) + 1;
  });

  const quizStats = {
    totalQuizzes: (quizData ?? []).length,
    avgNote: (quizData ?? []).length > 0
      ? Math.round((quizData ?? []).reduce((a: number, q: any) => a + q.note20, 0) / (quizData ?? []).length * 10) / 10
      : 0,
    topStudents: Object.values(
      (quizData ?? []).reduce((acc: Record<string, any>, q: any) => {
        if (!acc[q.phone]) acc[q.phone] = { name: q.name || q.phone, totalScore: 0, count: 0 };
        acc[q.phone].totalScore += q.note20;
        acc[q.phone].count += 1;
        return acc;
      }, {})
    ).map((s: any) => ({ ...s, avg: Math.round(s.totalScore / s.count * 10) / 10 }))
     .sort((a: any, b: any) => b.avg - a.avg)
     .slice(0, 5),
bySubject: (() => {
      const subjectMap: Record<string, { total: number; count: number }> = {};
      (quizData ?? []).forEach((q: any) => {
        if (!subjectMap[q.subject]) subjectMap[q.subject] = { total: 0, count: 0 };
        subjectMap[q.subject].total += q.note20;
        subjectMap[q.subject].count += 1;
      });
      return Object.entries(subjectMap)
        .map(([subject, d]) => ({ subject, avg: Math.round(d.total / d.count * 10) / 10, count: d.count }))
        .sort((a, b) => b.avg - a.avg);
    })(),
    weakSubject: (() => {
      const subjectAvg: Record<string, { total: number; count: number }> = {};
      (quizData ?? []).forEach((q: any) => {
        if (!subjectAvg[q.subject]) subjectAvg[q.subject] = { total: 0, count: 0 };
        subjectAvg[q.subject].total += q.note20;
        subjectAvg[q.subject].count += 1;
      });
      const weak = Object.entries(subjectAvg)
        .map(([sub, d]) => ({ sub, avg: Math.round(d.total / d.count * 10) / 10 }))
        .sort((a, b) => a.avg - b.avg)[0] ?? null;
      return weak ? { subject: weak.sub, avg: weak.avg } : null;
    })(),
  };

  const expires = new Date(school.expires_at);
  const daysLeft = Math.ceil((expires.getTime() - Date.now()) / 86400000);

  return {
    school: {
      name: school.school_name, subjects: addStatistique(school.subjects ?? []),
      dailyScans: school.daily_scans, daysRemaining: daysLeft,
      maxStudents: school.max_students, expiresAt: school.expires_at,
      code: schoolCode,
    },
    stats: {
      totalStudents: totalStudents ?? 0,
      totalScans: totalScans ?? 0,
      scansToday: scansToday ?? 0,
      imageScans: imageScans ?? 0,
      textScans: textScans ?? 0,
      subjectBreakdown,
      dailyActivity,
      weeklyActivity,
      recentScans: recentScans ?? [],
      quizStats,
    },
  };
}


// ─── ACTION : get_announcements (corrigé nom) ─────────────────────────────────
async function getAnnouncements(
  db: ReturnType<typeof createClient>,
  body: { schoolCode: string }
) {
  const { schoolCode } = body;
  const { data, error } = await db
    .from("announcements")
    .select("id, title, message, created_at, expires_at")
    .eq("school_code", schoolCode)
    .order("created_at", { ascending: false })
    .limit(5);
  console.log("📢 getAnnouncements:", schoolCode, "data:", JSON.stringify(data), "error:", JSON.stringify(error));
  return { announcements: data ?? [] };
}

// ─── ACTION : create_announcement ────────────────────────────────────────────
async function createAnnouncement(
  db: ReturnType<typeof createClient>,
  body: { schoolCode: string; directorCode: string; title: string; message: string; expiresAt?: string }
) {
  const { schoolCode, directorCode, title, message, expiresAt } = body;
  const { data: school } = await db.from("schools").select("director_code").eq("code", schoolCode).single();
  if (!school || school.director_code !== directorCode) throw { status: 403, error: "Kòd direktè a pa kòrèk." };
  await db.from("announcements").insert({
    school_code: schoolCode, title, message,
    expires_at: expiresAt || null,
  });
  return { created: true };
}

// ─── ACTION : get_payment_numbers (fonction manquante ajoutée) ────────────────
async function getPaymentNumbers(_db: ReturnType<typeof createClient>) {
  return {
    numbers: [
      { method: "MonCash", number: "+509 48 69 50 79" },
      { method: "NatCash", number: "+509 40 66 90 98" },
    ],
  };
}
// ─── HANDLER PRINCIPAL ────────────────────────────────────────────────────────

async function generateQuiz(_db: unknown, body: Record<string, string>) {
  const { content, subject } = body;
  if (!content) throw { status: 400, error: "Contenu manquant" };

  const prompt = "Tu es un générateur d'exercices QCM pour les élèves de NS4 Haïti. " + "OBLIGATION ABSOLUE: génère EXACTEMENT 5 questions (ni plus, ni moins) basées UNIQUEMENT sur ce contenu de " + (subject || "cours") + ". " + "Les questions doivent porter sur des faits, définitions, formules ou concepts présents dans le texte. " + "N'invente rien qui ne soit pas dans le texte. " + "Alterne les types : QCM (4 choix), Vrè/Fo (2 choix), Trou (4 choix). " + 'RÉPONDS UNIQUEMENT avec un JSON valide sans backticks. Format: {"questions":[{"q":"...","choices":["A","B","C","D"],"answer":0,"note":"..."}]}' + "\n\nContenu:\n" + content.slice(0, 3000);

  const systemPrompt = "Tu es un générateur d'exercices. Réponds UNIQUEMENT en JSON valide.";
  const fullPrompt = systemPrompt + "\n\nÉlève: " + prompt;
  let raw = "";
  const quizOrder = await loadFallbackOrder();
  for (const p of quizOrder) {
    try {
      raw = TEXT_ONLY_PROVIDERS.has(p)
        ? await callProvider(p, systemPrompt, prompt, [prompt])
        : await callProvider(p, systemPrompt, prompt, [prompt]);
      break;
    } catch { /* essaie suivant */ }
  }
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(clean);
    return parsed;
  } catch { throw { status: 500, error: "Format JSON invalide" }; }
}

async function freemiumLogin(
  db: ReturnType<typeof createClient>,
  body: { phone: string; name: string }
) {
  const { phone, name } = body;
  const FREEMIUM_DAYS = 3;

  // Upsert profil — expiration basée sur minuit heure Haïti
  const nowHaiti = new Date(new Date().toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }));
  nowHaiti.setHours(23, 59, 59, 0);
  nowHaiti.setDate(nowHaiti.getDate() + FREEMIUM_DAYS - 1); // J inclus = 3 jours affichés
  const expiresAt = nowHaiti.toISOString();
  const { data: existing } = await db.from("profiles").select("freemium_expires_at").eq("phone", phone).maybeSingle();

  if (!existing) {
    await db.from("profiles").insert({ phone, school_code: "FREEMIUM", last_seen: new Date().toISOString(), freemium_expires_at: expiresAt });
  } else {
    await db.from("profiles").update({ last_seen: new Date().toISOString() }).eq("phone", phone);
  }

  const freemiumExpiresAt = existing?.freemium_expires_at ?? expiresAt;
  const ms = new Date(freemiumExpiresAt).getTime() - Date.now();
  const daysRemaining = Math.max(0, Math.ceil(ms / 86400000));
  if (existing && daysRemaining === 0) {
    throw { status: 403, error: "Peryòd gratis ou a fini. Kontakte direksyon lekòl ou pou yon kòd." };
  }

  const today = getHaitiDate();
  const { count: scansToday } = await db.from("scans").select("*", { count: "exact", head: true }).eq("phone", phone).gte("created_at", getHaitiMidnightISO());

  return {
    success: true,
    freemiumExpiresAt,
    daysRemaining,
    scansToday: scansToday ?? 0,
    dailyScans: 3,
    dailyImageScans: 1,
    dailyTextScans: 3,
    subjects: ["Biologie","Géologie","Chimie","Physique","Histoire","Géographie","Économie","Philosophie","Analyse","Algèbre","Suite","Complexe","Probabilité","Géométrie","Créole","Français","Anglais","Espagnol","Dissertation","Littérature Haïtienne","Littérature Française","Éducation Esthétique et Artistique","Éducation Physique et Sportive","Éducation à la Citoyenneté","Numérique et Informatique"],
  };
}



// ─── AUDIT LOG ────────────────────────────────────────────────────────────────
async function logAudit(
  db: ReturnType<typeof createClient>,
  action: string,
  performedBy: string,
  target?: string,
  details?: Record<string, unknown>
) {
  try {
    await db.from("audit_logs").insert({
      action,
      performed_by: performedBy,
      target: target ?? null,
      details: details ?? null,
    });
  } catch (_) { /* ne pas bloquer si log échoue */ }
}


// ─── ACTION : get_audit_logs ─────────────────────────────────────────────────
async function getAuditLogs(
  db: ReturnType<typeof createClient>,
  body: { adminSecret: string; limit?: number }
) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  const { data, error } = await db
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(body.limit ?? 50);
  if (error) throw { status: 500, error: error.message };
  return { success: true, logs: data };
}

// ─── ACTION : verify_admin ────────────────────────────────────────────────────
async function verifyAdmin(body: { adminSecret: string }) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (!body.adminSecret || body.adminSecret !== ADMIN_SECRET) {
    throw { status: 403, error: "Mo de pase a pa kòrèk." };
  }
  return { success: true };
}

// ─── ACTION : create_school ───────────────────────────────────────────────────
async function createSchool(
  db: ReturnType<typeof createClient>,
  body: {
    adminSecret: string;
    schoolName: string;
    durationDays?: number;
    maxStudents?: number;
    dailyImageScans?: number;
    dailyTextScans?: number;
  }
) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (!body.adminSecret || body.adminSecret !== ADMIN_SECRET) {
    throw { status: 403, error: "Aksè refize." };
  }

  const { schoolName, durationDays = 365, maxStudents = 200, dailyImageScans = 5, dailyTextScans = 10 } = body;
if (!schoolName?.trim()) throw { status: 400, error: "Non lekòl la obligatwa." };
  const { data: existing } = await db.from("schools").select("code").eq("school_name", schoolName.trim()).limit(1).maybeSingle();
  if (existing) throw { status: 409, error: `Lekòl "${schoolName.trim()}" deja egziste ak kòd ${existing.code}.` };

  const rand = (len: number) => Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map(b => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");

  // Générer un code unique
  let code = "";
  for (let i = 0; i < 10; i++) {
    const candidate = rand(4) + "-" + rand(4);
    const { data } = await db.from("schools").select("code").eq("code", candidate).maybeSingle();
    if (!data) { code = candidate; break; }
  }
  if (!code) throw { status: 500, error: "Echèk jenerasyon kòd. Eseye ankò." };

  const directorCode = rand(5) + "-" + rand(5);
  const now = new Date();
  const startsAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + durationDays * 86400000).toISOString();

  const { error } = await db.from("schools").insert({
    code,
    school_name: schoolName.trim(),
    director_code: directorCode,
    active: true,
    starts_at: startsAt,
    expires_at: expiresAt,
    max_students: maxStudents,
    daily_image_scans: dailyImageScans,
    daily_text_scans: dailyTextScans,
    subjects: body.subjects ?? [],
  });

  if (error) throw { status: 500, error: "Echèk anrejistreman: " + error.message };

  await logAudit(db, "create_school", body.adminSecret.slice(-4), code, { schoolName, durationDays, maxStudents });

  return { success: true, code, directorCode, schoolName: schoolName.trim(), expiresAt, maxStudents };
}

// ─── ACTION : list_schools ───────────────────────────────────────────────────
async function listSchools(db: ReturnType<typeof createClient>, body: { adminSecret: string }) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (!body.adminSecret || body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  const { data, error } = await db.from("schools").select("code,school_name,active,expires_at,max_students").order("created_at", { ascending: false });
  if (error) throw { status: 500, error: error.message };
  return { schools: data };
}

// ─── ACTION : delete_school ───────────────────────────────────────────────────
async function deleteSchool(db: ReturnType<typeof createClient>, body: { adminSecret: string; code: string }) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (!body.adminSecret || body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  if (!body.code?.trim()) throw { status: 400, error: "Kòd la obligatwa." };
  await db.from("scans").delete().eq("school_code", body.code);
  await db.from("quiz_scores").delete().eq("school_code", body.code);
  await db.from("announcements").delete().eq("school_code", body.code);
  // Suppression en cascade des données liées
  await db.from("scans").delete().eq("school_code", body.code);
  await db.from("quiz_scores").delete().eq("school_code", body.code);
  await db.from("announcements").delete().eq("school_code", body.code);
  await db.from("profiles").delete().eq("school_code", body.code);
}

// ─── ACTION : update_school ───────────────────────────────────────────────────
async function updateSchool(
  db: ReturnType<typeof createClient>,
  body: { adminSecret: string; code: string; dailyImageScans?: number; dailyTextScans?: number; maxStudents?: number; durationDays?: number; }
) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (!body.adminSecret || body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  const { code, dailyImageScans, dailyTextScans, maxStudents, durationDays } = body;
  if (!code?.trim()) throw { status: 400, error: "Kod lekol la obligatwa." };
  const updates: Record<string, unknown> = {};
  if (dailyImageScans !== undefined) updates.daily_image_scans = dailyImageScans;
  if (dailyTextScans  !== undefined) updates.daily_text_scans  = dailyTextScans;
  if (maxStudents     !== undefined) updates.max_students      = maxStudents;
  if (durationDays    !== undefined) {
    const { data: school } = await db.from("schools").select("starts_at").eq("code", code).maybeSingle();
    if (school) updates.expires_at = new Date(new Date(school.starts_at).getTime() + durationDays * 86400000).toISOString();
  }
if (Object.keys(updates).length === 0) throw { status: 400, error: "Pa gen chanjman." };
  const { data: exists } = await db.from("schools").select("code").eq("code", code).maybeSingle();
  if (!exists) throw { status: 404, error: `Kòd lekòl "${code}" pa egziste.` };
  const { error } = await db.from("schools").update(updates).eq("code", code);
  if (error) throw { status: 500, error: "Echek mizajou: " + error.message };
  await logAudit(db, "update_school", body.adminSecret.slice(-4), code, updates);
  return { success: true, updated: updates };
}

// ─── ACTION : revoke_user ─────────────────────────────────────────────────────
async function revokeUser(
  db: ReturnType<typeof createClient>,
  body: { adminSecret: string; phone: string }
) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  const { phone } = body;
  if (!phone) throw { status: 400, error: "Nimewo telefòn obligatwa." };
  const { error } = await db.from("profiles").delete().eq("phone", phone);
  if (error) throw { status: 500, error: "Echèk revokasyon: " + error.message };
  await logAudit(db, "revoke_user", body.adminSecret.slice(-4), phone);
  return { success: true, message: `Pwofil ${phone} efase.` };
}

// ─── ACTION : revoke_school ───────────────────────────────────────────────────
async function revokeSchool(
  db: ReturnType<typeof createClient>,
  body: { adminSecret: string; code: string; reactivate?: boolean }
) {
  const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";
  if (body.adminSecret !== ADMIN_SECRET) throw { status: 403, error: "Aksè refize." };
  const { code, reactivate = false } = body;
  if (!code) throw { status: 400, error: "Kòd lekòl obligatwa." };
  const { error } = await db.from("schools").update({ active: reactivate }).eq("code", code);
  if (error) throw { status: 500, error: "Echèk revokasyon: " + error.message };
  await logAudit(db, reactivate ? "reactivate_school" : "revoke_school", body.adminSecret.slice(-4), code);
  return { success: true, message: `Lekòl ${code} ${reactivate ? "reaktive" : "revoké"}.` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  // VÉRIFICATION SÉCURITÉ : Header Authorization
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Accès refusé : Token manquant" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    let result: unknown;

    switch (body.action) {
      case "generate_quiz":        result = await generateQuiz(supabase, body); break;
      case "freemium_login":      result = await freemiumLogin(supabase, body); break;
      case "validate_code":       result = await validateCode(supabase, body); break;
      case "ask":                 result = await processAsk(supabase, callAIProvider, body); break;
      case "save_quiz_score":     result = await saveQuizScore(supabase, body); break;
      case "get_leaderboard":     result = await getLeaderboard(supabase, body); break;
      case "dashboard":           result = await processDashboard(supabase, body); break;
      case "get_payment_numbers": result = await getPaymentNumbers(supabase); break;
      case "get_announcements":   result = await getAnnouncements(supabase, body); break;
      case "create_announcement": result = await createAnnouncement(supabase, body); break;
      case "verify_admin":        result = await verifyAdmin(body); break;
      case "get_audit_logs":      result = await getAuditLogs(supabase, body); break;
      case "create_school":       result = await createSchool(supabase, body); break;
      case "list_schools":        result = await listSchools(supabase, body); break;
      case "delete_school":       result = await deleteSchool(supabase, body); break;
      case "update_school":       result = await updateSchool(supabase, body); break;
      case "revoke_user":         result = await revokeUser(supabase, body); break;
      case "revoke_school":       result = await revokeSchool(supabase, body); break;
      default:
        return new Response(JSON.stringify({ error: "Action inconnue" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(result), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err: unknown) {
    const e = err as { status?: number; error?: string; message?: string; quotaExceeded?: boolean };
    const status = e.status ?? 500;
    return new Response(
      JSON.stringify({ error: e.error ?? e.message ?? "Koneksyon an pa bon, eseye ankò !", quotaExceeded: e.quotaExceeded ?? false }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
// Mon Jun 08 2026 - activity leaderboard + scansToday server-side fix
