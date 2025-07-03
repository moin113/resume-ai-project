import os, shutil
from uuid import uuid4
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_file(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1]
    name = f"{uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, name)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return path
