#!/usr/bin/env python3
"""
Simple script to start the Dr. Resume Flask application
"""

from app_fixed import create_app
import os

def main():
    """Start the Flask application"""
    print("🩺" + "="*50 + "🩺")
    print("🚀 Starting Dr. Resume Application")
    print("="*52)
    
    try:
        # Create directories if they don't exist
        os.makedirs('../../shared/database', exist_ok=True)
        os.makedirs('../../shared/uploads', exist_ok=True)
        
        # Create and run app
        app = create_app()
        
        print("🌐 Starting Flask development server...")
        print("📍 Available at: http://localhost:5000")
        print("🔧 Debug mode: OFF (for stability)")
        print("="*52)
        
        # Start the server
        app.run(
            host='127.0.0.1', 
            port=5000, 
            debug=False, 
            use_reloader=False,
            threaded=True
        )
        
    except KeyboardInterrupt:
        print("\n👋 Shutting down Dr. Resume...")
    except Exception as e:
        print(f"❌ Server error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
