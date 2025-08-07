#!/usr/bin/env python3
"""
Clear Production Data Script for Resume Doctor AI
Clears all data from the PRODUCTION database while preserving the schema
DANGER: This will clear ALL production data!
"""

import os
import sys
from app_fixed import create_app

def clear_production_data():
    """Clear all data from the PRODUCTION database while preserving schema"""
    print("🚨 PRODUCTION DATA CLEARING SCRIPT 🚨")
    print("="*50)
    
    # Check if we're targeting production
    database_url = os.getenv('DATABASE_URL', 'NOT_SET')
    if database_url == 'NOT_SET' or 'sqlite' in database_url.lower():
        print("❌ This script is for PRODUCTION databases only!")
        print("❌ No production DATABASE_URL found in environment variables")
        print("❌ Current DATABASE_URL:", database_url[:50] + "..." if len(database_url) > 50 else database_url)
        return False
    
    print(f"🎯 Target Database: {database_url[:50]}...")
    print("⚠️  This will clear ALL data from the PRODUCTION database!")
    print("⚠️  This action CANNOT be undone!")
    
    # Triple confirmation for production
    confirm1 = input("\n🔴 Type 'CLEAR PRODUCTION' to continue: ")
    if confirm1 != 'CLEAR PRODUCTION':
        print("❌ Operation cancelled - incorrect confirmation")
        return False
    
    confirm2 = input("🔴 Type 'YES I AM SURE' to confirm: ")
    if confirm2 != 'YES I AM SURE':
        print("❌ Operation cancelled - incorrect confirmation")
        return False
    
    confirm3 = input("🔴 Type 'DELETE ALL DATA' for final confirmation: ")
    if confirm3 != 'DELETE ALL DATA':
        print("❌ Operation cancelled - incorrect confirmation")
        return False
    
    try:
        # Create the Flask app with production config
        app = create_app()
        
        with app.app_context():
            from models import db, User, Resume, JobDescription, MatchScore, Suggestion
            
            # Initialize database with app
            db.init_app(app)
            
            # Print current data counts
            print("\n📊 Current PRODUCTION data counts:")
            print(f"   - Users: {User.query.count()}")
            print(f"   - Resumes: {Resume.query.count()}")
            print(f"   - Job Descriptions: {JobDescription.query.count()}")
            print(f"   - Match Scores: {MatchScore.query.count()}")
            print(f"   - Suggestions: {Suggestion.query.count()}")
            
            # Final confirmation
            final_confirm = input("\n🔴 Type 'EXECUTE' to proceed with deletion: ")
            if final_confirm != 'EXECUTE':
                print("❌ Operation cancelled")
                return False
            
            # Clear data in correct order (respecting foreign key constraints)
            print("\n🧹 Clearing PRODUCTION data...")
            
            # Delete dependent records first
            deleted_matches = MatchScore.query.delete()
            print(f"   ✅ Cleared {deleted_matches} match scores")
            
            deleted_suggestions = Suggestion.query.delete()
            print(f"   ✅ Cleared {deleted_suggestions} suggestions")
            
            deleted_resumes = Resume.query.delete()
            print(f"   ✅ Cleared {deleted_resumes} resumes")
            
            deleted_jds = JobDescription.query.delete()
            print(f"   ✅ Cleared {deleted_jds} job descriptions")
            
            deleted_users = User.query.delete()
            print(f"   ✅ Cleared {deleted_users} users")
            
            # Commit all changes
            db.session.commit()
            
            # Verify data is cleared
            print("\n📊 PRODUCTION data counts after clearing:")
            print(f"   - Users: {User.query.count()}")
            print(f"   - Resumes: {Resume.query.count()}")
            print(f"   - Job Descriptions: {JobDescription.query.count()}")
            print(f"   - Match Scores: {MatchScore.query.count()}")
            print(f"   - Suggestions: {Suggestion.query.count()}")
            
            print("\n🎉 PRODUCTION database data cleared successfully! Schema preserved.")
            print("🚀 Your deployment will now start with a fresh database!")
            return True
            
    except Exception as e:
        print(f"❌ PRODUCTION data clearing failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("⚠️  PRODUCTION DATA CLEARING SCRIPT")
    print("⚠️  Make sure you have set the DATABASE_URL environment variable")
    print("⚠️  to point to your production database before running this!")
    print()
    
    success = clear_production_data()
    sys.exit(0 if success else 1)
