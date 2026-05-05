export const FREEMIUM_DAYS = 3;

/**
 * Calcule le statut freemium à partir de l'objet user renvoyé par l'Edge Function.
 * @param {{ freemiumExpiresAt?: string }} user
 */
export function getFreemiumStatus(user) {
  if (!user?.freemiumExpiresAt) return { isFreemium: false, daysRemaining: 0 };
  const expires = new Date(user.freemiumExpiresAt);
  const ms = expires - Date.now();
  if (ms <= 0) return { isFreemium: false, daysRemaining: 0 };
  return { isFreemium: true, daysRemaining: Math.ceil(ms / 86_400_000) };
}

/**
 * Vérifie si l'utilisateur a accès (freemium actif OU école valide).
 */
export function hasAccess(user) {
  if (user?.isFreemium) return true;
  if (user?.code && user?.code !== "EXPIRED") return true;
  return false;
}

