import os
import glob
import json
from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_core.documents import Document

# Load environment variables (e.g. OPENAI_API_KEY)
load_dotenv()

def get_embeddings_model():
    print("Using all-MiniLM-L6-v2 Local Embeddings...")
    from langchain_huggingface import HuggingFaceEmbeddings
    # Using a much smaller, memory-efficient model (all-MiniLM-L6-v2) to prevent OOM on Railway's 500MB tier
    return HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

FUND_NAME_MAPPING = {
    "icici-prudential-large-cap-fund-direct-growth.txt": "ICICI Prudential Large Cap Fund",
    "icici-prudential-midcap-fund-direct-growth.txt": "ICICI Prudential Midcap Fund",
    "icici-prudential-indo-asia-equity-fund-direct-growth.txt": "ICICI Prudential Smallcap Fund (ICICI Prudential Indo Asia Equity Fund)",
    "icici-prudential-corporate-bond-fund-direct-growth.txt": "ICICI Prudential Corporate Bond Fund",
    "icici-prudential-i-come-fund-direct-growth.txt": "ICICI Prudential Long Term Bond Fund (ICICI Prudential I-Come Fund)"
}

def format_fund_name(filename):
    return FUND_NAME_MAPPING.get(filename, filename.replace(".txt", "").replace("-direct-growth", "").replace("-", " ").title())

import re

def extract_structured_facts(content: str, fund_name: str) -> str:
    """
    Extracts key facts from the raw scraped text and returns a
    structured summary block to prepend to the document.
    This ensures critical fields like NAV are always in a
    self-contained, easily-retrievable chunk.
    """
    facts = [f"Fund Name: {fund_name}"]

    # NAV — look for the 'About' paragraph which has the full sentence
    nav_match = re.search(r'Latest NAV as of ([\d\w\s]+) is (₹[\d,\.]+)', content)
    if nav_match:
        facts.append(f"Current NAV: {nav_match.group(2)} (as of {nav_match.group(1).strip()})")

    # AUM
    aum_match = re.search(r'Fund size \(AUM\)\s*\n(₹[\d,\.]+ Cr)', content)
    if aum_match:
        facts.append(f"Fund Size (AUM): {aum_match.group(1)}")

    # Expense Ratio
    exp_match = re.search(r'Expense ratio\s*\n([\d\.]+%)', content)
    if exp_match:
        facts.append(f"Expense Ratio: {exp_match.group(1)}")

    # Exit Load
    exit_match = re.search(r'Exit load\s*\n(Exit load of [^\n]+)', content)
    if exit_match:
        facts.append(f"Exit Load: {exit_match.group(1)}")

    # Fund Manager (from the last line of the file which lists them cleanly)
    manager_match = re.search(r'Fund Managers for this scheme: (.+)', content)
    if manager_match:
        facts.append(f"Fund Managers: {manager_match.group(1).strip()}")

    # Min SIP
    sip_match = re.search(r'Min\. for SIP\s*\n(₹[\d,]+)', content)
    if sip_match:
        facts.append(f"Minimum SIP Amount: {sip_match.group(1)}")

    return "\n".join(facts)


def ingest_data():
    print("Initializing embedding model...")
    embeddings = get_embeddings_model()
    
    # Initialize Chroma VectorDB
    persist_directory = "./chroma_db"
    vectorstore = Chroma(embedding_function=embeddings, persist_directory=persist_directory)
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=150,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    
    data_files = glob.glob("data/*.txt")
    if not data_files:
        print("No data files found in 'data/' directory. Please run scraper.py first.")
        return
        
    all_documents = []
    
    print("Reading and chunking files...")
    for file_path in data_files:
        filename = os.path.basename(file_path)
        fund_name = format_fund_name(filename)
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # --- Prepend a structured facts block ---
        # This guarantees key metrics (NAV, AUM, expense ratio etc.) are
        # always in a self-contained chunk at the top, regardless of how
        # the rest of the document is split.
        structured_block = extract_structured_facts(content, fund_name)
        enriched_content = f"{structured_block}\n\n---\n\n{content}"
            
        # Split enriched text into chunks
        chunks = text_splitter.split_text(enriched_content)
        
        for chunk in chunks:
            enhanced_chunk = f"Fund: {fund_name}\n{chunk}"
            doc = Document(
                page_content=enhanced_chunk,
                metadata={
                    "fund_name": fund_name,
                    "source": filename
                }
            )
            all_documents.append(doc)
            
    print(f"Generated {len(all_documents)} chunks from {len(data_files)} files.")
    
    print("Ingesting chunks into Vector Database. This may take a moment...")
    vectorstore.add_documents(all_documents)
    print(f"Successfully ingested! Database saved in {persist_directory}")

if __name__ == "__main__":
    ingest_data()
