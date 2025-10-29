from flask_restful import Resource
from flask import request, jsonify, make_response, current_app, session
from werkzeug.utils import secure_filename
from models import Report, User, Donation
import os
from config import api, db
from datetime import datetime, date, timezone
from ai_utils import classify_disaster_type, classify_severity
from cloudinary_config import upload_image_to_cloudinary, is_cloudinary_configured


class Reports(Resource):
    def get(self):
        reports = Report.query.all()
        return make_response(jsonify([r.to_dict() for r in reports]), 200)

    def post(self):
        # 1. Check for logged-in user (OPTIONAL)
        # We check for the user ID, but don't enforce it
        user_id = session.get("user_id")
        print(f"[POST /reports] Session user_id: {user_id}")

        description = request.form.get("description")
        location = request.form.get("location")
        image = request.files.get("image")

        if not description or not location:
            return make_response({"error": "Missing required fields"}, 400)
            
        # Use AI to classify the disaster type based on description
        type_result = classify_disaster_type(description)
        print(f"[AI Classification] Disaster type: {type_result['type']} "
              f"(confidence: {type_result['confidence']}, reason: {type_result['explanation']})")

        image_url = None
        if image:
            # Try Cloudinary first (if configured), otherwise fall back to local storage
            if is_cloudinary_configured():
                # Upload to Cloudinary (permanent storage)
                result = upload_image_to_cloudinary(image, folder="disaster_reports")
                if result:
                    image_url = result['url']
                    print(f"☁️ Image uploaded to Cloudinary: {image_url}")
                else:
                    print("⚠️ Cloudinary upload failed, using local storage")
            
            # Fallback to local storage (for development or if Cloudinary fails)
            if not image_url:
                upload_folder = current_app.config["UPLOAD_FOLDER"]
                os.makedirs(upload_folder, exist_ok=True)
                filename = secure_filename(image.filename)
                image_path = os.path.join(upload_folder, filename)
                image.save(image_path)
                base_url = os.environ.get('BACKEND_URL', request.url_root.rstrip('/'))
                image_url = f"{base_url}/uploads/{filename}"
                print(f"💾 Image saved locally: {image_url}")

        severity_result = classify_severity(description)
        print(f"[AI Classification] Severity: {severity_result['severity']} "
              f"(confidence: {severity_result['confidence']}, reason: {severity_result['explanation']})")
        
        # 2. Handle Anonymous/Logged-in Reporter Data
        reporter_name = "Anonymous"
        
        if user_id:
            user = User.query.get(user_id)
            if user:
                reporter_name = user.username
        
        # Note: If user_id is None, the report will be associated with NULL in the database,
        # which correctly indicates an anonymous submission.

        new_report = Report(
            type=type_result['type'],
            type_confidence=type_result['confidence'],
            type_explanation=type_result['explanation'],
            description=description,
            location=location,
            image=image_url,
            severity=severity_result['severity'],
            severity_confidence=severity_result['confidence'],
            severity_explanation=severity_result['explanation'],
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

        # Authorization check: only the creator can edit
        user_id = session.get("user_id")
        print(f"[PATCH] Session user_id: {user_id}, Report user_id: {report.user_id}")
        
        if not user_id:
            return make_response({"error": "Unauthorized. Please log in."}, 401)
        
        if report.user_id != user_id:
            return make_response({"error": "Forbidden. You can only edit your own reports."}, 403)

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
                # Try Cloudinary first (if configured), otherwise fall back to local storage
                if is_cloudinary_configured():
                    result = upload_image_to_cloudinary(image, folder="disaster_reports")
                    if result:
                        data['image'] = result['url']
                        print(f"☁️ Image updated (Cloudinary): {data['image']}")
                
                # Fallback to local storage
                if 'image' not in data or not data['image']:
                    upload_folder = current_app.config["UPLOAD_FOLDER"]
                    os.makedirs(upload_folder, exist_ok=True)
                    filename = secure_filename(image.filename)
                    image_path = os.path.join(upload_folder, filename)
                    image.save(image_path)
                    base_url = os.environ.get('BACKEND_URL', request.url_root.rstrip('/'))
                    data['image'] = f"{base_url}/uploads/{filename}"
                    print(f"💾 Image updated (local): {data['image']}")
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
            severity_result = classify_severity(data["description"])
            report.severity = severity_result['severity']
            report.severity_confidence = severity_result['confidence']
            report.severity_explanation = severity_result['explanation']

        # Apply other fields (includes reporter_name, type, location, etc.)
        for key, value in data.items():
            setattr(report, key, value)

        db.session.commit()
        return make_response(report.to_dict(), 200)

    def delete(self, id):
        report = Report.query.get(id)
        if not report:
            return make_response({"error": "Report not found"}, 404)

        # Authorization check: only the creator can delete
        user_id = session.get("user_id")
        if not user_id:
            return make_response({"error": "Unauthorized. Please log in."}, 401)
        
        if report.user_id != user_id:
            return make_response({"error": "Forbidden. You can only delete your own reports."}, 403)

        db.session.delete(report)
        db.session.commit()
        return make_response({"message": "Report deleted"}, 200)

class UserReports(Resource):
    def get(self):
        """Get reports created by the user OR reports they donated to."""
        user_id = session.get("user_id")
        print(f"[UserReports GET] Session data: {dict(session)}")
        print(f"[UserReports GET] user_id from session: {user_id}")
        if not user_id:
            return make_response({"error": "Unauthorized. Please log in."}, 401)
        
        user = User.query.get(user_id)
        if not user:
            return make_response({"error": "User not found"}, 404)
        
        # Get reports created by the user
        created_reports = Report.query.filter_by(user_id=user_id).all()
        created_report_ids = {r.id for r in created_reports}
        
        # Get reports the user donated to (by matching email - case insensitive)
        # Use func.lower for case-insensitive comparison
        from sqlalchemy import func
        donations = Donation.query.filter(func.lower(Donation.email) == func.lower(user.email)).all()
        donated_report_ids = {d.report_id for d in donations}
        
        # Debug logging
        print(f"[UserReports] User email: {user.email}")
        print(f"[UserReports] Created report IDs: {created_report_ids}")
        print(f"[UserReports] Donations found: {len(donations)}")
        print(f"[UserReports] Donated report IDs: {donated_report_ids}")
        
        # Combine both sets of report IDs
        all_report_ids = created_report_ids.union(donated_report_ids)
        
        # Fetch all reports
        reports = Report.query.filter(Report.id.in_(all_report_ids)).all() if all_report_ids else []
        
        return make_response(jsonify([r.to_dict() for r in reports]), 200)


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
api.add_resource(UserReports, '/reports/my-reports')
api.add_resource(ReportByID, '/reports/<int:id>')
api.add_resource(ReportDonations, '/reports/<int:id>/donations')
