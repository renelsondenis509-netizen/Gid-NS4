const DB_NAME    = "GidNS4DB";
const DB_VERSION = 1;
const STORE      = "scans";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const s = db.createObjectStore(STORE, { keyPath:"id", autoIncrement:true });
        s.createIndex("phone", "phone", { unique:false });
        s.createIndex("phone_date", ["phone","scanDate"], { unique:false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror  = () => reject(req.error);
  });
}

function fallbackSave(phone, entry) {
  try {
    const hist = fallbackGet(phone);
    hist.unshift({ ...entry, image:null, _fallback:true, id:Date.now() });
    localStorage.setItem(`history_${phone}`, JSON.stringify(hist.slice(0, 20)));
  } catch {}
}
export function fallbackGet(phone) {
  try { return JSON.parse(localStorage.getItem(`history_${phone}`) || "[]"); } catch { return []; }
}

export async function idbSaveScan(phone, entry) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).add({ ...entry, phone });
      tx.oncomplete = () => resolve(true);
      tx.onerror    = () => reject(tx.error);
    });
  } catch (err) {
    console.warn("IDB indisponible, fallback", err);
    fallbackSave(phone, entry);
  }
}

export async function idbGetScans(phone, limit = 50) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const results = [];
      const req = db.transaction(STORE, "readonly").objectStore(STORE).openCursor(null, "prev");
      req.onsuccess = (e) => {
        const c = e.target.result;
        if (!c || results.length >= limit) { resolve(results); return; }
        if (c.value.phone === phone) results.push(c.value);
        c.continue();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("IDB lecture échouée, fallback", err);
    return fallbackGet(phone);
  }
}

export async function idbDeleteScan(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror    = () => reject(tx.error);
    });
  } catch (err) { console.warn("IDB suppression échouée", err); }
}

