from flask_restful import Resource
from flask import request, session, make_response, jsonify
from models import  User
from config import db, api


class Signup(Resource):
    def post(self):
        """Register a new user"""
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            return make_response({"error": "All fields are required"}, 400)

        existing = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing:
            return make_response({"error": "User already exists"}, 400)

        new_user = User(username=username, email=email)
        new_user.password_hash = password

        db.session.add(new_user)
        db.session.commit()

        session["user_id"] = new_user.id
        session.modified = True  # Force session to be saved
        return make_response(new_user.to_dict(), 201)


class Login(Resource):
    def post(self):
        """Login user"""
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = User.query.filter_by(email=email).first()
        if not user or not user.authenticate(password):
            return make_response({"error": "Invalid email or password"}, 401)

        session["user_id"] = user.id
        session.modified = True  # Force session to be saved
        print(f"[LOGIN] Set session user_id: {user.id}, Session: {dict(session)}")
        return make_response(user.to_dict(), 200)


class CheckSession(Resource):
    def get(self):
        """Check if user is logged in"""
        user_id = session.get("user_id")
        if not user_id:
            return make_response({"error": "Not logged in"}, 401)

        user = User.query.get(user_id)
        return make_response(user.to_dict(), 200)


class Logout(Resource):
    def post(self):
        """Logout user"""
        session.pop("user_id", None)
        return make_response({"message": "Logged out"}, 200)

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
