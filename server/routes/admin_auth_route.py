from flask_restful import Resource
from flask import request, session, make_response, jsonify
from models import Admin
from config import db, api


class AdminLogin(Resource):
    def post(self):
        """Admin login endpoint"""
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return make_response({"error": "Email and password are required"}, 400)

        admin = Admin.query.filter_by(email=email).first()

        if not admin or not admin.authenticate(password):
            return make_response({"error": "Invalid email or password"}, 401)

        # Set admin session
        session["admin_id"] = admin.id
        session["is_admin"] = True
        
        return make_response(jsonify(admin.to_dict()), 200)


class AdminLogout(Resource):
    def delete(self):
        """Admin logout endpoint"""
        session.pop("admin_id", None)
        session.pop("is_admin", None)
        return make_response({"message": "Logged out successfully"}, 200)


class AdminCheckSession(Resource):
    def get(self):
        """Check if admin is logged in"""
        admin_id = session.get("admin_id")
        
        if not admin_id:
            return make_response({"error": "Not authenticated"}, 401)
        
        admin = Admin.query.get(admin_id)
        if not admin:
            session.pop("admin_id", None)
            session.pop("is_admin", None)
            return make_response({"error": "Admin not found"}, 404)
        
        return make_response(jsonify(admin.to_dict()), 200)


# Register admin auth routes
api.add_resource(AdminLogin, '/admin/login')
api.add_resource(AdminLogout, '/admin/logout')
api.add_resource(AdminCheckSession, '/admin/check-session')
# --- TEMPORARY ADMIN SETUP ROUTE ---
from flask import request, jsonify
from config import app, db
from models import Admin

@app.route("/setup-admin", methods=["POST"])
def setup_admin():
    """
    This route is used to create the first admin after deployment.
    It will automatically disable itself once at least one admin exists.
    """
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Check if an admin already exists
    if Admin.query.first():
        return jsonify({
            "error": "An admin already exists. Setup route disabled."
        }), 403

    # Validate inputs
    if not username or not email or not password:
        return jsonify({"error": "All fields (username, email, password) are required"}), 400

    # Create the admin
    new_admin = Admin(username=username, email=email)
    new_admin.password_hash = password  # uses the setter property in your model
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "✅ Admin account created successfully!",
        "admin": {
            "username": username,
            "email": email
        }
    }), 201

