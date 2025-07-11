from pydantic import BaseModel
from typing import List

class MatchRequest(BaseModel):
    job_description: str
    resume: str

class MatchResponse(BaseModel):
    match_score: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    all_keywords: List[str]

