import pathlib
p = pathlib.Path("supabase/functions/ask-prof-lakay/index.ts")
t = p.read_text()

patches = []

patches.append((
'''async function validateCode(
  db: ReturnType<typeof createClient>,
  body: { phone: string; schoolCode: string }
) {
  const { phone, schoolCode } = body;''',
'''async function validateCode(
  db: ReturnType<typeof createClient>,
  body: { phone: string; schoolCode: string; name?: string }
) {
  const { phone, schoolCode } = body;'''
))

patches.append((
'''  // ✅ ÉTAPE 3 : Upsert du profil
  await db.from("profiles").upsert(
    { phone, school_code: schoolCode, last_seen: new Date().toISOString() },
    { onConflict: "phone,school_code" }
  );''',
'''  // 🔒 Verrouillage du nom : le premier nom jamais enregistré pour ce numéro
  // (toutes écoles confondues) fait autorité. Un nom tapé différemment sur un
  // autre appareil n'écrase JAMAIS le nom d'origine.
  const { data: nameRow } = await db.from("profiles")
    .select("name")
    .eq("phone", phone)
    .not("name", "is", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const canonicalName = nameRow?.name || (body.name ? String(body.name).trim() : null);

  // ✅ ÉTAPE 3 : Upsert du profil
  await db.from("profiles").upsert(
    { phone, school_code: schoolCode, last_seen: new Date().toISOString(), ...(canonicalName ? { name: canonicalName } : {}) },
    { onConflict: "phone,school_code" }
  );'''
))

patches.append((
'''  return {
    valid: true,
    isAdmin: ADMIN_PHONE !== "" && phone === ADMIN_PHONE,
    school: {''',
'''  return {
    valid: true,
    isAdmin: ADMIN_PHONE !== "" && phone === normalizePhone(ADMIN_PHONE),
    name: canonicalName,
    school: {'''
))

patches.append((
'''  const { phone, name } = body;
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
  }''',
'''  const { phone, name } = body;
  const FREEMIUM_DAYS = 3;

  // 🔒 Verrouillage du nom, comme pour validateCode
  const { data: nameRow } = await db.from("profiles")
    .select("name")
    .eq("phone", phone)
    .not("name", "is", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const canonicalName = nameRow?.name || (name ? String(name).trim() : phone);

  // Upsert profil — expiration basée sur minuit heure Haïti
  const nowHaiti = new Date(new Date().toLocaleString("sv-SE", { timeZone: "America/Port-au-Prince" }));
  nowHaiti.setHours(23, 59, 59, 0);
  nowHaiti.setDate(nowHaiti.getDate() + FREEMIUM_DAYS - 1); // J inclus = 3 jours affichés
  const expiresAt = nowHaiti.toISOString();
  const { data: existing } = await db.from("profiles").select("freemium_expires_at").eq("phone", phone).eq("school_code", "FREEMIUM").maybeSingle();

  if (!existing) {
    await db.from("profiles").insert({ phone, school_code: "FREEMIUM", last_seen: new Date().toISOString(), freemium_expires_at: expiresAt, name: canonicalName });
  } else {
    await db.from("profiles").update({ last_seen: new Date().toISOString(), name: canonicalName }).eq("phone", phone).eq("school_code", "FREEMIUM");
  }'''
))

patches.append((
'''  return {
    success: true,
    freemiumExpiresAt,''',
'''  return {
    success: true,
    name: canonicalName,
    freemiumExpiresAt,'''
))

patches.append((
'''  const { phone, schoolCode, subject, score, total, note20, streak, name, source } = body;
  await db.from("quiz_scores").insert({
    phone, school_code: schoolCode, subject, score, total, note20, streak,
    name: name || phone, week: getWeekKey(), created_at: new Date().toISOString(), source: source || "quiz",
  });''',
'''  const { phone, schoolCode, subject, score, total, note20, streak, source } = body;
  const { data: nameRow } = await db.from("profiles")
    .select("name")
    .eq("phone", phone)
    .not("name", "is", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const canonicalName = nameRow?.name || body.name || phone;
  await db.from("quiz_scores").insert({
    phone, school_code: schoolCode, subject, score, total, note20, streak,
    name: canonicalName, week: getWeekKey(), created_at: new Date().toISOString(), source: source || "quiz",
  });'''
))

patches.append((
'''  // ✅ Fetch quiz scores + scans en parallèle
  const [{ data: allScores }, { data: allScansData }, { data: weekScoresData }] = await Promise.all([
    db.from("quiz_scores").select("phone, name, note20, score, school_code, subject"),
    db.from("scans").select("phone, school_code, created_at"),
    db.from("quiz_scores").select("phone, score").eq("week", getWeekKey()),
  ]);''',
'''  // ✅ Fetch quiz scores + scans + noms verrouillés en parallèle
  const [{ data: allScores }, { data: allScansData }, { data: weekScoresData }, { data: profileNames }] = await Promise.all([
    db.from("quiz_scores").select("phone, name, note20, score, school_code, subject"),
    db.from("scans").select("phone, school_code, created_at"),
    db.from("quiz_scores").select("phone, score").eq("week", getWeekKey()),
    db.from("profiles").select("phone, name").not("name", "is", null),
  ]);'''
))

patches.append((
'''  // 2. Remplir les autres maps (totalCorrect, name, school)
  (allScores ?? []).forEach((row: any) => {
    totalCorrectMap[row.phone] = (totalCorrectMap[row.phone] ?? 0) + (row.score ?? 0);
    if (row.name) { const cur = nameMap[row.phone]; if (!cur || /^\\d+$/.test(cur)) nameMap[row.phone] = row.name; }
    if (row.school_code) schoolMap[row.phone] = schoolNameMap[row.school_code] ?? row.school_code;
  });

  // ── Classement semaine (quiz uniquement) ──''',
'''  // 2. Remplir les autres maps (totalCorrect, name, school)
  (allScores ?? []).forEach((row: any) => {
    totalCorrectMap[row.phone] = (totalCorrectMap[row.phone] ?? 0) + (row.score ?? 0);
    if (row.name) { const cur = nameMap[row.phone]; if (!cur || /^\\d+$/.test(cur)) nameMap[row.phone] = row.name; }
    if (row.school_code) schoolMap[row.phone] = schoolNameMap[row.school_code] ?? row.school_code;
  });

  // Le nom verrouillé (profiles.name) prime toujours sur l'heuristique ci-dessus
  (profileNames ?? []).forEach((row: any) => {
    if (row.name) nameMap[row.phone] = row.name;
  });

  // ── Classement semaine (quiz uniquement) ──'''
))

patches.append((
'''  // Classement activité = total des requêtes AI (scans) par téléphone, 3 pts/requête
  // Indépendant de "Pi bon nòt" (totalCorrectMap = points corrects quiz/exercices uniquement)
  const activityMap: Record<string, number> = {};
  (allScansData ?? []).forEach((row: any) => {
    activityMap[row.phone] = (activityMap[row.phone] ?? 0) + 3;''',
'''  // Classement Rekèt = total des requêtes AI (scans) par téléphone, 2 pts/requête
  // Indépendant de "Pi bon nòt" (totalCorrectMap = points corrects quiz/exercices uniquement)
  const activityMap: Record<string, number> = {};
  (allScansData ?? []).forEach((row: any) => {
    activityMap[row.phone] = (activityMap[row.phone] ?? 0) + 2;'''
))

missing = []
for i, (old, new) in enumerate(patches, 1):
    if old not in t:
        missing.append(i)
    else:
        t = t.replace(old, new, 1)

if missing:
    print("ÉCHEC — patrons non trouvés (numéros):", missing)
else:
    p.write_text(t)
    print(f"OK — {len(patches)} patchs appliqués avec succès")
