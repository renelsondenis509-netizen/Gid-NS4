#!/usr/bin/env python3
"""
Corrige 5 problèmes trouvés dans supabase/functions/ask-prof-lakay/index.ts :

  1. deleteSchool ne renvoyait jamais de résultat (corps de réponse vide)
  2. processAsk ne validait pas la matière pour les comptes FREEMIUM
  3. generateQuiz : une erreur DB pendant l'enrichissement (banque partagée)
     était signalée à tort comme "Format JSON invalide"
  4. checkRateLimit avait une condition de course (SELECT puis UPDATE non
     atomiques) — remplacé par un appel à la fonction Postgres atomique
     check_rate_limit(), DÉJÀ CRÉÉE côté Supabase (migration appliquée).
  5. Code mort : ternaire à deux branches identiques, 3x "const today"
     jamais utilisée, "currentWeek" jamais utilisée dans processDashboard.

⚠️ Ce script modifie SEULEMENT le code local. Après exécution :
   - relance `npm run build` (le fichier .ts n'est pas compilé par Vite,
     mais ça vérifie que rien d'autre n'est cassé)
   - déploie la fonction Edge (curl multipart, cf. workflow habituel)
   - commit + push

Usage : depuis la racine du dépôt Gid-NS4
  python3 apply_edge_fixes.py
"""
import sys

TARGET = "supabase/functions/ask-prof-lakay/index.ts"

patches = [

# 1. Rate limiting atomique (élimine la condition de course)
(TARGET,
 '''// ─── ANTI-ABUS : rate limiting par IP + action ─────────────────────────────────
// Fenêtre fixe simple : compte les appels d'une même IP pour une même action
// sur une fenêtre de `windowMs`. Dépassement → 429. Protège freemium_login et
// validate_code contre le spam scripté (ex. générer des numéros aléatoires
// pour multiplier les essais gratuits, ou bruteforcer des codes d'école).
async function checkRateLimit(
  db: ReturnType<typeof createClient>,
  key: string,
  limit: number,
  windowMs: number
): Promise<void> {
  const now = Date.now();
  const { data: row } = await db.from("rate_limits").select("count, window_start").eq("key", key).maybeSingle();
  if (!row || (now - new Date(row.window_start).getTime()) > windowMs) {
    await db.from("rate_limits").upsert({ key, count: 1, window_start: new Date(now).toISOString() });
    return;
  }
  if (row.count >= limit) {
    throw { status: 429, error: "Twòp tantativ. Tanpri eseye ankò nan kèk minit." };
  }
  await db.from("rate_limits").update({ count: row.count + 1 }).eq("key", key);
}''',
 '''// ─── ANTI-ABUS : rate limiting par IP + action ─────────────────────────────────
// Délègue à la fonction Postgres check_rate_limit (UPSERT atomique en une seule
// requête) plutôt qu'un SELECT puis INSERT/UPDATE séparés — élimine la
// condition de course possible sous requêtes concurrentes de la même IP.
// Fail-open si la RPC échoue : un rate limiter en panne ne doit jamais bloquer
// tout le monde.
async function checkRateLimit(
  db: ReturnType<typeof createClient>,
  key: string,
  limit: number,
  windowMs: number
): Promise<void> {
  const { data: allowed, error } = await db.rpc("check_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_ms: windowMs,
  });
  if (error) {
    console.warn("⚠️ checkRateLimit RPC error (fail-open):", error.message);
    return;
  }
  if (!allowed) {
    throw { status: 429, error: "Twòp tantativ. Tanpri eseye ankò nan kèk minit." };
  }
}'''),

# 2. Restriction de matière appliquée aussi en FREEMIUM (+ suppression de "today" mort)
(TARGET,
 '''  allowedSubjects = rawSubjects;
    dailyLimitOverride = school.daily_scans ?? 5;
    if (subject !== "Général" && !allowedSubjects.includes(subject)) {
      throw { status: 403, error: `Matière ${subject} pa otorize ak kòd sa a.` };
    }
  }

  const today = getHaitiDate();
  const { count: scansToday } = await db''',
 '''  allowedSubjects = rawSubjects;
    dailyLimitOverride = school.daily_scans ?? 5;
  }

  if (subject !== "Général" && !allowedSubjects.includes(subject)) {
    throw { status: 403, error: `Matière ${subject} pa otorize ak kòd sa a.` };
  }

  const { count: scansToday } = await db'''),

# 3. generateQuiz : JSON.parse isolé de l'enrichissement + ternaire mort retiré
(TARGET,
 '''      raw = TEXT_ONLY_PROVIDERS.has(p)
        ? await callProvider(p, systemPrompt, prompt, [prompt])
        : await callProvider(p, systemPrompt, prompt, [prompt]);
      break;
    } catch { /* essaie suivant */ }
  }
  const clean = raw.replace(/```json|```/g, "").trim();
  try {
    const parsed = JSON.parse(clean);

    // 🆕 Banque partagée automatique (option A) : chaque question valide est
    // ajoutée à generated_questions, dédupliquée par hash. Ne bloque jamais
    // la réponse à l'élève même en cas d'échec d'écriture.
    // Exclusion : les exercices en créole ne sont PAS ajoutés à la banque partagée
    // (QuizScreen), seuls ceux en français y contribuent — l'élève reçoit quand
    // même ses 5 questions normalement, seule l'insertion en banque est sautée.
    if (Array.isArray(parsed?.questions) && subject && subject !== "Général" && !isCreole) {''',
 '''      raw = await callProvider(p, systemPrompt, prompt, [prompt]);
      break;
    } catch { /* essaie suivant */ }
  }
  const clean = raw.replace(/```json|```/g, "").trim();
  let parsed: any;
  try {
    parsed = JSON.parse(clean);
  } catch {
    throw { status: 500, error: "Format JSON invalide" };
  }

  // 🆕 Banque partagée automatique (option A) : chaque question valide est
  // ajoutée à generated_questions, dédupliquée par hash. Ne bloque jamais
  // la réponse à l'élève même en cas d'échec d'écriture — même si l'échec
  // vient d'une erreur DB (réseau, timeout) et non d'un JSON invalide.
  // Exclusion : les exercices en créole ne sont PAS ajoutés à la banque partagée
  // (QuizScreen), seuls ceux en français y contribuent — l'élève reçoit quand
  // même ses 5 questions normalement, seule l'insertion en banque est sautée.
  try {
    if (Array.isArray(parsed?.questions) && subject && subject !== "Général" && !isCreole) {'''),

(TARGET,
 '''        } catch (_) { /* jamais bloquant */ }
      }
    }

    return parsed;
  } catch { throw { status: 500, error: "Format JSON invalide" }; }
}''',
 '''        } catch (_) { /* jamais bloquant */ }
      }
    }
  } catch (e) {
    console.warn("⚠️ Enrichissement banque partagée échoué (non bloquant):", e);
  }

  return parsed;
}'''),

# 4. "today"/"currentWeek" morts dans processDashboard
(TARGET,
 '''  const today = getHaitiDate();
  const currentWeek = getWeekKey();

  const [''',
 '''  const ['''),

# 5. "today" mort dans freemiumLogin
(TARGET,
 '''  const today = getHaitiDate();
  const { count: scansToday } = await db.from("scans").select("*", { count: "exact", head: true }).eq("phone", phone).gte("created_at", getHaitiMidnightISO());''',
 '''  const { count: scansToday } = await db.from("scans").select("*", { count: "exact", head: true }).eq("phone", phone).gte("created_at", getHaitiMidnightISO());'''),

# 6. deleteSchool ne renvoyait jamais de résultat
(TARGET,
 '''  await db.from("profiles").delete().eq("school_code", body.code);
}

// ─── ACTION : update_school ───────────────────────────────────────────────────''',
 '''  await db.from("profiles").delete().eq("school_code", body.code);
  await logAudit(db, "delete_school", body.adminSecret.slice(-4), body.code);
  return { success: true, message: `Lekòl ${body.code} efase nèt.` };
}

// ─── ACTION : update_school ───────────────────────────────────────────────────'''),

]

success, errors = 0, 0
for filepath, find, replace in patches:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if find not in content:
            print(f"  DEJA APPLIQUE OU INTROUVABLE dans {filepath}:")
            print(f"    -> {repr(find[:80])}")
            errors += 1
            continue
        content = content.replace(find, replace, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK: {filepath}")
        success += 1
    except FileNotFoundError:
        print(f"  ABSENT: {filepath}")
        errors += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

print(f"\n{success} OK, {errors} erreurs.")
if errors:
    sys.exit(1)

print("""
⚠️ RAPPEL — la migration Postgres check_rate_limit() a déjà été appliquée
   côté Supabase (projet thxtnnjubzucisrujloe) par Claude. Rien à faire de
   ce côté-là ; seul ce fichier .ts avait besoin d'être patché localement.

Prochaines étapes :
  1. Déployer la fonction Edge (curl multipart, comme d'habitude)
  2. git add -A && git commit -m "fix: bugs fonction Edge (delete_school, matière freemium, erreur JSON, rate limit atomique, code mort)"
  3. git push
""")
