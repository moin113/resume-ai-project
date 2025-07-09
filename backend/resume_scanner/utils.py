import spacy
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

def calculate_matching_score(resume_text: str, job_description_text: str) -> float:
    texts = [resume_text, job_description_text]
    vectorizer = CountVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()
    score = cosine_similarity([vectors[0]], [vectors[1]])[0][0]
    percentage = round(score * 100, 2)
    return percentage

def extract_missing_keywords(resume_text: str, job_description_text: str):
    jd_doc = nlp(job_description_text.lower())
    resume_doc = nlp(resume_text.lower())
    jd_keywords = set([token.text for token in jd_doc if token.is_alpha and not token.is_stop])
    resume_keywords = set([token.text for token in resume_doc if token.is_alpha and not token.is_stop])
    missing_keywords = list(jd_keywords - resume_keywords)
    return missing_keywords
