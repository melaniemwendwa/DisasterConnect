from flask_restful import Resource
from flask import request, make_response
from models import User
from config import db, api

class ResetPassword(Resource):
    def post(self):
        """Reset user password"""
        data = request.get_json()
        email = data.get("email")
        new_password = data.get("password")

        if not email or not new_password:
            return make_response({"error": "Email and new password are required"}, 400)

        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            return make_response({"error": "No user found with this email"}, 404)

        # Update password
        user.password_hash = new_password
        db.session.commit()

        return make_response({"message": "Password reset successfully"}, 200)

api.add_resource(ResetPassword, '/reset-password')