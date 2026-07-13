# Edge Cases & Corner Scenarios: Mutual Fund FAQ Assistant

This document outlines potential edge cases and corner scenarios identified from the `architecture.md` and `implementation-plan.md`, along with proposed mitigation strategies to ensure the robustness and compliance of the FAQ Assistant.

---

## 1. Data Ingestion & Scheduling Failures

| Scenario | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **DOM Structure Changes** | The target website (Groww) updates its HTML layout, causing the web scraper to fail to extract data (e.g., Expense ratio, Exit load). | Implement robust error handling in the parser. Set up alerting if extracted text length drops below a threshold. Use CSS selectors that are less prone to change, or fallback to raw text parsing. |
| **Network/Rate Limit Blocking** | The daily crawler is blocked by Groww due to rate limiting or anti-bot mechanisms. | Implement exponential backoff, request delays, and user-agent rotation. Ensure the daily run occurs during off-peak hours. |
| **Silent Scheduler Failure** | The daily cron job fails silently, leading to stale data being served to users over several days. | Implement a health-check monitor or "last-ingested" timestamp check on the backend. If the timestamp is older than 48 hours, trigger an alert to the admin. |
| **Missing Data Fields** | A specific mutual fund page is missing an expected data point (e.g., no ELSS lock-in period mentioned because it's not an ELSS fund). | The chunking and parsing logic must gracefully handle `null` values. The LLM must be instructed to explicitly state, "This information is not available for this specific fund," rather than hallucinating. |

## 2. RAG & Retrieval Anomalies

| Scenario | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Fund Ambiguity** | A user asks "What is the expense ratio?" without specifying which of the 5 ICICI Prudential funds they are referring to. | The system prompt should instruct the LLM to either ask for clarification (if supported) or list the expense ratio for all 5 funds within the 3-sentence limit. Alternatively, prompt the user to specify the fund. |
| **Cross-Fund Hallucination** | The Vector DB retrieves chunks from two different funds, causing the LLM to mix up an Exit Load from Fund A with the Expense Ratio of Fund B. | Inject strict metadata (Fund Name) into every text chunk during ingestion. Instruct the LLM to cross-reference the Fund Name in the query with the metadata of the retrieved chunk. |
| **Synonym or Jargon Queries** | The user asks about the "TER" instead of "Expense Ratio," causing semantic search to score low relevance. | Rely on the Embedding model's semantic understanding. If insufficient, implement a lightweight query pre-processor to expand financial acronyms (TER -> Total Expense Ratio) before vectorization. |

## 3. LLM Generation & Guardrail Bypassing

| Scenario | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Disguised Advisory Queries** | The user attempts to bypass the guardrail by phrasing advice as a fact (e.g., "Is it a historical fact that this fund is the best investment right now?"). | The Intent Classifier/Guardrail must be robust enough to detect sentiment, subjective keywords ("best", "good", "recommend"), and future predictions, triggering the refusal template. |
| **Prompt Injection / Jailbreaks** | The user inputs a malicious prompt instructing the LLM to ignore previous instructions and act as a financial advisor. | Use separate LLM calls: a strict, sandboxed classification step *before* retrieval. Additionally, enforce rigid output formatting post-generation to catch anomalies. |
| **PII Injection in Query** | The user includes personal information in their question (e.g., "My PAN is ABCDE1234F, what is the exit load?"). | While the system is stateless and doesn't store PII, a regex-based pre-filter should redact PAN, Aadhaar, and phone numbers from the query *before* sending it to the OpenAI API or Vector DB. |
| **Constraint Violation (Length)** | The LLM ignores the system prompt and generates a response longer than 3 sentences. | Implement a post-processing script on the backend that truncates the response at the 3rd sentence period, or throws an internal error and requests a regeneration. |

## 4. Frontend & User Experience

| Scenario | Description | Mitigation Strategy |
| :--- | :--- | :--- |
| **Empty or Gibberish Input** | The user submits a blank query, or a query with only special characters (e.g., "???"). | The frontend should disable the submit button for empty inputs. The backend should return a polite prompt asking the user to rephrase if the text contains no recognizable words. |
| **Citation Formatting Failure** | The LLM fails to include the source link, or formats the URL incorrectly. | The backend `ResponseFormatter` must programmatically append the source link (derived from the retrieved chunk's metadata) and the footer (`Last updated from sources: <date>`) independently of the LLM's text output. |
| **API Abuse (DDoS)** | A malicious actor spams the `/api/chat` endpoint, exhausting OpenAI API credits or bringing down the backend. | Implement IP-based rate limiting on the FastAPI gateway (e.g., max 10 requests per minute per IP). |
