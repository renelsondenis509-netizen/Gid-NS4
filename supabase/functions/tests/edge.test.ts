// ─── Tests d'intégration — ask-prof-lakay ────────────────────────────────────
// Exécuter avec : deno test --allow-net edge.test.ts

const URL = "https://thxtnnjubzucisrujloe.supabase.co/functions/v1/ask-prof-lakay";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") ?? "";

async function call(body: Record<string, unknown>) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${ANON_KEY}` },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

// ─── verify_admin ─────────────────────────────────────────────────────────────
Deno.test("verify_admin — bon mot de passe", async () => {
  const { status, data } = await call({ action: "verify_admin", adminSecret: ADMIN_SECRET });
  if (status !== 200 || !data.success) throw new Error(`Échec: ${JSON.stringify(data)}`);
  console.log("✅ verify_admin OK");
});

Deno.test("verify_admin — mauvais mot de passe", async () => {
  const { status } = await call({ action: "verify_admin", adminSecret: "FAUX" });
  if (status !== 403) throw new Error(`Devrait retourner 403, reçu: ${status}`);
  console.log("✅ verify_admin rejet OK");
});

// ─── validate_code ────────────────────────────────────────────────────────────
Deno.test("validate_code — code invalide", async () => {
  const { status, data } = await call({ action: "validate_code", phone: "50900000000", schoolCode: "XXXX-XXXX" });
  if (status !== 200 || data.valid !== false) throw new Error(`Devrait être invalid: ${JSON.stringify(data)}`);
  console.log("✅ validate_code rejet OK");
});

Deno.test("validate_code — FREEMIUM nouveau numéro", async () => {
  const testPhone = "50900000" + Math.floor(Math.random() * 999);
  const { status, data } = await call({ action: "validate_code", phone: testPhone, schoolCode: "FREEMIUM" });
  if (status !== 200 || !data.valid) throw new Error(`Échec freemium: ${JSON.stringify(data)}`);
  console.log("✅ validate_code FREEMIUM OK");
  // Nettoyage
  await call({ action: "revoke_user", adminSecret: ADMIN_SECRET, phone: testPhone });
});

// ─── create_school ────────────────────────────────────────────────────────────
Deno.test("create_school — création valide", async () => {
  const { status, data } = await call({
    action: "create_school",
    adminSecret: ADMIN_SECRET,
    schoolName: "Lekòl Test Auto",
    durationDays: 30,
    maxStudents: 10,
    dailyScans: 5,
  });
  if (status !== 200 || !data.code) throw new Error(`Échec création: ${JSON.stringify(data)}`);
  console.log(`✅ create_school OK — code: ${data.code}`);
  // Nettoyage
  await call({ action: "revoke_school", adminSecret: ADMIN_SECRET, code: data.code, reactivate: false });
});

Deno.test("create_school — sans adminSecret", async () => {
  const { status } = await call({ action: "create_school", adminSecret: "FAUX", schoolName: "Test" });
  if (status !== 403) throw new Error(`Devrait retourner 403, reçu: ${status}`);
  console.log("✅ create_school rejet OK");
});

// ─── revoke_user ──────────────────────────────────────────────────────────────
Deno.test("revoke_user — numéro inexistant", async () => {
  const { status, data } = await call({ action: "revoke_user", adminSecret: ADMIN_SECRET, phone: "50900000001" });
  // Pas d'erreur même si profil inexistant
  if (status !== 200) throw new Error(`Échec: ${JSON.stringify(data)}`);
  console.log("✅ revoke_user OK");
});

// ─── get_audit_logs ───────────────────────────────────────────────────────────
Deno.test("get_audit_logs — retourne des logs", async () => {
  const { status, data } = await call({ action: "get_audit_logs", adminSecret: ADMIN_SECRET, limit: 5 });
  if (status !== 200 || !Array.isArray(data.logs)) throw new Error(`Échec: ${JSON.stringify(data)}`);
  console.log(`✅ get_audit_logs OK — ${data.logs.length} logs`);
});

// ─── action inconnue ──────────────────────────────────────────────────────────
Deno.test("action inconnue — retourne 400", async () => {
  const { status } = await call({ action: "action_qui_nexiste_pas" });
  if (status !== 400) throw new Error(`Devrait retourner 400, reçu: ${status}`);
  console.log("✅ action inconnue rejet OK");
});
