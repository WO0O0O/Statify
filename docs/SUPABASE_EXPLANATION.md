# Supabase & Backend Architecture Explanation

## 1. How it Works

Your application follows a standard **Client-Server-Database** architecture:

1.  **Frontend (React/Vite)**: Runs in the user's browser. It never connects to the database directly. It sends HTTP requests to your Backend API (e.g., `/auth/login`, `/api/stats`).
2.  **Backend (Flask/Python)**: Runs on the server (currently your machine). It handles logic, authentication, and database interactions.
3.  **Database (Supabase)**: A PostgreSQL database hosted in the cloud.

### The Connection

- Your backend connects to Supabase using the `DATABASE_URL` connection string you added to `.env`.
- It uses a library called `SQLAlchemy` (an ORM) to translate Python class operations (like `user.save()`) into SQL commands (`INSERT INTO users...`).
- **Security**: The connection is encrypted (SSL/TLS). Only your backend (which holds the secret connection string) can access the database directly.

## 2. Your Data

Based on your code (`backend/database/models.py`), your database has two main tables:

### `users` table

Stores user identity and authentication tokens.

- `spotify_id`: Unique ID from Spotify.
- `display_name`, `email`, `profile_image`: Profile info.
- `access_token`, `refresh_token`: **Sensitive**. These allow your app to fetch data from Spotify on behalf of the user.
- `token_expiration`: When the token needs refreshing.

### `user_stats` table

Stores the listening history validation.

- `user_id`: Links to the `users` table.
- `time_range`: (e.g., 'short_term').
- `data_type`: (e.g., 'artists').
- `data`: The actual JSON response from Spotify (stored for caching/history).

## 3. How to See the Data

Since Supabase is just a PostgreSQL database with a nice UI:

1.  Go to your **Supabase Dashboard** (supabase.com).
2.  Open your project (`statify`).
3.  Click on the **Table Editor** icon (looks like a grid/table) on the left sidebar.
4.  You will see `users` and `user_stats` tables listed. Note that they might be empty until you log in again with the new configuration!

## 4. Security & Protection

- **Database Access**: Your database is protected by the password in your connection string. Since you are using a "Direct Connection" or "Pooler" via the backend, your backend has full administrative rights to read/write data.
- **Frontend Access**: The frontend cannot read the DB. It asks the backend. The backend checks `session['user_id']` to ensure a user is logged in before returning their own data (`/api/me`).
- **Spotify Tokens**: stored in the database. If your database were compromised, an attacker could access users' Spotify accounts (read-only scopes usually). Secure your `.env` and Supabase password!
- **Row Level Security (RLS)**: Supabase has a feature called RLS where you can restrict access based on user logic _at the database level_. Currently, your app relies on **Application Level Security** (Flask code checks who is logged in). This is standard for this type of architecture. RLS is more critical if you use Supabase Auth (client-side auth), which you are not (you use Custom Auth via Spotify).
