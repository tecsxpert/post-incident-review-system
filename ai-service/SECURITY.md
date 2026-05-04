# SECURITY.md — Tool-38 AI Service

## Threat Model

| # | Threat | Risk | Mitigation |
|---|--------|------|------------|
| 1 | Prompt Injection | HIGH | Regex sanitisation strips injection keywords |
| 2 | HTML Injection | HIGH | HTML tags stripped from all inputs |
| 3 | Empty Input DoS | MEDIUM | All fields validated, 400 returned |
| 4 | Rate Limit Abuse | MEDIUM | flask-limiter 30 req/min per IP |
| 5 | API Key Exposure | HIGH | Key stored in .env, never committed |

## Tests Conducted

| Test | Input | Expected | Result |
|------|-------|----------|--------|
| Empty input | {} | 400 error | ✅ Pass |
| SQL injection | DROP TABLE in title | Sanitised | ✅ Pass |
| Prompt injection | Ignore previous instructions | Stripped | ✅ Pass |
| HTML injection | script tags | Stripped | ✅ Pass |
| Invalid severity | EXTREME | 400 error | ✅ Pass |

## Findings Fixed
- All inputs sanitised before being passed to Groq
- flask-limiter active on all endpoints
- .env in .gitignore — no secrets committed

## Residual Risks
- Groq API key rotation not automated
- No IP allowlist for Java backend calls

## Sign-off
- AI Developer 1: Lavanya
- AI Developer 2: ________________

## Additional Tests — /generate-report

| Test | Input | Expected | Result |
|------|-------|----------|--------|
| Empty input | {} | 400 error | ✅ Pass |
| Missing field | No root_cause | 400 error | ✅ Pass |
| Invalid severity | EXTREME | 400 error | ✅ Pass |
| Prompt injection | Ignore previous in summary | Stripped | ✅ Pass |
| Valid input | Full incident details | Full JSON report | ✅ Pass |
| Truncated JSON | Groq cuts off response | Auto fixed | ✅ Pass |

## OWASP ZAP Scan Results — Day 8

### Security Headers Applied
- X-Content-Type-Options: nosniff ✅
- X-Frame-Options: DENY ✅
- Strict-Transport-Security: max-age=31536000 ✅
- X-XSS-Protection: 1; mode=block ✅
- Referrer-Policy: strict-origin-when-cross-origin ✅
- Content-Security-Policy: default-src 'none' ✅
- Server header removed ✅

### Error Handling
- 400 Bad Request — returns JSON ✅
- 404 Not Found — returns JSON ✅
- 405 Method Not Allowed — returns JSON ✅
- 429 Rate Limit Exceeded — returns JSON ✅
- 500 Internal Server Error — returns JSON ✅
- Stack traces never exposed in responses ✅

### Findings Fixed
- Security headers added to all responses
- Error handlers return consistent JSON
- Debug mode controlled by FLASK_ENV variable
- CORS restricted to allowed origins

## Performance Results — Day 9

| Endpoint | Avg Response Time | Target | Status |
|----------|------------------|--------|--------|
| GET /health | ~0.01s | 5.0s | ✅ Pass |
| POST /describe | ~3.4s | 5.0s | ✅ Pass |
| POST /recommend | ~2.7s | 5.0s | ✅ Pass |
| POST /generate-report | ~4.9s | 5.0s | ✅ Pass |

Note: Response times depend on Groq free tier availability.
Redis caching will significantly reduce times for repeated requests.

## Day 11 — ZAP Active Scan Results

### Scan Details
- Tool: OWASP ZAP 2.15.0
- Target: http://localhost:5000
- Type: Active Scan

### Results
| Severity | Count | Status |
|----------|-------|--------|
| Critical | 0 | ✅ None found |
| High | 0 | ✅ None found |
| Medium | 0 | ✅ None found |
| Low | 0 | ✅ None found |

### Sentence Transformers
- Model: all-MiniLM-L6-v2
- Pre-loaded at startup: ✅
- Cold start delay eliminated: ✅

## Day 12 — Demo Records Test

### Knowledge Base
- Replaced ChromaDB with simple JSON knowledge base ✅
- Seeded with 10 domain knowledge documents ✅
- Categories: database, memory, api, auth, email, 
  infrastructure, cloud, network, performance, security

### Demo Records Test
- Total records tested: 30
- Passed: 30 ✅
- Failed: 0 ✅
- All 30 outputs demo-ready ✅

## Day 16 — Final Verification

### Performance
| Endpoint | Avg Time | Target | Status |
|----------|----------|--------|--------|
| GET /health | ~2.0s | 5.0s | ✅ Pass |
| POST /describe | ~3.2s | 5.0s | ✅ Pass |
| POST /recommend | ~3.1s | 5.0s | ✅ Pass |
| POST /generate-report | ~3.8s | 5.0s | ✅ Pass |

### Final Checks
- All 30 demo records passing ✅
- Fallback working on invalid input ✅
- Security headers on all responses ✅
- No secrets committed to GitHub ✅
- README complete ✅
- Dockerfile ready ✅