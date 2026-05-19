import { QUIZ_DATA } from './quizData.js';

const REQUIRED_KEYS = ['q', 'choices', 'answer', 'note'];
let errors = 0;

for (const [subject, questions] of Object.entries(QUIZ_DATA)) {
  if (!Array.isArray(questions) || questions.length === 0) {
    console.error(`❌ [${subject}] : tableau vide ou invalide`);
    errors++;
    continue;
  }

  questions.forEach((item, i) => {
    const tag = `[${subject}][${i}]`;

    // Clés manquantes
    for (const key of REQUIRED_KEYS) {
      if (!(key in item)) {
        console.error(`❌ ${tag} clé manquante : "${key}"`);
        errors++;
      }
    }

    // q : string non vide
    if (typeof item.q !== 'string' || item.q.trim() === '') {
      console.error(`❌ ${tag} "q" doit être une string non vide`);
      errors++;
    }

    // choices : tableau de 4 strings non vides
    if (!Array.isArray(item.choices) || item.choices.length !== 4) {
      console.error(`❌ ${tag} "choices" doit avoir exactement 4 éléments (trouvé: ${Array.isArray(item.choices) ? item.choices.length : typeof item.choices})`);
      errors++;
    } else {
      item.choices.forEach((c, ci) => {
        if (typeof c !== 'string' || c.trim() === '') {
          console.error(`❌ ${tag} choices[${ci}] est vide ou non-string`);
          errors++;
        }
      });
    }

    // answer : entier entre 0 et 3
    if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3) {
      console.error(`❌ ${tag} "answer" doit être un entier entre 0 et 3 (trouvé: ${item.answer})`);
      errors++;
    }

    // note : string non vide
    if (typeof item.note !== 'string' || item.note.trim() === '') {
      console.error(`❌ ${tag} "note" doit être une string non vide`);
      errors++;
    }
  });
}

if (errors === 0) {
  const total = Object.values(QUIZ_DATA).reduce((acc, q) => acc + q.length, 0);
  console.log(`✅ Validation OK — ${Object.keys(QUIZ_DATA).length} matières, ${total} questions`);
  process.exit(0);
} else {
  console.error(`\n💥 ${errors} erreur(s) détectée(s). Corrige avant de déployer.`);
  process.exit(1);
}
