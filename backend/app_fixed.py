#!/usr/bin/env python3
"""
Fixed Flask Application for US-10
Complete integration with proper error handling and sequential US features
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from datetime import datetime
import os
import sys

def create_app():

    # Create Flask app (only once!)
    app = Flask(__name__,
                template_folder='../frontend',
                static_folder='../frontend/static')

    # Serve landing page
    @app.route('/')
    def serve_frontend():
        return render_template('us10_landing.html')

    # Catch-all route for SPA client-side routing
    @app.route('/<path:path>')
    def catch_all(path):
        if path.startswith('api') or path.startswith('static'):
            return "Not Found", 404
        return render_template('us10_landing.html')

    # Basic configuration
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    db_path = os.path.join(project_root, 'database', 'dr_resume_dev.db')
    upload_path = os.path.join(project_root, 'uploads')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', f'sqlite:///{db_path}')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = upload_path
    app.config['RESUME_UPLOAD_FOLDER'] = upload_path
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB

    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    os.makedirs(upload_path, exist_ok=True)

    # Initialize extensions
    CORS(app, origins=['http://localhost:5000', 'http://127.0.0.1:5000'])
    jwt = JWTManager(app)

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'success': False, 'message': 'Token has expired', 'error': 'token_expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'success': False, 'message': 'Invalid token', 'error': 'invalid_token'}), 401

    # Initialize database
    try:
        from backend import models
        db = models.db
        db.init_app(app)
        with app.app_context():
            db.create_all()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️ Database initialization warning: {e}")

    # Register Blueprints safely
    def safe_register(import_path, bp_name):
        try:
            module = __import__(import_path, fromlist=[bp_name])
            app.register_blueprint(getattr(module, bp_name))
            print(f"✅ {bp_name} registered")
        except Exception as e:
            print(f"⚠️ {bp_name} warning: {e}")

    safe_register('backend.routes.us05_auth_routes', 'auth_bp')
    safe_register('backend.routes.us05_upload_routes', 'upload_bp')
    safe_register('backend.routes.us05_jd_routes', 'jd_bp')
    safe_register('backend.routes.us06_matching_routes', 'matching_bp')
    safe_register('backend.routes.us07_suggestions_routes', 'suggestions_bp')
    safe_register('backend.routes.us10_history_routes', 'history_bp')
    safe_register('backend.routes.us10_account_routes', 'account_bp')

    # Sample test endpoint
    @app.route('/api/test-available-data', methods=['GET'])
    def test_available_data():
        try:
            from backend.models import db, Resume, JobDescription
            resumes = Resume.query.all()
            jds = JobDescription.query.all()
            return jsonify({
                'success': True,
                'total_resumes': len(resumes),
                'total_job_descriptions': len(jds)
            })
        except Exception as e:
            import traceback; traceback.print_exc()
            return jsonify({'success': False, 'message': str(e)}), 500

    print("✅ Flask app created successfully")
    return app

def main():
    """Main application entry point"""
    print("🧺t" + "=" * 50 + "🧺")
    print("🚀 Starting Dr. Resume Application")
    print("=" * 52)

    project_root = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(project_root, 'database'), exist_ok=True)
    os.makedirs(os.path.join(project_root, 'uploads'), exist_ok=True)

    app = create_app()

    print("🌐 Starting Flask development server...")
    print("📍 Available at: http://localhost:5000")
    print("🔧 Debug mode: ON")
    print("=" * 52)

    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Shutting down Dr. Resume...")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == '__main__':
    main()

# Expose app for Gunicorn
app = create_app()
