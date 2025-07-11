from fastapi import FastAPI
from .models import MatchRequest, MatchResponse
from .matching import extract_keywords, calculate_match

app = FastAPI()

@app.post("/match", response_model=MatchResponse)
async def match_resume(request: MatchRequest):
    return calculate_match(request)

