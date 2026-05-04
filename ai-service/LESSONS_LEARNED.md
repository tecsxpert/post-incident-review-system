# Lessons Learned — Tool-38 AI Service

## What Went Well
- All 3 AI endpoints working live on Demo Day
- Groq API responded within 3-4 seconds
- Fallback system worked correctly
- Security headers passing ZAP scan
- 30 demo records all passing

## Challenges Faced
- ChromaDB not compatible with Python 3.9
  Solution: Used simple JSON knowledge base
- Groq SDK version conflict with Python 3.9
  Solution: Downgraded to compatible version
- API key accidentally committed to GitHub
  Solution: Rotated key and force pushed clean history

## Features for Future Sprints
- ChromaDB integration when Python 3.11 available
- Automated certificate renewal monitoring
- WebSocket for real time AI streaming responses
- Multi-language incident report generation

## Tech Stack Summary
- Flask 3.0.3 + Groq LLaMA-3.3-70b
- Redis caching + flask-limiter
- OWASP ZAP — zero findings
- 30 demo records — all passing