from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from database.encryption import encrypt_token, decrypt_token

db = SQLAlchemy()

class User(db.Model):
    """User model for storing user data"""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    spotify_id = db.Column(db.String(64), unique=True, nullable=False)
    display_name = db.Column(db.String(128))
    email = db.Column(db.String(128))
    profile_image = db.Column(db.Text)
    _access_token = db.Column('access_token', db.Text)
    _refresh_token = db.Column('refresh_token', db.Text)
    token_expiration = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def access_token(self):
        return decrypt_token(self._access_token)

    @access_token.setter
    def access_token(self, value):
        self._access_token = encrypt_token(value)

    @property
    def refresh_token(self):
        return decrypt_token(self._refresh_token)

    @refresh_token.setter
    def refresh_token(self, value):
        self._refresh_token = encrypt_token(value)

    def __init__(self, spotify_id, display_name=None, email=None, profile_image=None,
                 access_token=None, refresh_token=None, token_expiration=None):
        self.spotify_id = spotify_id
        self.display_name = display_name
        self.email = email
        self.profile_image = profile_image
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.token_expiration = token_expiration

    def __repr__(self):
        return f'<User {self.display_name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'spotify_id': self.spotify_id,
            'display_name': self.display_name,
            'email': self.email,
            'profile_image': self.profile_image,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class UserStats(db.Model):
    """Model for storing user's Spotify statistics"""
    __tablename__ = 'user_stats'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    time_range = db.Column(db.String(16), nullable=False)  # short_term, medium_term, long_term
    data_type = db.Column(db.String(16), nullable=False)  # artists, tracks, genres
    data = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('stats', lazy=True))

    def __init__(self, user_id, time_range, data_type, data):
        self.user_id = user_id
        self.time_range = time_range
        self.data_type = data_type
        self.data = data

    def __repr__(self):
        return f'<UserStats {self.user_id} {self.time_range} {self.data_type}>'

