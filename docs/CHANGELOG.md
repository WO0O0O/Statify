# Changelog

All notable changes to the Statify project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

# v1.1.0 — Security Hardening (Critical Fixes)

### Security

- **Encrypted OAuth Tokens at Rest**: Spotify `access_token` and `refresh_token` are now encrypted using Fernet symmetric encryption before being stored in the database. If the database is ever compromised, tokens are no longer readable. Encryption is powered by a new `TOKEN_ENCRYPTION_KEY` environment variable. Legacy plaintext tokens are handled gracefully — users simply re-encrypt on their next login.
  - New file: `backend/database/encryption.py`
  - Modified: `backend/database/models.py` (property-based encrypt-on-write, decrypt-on-read)
  - New dependency: `cryptography==44.0.0`

- **OAuth CSRF Protection (`state` parameter)**: The OAuth login flow now generates a cryptographically random `state` token, stores it in the server-side session, and validates it on callback. This prevents CSRF attacks where an attacker could trick a user into linking the attacker's Spotify account. Invalid or missing state values now return a `403 Forbidden`.
  - Modified: `backend/app/auth.py` (`/auth/login` and `/auth/callback`)

- **Removed Exception Leaking**: All API error responses previously returned raw Python exception messages (`str(e)`), which could expose internal paths, library versions, SQL errors, or token fragments. Error responses now return a generic `"An internal error occurred"` message, while full tracebacks are logged server-side via `current_app.logger.exception()` for debugging.
  - Modified: `backend/app/api.py` (all 4 exception handlers)

- **`SECRET_KEY` Validation**: Flask's `SECRET_KEY` is used to sign session cookies. If unset, sessions become unsigned and trivially forgeable. `ProductionConfig` now raises a `RuntimeError` on startup if `SECRET_KEY` is missing, preventing the app from running with unsigned sessions. `DevelopmentConfig` falls back to a hardcoded dev-only key with a log warning.
  - Modified: `backend/config/config.py`

- **Rate Limiting**: Added `flask-limiter` to protect auth endpoints from brute-force and flooding attacks. Global defaults of 200 requests/day and 50/hour are applied, with stricter per-route limits: `/auth/login` and `/auth/callback` are limited to 10 requests/minute, `/auth/refresh-token` to 20/minute. Exceeded limits return `429 Too Many Requests`.
  - Modified: `backend/app/__init__.py` (limiter initialisation)
  - Modified: `backend/app/auth.py` (per-route decorators)
  - New dependency: `flask-limiter[memory]==3.12`

- **Session Fixation Prevention**: The server-side session is now cleared and regenerated after successful OAuth authentication. Previously, the pre-auth session cookie persisted, allowing an attacker who could set a session cookie before login to hijack the authenticated session.
  - Modified: `backend/app/auth.py` (`/auth/callback`)

- **Secure `force_login` Cookie**: The `force_login` cookie set during logout now includes `httponly=True` and `samesite='Lax'` flags, preventing JavaScript access and cross-site sending.
  - Modified: `backend/app/auth.py` (`/auth/logout`)

- **Auto-Refresh Expired Tokens**: The Spotify client helper now checks `token_expiration` before each API call. If the token is expired (or about to expire within 60 seconds), it automatically refreshes using the stored `refresh_token` — users no longer hit errors when their hourly Spotify token expires.
  - Modified: `backend/app/api.py` (`get_spotify_client`)

# v1.0.0

### Security

- **Hardened Database Security**: Implemented Row Level Security (RLS) on `users` and `user_stats` tables.
- **Service Role**: Replaced superuser `postgres` connection with a restricted `statify_service` role effectively implementing the Principle of Least Privilege.
- **Environment**: Updated connection handling to support secure Supabase connections via Transaction Pooler.

### Backend

- **Supabase Integration**: Fully integrated Supabase (PostgreSQL) as the primary database, replacing local SQLite.
- **Connection Reliability**: Configured app to use Supabase Transaction Pooler (port 6543) for IPv4 compatibility.
- **Startup Stability**: Updated `run.py` and `config.py` to handle missing environment variables gracefully (falling back to SQLite if `DATABASE_URL` is absent in production configuration).

### Frontend

- **Vite Migration**: Migrated build system from Create React App to Vite for faster development and builds.
- **React 18**: Upgraded to React 18 and updated root rendering API.
- **Dependency Cleanup**: Removed deprecated dependencies (`react-scripts`, `web-vitals`) and fixed high-severity vulnerabilities.
- **Configuration**: Updated environment variable access from `process.env` to `import.meta.env`.
