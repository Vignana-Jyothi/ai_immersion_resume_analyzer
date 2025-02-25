/**const GEMINI_API_KEY = "AIzaSyA-w9zigZ3oNh4kVAUP9HsPnU5XxiMAd7g"; // Replace with your actual API key

// Function to upload and analyze the resume
function uploadResume() {
    let fileInput = document.getElementById("resumeInput");
    let outputDiv = document.getElementById("output");

    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }

    let file = fileInput.files[0];

    // Read the file as text
    let reader = new FileReader();
    reader.onload = function(event) {
        let resumeText = event.target.result;

        // Call Gemini API to analyze the resume
        analyzeResume(resumeText);
    };
    reader.readAsText(file); // Reads the file as text
}

// Function to analyze resume using Gemini API
function analyzeResume(resumeText) {
    let outputDiv = document.getElementById("output");

    let prompt = `
        You are an AI resume reviewer. Analyze the following resume and:
        - Identify mistakes
        - Highlight missing details
        - Provide suggestions for improvement

        Resume:
        ${resumeText}
    `;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: { text: prompt }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        if (!data || !data.candidates || data.candidates.length === 0) {
            outputDiv.innerHTML = `<p style="color:red;">Error: No response from AI.</p>`;
            return;
        }

        let feedback = data.candidates[0].output; // Extract AI response

        outputDiv.innerHTML = `
            <h3>Extracted Resume Text:</h3>
            <p>${resumeText}</p>

            <h3>Gemini AI Feedback:</h3>
            <p>${feedback}</p>

            <h3>Ask Gemini AI:</h3>
            <input type="text" id="question" placeholder="Ask about your resume...">
            <button onclick="askGemini()">Ask</button>
            <div id="chatResponse"></div>
        `;
    })
    .catch(error => {
        console.error("Error:", error);
        outputDiv.innerHTML = `<p style="color:red;">Error processing the file. Try again.</p>`;
    });
}

// Function to ask follow-up questions to Gemini AI
function askGemini() {
    let question = document.getElementById("question").value;
    let chatResponseDiv = document.getElementById("chatResponse");

    if (!question.trim()) {
        alert("Please enter a question!");
        return;
    }

    let prompt = `Based on my resume analysis, ${question}`;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: { text: prompt }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        if (!data || !data.candidates || data.candidates.length === 0) {
            chatResponseDiv.innerHTML = `<p style="color:red;">Error: No response from AI.</p>`;
            return;
        }

        let answer = data.candidates[0].output; // Extract AI response

        chatResponseDiv.innerHTML = `<p><strong>Gemini:</strong> ${answer}</p>`;
    })
    .catch(error => {
        console.error("Error:", error);
        chatResponseDiv.innerHTML = `<p style="color:red;">Error processing your question.</p>`;
    });
}
**/
/**const GEMINI_API_KEY = "AIzaSyA-w9zigZ3oNh4kVAUP9HsPnU5XxiMAd7g"; // Replace with your actual API key

// Function to upload and analyze the resume
function uploadResume() {
    let fileInput = document.getElementById("resumeInput");
    let outputDiv = document.getElementById("output");

    if (fileInput.files.length === 0) {
        alert("Please select a file first!");
        return;
    }

    let file = fileInput.files[0];

    // Read the file as text
    let reader = new FileReader();
    reader.onload = function(event) {
        let resumeText = event.target.result;

        // **Limit the resume text to 5000 characters**
        let trimmedText = resumeText.substring(0, 5000);

        // Call Gemini API to analyze the resume
        analyzeResume(trimmedText);
    };
    reader.readAsText(file); // Reads the file as text
}

// Function to analyze resume using Gemini API
function analyzeResume(resumeText) {
    let outputDiv = document.getElementById("output");

    let prompt = `You are an AI resume reviewer. Analyze the following resume and:
        - Identify mistakes
        - Highlight missing details
        - Provide suggestions for improvement

        Resume:
        ${resumeText}
    `;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt, // Corrected JSON structure
            temperature: 0.7,
            max_tokens: 500
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        if (!data || !data.candidates || data.candidates.length === 0) {
            outputDiv.innerHTML = `<p style="color:red;">Error: No response from AI.</p>`;
            return;
        }

        let feedback = data.candidates[0].output; // Extract AI response

        outputDiv.innerHTML = `
            <h3>Extracted Resume Text:</h3>
            <p>${resumeText}</p>

            <h3>Gemini AI Feedback:</h3>
            <p>${feedback}</p>

            <h3>Ask Gemini AI:</h3>
            <input type="text" id="question" placeholder="Ask about your resume...">
            <button onclick="askGemini()">Ask</button>
            <div id="chatResponse"></div>
        `;
    })
    .catch(error => {
        console.error("Error:", error);
        outputDiv.innerHTML = `<p style="color:red;">Error processing the file. Try again.</p>`;
    });
}

// Function to ask follow-up questions to Gemini AI
function askGemini() {
    let question = document.getElementById("question").value;
    let chatResponseDiv = document.getElementById("chatResponse");

    if (!question.trim()) {
        alert("Please enter a question!");
        return;
    }

    let prompt = `Based on my resume analysis, ${question}`;

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: prompt, // Corrected JSON structure
            temperature: 0.7,
            max_tokens: 300
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("API Response:", data);

        if (!data || !data.candidates || data.candidates.length === 0) {
            chatResponseDiv.innerHTML = `<p style="color:red;">Error: No response from AI.</p>`;
            return;
        }

        let answer = data.candidates[0].output; // Extract AI response

        chatResponseDiv.innerHTML = `<p><strong>Gemini:</strong> ${answer}</p>`;
    })
    .catch(error => {
        console.error("Error:", error);
        chatResponseDiv.innerHTML = `<p style="color:red;">Error processing your question.</p>`;
    });
}
**/

document.getElementById("uploadForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const fileInput = document.getElementById("resumeInput");
    const file = fileInput.files[0];
    
    if (!file || file.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(event) {
        const pdfData = new Uint8Array(event.target.result);
        
        try {
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            let extractedText = "";
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                extractedText += textContent.items.map(item => item.str).join(" ") + "\n";
            }
            
            analyzeResume(extractedText);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
            alert("Failed to extract text from PDF. Please try again.");
        }
    };
    reader.readAsArrayBuffer(file);
});

async function analyzeResume(resumeText) {
    document.getElementById("output").innerText = "Analyzing...";
    
    const GEMINI_API_KEY = "";
    
    const requestBody = {
        contents: [{ parts: [{ text: `You are an AI resume reviewer. Analyze the following resume and:
        - Identify mistakes
        - Highlight missing details
        - Provide suggestions for improvement
        
        Resume:
        ${resumeText}` }] }]
    };
    
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        
        if (!data || !data.candidates || data.candidates.length === 0) {
            document.getElementById("output").innerHTML = `<p style="color:red;">Error: No response from AI.</p>`;
            return;
        }
        
        document.getElementById("output").innerText = data.candidates[0].output;
    } catch (error) {
        console.error("Error analyzing resume:", error);
        document.getElementById("output").innerText = "Failed to analyze resume. Please try again.";
    }
}
