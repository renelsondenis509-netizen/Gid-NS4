export function scoreToNote20(score, total) {
  if (total === 0) return 0;
  return Math.round((score / total) * 20 * 10) / 10;
}

export function getMention(note20) {
  if (note20 >= 16) return { label:"Excellent",   color:"#22c55e", bg:"#14532d33", border:"#22c55e44", emoji:"🏆" };
  if (note20 >= 14) return { label:"Bien",         color:"#3b82f6", bg:"#1e3a8a33", border:"#3b82f644", emoji:"⭐" };
  if (note20 >= 12) return { label:"Assez Bien",   color:"#f59e0b", bg:"#78350f33", border:"#f59e0b44", emoji:"👍" };
  if (note20 >= 10) return { label:"Passable",     color:"#f97316", bg:"#7c2d1233", border:"#f9731644", emoji:"" };
  return              { label:"Insuffisant",  color:"#ef4444", bg:"#7f1d1d33", border:"#ef444444", emoji:"📚" };
}

export function getQuizGrades(phone) {
  try { return JSON.parse(localStorage.getItem(`grades_${phone}`) || "{}"); } catch { return {}; }
}

export function saveQuizGrade(phone, subject, note20, score, total) {
  try {
    const grades = getQuizGrades(phone);
    if (!grades[subject]) grades[subject] = [];
    grades[subject].push({
      note20, score, total,
      date: new Date().toLocaleDateString("fr-HT", { timeZone:"America/Port-au-Prince" }),
      ts: Date.now(),
    });
    grades[subject] = grades[subject].slice(-10);
    localStorage.setItem(`grades_${phone}`, JSON.stringify(grades));
  } catch {}
}
