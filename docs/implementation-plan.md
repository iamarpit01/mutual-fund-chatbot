# Phase-Wise Implementation Plan: Mutual Fund FAQ Assistant

This document outlines the step-by-step implementation strategy for the Mutual Fund FAQ Assistant, based on the requirements defined in the `ProblemStatement.md` and the system design in `architecture.md`.

---

## Phase 1: Foundation & Data Ingestion Pipeline
**Goal:** Set up the project structure, extract data from the curated sources, and populate the Vector Database.

**Tasks:**
1. **Repository Setup:**
   - Initialize the Git repository.
   - Set up the Python environment (virtualenv/poetry) and install core dependencies (FastAPI, LangChain/LlamaIndex, Vector DB client, web scraping libraries).
2. **Web Scraper / Crawler:**
   - Implement a script to fetch the HTML content from the 5 specific ICICI Prudential fund URLs on Groww.
   - Extract relevant text sections (Expense ratio, Exit load, Minimum SIP) and strip unnecessary HTML/boilerplate.
   - Extract structured data (e.g. Fund Management Details) from the hidden `__NEXT_DATA__` JSON payload to guarantee semantic keyword matching.
3. **Chunking & Embedding:**
   - Use `RecursiveCharacterTextSplitter` with chunk size (~500-800) and overlap (~100-150) to keep key-value pairs intact.
   - Inject the **Fund Name** (derived from the filename or text) into the chunk metadata and prepend it to the chunk content to avoid cross-fund hallucinations.
   - Integrate an open-source Embedding Model (e.g., `BAAI/bge-large-en-v1.5`) to convert chunks into high-quality vector representations locally.
4. **Vector Database Integration:**
   - Initialize a local Vector Database (e.g., ChromaDB).
   - Store the embeddings along with metadata (source URL, extraction date).
5. **Daily Scheduler Integration:**
   - Implement a lightweight scheduling mechanism (e.g., APScheduler or a system Cron job) to automatically trigger the scraping and embedding pipeline once every 24 hours to ensure data freshness.

---

## Phase 2: RAG Pipeline & Backend API
**Goal:** Build the core logic to handle user queries, retrieve context, enforce constraints, and generate responses.

**Tasks:**
1. **Query Guardrails (Classifier):**
   - Implement logic to intercept non-factual or advisory queries (e.g., "Which fund is better?").
   - Define static, polite refusal templates with educational links for rejected queries.
2. **Semantic Search Engine:**
   - Implement the retrieval step: convert incoming user queries into embeddings and fetch the top-k most relevant chunks from the Vector Database.
3. **Prompt Engineering:**
   - Design a strict system prompt instructing the LLM to:
     - Answer *only* using the provided context.
     - Confess ignorance if the answer is not in the context (Hallucination Prevention).
     - Limit responses to a maximum of 3 sentences.
4. **LLM Generation & Formatting:**
   - Integrate the foundation model using Groq API (e.g., `llama3-8b-8192` or `mixtral-8x7b-32768`) for high-speed inference.
   - Implement a post-processing formatter to append the mandatory citation link and the footer: `_“Last updated from sources: <date>”_`.
5. **FastAPI Endpoints:**
   - Create a `/api/chat` endpoint that accepts a user query and returns the formatted response or the refusal template.
   - Ensure the API is stateless and logs no Personally Identifiable Information (PII).

---

## Phase 3: User Interface Development
**Goal:** Build the minimal, user-friendly frontend to interact with the backend API.

**Tasks:**
1. **Frontend Setup:**
   - Initialize a lightweight frontend project (Next.js, React, or Vanilla HTML/JS/CSS).
2. **UI Layout & Components:**
   - Build a clean chat interface.
   - Display a static Welcome Message upon initial load.
   - Create interactive buttons for the 3 Example Questions.
   - Add a prominent, visible disclaimer: `_“Facts-only. No investment advice.”_`
3. **API Integration:**
   - Connect the chat interface to the FastAPI backend (`/api/chat`).
   - Handle loading states, error handling, and display the formatted responses (including the footer and citation links).

---

## Phase 4: Testing, Refinement, & Documentation
**Goal:** Ensure the system meets all compliance requirements, handles edge cases gracefully, and is ready for handover.

**Tasks:**
1. **Guardrail Testing:**
   - Test the system with a suite of advisory and subjective queries to ensure the refusal mechanism works 100% of the time.
2. **Accuracy & Constraint Testing:**
   - Verify that responses are strictly limited to 3 sentences.
   - Check that every response includes exactly one citation link and the date footer.
3. **Documentation (README):**
   - Draft the final `README.md` containing:
     - Setup and installation instructions.
     - List of the selected AMC and 5 schemes.
     - Architecture overview (RAG approach).
     - Known limitations and the Disclaimer Snippet.
4. **Final Deployment Prep:**
   - Prepare Dockerfiles or deployment scripts for the backend and frontend.
   - Finalize the configuration for the daily ingestion scheduler in the production environment.
