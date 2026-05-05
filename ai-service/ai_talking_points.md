# AI Talking Points Card — Demo Day
## AI Developer 2 — Poornima

---

## What is Groq?
Groq is an AI company that provides free access to 
powerful AI models. We use their LLaMA-3.3-70b model 
which is one of the most capable open source AI models 
available. It's completely free with no credit card needed.

---

## What is Flask?
Flask is a lightweight Python web framework. We use it 
to build our AI microservice that runs on port 5000. 
It receives incident descriptions and sends them to 
Groq for AI analysis.

---

## How do Prompts Work?
When a user submits an incident, we create a prompt 
like "Describe this incident briefly: server went down". 
We send this to Groq and get back a professional AI 
generated response instantly.

---

## What is Input Sanitisation?
Before sending any input to Groq, we clean it by:
- Removing HTML tags like script tags
- Detecting prompt injection patterns
- Blocking suspicious inputs with 400 error
- This protects both our app and the AI model

---

## What is Rate Limiting?
We limit each IP address to 30 requests per minute 
using flask-limiter. This prevents someone from 
flooding our AI service with requests and exhausting 
our Groq API quota.

---

## Security Talking Points
- OWASP ZAP scan found ZERO Critical or High vulnerabilities
- All Medium and Low findings were fixed
- Input sanitisation blocks prompt injection attacks
- API key is stored securely in .env file
- Security headers protect against XSS and clickjacking

---

## If Panel Asks "Why Groq?"
- It's completely free — no credit card needed
- Provides access to LLaMA-3.3-70b — a very powerful model
- Easy to integrate with Python
- Fast response times
- Perfect for internship projects