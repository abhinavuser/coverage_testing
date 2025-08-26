from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 
        'sqlite:///coverage_test.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Enable CORS for frontend and testing
    CORS(app, origins=[
        "http://localhost:3000",    # Next.js development
        "http://127.0.0.1:3000",   # Alternative localhost
        "http://localhost:3001",    # Alternative port
        "*"                         # Allow all for testing (remove in production)
    ], 
    allow_headers=["Content-Type", "Authorization", "Accept"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app