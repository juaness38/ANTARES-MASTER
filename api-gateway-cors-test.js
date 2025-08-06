#!/usr/bin/env node

// Test específico del API Gateway con CORS
const https = require('https');

console.log('🔧 Diagnóstico específico del API Gateway con CORS...\n');

const tests = [
  {
    name: 'Health Check - API Gateway',
    path: '/dev/health',
    method: 'GET'
  },
  {
    name: 'Options Preflight - CORS',
    path: '/dev/health',
    method: 'OPTIONS'
  },
  {
    name: 'Driver AI - POST',
    path: '/dev/mayahuelin/analyze',
    method: 'POST',
    body: '{"query": "test"}'
  }
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'qmoyxt3015.execute-api.us-east-1.amazonaws.com',
      port: 443,
      path: test.path,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://antares-master-gzl8-k77hna6p6-juaness38s-projects.vercel.app',
        'User-Agent': 'Test/1.0.0'
      },
      timeout: 15000
    };

    if (test.body) {
      options.headers['Content-Length'] = Buffer.byteLength(test.body);
    }

    console.log(`\n🧪 ${test.name}`);
    console.log(`📍 ${test.method} https://${options.hostname}${test.path}`);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`🔧 CORS Headers:`);
      console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'NO HEADER'}`);
      console.log(`   Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'NO HEADER'}`);
      console.log(`   Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'NO HEADER'}`);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📦 Response: ${data.substring(0, 200)}${data.length > 200 ? '...' : ''}`);
        resolve({
          success: res.statusCode < 400,
          status: res.statusCode,
          headers: res.headers,
          data: data,
          test: test.name
        });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
      resolve({
        success: false,
        error: error.message,
        test: test.name
      });
    });

    req.on('timeout', () => {
      console.log(`⏰ Timeout`);
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout',
        test: test.name
      });
    });

    if (test.body) {
      req.write(test.body);
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🎯 Probando API Gateway con configuración CORS...\n');
  
  for (const test of tests) {
    const result = await testEndpoint(test);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa entre tests
  }
  
  console.log('\n🏁 DIAGNÓSTICO COMPLETO');
  console.log('='.repeat(50));
  console.log('Si todos fallan, el problema está en la configuración del API Gateway');
  console.log('Si OPTIONS funciona pero GET/POST fallan, el problema está en el mapeo de rutas');
  console.log('Si no hay headers CORS, necesitas volver a configurar CORS');
}

runTests().catch(console.error);
