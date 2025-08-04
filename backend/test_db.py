#!/usr/bin/env python3
"""
Test database connection
"""

import os
import sys

def test_database():
    """Test database connection"""
    try:
        print("🧪 Testing database connection...")
        
        # Test database path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        db_path = os.path.join(project_root, 'database', 'dr_resume_dev.db')
        
        print(f"📁 Database path: {db_path}")
        print(f"📁 Database exists: {os.path.exists(db_path)}")
        
        if os.path.exists(db_path):
            print(f"📊 Database size: {os.path.getsize(db_path)} bytes")
        
        # Test SQLite connection
        import sqlite3
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Test basic query
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        print(f"📋 Tables found: {[table[0] for table in tables]}")
        
        # Test users table
        cursor.execute("SELECT COUNT(*) FROM users;")
        user_count = cursor.fetchone()[0]
        print(f"👥 Users in database: {user_count}")
        
        conn.close()
        print("✅ Database connection successful!")
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_flask_models():
    """Test Flask models import"""
    try:
        print("\n🧪 Testing Flask models...")
        
        from flask import Flask
        from flask_sqlalchemy import SQLAlchemy
        
        # Create minimal app
        app = Flask(__name__)
        
        # Configure database
        current_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(current_dir)
        db_path = os.path.join(project_root, 'database', 'dr_resume_dev.db')
        
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Import models
        from models import db, User
        
        # Initialize database
        db.init_app(app)
        
        with app.app_context():
            # Test query
            users = User.query.all()
            print(f"👥 Users found via SQLAlchemy: {len(users)}")
            
            if users:
                first_user = users[0]
                print(f"📧 First user email: {first_user.email}")
        
        print("✅ Flask models working!")
        return True
        
    except Exception as e:
        print(f"❌ Flask models error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("🩺" + "="*50 + "🩺")
    print("🧪 Dr. Resume Database Test")
    print("="*52)
    
    db_ok = test_database()
    models_ok = test_flask_models()
    
    if db_ok and models_ok:
        print("\n✅ All database tests passed!")
    else:
        print("\n❌ Some tests failed!")

if __name__ == '__main__':
    main()
