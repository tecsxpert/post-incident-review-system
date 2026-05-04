import requests
import time
import statistics

BASE_URL = "http://localhost:5000"

DESCRIBE_PAYLOAD = {
    "title": "Database Connection Timeout",
    "description": "PostgreSQL stopped accepting connections during peak hours",
    "severity": "HIGH",
    "affected_system": "Payment Service",
    "duration": "45 minutes"
}

RECOMMEND_PAYLOAD = {
    "summary": "PostgreSQL database stopped accepting connections during peak hours",
    "root_cause": "Connection pool exhaustion due to unclosed connections",
    "severity": "HIGH"
}

REPORT_PAYLOAD = {
    "title": "Database Connection Timeout",
    "summary": "PostgreSQL stopped accepting connections during peak hours",
    "root_cause": "Connection pool exhaustion due to unclosed connections",
    "severity": "HIGH",
    "affected_system": "Payment Service"
}


def test_endpoint(name: str, method: str, url: str, payload: dict, runs: int = 3):
    print(f"\n{'='*50}")
    print(f"Testing: {name}")
    print(f"{'='*50}")

    times = []

    for i in range(runs):
        start = time.time()
        try:
            if method == "POST":
                response = requests.post(url, json=payload, timeout=30)
            else:
                response = requests.get(url, timeout=30)

            elapsed = time.time() - start
            times.append(elapsed)

            try:
                body = response.json()
                from_cache = body.get("from_cache", False)
                is_fallback = body.get("is_fallback", False)
            except Exception:
                from_cache = False
                is_fallback = False

            status = "✅" if response.status_code == 200 else "❌"
            cache_label = " [CACHE]" if from_cache else ""
            fallback_label = " [FALLBACK]" if is_fallback else ""

            print(f"  Run {i+1}: {elapsed:.2f}s | "
                  f"Status {response.status_code} {status}"
                  f"{cache_label}{fallback_label}")

        except Exception as e:
            elapsed = time.time() - start
            times.append(elapsed)
            print(f"  Run {i+1}: ERROR — {e} ❌")

        time.sleep(0.5)

    if times:
        avg = statistics.mean(times)
        print(f"\n  Average : {avg:.2f}s")
        print(f"  Fastest : {min(times):.2f}s")
        print(f"  Slowest : {max(times):.2f}s")

        if avg <= 5.0:
            print(f"  Target  : ✅ PASS (under 5s)")
        else:
            print(f"  Target  : ❌ FAIL (over 5s)")

    return times


def run_all_tests():
    print("\n" + "="*50)
    print("Tool-38 AI Service — Performance Test")
    print("="*50)

    all_results = {}

    all_results["health"] = test_endpoint(
        "GET /health", "GET", f"{BASE_URL}/health", {}, runs=3
    )

    all_results["describe"] = test_endpoint(
        "POST /describe", "POST", f"{BASE_URL}/describe", DESCRIBE_PAYLOAD, runs=3
    )

    all_results["recommend"] = test_endpoint(
        "POST /recommend", "POST", f"{BASE_URL}/recommend", RECOMMEND_PAYLOAD, runs=3
    )

    all_results["generate-report"] = test_endpoint(
        "POST /generate-report", "POST", f"{BASE_URL}/generate-report", REPORT_PAYLOAD, runs=3
    )

    print("\n" + "="*50)
    print("FINAL SUMMARY")
    print("="*50)

    all_pass = True
    for endpoint, times in all_results.items():
        if times:
            avg = statistics.mean(times)
            status = "✅ PASS" if avg <= 5.0 else "❌ FAIL"
            if avg > 5.0:
                all_pass = False
            print(f"  {endpoint:<25} avg: {avg:.2f}s  {status}")

    print()
    if all_pass:
        print("🎉 All endpoints meet the 5s target!")
    else:
        print("⚠️  Some endpoints exceed 2s")


if __name__ == "__main__":
    run_all_tests()