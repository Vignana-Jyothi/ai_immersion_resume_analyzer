from flask import Flask, request, jsonify
import pdfplumber
from docx import Document
import os
import google.generativeai as genai
GEMINI_API_KEY = "AIzaSyA-w9zigZ3oNh4kVAUP9HsPnU5XxiMAd7g"


app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

@app.route("/", methods=["GET"])
def home():
    return "AI Resume Analyzer with Gemini is Running!"

@app.route("/analyze", methods=["POST"])
def analyze_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded!"}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "No file selected!"}), 400

    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["pdf", "docx"]:
        return jsonify({"error": "Unsupported file format! Upload PDF or DOCX."}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    text = extract_text(file_path)
    print(text)
    os.remove(file_path)

    if "No readable text" in text:
        return jsonify({"error": text})

    # Analyze using Gemini AI
    feedback = get_resume_feedback(text)

    return jsonify({"resume_text": text, "feedback": feedback})

def extract_text(file_path):
    text = ""
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    elif file_path.endswith(".docx"):
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    return text.strip() if text.strip() else "No readable text found."

def get_resume_feedback(text):
    prompt = f"""
    You are a professional resume analyst. Analyze this resume, highlight mistakes, missing details, and suggest improvements.

    Resume Content:
    {text}
    """
    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)
    return response.text.strip()

@app.route("/ask", methods=["POST"])
def ask_gemini():
    data = request.json
    question = data.get("question", "")

    if not question:
        return jsonify({"error": "Please ask a valid question!"}), 400

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(question)
    
    return jsonify({"answer": response.text.strip()})

if __name__ == "__main__":
    app.run(debug=True)
