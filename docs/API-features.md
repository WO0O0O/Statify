# Spotify API Features

All spotify API features are listed below. 

| **Feature**                     | **What It Shows**                         | **How to Implement (API Endpoint / Method)**       | **Category / Page**  | **Difficulty** |
| ------------------------------- | ----------------------------------------- | -------------------------------------------------- | -------------------- | -------------- |
| **Top Tracks**                  | User's most listened tracks               | `GET /me/top/tracks` (params: `time_range`)        | Top Stats            | Easy           |
| **Top Artists**                 | Most listened artists                     | `GET /me/top/artists`                              | Top Stats            | Easy           |
| **Top Genres**                  | Aggregated from top artists               | Parse `genres` field from top artists              | Top Stats            | Medium         |
| **Top Albums**                  | Inferred from top tracks                  | Extract `album` from top tracks                    | Top Stats            | Medium         |
| **Audio Features**              | Track-level stats (energy, valence, etc.) | `GET /audio-features?ids=...`                      | Audio Profile        | Medium         |
| **Audio Analysis**              | Detailed beat/section data                | `GET /audio-analysis/{id}`                         | Audio Profile        | Hard           |
| **Recently Played**             | Last 50 played tracks                     | `GET /me/player/recently-played`                   | Listening Habits     | Easy           |
| **Time of Day Habits**          | Listening by hour                         | Extract `played_at` from recently played           | Listening Habits     | Medium         |
| **Day of Week Trends**          | Listening per day                         | Aggregate by `played_at` day                       | Listening Habits     | Medium         |
| **Era Preferences**             | Favorite release decades                  | Use `album.release_date` from tracks               | Listening Habits     | Medium         |
| **Genre Diversity**             | Count of unique genres                    | Unique genres from saved or top tracks             | Library Insights     | Medium         |
| **Saved Tracks**                | All user-liked songs                      | `GET /me/tracks` (paginated)                       | Library Insights     | Easy           |
| **Saved Albums**                | Albums user saved                         | `GET /me/albums`                                   | Library Insights     | Easy           |
| **Saved Shows**                 | Podcasts followed                         | `GET /me/shows`                                    | Library Insights     | Easy           |
| **Playlist List**               | User playlists                            | `GET /me/playlists`                                | Playlist Explorer    | Easy           |
| **Playlist Content**            | Tracks in each playlist                   | `GET /playlists/{playlist_id}/tracks`              | Playlist Explorer    | Easy           |
| **Playlist Stats**              | Avg duration, energy, etc.                | Use `audio-features` for playlist tracks           | Playlist Explorer    | Hard           |
| **Playlist Vibe Score**         | Overall mood/energy                       | Valence/energy avg from features                   | Playlist Explorer    | Medium         |
| **Playlist Generator**          | Create playlist from criteria             | `POST /users/{user_id}/playlists`, then add tracks | Recommendations      | Hard           |
| **Recommendations Engine**      | Suggested tracks                          | `GET /recommendations` with seed tracks/artists    | Recommendations      | Medium         |
| **Musical Personality**         | Listening type e.g. Adventurer            | Use patterns in top track/feature data             | Audio Profile        | Hard           |
| **Radar / Mood Chart**          | Valence, energy, danceability             | Radar chart using `audio-features` data            | Audio Profile        | Medium         |
| **Listening Summary / Wrapped** | Year/month stats                          | Use saved or top tracks + timestamps               | Wrapped/Recap        | Hard           |
| **Compare With Friends**        | Common artists/tracks                     | Cross-check between two users' top lists           | Compare Users        | Hard           |
| **Device Control**              | Play, pause, skip                         | `PUT /me/player/...` (requires Spotify Connect)    | Bonus / Extras       | Medium         |
| **Current Playing Track**       | Now playing info                          | `GET /me/player/currently-playing`                 | Dashboard            | Easy           |
| **User Profile Info**           | Name, profile pic, country                | `GET /me`                                          | Settings / Dashboard | Easy           |
| **Subscription Type**           | Free/Premium                              | From `GET /me` response                            | Settings             | Easy           |
| **Create Playlist**             | Save generated playlists                  | `POST /users/{user_id}/playlists`                  | Playlist Generator   | Medium         |
| **Add to Playlist**             | Insert track(s)                           | `POST /playlists/{playlist_id}/tracks`             | Playlist Generator   | Easy           |
| **Followed Artists**            | Artists user follows                      | `GET /me/following?type=artist`                    | Library Insights     | Easy           |
| **Liked Episodes**              | Saved podcast episodes                    | `GET /me/episodes`                                 | Library Insights     | Easy           |

## Instructions

- Use this table to track which features you want to implement in your application
- Mark features as "To Implement", "In Progress", or "Completed" as you work through them
- Consider the difficulty level when planning your development timeline