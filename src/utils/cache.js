const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { value, expires } = JSON.parse(raw);
    if (Date.now() > expires) { sessionStorage.removeItem(key); return null; }
    return value;
  } catch { return null; }
}

export function cacheSet(key, value, ttl = DEFAULT_TTL) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ value, expires: Date.now() + ttl }));
  } catch {}
}
