#!/usr/bin/env node

// Test directo del driver AI
const https = require('https');

console.log('🧪 Probando Driver AI con configuración corregida...\n');

const testDriverAI = () => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ 
      query: "driver pasame los pdb del análisis",
      context: { source: "test" }
    });

    const options = {
      hostname: 'qmoyxt3015.execute-api.us-east-1.amazonaws.com',
      port: 443,
      path: '/dev/mayahuelin/analyze',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'AstroFlora-Test/1.0.0',
        'Accept': 'application/json'
      },
      timeout: 30000
    };

    console.log(`📍 URL: https://${options.hostname}${options.path}`);
    console.log(`📤 Payload:`, postData);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📦 Response:`, data);
        
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            console.log('\n✅ ÉXITO: Driver AI respondió correctamente');
            console.log('🔬 Análisis ID:', parsed.analysis_id);
            console.log('📊 Estado:', parsed.status);
            if (parsed.results) {
              console.log('🧬 Resultados disponibles');
            }
          } catch (e) {
            console.log('⚠️ Respuesta no es JSON válido');
          }
        } else {
          console.log(`❌ Error: HTTP ${res.statusCode}`);
        }
        
        resolve({
          success: res.statusCode === 200,
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error de red: ${error.message}`);
      resolve({
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      console.log(`⏰ Timeout después de 30 segundos`);
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout'
      });
    });

    req.write(postData);
    req.end();
  });
};

// Ejecutar test
testDriverAI().then(result => {
  console.log('\n📋 RESULTADO FINAL:');
  console.log('='.repeat(40));
  
  if (result.success) {
    console.log('🎉 CONEXIÓN EXITOSA - Driver AI está funcionando');
    console.log('🚀 Frontend puede conectarse al backend a través de API Gateway');
  } else {
    console.log('❌ CONEXIÓN FALLIDA');
    console.log('🔧 Verificar:');
    console.log('   1. API Gateway esté desplegado');
    console.log('   2. Servidor backend esté corriendo en 3.85.5.222:8001');
    console.log('   3. Rutas estén configuradas correctamente');
  }
});
