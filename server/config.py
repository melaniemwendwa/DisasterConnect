# Standard library imports
import os

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


# Local imports

# Instantiate app, set attributes
app = Flask(__name__)

# --- NEW CONFIGURATION ADDED HERE ---
# Define the absolute path for file uploads
# It is best practice to define a static folder or an easily accessible folder
# relative to your application's root directory.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
# Define the folder where uploaded images will be stored
app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, 'uploads') 
# ------------------------------------

# Secret key for session signing. In production, set SECRET_KEY in the environment.
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')
# Also set the config key (some extensions read this)
app.config['SECRET_KEY'] = app.secret_key

# Helpful debug output on startup to verify secret key is present (won't show the key value)
print(f"[config] SECRET_KEY set: {bool(app.secret_key)}")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app, supports_credentials=True)

# Note: You should ensure the directory defined by UPLOAD_FOLDER ('./uploads' 
# relative to your config.py) is created and writable by your server process.