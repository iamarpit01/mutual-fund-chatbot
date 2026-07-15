from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import RAGPipeline
import uvicorn
import logging

# Configure basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("API")

# Initialize FastAPI App
app = FastAPI(
    title="Mutual Fund FAQ Assistant API",
    description="Backend API for querying mutual fund factual data using RAG.",
    version="1.0"
)

# Enable CORS for the upcoming frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class ChatRequest(BaseModel):
    query: str
    history: list[dict] = []

class ChatResponse(BaseModel):
    response: str

# Global pipeline instance
pipeline = None
pipeline_error = None

@app.on_event("startup")
async def startup_event():
    global pipeline, pipeline_error
    try:
        logger.info("Initializing RAG Pipeline on startup...")
        pipeline = RAGPipeline()
        logger.info("RAG Pipeline initialized successfully.")
    except Exception as e:
        import traceback
        logger.error(f"Failed to initialize RAG Pipeline: {traceback.format_exc()}")
        # We don't crash the server here so the /health endpoint can still report the failure
        pipeline = None
        pipeline_error = str(e)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Accepts a user query, runs it through the Guardrails and RAG pipeline, 
    and returns the 3-sentence factual response.
    """
    if not pipeline:
        raise HTTPException(
            status_code=500, 
            detail=f"RAG Pipeline is not initialized. Error: {pipeline_error}"
        )
        
    try:
        logger.info(f"Received query: {request.query} with history length: {len(request.history)}")
        logger.info(f"History contents: {request.history}")
        # The pipeline handles Guardrails, Retrieval, Prompting, and Formatting
        answer = pipeline.process_query(request.query, request.history)
        logger.info("Query processed successfully.")
        return ChatResponse(response=answer)
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred while generating the response.")

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {
        "status": "healthy",
        "pipeline_ready": pipeline is not None
    }

if __name__ == "__main__":
    logger.info("Starting FastAPI server on port 8000...")
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
