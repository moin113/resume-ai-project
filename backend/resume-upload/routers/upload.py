from fastapi import APIRouter, UploadFile, File, HTTPException
from utils.file_handler import save_file
from utils.parser import extract_text
from database import SessionLocal
from models.resume_model import Resume
import uuid

router = APIRouter()

def save_to_db(data):
    db = SessionLocal()
    try:
        db.add(data)
        db.commit()
        db.refresh(data)
        return data
    finally:
        db.close()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF/DOCX allowed.")

    file_path = await save_file(file)
    content = extract_text(file_path)

    matched = ["Python", "FastAPI", "SQL"]
    missing = ["Docker", "Celery"]
    percent = 60.0

    resume = Resume(
        document_id=uuid.uuid4(),
        document_link=file_path,
        job_description="Backend role needing Python + FastAPI",
        matching_percentage=percent,
        matching_keywords=matched,
        missing_keywords=missing
    )

    saved = save_to_db(resume)
    return {
        "message": "Uploaded & saved!",
        "resume_id": saved.id,
        "match_percent": percent
    }
