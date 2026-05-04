const DB_NAME = "GidNS4DB";
const DB_VERSION = 3;
const STORE_SCANS = "scans";
const STORE_EXERCICES = "exercices";

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_SCANS)) {
        db.createObjectStore(STORE_SCANS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_EXERCICES)) {
        db.createObjectStore(STORE_EXERCICES, { keyPath: "id" });
      }
    };
  });
}

export async function idbGetScans(phone) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCANS, "readonly");
    const store = tx.objectStore(STORE_SCANS);
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const all = request.result || [];
      resolve(all.filter(item => item.phone === phone));
    };
  });
}

export async function idbDeleteScan(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCANS, "readwrite");
    const store = tx.objectStore(STORE_SCANS);
    const request = store.delete(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function idbSaveScan(phone, scanData) {
  const db = await openDB();
  const toSave = { ...scanData, phone, id: scanData.id || Date.now() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_SCANS, "readwrite");
    const store = tx.objectStore(STORE_SCANS);
    const request = store.put(toSave);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function idbGetExercice(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_EXERCICES, "readonly");
    const store = tx.objectStore(STORE_EXERCICES);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function idbSaveExercice(exerciceData) {
  const db = await openDB();
  const toSave = { ...exerciceData, id: exerciceData.id || Date.now() };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_EXERCICES, "readwrite");
    const store = tx.objectStore(STORE_EXERCICES);
    const request = store.put(toSave);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}