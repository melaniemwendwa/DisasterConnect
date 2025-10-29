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


raw_uri = os.getenv("DATABASE_URL")

if raw_uri:
    raw_uri = raw_uri.strip()
    
    print(f" Raw DATABASE_URL: {raw_uri[:25]}...{raw_uri[-25:]}")
    
    if raw_uri.startswith("postgres://") and not raw_uri.startswith("postgresql+psycopg://"):
        db_url = raw_uri.replace("postgres://", "postgresql+psycopg://", 1)
        print(f" Replaced postgres:// → postgresql+psycopg://")
    elif raw_uri.startswith("postgresql://") and not raw_uri.startswith("postgresql+psycopg://"):
        db_url = raw_uri.replace("postgresql://", "postgresql+psycopg://", 1)
        print(f" Replaced postgresql:// → postgresql+psycopg://")
    else:
        db_url = raw_uri
        print("✅ URL already has correct driver format")
    
    
    protocol = db_url.split('://')[0] + '://'
    print(f"✅ Final protocol: {protocol}")
    
    if '@' in db_url:
        host_and_db = db_url.split('@')[1]
        print(f"Connecting to: {host_and_db}")
else:

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


allowed_origins = "*"


print(f"⚠️  CORS set to: {allowed_origins}")

CORS(app, 
     supports_credentials=True,
     origins=allowed_origins,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type"])
