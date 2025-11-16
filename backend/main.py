import os
import json
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field  # <-- Updated import
import google.generativeai as genai
from dotenv import load_dotenv
import PyPDF2
import pytesseract
from PIL import Image

# Load environment variables
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FIX #1: Configure the Gemini client ---
# This line sets up the library. It does not return a value.
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# --- DEFINE YOUR DATA MODELS ---
class NoteQuiz(BaseModel):
    question: str
    options: list[str]
    answer: str

class NoteRequest(BaseModel):
    raw_text: str

class NoteResponse(BaseModel):
    summary: str
    key_points: list[str]
    quiz: list[NoteQuiz] # <-- Use the nested model


@app.get("/")
def read_root():
    """
    Simple Hello World endpoint
    """
    return {"message": "Hello World"}


# --- FIX #2: THE CORRECT GEMINI FUNCTION ---
def generate_notes_from_text(raw_text: str) -> NoteResponse:
    """
    Helper function to generate notes from raw text using GEMINI.
    
    Returns a NoteResponse with summary, key points, and a quiz.
    """
    system_prompt = """You are an AI assistant that helps students study by converting raw text into structured notes.

Given the user's raw text, you must:
1. Generate a concise summary (2-3 sentences)
2. Extract 5 key bullet points
3. Create a 3-question multiple-choice quiz. Each question must have 4 options (A, B, C, D) and you must specify the correct answer.

You MUST return ONLY a valid JSON object that matches this exact structure:
{
    "summary": "A concise summary of the text",
    "key_points": [
        "First key point",
        "Second key point",
        "Third key point",
        "Fourth key point",
        "Fifth key point"
    ],
    "quiz": [
        {
            "question": "Question text?",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "answer": "A) Option 1"
        },
        {
            "question": "Another question?",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "answer": "B) Option 2"
        },
        {
            "question": "Third question?",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "answer": "C) Option 3"
        }
    ]
}

Return ONLY the JSON object, with no additional text or formatting."""
    
    # This is the Gemini model
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # This tells Gemini to output JSON
    generation_config = genai.types.GenerationConfig(
        response_mime_type="application/json"
    )

    try:
        # We combine the prompt and the user text
        full_prompt = system_prompt + "\n\nHere is the text:\n\n" + raw_text
        
        # This is the correct Gemini command
        response = model.generate_content(
            full_prompt,
            generation_config=generation_config
        )
        
        # Parse and validate the JSON
        return NoteResponse.model_validate_json(response.text)

    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to call AI model: {e}")


@app.post("/api/generate", response_model=NoteResponse)
async def generate_notes(request: NoteRequest):
    """
    Generate notes from raw text using GEMINI.
    """
    return generate_notes_from_text(request.raw_text)


@app.post("/api/upload", response_model=NoteResponse)
async def upload_and_generate_notes(file: UploadFile = File(...)):
    """
    Upload a file (PDF, image, or text) and generate notes from it.
    """
    content = await file.read()
    raw_text = ""
    
    if file.content_type == "application/pdf":
        try:
            pdf_file = io.BytesIO(content)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            for page in pdf_reader.pages:
                raw_text += page.extract_text() + "\n"
            if not raw_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing PDF: {str(e)}")
    
    elif file.content_type in ["image/png", "image/jpeg"]:
        try:
            image = Image.open(io.BytesIO(content))
            raw_text = pytesseract.image_to_string(image)
            if not raw_text.strip():
                raise HTTPException(status_code=400, detail="Could not extract text from image")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")
    
    elif file.content_type == "text/plain":
        try:
            raw_text = content.decode("utf-8")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading text file: {str(e)}")
    
    else:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type: {file.content_type}. Supported types: application/pdf, image/png, image/jpeg, text/plain"
        )
    
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="No text content found in the file")
    
    # This will now call the correct Gemini function
    return generate_notes_from_text(raw_text)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)