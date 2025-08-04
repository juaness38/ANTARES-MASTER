// Test file to diagnose API connectivity issues
async function testAPIConnectivity() {
  const baseURL = 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev';
  const results = {};

  console.log('🔍 Starting API Connectivity Diagnosis...\n');

  // Test 1: Basic API Gateway connectivity
  try {
    console.log('1️⃣ Testing API Gateway base...');
    const response = await fetch(baseURL);
    results.base = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    };
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    results.base = { error: error.message };
    console.log(`   Error: ${error.message}`);
  }

  // Test 2: Driver AI endpoint
  try {
    console.log('\n2️⃣ Testing Driver AI endpoint...');
    const response = await fetch(`${baseURL}/driver-ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AstroFlora-Test/1.0.0'
      },
      body: JSON.stringify({
        query: 'test connection',
        context: { source: 'diagnostic' }
      })
    });
    results.driverAI = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    };
    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    } else {
      const text = await response.text();
      console.log(`   Error Response: ${text}`);
    }
  } catch (error) {
    results.driverAI = { error: error.message };
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: API v1 endpoint
  try {
    console.log('\n3️⃣ Testing API v1 endpoint...');
    const response = await fetch(`${baseURL}/api/v1/health`);
    results.apiV1 = {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    };
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    results.apiV1 = { error: error.message };
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n📊 Diagnosis Summary:');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  const fetch = require('node-fetch');
  testAPIConnectivity();
}

// For browser environment
if (typeof window !== 'undefined') {
  window.testAPIConnectivity = testAPIConnectivity;
}
