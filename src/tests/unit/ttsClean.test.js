import { describe, it, expect } from "vitest";
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
