# ICICI Prudential RAG Assistant

A facts-only, RAG-based AI assistant for mutual funds, specifically tailored for 5 ICICI Prudential schemes. This system scrapes clean data from Groww, generates vector embeddings, and answers user queries strictly based on the extracted context.

## 🚀 Features
- **Facts-Only Guardrails**: Intercepts and blocks subjective queries ("Which fund is better?").
- **Strict Constraints**: Responses are limited to 3 sentences, include a specific footer with the last updated date, and cite the source URL.
- **Dynamic Metadata Parsing**: Extracts explicit Expense Ratios, Exit Loads, and Fund Managers via hidden JSON to avoid semantic search hallucination.

## 📦 Selected AMC and Schemes
**AMC:** ICICI Prudential
**Selected Schemes:**
1. ICICI Prudential Large Cap Fund
2. ICICI Prudential Midcap Fund
3. ICICI Prudential Indo Asia Equity Fund
4. ICICI Prudential Income Fund
5. ICICI Prudential Corporate Bond Fund

## 🏗 Architecture
- **Data Ingestion**: `scraper.py` parses BeautifulSoup text and hidden `__NEXT_DATA__` JSON payloads.
- **Embeddings**: `ingest.py` uses `BAAI/bge-large-en-v1.5` Local Embeddings via SentenceTransformers to chunk and ingest text.
- **Database**: `ChromaDB` stores the vector embeddings locally.
- **Backend API**: `FastAPI` serves the `/api/chat` endpoint and interfaces with Groq's `llama3-70b-8192` model for lightning-fast retrieval-augmented generation (RAG).
- **Frontend**: A modern `React` (Next.js) application built with TailwindCSS for the user interface.

## 🛠 Setup & Installation

### 1. Prerequisites
- Python 3.9+
- Node.js & npm

### 2. Backend Setup
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run the data pipeline (Scraping + Embeddings)
python scraper.py
python ingest.py

# Start the API server
python api.py
```
*The API will run on http://localhost:8000*

### 3. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The app will be accessible at http://localhost:5173*

## ⚠️ Known Limitations & Disclaimer
> **Disclaimer:** _“Facts-only. No investment advice.”_

This assistant is strictly designed for educational and informational purposes. It will flat-out refuse to answer any queries soliciting investment advice or subjective comparisons between mutual funds. Additionally, its knowledge base is confined solely to the 5 ICICI Prudential funds listed above. Queries regarding other AMCs or non-whitelisted funds will return a graceful failure.
