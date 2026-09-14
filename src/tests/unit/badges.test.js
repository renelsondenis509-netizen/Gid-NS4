import { describe, it, expect, beforeEach } from "vitest";
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
