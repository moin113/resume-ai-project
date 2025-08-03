# 🔧 Backend Documentation

## Overview

The Resume Doctor.Ai backend is a Flask-based REST API that provides AI-powered resume analysis, job description processing, and intelligent suggestion generation.

## 🏗️ Architecture

```
backend/
├── app_fixed.py                 # Main Flask application
├── models.py                    # Database models
├── config.py                    # Configuration management
├── routes/                      # API endpoints
│   ├── us05_upload_routes.py    # Resume upload & management
│   ├── us05_jd_routes.py        # Job description management
│   ├── us06_matching_routes.py  # Matching algorithm
│   └── us07_suggestions_routes.py # AI suggestions
├── services/                    # Business logic
│   ├── keyword_parser.py        # NLP keyword extraction
│   ├── matching_service.py      # Score calculation
│   └── dynamic_suggestions_service.py # AI suggestions
├── middleware/                  # Security & auth
└── uploads/                     # File storage
```

## 🚀 Technology Stack

### Core Framework
- **Flask**: Lightweight WSGI web framework
- **Flask-SQLAlchemy**: ORM for database operations
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing

### AI/NLP Libraries
- **spaCy**: Advanced NLP processing
- **NLTK**: Natural language toolkit
- **scikit-learn**: Machine learning algorithms
- **TF-IDF**: Term frequency analysis

### File Processing
- **PyPDF2**: PDF text extraction
- **python-docx**: Word document processing
- **Werkzeug**: File upload handling

## 📊 Database Models

### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='basic')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

### Resume Model
```python
class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    extracted_text = db.Column(db.Text)
    technical_skills = db.Column(db.Text)  # JSON
    soft_skills = db.Column(db.Text)       # JSON
    other_keywords = db.Column(db.Text)    # JSON
    keyword_count = db.Column(db.Integer, default=0)
    keywords_extracted = db.Column(db.Boolean, default=False)
```

### JobDescription Model
```python
class JobDescription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(255), nullable=False)
    company_name = db.Column(db.String(255))
    job_text = db.Column(db.Text, nullable=False)
    technical_skills = db.Column(db.Text)  # JSON
    soft_skills = db.Column(db.Text)       # JSON
    other_keywords = db.Column(db.Text)    # JSON
    keywords_extracted = db.Column(db.Boolean, default=False)
```

### MatchScore Model
```python
class MatchScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'))
    job_description_id = db.Column(db.Integer, db.ForeignKey('job_descriptions.id'))
    overall_score = db.Column(db.Float, nullable=False)
    technical_score = db.Column(db.Float, default=0.0)
    soft_skills_score = db.Column(db.Float, default=0.0)
    other_keywords_score = db.Column(db.Float, default=0.0)
    algorithm_used = db.Column(db.String(50), default='jaccard')
```

### ResumeSuggestion Model
```python
class ResumeSuggestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    resume_id = db.Column(db.Integer, db.ForeignKey('resumes.id'))
    jd_id = db.Column(db.Integer, db.ForeignKey('job_descriptions.id'))
    suggestion_type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.JSON, nullable=True)
    action = db.Column(db.Text, nullable=True)
    tier = db.Column(db.String(20), default='basic')
```

## 🛣️ API Routes

### Authentication Routes
```python
# Login endpoint
POST /api/login
{
    "email": "user@example.com",
    "password": "password123"
}
Response: {"access_token": "jwt_token", "user": {...}}

# Registration endpoint  
POST /api/register
{
    "first_name": "John",
    "last_name": "Doe", 
    "email": "john@example.com",
    "password": "password123"
}
```

### Resume Management Routes
```python
# Upload resume
POST /api/upload_resume
Content-Type: multipart/form-data
File: resume.pdf
Response: {
    "success": true,
    "resume_id": 123,
    "keywords_extracted": true,
    "keyword_count": 45
}

# Get user resumes
GET /api/resumes
Headers: Authorization: Bearer <jwt_token>
Response: {
    "success": true,
    "resumes": [...]
}

# Get specific resume
GET /api/resumes/<id>
Response: {
    "success": true,
    "resume": {...}
}
```

### Job Description Routes
```python
# Save job description
POST /api/upload_jd
{
    "title": "Software Engineer",
    "company_name": "Tech Corp",
    "job_text": "Job description content..."
}
Response: {
    "success": true,
    "jd_id": 456,
    "keywords_extracted": true
}

# Get user job descriptions
GET /api/job_descriptions
Response: {
    "success": true,
    "job_descriptions": [...]
}
```

### Matching & Analysis Routes
```python
# Calculate matching score
POST /api/calculate_match
{
    "resume_id": 123,
    "job_description_id": 456
}
Response: {
    "success": true,
    "overall_score": 78.5,
    "detailed_scores": {
        "technical_score": 85.2,
        "soft_skills_score": 72.1,
        "other_keywords_score": 68.9
    }
}
```

### Suggestion Generation Routes
```python
# Generate basic suggestions
POST /api/basic_suggestions
{
    "resume_id": 123,
    "job_description_id": 456
}
Response: {
    "success": true,
    "suggestions": [...],
    "total_suggestions": 12
}

# Generate premium suggestions
POST /api/premium_suggestions
{
    "resume_id": 123,
    "job_description_id": 456
}
Response: {
    "success": true,
    "suggestions": [...],
    "total_suggestions": 18
}
```

## 🧠 AI Services

### 1. Keyword Parser Service
**File**: `services/keyword_parser.py`

**Purpose**: Extract and categorize keywords from text using NLP

**Technologies**:
- **spaCy**: Named entity recognition, POS tagging
- **NLTK**: Tokenization, stemming, lemmatization
- **TF-IDF**: Statistical keyword importance
- **Custom Patterns**: Industry-specific recognition

**Key Methods**:
```python
def extract_keywords(self, text: str) -> Dict[str, List[str]]:
    """Extract technical, soft skills, and other keywords"""
    
def extract_technical_skills(self, text: str) -> List[str]:
    """Extract programming languages, frameworks, tools"""
    
def extract_soft_skills(self, text: str) -> List[str]:
    """Extract communication, leadership, teamwork skills"""
    
def extract_other_keywords(self, text: str) -> List[str]:
    """Extract industry terms, certifications, methodologies"""
```

**Algorithm Flow**:
1. **Text Preprocessing**: Clean and normalize input text
2. **NLP Processing**: Apply spaCy/NLTK for linguistic analysis
3. **Pattern Matching**: Use regex patterns for technical terms
4. **Statistical Analysis**: Apply TF-IDF for keyword importance
5. **Categorization**: Classify keywords into technical/soft/other
6. **Deduplication**: Remove duplicates and normalize variations

### 2. Matching Service
**File**: `services/matching_service.py`

**Purpose**: Calculate compatibility scores between resumes and job descriptions

**Algorithm**: **Jaccard Similarity + Weighted Scoring**

**Key Methods**:
```python
def calculate_match_score(self, resume_id, jd_id, user_id) -> Dict:
    """Calculate comprehensive matching score"""
    
def _calculate_jaccard_similarity(self, set1: Set, set2: Set) -> float:
    """Calculate Jaccard similarity coefficient"""
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0.0
    
def _calculate_weighted_score(self, scores: Dict) -> float:
    """Apply weighted scoring to different categories"""
    return (scores['technical'] * 0.5 + 
            scores['soft_skills'] * 0.3 + 
            scores['other'] * 0.2)
```

**Scoring Algorithm**:
```python
# Step 1: Extract keyword sets
resume_tech = set(resume.technical_skills)
jd_tech = set(jd.technical_skills)

# Step 2: Calculate Jaccard similarity
jaccard_tech = len(resume_tech ∩ jd_tech) / len(resume_tech ∪ jd_tech)

# Step 3: Apply category weights
weighted_score = (jaccard_tech * 0.5) + (jaccard_soft * 0.3) + (jaccard_other * 0.2)

# Step 4: Convert to percentage
final_score = weighted_score * 100
```

### 3. Dynamic Suggestions Service
**File**: `services/dynamic_suggestions_service.py`

**Purpose**: Generate AI-powered resume improvement suggestions

**Technologies**:
- **Advanced NLP**: Context analysis and importance scoring
- **Gap Analysis**: Missing vs. extra keyword identification
- **Priority Classification**: Critical, high, medium, low urgency
- **Action Generation**: Specific, actionable recommendations

**Key Methods**:
```python
def generate_basic_suggestions(self, resume_id, jd_id, user_id) -> Dict:
    """Generate basic improvement suggestions"""
    
def generate_premium_suggestions(self, resume_id, jd_id, user_id) -> Dict:
    """Generate advanced premium suggestions"""
    
def analyze_keywords_advanced(self, resume_id, jd_id, user_id) -> Dict:
    """Perform advanced keyword gap analysis"""
```

**Suggestion Generation Algorithm**:

1. **Keyword Analysis (X, Y, Z, Q Variables)**:
   - **X**: Job description keywords (required skills)
   - **Y**: Resume keywords (current skills)
   - **Z**: Missing keywords (X - Y) - **Primary focus**
   - **Q**: Extra keywords (Y - X) - **Strengths**

2. **Gap Analysis**:
   ```python
   missing_keywords = jd_keywords - resume_keywords  # Z variable
   extra_keywords = resume_keywords - jd_keywords    # Q variable
   ```

3. **Priority Classification**:
   - **Critical**: Keywords appearing 3+ times in JD
   - **High**: Keywords appearing 2+ times in JD
   - **Medium**: Soft skills and important terms
   - **Low**: Industry terms and nice-to-have skills

4. **Suggestion Categories**:

   **Basic Suggestions**:
   - Missing technical skills (Z variable)
   - Soft skills gaps
   - Industry keyword recommendations
   - Basic formatting improvements

   **Premium Suggestions**:
   - Critical gaps analysis with urgency
   - Contextual advice based on job requirements
   - Quantification recommendations
   - Skill development roadmaps
   - Resume structure optimization
   - ATS optimization tips

5. **Action Generation**:
   ```python
   def _generate_tech_action(self, keyword, jd_text, resume_text):
       """Generate specific action for technical skill"""
       if keyword in ['python', 'java', 'javascript']:
           return f"Add {keyword} to Skills section and describe a project using it"
       elif keyword in ['aws', 'azure', 'docker']:
           return f"Highlight {keyword} experience in Projects or Experience section"
   ```

## 🔒 Security & Authentication

### JWT Authentication
```python
# JWT configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Protected route decorator
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return jsonify(user_id=current_user)
```

### File Upload Security
```python
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
```

### Input Validation
```python
def validate_job_description(data):
    if not data.get('title') or len(data['title'].strip()) < 2:
        return False, "Title must be at least 2 characters"
    if not data.get('job_text') or len(data['job_text'].strip()) < 50:
        return False, "Job description must be at least 50 characters"
    return True, None
```

## 🚀 Deployment Configuration

### Environment Variables
```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
```

### Database Initialization
```python
# init_database.py
from app_fixed import app, db
from models import User, Resume, JobDescription, MatchScore, ResumeSuggestion

with app.app_context():
    db.create_all()
    print("Database tables created successfully!")
```

### Application Startup
```python
# app_fixed.py
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=False  # Set to False in production
    )
```

## 📊 Performance Optimization

### Database Indexing
```python
# Add indexes for frequently queried fields
db.Index('idx_user_email', User.email)
db.Index('idx_resume_user', Resume.user_id, Resume.is_active)
db.Index('idx_jd_user', JobDescription.user_id, JobDescription.is_active)
db.Index('idx_match_user_date', MatchScore.user_id, MatchScore.created_at)
```

### Caching Strategy
```python
# Cache keyword extraction results
from functools import lru_cache

@lru_cache(maxsize=100)
def extract_keywords_cached(text_hash):
    return keyword_parser.extract_keywords(text)
```

### File Processing Optimization
```python
# Async file processing for large documents
import asyncio

async def process_resume_async(file_path):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, extract_text_from_file, file_path)
```

## 🔧 Error Handling

### Global Error Handler
```python
@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return jsonify(error=e.description), e.code
    
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify(error="Internal server error"), 500
```

### Service-Level Error Handling
```python
def safe_keyword_extraction(text):
    try:
        return keyword_parser.extract_keywords(text)
    except Exception as e:
        logger.error(f"Keyword extraction failed: {e}")
        return {"technical": [], "soft_skills": [], "other": []}
```

## 📈 Monitoring & Logging

### Logging Configuration
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
```

### Performance Metrics
```python
import time

def log_performance(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        logger.info(f"{func.__name__} took {end_time - start_time:.2f} seconds")
        return result
    return wrapper
```

## 🔄 Integration Points

### Frontend Integration
- **Authentication**: JWT tokens passed in Authorization headers
- **File Upload**: Multipart form data with progress tracking
- **Real-time Updates**: WebSocket connections for live feedback
- **Error Handling**: Standardized JSON error responses

### Database Integration
- **Connection Pooling**: SQLAlchemy connection management
- **Transaction Management**: Atomic operations for data consistency
- **Migration Support**: Alembic for schema versioning

### External Services
- **File Storage**: Local filesystem with cloud storage ready
- **Email Service**: SMTP configuration for notifications
- **Analytics**: Integration points for usage tracking

---

This backend provides a robust, scalable foundation for AI-powered resume analysis with comprehensive error handling, security measures, and performance optimizations.
