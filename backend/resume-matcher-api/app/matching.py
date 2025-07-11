import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import MatchRequest, MatchResponse

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text: str):
    doc = nlp(text)
    keywords = set()
    for token in doc:
        if token.pos_ in {"NOUN", "PROPN", "ADJ"} and not token.is_stop and token.is_alpha:
            keywords.add(token.lemma_.lower())
    return list(keywords)

def calculate_match(request: MatchRequest) -> MatchResponse:
    jd_keywords = extract_keywords(request.job_description)
    resume_keywords = extract_keywords(request.resume)

    matched_keywords = list(set(jd_keywords) & set(resume_keywords))
    missing_keywords = list(set(jd_keywords) - set(resume_keywords))

    if jd_keywords:
        keyword_match_score = len(matched_keywords) / len(jd_keywords)
    else:
        keyword_match_score = 0.0

    vectorizer = TfidfVectorizer().fit([request.job_description, request.resume])
    vectors = vectorizer.transform([request.job_description, request.resume])
    cos_sim = cosine_similarity(vectors[0], vectors[1])[0][0]

    final_score = round((0.6 * keyword_match_score + 0.4 * cos_sim) * 100, 2)

    return MatchResponse(
        match_score=final_score,
        matched_keywords=matched_keywords,
        missing_keywords=missing_keywords,
        all_keywords=jd_keywords
    )

