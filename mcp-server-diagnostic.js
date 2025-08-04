#!/usr/bin/env node

// Diagnóstico completo del servidor MCP
const https = require('https');
const http = require('http');

console.log('🔍 Iniciando diagnóstico completo del servidor MCP...\n');

// URLs a probar
const tests = [
  {
    name: 'API Gateway Health',
    url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/api/v1/health',
    method: 'GET'
  },
  {
    name: 'Backend Directo Health',
    url: 'http://3.85.5.222:3000/health',
    method: 'GET'
  },
  {
    name: 'Backend Puerto 8000',
    url: 'http://3.85.5.222:8000/health',
    method: 'GET'
  },
  {
    name: 'Backend Puerto 4000',
    url: 'http://3.85.5.222:4000/health',
    method: 'GET'
  },
  {
    name: 'Driver AI - API Gateway',
    url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze',
    method: 'POST',
    body: JSON.stringify({ 
      query: "driver pasame los pdb del análisis",
      context: { source: "diagnostic" }
    })
  },
  {
    name: 'MCP Server - API Gateway',
    url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/mcp/status',
    method: 'GET'
  }
];

async function testEndpoint(test) {
  return new Promise((resolve) => {
    const isHttps = test.url.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(test.url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MCP-Diagnostic/1.0.0',
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    console.log(`\n🧪 Probando: ${test.name}`);
    console.log(`📍 URL: ${test.url}`);
    console.log(`🔧 Método: ${test.method}`);

    const req = client.request(options, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📦 Response Body:`, data.substring(0, 500));
        resolve({
          success: true,
          status: res.statusCode,
          headers: res.headers,
          body: data,
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
      console.log(`⏰ Timeout después de 10 segundos`);
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

async function runDiagnostics() {
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test);
    results.push(result);
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n\n📋 RESUMEN DE DIAGNÓSTICO:');
  console.log('='.repeat(50));
  
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.test}`);
    if (result.success) {
      console.log(`   Status: ${result.status}`);
    } else {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log('\n🔍 ANÁLISIS:');
  const workingEndpoints = results.filter(r => r.success && r.status < 400);
  const errorEndpoints = results.filter(r => !r.success || r.status >= 400);
  
  console.log(`✅ Endpoints funcionando: ${workingEndpoints.length}`);
  console.log(`❌ Endpoints con problemas: ${errorEndpoints.length}`);
  
  if (workingEndpoints.length === 0) {
    console.log('\n🚨 PROBLEMA CRÍTICO: Ningún endpoint está funcionando');
    console.log('💡 Posibles causas:');
    console.log('   1. El servidor backend no está corriendo');
    console.log('   2. Los contenedores Docker están parados');
    console.log('   3. El API Gateway no está configurado correctamente');
    console.log('   4. Problemas de conectividad de red');
  }
  
  console.log('\n🛠️ PRÓXIMOS PASOS RECOMENDADOS:');
  console.log('1. Verificar estado de contenedores Docker en el servidor');
  console.log('2. Revisar logs del API Gateway en AWS');
  console.log('3. Verificar configuración de rutas en API Gateway');
  console.log('4. Probar conectividad SSH al servidor backend');
}

// Ejecutar diagnóstico
runDiagnostics().catch(console.error);
