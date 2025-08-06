#!/usr/bin/env node

console.log('🔍 Testing Driver AI connectivity...');

// Test 1: Health check
fetch('http://3.85.5.222:8001/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Health check successful:', data);
    
    // Test 2: Try analyze request with CORRECT format (sequence)
    console.log('\n🧪 Testing analyze endpoint with correct format...');
    return fetch('http://3.85.5.222:8001/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence: "ATCGATCGATCG" }),
      signal: AbortSignal.timeout(10000)
    });
  })
  .then(response => {
    console.log(`📊 Analyze status: ${response.status}`);
    if (response.ok) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    console.log('📄 Full Driver AI response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Test 3: Test through proxy with sequence
    console.log('\n🔀 Testing through proxy with sequence...');
    return fetch('http://localhost:3000/api/driver/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence: "ATCGATCGATCG" }),
      signal: AbortSignal.timeout(10000)
    });
  })
  .then(response => {
    console.log(`🔀 Proxy analyze status: ${response.status}`);
    if (response.ok) {
      return response.json();
    } else {
      return response.text();
    }
  })
  .then(data => {
    console.log('🔀 Proxy response:');
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
