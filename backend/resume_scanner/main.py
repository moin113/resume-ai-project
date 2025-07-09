from fastapi import FastAPI
from pydantic import BaseModel
from resume_scanner.utils import calculate_matching_score, extract_missing_keywords

app = FastAPI()

class ResumeJobInput(BaseModel):
    resume_text: str
    job_description_text: str

@app.post("/matching-score")
def matching_score(data: ResumeJobInput):
    percentage = calculate_matching_score(data.resume_text, data.job_description_text)
    return {"matching_score": percentage}

@app.post("/keyword-suggestions")
def keyword_suggestions(data: ResumeJobInput):
    missing_keywords = extract_missing_keywords(data.resume_text, data.job_description_text)
    return {"missing_keywords": missing_keywords}
