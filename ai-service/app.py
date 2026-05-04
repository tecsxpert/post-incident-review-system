import re
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from services.groq_client import GroqClient

app = Flask(__name__)

# setting up rate limiter - max 30 requests per minute
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["30 per minute"]
)

# initialising groq client
groq_client = GroqClient()

# list of prompt injection patterns to detect
INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "disregard previous",
    "forget previous instructions",
    "you are now",
    "act as",
    "jailbreak",
]

def strip_html(text: str) -> str:
    # removing html tags from input
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def detect_prompt_injection(text: str) -> bool:
    # checking if input contains prompt injection patterns
    text_lower = text.lower()
    for pattern in INJECTION_PATTERNS:
        if pattern in text_lower:
            return True
    return False

@app.before_request
def sanitize_request():
    if request.is_json:
        data = request.get_json(silent=True)
        if data:
            for key in data:
                if isinstance(data[key], str):
                    # strip html
                    data[key] = strip_html(data[key])
                    # check for injection
                    if detect_prompt_injection(data[key]):
                        return jsonify({"error": "Invalid input detected"}), 400

# adding security headers to all responses
@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self'"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Server'] = 'Unknown'
    return response

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/describe', methods=['POST'])
@limiter.limit("30 per minute")
def describe():
    data = request.get_json(silent=True)

    if not data or 'text' not in data:
        return jsonify({"error": "No input provided"}), 400

    if data['text'].strip() == "":
        return jsonify({"error": "Input cannot be empty"}), 400

    user_input = data['text']

    # calling groq to describe the incident
    result = groq_client.call(f"Describe this incident briefly: {user_input}")

    if result and result.get("success"):
        return jsonify({"message": result["data"]}), 200
    else:
        return jsonify({"error": "AI service unavailable"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)