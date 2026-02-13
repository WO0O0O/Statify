# Statify Public Deployment Plan

## Goal

Launch Statify so anyone can use it at your subdomain, while:

- Keeping Spotify access **read-only**
- Storing user data only if needed, and doing so securely
- Using free hosting where possible

---

## Recommended Free Architecture

Given your current stack (`React + Vite` frontend, `Flask` backend), the best free path is:

- **Frontend**: Vercel (free)
- **Backend API**: Render Web Service (free tier)
- **Database**: Start with SQLite only for early testing; move to a managed free Postgres when you need reliability
- **Domain setup**:
  - `statify.yourdomain.com` → Vercel (frontend)
  - `api.statify.yourdomain.com` → Render (backend)

### Why not GitHub Pages for this project?

GitHub Pages is static-only. Your Flask OAuth/API server must run somewhere dynamic, so Pages alone is not enough.

---

## Security + Privacy Contract (what to enforce)

### Spotify permissions (scopes)

Use the **minimum read scopes only**:

- `user-read-email`
- `user-read-private`
- `user-top-read`
- `user-read-recently-played` (only if needed)

Avoid any write scopes like:

- `playlist-modify-public`
- `playlist-modify-private`
- `user-library-modify`

### Data handling

Store only what you need:

- Spotify user ID
- Optional display/profile metadata
- Cached analytics snapshots
- OAuth tokens (encrypted/secured server-side)

Do **not** store raw secrets client-side. Never expose client secret in frontend.

### Session/token security

In production, set:

- `SESSION_COOKIE_SECURE=True`
- `SESSION_COOKIE_HTTPONLY=True`
- `SESSION_COOKIE_SAMESITE='None'` (if frontend/backed are on different subdomains)
- HTTPS only

Also add:

- Strict CORS allowlist (only your frontend domain)
- CSRF protection for auth-sensitive endpoints
- Short-lived access tokens + refresh flow

---

## Phase 0 — Prep in GitHub

1. Ensure your latest code is pushed to `dev` (or create `main` for production deploys).
2. Add/update `.env.example` with all required env vars (no secrets).
3. Add backend production dependencies if missing:
   - `gunicorn`
4. Confirm backend entrypoint for cloud runtime (`backend/run.py` exists ✅).

---

## Phase 1 — Spotify Developer Dashboard Setup

In Spotify Developer Dashboard:

1. Create/choose your app.
2. Add redirect URIs for:
   - Local dev (if needed)
   - Production backend callback (e.g. `https://api.statify.yourdomain.com/auth/callback`)
3. Save:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`

Keep these only in backend environment variables.

---

## Phase 2 — Backend on Render (Free)

1. Create new **Web Service** on Render from your GitHub repo.
2. Configure:
   - Root directory: `backend`
   - Build command: install from `requirements.txt`
   - Start command: run with Gunicorn, serving your Flask app
3. Environment variables (Render):
   - `FLASK_ENV=production`
   - `FLASK_DEBUG=False`
   - `SECRET_KEY=<strong-random-secret>`
   - `SPOTIFY_CLIENT_ID=<...>`
   - `SPOTIFY_CLIENT_SECRET=<...>`
   - `SPOTIFY_REDIRECT_URI=https://api.statify.yourdomain.com/auth/callback`
   - `FRONTEND_URL=https://statify.yourdomain.com`
4. Update Flask config for production:
   - secure cookies
   - production CORS allowlist from `FRONTEND_URL`
   - no localhost defaults in production
5. Verify API health endpoint and OAuth flow from deployed URL.

> Note: Render free instances may sleep after inactivity; first request can be slow.

---

## Phase 3 — Frontend on Vercel (Free)

1. Import `frontend` project in Vercel.
2. Framework preset: Vite.
3. Build settings:
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. Set frontend env var:
   - `VITE_API_BASE_URL=https://api.statify.yourdomain.com`
5. Deploy and verify login button initiates Spotify OAuth via backend.

---

## Phase 4 — Custom Subdomain DNS

At your DNS provider:

1. Point `statify.yourdomain.com` to Vercel target (CNAME).
2. Point `api.statify.yourdomain.com` to Render target (CNAME).
3. Wait for SSL cert issuance on both platforms.
4. Re-test OAuth redirect URIs after DNS is live.

---

## Phase 5 — Production Hardening (must-do before public)

### Backend config changes

- Replace current dev CORS list (`localhost`) with env-driven list.
- Set `SESSION_COOKIE_SECURE=True` in production.
- Use explicit `SESSION_COOKIE_DOMAIN` if needed for shared subdomains.
- Add rate limiting for auth/API endpoints.
- Add structured logging and error capture.

### Data + DB

- If usage grows, move from SQLite to managed Postgres.
- Add token encryption-at-rest strategy (or secure vault-backed storage).
- Add retention policy (e.g., purge inactive user data after N days).

### Legal/trust

- Add `Privacy Policy` page.
- Add `Terms` page.
- Explain what data you store and why.

---

## Phase 6 — Launch Checklist

- [ ] HTTPS works on both subdomains
- [ ] Spotify login works in private browser session
- [ ] Only read scopes are requested
- [ ] No client secret exposed in frontend bundles
- [ ] CORS only allows frontend production domain
- [ ] Sessions work reliably after OAuth callback
- [ ] Basic monitoring/logs enabled
- [ ] Privacy policy link visible in UI/footer

---

## Suggested Rollout Strategy

1. **Soft launch** to a few friends for 48h
2. Fix auth/session edge cases
3. Open public access
4. Monitor errors + API latency daily for first week

---

## Free Hosting Decision Summary

- **Best fit now**: Vercel (frontend) + Render (backend)
- **GitHub Pages alone**: not suitable due to Flask/OAuth backend requirement
- **Future upgrade path**: keep frontend on Vercel, move backend to paid always-on instance when traffic grows

---

## Nice-to-have follow-ups

- Add CI checks (lint/test) before deploy
- Add `/health` endpoint and uptime monitor
- Add analytics for page usage and auth conversion
- Add caching layer for Spotify API responses to reduce rate-limit issues
