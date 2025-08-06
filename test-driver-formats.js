#!/usr/bin/env node

const formats = [
  { message: "hello world" },
  { text: "hello world" },
  { query: "hello world" },
  { content: "hello world" },
  { input: "hello world" },
  { prompt: "hello world" },
  { text: "hello world", type: "conversational" },
  { message: "hello world", analysis_type: "conversation" },
  "hello world"  // string directo
];

async function testFormat(format, index) {
  try {
    const response = await fetch('http://3.85.5.222:8001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(format),
      signal: AbortSignal.timeout(5000)
    });
    
    const status = response.status;
    let result = null;
    
    try {
      result = await response.text();
    } catch (e) {
      result = 'No response body';
    }
    
    console.log(`\n${index + 1}. Format: ${JSON.stringify(format)}`);
    console.log(`   Status: ${status}`);
    if (status !== 400) {
      console.log(`   Result: ${result.substring(0, 200)}${result.length > 200 ? '...' : ''}`);
    }
    
    return { format, status, success: status < 400 };
  } catch (error) {
    console.log(`\n${index + 1}. Format: ${JSON.stringify(format)}`);
    console.log(`   Error: ${error.message}`);
    return { format, error: error.message, success: false };
  }
}

async function main() {
  console.log('🧪 Testing different formats for Driver AI /api/analyze endpoint...\n');
  
  const results = [];
  
  for (let i = 0; i < formats.length; i++) {
    const result = await testFormat(formats[i], i);
    results.push(result);
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n📊 Summary:');
  const successful = results.filter(r => r.success);
  console.log(`✅ Successful formats: ${successful.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n🎯 Working formats:');
    successful.forEach((r, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(r.format)} (Status: ${r.status})`);
    });
  }
}

main().catch(console.error);
