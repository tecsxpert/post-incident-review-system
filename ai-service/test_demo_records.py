import requests
import json
import time

BASE_URL = "http://localhost:5000"

# 30 realistic demo records
DEMO_RECORDS = [
    {"title": "Database Connection Timeout", "description": "PostgreSQL stopped accepting connections during peak hours", "severity": "HIGH", "affected_system": "Payment Service", "duration": "45 minutes"},
    {"title": "API Gateway 503 Errors", "description": "API gateway returned 503 for all requests due to memory exhaustion", "severity": "CRITICAL", "affected_system": "API Gateway", "duration": "20 minutes"},
    {"title": "File Upload Service Down", "description": "S3 bucket permissions were revoked causing all uploads to fail", "severity": "MEDIUM", "affected_system": "File Storage", "duration": "2 hours"},
    {"title": "Login Service Latency Spike", "description": "Authentication service response time went from 200ms to 8 seconds", "severity": "HIGH", "affected_system": "Auth Service", "duration": "30 minutes"},
    {"title": "Email Notification Failure", "description": "SMTP credentials expired causing all email notifications to fail silently", "severity": "LOW", "affected_system": "Notification Service", "duration": "6 hours"},
    {"title": "Server Disk Full", "description": "Main server disk filled up due to unrotated log files", "severity": "HIGH", "affected_system": "Web Server", "duration": "1 hour"},
    {"title": "SSL Certificate Expired", "description": "SSL certificate expired causing all HTTPS connections to fail", "severity": "CRITICAL", "affected_system": "Load Balancer", "duration": "3 hours"},
    {"title": "Redis Cache Down", "description": "Redis server crashed causing cache miss for all requests", "severity": "HIGH", "affected_system": "Cache Layer", "duration": "25 minutes"},
    {"title": "CPU Throttling", "description": "Service exceeded CPU quota causing increased response times", "severity": "MEDIUM", "affected_system": "Order Service", "duration": "1 hour"},
    {"title": "Network Timeout", "description": "Network connectivity issues caused timeouts between services", "severity": "HIGH", "affected_system": "Internal Network", "duration": "40 minutes"},
    {"title": "Memory Leak", "description": "Memory leak in payment processor caused OOM errors", "severity": "CRITICAL", "affected_system": "Payment Processor", "duration": "2 hours"},
    {"title": "Deployment Failure", "description": "New deployment caused service to crash on startup", "severity": "HIGH", "affected_system": "User Service", "duration": "35 minutes"},
    {"title": "Third Party API Down", "description": "External payment gateway API went down affecting all transactions", "severity": "CRITICAL", "affected_system": "Payment Gateway", "duration": "1.5 hours"},
    {"title": "Database Migration Failed", "description": "Database migration script failed leaving schema in inconsistent state", "severity": "HIGH", "affected_system": "Database", "duration": "50 minutes"},
    {"title": "Load Balancer Misconfigured", "description": "Load balancer misconfiguration caused traffic to route to single instance", "severity": "HIGH", "affected_system": "Load Balancer", "duration": "20 minutes"},
    {"title": "Kafka Consumer Lag", "description": "Kafka consumer fell behind causing message processing delays", "severity": "MEDIUM", "affected_system": "Message Queue", "duration": "2 hours"},
    {"title": "DNS Resolution Failure", "description": "DNS server became unresponsive causing service discovery failures", "severity": "CRITICAL", "affected_system": "DNS Service", "duration": "45 minutes"},
    {"title": "Firewall Rule Blocking Traffic", "description": "New firewall rule accidentally blocked internal service communication", "severity": "HIGH", "affected_system": "Firewall", "duration": "30 minutes"},
    {"title": "Search Service Down", "description": "Elasticsearch cluster became unresponsive due to disk pressure", "severity": "HIGH", "affected_system": "Search Service", "duration": "1 hour"},
    {"title": "Webhook Delivery Failure", "description": "Webhook delivery service failed due to connection pool exhaustion", "severity": "MEDIUM", "affected_system": "Webhook Service", "duration": "3 hours"},
    {"title": "Docker Container Crash Loop", "description": "Docker containers entering crash loop due to misconfigured health checks", "severity": "HIGH", "affected_system": "Container Platform", "duration": "25 minutes"},
    {"title": "Rate Limiter Misconfigured", "description": "Rate limiter set too low causing legitimate requests to be blocked", "severity": "MEDIUM", "affected_system": "API Gateway", "duration": "2 hours"},
    {"title": "Backup Job Failed", "description": "Nightly backup job failed silently for 7 days due to storage permission error", "severity": "HIGH", "affected_system": "Backup Service", "duration": "7 days"},
    {"title": "CDN Cache Poisoning", "description": "CDN serving stale content after deployment due to cache not being cleared", "severity": "MEDIUM", "affected_system": "CDN", "duration": "4 hours"},
    {"title": "Queue Processing Stuck", "description": "Job queue stopped processing due to deadlock in worker threads", "severity": "HIGH", "affected_system": "Job Queue", "duration": "1.5 hours"},
    {"title": "Config File Corrupted", "description": "Configuration file became corrupted during deployment causing service startup failure", "severity": "HIGH", "affected_system": "Config Service", "duration": "40 minutes"},
    {"title": "Image Upload Timeout", "description": "Image upload service timing out due to missing file size validation", "severity": "MEDIUM", "affected_system": "Media Service", "duration": "3 hours"},
    {"title": "OAuth Token Expiry", "description": "OAuth tokens expired causing all API integrations to fail", "severity": "HIGH", "affected_system": "Auth Service", "duration": "1 hour"},
    {"title": "Monitoring Alert Storm", "description": "Misconfigured monitoring caused thousands of false alerts overwhelming on-call team", "severity": "MEDIUM", "affected_system": "Monitoring Service", "duration": "2 hours"},
    {"title": "Service Mesh Failure", "description": "Istio service mesh configuration error caused all inter-service communication to fail", "severity": "CRITICAL", "affected_system": "Service Mesh", "duration": "55 minutes"}
]


def test_record(record: dict, index: int) -> bool:
    """Test a single record against /describe endpoint"""
    try:
        response = requests.post(
            f"{BASE_URL}/describe",
            json=record,
            timeout=30
        )

        if response.status_code == 200:
            body = response.json()
            is_fallback = body.get("is_fallback", True)
            status = "✅" if not is_fallback else "⚠️ FALLBACK"
            print(f"  Record {index+1:02d}: {record['title'][:40]:<40} {status}")
            return not is_fallback
        else:
            print(f"  Record {index+1:02d}: {record['title'][:40]:<40} ❌ {response.status_code}")
            return False

    except Exception as e:
        print(f"  Record {index+1:02d}: {record['title'][:40]:<40} ❌ ERROR: {e}")
        return False


def run_all_demo_records():
    print("\n" + "="*60)
    print("Tool-38 — Running All 30 Demo Records")
    print("="*60)

    passed = 0
    failed = 0

    for i, record in enumerate(DEMO_RECORDS):
        success = test_record(record, i)
        if success:
            passed += 1
        else:
            failed += 1
        time.sleep(0.5)

    print("\n" + "="*60)
    print(f"RESULTS: {passed} passed | {failed} failed")
    print("="*60)

    if failed == 0:
        print("🎉 All 30 demo records are demo-ready!")
    else:
        print(f"⚠️  {failed} records need attention")


if __name__ == "__main__":
    run_all_demo_records()