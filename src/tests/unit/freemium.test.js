import { describe, it, expect } from "vitest";
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
