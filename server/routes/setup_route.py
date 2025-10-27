"""
ONE-TIME SETUP ROUTE - DELETE AFTER CREATING ADMIN IN PRODUCTION
This route should be removed after initial deployment setup
"""
from flask_restful import Resource
from flask import request, make_response
from models import User
from config import db, api
import os


class CreateFirstAdmin(Resource):
    def post(self):
        """
        Create the first admin user. 
        This endpoint should be protected by an environment variable
        and removed after first use.
        """
        # Security: Only allow if SETUP_KEY matches
        setup_key = request.json.get('setup_key')
        expected_key = os.environ.get('ADMIN_SETUP_KEY')
        
        if not expected_key:
            return make_response({"error": "Setup not configured"}, 403)
        
        if setup_key != expected_key:
            return make_response({"error": "Invalid setup key"}, 403)
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(is_admin=True).first()
        if existing_admin:
            return make_response({"error": "Admin already exists"}, 400)
        
        data = request.json
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        
        if not email or not username or not password:
            return make_response({"error": "Missing required fields"}, 400)
        
        # Create admin user
        admin = User(
            username=username,
            email=email,
            is_admin=True
        )
        admin.password_hash = password
        
        db.session.add(admin)
        db.session.commit()
        
        return make_response({
            "message": "Admin created successfully",
            "username": username,
            "email": email
        }, 201)


api.add_resource(CreateFirstAdmin, '/setup/create-admin')
