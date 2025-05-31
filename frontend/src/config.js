/**
 * Application configuration
 * Uses environment variables with fallbacks for local development
 */

// API base URL - uses environment variable if available, falls back to localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5001';

// Frontend base URL
export const FRONTEND_BASE_URL = process.env.REACT_APP_FRONTEND_BASE_URL || 'http://127.0.0.1:3000';

// Spotify API scopes
export const SPOTIFY_SCOPES = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played'
];
