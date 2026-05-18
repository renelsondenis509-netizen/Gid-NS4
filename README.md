cat > README.md << 'EOF'
# Gid NS4 — Application éducative pour le Baccalauréat haïtien

Tuteur IA "Prof Lakay" + Quiz QCM pour les élèves de Terminale (NS4), filières SVT, SES, SMP, LLA.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + Vite (port 5000) |
| Backend | Supabase (DB + Edge Functions) |
| IA | Cascade 6 providers via Edge Function |
| Mobile | Capacitor (APK Android) |
| Dev | Termux + GitHub Actions |

---

## Setup Termux (premier lancement)

```bash
pkg install nodejs git
git clone https://github.com/renelsondenis509-netizen/Gid-NS4.git
cd Gid-NS4
npm install
npm run dev
Variables d'environnement
Fichier .env à la racine (ne jamais commiter) :
VITE_SUPABASE_URL=https://thxtnnjubzucisrujloe.supabase.co
VITE_SUPABASE_ANON_KEY=...
Secrets IA stockés dans Supabase (Dashboard → Edge Functions → Secrets) :
GROQ_API_KEY, SAMBANOVA_API_KEY, OPENROUTER_API_KEY, MISTRAL_API_KEY, LLM7_API_KEY, CF_ACCOUNT_ID, CF_API_TOKEN
Architecture fichiers
src/
├── config.js          # Constantes globales (URL, clés)
├── api.js             # callEdge() + parseApiError()
├── App.jsx            # Router principal + sync offline
├── data/
│   ├── quizData.js        # Merger BASE + NEW
│   ├── quizDataBase.js    # Questions originales
│   ├── quizDataNew.js     # Questions MENFP 2024
│   └── validateQuiz.js    # Validateur schema (npm run validate-quiz)
├── screens/           # 10 écrans (Chat, Quiz, Login...)
├── components/        # UI réutilisables
└── utils/
    ├── idb.js         # IndexedDB (offline + pending scores)
    ├── quiz.js        # Calcul notes, mentions, scores
    └── helpers.js     # shuffleArray, shuffleChoices

supabase/
└── functions/
    └── ask-prof-lakay/
        └── index.ts   # Edge Function : cascade IA + cache + quotas
Commandes quotidiennes
npm run dev              # Démarrer le serveur local
npm run validate-quiz    # Valider quizData avant tout commit
npm run build            # Build prod (validate-quiz inclus)
git push origin master   # Déclenche déploiement Edge Function auto
Déploiement Edge Function
Géré par GitHub Actions (.github/workflows/).
Push sur master → déploiement automatique sur Supabase.
Déploiement manuel si besoin :
supabase functions deploy ask-prof-lakay
Base de données Supabase
Tables principales :
users — comptes élèves
teachers — whitelist enseignants (multi-code école)
question_cache — cache SHA-256 des réponses IA
quiz_scores — historique scores par élève
app_config — configuration dynamique (ex: fallback_order)
Projet ref : thxtnnjubzucisrujloe
Données quiz
25 matières, 1357 questions validées
Validation automatique : npm run validate-quiz
Schema attendu par question :
{ q: string, choices: string[4], answer: 0|1|2|3, note: string }
Roadmap publication Google Play
[ ] Créer keystore APK
[ ] Build AAB signé
[ ] Fiche Play Store (captures, description)
[ ] Publication
EOF
