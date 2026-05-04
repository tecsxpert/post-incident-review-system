from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from services.prompt_loader import load_prompt
from datetime import datetime
from services.cache import get_cached, set_cached
import json
import logging
import re

logger = logging.getLogger(__name__)

recommend_bp = Blueprint("recommend", __name__)

FALLBACK_RESPONSE = [
    {
        "action_type": "immediate",
        "description": "Manually review the incident and identify immediate containment steps.",
        "priority": "high",
        "is_fallback": True
    },
    {
        "action_type": "short-term",
        "description": "Schedule a team post-mortem within 48 hours to identify root cause.",
        "priority": "medium",
        "is_fallback": True
    },
    {
        "action_type": "long-term",
        "description": "Update runbooks and monitoring alerts to prevent recurrence.",
        "priority": "low",
        "is_fallback": True
    }
]

def validate_recommend_input(data: dict) -> tuple[bool, str]:
    """Validate input fields for /recommend"""
    required_fields = ["summary", "root_cause", "severity"]
    for field in required_fields:
        if field not in data or not str(data[field]).strip():
            return False, f"Missing required field: {field}"

    valid_severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    if data.get("severity", "").upper() not in valid_severities:
        return False, f"Severity must be one of: {valid_severities}"

    return True, ""

def sanitise_text(value: str) -> str:
    """Strip HTML and prompt injection attempts"""
    value = re.sub(r"<[^>]*>", "", value)
    value = re.sub(
        r"(ignore previous|forget all|you are now|act as)",
        "", value, flags=re.IGNORECASE
    )
    return value.strip()

def validate_recommendations(data: list) -> bool:
    """Check the AI returned exactly 3 valid recommendations"""
    if not isinstance(data, list) or len(data) != 3:
        return False

    valid_action_types = {"immediate", "short-term", "long-term"}
    valid_priorities = {"high", "medium", "low"}

    for item in data:
        if not isinstance(item, dict):
            return False
        if "action_type" not in item or "description" not in item or "priority" not in item:
            return False
        if item["action_type"] not in valid_action_types:
            return False
        if item["priority"] not in valid_priorities:
            return False

    return True


@recommend_bp.route("/recommend", methods=["POST"])
def recommend():
    # 1. Get JSON body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # 2. Validate input
    is_valid, error_msg = validate_recommend_input(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    # 3. Sanitise input
    cleaned = {
        "summary": sanitise_text(str(data["summary"])),
        "root_cause": sanitise_text(str(data["root_cause"])),
        "severity": data["severity"].upper()
    }

    # 3.5 Check cache first
    cached = get_cached("recommend", cleaned)
    if cached:
        cached["from_cache"] = True
        return jsonify(cached), 200


    # 4. Load prompt template
    try:
        prompt = load_prompt("recommend.txt", **cleaned)
    except Exception as e:
        logger.error(f"Prompt loading failed: {e}")
        return jsonify({"error": "Internal prompt error"}), 500

    # 5. Call Groq
    raw_result = call_groq(prompt, temperature=0.3, max_tokens=400)

    # 6. Handle Groq failure
    if raw_result is None:
        logger.warning("Groq returned None — sending fallback recommendations")
        return jsonify({
            "recommendations": FALLBACK_RESPONSE,
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": True
        }), 200

    # 7. Parse and validate JSON response
    try:
        parsed = json.loads(raw_result)

        if not validate_recommendations(parsed):
            logger.error("Groq response failed validation — using fallback")
            return jsonify({
                "recommendations": FALLBACK_RESPONSE,
                "generated_at": datetime.utcnow().isoformat(),
                "is_fallback": True
            }), 200

        return jsonify({
            "recommendations": parsed,
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": False
        }), 200

    except json.JSONDecodeError:
        logger.error(f"Groq returned invalid JSON: {raw_result}")
        result = {
            "recommendations": parsed,
            "generated_at": datetime.utcnow().isoformat(),
            "is_fallback": False,
            "from_cache": False
        }
        set_cached("recommend", cleaned, result)
        return jsonify(result), 200