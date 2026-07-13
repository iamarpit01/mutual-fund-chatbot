import os
from datetime import datetime
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

# --- 1. Query Guardrails (Classifier) ---
ADVISORY_KEYWORDS = [
    "should i", "which fund is better", "recommend", "best fund", 
    "good investment", "compare", "advise", "predict", "safe to invest"
]

def is_advisory_query(query: str) -> bool:
    """Returns True if the query is asking for advice/opinions."""
    query_lower = query.lower()
    for kw in ADVISORY_KEYWORDS:
        if kw in query_lower:
            return True
    return False

REFUSAL_TEMPLATE = (
    "I can only provide factual information about mutual funds and cannot offer investment advice, "
    "opinions, or recommendations. For guidance on investing, please consult a certified financial "
    "advisor or refer to official educational resources like AMFI (https://www.amfiindia.com/investor-corner)."
)

# --- 2. Semantic Search Engine ---
def get_vectorstore():
    # Using the agreed upon BAAI/bge-large-en-v1.5 model
    embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-large-en-v1.5",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    return Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

def get_retriever():
    vectorstore = get_vectorstore()
    # Retrieve top 5 most relevant chunks to handle boilerplate noise
    return vectorstore.as_retriever(search_kwargs={"k": 5})

# --- 3. Prompt Engineering ---
SYSTEM_PROMPT = """You are a factual mutual fund assistant. Extract the answer ONLY from the provided context.
The context may contain website navigation menus and irrelevant boilerplate—ignore them.
If the exact fact is not present in the context, reply exactly with: 'I cannot find this information in the provided documents.'
Limit your response to a maximum of 3 sentences.

Context:
{context}"""

# --- 4. LLM Generation & Formatting ---
def get_llm():
    if not os.getenv("GROQ_API_KEY"):
        raise ValueError("GROQ_API_KEY environment variable is missing. Please set it in your .env file.")
    
    try:
        from langchain_groq import ChatGroq
        return ChatGroq(model="llama-3.3-70b-versatile", temperature=0)
    except ImportError:
        raise ImportError("Please run 'pip install langchain-groq' to use Groq as the LLM.")

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

def extract_source_link(docs):
    """Reconstructs the original source URL from the chunk metadata."""
    if docs and len(docs) > 0:
        filename = docs[0].metadata.get('source', '')
        if filename:
            fund_slug = filename.replace('.txt', '')
            return f"https://groww.in/mutual-funds/{fund_slug}"
    return "Source not found."

class RAGPipeline:
    def __init__(self):
        self.retriever = get_retriever()
        self.llm = get_llm()
        
    def process_query(self, user_question: str, history_dicts: list = None) -> str:
        # Format history
        chat_history = []
        if history_dicts:
            for msg in history_dicts:
                if msg.get("role") == "user":
                    chat_history.append(HumanMessage(content=msg.get("content", "")))
                elif msg.get("role") in ["bot", "assistant"]:
                    chat_history.append(AIMessage(content=msg.get("content", "")))
                    
        # Step 1: Execute Guardrails
        if is_advisory_query(user_question):
            return REFUSAL_TEMPLATE
            
        # Step 2: Contextualize Query (Rewrite for semantic search)
        if chat_history:
            rewrite_prompt = ChatPromptTemplate.from_messages([
                ("system", "Given a chat history and the latest user question, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."),
                MessagesPlaceholder("chat_history"),
                ("human", "{input}")
            ])
            rewrite_chain = rewrite_prompt | self.llm | StrOutputParser()
            search_query = rewrite_chain.invoke({
                "chat_history": chat_history,
                "input": user_question
            })
        else:
            search_query = user_question
            
        # Step 3: Retrieval
        docs = self.retriever.invoke(search_query)
        context = format_docs(docs)
        
        # Step 4: Generation
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ])
        qa_chain = qa_prompt | self.llm | StrOutputParser()
        raw_response = qa_chain.invoke({
            "context": context,
            "chat_history": chat_history,
            "input": user_question
        })
        
        # Enforce Hallucination Prevention constraints
        if "I cannot find this information" in raw_response:
            return raw_response
            
        # Step 5: Formatting (Append source link and footer)
        source_link = extract_source_link(docs)
        
        current_date = datetime.now().strftime("%d %b %Y")
        footer = f"\n\nSource: {source_link}\n_Last updated from sources: {current_date}_"
        
        return raw_response + footer

if __name__ == "__main__":
    pipeline = RAGPipeline()
    print("Testing Pipeline...")
    
    # Test Guardrail
    q1 = "Which fund is better?"
    print(f"\n[Query]: {q1}")
    print(f"[Response]:\n{pipeline.process_query(q1)}")
    
    # Test Fact Retrieval & Formatting
    q2 = "What is the minimum SIP amount for the ICICI Prudential Large Cap Fund?"
    print(f"\n[Query]: {q2}")
    try:
        print(f"[Response]:\n{pipeline.process_query(q2)}")
    except Exception as e:
        print(f"Error during LLM generation: {e}")
        print("Note: If you don't have OPENAI_API_KEY set and Ollama isn't running locally, this will fail.")
