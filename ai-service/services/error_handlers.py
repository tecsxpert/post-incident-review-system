from flask import Flask, jsonify


def apply_error_handlers(app: Flask):
    """
    Register global error handlers.
    """

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            "error": "Bad request",
            "message": str(e)
        }), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "error": "Endpoint not found",
            "message": "Check the API reference in README.md"
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            "error": "Method not allowed",
            "message": str(e)
        }), 405

    @app.errorhandler(429)
    def rate_limit_exceeded(e):
        return jsonify({
            "error": "Rate limit exceeded",
            "message": "Maximum 30 requests per minute allowed"
        }), 429

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500