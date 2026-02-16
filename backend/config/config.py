import os
import logging
from dotenv import load_dotenv

# Load environment variables from backend/.env explicitly
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Config:
    """Base configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///statify.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Load all sensitive values from environment variables with no fallbacks
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
    SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
    SPOTIFY_REDIRECT_URI = os.environ.get('SPOTIFY_REDIRECT_URI')
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://127.0.0.1:3000')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000')
    TOKEN_ENCRYPTION_KEY = os.environ.get('TOKEN_ENCRYPTION_KEY')
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    if not Config.SECRET_KEY:
        SECRET_KEY = 'dev-only-insecure-key-do-not-use-in-prod'
        logging.getLogger(__name__).warning(
            "SECRET_KEY not set — using insecure dev default. Set SECRET_KEY in .env for production."
        )

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///statify.db'

    if not Config.SECRET_KEY:
        raise RuntimeError(
            "SECRET_KEY must be set in production. "
            "Add SECRET_KEY to your environment variables or .env file."
        )


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}
