import os
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
import PyPDF2
import socket
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def create_and_store_embeddings(pdf, eval=''):
    model = SentenceTransformer('all-mpnet-base-v2')
    chroma_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="resumes", embedding_function=chroma_ef)
    print(pdf)
    resume_text = extract_text_from_pdf(pdf)
    resume_text += eval
    collection.add(
                documents=[resume_text],
                metadatas=[{"filename": os.path.basename(pdf)}],
                ids=[os.path.basename(pdf)]
            )
    print("Success")
    # print("PROCESS 1 COMPLETE")

def search_resumes(query, top_k=5):
    model = SentenceTransformer('all-mpnet-base-v2')
    chroma_ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-mpnet-base-v2")
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="resumes", embedding_function=chroma_ef)

    results = collection.query(
        query_texts=[query],
        n_results=top_k
    )
    return results