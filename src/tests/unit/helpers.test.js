import { describe, it, expect, beforeEach } from "vitest";
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
