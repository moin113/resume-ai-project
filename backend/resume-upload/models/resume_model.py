from sqlalchemy import Column, String, Float, Text, TIMESTAMP, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database import Base

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True)
    document_link = Column(Text, nullable=False)
    job_description = Column(Text)
    matching_percentage = Column(Float)
    matching_keywords = Column(ARRAY(String))
    missing_keywords = Column(ARRAY(String))
    uploaded_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
