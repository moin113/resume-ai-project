from fastapi import FastAPI
from routers import upload
from models.resume_model import Resume
from database import Base, engine

# ✅ Create FastAPI instance
app = FastAPI(title="Resume AI")

# ✅ Create tables in DB
Base.metadata.create_all(bind=engine)

# ✅ Register routes
app.include_router(upload.router, prefix="/api/resume", tags=["Upload"])
