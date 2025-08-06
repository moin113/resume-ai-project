import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # Database Configuration - Shared location for all US implementations
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # Go up to Dr.Resume root
    SHARED_DIR = os.path.join(BASE_DIR, 'shared')
    DATABASE_DIR = os.path.join(SHARED_DIR, 'database')

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{os.path.join(DATABASE_DIR, "dr_resume_dev.db")}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or os.environ.get('SECRET_KEY') or 'jwt-secret-key-for-testing-only'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_ALGORITHM = 'HS256'
    
    # File Upload Configuration (from US-03/04) - Shared location
    UPLOAD_FOLDER = os.path.join(SHARED_DIR, 'uploads')
    RESUME_UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, 'resumes')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Allowed file extensions
    ALLOWED_RESUME_EXTENSIONS = {'pdf', 'doc', 'docx'}
    
    # Job Description Configuration (from US-04)
    MAX_JD_LENGTH = 50000  # Maximum characters for job description
    MIN_JD_LENGTH = 50     # Minimum characters for job description
    
    # Keyword Parsing Configuration (NEW for US-05)
    MIN_KEYWORD_LENGTH = 2      # Minimum characters for a keyword
    MAX_KEYWORDS_PER_TEXT = 100 # Maximum keywords to extract per text
    KEYWORD_CONFIDENCE_THRESHOLD = 0.3  # Minimum confidence for keyword extraction
    
    # NLP Configuration
    NLTK_DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nltk_data')
    SPACY_MODEL = 'en_core_web_sm'  # SpaCy model to use
    
    # Skill Categories
    TECHNICAL_SKILLS = [
        'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js', 'express',
        'django', 'flask', 'spring', 'hibernate', 'sql', 'mysql', 'postgresql', 'mongodb',
        'redis', 'elasticsearch', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git',
        'jenkins', 'ci/cd', 'devops', 'linux', 'windows', 'macos', 'html', 'css', 'sass',
        'less', 'bootstrap', 'tailwind', 'webpack', 'babel', 'typescript', 'php', 'ruby',
        'go', 'rust', 'c++', 'c#', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'tensorflow',
        'pytorch', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'tableau', 'power bi',
        'excel', 'powerpoint', 'word', 'photoshop', 'illustrator', 'figma', 'sketch'
    ]
    
    SOFT_SKILLS = [
        'communication', 'leadership', 'teamwork', 'problem solving', 'critical thinking',
        'creativity', 'adaptability', 'time management', 'organization', 'attention to detail',
        'analytical', 'strategic thinking', 'project management', 'collaboration', 'mentoring',
        'training', 'presentation', 'negotiation', 'customer service', 'sales', 'marketing',
        'research', 'writing', 'editing', 'planning', 'coordination', 'multitasking'
    ]
    
    # CORS settings
    CORS_ORIGINS = ['http://localhost:5000', 'http://127.0.0.1:5000']
    
    # Password requirements
    MIN_PASSWORD_LENGTH = 8
    
    # Email validation
    EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    @staticmethod
    def init_app(app):
        # Create shared directories if they don't exist
        os.makedirs(Config.SHARED_DIR, exist_ok=True)
        os.makedirs(Config.DATABASE_DIR, exist_ok=True)
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.RESUME_UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.NLTK_DATA_PATH, exist_ok=True)
