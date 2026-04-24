// supabase/functions/ask-prof-lakay/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// Edge Function Supabase — Gid NS4
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ─── Timeout helper ───────────────────────────────────────────────────────────
function withTimeout(promise: Promise<Response>, ms = 8000): Promise<Response> {
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

// ─── Niveau 1 — OpenRouter (vision + texte) ───────────────────────────────────
async function callOpenRouter(systemPrompt: string, userContent: unknown[]): Promise<string> {
  const res = await withTimeout(fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-lite-001",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
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
      model: "gemma-3-12b-it",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
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
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
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
          { role: "user", content: userContent },
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
async function callGemini(prompt: string, imageBase64?: string | null): Promise<string> {
  const [systemPart, ...userParts] = prompt.split("\n\nÉlève:");
  const userText = userParts.join("\n\nÉlève:").trim() || prompt;
  const systemPrompt = systemPart.trim();

  const userContent: unknown[] = [];
  if (imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
    });
  }
  userContent.push({ type: "text", text: userText });

  const hasImage = !!imageBase64;

  // Niveau 1 — OpenRouter (vision + texte)
  try {
    const reply = await callOpenRouter(systemPrompt, userContent);
    console.log("✅ Fournisseur utilisé: OpenRouter");
    return reply;
  } catch (e) {
    console.warn("❌ OpenRouter échoué:", e);
  }

  // Niveau 2 — SambaNova (vision + texte)
  try {
    const reply = await callSambaNova(systemPrompt, userContent);
    console.log("✅ Fournisseur utilisé: SambaNova");
    return reply;
  } catch (e) {
    console.warn("❌ SambaNova échoué:", e);
  }

  // Niveau 3 — Groq (texte seulement)
  if (!hasImage) {
    try {
      const reply = await callGroq(systemPrompt, userText);
      console.log("✅ Fournisseur utilisé: Groq");
      return reply;
    } catch (e) {
      console.warn("❌ Groq échoué:", e);
    }
  }

  // Niveau 4 — Mistral AI (texte seulement)
  if (!hasImage) {
    try {
      const reply = await callMistral(systemPrompt, userText);
      console.log("✅ Fournisseur utilisé: Mistral AI");
      return reply;
    } catch (e) {
      console.warn("❌ Mistral échoué:", e);
    }
  }

  // Niveau 5 — LLM7.io (texte seulement)
  if (!hasImage) {
    try {
      const reply = await callLLM7(systemPrompt, userText);
      console.log("✅ Fournisseur utilisé: LLM7");
      return reply;
    } catch (e) {
      console.warn("❌ LLM7 échoué:", e);
    }
  }

  // Niveau 6 — Cloudflare (vision + texte)
  try {
    const reply = await callCloudflare(systemPrompt, userContent);
    console.log("✅ Fournisseur utilisé: Cloudflare");
    return reply;
  } catch (e) {
    console.warn("❌ Cloudflare échoué:", e);
  }

  throw new Error("Tout les fournisseurs sont indisponibles. Eseye ankò nan kèk minit.");
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

// ─── ACTION : validate_code ───────────────────────────────────────────────────
async function validateCode(
  db: ReturnType<typeof createClient>,
  body: { phone: string; schoolCode: string }
) {
  const { phone, schoolCode } = body;

  const { data: school, error } = await db
    .from("schools")
    .select("*")
    .eq("code", schoolCode)
    .single();

  if (error || !school) return { valid: false, reason: "Kòd la pa valid." };
  if (!school.active) return { valid: false, reason: "Kòd sa a dezaktive. Kontakte direksyon lekòl ou." };

  const now     = new Date();
  const expires = new Date(school.expires_at);
  if (now > expires) {
    const days = Math.floor((now.getTime() - expires.getTime()) / 86400000);
    return { valid: false, reason: `Kòd ou a ekspire depi ${days} jou.` };
  }

  const starts = new Date(school.starts_at);
  if (now < starts) return { valid: false, reason: "Kòd sa a poko aktif. Kontakte lekòl ou." };

const { data: isTeacher } = await db
    .from("teachers")
    .select("phone")
    .eq("phone", phone)
    .maybeSingle();

  console.log("🔍 isTeacher:", isTeacher, "phone:", phone, "schoolCode:", schoolCode);

  if (!isTeacher) {
    const { data: existingOtherSchool } = await db
      .from("profiles")
      .select("school_code")
      .eq("phone", phone)
      .neq("school_code", schoolCode)
      .maybeSingle();

    console.log("🔍 existingOtherSchool:", existingOtherSchool);

    if (existingOtherSchool) {
      return { valid: false, reason: "Nimewo sa a deja anrejistre ak yon lòt kòd. Kontakte direksyon lekòl ou." };
    }
  }
  const { count: studentCount } = await db
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("school_code", schoolCode);

  const { data: existingProfile } = await db
    .from("profiles")
    .select("id")
    .eq("phone", phone)
    .eq("school_code", schoolCode)
    .maybeSingle();

  if (!existingProfile && (studentCount ?? 0) >= school.max_students) {
    return { valid: false, reason: `Limit ${school.max_students} elèv rive pou kòd sa a.` };
  }

  await db.from("profiles").upsert(
    { phone, school_code: schoolCode, last_seen: new Date().toISOString() },
    { onConflict: "phone,school_code" }
  );

  const today = new Date().toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }).split(" ")[0];
  const { count: scansToday } = await db
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("phone", phone)
    .eq("school_code", schoolCode)
    .gte("created_at", `${today}T05:00:00Z`);

  const daysRemaining = Math.ceil((expires.getTime() - now.getTime()) / 86400000);

  return {
    valid: true,
    school: {
      name:            school.school_name,
      subjects:        school.subjects ?? [],
      dailyScans:      school.daily_scans ?? 5,
      dailyImageScans: school.daily_image_scans ?? 1,
      dailyTextScans:  school.daily_text_scans  ?? 4,
      daysRemaining,
      expiresAt:       school.expires_at,
      maxStudents:     school.max_students,
    },
    scansToday: scansToday ?? 0,
  };
}

// ─── ACTION : ask ─────────────────────────────────────────────────────────────
async function hashMessage(msg: string): Promise<string> {
  const normalized = msg.toLowerCase().trim().replace(/\s+/g, " ");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("").slice(0,16);
}

async function getCached(db: ReturnType<typeof createClient>, subject: string, hash: string): Promise<string|null> {
  const { data, error } = await db.from("question_cache").select("id, answer, hit_count").eq("subject", subject).eq("question_hash", hash).maybeSingle();
   
  if (!data) return null;
  await db.from("question_cache").update({ hit_count: data.hit_count + 1 }).eq("id", data.id);
  return data.answer;
}

async function saveCache(db: ReturnType<typeof createClient>, subject: string, hash: string, question: string, answer: string) {
  const { error } = await db.from("question_cache").upsert(
    { subject, question_hash: hash, question, answer },
    { onConflict: "subject,question_hash" }
  );
  if (error) console.error("❌ saveCache error:", JSON.stringify(error));
  else console.log("✅ Cache saved:", subject, hash);
}

async function processAsk(
  db: ReturnType<typeof createClient>,
  gemini: typeof callGemini,
  body: {
    phone: string;
    schoolCode: string;
    message: string;
    subject: string;
    imageBase64: string | null;
    history: Array<{ role: string; content: string }>;
  }
) {
  const { phone, schoolCode, message, subject, imageBase64, history } = body;

  const { data: school } = await db
    .from("schools")
    .select("subjects, daily_scans, active, expires_at")
    .eq("code", schoolCode)
    .single();

  if (!school || !school.active) throw { status: 403, error: "Kòd la pa valid oswa dezaktive." };
  if (new Date() > new Date(school.expires_at)) throw { status: 403, error: "Kòd ou a ekspire. Kontakte direksyon lekòl ou." };

  const allowedSubjects: string[] = school.subjects ?? [];
  if (subject !== "Général" && !allowedSubjects.includes(subject)) {
    throw { status: 403, error: `Matière ${subject} pa otorize ak kòd sa a.` };
  }

  const today = new Date().toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }).split(" ")[0];
  const { count: scansToday } = await db
    .from("scans")
    .select("*", { count: "exact", head: true })
    .eq("phone", phone)
    .eq("school_code", schoolCode)
    .gte("created_at", `${today}T05:00:00Z`);

  const dailyLimit = school.daily_scans ?? 5;
  if ((scansToday ?? 0) >= dailyLimit) {
    throw { status: 429, quotaExceeded: true, error: `Ou rive nan limit ${dailyLimit} scan pou jodi a. Tounen demen !` };
  }

  const systemPrompt = `IMPORTANT: You MUST respond ONLY in French. Never use Haitian Creole. Always respond in French language only.

Tu es Prof Lakay, un professeur expert pour les élèves de NS4 (Bac haïtien).
RÈGLE ABSOLUE 1: Réponds TOUJOURS et UNIQUEMENT en français. Jamais en créole haïtien.
RÈGLE ABSOLUE 2: Tu réponds UNIQUEMENT aux questions scolaires liées au programme NS4. Si une image est présente, c'est TOUJOURS un exercice scolaire — analyse-la sans hésitation. Si la question porte sur une matière de la liste (${allowedSubjects.join(", ")}), réponds TOUJOURS même si la formulation est informelle ou en créole. Refuse SEULEMENT si la question est CLAIREMENT hors-programme : chansons populaires, jeux vidéo, politique, ragots, recettes de cuisine, sport professionnel. En cas de doute, réponds à la question.
Tu es pédagogique : tu expliques étape par étape, tu encourages, tu cites les formules importantes.
Tu as accès à : ${allowedSubjects.join(", ")}.
Matière actuelle : ${subject}.
Si tu vois une image, analyse-la en détail comme un correcteur du BUNEXE.
Formate les formules mathématiques en LaTeX inline ($...$) ou display ($$...$$).
Sois concis et va à l'essentiel — les élèves lisent sur téléphone.`;

  const historyText = history
    .slice(-4)
    .map((m) => `${m.role === "user" ? "Élève" : "Prof Lakay"}: ${m.content}`)
    .join("\n");

  const fullPrompt = `${systemPrompt}\n\n${historyText ? `Contexte récent:\n${historyText}\n\n` : ""}Élève: ${message}`;

let reply: string;
if (!imageBase64) {
  const hash = await hashMessage(message);
  const cached = await getCached(db, subject, hash);
  if (cached) {
    reply = cached;
  } else {
    reply = await gemini(fullPrompt, imageBase64);
    await saveCache(db, subject, hash, message, reply);
  }
} else {
  reply = await gemini(fullPrompt, imageBase64);
}

  await db.from("scans").insert({
    phone,
    school_code: schoolCode,
    subject,
    has_image:   !!imageBase64,
    created_at:  new Date().toISOString(),
  });

  return { reply, scansUsed: (scansToday ?? 0) + 1, dailyLimit };
}

// ─── ACTION : save_quiz_score ─────────────────────────────────────────────────
async function saveQuizScore(
  db: ReturnType<typeof createClient>,
  body: {
    phone: string; schoolCode: string; subject: string;
    score: number; total: number; note20: number; streak: number; name?: string;
  }
) {
  const { phone, schoolCode, subject, score, total, note20, streak, name } = body;
  await db.from("quiz_scores").insert({
    phone, school_code: schoolCode, subject, score, total, note20, streak,
    name: name || phone, week: getWeekKey(), created_at: new Date().toISOString(),
  });
  return { saved: true };
}

// ─── ACTION : get_leaderboard ─────────────────────────────────────────────────
async function getLeaderboard(
  db: ReturnType<typeof createClient>,
  body: { phone: string }
) {
  const { phone } = body;

  // ── 1. Tous les scores (sans filtre école) ──
  const { data: allScores } = await db
    .from("quiz_scores")
    .select("phone, name, note20, score, school_code");

  // ── 2. Noms des écoles ──
  const codes = [...new Set((allScores ?? []).map((r: any) => r.school_code).filter(Boolean))];
  const { data: schools } = codes.length
    ? await db.from("schools").select("code, school_name").in("code", codes)
    : { data: [] };

  const schoolNameMap: Record<string, string> = {};
  (schools ?? []).forEach((s: any) => { schoolNameMap[s.code] = s.school_name; });

  // ── 3. Agrégation globale ──
  const totalCorrectMap: Record<string, number> = {};
  const bestNoteMap:     Record<string, number> = {};
  const nameMap:         Record<string, string> = {};
  const schoolMap:       Record<string, string> = {};

  (allScores ?? []).forEach((row: any) => {
    if (!bestNoteMap[row.phone] || row.note20 > bestNoteMap[row.phone])
      bestNoteMap[row.phone] = row.note20;
    totalCorrectMap[row.phone] = (totalCorrectMap[row.phone] ?? 0) + row.score;
    if (row.name) nameMap[row.phone] = row.name;
    if (row.school_code) schoolMap[row.phone] = schoolNameMap[row.school_code] ?? row.school_code;
  });

  // ── 4. Scores de la semaine (global) ──
  const currentWeek = getWeekKey();
  const { data: weekScores } = await db
    .from("quiz_scores")
    .select("phone, score")
    .eq("week", currentWeek);

  const weekMap: Record<string, number> = {};
  (weekScores ?? []).forEach((row: any) => {
    weekMap[row.phone] = (weekMap[row.phone] ?? 0) + row.score;
  });

  const formatBoard = (map: Record<string, number>, myPhone: string) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([p, val], i) => ({
        rank:   i + 1,
        phone:  maskPhone(p),
        name:   nameMap[p] || maskPhone(p),
        school: schoolMap[p] ?? null,
        isMe:   p === myPhone,
        value:  val,
      }));

  return {
    bestNote:     formatBoard(bestNoteMap,     phone),
    totalCorrect: formatBoard(totalCorrectMap, phone),
    thisWeek:     formatBoard(weekMap,         phone),
    currentWeek,
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

  const today = new Date().toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }).split(" ")[0];
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
    db.from("scans").select("*", { count: "exact", head: true }).eq("school_code", schoolCode).gte("created_at", `${today}T05:00:00Z`),
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

  // Activité par jour (7 derniers jours)
  const dailyActivity: Record<string, number> = {};
  (dailyData ?? []).forEach((s: { created_at: string }) => {
    const day = new Date(s.created_at).toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }).split(" ")[0];
    dailyActivity[day] = (dailyActivity[day] ?? 0) + 1;
  });

  // Activité par semaine (30 derniers jours)
  const weeklyActivity: Record<string, number> = {};
  (weeklyData ?? []).forEach((s: { created_at: string }) => {
    const d = new Date(s.created_at);
    const year = d.getFullYear();
    const start = new Date(year, 0, 1);
    const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    const key = `${year}-W${String(week).padStart(2, "0")}`;
    weeklyActivity[key] = (weeklyActivity[key] ?? 0) + 1;
  });

  // Stats quiz
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
// Matière la plus faible (moy. note la plus basse)
const subjectAvg: Record<string, { total: number; count: number }> = {};
(quizData ?? []).forEach((q: any) => {
  if (!subjectAvg[q.subject]) subjectAvg[q.subject] = { total: 0, count: 0 };
  subjectAvg[q.subject].total += q.note20;
  subjectAvg[q.subject].count += 1;
});
const weakSubject = Object.entries(subjectAvg)
  .map(([sub, d]) => ({ sub, avg: Math.round(d.total / d.count * 10) / 10 }))
  .sort((a, b) => a.avg - b.avg)[0] ?? null;
  const expires  = new Date(school.expires_at);
  const daysLeft = Math.ceil((expires.getTime() - Date.now()) / 86400000);

  return {
    school: {
      name: school.school_name, subjects: school.subjects ?? [],
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

// ─── ACTION : generate_quiz ───────────────────────────────────────────────────
async function generateQuiz(
  gemini: typeof callGemini,
  body: { content: string; subject: string }
) {
  const { content, subject } = body;

  const prompt = `Tu es Prof Lakay, expert NS4 Haïti.
À partir du contenu suivant, génère exactement 4 questions QCM en français.
Matière : ${subject}

Contenu :
${content.slice(0, 1500)}

RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après, sans backticks.
Format exact :
{"questions":[{"q":"question","choices":["A","B","C","D"],"answer":0,"explanation":"explication courte"}]}

- answer est l'index (0-3) de la bonne réponse
- Les 4 choix doivent être plausibles
- Les questions doivent porter sur le contenu fourni
- Explication en 1 phrase maximum`;

  const reply = await gemini(prompt, null);
  const clean = reply.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return parsed;
}

// ─── ACTION : get_announcements ───────────────────────────────────────────────
async function getannouncements(
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
  console.log("📢 getannouncements:", schoolCode, "data:", JSON.stringify(data), "error:", JSON.stringify(error));
  return { announcements: data ?? [] };
}

// ─── ACTION : create_announcement ────────────────────────────────────────────
async function createannouncement(
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

// ─── HANDLER PRINCIPAL ────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

  try {
    const body = await req.json();
    let result: unknown;

    switch (body.action) {
      case "generate_quiz":       result = await generateQuiz(callGemini, body); break;     
      case "validate_code":       result = await validateCode(supabase, body); break;
      case "ask":                 result = await processAsk(supabase, callGemini, body); break;
      case "save_quiz_score":     result = await saveQuizScore(supabase, body); break;
      case "get_leaderboard":     result = await getLeaderboard(supabase, body); break;
      case "dashboard":           result = await processDashboard(supabase, body); break;
      case "get_payment_numbers": result = await getPaymentNumbers(supabase); break;
      case "get_announcements":   result = await getAnnouncements(supabase, body); break;
      case "create_announcement": result = await createAnnouncement(supabase, body); break;
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
