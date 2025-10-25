from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship, validates
from sqlalchemy_serializer import SerializerMixin
from datetime import datetime, timezone
from config import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(Integer, primary_key=True)
    username = db.Column(String, unique=True, nullable=False)
    email = db.Column(String, unique=True, nullable=False)
    _password_hash = db.Column(String, nullable=False)

    reports = db.relationship('Report', back_populates='user', cascade="all, delete-orphan")
    serialize_rules = ("-reports.user",)

    @property
    def password_hash(self):
        raise AttributeError("Password hashes cannot be viewed")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = generate_password_hash(password)

    def authenticate(self, password):
        return check_password_hash(self._password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


class Report(db.Model, SerializerMixin):
    __tablename__ = 'reports'

    id = db.Column(Integer, primary_key=True)
    type = db.Column(String, nullable=False)
    location = db.Column(String, nullable=False)
    date = db.Column(DateTime, default=lambda: datetime.now(timezone.utc))
    description = db.Column(String, nullable=False)
    image = db.Column(String, nullable=True)
    severity = db.Column(String, nullable=True)
    reporter_name = db.Column(String, nullable=False, default="Unknown Reporter")

    user_id = db.Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='reports')

    # Donations relationship
    donations = db.relationship('Donation', back_populates='report', cascade="all, delete-orphan", lazy='selectin')

    serialize_rules = ("-user.reports", "-donations.report")

    @validates('type')
    def validate_type(self, key, value):
        if not value or len(value) < 3:
            raise ValueError('Type must be at least 3 characters long')
        return value


class Donation(db.Model, SerializerMixin):
    __tablename__ = 'donations'

    id = db.Column(Integer, primary_key=True)
    report_id = db.Column(Integer, ForeignKey('reports.id'), nullable=False)
    full_name = db.Column(String, nullable=False)
    email = db.Column(String, nullable=False)
    phone = db.Column(String, nullable=False)
    type = db.Column(String, nullable=False)  # e.g., "Money", "Food"
    amount = db.Column(String, nullable=False)  # can be text or number
    amount_number = db.Column(Float, nullable=True)  # numeric if provided
    created_at = db.Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    report = relationship('Report', back_populates='donations')

    serialize_rules = ("-report.donations",)
    
    # Override SerializerMixin's to_dict to return 'name' instead of 'full_name'
    def to_dict(self, **kwargs):
        base = super().to_dict(**kwargs)
        # Replace full_name with name for frontend compatibility
        if 'full_name' in base:
            base['name'] = base.pop('full_name')
        return base

    def __repr__(self):
        return f"<Donation {self.id} by {self.full_name} for Report {self.report_id}>"
