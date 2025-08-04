#!/bin/bash

echo "=== DIAGNOSTIC REPORT FOR ASTROFLORA BACKEND ==="
echo "Date: $(date)"
echo ""

echo "1. Testing API Gateway base URL..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev" || echo "ERROR: Cannot connect to API Gateway"
echo ""

echo "2. Testing driver-ai endpoint with GET..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze" || echo "ERROR: Cannot connect to driver-ai endpoint"
echo ""

echo "3. Testing driver-ai endpoint with POST..."
curl -X POST -H "Content-Type: application/json" -d '{"query": "test"}' -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze" || echo "ERROR: Cannot POST to driver-ai endpoint"
echo ""

echo "4. Testing original backend IP..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" "http://3.85.5.222:8001/health" --connect-timeout 5 || echo "ERROR: Original backend not accessible"
echo ""

echo "=== END DIAGNOSTIC REPORT ==="
