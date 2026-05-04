from flask import Blueprint, jsonify
from datetime import datetime
import time
import os

health_bp = Blueprint("health", __name__)

START_TIME = time.time()


def get_uptime() -> str:
    seconds = int(time.time() - START_TIME)
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f"{hours}h {minutes}m {secs}s"


@health_bp.route("/health", methods=["GET"])
def health():
    groq_key = os.getenv("GROQ_API_KEY", "")
    groq_configured = len(groq_key) > 10

    return jsonify({
        "status": "ok",
        "service": "Tool-38 AI Service",
        "port": 5000,
        "uptime": get_uptime(),
        "model": "llama-3.3-70b-versatile",
        "groq_configured": groq_configured,
        "redis": {
            "connected": False,
            "reason": "Redis not configured"
        },
        "endpoints": [
            "POST /describe",
            "POST /recommend",
            "POST /generate-report",
            "GET /health"
        ],
        "checked_at": datetime.utcnow().isoformat()
    }), 200