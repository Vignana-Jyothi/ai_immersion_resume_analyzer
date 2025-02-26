import re
import spacy
import pandas as pd
import PyPDF2
import docx
import streamlit as st
from transformers import pipeline

# Load NLP Model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Load Hugging Face Model for Resume Rating
try:
    classifier = pipeline("text-classification", model="syedroshanzameer/resume_model")
except:
    classifier = None
    st.error("⚠️ Hugging Face model not found! Please check your model name.")

# Function to extract text from PDF
def extract_text_from_pdf(pdf_file):
    text = ""
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    for page in pdf_reader.pages:
        text += page.extract_text() or ""
    return text

# Function to extract text from DOCX
def extract_text_from_docx(docx_file):
    doc = docx.Document(docx_file)
    return "\n".join([para.text for para in doc.paragraphs])

# Function to extract email
def extract_email(text):
    email_pattern = r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+"
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else "Not Found"

# Function to extract phone number
def extract_phone(text):
    phone_pattern = r"\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,9}"
    phones = re.findall(phone_pattern, text)
    return phones[0] if phones else "Not Found"

# Function to extract skills
def extract_skills(text):
    skills_list = ["Python", "Java", "C++", "SQL", "Machine Learning", "Deep Learning",
                   "NLP", "TensorFlow", "Keras", "PyTorch", "Data Science", "AI", "Excel",
                   "React", "Angular", "Node.js", "Cloud Computing", "AWS", "Azure", "GCP",
                   "Cybersecurity", "DevOps", "Tableau", "Power BI", "Docker", "Kubernetes"]

    found_skills = [skill for skill in skills_list if re.search(rf'\b{skill}\b', text, re.IGNORECASE)]
    return ", ".join(found_skills) if found_skills else "Not Found"

# Function to analyze resume
def analyze_resume(file, file_type):
    if file_type == "pdf":
        text = extract_text_from_pdf(file)
    elif file_type == "docx":
        text = extract_text_from_docx(file)
    else:
        return {"Error": "Invalid file type"}

    # Process text with NLP
    doc = nlp(text)
    
    # Extract details
    name = next((ent.text for ent in doc.ents if ent.label_ == "PERSON"), "Not Found")
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills(text)

    # Get Resume Strength Prediction (Handle model error)
    prediction = "Model Error"
    if classifier:
        try:
            prediction = classifier(text)[0]['label']
        except:
            prediction = "Model Error"

    return {
        "Name": name,
        "Email": email,
        "Phone": phone,
        "Skills": skills,
        "Resume Strength": prediction
    }

# Streamlit UI
st.set_page_config(page_title="AI Resume Analyzer", page_icon="📄", layout="wide")
st.title("📄 AI-Based Resume Analyzer")

uploaded_file = st.file_uploader("Upload Resume (PDF or DOCX)", type=["pdf", "docx"], help="Supported formats: PDF, DOCX")

if uploaded_file:
    file_type = uploaded_file.type.split("/")[-1]
    
    # Analyze resume
    result = analyze_resume(uploaded_file, file_type)
    
    # Display Results
    st.subheader("Extracted Information:")
    st.write(f"**Phone:** {result['Phone']}")
    st.write(f"**Skills:** {result['Skills']}")
    st.write(f"**Resume Strength:** {result['Resume Strength']}")

    # Save to CSV
    df = pd.DataFrame([result])
    df.to_csv("resume_data.csv", mode="a", index=False, header=False)
    st.success("✅ Resume data saved successfully!")
