import os
import requests
from flask import Blueprint, request, redirect, session, jsonify, current_app, url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from datetime import datetime, timedelta
from database.models import db, User

auth_bp = Blueprint('auth', __name__)

def get_spotify_oauth():
    """Helper to create SpotifyOAuth object"""
    return SpotifyOAuth(
        client_id=current_app.config['SPOTIFY_CLIENT_ID'],
        client_secret=current_app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=current_app.config['SPOTIFY_REDIRECT_URI'],
        scope='user-read-email user-read-private user-top-read user-read-recently-played'
    )

@auth_bp.route('/login')
def login():
    """Redirect user to Spotify authorization page"""
    sp_oauth = get_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@auth_bp.route('/callback')
def callback():
    """Handle the callback from Spotify"""
    sp_oauth = get_spotify_oauth()
    code = request.args.get('code')
    
    if not code:
        return redirect('/error?message=Authorization%20failed')
    
    # Exchange authorization code for access token
    token_info = sp_oauth.get_access_token(code)
    
    if not token_info:
        return redirect('/error?message=Failed%20to%20get%20access%20token')
    
    # Use the access token to get user profile
    sp = spotipy.Spotify(auth=token_info['access_token'])
    user_profile = sp.current_user()
    
    # Check if user exists in database
    user = User.query.filter_by(spotify_id=user_profile['id']).first()
    
    # Calculate token expiration time
    expires_at = datetime.now() + timedelta(seconds=token_info['expires_in'])
    
    if user:
        # Update existing user
        user.access_token = token_info['access_token']
        user.refresh_token = token_info.get('refresh_token', user.refresh_token)
        user.token_expiration = expires_at
        user.display_name = user_profile.get('display_name')
        user.email = user_profile.get('email')
        
        # Get profile image if available
        if user_profile.get('images') and len(user_profile['images']) > 0:
            user.profile_image = user_profile['images'][0]['url']
    else:
        # Create new user
        profile_image = None
        if user_profile.get('images') and len(user_profile['images']) > 0:
            profile_image = user_profile['images'][0]['url']
            
        user = User(
            spotify_id=user_profile['id'],
            display_name=user_profile.get('display_name'),
            email=user_profile.get('email'),
            profile_image=profile_image,
            access_token=token_info['access_token'],
            refresh_token=token_info.get('refresh_token'),
            token_expiration=expires_at
        )
        db.session.add(user)
    
    db.session.commit()
    
    # Create a permanent session for the user
    session.permanent = True
    session['user_id'] = user.id
    session['logged_in'] = True
    
    # Redirect to frontend
    return redirect('http://127.0.0.1:3000/dashboard')

@auth_bp.route('/logout')
def logout():
    """Log out the user"""
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"})

@auth_bp.route('/refresh-token')
def refresh_token():
    """Refresh the access token"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    user = User.query.get(user_id)
    if not user or not user.refresh_token:
        return jsonify({"error": "Invalid user or missing refresh token"}), 400
    
    sp_oauth = get_spotify_oauth()
    token_info = sp_oauth.refresh_access_token(user.refresh_token)
    
    # Update user's tokens
    user.access_token = token_info['access_token']
    if token_info.get('refresh_token'):
        user.refresh_token = token_info['refresh_token']
    
    # Calculate new expiration time
    user.token_expiration = datetime.now() + timedelta(seconds=token_info['expires_in'])
    db.session.commit()
    
    return jsonify({"message": "Token refreshed successfully"})

@auth_bp.route('/me')
def get_current_user():
    """Get the current authenticated user"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict())
