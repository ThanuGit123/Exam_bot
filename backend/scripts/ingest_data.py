import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma

# Ensure we're running from the backend root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = os.path.join(BASE_DIR, "chroma_db")

def ingest_pdf(file_path: str, course: str, subject: str):
    """
    Ingests a PDF textbook into the local Chroma DB.
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return

    print(f"Loading {file_path}...")
    if file_path.endswith('.pdf'):
        loader = PyPDFLoader(file_path)
    elif file_path.endswith('.txt'):
        from langchain_community.document_loaders import TextLoader
        loader = TextLoader(file_path)
    else:
        print("Unsupported file format. Please provide a .pdf or .txt file.")
        return
        
    docs = loader.load()
    print(f"Loaded {len(docs)} pages.")

    print("Splitting text into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    chunks = text_splitter.split_documents(docs)
    print(f"Created {len(chunks)} chunks.")

    # Attach metadata for filtering
    for chunk in chunks:
        chunk.metadata["course"] = course
        chunk.metadata["subject"] = subject

    print("Embedding chunks and storing in Chroma DB...")
    from dotenv import load_dotenv
    load_dotenv()
    from langchain_mistralai import MistralAIEmbeddings
    embeddings = MistralAIEmbeddings(api_key=os.getenv("MISTRAL_API_KEY"))
    
    # Store in local Chroma database
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=DB_DIR
    )
    
    print(f"Successfully ingested data into Chroma DB at {DB_DIR}!")

if __name__ == "__main__":
    # Example usage:
    # 1. Place a PDF inside backend/data/
    # 2. Run: python scripts/ingest_data.py
    
    # Let's create a dummy text file first if no PDF exists just to test
    data_dir = os.path.join(BASE_DIR, "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    print("Running ingestion on test data...")
    test_file = os.path.join(data_dir, "test_physics.txt")
    ingest_pdf(test_file, "JEE", "Physics")
