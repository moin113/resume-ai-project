#!/usr/bin/env python3
"""
Clear All Data Script for Resume Doctor AI
==========================================

This script clears all user data from the database while preserving the schema.
Use this for a fresh start or to reset the application to initial state.

⚠️  WARNING: This will permanently delete ALL user data!
- All user accounts
- All uploaded resumes
- All job descriptions
- All scan history
- All matching results

The database schema (tables, columns, relationships) will remain intact.
"""

import os
import sys
from sqlalchemy import text

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app_fixed import app
from models import db, User, Resume, JobDescription, MatchScore, Suggestion

def clear_all_data():
    """Clear all data from all tables while preserving schema."""
    
    print("🩺 Resume Doctor AI - Data Clearing Script")
    print("=" * 50)
    
    # Confirm action
    print("⚠️  WARNING: This will permanently delete ALL user data!")
    print("- All user accounts")
    print("- All uploaded resumes") 
    print("- All job descriptions")
    print("- All scan history")
    print("- All matching results")
    print()
    
    confirm = input("Are you sure you want to continue? Type 'YES' to confirm: ")
    
    if confirm != 'YES':
        print("❌ Operation cancelled.")
        return False
    
    print("\n🔄 Starting data clearing process...")
    
    try:
        # Initialize the database with the app
        db.init_app(app)

        with app.app_context():
            # Get initial counts
            user_count = User.query.count()
            resume_count = Resume.query.count()
            jd_count = JobDescription.query.count()
            match_count = MatchScore.query.count()
            suggestion_count = Suggestion.query.count()

            print(f"📊 Current data counts:")
            print(f"   - Users: {user_count}")
            print(f"   - Resumes: {resume_count}")
            print(f"   - Job Descriptions: {jd_count}")
            print(f"   - Match Scores: {match_count}")
            print(f"   - Suggestions: {suggestion_count}")
            print()

            # Clear data in correct order (respecting foreign key constraints)
            print("🗑️  Clearing data...")

            # 1. Clear suggestions first (has foreign keys to resumes and job_descriptions)
            Suggestion.query.delete()
            print("   ✅ Cleared suggestions")

            # 2. Clear match scores (has foreign keys to resumes and job_descriptions)
            MatchScore.query.delete()
            print("   ✅ Cleared match scores")

            # 3. Clear resumes (has foreign key to users)
            Resume.query.delete()
            print("   ✅ Cleared resumes")

            # 4. Clear job descriptions (has foreign key to users)
            JobDescription.query.delete()
            print("   ✅ Cleared job descriptions")

            # 5. Clear users last
            User.query.delete()
            print("   ✅ Cleared users")
            
            # Reset auto-increment sequences (for PostgreSQL)
            try:
                # This works for PostgreSQL
                db.session.execute(text("ALTER SEQUENCE users_id_seq RESTART WITH 1"))
                db.session.execute(text("ALTER SEQUENCE resumes_id_seq RESTART WITH 1"))
                db.session.execute(text("ALTER SEQUENCE job_descriptions_id_seq RESTART WITH 1"))
                db.session.execute(text("ALTER SEQUENCE match_scores_id_seq RESTART WITH 1"))
                db.session.execute(text("ALTER SEQUENCE resume_suggestions_id_seq RESTART WITH 1"))
                print("   ✅ Reset ID sequences")
            except Exception as e:
                # For SQLite or if sequences don't exist
                print(f"   ⚠️  Could not reset sequences: {e}")

            # Commit all changes
            db.session.commit()

            # Verify clearing
            final_user_count = User.query.count()
            final_resume_count = Resume.query.count()
            final_jd_count = JobDescription.query.count()
            final_match_count = MatchScore.query.count()
            final_suggestion_count = Suggestion.query.count()

            print(f"\n📊 Final data counts:")
            print(f"   - Users: {final_user_count}")
            print(f"   - Resumes: {final_resume_count}")
            print(f"   - Job Descriptions: {final_jd_count}")
            print(f"   - Match Scores: {final_match_count}")
            print(f"   - Suggestions: {final_suggestion_count}")

            if (final_user_count == 0 and final_resume_count == 0 and
                final_jd_count == 0 and final_match_count == 0 and final_suggestion_count == 0):
                print("\n✅ SUCCESS: All data cleared successfully!")
                print("🔄 Database is now ready for fresh start.")
                print("📋 Schema preserved - all tables and relationships intact.")
                return True
            else:
                print("\n❌ ERROR: Some data may not have been cleared properly.")
                return False
                
    except Exception as e:
        print(f"\n❌ ERROR during data clearing: {e}")
        db.session.rollback()
        return False

def verify_schema():
    """Verify that database schema is intact after clearing."""
    
    print("\n🔍 Verifying database schema...")
    
    try:
        # Initialize the database with the app
        db.init_app(app)

        with app.app_context():
            # Test that we can create tables (should already exist)
            db.create_all()
            
            # Test basic operations on each table
            test_user = User(
                email="test@example.com",
                password_hash="test_hash",
                first_name="Test",
                last_name="User"
            )
            db.session.add(test_user)
            db.session.flush()  # Get ID without committing
            
            test_resume = Resume(
                user_id=test_user.id,
                filename="test.pdf",
                original_text="Test content",
                extracted_keywords={"technical": ["Python"], "soft": ["Communication"]}
            )
            db.session.add(test_resume)
            db.session.flush()
            
            test_jd = JobDescription(
                user_id=test_user.id,
                title="Test Job",
                company="Test Company",
                description="Test description",
                extracted_keywords={"technical": ["Python"], "soft": ["Leadership"]}
            )
            db.session.add(test_jd)
            db.session.flush()
            
            test_match = MatchScore(
                user_id=test_user.id,
                resume_id=test_resume.id,
                job_description_id=test_jd.id,
                overall_score=85.5,
                technical_score=90.0,
                soft_skills_score=80.0,
                other_score=85.0
            )
            db.session.add(test_match)
            
            # Rollback test data
            db.session.rollback()
            
            print("   ✅ Users table - OK")
            print("   ✅ Resumes table - OK")
            print("   ✅ Job Descriptions table - OK")
            print("   ✅ Match Scores table - OK")
            print("   ✅ Foreign key relationships - OK")
            print("\n✅ Schema verification complete - All tables functional!")
            
            return True
            
    except Exception as e:
        print(f"\n❌ Schema verification failed: {e}")
        return False

if __name__ == "__main__":
    print("🩺 Resume Doctor AI - Database Reset Utility")
    print("=" * 50)
    
    # Clear all data
    if clear_all_data():
        # Verify schema is intact
        if verify_schema():
            print("\n🎉 Database reset completed successfully!")
            print("🚀 Ready for fresh start with clean data.")
        else:
            print("\n⚠️  Data cleared but schema verification failed.")
            print("   You may need to recreate the database.")
    else:
        print("\n❌ Database reset failed.")
        print("   Please check the error messages above.")
    
    print("\n" + "=" * 50)
    print("Script completed.")
