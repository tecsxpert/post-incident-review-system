import json
import os
import logging

logger = logging.getLogger(__name__)

KNOWLEDGE_BASE = []


def init_chromadb():
    """
    Load domain knowledge from JSON file.
    Simple replacement for ChromaDB.
    """
    global KNOWLEDGE_BASE
    try:
        kb_path = os.path.join(
            os.path.dirname(__file__), 
            "..", 
            "knowledge_base.json"
        )
        with open(kb_path, "r") as f:
            data = json.load(f)
            KNOWLEDGE_BASE = data.get("documents", [])
        logger.info(f"Knowledge base loaded with {len(KNOWLEDGE_BASE)} documents")
    except Exception as e:
        logger.warning(f"Knowledge base load failed: {e}")
        KNOWLEDGE_BASE = []


def query_knowledge(query_text: str, n_results: int = 2):
    """
    Simple keyword search through knowledge base.
    """
    if not KNOWLEDGE_BASE:
        return []

    query_lower = query_text.lower()
    matches = []

    for doc in KNOWLEDGE_BASE:
        if any(word in doc["text"].lower() 
               for word in query_lower.split()):
            matches.append(doc["text"])

    return matches[:n_results]