Setting up Supabase for Statify — concise steps

1. Create a Supabase project

- Signup at https://supabase.com and create a new project (name: `statify`).
- Set a strong database password and note the region.

2. Get the connection URI

- In Supabase dashboard → Project Settings → Database → Connection string → URI.
- Copy the URI (format: `postgresql://...:6543/postgres`). Use the port `6543`.

3. Add the Postgres driver

- Add this to `backend/requirements.txt` if it isn’t already:

```
psycopg2-binary==2.9.10
```

4. Configure production to use the DB

- In `backend/config/config.py`, ensure `ProductionConfig` sets `SQLALCHEMY_DATABASE_URI` from `DATABASE_URL`:

```python
class ProductionConfig(Config):
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
```

5. Set the environment variable on Render

- In Render → your `statify-backend` service → Environment, add:
  - `DATABASE_URL` = the Supabase URI you copied.
- Save changes and let Render redeploy.

6. Verify the deployment

- Visit `https://<your-render-app>/auth/login` and perform a login.
- Confirm a row appears in Supabase → Table Editor → `users`.

Local dev

- Local development uses SQLite by default (`DevelopmentConfig`).
- To test with Supabase locally, add `DATABASE_URL` to `backend/.env` and set `FLASK_ENV=production`.

Summary of required code changes

- Ensure `psycopg2-binary` is in `backend/requirements.txt`.
- Ensure `ProductionConfig` reads `DATABASE_URL`.
- Add `DATABASE_URL` to Render environment variables.
