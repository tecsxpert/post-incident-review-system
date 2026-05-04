from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from services.sanitiser import sanitise_input
from services.prompt_loader import load_prompt
from datetime import datetime
from services.cache import get_cached, set_cached
import json
import logging

logger = logging.getLogger(__name__)

describe_bp = Blueprint("describe", __name__)

FALLBACK_RESPONSE = {
    "summary": "AI service is temporarily unavailable. Please try again shortly.",
    "root_cause": "Unable to determine at this time.",
    "impact": "Unknown — manual review required.",
    "timeline": "Not available.",
    "is_fallback": True
}

@describe_bp.route("/describe", methods=["POST"])
def describe():
    # 1. Get JSON body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # 2. Sanitise and validate input
    is_valid, error_msg, cleaned_data = sanitise_input(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400
    
    # 3. Check cache first
    cached = get_cached("describe", cleaned_data)
    if cached:
        cached["from_cache"] = True
        return jsonify(cached), 200

    # 4. Load and fill prompt template
    try:
        prompt = load_prompt(
            "describe.txt",
            generated_at=datetime.utcnow().isoformat(),
            **cleaned_data
        )
    except Exception as e:
        logger.error(f"Prompt loading failed: {e}")
        return jsonify({"error": "Internal prompt error"}), 500

    # 5. Call Groq
    raw_result = call_groq(prompt, temperature=0.3, max_tokens=500)

    # 6. Handle Groq failure — return fallback
    if raw_result is None:
        logger.warning("Groq returned None — sending fallback response")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.utcnow().isoformat()
        return jsonify(fallback), 200

    # 7. Parse JSON response
    try:
        parsed = json.loads(raw_result)
        parsed["generated_at"] = datetime.utcnow().isoformat()
        parsed["is_fallback"] = False
        parsed["from_cache"] = False
        set_cached("describe", cleaned_data, parsed)
        return jsonify(parsed), 200
    except json.JSONDecodeError:
        logger.error(f"Groq returned invalid JSON: {raw_result}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.utcnow().isoformat()
        return jsonify(fallback), 200