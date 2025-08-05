#!/usr/bin/env python3
"""
Test app creation step by step
"""

import os
import sys

def test_app_creation():
    """Test app creation step by step"""
    try:
        print("🧪 Testing app creation...")
        
        print("1. Testing Flask import...")
        from flask import Flask, render_template, send_from_directory, jsonify, request
        from flask_cors import CORS
        from flask_jwt_extended import JWTManager, jwt_required
        print("✅ Flask imports successful")
        
        print("2. Creating Flask app...")
        app = Flask(__name__, 
                    template_folder='../frontend',
                    static_folder='../frontend/static')
        print("✅ Flask app created")
        
        print("3. Setting up configuration...")
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        db_path = os.path.join(project_root, 'database', 'dr_resume_dev.db')
        upload_path = os.path.join(project_root, 'uploads')

        app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
        app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['UPLOAD_FOLDER'] = upload_path
        app.config['RESUME_UPLOAD_FOLDER'] = upload_path
        app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
        print("✅ Configuration set")
        
        print("4. Ensuring directories exist...")
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        os.makedirs(upload_path, exist_ok=True)
        print("✅ Directories created")
        
        print("5. Initializing CORS...")
        CORS(app, origins=['http://localhost:5000', 'http://127.0.0.1:5000'])
        print("✅ CORS initialized")
        
        print("6. Initializing JWT...")
        jwt = JWTManager(app)
        print("✅ JWT initialized")
        
        print("7. Testing database import...")
        from backend.models import db
        print("✅ Database models imported")
        
        print("8. Initializing database...")
        db.init_app(app)
        print("✅ Database initialized")
        
        print("9. Testing auth routes import...")
        from routes.us05_auth_routes import auth_bp
        print("✅ Auth routes imported")
        
        print("10. Registering auth routes...")
        app.register_blueprint(auth_bp)
        print("✅ Auth routes registered")
        
        print("11. Testing app context...")
        with app.app_context():
            from backend.models import User
            users = User.query.all()
            print(f"✅ App context works, found {len(users)} users")
        
        print("12. Testing basic route...")
        @app.route('/test')
        def test_route():
            return jsonify({'status': 'working'})
        print("✅ Test route added")
        
        print("✅ App creation successful!")
        return app
        
    except Exception as e:
        print(f"❌ Error during app creation: {e}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """Main test function"""
    print("🩺" + "="*50 + "🩺")
    print("🧪 Dr. Resume App Creation Test")
    print("="*52)
    
    app = test_app_creation()
    
    if app:
        print("\n🚀 Starting test server...")
        try:
            app.run(host='127.0.0.1', port=5000, debug=True, use_reloader=False)
        except Exception as e:
            print(f"❌ Server start error: {e}")
    else:
        print("\n❌ App creation failed!")

if __name__ == '__main__':
    main()
