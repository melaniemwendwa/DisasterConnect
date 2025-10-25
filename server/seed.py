#!/usr/bin/env python3
"""
Seed script for DisasterConnect database
Populates the database with sample users, reports, and donations
"""
from config import app, db
from models import User, Report, Donation
from datetime import datetime, timezone, timedelta
import random

def clear_database():
    """Clear all existing data"""
    print("🗑️  Clearing existing data...")
    with app.app_context():
        Donation.query.delete()
        Report.query.delete()
        User.query.delete()
        db.session.commit()
    print("✅ Database cleared!")

def seed_users():
    """Create sample users"""
    print("\n👥 Seeding users...")
    users_data = [
        {"username": "admin", "email": "admin@disasterconnect.ke", "password": "admin123"},
        {"username": "john_doe", "email": "john@example.com", "password": "password123"},
        {"username": "jane_smith", "email": "jane@example.com", "password": "password123"},
        {"username": "peter_kamau", "email": "peter@example.com", "password": "password123"},
        {"username": "mary_wanjiru", "email": "mary@example.com", "password": "password123"},
    ]
    
    users = []
    for data in users_data:
        user = User(
            username=data["username"],
            email=data["email"]
        )
        user.password_hash = data["password"]
        users.append(user)
        db.session.add(user)
    
    db.session.commit()
    print(f"✅ Created {len(users)} users")
    return users

def seed_reports(users):
    """Create sample disaster reports"""
    print("\n📋 Seeding reports...")
    
    reports_data = [
        {
            "type": "Flood",
            "location": "Nairobi, Mathare",
            "description": "Severe flooding has hit Mathare slums following heavy rains. Over 500 families have been displaced and are in urgent need of shelter, food, and clean water. Several houses have been swept away and the situation is critical.",
            "severity": "Severe",
            "image": "/uploads/flood_mathare.jpg",
            "days_ago": 2
        },
        {
            "type": "Drought",
            "location": "Turkana County",
            "description": "A severe drought has hit Turkana, Kenya, leading to widespread crop failure, livestock deaths, and food shortages. Communities are struggling with limited access to water and essential supplies. Urgent assistance is needed to provide relief and support to affected families.",
            "severity": "Severe",
            "image": "/uploads/drought_turkana.jpg",
            "days_ago": 5
        },
        {
            "type": "Fire",
            "location": "Kakamega, Market Area",
            "description": "A major fire outbreak destroyed several shops in Kakamega market. Multiple families lost their livelihoods and are in need of immediate support for rebuilding and basic necessities.",
            "severity": "Moderate",
            "image": "/uploads/fire_kakamega.jpg",
            "days_ago": 1
        },
        {
            "type": "Landslide",
            "location": "West Pokot",
            "description": "Heavy rains triggered a massive landslide in West Pokot, burying homes and displacing hundreds of residents. Rescue operations are ongoing and survivors need emergency shelter and medical care.",
            "severity": "Severe",
            "image": "/uploads/landslide_pokot.jpg",
            "days_ago": 3
        },
        {
            "type": "Earthquake",
            "location": "Baringo County",
            "description": "A minor earthquake measuring 4.2 on the Richter scale struck Baringo County. While there were no casualties, several buildings sustained structural damage and residents are anxious.",
            "severity": "Minor",
            "image": "/uploads/earthquake_baringo.jpg",
            "days_ago": 7
        },
        {
            "type": "Locust",
            "location": "Isiolo County",
            "description": "Locust invasion has destroyed vast farmlands in Isiolo, threatening food security for thousands of families. Farmers have lost entire crops and need urgent support for pest control and replanting.",
            "severity": "Moderate",
            "image": "/uploads/locust_isiolo.jpg",
            "days_ago": 10
        },
        {
            "type": "Flood",
            "location": "Kisumu, Nyalenda",
            "description": "Flash floods in Nyalenda area have submerged homes and contaminated water sources. Residents are at risk of waterborne diseases and require immediate medical supplies and clean water.",
            "severity": "Moderate",
            "image": "/uploads/flood_kisumu.jpg",
            "days_ago": 4
        },
        {
            "type": "Fire",
            "location": "Mombasa, Likoni",
            "description": "A small fire broke out in a residential area in Likoni. The fire was contained quickly but three families lost their homes and belongings.",
            "severity": "Minor",
            "image": "/uploads/fire_mombasa.jpg",
            "days_ago": 6
        },
    ]
    
    reports = []
    for i, data in enumerate(reports_data):
        # Assign reports to different users
        user = users[i % len(users)]
        
        # Calculate date based on days_ago
        report_date = datetime.now(timezone.utc) - timedelta(days=data["days_ago"])
        
        report = Report(
            type=data["type"],
            location=data["location"],
            description=data["description"],
            severity=data["severity"],
            image=data["image"],
            reporter_name=user.username,
            user_id=user.id,
            date=report_date
        )
        reports.append(report)
        db.session.add(report)
    
    db.session.commit()
    print(f"✅ Created {len(reports)} reports")
    return reports

def seed_donations(reports):
    """Create sample donations for reports"""
    print("\n💰 Seeding donations...")
    
    donation_types = ["Money", "Food", "Clothes", "Medical", "Water", "Shelter"]
    donor_names = [
        "Fatima Ali", "Raila Amolo", "Nairobi Relief Group", "Amad Diallo",
        "Kenya Red Cross", "World Vision", "Sarah Mwangi", "David Ochieng",
        "Mercy Corps", "UNICEF Kenya", "James Kariuki", "Grace Njeri",
        "Safaricom Foundation", "KCB Foundation", "Anonymous Donor"
    ]
    
    donations = []
    
    # Add donations to each report (random 2-5 donations per report)
    for report in reports:
        num_donations = random.randint(2, 5)
        
        for _ in range(num_donations):
            donor = random.choice(donor_names)
            d_type = random.choice(donation_types)
            
            # Generate amount based on type
            if d_type == "Money":
                amount_num = random.choice([500, 1000, 2000, 5000, 10000, 20000, 50000])
                amount = f"KES {amount_num:,}"
            elif d_type == "Food":
                amount = random.choice([
                    "50 bags of rice",
                    "100 kg of maize flour",
                    "200 food packages",
                    "50 cartons of cooking oil"
                ])
                amount_num = None
            elif d_type == "Water":
                amount = random.choice([
                    "500 liters",
                    "1000 water bottles",
                    "10 water tanks"
                ])
                amount_num = None
            else:
                amount = random.choice([
                    "100 pieces",
                    "50 packages",
                    "200 items",
                    "Multiple boxes"
                ])
                amount_num = None
            
            # Random email and phone
            email = f"{donor.lower().replace(' ', '.')}@example.com"
            phone = f"07{random.randint(10000000, 99999999)}"
            
            # Random donation time within the last few days
            days_ago = random.randint(0, 3)
            hours_ago = random.randint(0, 23)
            donation_time = datetime.now(timezone.utc) - timedelta(days=days_ago, hours=hours_ago)
            
            donation = Donation(
                report_id=report.id,
                full_name=donor,
                email=email,
                phone=phone,
                type=d_type,
                amount=amount,
                amount_number=amount_num,
                created_at=donation_time
            )
            donations.append(donation)
            db.session.add(donation)
    
    db.session.commit()
    print(f"✅ Created {len(donations)} donations")
    return donations

def seed_all():
    """Run all seed functions"""
    print("\n🌱 Starting database seeding...\n")
    
    with app.app_context():
        # Clear existing data
        clear_database()
        
        # Seed in order (respecting foreign key constraints)
        users = seed_users()
        reports = seed_reports(users)
        donations = seed_donations(reports)
        
        print("\n" + "="*50)
        print("✅ Database seeding completed successfully!")
        print("="*50)
        print(f"\n📊 Summary:")
        print(f"   - Users: {len(users)}")
        print(f"   - Reports: {len(reports)}")
        print(f"   - Donations: {len(donations)}")
        print("\n🔐 Test Login Credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("\n   OR")
        print("\n   Username: john_doe")
        print("   Password: password123")
        print("\n")

if __name__ == "__main__":
    seed_all()
