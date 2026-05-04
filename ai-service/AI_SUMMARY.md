# Tool-38 AI Service — Summary Card

## What It Does
AI microservice that analyses post-incidents using
Groq LLaMA-3.3-70b and returns structured JSON.

## 3 Endpoints

| Endpoint | What It Does |
|----------|-------------|
| POST /describe | Generates incident summary, root cause, impact |
| POST /recommend | Returns 3 prioritised recommendations |
| POST /generate-report | Creates full post-incident report |

## Tech Stack
- Python 3.9
- Flask 3.0.3
- Groq API — LLaMA-3.3-70b
- Redis — 15 min response cache
- flask-limiter — 30 req/min rate limit

## Security
- Input sanitisation — HTML and injection stripped
- 7 security headers on every response
- Rate limiting per IP
- API key in .env only — never committed
- OWASP ZAP scan — zero findings

## Performance
- All endpoints under 5s average
- Redis caching for repeated requests
- Fallback responses — never returns 500

## GitHub
https://github.com/Lavanyarameshb/post-incident-review-system/tree/LavanyaR/ai-service