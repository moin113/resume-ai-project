#!/usr/bin/env python3
"""
Database Initialization Script for Dr. Resume
Creates all necessary tables and sets up the database schema
"""

import os
import sys
from app_fixed import create_app

def init_database():
    """Initialize the database with all tables"""
    print("🗄️ Initializing Dr. Resume Database...")
    
    try:
        # Create the Flask app
        app = create_app()
        
        with app.app_context():
            from models import db, User, Resume, JobDescription, MatchScore, Suggestion
            
            # Create all tables
            print("📊 Creating database tables...")
            db.create_all()
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            print(f"✅ Created {len(tables)} tables:")
            for table in tables:
                print(f"   - {table}")
            
            # Create a test user if none exists
            if User.query.count() == 0:
                print("👤 Creating test user...")
                test_user = User(
                    first_name="Test",
                    last_name="User", 
                    email="test@drresume.com",
                    password="password123"
                )
                db.session.add(test_user)
                db.session.commit()
                print("✅ Test user created: test@drresume.com / password123")
            
            print("🎉 Database initialization complete!")
            return True
            
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = init_database()
    sys.exit(0 if success else 1)
