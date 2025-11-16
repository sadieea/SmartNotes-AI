# 🧠 SmartNotes AI

SmartNotes AI is an intelligent learning assistant that transforms any document, lecture notes, textbook chapters, or articles into a concise summary, a list of key takeaways, and an interactive quiz.

---

## 🔴 The Problem

Students and professionals are drowning in information. We spend hours reading dense material, manually trying to summarize it and create study guides. This process is slow, tedious, and inefficient.

---

## 🟢 The Solution

SmartNotes AI automates this entire process. By leveraging the power of Google's Gemini API, it "reads" your documents for you and extracts exactly what you need to learn, test your knowledge, and save valuable time.

**Upload. Generate. Learn. It's that simple.**

---

## ✨ Features

### 📄 Multi-Format File Uploads  
Supports PDF, PNG, JPG, and TXT files.

### 🧠 Intelligent Text Extraction  
- Uses **PyPDF2** to read text from multi-page PDF documents.  
- Uses **Tesseract OCR** to read text from images (like screenshots or textbook photos).

### 🤖 AI-Powered Content Generation  
Connects to **Google's Gemini API (gemini-1.0-pro)** to:  
- Generate a concise summary  
- Extract 5 key points  
- Create a 3-question multiple-choice quiz with options and a hidden answer

### ⚛️ Interactive UI  
- Built with Next.js and TypeScript  
- Styled with Tailwind CSS and Shadcn UI components  
- Features a drag-and-drop file uploader, loading states, and an interactive accordion for the quiz

### 🚀 Robust Backend  
- Built with FastAPI (Python)  
- Asynchronous file handling  
- Securely loads API keys from a `.env` file

---

## 💻 Tech Stack

| Category        | Technology                                          |
|-----------------|------------------------------------------------------|
| **Frontend**    | Next.js, React, TypeScript, Tailwind CSS, Shadcn UI |
| **Backend**     | FastAPI, Python 3.11, Uvicorn                        |
| **AI**          | Google Gemini API (gemini-2.5-flash)                   |
| **Data Processing** | PyPDF2 (for PDFs), Tesseract OCR (for Images)   |
| **Deployment**  | Local Development                                   |

---

## 🚀 How to Run Locally

This is a full-stack project with a separate frontend and backend. You will need two terminals running at the same time.

---

## 📝 Prerequisites

- Python 3.10+  
- Node.js (v18+)  
- Tesseract OCR  
  - On Windows, install Tesseract and update `pytesseract.pytesseract.tesseract_cmd` in `main.py`  
- A Google Gemini API Key

---

## 1. Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/sadieea/SmartNotes-AI.git
cd SmartNotes-AI/backend

# 2. Create and activate a virtual environment
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create your .env file
echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env

# 5. Run the backend server
uvicorn main:app --reload

```

Your backend is now running at:  
👉 http://localhost:8000

---

## 2. Frontend Setup

```bash
# 1. Open a new terminal and go to the frontend folder
cd ../frontend

# 2. Install dependencies
npm install

# 3. Run the frontend server
npm run dev

```

Your frontend is now running at:  
👉 http://localhost:3000

---

## 🏆 Hackathon Submission

This project was built for the **CS Girlies - Make Learning Cool Again** hackathon (Nov 2025).

### Tracks:

- **Main Track:** Automate Learning  
- **Bonus Track:** Build with GitBook [View our Documentation](https://mycompany-142.gitbook.io/smartnotes-ai/) 
- **Bonus Track:** Built with Cline CLI (Used to scaffold the entire project — see screenshots in Cline CLI Screenshorts Folder!)
- **View Presentation:** [Youtube Video](https://www.youtube.com/watch?v=9cMUEZoWRLk&t=1s)
