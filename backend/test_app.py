#!/usr/bin/env python3
"""
Test script to debug app startup issues
"""

import sys
import traceback

def test_imports():
    """Test all imports"""
    try:
        print("Testing imports...")
        
        print("1. Testing Flask imports...")
        from flask import Flask, render_template, send_from_directory, jsonify, request
        from flask_cors import CORS
        from flask_jwt_extended import JWTManager, jwt_required
        print("✅ Flask imports successful")
        
        print("2. Testing models import...")
        from models import db
        print("✅ Models import successful")
        
        print("3. Testing route imports...")
        from routes.us05_auth_routes import auth_bp
        print("✅ Auth routes import successful")
        
        print("4. Testing app creation...")
        from app_fixed import create_app
        print("✅ App creation import successful")
        
        print("5. Creating app instance...")
        app = create_app()
        print("✅ App instance created successfully")
        
        print("6. Testing app context...")
        with app.app_context():
            print("✅ App context works")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("🧪 Starting Dr. Resume App Debug Test")
    print("="*50)
    
    if test_imports():
        print("\n✅ All tests passed! App should work.")
        
        try:
            print("\n🚀 Starting actual app...")
            from app_fixed import create_app
            app = create_app()
            print("🌐 App created, starting server...")
            app.run(host='127.0.0.1', port=5000, debug=True)
        except Exception as e:
            print(f"❌ Error starting app: {e}")
            traceback.print_exc()
    else:
        print("\n❌ Tests failed. Check the errors above.")

if __name__ == '__main__':
    main()
