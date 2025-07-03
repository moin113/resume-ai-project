import fitz  # PyMuPDF
import docx

def extract_text(path: str) -> str:
    if path.endswith(".pdf"):
        return extract_pdf(path)
    elif path.endswith(".docx"):
        return extract_docx(path)
    return ""

def extract_pdf(path):
    doc = fitz.open(path)
    return "".join([page.get_text() for page in doc]).strip()

def extract_docx(path):
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])
