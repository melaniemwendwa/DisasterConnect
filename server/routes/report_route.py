from flask_restful import Resource
from flask import request, jsonify, make_response, current_app, session
from models import  Report, User
import os
from config import api, db

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
        user_id = session.get("user_id")
        if not user_id:
            return make_response({"error": "Unauthorized"}, 401)

        type = request.form.get("type")
        description = request.form.get("description")
        location = request.form.get("location")
        image = request.files.get("image")

        if not type or not description or not location:
            return make_response({"error": "Missing required fields"}, 400)

        image_url = None
        if image:
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            os.makedirs(upload_folder, exist_ok=True)
            image_path = os.path.join(upload_folder, image.filename)
            image.save(image_path)
            image_url = f"/{image_path}"

        severity = classify_severity(description)
        user = User.query.get(user_id)

        new_report = Report(
            type=type,
            description=description,
            location=location,
            image=image_url,
            severity=severity,
            reporter_name=user.username if user else "Unknown",
            user_id=user_id
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

        data = request.get_json()
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

api.add_resource(Reports, '/reports')
api.add_resource(ReportByID, '/reports/<int:id>')



