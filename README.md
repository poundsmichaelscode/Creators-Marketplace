# Creators Marketplace MVP (Patched)

This patched archive includes:
- Docker port-conflict fix by removing host bindings for Postgres and Redis
- safer Docker startup with DB wait + makemigrations + migrate
- improved frontend API error handling
- polished signup and login forms
- configurable social auth buttons for Google, Facebook, and GitHub
- creator product management UI
- landing page builder UI with publish flow
- AI tools frontend with generation history

## Run locally

1. Copy `backend/.env.example` to `backend/.env`
2. Copy `frontend/.env.example` to `frontend/.env.local`
3. Run:

```bash
 docker compose up --build
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- API docs: http://localhost:8000/api/docs/

## Social sign-in
Social buttons are wired to environment-configurable provider URLs:
- `GOOGLE_AUTH_URL`
- `FACEBOOK_AUTH_URL`
- `GITHUB_AUTH_URL`
- `NEXT_PUBLIC_GOOGLE_AUTH_URL`
- `NEXT_PUBLIC_FACEBOOK_AUTH_URL`
- `NEXT_PUBLIC_GITHUB_AUTH_URL`

This patch adds the UI and provider-discovery endpoint so you can plug in a real OAuth service quickly.
