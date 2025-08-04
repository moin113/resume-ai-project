#!/usr/bin/env python3
"""
Simple Flask app to test basic functionality
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

def create_simple_app():
    """Create a simple Flask app for testing"""
    print("🏗️ Creating Simple Flask App...")
    
    # Create Flask app
    app = Flask(__name__, 
                template_folder='../frontend',
                static_folder='../frontend/static')
    
    # Basic configuration
    app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
    app.config['JWT_SECRET_KEY'] = 'jwt-secret-key-change-in-production'
    
    # Initialize CORS
    CORS(app, origins=['http://localhost:5000', 'http://127.0.0.1:5000'])
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Basic routes
    @app.route('/')
    def index():
        """Serve the landing page"""
        return render_template('us10_landing.html')
    
    @app.route('/login')
    def login_page():
        """Serve the login page"""
        return render_template('us10_login.html')
    
    @app.route('/register')
    def register_page():
        """Serve the register page"""
        return render_template('us10_register.html')
    
    @app.route('/dashboard')
    def dashboard():
        """Serve the dashboard page"""
        return render_template('us10_dashboard.html')
    
    @app.route('/api/test', methods=['GET'])
    def test_api():
        """Test API endpoint"""
        return jsonify({
            'success': True,
            'message': 'API is working!',
            'timestamp': '2025-08-03'
        })
    
    print("✅ Simple Flask app created successfully")
    return app

def main():
    """Main application entry point"""
    print("🩺" + "="*50 + "🩺")
    print("🚀 Starting Simple Dr. Resume Application")
    print("="*52)
    
    try:
        # Create and run app
        app = create_simple_app()
        
        print("🌐 Starting Flask development server...")
        print("📍 Available at: http://localhost:5000")
        print("🔧 Debug mode: ON")
        print("="*52)
        
        # Start the server
        app.run(
            host='127.0.0.1', 
            port=5000, 
            debug=True, 
            use_reloader=False,
            threaded=True
        )
        
    except KeyboardInterrupt:
        print("\n👋 Shutting down Simple Dr. Resume...")
    except Exception as e:
        print(f"❌ Server error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
