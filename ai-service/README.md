# Tool-38 AI Service

The AI microservice for the Post-Incident Review System.
Built with Flask 3.x and powered by Groq (LLaMA-3.3-70b).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup and Run](#setup-and-run)
- [Run with Docker](#run-with-docker)
- [API Reference](#api-reference)
- [Caching](#caching)
- [Security](#security)
- [Running Tests](#running-tests)
- [Performance Targets](#performance-targets)
- [Folder Structure](#folder-structure)

---

## Overview

This service receives incident data from the Java Spring Boot
backend and uses the Groq API (LLaMA-3.3-70b) to:

- Generate a structured description of the incident
- Recommend 3 actionable steps to fix and prevent recurrence
- Produce a full professional post-incident report

All responses are cached in Redis for 15 minutes using SHA256
keys. If Groq is unavailable, all endpoints return a fallback
response with is_fallback: true — never a 500 error.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11 | Language |
| Flask | 3.0.3 | Web framework |
| Groq SDK | 0.9.0 | AI API client |
| Redis | 7 | Response cache |
| flask-limiter | 3.7.0 | Rate limiting |
| flask-cors | 4.0.1 | CORS headers |
| pytest | 8.2.2 | Unit testing |

---

## Prerequisites

- Python 3.9 or higher installed
- Redis 7 running on port 6379
- Groq API key from console.groq.com (free, no credit card)
- Docker and Docker Compose (for containerised run)

---

## Environment Variables

Create a `.env` file in the `ai-service/` folder.
Never commit this file — it is in `.gitignore`.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | Yes | none | Your Groq API key |
| `FLASK_ENV` | No | production | Set to development locally |
| `REDIS_URL` | No | redis://localhost:6379 | Redis connection URL |
| `ALLOWED_ORIGINS` | No | http://localhost:80 | CORS origins |

Copy the example file to get started:

```bash
cp .env.example .env
```

Then open `.env` and fill in your `GROQ_API_KEY`.

---

## Setup and Run

**Step 1 — Go to ai-service folder:**
```bash
cd ai-service
```

**Step 2 — Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate
venv\Scripts\activate    # Windows
```

**Step 3 — Install dependencies:**
```bash
pip install -r requirements.txt
```

**Step 4 — Create your .env file:**
```bash
cp .env.example .env
# Open .env and add your GROQ_API_KEY
```

**Step 5 — Start Redis:**
```bash
docker run -d -p 6379:6379 redis:7
```

**Step 6 — Run the service:**
```bash
python app.py
```

**Step 7 — Verify it is running:**
```bash
curl http://localhost:5000/health
```

You should see `"status": "ok"` in the response.

---

## Run with Docker

From the root project folder:

```bash
docker-compose up --build
```

The AI service will be available at `http://localhost:5000`.

---

## API Reference

All endpoints:
- Accept `Content-Type: application/json`
- Return `application/json`
- Are rate limited to 30 requests per minute per IP
- Return `is_fallback: true` if Groq is unavailable
- Return `from_cache: true` if response came from Redis

---

### GET /health

Returns current health and status of the AI service.

**Example Request:**
```bash
curl http://localhost:5000/health
```

**Response — 200 OK:**
```json
{
  "status": "ok",
  "service": "Tool-38 AI Service",
  "port": 5000,
  "uptime": "2h 15m 30s",
  "model": "llama-3.3-70b-versatile",
  "groq_configured": true,
  "ai_performance": {
    "avg_response_time_seconds": 1.35,
    "target_seconds": 5.0,
    "status": "healthy"
  },
  "redis": {
    "connected": true,
    "used_memory": "1.50M",
    "ttl_seconds": 900
  },
  "endpoints": [
    "POST /describe",
    "POST /recommend",
    "POST /generate-report",
    "GET /health"
  ],
  "checked_at": "2026-04-25T08:30:00.000000"
}
```

---

### POST /describe

Generates a structured AI description of an incident.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Short incident title |
| `description` | string | Yes | Full incident description |
| `severity` | string | Yes | LOW, MEDIUM, HIGH, CRITICAL |
| `affected_system` | string | Yes | Name of affected system |
| `duration` | string | Yes | How long incident lasted |

**Example Request:**
```json
{
  "title": "Database Connection Timeout",
  "description": "PostgreSQL stopped accepting connections",
  "severity": "HIGH",
  "affected_system": "Payment Service",
  "duration": "45 minutes"
}
```

**Response — 200 OK:**
```json
{
  "summary": "The PostgreSQL database experienced a connection timeout...",
  "root_cause": "Connection pool exhaustion...",
  "impact": "Payment processing was fully unavailable...",
  "timeline": "Issue detected at peak hours...",
  "generated_at": "2026-04-25T08:30:00.000000",
  "is_fallback": false,
  "from_cache": false
}
```

**Response — 400 Bad Request:**
```json
{
  "error": "Missing required field: severity"
}
```

**Fallback Response — 200 OK:**
```json
{
  "summary": "AI service is temporarily unavailable.",
  "root_cause": "Unable to determine at this time.",
  "impact": "Unknown — manual review required.",
  "timeline": "Not available.",
  "is_fallback": true,
  "generated_at": "2026-04-25T08:30:00.000000"
}
```

---

### POST /recommend

Returns exactly 3 prioritised recommendations.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `summary` | string | Yes | Brief summary of incident |
| `root_cause` | string | Yes | Root cause of incident |
| `severity` | string | Yes | LOW, MEDIUM, HIGH, CRITICAL |

**Example Request:**
```json
{
  "summary": "PostgreSQL stopped accepting connections",
  "root_cause": "Connection pool exhaustion",
  "severity": "HIGH"
}
```

**Response — 200 OK:**
```json
{
  "recommendations": [
    {
      "action_type": "immediate",
      "description": "Restart payment service to release connections",
      "priority": "high"
    },
    {
      "action_type": "short-term",
      "description": "Configure connection pool size limits",
      "priority": "medium"
    },
    {
      "action_type": "long-term",
      "description": "Implement connection pool monitoring",
      "priority": "low"
    }
  ],
  "generated_at": "2026-04-25T08:30:00.000000",
  "is_fallback": false,
  "from_cache": false
}
```

**Response — 400 Bad Request:**
```json
{
  "error": "Missing required field: root_cause"
}
```

---

### POST /generate-report

Generates a complete professional post-incident report.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Incident title |
| `summary` | string | Yes | Brief summary |
| `root_cause` | string | Yes | Root cause |
| `severity` | string | Yes | LOW, MEDIUM, HIGH, CRITICAL |
| `affected_system` | string | Yes | Affected system name |

**Example Request:**
```json
{
  "title": "Database Connection Timeout",
  "summary": "PostgreSQL stopped accepting connections",
  "root_cause": "Connection pool exhaustion",
  "severity": "HIGH",
  "affected_system": "Payment Service"
}
```

**Response — 200 OK:**
```json
{
  "title": "Post-Incident Report: Database Connection Timeout",
  "summary": "The PostgreSQL database experienced severe connection pool exhaustion...",
  "overview": {
    "severity": "HIGH",
    "affected_system": "Payment Service",
    "root_cause": "Unclosed connections accumulated over time...",
    "total_impact": "Payment processing fully unavailable for 45 minutes..."
  },
  "key_findings": [
    "Connection pool reached maximum capacity at peak traffic",
    "No alerting configured for connection pool usage",
    "Transactions failed silently without error handling"
  ],
  "recommendations": [
    {
      "action_type": "immediate",
      "description": "Restart payment service to release connections",
      "priority": "high"
    },
    {
      "action_type": "short-term",
      "description": "Set connection pool max size and timeout",
      "priority": "medium"
    },
    {
      "action_type": "long-term",
      "description": "Implement connection monitoring and alerts",
      "priority": "low"
    }
  ],
  "conclusion": "This incident exposed a gap in connection management...",
  "generated_at": "2026-04-25T08:30:00.000000",
  "is_fallback": false,
  "from_cache": false
}
```

---

## Caching

All AI responses are cached in Redis using SHA256 keys.

| Setting | Value |
|---------|-------|
| TTL | 15 minutes (900 seconds) |
| Key format | SHA256 of endpoint name + sorted payload |
| Cache hit indicator | `from_cache: true` in response |
| Redis down behaviour | Cache disabled silently, Groq called normally |

---

## Security

| Measure | Detail |
|---------|--------|
| Rate limiting | 30 requests per minute per IP |
| Input sanitisation | HTML and prompt injection stripped |
| Security headers | 7 headers on every response |
| CORS | Restricted to allowed origins |
| Error handling | Stack traces never exposed |
| Secrets | API key in .env only |

Full details in `SECURITY.md`.

---

## Running Tests

Run performance test:
```bash
python test_performance.py
```

Run prompt test with 5 real inputs:
```bash
python test_prompts.py
```

---

## Performance Targets

| Endpoint | Target | Status |
|----------|--------|--------|
| GET /health | under 5.0s | ✅ Pass |
| POST /describe | under 5.0s | ✅ Pass |
| POST /recommend | under 5.0s | ✅ Pass |
| POST /generate-report | under 5.0s | ✅ Pass |

---

## Folder Structure

```
ai-service/
├── routes/
│   ├── __init__.py
│   ├── health.py
│   ├── describe.py
│   ├── recommend.py
│   └── generate_report.py
├── services/
│   ├── __init__.py
│   ├── groq_client.py
│   ├── prompt_loader.py
│   ├── sanitiser.py
│   ├── cache.py
│   ├── security_headers.py
│   └── error_handlers.py
├── prompts/
│   ├── describe.txt
│   ├── recommend.txt
│   └── generate_report.txt
├── app.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── SECURITY.md
├── README.md
├── test_prompts.py
└── test_performance.py
```