from flask import Blueprint, request, jsonify
from services.groq_client import call_groq
from services.prompt_loader import load_prompt
from datetime import datetime
from services.cache import get_cached, set_cached
import json
import logging
import re

logger = logging.getLogger(__name__)

generate_report_bp = Blueprint("generate_report", __name__)

FALLBACK_RESPONSE = {
    "title": "Post-Incident Report — AI Unavailable",
    "summary": "AI report generation is temporarily unavailable. Please complete this report manually.",
    "overview": {
        "severity": "UNKNOWN",
        "affected_system": "UNKNOWN",
        "root_cause": "Manual review required.",
        "total_impact": "Manual review required."
    },
    "key_findings": [
        "AI service was unavailable at time of report generation.",
        "Manual investigation required.",
        "Please retry report generation when AI service is restored."
    ],
    "recommendations": [
        {
            "action_type": "immediate",
            "description": "Manually document the incident details and impact.",
            "priority": "high"
        },
        {
            "action_type": "short-term",
            "description": "Schedule a team post-mortem within 48 hours.",
            "priority": "medium"
        },
        {
            "action_type": "long-term",
            "description": "Update runbooks to prevent recurrence.",
            "priority": "low"
        }
    ],
    "conclusion": "This is a fallback report. Please regenerate when the AI service is available.",
    "is_fallback": True
}


def validate_report_input(data: dict) -> tuple[bool, str]:
    """Validate all required fields for /generate-report"""
    required_fields = ["title", "summary", "root_cause", "severity", "affected_system"]
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


def validate_report_structure(data: dict) -> bool:
    """Make sure the AI returned the correct report structure"""
    required_keys = ["title", "summary", "overview", "key_findings", "recommendations", "conclusion"]
    for key in required_keys:
        if key not in data:
            return False

    # Validate overview
    overview_keys = ["severity", "affected_system", "root_cause", "total_impact"]
    for key in overview_keys:
        if key not in data["overview"]:
            return False

    # Validate key_findings is a list with at least 1 item
    if not isinstance(data["key_findings"], list) or len(data["key_findings"]) == 0:
        return False

    # Validate recommendations
    if not isinstance(data["recommendations"], list) or len(data["recommendations"]) != 3:
        return False

    valid_action_types = {"immediate", "short-term", "long-term"}
    valid_priorities = {"high", "medium", "low"}

    for rec in data["recommendations"]:
        if "action_type" not in rec or "description" not in rec or "priority" not in rec:
            return False
        if rec["action_type"] not in valid_action_types:
            return False
        if rec["priority"] not in valid_priorities:
            return False

    return True


@generate_report_bp.route("/generate-report", methods=["POST"])
def generate_report():
    # 1. Get JSON body
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400

    # 2. Validate input
    is_valid, error_msg = validate_report_input(data)
    if not is_valid:
        return jsonify({"error": error_msg}), 400

    # 3. Sanitise input
    cleaned = {
        "title": sanitise_text(str(data["title"])),
        "summary": sanitise_text(str(data["summary"])),
        "root_cause": sanitise_text(str(data["root_cause"])),
        "severity": data["severity"].upper(),
        "affected_system": sanitise_text(str(data["affected_system"]))
    }

    # 3.5 Check cache first
    cached = get_cached("generate-report", cleaned)
    if cached:
        cached["from_cache"] = True
        return jsonify(cached), 200


    # 4. Load prompt template
    try:
        prompt = load_prompt("generate_report.txt", **cleaned)
    except Exception as e:
        logger.error(f"Prompt loading failed: {e}")
        return jsonify({"error": "Internal prompt error"}), 500

    # 5. Call Groq — use higher max_tokens for full report
   
    raw_result = call_groq(prompt, temperature=0.3, max_tokens=1500)

    # 6. Handle Groq failure
    if raw_result is None:
        logger.warning("Groq returned None — sending fallback report")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.utcnow().isoformat()
        return jsonify(fallback), 200

    # 7. Parse and validate JSON response
    try:
        # Clean the raw result — fix truncated JSON
        clean_result = raw_result.strip()
        # If closing brace is missing add it
        if not clean_result.endswith("}"):
            clean_result = clean_result + "}"
        parsed = json.loads(clean_result)

        if not validate_report_structure(parsed):
            logger.error("Groq report failed structure validation — using fallback")
            fallback = FALLBACK_RESPONSE.copy()
            fallback["generated_at"] = datetime.utcnow().isoformat()
            return jsonify(fallback), 200

        parsed["generated_at"] = datetime.utcnow().isoformat()
        parsed["is_fallback"] = False
        parsed["from_cache"] = False
        set_cached("generate-report", cleaned, parsed)
        return jsonify(parsed), 200

    except json.JSONDecodeError:
        logger.error(f"Groq returned invalid JSON: {raw_result}")
        fallback = FALLBACK_RESPONSE.copy()
        fallback["generated_at"] = datetime.utcnow().isoformat()
        return jsonify(fallback), 200