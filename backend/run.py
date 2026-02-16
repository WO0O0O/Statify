import os
import sys

# Add the parent directory to sys.path to make imports work
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))  
from app import create_app

# Get environment (default to development for local convenience)
env = os.environ.get('FLASK_ENV', 'development')
app = create_app(env)

if __name__ == '__main__':
    # Enable debug only when explicitly in development
    debug_mode = env == 'development' and os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    # Use environment variable for port if available
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
