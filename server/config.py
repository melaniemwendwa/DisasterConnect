# Standard library imports

# Remote library imports
from flask import Flask
import os
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData


# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
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

# Instantiate C
CORS(app, supports_credentials=True)
