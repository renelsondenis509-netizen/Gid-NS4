# Gid NS4 — Tuteur IA pour le Baccalauréat haïtien

Application éducative "Prof Lakay" pour les élèves de Terminale (NS4), filières SVT, SES, SMP, LLA.

## Stack
- Frontend : React + Vite + Tailwind
- Backend : Supabase (DB + Edge Functions)
- IA : Cascade 6 providers (Groq, SambaNova, OpenRouter, Mistral, LLM7, Cloudflare)
- Mobile : Capacitor (Android)
- CI/CD : GitHub Actions → Supabase

## Démarrage rapide (Termux)
    pkg install nodejs git
    git clone https://github.com/renelsondenis509-netizen/Gid-NS4.git
    cd Gid-NS4 && npm install && npm run dev

## Configuration
Crée un fichier .env à la racine :
    VITE_SUPABASE_URL=https://ton-projet.supabase.co
    VITE_SUPABASE_ANON_KEY=ton-anon-key

Variables Edge Function (Supabase Dashboard → Settings → Secrets) :
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_SECRET
- ADMIN_PHONE
- Clés API des fournisseurs IA (Groq, SambaNova, etc.)

## Scripts
| Commande | Action |
|----------|--------|
| npm run dev | Serveur local |
| npm run build | Build production |
| npm run validate-quiz | Valider les 1450+ questions |
| git push origin master | Déploie l'Edge Function |

## Contenu
- 1450+ questions QCM sur 26 matières (SVT, SES, SMP, LLA)
- Système freemium (3 jours / 3 scans par jour)
- Leaderboard par école et universel
- Dashboard directeur avec export PDF
- Notifications locales (Capacitor)
- Mode hors-ligne avec sync automatique

## Publication Android
L'APK/AAB est signé avec un keystore dédié et publié sur Google Play Store.
