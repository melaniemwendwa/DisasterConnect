#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, send_from_directory, current_app
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from routes import auth_route, report_route, admin_route, admin_auth_route, reset_password_route
from cloudinary_config import is_cloudinary_configured

# Check Cloudinary configuration on startup
print("\n" + "="*60)
print("🔍 CHECKING CLOUDINARY CONFIGURATION...")
if is_cloudinary_configured():
    print("✅ Cloudinary is CONFIGURED - Images will upload to cloud")
    print("   All new images will be stored permanently!")
else:
    print("⚠️  Cloudinary is NOT configured - Using local storage")
    print("   Images will be TEMPORARY and lost on restart!")
    print("   Set these environment variables:")
    print("   - CLOUDINARY_CLOUD_NAME")
    print("   - CLOUDINARY_API_KEY")
    print("   - CLOUDINARY_API_SECRET")
print("="*60 + "\n")

# Serve uploaded files
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """Serve files saved in the UPLOAD_FOLDER directory.

    This allows the client to request /uploads/<filename> and receive the
    saved image. In production, it's better to have a web server serve
    static files or configure a dedicated static folder.
    """
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)


# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)