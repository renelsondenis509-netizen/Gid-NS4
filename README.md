# 🎓 Gid NS4 — Tuteur IA pour le Baccalauréat haïtien

Application éducative "Prof Lakay" pour les élèves de Terminale (NS4), filières SVT, SES, SMP, LLA.

##  Démarrage rapide (Termux)

~~~bash
pkg install nodejs git
git clone https://github.com/renelsondenis509-netizen/Gid-NS4.git
cd Gid-NS4 && npm install && npm run dev
~~~

## ⚙️ Configuration

Crée un fichier `.env` à la racine :

~~~env
VITE_SUPABASE_URL=https://ton-projet.supabase.co
VITE_SUPABASE_ANON_KEY=ton-anon-key
~~~

Variables Edge Function (à configurer dans Supabase Dashboard → Settings → Secrets) :
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_SECRET`
- Clés API des fournisseurs IA (Groq, SambaNova, etc.)

## 📦 Scripts

| Commande | Action |
|----------|--------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm run validate-quiz` | Valide les questions QCM |
| `git push origin master` | Déclenche le déploiement automatique |

## ️ Structure du projet

~~~text
Gid-NS4/
├── src/                    # Frontend React
│   ├── screens/            # Écrans de l'application
│   ├── components/         # Composants UI réutilisables
│   ├── utils/              # Helpers (cache, IndexedDB, etc.)
│   └── api.js              # Appels vers l'Edge Function
├── supabase/
│   └── functions/
│       └── ask-prof-lakay/ # Edge Function principale
└── .github/workflows/      # Configuration CI/CD
~~~

## 📄 Licence

MIT © Renelson Denis

## 📧 Contact

Renelson Denis - [GitHub](https://github.com/renelsondenis509-netizen)
