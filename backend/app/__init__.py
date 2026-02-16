from flask import Flask, send_from_directory
import os
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from database.models import db
from config.config import config
from datetime import timedelta

# Initialise limiter at module level so blueprints can import it
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)


def create_app(config_name='default'):
    """Factory pattern to create Flask app"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Apply ProxyFix to handle Render's forwarded headers
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    
    # Configure session to be more secure but work across domains
    app.config['SESSION_COOKIE_SECURE'] = app.config.get('SESSION_COOKIE_SECURE', False)
    app.config['SESSION_COOKIE_HTTPONLY'] = app.config.get('SESSION_COOKIE_HTTPONLY', True)
    app.config['SESSION_COOKIE_SAMESITE'] = app.config.get('SESSION_COOKIE_SAMESITE', 'Lax')
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)  # 1 day session
    
    # Initialize extensions
    db.init_app(app)
    limiter.init_app(app)
    
    # Configure CORS to allow credentials
    cors_origins = [origin.strip() for origin in app.config.get('CORS_ORIGINS', '').split(',') if origin.strip()]
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": cors_origins}})
    
    # Register blueprints
    from app.auth import auth_bp
    from app.api import api_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Add after_request handler for CORS headers (without duplicating credentials header)
    @app.after_request
    def after_request(response):
        # Only add these headers, not the credentials one which is already set by flask-cors
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    # Serve React Frontend
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return app.send_static_file(path)
        return app.send_static_file('index.html')

    return app

