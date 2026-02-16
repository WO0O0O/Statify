# Statify — Future Improvements

Things to consider if the project scales or before a public launch.

## Security

- [ ] **Scoped RLS Policies (v2)**: Replace the current blanket `USING (true)` RLS policies with per-user scoped policies that check `current_setting('app.current_user_id')`. The updated SQL is already written in `backend/database/security.sql` — requires wiring up the backend to call `SET LOCAL app.current_user_id` per-request. See [security.sql](../backend/database/security.sql) for the full script.
- [ ] **Token Encryption Key rotation**: Add support for rotating `TOKEN_ENCRYPTION_KEY` without invalidating existing tokens (e.g. multi-key decryption).
- [ ] **HTTPS-only `force_login` cookie**: Set `secure=True` on the `force_login` cookie once deployed behind HTTPS.

## Performance

- [ ] **Deduplicate UserStats**: `/api/top/<type>` inserts a new `user_stats` row on every call with no deduplication — add upsert logic or a cleanup cron.
- [ ] **Caching layer**: Add Redis or in-memory caching for Spotify API responses to reduce rate-limit issues.
- [x] **Auto-refresh expired tokens**: ~~Check `token_expiration` before creating a Spotify client and auto-refresh if expired.~~ Done in v1.1.0.

## Infrastructure

- [ ] **Add security headers**: Use `flask-talisman` or `after_request` to set `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- [ ] **Tighten CORS patterns**: Change the CORS resource pattern from `r"/*"` to `r"/api/*"` and `r"/auth/*"`.
- [ ] **CI/CD pipeline**: Add lint/test checks before deploy.
- [ ] **Uptime monitoring**: Add a `/health` endpoint and external monitor.
- [ ] **Structured logging**: Replace print statements with proper structured logging.

## iPhone/Safari Compatibility (ITP)

- [ ] **Problem**: Safari's Intelligent Tracking Prevention (ITP) blocks the session cookie in cross-domain setups (frontend on `wo0.dev`, backend on `onrender.com`). This causes a login loop on iPhone.
- [ ] **Short-term Fix**: Enable **Partitioned Cookies (CHIPS)**. Add `Partitioned` attribute to the session cookie so Safari allows it in a cross-site context.
- [ ] **Long-term Fix**: Move backend to a subdomain (e.g., `api.statify.wo0.dev`). This makes the cookie "first-party" and universally accepted by all browsers without workarounds.

## Legal

- [ ] **Privacy Policy page**: Explain what data is stored and why.
- [ ] **Terms of Service page**.
