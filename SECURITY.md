# Security Policy – Post Incident Review System

## Overview
This application follows standard security practices to ensure safe handling of data, secure API access, and protection against common vulnerabilities.

---

## Authentication & Authorization
- JWT-based authentication is implemented.
- All protected endpoints require a valid token.
- Unauthorized access returns 401 Unauthorized.
- Role-based access can be extended if required.

---

## Input Validation
- All user inputs are validated on both frontend and backend.
- Prevents invalid data submission and malicious inputs.
- Backend enforces strict validation rules.

---

## File Upload Security
- Only TXT and PDF files are allowed.
- File size is restricted (e.g., max 5MB).
- Invalid file types or large files are rejected with proper error messages.

---

## SQL Injection Protection
- Uses Spring Data JPA (prepared statements internally).
- No raw SQL queries with direct user input.
- Prevents SQL injection attacks.

---

## API Security
- All APIs are protected with authentication (except login).
- Proper HTTP status codes used:
  - 401 → Unauthorized
  - 400 → Bad Request
  - 500 → Server Error

---

## Environment Variables
- Sensitive data is stored in .env file:
  - Database credentials
  - API keys (e.g., Groq API)
- .env is excluded using .gitignore.

---

## Container Security (Docker)
- Application runs in isolated containers.
- Database is not exposed publicly.
- Environment-based configuration is used.

---

## Error Handling
- No sensitive information is exposed in error responses.
- Logs are controlled and safe.

---

## Security Testing
The following checks were verified:
- Unauthorized API access returns 401
- Invalid inputs return 400
- File upload restrictions enforced
- SQL injection attempts are handled safely

---

## Known Limitations
- No advanced rate limiting implemented
- No multi-factor authentication (MFA)
- Basic role handling (can be extended)

---

## Conclusion
The system implements essential security measures and is safe for demonstration and further enhancement in production environments.