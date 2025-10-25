from flask_restful import Resource
from flask import request, jsonify, make_response, current_app, session
from werkzeug.utils import secure_filename
from models import  Report, User, Donation
import os
from config import api, db
from datetime import datetime, date, timezone

def classify_severity(description):
    description = description.lower()
    if any(word in description for word in ["destroyed", "severe", "catastrophic"]):
        return "Severe"
    elif any(word in description for word in ["minor", "small", "contained"]):
        return "Minor"
    else:
        return "Moderate"


class Reports(Resource):
    def get(self):
        reports = Report.query.all()
        return make_response(jsonify([r.to_dict() for r in reports]), 200)

    def post(self):
        # 1. Check for logged-in user (OPTIONAL)
        # We check for the user ID, but don't enforce it
        user_id = session.get("user_id")

        type = request.form.get("type")
        description = request.form.get("description")
        location = request.form.get("location")
        image = request.files.get("image")

        if not type or not description or not location:
            return make_response({"error": "Missing required fields"}, 400)

        image_url = None
        if image:
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            # Ensure upload folder exists
            os.makedirs(upload_folder, exist_ok=True)
            # Use a more unique filename to prevent overwrites, e.g., using uuid or timestamp
            # For simplicity, sticking to original logic but be mindful of collisions
            # use a secure filename to avoid path traversal or unsafe characters
            filename = secure_filename(image.filename)
            image_path = os.path.join(upload_folder, filename)
            image.save(image_path)
            # Expose a web-accessible path (served from /uploads/<filename>)
            image_url = f"/uploads/{filename}"

        severity = classify_severity(description)
        
        # 2. Handle Anonymous/Logged-in Reporter Data
        reporter_name = "Anonymous"
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                reporter_name = user.username
        
        # Note: If user_id is None, the report will be associated with NULL in the database,
        # which correctly indicates an anonymous submission.

        new_report = Report(
            type=type,
            description=description,
            location=location,
            image=image_url,
            severity=severity,
            reporter_name=reporter_name,  # Set name to username or "Anonymous"
            user_id=user_id               # Set user_id to actual ID or None (NULL in DB)
        )

        db.session.add(new_report)
        db.session.commit()
        return make_response(new_report.to_dict(), 201)
    

class ReportByID(Resource):
    def get(self, id):
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)
        return make_response(report.to_dict(), 200)
   
    def patch(self, id):
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)

        # Check if request is FormData (with file) or JSON
        is_form_data = request.content_type and 'multipart/form-data' in request.content_type
        
        if is_form_data:
            # Handle FormData with potential image upload
            data = {}
            for key in ['reporter_name', 'type', 'location', 'description']:
                val = request.form.get(key)
                if val:
                    data[key] = val
            
            # Handle date from form
            date_str = request.form.get('date')
            if date_str:
                data['date'] = date_str
            
            # Handle image upload
            image = request.files.get('image')
            if image:
                upload_folder = current_app.config["UPLOAD_FOLDER"]
                os.makedirs(upload_folder, exist_ok=True)
                filename = secure_filename(image.filename)
                image_path = os.path.join(upload_folder, filename)
                image.save(image_path)
                data['image'] = f"/uploads/{filename}"
        else:
            # Handle JSON payload
            data = request.get_json(silent=True) or {}

        # DEBUG: log what we received
        print("[PATCH /reports/<id>] received payload:", data)

        # Handle DateTime parsing
        if "date" in data:
            raw_date = data.get("date")
            if raw_date in (None, "", "null"):
                report.date = None
            elif isinstance(raw_date, (datetime, date)):
                # If a Python object sneaks through
                if isinstance(raw_date, datetime):
                    report.date = raw_date if raw_date.tzinfo else raw_date.replace(tzinfo=timezone.utc)
                else:
                    # date -> datetime at midnight UTC
                    report.date = datetime(raw_date.year, raw_date.month, raw_date.day, tzinfo=timezone.utc)
            elif isinstance(raw_date, str):
                parsed_dt = None
                # Normalize Z (Zulu) to +00:00 for fromisoformat
                iso_candidate = raw_date.replace("Z", "+00:00") if raw_date.endswith("Z") else raw_date
                # Try ISO first
                try:
                    parsed_dt = datetime.fromisoformat(iso_candidate)
                except Exception:
                    # Try plain YYYY-MM-DD
                    try:
                        d = datetime.strptime(raw_date, "%Y-%m-%d").date()
                        parsed_dt = datetime(d.year, d.month, d.day)
                    except Exception:
                        return make_response(
                            {"error": "Invalid date format. Use YYYY-MM-DD or ISO8601."}, 400
                        )
                # Ensure timezone-aware (UTC) to match your model’s default style
                report.date = parsed_dt if parsed_dt.tzinfo else parsed_dt.replace(tzinfo=timezone.utc)
            else:
                # Unknown type
                return make_response({"error": "Invalid date value."}, 400)

            # Prevent raw string from being set later
            data.pop("date", None)

        # Optional: keep severity consistent with POST when description changes
        if "description" in data and isinstance(data["description"], str):
            report.severity = classify_severity(data["description"])

        # Apply other fields (includes reporter_name, type, location, etc.)
        for key, value in data.items():
            setattr(report, key, value)

        db.session.commit()
        return make_response(report.to_dict(), 200)

    def delete(self, id):
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)

        db.session.delete(report)
        db.session.commit()
        return make_response({"message": "Report deleted"}, 200)

class ReportDonations(Resource):
    def get(self, id):
        """List all donations for a report."""
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)
        return make_response(jsonify([d.to_dict() for d in report.donations]), 200)

    def post(self, id):
        """Create a donation for a report."""
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)

        data = request.get_json(silent=True) or {}
        full_name = data.get("full_name")
        email = data.get("email")
        phone = data.get("phone")
        d_type = data.get("type")
        amount = data.get("amount")
        amount_number = data.get("amount_number")

        if not full_name or not email or not phone or not d_type or not amount:
            return make_response(
                {"error": "full_name, email, phone, type, and amount are required"}, 400
            )

        donation = Donation(
            report_id=id,
            full_name=full_name,
            email=email,
            phone=phone,
            type=d_type,
            amount=amount,
            amount_number=amount_number,
        )
        db.session.add(donation)
        db.session.commit()

        return make_response(donation.to_dict(), 201)


api.add_resource(Reports, '/reports')
api.add_resource(ReportByID, '/reports/<int:id>')
api.add_resource(ReportDonations, '/reports/<int:id>/donations')
