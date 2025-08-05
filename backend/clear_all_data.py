from backend.models import db, User, Resume, JobDescription, MatchScore
from sqlalchemy import text
from flask import Flask
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../database/dr_resume_dev.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    # Disable foreign key checks for safe deletion
    db.session.execute(text('PRAGMA foreign_keys = OFF'))
    db.session.commit()
    # Delete all data from all tables
    # ResumeSuggestion table does not exist in this schema
    db.session.query(MatchScore).delete()
    db.session.query(JobDescription).delete()
    db.session.query(Resume).delete()
    db.session.query(User).delete()
    db.session.commit()
    print('✅ All data cleared, schema preserved!')
