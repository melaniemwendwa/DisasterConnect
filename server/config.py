# Standard library imports
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, 'uploads') 


app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')
app.config['SECRET_KEY'] = app.secret_key

# Session configuration for localhost development
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_DOMAIN'] = None  # Allow localhost

print(f"[config] SECRET_KEY set: {bool(app.secret_key)}")

# Database configuration
raw_uri = os.getenv("DATABASE_URL")

if raw_uri:
    # Production: Use PostgreSQL from Render
    print(f"⚙️ Raw DATABASE_URL from environment: {raw_uri[:20]}...{raw_uri[-20:]}")
    print(f"🔍 URL starts with: '{raw_uri[:15]}'")
    
    # Normalize it for SQLAlchemy 2.x (requires driver specification)
    # Using psycopg (v3) which has better Python 3.11+ support
    # Force replacement - handle both postgres:// and postgresql://
    if "postgres://" in raw_uri and "postgresql+psycopg://" not in raw_uri:
        # Replace any variant of postgres:// with postgresql+psycopg://
        db_url = raw_uri.replace("postgres://", "postgresql+psycopg://", 1)
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
        print(f"🔄 Forced replacement to postgresql+psycopg://")
    else:
        db_url = raw_uri
        print("⚠️  No replacement needed")
    
    # Verify protocol is correct
    protocol = db_url.split('://')[0] + '://'
    print(f"✅ Final protocol: {protocol}")
    
    # Show connection info (mask password)
    if '@' in db_url:
        host_and_db = db_url.split('@')[1]
        print(f"✅ Connected to: {host_and_db}")
else:
    # Local development: Use SQLite
    db_url = 'sqlite:///app.db'
    print("💻 Using local SQLite database for development")

app.config["SQLALCHEMY_DATABASE_URI"] = db_url
print(f"🔧 SQLALCHEMY_DATABASE_URI set: {db_url[:40]}...")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)


api = Api(app)


# CORS configuration for development and production
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production frontend URL if available
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)
    print(f"🌐 Added production frontend to CORS: {frontend_url}")

CORS(app, 
     supports_credentials=True,
     origins=allowed_origins,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type"])
