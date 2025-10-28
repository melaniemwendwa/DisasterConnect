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
print("⚙️ Raw DATABASE_URL from environment:", raw_uri)

if not raw_uri:
    raise RuntimeError("❌ DATABASE_URL not set in environment!")

# Normalize it for SQLAlchemy
if raw_uri.startswith("postgres://"):
    db_url = raw_uri.replace("postgres://", "postgresql+psycopg2://", 1)
elif raw_uri.startswith("postgresql://"):
    db_url = raw_uri.replace("postgresql://", "postgresql+psycopg2://", 1)
else:
    db_url = raw_uri  # fallback just in case

app.config["SQLALCHEMY_DATABASE_URI"] = db_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)


api = Api(app)


CORS(app, 
     supports_credentials=True,
     origins=["http://localhost:5173", "http://127.0.0.1:5173"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type"])
