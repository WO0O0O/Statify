-- SECURITY HARDENING SCRIPT (v2 — Scoped RLS)
-- Run this in the Supabase SQL Editor
-- ⚠️  If you already ran the v1 script, run the MIGRATION section at the bottom first.

-- 1. Create a dedicated role for the backend service (skip if already done)
-- REPLACE 'change_me_to_strong_password' WITH A REAL STRONG PASSWORD!
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'statify_service') THEN
        CREATE ROLE statify_service WITH LOGIN PASSWORD 'change_me_to_strong_password' NOINHERIT;
    END IF;
END
$$;

-- 2. Grant permissions to the new role
GRANT CONNECT ON DATABASE postgres TO statify_service;
GRANT USAGE ON SCHEMA public TO statify_service;

-- Allow selecting, inserting, updating, and deleting
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO statify_service;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO statify_service;

-- Ensure future tables also get these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO statify_service;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO statify_service;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- 4. Create Scoped Policies
-- The backend MUST call the following at the start of each request:
--    SET LOCAL app.current_user_id = '<spotify_id>';
-- This sets a per-transaction variable that RLS policies check against.

-- ── users table ──

-- Allow inserting new users (no restriction — new users don't exist yet)
CREATE POLICY "Service can insert users"
ON users FOR INSERT
TO statify_service
WITH CHECK (true);

-- Restrict read/update/delete to the current user's own row
CREATE POLICY "Service can access own user row"
ON users FOR SELECT
TO statify_service
USING (spotify_id = current_setting('app.current_user_id', true));

CREATE POLICY "Service can update own user row"
ON users FOR UPDATE
TO statify_service
USING (spotify_id = current_setting('app.current_user_id', true))
WITH CHECK (spotify_id = current_setting('app.current_user_id', true));

CREATE POLICY "Service can delete own user row"
ON users FOR DELETE
TO statify_service
USING (spotify_id = current_setting('app.current_user_id', true));

-- ── user_stats table ──

-- Allow inserting stats for the current user only
CREATE POLICY "Service can insert own stats"
ON user_stats FOR INSERT
TO statify_service
WITH CHECK (
    user_id = (SELECT id FROM users WHERE spotify_id = current_setting('app.current_user_id', true))
);

-- Restrict read/update/delete to stats belonging to the current user
CREATE POLICY "Service can access own stats"
ON user_stats FOR SELECT
TO statify_service
USING (
    user_id = (SELECT id FROM users WHERE spotify_id = current_setting('app.current_user_id', true))
);

CREATE POLICY "Service can update own stats"
ON user_stats FOR UPDATE
TO statify_service
USING (
    user_id = (SELECT id FROM users WHERE spotify_id = current_setting('app.current_user_id', true))
)
WITH CHECK (
    user_id = (SELECT id FROM users WHERE spotify_id = current_setting('app.current_user_id', true))
);

CREATE POLICY "Service can delete own stats"
ON user_stats FOR DELETE
TO statify_service
USING (
    user_id = (SELECT id FROM users WHERE spotify_id = current_setting('app.current_user_id', true))
);


-- ═══════════════════════════════════════════════════════
-- MIGRATION: Drop old blanket policies (run BEFORE the above)
-- ═══════════════════════════════════════════════════════
-- If you applied the v1 security.sql, run these first:
--
-- DROP POLICY IF EXISTS "Service role key access to users" ON users;
-- DROP POLICY IF EXISTS "Service role key access to user_stats" ON user_stats;

-- NOTE: The 'postgres' superuser BYPASSES RLS.
-- To see RLS in action, your backend MUST connect as 'statify_service'
-- and call SET LOCAL app.current_user_id before each query.
