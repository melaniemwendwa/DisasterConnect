from flask_restful import Resource
from flask import request, session, make_response, jsonify
from models import User, Report, Donation, Admin
from config import db, api
from sqlalchemy.orm import joinedload


def check_admin():
    """Helper function to check if current session is admin"""
    admin_id = session.get("admin_id")
    if not admin_id:
        return None
    return Admin.query.get(admin_id)


class AdminUsers(Resource):
    def get(self):
        """Get all users (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        users = User.query.all()
        return make_response(jsonify([u.to_dict() for u in users]), 200)


class AdminUserByID(Resource):
    def delete(self, id):
        """Delete a user (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        target_user = User.query.get(id)
        if not target_user:
            return make_response({"error": "User not found"}, 404)
        
        db.session.delete(target_user)
        db.session.commit()
        return make_response({"message": "User deleted successfully"}, 200)


class AdminReports(Resource):
    def get(self):
        """Get all reports (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        reports = Report.query.all()
        return make_response(jsonify([r.to_dict() for r in reports]), 200)


class AdminReportByID(Resource):
    def delete(self, id):
        """Delete a report (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)
        
        db.session.delete(report)
        db.session.commit()
        return make_response({"message": "Report deleted successfully"}, 200)


class AdminDonations(Resource):
    def get(self):
        """Get all donations (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        # Eagerly load the report relationship
        donations = Donation.query.options(joinedload(Donation.report)).all()
        donations_data = []
        for d in donations:
            donation_dict = d.to_dict()
            # Add report details
            if d.report:
                donation_dict['report_type'] = d.report.type
                donation_dict['report_location'] = d.report.location
                donation_dict['report_description'] = d.report.description
                print(f" Donation {d.id}: {d.report.type} at {d.report.location}")  # Debug
            else:
                donation_dict['report_type'] = None
                donation_dict['report_location'] = None
                donation_dict['report_description'] = None
                print(f" Donation {d.id}: No report found")  # Debug
            donations_data.append(donation_dict)
        
        return make_response(jsonify(donations_data), 200)


class AdminDonationByID(Resource):
    def delete(self, id):
        """Delete a donation (admin only)"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        donation = Donation.query.get(id)
        if not donation:
            return make_response({"error": "Donation not found"}, 404)
        
        db.session.delete(donation)
        db.session.commit()
        return make_response({"message": "Donation deleted successfully"}, 200)


class AdminStats(Resource):
    def get(self):
        """Get admin dashboard statistics"""
        admin = check_admin()
        if not admin:
            return make_response({"error": "Unauthorized. Admin access required."}, 401)
        
        stats = {
            "total_users": User.query.count(),
            "total_reports": Report.query.count(),
            "total_donations": Donation.query.count(),
            "severe_reports": Report.query.filter_by(severity="Severe").count(),
            "moderate_reports": Report.query.filter_by(severity="Moderate").count(),
            "minor_reports": Report.query.filter_by(severity="Minor").count(),
        }
        
        return make_response(jsonify(stats), 200)


# Register admin routes
api.add_resource(AdminUsers, '/admin/users')
api.add_resource(AdminUserByID, '/admin/users/<int:id>')
api.add_resource(AdminReports, '/admin/reports')
api.add_resource(AdminReportByID, '/admin/reports/<int:id>')
api.add_resource(AdminDonations, '/admin/donations')
api.add_resource(AdminDonationByID, '/admin/donations/<int:id>')
api.add_resource(AdminStats, '/admin/stats')
