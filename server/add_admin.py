#!/usr/bin/env python3
"""
Script to create and manage admin users.
Run this to create your first admin or add additional admins.
"""

from config import app, db
from models import Admin
import sys

def add_admin(username, email, password):
    """Add a new admin user"""
    with app.app_context():
        # Check if admin already exists
        existing = Admin.query.filter_by(email=email).first()
        
        if existing:
            print(f"❌ Admin with email '{email}' already exists!")
            print(f"   Username: {existing.username}")
            return False
        
        # Check username
        existing_username = Admin.query.filter_by(username=username).first()
        if existing_username:
            print(f"❌ Admin with username '{username}' already exists!")
            return False
        
        # Create new admin
        admin = Admin(
            username=username,
            email=email
        )
        admin.password_hash = password
        
        db.session.add(admin)
        db.session.commit()
        
        print(f"✅ Successfully created admin:")
        print(f"   Username: {username}")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   ⚠️  Keep these credentials safe!")
        return True

def list_admins():
    """List all existing admins"""
    with app.app_context():
        admins = Admin.query.all()
        if not admins:
            print("📋 No admins found in database")
        else:
            print(f"\n📋 Existing Admins ({len(admins)}):")
            print("-" * 50)
            for admin in admins:
                print(f"   • {admin.username} ({admin.email})")
            print("-" * 50)

def main():
    print("=" * 50)
    print("Admin Management")
    print("=" * 50)
    
    # Show existing admins
    list_admins()
    
    print("\n➕ Create New Admin")
    print("-" * 50)
    
    username = input("Enter admin username: ").strip()
    email = input("Enter admin email: ").strip()
    password = input("Enter admin password: ").strip()
    
    if not username or not email or not password:
        print("❌ All fields are required!")
        sys.exit(1)
    
    add_admin(username, email, password)

if __name__ == "__main__":
    main()
