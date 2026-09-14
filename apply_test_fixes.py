#!/usr/bin/env python3
"""
Applique en une fois :
  1. La correction de vite.config.js (exclusion du test Deno + environnement jsdom)
  2. Le nettoyage des scripts morts dans package.json
  3. La création de 5 fichiers de tests unitaires (43 tests) dans src/tests/unit/

Usage : depuis la racine du dépôt Gid-NS4
  python apply_test_fixes.py
"""
import os
import sys

# ── 1. Patches sur fichiers existants (find/replace, comme apply_patches.py) ──
patches = [

("vite.config.js",
 '  preview: {\n    host: "0.0.0.0",\n    port: 5173,\n  },',
 '  preview: {\n    host: "0.0.0.0",\n    port: 5173,\n  },\n\n  test: {\n    // supabase/functions/** contient des tests Deno (run_tests.sh), pas Vitest.\n    exclude: ["**/node_modules/**", "supabase/functions/**"],\n    environment: "jsdom",\n  },'),

("package.json",
 '    "test": "vitest run",\n    "test:watch": "vitest",\n    "test:coverage": "vitest run --coverage",\n    "test:unit": "vitest run src/tests/unit",\n    "test:components": "vitest run src/tests/components",\n    "test:integration": "vitest run src/tests/integration"',
 '    "test": "vitest run",\n    "test:unit": "vitest run src/tests/unit",\n    "test:watch": "vitest",\n    "test:coverage": "vitest run --coverage",\n    "test:edge": "cd supabase/functions/tests && ./run_tests.sh"'),

]

# ── 2. Nouveaux fichiers de tests (créés tels quels) ──────────────────────────
new_files = {

"src/tests/unit/quiz.test.js": r"""import { describe, it, expect, beforeEach } from "vitest";
import { scoreToNote20, getMention, getQuizGrades, saveQuizGrade } from "../../utils/quiz.js";

describe("scoreToNote20", () => {
  it("retourne 0 quand total vaut 0", () => {
    expect(scoreToNote20(0, 0)).toBe(0);
  });

  it("convertit un score parfait en 20", () => {
    expect(scoreToNote20(10, 10)).toBe(20);
  });

  it("arrondit au dixième", () => {
    expect(scoreToNote20(7, 9)).toBe(15.6);
  });
});

describe("getMention", () => {
  it("retourne Excellent à partir de 16", () => {
    expect(getMention(16).label).toBe("Excellent");
    expect(getMention(20).label).toBe("Excellent");
  });

  it("retourne Bien entre 14 et 15.9", () => {
    expect(getMention(14).label).toBe("Bien");
    expect(getMention(15.9).label).toBe("Bien");
  });

  it("retourne Assez Bien entre 12 et 13.9", () => {
    expect(getMention(12).label).toBe("Assez Bien");
  });

  it("retourne Passable entre 10 et 11.9", () => {
    expect(getMention(10).label).toBe("Passable");
  });

  it("retourne Insuffisant en dessous de 10", () => {
    expect(getMention(9.9).label).toBe("Insuffisant");
    expect(getMention(0).label).toBe("Insuffisant");
  });
});

describe("getQuizGrades / saveQuizGrade", () => {
  const phone = "50912345678";

  beforeEach(() => {
    localStorage.clear();
  });

  it("retourne un objet vide si aucune note n'est enregistrée", () => {
    expect(getQuizGrades(phone)).toEqual({});
  });

  it("enregistre une note et la relit correctement", () => {
    saveQuizGrade(phone, "SVT", 18, 9, 10);
    const grades = getQuizGrades(phone);
    expect(grades.SVT).toHaveLength(1);
    expect(grades.SVT[0]).toMatchObject({ note20: 18, score: 9, total: 10 });
  });

  it("ne garde que les 10 dernières notes par matière", () => {
    for (let i = 0; i < 12; i++) saveQuizGrade(phone, "SES", i, i, 20);
    const grades = getQuizGrades(phone);
    expect(grades.SES).toHaveLength(10);
    // Les 2 premières notes (0 et 1) doivent avoir été évincées
    expect(grades.SES[0].note20).toBe(2);
    expect(grades.SES[9].note20).toBe(11);
  });

  it("ne lève pas d'exception si le JSON stocké est corrompu", () => {
    localStorage.setItem(`grades_${phone}`, "{ceci n'est pas du JSON");
    expect(() => getQuizGrades(phone)).not.toThrow();
    expect(getQuizGrades(phone)).toEqual({});
  });
});
""",

"src/tests/unit/freemium.test.js": r"""import { describe, it, expect } from "vitest";
import { getFreemiumStatus, hasAccess, FREEMIUM_DAYS } from "../../utils/freemium.js";

describe("getFreemiumStatus", () => {
  it("n'est pas freemium si l'utilisateur n'a pas de date d'expiration", () => {
    expect(getFreemiumStatus(undefined)).toEqual({ isFreemium: false, daysRemaining: 0 });
    expect(getFreemiumStatus({})).toEqual({ isFreemium: false, daysRemaining: 0 });
  });

  it("n'est pas freemium si la date d'expiration est dans le passé", () => {
    const user = { freemiumExpiresAt: new Date(Date.now() - 1000).toISOString() };
    expect(getFreemiumStatus(user)).toEqual({ isFreemium: false, daysRemaining: 0 });
  });

  it("est freemium avec le bon nombre de jours restants si la date est dans le futur", () => {
    const user = { freemiumExpiresAt: new Date(Date.now() + FREEMIUM_DAYS * 86_400_000).toISOString() };
    const status = getFreemiumStatus(user);
    expect(status.isFreemium).toBe(true);
    expect(status.daysRemaining).toBe(FREEMIUM_DAYS);
  });
});

describe("hasAccess", () => {
  it("refuse l'accès si aucun champ pertinent n'est présent", () => {
    expect(hasAccess(undefined)).toBe(false);
    expect(hasAccess({})).toBe(false);
  });

  it("accorde l'accès en période freemium active", () => {
    expect(hasAccess({ isFreemium: true, daysRemaining: 2 })).toBe(true);
  });

  it("refuse l'accès en freemium sans jours restants", () => {
    expect(hasAccess({ isFreemium: true, daysRemaining: 0 })).toBe(false);
  });

  it("accorde l'accès avec un code valide et des jours restants", () => {
    expect(hasAccess({ code: "ECOLE-2026", daysRemaining: 5 })).toBe(true);
  });

  it("refuse l'accès si le code est marqué EXPIRED", () => {
    expect(hasAccess({ code: "EXPIRED", daysRemaining: 5 })).toBe(false);
  });
});
""",

"src/tests/unit/ttsClean.test.js": r"""import { describe, it, expect } from "vitest";
import { cleanForTTS } from "../../utils/ttsClean.js";

describe("cleanForTTS", () => {
  it("retourne une chaîne vide pour une entrée vide ou nulle", () => {
    expect(cleanForTTS("")).toBe("");
    expect(cleanForTTS(null)).toBe("");
    expect(cleanForTTS(undefined)).toBe("");
  });

  it("retire le formatage Markdown (gras, italique, résidus)", () => {
    expect(cleanForTTS("**bonjou** ak *lekòl*")).toBe("bonjou ak lekòl");
    expect(cleanForTTS("# Tit\n> sitasyon")).toBe("Tit, sitasyon");
  });

  it("convertit une fraction LaTeX en texte lisible", () => {
    expect(cleanForTTS("$\\frac{1}{2}$")).toBe("1 sur 2");
  });

  it("convertit une racine carrée LaTeX en texte lisible", () => {
    expect(cleanForTTS("$\\sqrt{9}$")).toBe("racine de 9");
  });

  it("convertit les symboles mathématiques courants", () => {
    expect(cleanForTTS("$5 \\times 3 \\geq 10$")).toBe("5 fois 3 supérieur ou égal à 10");
  });

  it("compresse les espaces et sauts de ligne multiples", () => {
    expect(cleanForTTS("liy 1\n\n\nliy 2")).toBe("liy 1. liy 2");
  });
});
""",

"src/tests/unit/badges.test.js": r"""import { describe, it, expect, beforeEach } from "vitest";
import { computeBadges, BADGES } from "../../utils/badges.js";

function unlockedIds(grades, extra = {}) {
  const result = computeBadges({ grades, exoCount: 0, allSubjectsCount: 4, phone: "50900000000", ...extra });
  return result.filter(b => b.unlocked).map(b => b.id);
}

describe("computeBadges", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("ne débloque aucun badge sans aucune activité", () => {
    expect(unlockedIds({})).toEqual([]);
  });

  it("expose la liste complète des badges avec le champ unlocked", () => {
    const result = computeBadges({ grades: {}, exoCount: 0, allSubjectsCount: 4, phone: "" });
    expect(result).toHaveLength(BADGES.length);
    expect(result.every(b => "unlocked" in b)).toBe(true);
  });

  it("débloque first_quiz dès la première note", () => {
    expect(unlockedIds({ SVT: [{ note20: 12 }] })).toContain("first_quiz");
  });

  it("débloque perfect à partir d'un 20/20", () => {
    const ids = unlockedIds({ SVT: [{ note20: 20 }] });
    expect(ids).toContain("perfect");
  });

  it("débloque master seulement à partir de 3 matières à 20/20", () => {
    const deux = unlockedIds({ SVT: [{ note20: 20 }], SES: [{ note20: 20 }] });
    expect(deux).not.toContain("master");

    const trois = unlockedIds({
      SVT: [{ note20: 20 }], SES: [{ note20: 20 }], SMP: [{ note20: 20 }],
    });
    expect(trois).toContain("master");
  });

  it("débloque quiz_10 et quiz_50 selon le nombre total de notes", () => {
    const notes10 = Array.from({ length: 10 }, () => ({ note20: 10 }));
    const ids10 = unlockedIds({ SVT: notes10 });
    expect(ids10).toContain("quiz_10");
    expect(ids10).not.toContain("quiz_50");

    const notes50 = Array.from({ length: 50 }, () => ({ note20: 10 }));
    const ids50 = unlockedIds({ SVT: notes50 });
    expect(ids50).toContain("quiz_50");
  });

  it("débloque first_exo et exo_10 selon exoCount", () => {
    expect(unlockedIds({}, { exoCount: 1 })).toContain("first_exo");
    expect(unlockedIds({}, { exoCount: 1 })).not.toContain("exo_10");
    expect(unlockedIds({}, { exoCount: 10 })).toContain("exo_10");
  });

  it("débloque les badges de couverture selon la proportion de matières essayées", () => {
    // allSubjectsCount = 4 → 1 matière = 25%, 2 = 50%, 4 = 100%
    expect(unlockedIds({ SVT: [{ note20: 10 }] })).toContain("cover_25");
    expect(unlockedIds({ SVT: [{ note20: 10 }], SES: [{ note20: 10 }] })).toContain("cover_50");
    expect(unlockedIds({
      SVT: [{ note20: 10 }], SES: [{ note20: 10 }], SMP: [{ note20: 10 }], LLA: [{ note20: 10 }],
    })).toContain("cover_100");
  });

  it("débloque avg_16 seulement si la moyenne des meilleures notes atteint 16", () => {
    const bas = unlockedIds({ SVT: [{ note20: 10 }], SES: [{ note20: 12 }] });
    expect(bas).not.toContain("avg_16");

    const haut = unlockedIds({ SVT: [{ note20: 18 }], SES: [{ note20: 16 }] });
    expect(haut).toContain("avg_16");
  });

  it("débloque streak_5 après 5 notes à 16+ dans une même matière", () => {
    const quatre = Array.from({ length: 4 }, () => ({ note20: 16 }));
    expect(unlockedIds({ SVT: quatre })).not.toContain("streak_5");

    const cinq = Array.from({ length: 5 }, () => ({ note20: 16 }));
    expect(unlockedIds({ SVT: cinq })).toContain("streak_5");
  });

  it("ne lève pas d'exception si grades est incohérent", () => {
    expect(() => computeBadges({ grades: { SVT: null }, exoCount: 0, allSubjectsCount: 1, phone: "" }))
      .not.toThrow();
  });
});
""",

"src/tests/unit/helpers.test.js": r"""import { describe, it, expect, beforeEach } from "vitest";
import { shuffleArray, shuffleChoices, sessionSave, sessionLoad, sessionClear } from "../../utils/helpers.js";

describe("shuffleArray", () => {
  it("conserve tous les éléments (même multiset)", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect([...shuffled].sort()).toEqual([...original].sort());
  });

  it("ne modifie pas le tableau d'origine", () => {
    const original = [1, 2, 3];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });
});

describe("shuffleChoices", () => {
  it("garde la bonne réponse pointée par 'answer' après mélange", () => {
    const q = { choices: ["A", "B", "C", "D"], answer: 2 }; // bonne réponse = "C"
    const result = shuffleChoices(q);
    expect(result.choices[result.answer]).toBe("C");
    expect([...result.choices].sort()).toEqual(["A", "B", "C", "D"]);
  });
});

describe("session storage (sessionSave / sessionLoad / sessionClear)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("retourne null si rien n'est enregistré", () => {
    expect(sessionLoad()).toBeNull();
  });

  it("enregistre puis relit un utilisateur", () => {
    const user = { phone: "50912345678", name: "Renelson" };
    sessionSave(user);
    expect(sessionLoad()).toEqual(user);
  });

  it("efface la session correctement", () => {
    sessionSave({ phone: "50912345678" });
    sessionClear();
    expect(sessionLoad()).toBeNull();
  });
});
""",

}

# ── Exécution ──────────────────────────────────────────────────────────────
success, errors = 0, 0

for filepath, find, replace in patches:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        if find not in content:
            print(f"  DEJA APPLIQUE OU INTROUVABLE: {filepath}")
            errors += 1
            continue
        content = content.replace(find, replace, 1)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK (patch): {filepath}")
        success += 1
    except FileNotFoundError:
        print(f"  ABSENT: {filepath}")
        errors += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

for filepath, content in new_files.items():
    try:
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  OK (nouveau fichier): {filepath}")
        success += 1
    except Exception as e:
        print(f"  ERREUR {filepath}: {e}")
        errors += 1

print(f"\n{success} OK, {errors} erreurs.")
if errors:
    sys.exit(1)
