# AI Demo Script — Tool-38

## My Role on Demo Day
I demonstrate all 3 AI endpoints live and explain what the AI is doing.

---

## Opening Line (5 seconds)
"Our AI service runs on port 5000 and uses 
Groq's LLaMA-3.3-70b model to analyse incidents."

---

## Step 1 — Show Health Endpoint (20 seconds)
Open Postman → GET /health

Say:
"This is our health endpoint. It shows the service 
is running, the AI model being used, uptime, 
and Redis cache status."

---

## Step 2 — Describe Endpoint (40 seconds)
Open Postman → POST /describe

Say:
"When a new incident is created, our system 
automatically calls this endpoint. I will type 
in a real incident now."

Type the incident details and click Send.

Say:
"The AI has analysed the incident and returned 
a structured JSON with summary, root cause, 
impact and timeline — all in under 5 seconds."

---

## Step 3 — Recommend Endpoint (30 seconds)
Open Postman → POST /recommend

Say:
"Based on the description, we now get 3 
prioritised recommendations — immediate, 
short-term and long-term actions to fix 
and prevent this incident."

---

## Step 4 — Generate Report Endpoint (30 seconds)
Open Postman → POST /generate-report

Say:
"Finally we generate a complete post-incident 
report with overview, key findings, 
recommendations and conclusion — ready to 
share with stakeholders."

---

## Tech Explanation (60 seconds)
"Our AI service is built with:
- Flask 3.x as the web framework
- Groq API with LLaMA-3.3-70b as the AI model
- Redis for caching responses — same input 
  returns instantly from cache
- Rate limiting at 30 requests per minute
- All inputs sanitised to prevent prompt injection
- Fallback responses if AI is unavailable"

---

## Questions Panel Might Ask

Q: What AI model are you using?
A: LLaMA-3.3-70b hosted on Groq's infrastructure.
   Free tier, no credit card needed.

Q: What if the AI is unavailable?
A: Every endpoint has a fallback response with
   is_fallback: true. We never return a 500 error.

Q: How do you prevent prompt injection?
A: We strip HTML tags and detect injection keywords
   like ignore previous instructions before sending
   to the AI model.

Q: How fast is the AI?
A: Average 3-4 seconds per request. Redis caching
   makes repeated requests instant.

Q: Is the API key secure?
A: Stored in .env file which is in .gitignore.
   Never committed to GitHub.


## Day 18 — Final Demo Preparation

### Demo Checklist
- Flask running without errors ✅
- All 3 endpoints return valid JSON ✅
- Postman collection Tool-38 Demo saved ✅
- Backup screenshots ready ✅
- Demo script memorised ✅
- GitHub link ready ✅
- Can answer all Q&A questions ✅

### Postman Collection
Saved as Tool-38 Demo with 4 requests:
- GET /health
- POST /describe
- POST /recommend
- POST /generate-report

### Demo Order
1. Show /health — service is running
2. POST /describe — AI analyses incident
3. POST /recommend — AI gives 3 recommendations
4. POST /generate-report — AI writes full report
5. Show security — injection attempt stripped

## Day 19 — Final Demo Practice

### Full Demo Practiced with Timer ✅
- Opening statement practiced ✅
- Health endpoint demo practiced ✅
- Describe endpoint demo practiced ✅
- Recommend endpoint demo practiced ✅
- Generate Report demo practiced ✅
- Tech explanation practiced ✅

### Q&A Practiced ✅
- What AI model? — LLaMA-3.3-70b on Groq ✅
- What if AI fails? — Fallback with is_fallback: true ✅
- How fast? — 3-4 seconds average ✅
- How secure? — Sanitisation, rate limiting, ZAP scan ✅
- API key safe? — In .env only, never on GitHub ✅

### Final Test Results
- 30 demo records: 30 passed, 0 failed ✅
- All endpoints under 5s target ✅
- GitHub files verified ✅
- Postman collection ready ✅
- Demo Day checklist complete ✅