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
| **Era Preferences**             | Favorite release decades                  | Use `album.release_date` from tracks               | Listening Habits     | Medium         |
| **Genre Diversity**             | Count of unique genres                    | Unique genres from saved or top tracks             | Library Insights     | Medium         |
| **Playlist Vibe Score**         | Overall mood/energy                       | Valence/energy avg from features                   | Playlist Explorer    | Medium         |
| **Recommendations Engine**      | Suggested tracks                          | `GET /recommendations` with seed tracks/artists    | Recommendations      | Medium         |
| **Radar / Mood Chart**          | Valence, energy, danceability             | Radar chart using `audio-features` data            | Audio Profile        | Medium         |
| **Listening Summary / Wrapped** | Year/month stats                          | Use saved or top tracks + timestamps               | Wrapped/Recap        | Hard           |
| **User Profile Info**           | Name, profile pic, country                | `GET /me`                                          | Settings / Dashboard | Easy           |

## Instructions

- Use this table to track which features you want to implement in your application
- Mark features as "To Implement", "In Progress", or "Completed" as you work through them
- Consider the difficulty level when planning your development timeline