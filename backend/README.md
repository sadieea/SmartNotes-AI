# FastAPI Backend

A simple FastAPI project with a "Hello World" endpoint.

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── venv/               # Virtual environment (not committed to git)
└── README.md           # This file
```

## Setup Instructions

### 1. Activate Virtual Environment

**Windows (PowerShell):**
```bash
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```bash
.\venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Application

### Method 1: Using Uvicorn directly
```bash
uvicorn main:app --reload
```

### Method 2: Running the Python file directly
```bash
python main.py
```

The API will be available at: `http://localhost:8000`

## API Endpoints

- **GET /** - Hello World endpoint
  - Returns: `{"message": "Hello World"}`

## Interactive API Documentation

FastAPI automatically generates interactive API documentation:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Dependencies

- **fastapi**: Modern, fast web framework for building APIs
- **uvicorn**: ASGI server for running FastAPI applications
- **pydantic**: Data validation using Python type annotations
