import { describe, it, expect, beforeEach } from "vitest";
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
