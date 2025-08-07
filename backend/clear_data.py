#!/usr/bin/env python3
"""
Clear Data Script for Resume Doctor AI
Clears all data from the database while preserving the schema
"""

import os
import sys
from app_fixed import create_app

def clear_data():
    """Clear all data from the database while preserving schema"""
    print("🗄️ Clearing Resume Doctor AI Database Data...")
    
    try:
        # Create the Flask app
        app = create_app()
        
        with app.app_context():
            from models import db, User, Resume, JobDescription, MatchScore, Suggestion

            # Initialize database with app
            db.init_app(app)
            
            # Print current data counts
            print("📊 Current data counts:")
            print(f"   - Users: {User.query.count()}")
            print(f"   - Resumes: {Resume.query.count()}")
            print(f"   - Job Descriptions: {JobDescription.query.count()}")
            print(f"   - Match Scores: {MatchScore.query.count()}")
            print(f"   - Suggestions: {Suggestion.query.count()}")
            
            # Ask for confirmation
            response = input("\n⚠️ Are you sure you want to clear ALL data? (yes/no): ")
            if response.lower() != 'yes':
                print("❌ Operation cancelled")
                return False
            
            # Clear data in correct order (respecting foreign key constraints)
            print("🧹 Clearing data...")
            
            # Delete dependent records first
            MatchScore.query.delete()
            print("   ✅ Cleared match scores")
            
            Suggestion.query.delete()
            print("   ✅ Cleared suggestions")
            
            Resume.query.delete()
            print("   ✅ Cleared resumes")
            
            JobDescription.query.delete()
            print("   ✅ Cleared job descriptions")
            
            User.query.delete()
            print("   ✅ Cleared users")
            
            # Commit all changes
            db.session.commit()
            
            # Verify data is cleared
            print("\n📊 Data counts after clearing:")
            print(f"   - Users: {User.query.count()}")
            print(f"   - Resumes: {Resume.query.count()}")
            print(f"   - Job Descriptions: {JobDescription.query.count()}")
            print(f"   - Match Scores: {MatchScore.query.count()}")
            print(f"   - Suggestions: {Suggestion.query.count()}")
            
            print("🎉 Database data cleared successfully! Schema preserved.")
            return True
            
    except Exception as e:
        print(f"❌ Data clearing failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    success = clear_data()
    sys.exit(0 if success else 1)
