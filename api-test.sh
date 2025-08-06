#!/bin/bash

echo "🚀 API GATEWAY IMPLEMENTATION TEST"
echo "=================================="
echo "Date: $(date)"
echo ""

# Test 1: Base API Gateway
echo "📡 Test 1: API Gateway Base"
echo "URL: https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTP_STATUS/d')

echo "Status Code: $http_code"
echo "Response: $response_body"
echo ""

# Test 2: Health endpoint
echo "🩺 Test 2: Health Endpoint" 
echo "URL: https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/health"
response=$(curl -s -w "\nHTTP_STATUS:%{http_code}" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/health")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTP_STATUS/d')

echo "Status Code: $http_code"
echo "Response: $response_body"
echo ""

# Test 3: Driver AI endpoint
echo "🤖 Test 3: Driver AI Endpoint"
echo "URL: https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze"
response=$(curl -s -X POST -H "Content-Type: application/json" -d '{"query": "test"}' -w "\nHTTP_STATUS:%{http_code}" "https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze")
http_code=$(echo "$response" | grep "HTTP_STATUS" | cut -d: -f2)
response_body=$(echo "$response" | sed '/HTTP_STATUS/d')

echo "Status Code: $http_code"
echo "Response: $response_body"
echo ""

# Analyze results
echo "📊 ANALYSIS:"
echo "============"
if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS: API Gateway is working!"
elif [ "$http_code" = "502" ] || [ "$http_code" = "504" ]; then
    echo "⚠️  GATEWAY CONFIGURED: But backend not responding"
    echo "   - API Gateway is properly configured"
    echo "   - Backend server needs to be started"
elif [ "$http_code" = "403" ]; then
    echo "❌ STILL NEEDS CONFIGURATION: Missing authentication or methods"
    echo "   - Need to configure methods in API Gateway"
    echo "   - Check integration settings"
else
    echo "❓ UNKNOWN STATUS: $http_code"
fi

echo ""
echo "🔧 Next Steps:"
if [ "$http_code" = "502" ] || [ "$http_code" = "504" ]; then
    echo "1. Start your backend server on 3.85.5.222:8001"
    echo "2. Verify Docker containers are running"
    echo "3. Test again"
elif [ "$http_code" = "403" ]; then
    echo "1. Go back to API Gateway console"
    echo "2. Create methods (GET, POST, ANY) on resources"
    echo "3. Configure HTTP integration"
    echo "4. Deploy API to 'dev' stage"
fi
