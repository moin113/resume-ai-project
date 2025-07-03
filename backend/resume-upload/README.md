# Resume AI Backend

A FastAPI-based backend service for resume analysis and job matching.

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set up your database credentials in .env file
# Start the application
python -m uvicorn main:app --reload
```

Visit http://127.0.0.1:8000/docs for API documentation.

## 📚 Documentation

- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Comprehensive step-by-step guide for beginners
- **[TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md)** - Common issues and solutions

## 🔧 Features

- Resume file upload (PDF/DOCX)
- Text extraction from documents
- Database storage with PostgreSQL
- RESTful API with automatic documentation
- Job matching analysis (basic implementation)

## 🛠️ Tech Stack

- **FastAPI** - Modern web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Database
- **PyMuPDF** - PDF text extraction
- **python-docx** - DOCX text extraction

## 📁 Project Structure

```
resume-ai-backend/
├── main.py                 # Application entry point
├── database.py             # Database configuration
├── models/                 # Database models
├── routers/                # API endpoints
├── utils/                  # Utility functions
└── uploads/                # File storage
```

## 🆘 Need Help?

1. Check [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md) for detailed setup instructions
2. See [TROUBLESHOOTING_GUIDE.md](TROUBLESHOOTING_GUIDE.md) for common issues
3. Ensure PostgreSQL is running and database exists
4. Verify all dependencies are installed

## 📄 License

This project is for educational purposes.
