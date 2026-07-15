// src/utils/secureStorage.js
// Chiffre les valeurs sensibles (ex: code directeur) avant stockage en localStorage.
// Utilise AES-GCM (Web Crypto API) avec une clé dérivée de l'identifiant unique
// de l'appareil, au lieu d'un simple encodage Base64 (trivialement réversible).

async function deriveKey(deviceId) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(deviceId),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode("gidns4-dashboard-salt"), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function toBase64(bytes) {
  let binary = "";
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function fromBase64(str) {
  return new Uint8Array(atob(str).split("").map(c => c.charCodeAt(0)));
}

// Chiffre `plainText` avec une clé dérivée de `deviceId`. Retourne une chaîne
// combinant IV + texte chiffré, prête à stocker dans localStorage.
export async function encryptWithDevice(plainText, deviceId) {
  try {
    const key = await deriveKey(deviceId);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plainText));
    return `${toBase64(iv)}.${toBase64(new Uint8Array(cipherBuf))}`;
  } catch {
    // Fallback si Web Crypto indisponible (ne devrait pas arriver sur Android moderne)
    return `plain.${btoa(plainText)}`;
  }
}

// Déchiffre une valeur produite par encryptWithDevice. Retourne null si échec
// (ex: mauvais appareil, valeur corrompue).
export async function decryptWithDevice(cipherText, deviceId) {
  try {
    const [ivPart, dataPart] = String(cipherText).split(".");
    if (ivPart === "plain") return atob(dataPart);
    const key = await deriveKey(deviceId);
    const iv = fromBase64(ivPart);
    const dataBuf = fromBase64(dataPart);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, dataBuf);
    return new TextDecoder().decode(plainBuf);
  } catch {
    return null;
  }
}
