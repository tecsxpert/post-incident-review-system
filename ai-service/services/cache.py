import redis
import hashlib
import json
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

CACHE_TTL = 900  # 15 minutes in seconds

# Connect to Redis
try:
    redis_client = redis.Redis.from_url(
        os.getenv("REDIS_URL", "redis://localhost:6379"),
        decode_responses=True,
        socket_connect_timeout=3
    )
    redis_client.ping()
    logger.info("Redis connected successfully")
    REDIS_AVAILABLE = True
except Exception as e:
    logger.warning(f"Redis not available — caching disabled: {e}")
    redis_client = None
    REDIS_AVAILABLE = False


def make_cache_key(endpoint: str, payload: dict) -> str:
    """
    Generate SHA256 cache key from endpoint name + payload.
    Same input always produces the same key.
    """
    raw = f"{endpoint}:{json.dumps(payload, sort_keys=True)}"
    return hashlib.sha256(raw.encode()).hexdigest()


def get_cached(endpoint: str, payload: dict):
    """
    Try to get a cached response.
    Returns parsed dict if found, None if not found or Redis down.
    """
    if not REDIS_AVAILABLE or redis_client is None:
        return None

    try:
        key = make_cache_key(endpoint, payload)
        cached = redis_client.get(key)
        if cached:
            logger.info(f"Cache HIT for endpoint: {endpoint}")
            return json.loads(cached)
        logger.info(f"Cache MISS for endpoint: {endpoint}")
        return None
    except Exception as e:
        logger.error(f"Redis GET failed: {e}")
        return None


def set_cached(endpoint: str, payload: dict, response: dict):
    """
    Store response in Redis with 15 min TTL.
    Silently fails if Redis is down.
    """
    if not REDIS_AVAILABLE or redis_client is None:
        return

    try:
        key = make_cache_key(endpoint, payload)
        redis_client.setex(key, CACHE_TTL, json.dumps(response))
        logger.info(f"Cache SET for endpoint: {endpoint} TTL: {CACHE_TTL}s")
    except Exception as e:
        logger.error(f"Redis SET failed: {e}")


def get_redis_status() -> dict:
    """
    Return Redis connection status for health endpoint.
    """
    if not REDIS_AVAILABLE or redis_client is None:
        return {"connected": False, "reason": "Redis unavailable at startup"}

    try:
        redis_client.ping()
        info = redis_client.info("memory")
        return {
            "connected": True,
            "used_memory": info.get("used_memory_human", "unknown"),
            "ttl_seconds": CACHE_TTL
        }
    except Exception as e:
        return {"connected": False, "reason": str(e)}