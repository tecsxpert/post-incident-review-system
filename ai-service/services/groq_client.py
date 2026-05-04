import os
import time
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response_times = []
MAX_TRACKED = 20


def get_avg_response_time() -> float:
    if not response_times:
        return 0.0
    return round(sum(response_times) / len(response_times), 2)


def call_groq(
    prompt: str,
    temperature: float = 0.3,
    max_tokens: int = 1000
):
    retries = 3

    for attempt in range(retries):
        start = time.time()
        try:
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a helpful assistant. "
                            "Always respond with valid JSON only. "
                            "Never include explanation or markdown."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )

            elapsed = time.time() - start
            response_times.append(elapsed)
            if len(response_times) > MAX_TRACKED:
                response_times.pop(0)

            logger.info(f"Groq responded in {elapsed:.2f}s")
            return response.choices[0].message.content

        except Exception as e:
            elapsed = time.time() - start
            logger.error(f"Groq failed attempt {attempt + 1} after {elapsed:.2f}s: {e}")
            if attempt < retries - 1:
                wait = 2 ** attempt
                logger.info(f"Retrying in {wait}s...")
                time.sleep(wait)
            else:
                return None