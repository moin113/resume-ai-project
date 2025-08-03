#!/usr/bin/env python3
"""
Clean all data from the database and start fresh
"""

import os
import sqlite3
from flask import Flask
from models import db

def clean_database():
    """Clean all data from the database"""
    
    print("🧹 Cleaning Database - Starting Fresh")
    print("=" * 50)
    
    # Database path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    db_path = os.path.join(project_root, 'shared', 'database', 'dr_resume_dev.db')
    
    print(f"📍 Database location: {db_path}")
    print(f"📁 Database exists: {os.path.exists(db_path)}")
    
    if os.path.exists(db_path):
        # Connect directly to SQLite
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        table_names = [t[0] for t in tables]
        
        print(f"📊 Found tables: {table_names}")
        
        # Count records before cleaning
        total_records = 0
        for table in table_names:
            if table != 'sqlite_sequence':
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"   {table}: {count} records")
                total_records += count
        
        print(f"\n🗂️ Total records before cleaning: {total_records}")
        
        # Clean all tables (except sqlite_sequence)
        for table in table_names:
            if table != 'sqlite_sequence':
                cursor.execute(f"DELETE FROM {table}")
                print(f"   ✅ Cleaned {table}")
        
        # Reset auto-increment sequences (if table exists)
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'")
        if cursor.fetchone():
            cursor.execute("DELETE FROM sqlite_sequence")
            print("   ✅ Reset auto-increment sequences")
        else:
            print("   ℹ️ No auto-increment sequences to reset")
        
        conn.commit()
        conn.close()
        
        print("\n🎉 Database cleaned successfully!")
        print("📊 All user data, resumes, job descriptions, and suggestions removed")
        print("🏗️ Database structure preserved for fresh start")
        
    else:
        print("❌ Database file not found")
        return False
    
    return True

def verify_clean_database():
    """Verify the database is clean"""
    
    print("\n🔍 Verifying Clean Database")
    print("-" * 30)
    
    # Create Flask app to use models
    app = Flask(__name__)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(os.path.dirname(current_dir))
    db_path = os.path.join(project_root, 'shared', 'database', 'dr_resume_dev.db')
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    
    with app.app_context():
        from models import User, Resume, JobDescription, MatchScore, Suggestion
        
        # Count records in each table
        users = User.query.count()
        resumes = Resume.query.count()
        jds = JobDescription.query.count()
        matches = MatchScore.query.count()
        suggestions = Suggestion.query.count()
        
        print(f"👥 Users: {users}")
        print(f"📄 Resumes: {resumes}")
        print(f"💼 Job Descriptions: {jds}")
        print(f"🎯 Match Scores: {matches}")
        print(f"💡 Suggestions: {suggestions}")
        
        total = users + resumes + jds + matches + suggestions
        print(f"\n📊 Total records: {total}")
        
        if total == 0:
            print("✅ Database is completely clean!")
            return True
        else:
            print("⚠️ Database still has some data")
            return False

if __name__ == '__main__':
    success = clean_database()
    if success:
        verify_clean_database()
        print("\n🚀 Ready for fresh start!")
        print("🌟 You can now create new users and test all features from scratch")
    else:
        print("\n💥 Database cleaning failed!")
