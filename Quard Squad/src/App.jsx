import React, { useState } from "react";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

// Set the worker path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const PdfOcrComponent = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentText, setCurrentText] = useState("This is initial");
  const [jd, setJd] = useState("");

  // Get API key from .env (Make sure you add it to your .env file)
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_AI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  function handleJd(event) {
    setJd(event.target.value);
  }

  async function fetchAIResponse() {
    try {
      const r=await model.generateContent(
          ` I need your help in analyzing a resume against a job description. Please identify key skills, qualifications, job titles, and achievements from the resume and compare them with the job description. Additionally, provide recommendations and tips for improving the resume to better match the job description. Here is the resume:

    Resume:
    ${text}

    Job Description:
    ${jd}

    Please provide the following information:
    1. *List of Skills and Qualifications*: Identify the skills and qualifications mentioned in the resume that match the job description.
    2. *Action Verbs*: Highlight any action verbs (e.g., Led, Developed, Managed) from the resume and their relevance to the job role.
    3. *Job Title*: Identify the job title(s) from the resume and match them to the job description's required title.
    4. *Achievements*: Identify any notable achievements or accomplishments from the resume that stand out and align with the job description.
    5. *Missing Skills*: Highlight any missing skills or qualifications in the resume that are specifically required in the job description.
    6. *Match Score*: Provide a score from 1-10 on how well the resume matches the job description based on relevant keywords and skills.
    
    *Recommendations and Tips*:
    7. Provide actionable recommendations on how the candidate can improve their resume to better match the job description. 
    8. Suggest any skills, certifications, or experiences that could strengthen the resume and make the candidate more competitive for this role.
    9. Provide tips on improving the clarity, formatting, or structure of the resume to enhance its appeal to recruiters.
    
    Be as detailed as possible in your analysis and suggestions. Aim to make the feedback constructive and helpful for improving the candidate's chances of landing the job.
    Give all the points as a sigle word not a sentence.
`
      )
      const aiText = await r.response.text();
      console.log(aiText);
      const cleanText = aiText.replace(/\*\*/g, "");
      setCurrentText(cleanText);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  }

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setText("");

      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedarray = new Uint8Array(fileReader.result);
        try {
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let extractedText = "";

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({ canvasContext: context, viewport }).promise;

            const imageDataUrl = canvas.toDataURL("image/png");
            const { data: { text } } = await Tesseract.recognize(imageDataUrl, "eng");

            extractedText += `Page ${pageNum}:\n${text}\n\n`;
          }

          setText(extractedText);
        } catch (error) {
          console.error("Error processing PDF:", error);
        } finally {
          setLoading(false);
        }
      };

      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex w-full bg-black">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary">Extract Text from PDF (OCR)</h2>
        <div className="mb-3">
          <label className="form-label">Enter Job Description:</label>
          <textarea
            className="form-control"
            rows="10"
            onChange={handleJd}
            placeholder="Paste the job description here..."
          />
        </div>
  
        <div className="mb-3">
          <label className="form-label">Upload Resume (PDF):</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="form-control"
          />
        </div>
  
        {loading && <div className="alert alert-info">Processing PDF...</div>}
  
        <div className="text-center">
          <button className="btn btn-primary" onClick={fetchAIResponse}>
            Compare Resume with JD
          </button>
        </div>
  
        <div className="mt-4 p-3 border rounded bg-light">
          <h4 className="text-danger">Resume Analysis:</h4>
          <p style={{ whiteSpace: "pre-line" }}>{currentText}</p>
        </div>
      </div>
    </div>
  );
}  

export default PdfOcrComponent;