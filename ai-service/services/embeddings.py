import logging

logger = logging.getLogger(__name__)

model = None

def load_model():
    global model
    try:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading sentence-transformers model...")
        model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("Sentence-transformers model loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load sentence-transformers: {e}")
        model = None


def get_embedding(text: str):
    if model is None:
        return None
    try:
        return model.encode(text).tolist()
    except Exception as e:
        logger.error(f"Embedding failed: {e}")
        return None