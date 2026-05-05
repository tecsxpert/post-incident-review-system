# AI Summary Card — Tool-38 Post-Incident Review System
## AI Developer 2 — Poornima

---

## AI Service Overview
The AI service is built using Python Flask and powered 
by Groq's LLaMA-3.3-70b model. It automatically 
analyses incidents and generates professional descriptions, 
recommendations and reports.

---

## 3 AI Endpoints

### 1. POST /describe
- **What it does:** Generates a professional description of an incident
- **Input:** Incident text
- **Output:** AI generated description

### 2. POST /recommend
- **What it does:** Generates 3 action recommendations for an incident
- **Input:** Incident text
- **Output:** List of recommendations with priority

### 3. POST /generate-report
- **What it does:** Generates a full incident report
- **Input:** Incident text
- **Output:** Complete structured report

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Python 3.11 | AI service language |
| Flask 3.x | Web framework |
| Groq API | AI model provider |
| LLaMA-3.3-70b | AI model |
| flask-limiter | Rate limiting |
| Docker | Containerisation |
| pytest | Unit testing |

---

## Security Features
- Input sanitisation — strips HTML tags
- Prompt injection detection — blocks malicious inputs
- Rate limiting — 30 requests per minute
- Security headers — CSP, X-Content-Type-Options, X-Frame-Options
- OWASP ZAP scan — zero Critical or High findings

---

## GitHub Link
https://github.com/P00rnima-08/post-incident-review-system