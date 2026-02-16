from flask import Blueprint, jsonify, request, session, current_app
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from datetime import datetime, timedelta
from database.models import db, User, UserStats

api_bp = Blueprint('api', __name__)

def get_spotify_client(user_id):
    """Helper to get an authenticated Spotify client for a user.
    Auto-refreshes the token if it has expired."""
    user = User.query.get(user_id)
    if not user or not user.access_token:
        return None

    # Check if token is expired (or will expire in the next 60 seconds)
    if not user.token_expiration or user.token_expiration < datetime.now() + timedelta(seconds=60):
        if not user.refresh_token:
            current_app.logger.warning("Token expired and no refresh token available for user %s", user_id)
            return None

        try:
            sp_oauth = SpotifyOAuth(
                client_id=current_app.config["SPOTIFY_CLIENT_ID"],
                client_secret=current_app.config["SPOTIFY_CLIENT_SECRET"],
                redirect_uri=current_app.config["SPOTIFY_REDIRECT_URI"],
            )
            token_info = sp_oauth.refresh_access_token(user.refresh_token)

            user.access_token = token_info["access_token"]
            if token_info.get("refresh_token"):
                user.refresh_token = token_info["refresh_token"]
            user.token_expiration = datetime.now() + timedelta(seconds=token_info["expires_in"])
            db.session.commit()

            current_app.logger.info("Auto-refreshed token for user %s", user_id)
        except Exception:
            current_app.logger.exception("Failed to auto-refresh token for user %s", user_id)
            return None

    return spotipy.Spotify(auth=user.access_token)


@api_bp.route('/profile')
def get_profile():
    """Get the user's Spotify profile"""
    user_id = session.get('user_id')
    current_app.logger.info(f"GET /profile requested by Session User ID: {user_id}")
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    sp = get_spotify_client(user_id)
    if not sp:
        return jsonify({"error": "Failed to create Spotify client"}), 500
    
    try:
        profile = sp.current_user()
        return jsonify(profile)
    except Exception as e:
        current_app.logger.exception("Failed to fetch user profile")
        return jsonify({"error": "An internal error occurred"}), 500


@api_bp.route('/top/<item_type>')
def get_top_items(item_type):
    """Get user's top artists or tracks
    
    Args:
        item_type: 'artists' or 'tracks'
    """
    if item_type not in ['artists', 'tracks']:
        return jsonify({"error": "Invalid item type. Must be 'artists' or 'tracks'"}), 400
    
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    # Get optional parameters
    time_range = request.args.get('time_range', 'medium_term')  # short_term, medium_term, long_term
    limit = request.args.get('limit', 20, type=int)
    
    sp = get_spotify_client(user_id)
    if not sp:
        return jsonify({"error": "Failed to create Spotify client"}), 500
    
    try:
        if item_type == 'artists':
            items = sp.current_user_top_artists(limit=limit, time_range=time_range)
        else:  # tracks
            items = sp.current_user_top_tracks(limit=limit, time_range=time_range)
        
        # Store in database
        user = User.query.get(user_id)
        stats = UserStats(
            user_id=user.id,
            time_range=time_range,
            data_type=item_type,
            data=items
        )
        db.session.add(stats)
        db.session.commit()
        
        return jsonify(items)
    except Exception as e:
        current_app.logger.exception("Failed to fetch top %s", item_type)
        return jsonify({"error": "An internal error occurred"}), 500


@api_bp.route('/top-genres')
def get_top_genres():
    """Derive top genres from the user's top artists"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    time_range = request.args.get('time_range', 'medium_term')
    limit = request.args.get('limit', 50, type=int)

    sp = get_spotify_client(user_id)
    if not sp:
        return jsonify({"error": "Failed to create Spotify client"}), 500

    try:
        # Fetch top artists (up to 50) to get a good genre sample
        artists = sp.current_user_top_artists(limit=limit, time_range=time_range)
        
        # Count genre occurrences, weighted by artist ranking
        genre_counts = {}
        for i, artist in enumerate(artists.get('items', [])):
            weight = limit - i  # higher-ranked artists contribute more
            for genre in artist.get('genres', []):
                genre_counts[genre] = genre_counts.get(genre, 0) + weight

        # Sort by count descending
        sorted_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)

        return jsonify({
            "genres": [{"name": name, "count": count} for name, count in sorted_genres],
            "total_artists_sampled": len(artists.get('items', []))
        })
    except Exception as e:
        current_app.logger.exception("Failed to fetch top genres")
        return jsonify({"error": "An internal error occurred"}), 500


@api_bp.route('/recently-played')
def get_recently_played():
    """Get user's recently played tracks"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    limit = request.args.get('limit', 20, type=int)
    
    sp = get_spotify_client(user_id)
    if not sp:
        return jsonify({"error": "Failed to create Spotify client"}), 500
    
    try:
        items = sp.current_user_recently_played(limit=limit)
        return jsonify(items)
    except Exception as e:
        current_app.logger.exception("Failed to fetch recently played")
        return jsonify({"error": "An internal error occurred"}), 500


@api_bp.route('/stats')
def get_saved_stats():
    """Get user's saved statistics from the database"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    data_type = request.args.get('type')
    time_range = request.args.get('time_range')
    
    query = UserStats.query.filter_by(user_id=user_id)
    
    if data_type:
        query = query.filter_by(data_type=data_type)
    if time_range:
        query = query.filter_by(time_range=time_range)
        
    stats = query.order_by(UserStats.created_at.desc()).all()
    
    result = []
    for stat in stats:
        result.append({
            'id': stat.id,
            'data_type': stat.data_type,
            'time_range': stat.time_range,
            'data': stat.data,
            'created_at': stat.created_at.isoformat()
        })
    
    return jsonify(result)
