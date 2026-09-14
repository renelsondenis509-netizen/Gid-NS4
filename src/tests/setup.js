// Fournit un localStorage en mémoire, complet et déterministe, pour les tests.
// Évite de dépendre de l'implémentation fournie par jsdom/Node, qui varie
// selon la plateforme (observé incomplet — sans .clear() — sous Termux/Android).
class MemoryStorage {
  constructor() {
    this._store = new Map();
  }
  getItem(key) {
    return this._store.has(key) ? this._store.get(key) : null;
  }
  setItem(key, value) {
    this._store.set(String(key), String(value));
  }
  removeItem(key) {
    this._store.delete(key);
  }
  clear() {
    this._store.clear();
  }
  key(index) {
    return Array.from(this._store.keys())[index] ?? null;
  }
  get length() {
    return this._store.size;
  }
}

globalThis.localStorage = new MemoryStorage();
