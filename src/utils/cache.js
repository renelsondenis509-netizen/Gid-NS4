const DEFAULT_TTL = 5 * 60 * 1000;
const _store = {};

export function cacheGet(key) {
  const entry = _store[key];
  if (!entry) return null;
  if (Date.now() > entry.expires) { delete _store[key]; return null; }
  return entry.value;
}

export function cacheSet(key, value, ttl = DEFAULT_TTL) {
  _store[key] = { value, expires: Date.now() + ttl };
}

export function cacheClear(key) {
  delete _store[key];
}
