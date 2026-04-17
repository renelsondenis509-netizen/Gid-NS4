// ─── NOTIFICATIONS ───────────────────────────────────────────────────────────
export function getNotifications() {
  const messages = JSON.parse(localStorage.getItem('gidns4_messages') || '[]');
  const quizzes  = JSON.parse(localStorage.getItem('gidns4_quizzes')  || '[]');
  const history  = JSON.parse(localStorage.getItem('gidns4_history')  || '[]');
  return {
    chat:        messages.filter(m => !m.read).length,
    quiz:        quizzes.filter(q => !q.completed).length,
    leaderboard: 0,
    history:     history.filter(h => (Date.now() - new Date(h.date)) / 86400000 < 7).length,
    menu:        0,
  };
}

// ─── SHUFFLE ─────────────────────────────────────────────────────────────────
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleChoices(q) {
  const indexed = q.choices.map((c, i) => ({ c, correct: i === q.answer }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  return { ...q, choices: indexed.map(x => x.c), answer: indexed.findIndex(x => x.correct) };
}

// ─── IMAGE ───────────────────────────────────────────────────────────────────
export function compressImage(base64, maxSize = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
      else if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

// ─── SESSION ─────────────────────────────────────────────────────────────────
const KEY = "gid_ns4_session";
export const sessionSave  = (u) => { try { localStorage.setItem(KEY, JSON.stringify(u)); } catch {} };
export const sessionLoad  = ()  => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } };
export const sessionClear = ()  => { try { localStorage.removeItem(KEY); } catch {} };
