# Gid NS4 — Tuteur IA pour le Baccalauréat haïtien

Application éducative "Prof Lakay" pour les élèves de Terminale (NS4), filières SVT, SES, SMP, LLA.

## Stack
- Frontend : React + Vite
- Backend : Supabase (DB + Edge Functions)
- IA : Cascade 6 providers (Groq, SambaNova, OpenRouter, Mistral, LLM7, Cloudflare)
- Mobile : Capacitor (Android)
- CI/CD : GitHub Actions → Supabase

## Démarrage rapide (Termux)
Cloner le repo, installer les dépendances et lancer le serveur local :
    pkg install nodejs git
    git clone https://github.com/renelsondenis509-netizen/Gid-NS4.git
    cd Gid-NS4 && npm install && npm run dev

## Scripts
| Commande | Action |
|----------|--------|
| npm run dev | Serveur local |
| npm run validate-quiz | Valider les questions |
| npm run build | Build production |
| git push origin master | Déploie l'Edge Function |
