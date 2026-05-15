const DB_NAME    = "gidns4";
const DB_VERSION = 3;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("scans")) {
        const s = db.createObjectStore("scans", { keyPath: "id" });
        s.createIndex("phone", "phone", { unique: false });
      }
      if (!db.objectStoreNames.contains("exercices")) {
        const s = db.createObjectStore("exercices", { keyPath: "id" });
        s.createIndex("phone", "phone", { unique: false });
      }
      if (!db.objectStoreNames.contains("pending_scores")) {
        db.createObjectStore("pending_scores", { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

function txPromise(db, storeName, mode, fn) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    tx.onerror = (e) => reject(e.target.error);
    fn(tx.objectStore(storeName), resolve, reject);
  });
}

// ── SCANS ────────────────────────────────────────────────────
export async function idbSaveScan(phone, data) {
  const db   = await openDB();
  const scan = { ...data, phone, id: data.id || `${phone}_${Date.now()}` };
  return txPromise(db, "scans", "readwrite", (store, resolve) => {
    store.put(scan).onsuccess = () => resolve();
  });
}

export async function idbGetScans(phone) {
  const db = await openDB();
  return txPromise(db, "scans", "readonly", (store, resolve, reject) => {
    const req = store.index("phone").getAll(phone);
    req.onsuccess = (e) => resolve([...e.target.result].reverse());
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function idbDeleteScan(id) {
  const db = await openDB();
  return txPromise(db, "scans", "readwrite", (store, resolve) => {
    store.delete(id).onsuccess = () => resolve();
  });
}

// ── EXERCICES ─────────────────────────────────────────────────
export async function idbSaveExercice(phone, data) {
  const db  = await openDB();
  const exo = { ...data, phone, id: data.id || `exo_${phone}_${Date.now()}` };
  return txPromise(db, "exercices", "readwrite", (store, resolve) => {
    store.put(exo).onsuccess = () => resolve();
  });
}

export async function idbGetExercice(phone) {
  const db = await openDB();
  return txPromise(db, "exercices", "readonly", (store, resolve, reject) => {
    const req = store.index("phone").getAll(phone);
    req.onsuccess = (e) => resolve([...e.target.result].reverse());
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function idbDeleteExercice(id) {
  const db = await openDB();
  return txPromise(db, "exercices", "readwrite", (store, resolve) => {
    store.delete(id).onsuccess = () => resolve();
  });
}

// ── PENDING SCORES (offline sync) ────────────────────────────
export async function idbSavePendingScore(data) {
  const db = await openDB();
  return txPromise(db, "pending_scores", "readwrite", (store, resolve) => {
    store.add(data).onsuccess = () => resolve();
  });
}

export async function idbGetPendingScores() {
  const db = await openDB();
  return txPromise(db, "pending_scores", "readonly", (store, resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

export async function idbDeletePendingScore(id) {
  const db = await openDB();
  return txPromise(db, "pending_scores", "readwrite", (store, resolve) => {
    store.delete(id).onsuccess = () => resolve();
  });
}
