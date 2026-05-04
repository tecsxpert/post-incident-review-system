from flask import Flask


def apply_security_headers(app: Flask):
    """
    Apply security headers to every response.
    """

    @app.after_request
    def add_security_headers(response):
        # Prevent browsers from sniffing content type
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Force HTTPS in production
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains"
        )

        # Block XSS in older browsers
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control what info is sent in referrer
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict browser features
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=()"
        )

        # Content Security Policy
        response.headers["Content-Security-Policy"] = "default-src 'none'"

        # Remove server info header
        response.headers.pop("Server", None)

        return response