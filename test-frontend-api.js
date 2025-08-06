#!/usr/bin/env node

// Test directo del endpoint del frontend
const https = require('https');

console.log('🧪 Testing Frontend API Endpoint...\n');

const testFrontendAPI = () => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ 
      message: "driver pasame los pdb del análisis"
    });

    const options = {
      hostname: 'antares-master-gzl8-k77hna6p6-juaness38s-projects.vercel.app',
      port: 443,
      path: '/api/enhanced-astroflora-chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'Test/1.0.0'
      },
      timeout: 30000
    };

    console.log(`📍 Testing: https://${options.hostname}${options.path}`);
    console.log(`📤 Payload:`, postData);

    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📦 Raw Response:`, data);
        
        try {
          const parsed = JSON.parse(data);
          console.log('\n🔍 ANÁLISIS DE RESPUESTA:');
          console.log(`Tipo: ${parsed.type}`);
          console.log(`Mensaje (primeros 200 chars): ${parsed.message?.substring(0, 200)}...`);
          
          if (parsed.message?.includes('Backend Status: Desconectado')) {
            console.log('\n❌ PROBLEMA: Frontend detecta backend desconectado');
            console.log('🔧 El sendToDriverAI() está fallando en el servidor');
          } else if (parsed.message?.includes('DOCK_MAY_')) {
            console.log('\n✅ ÉXITO: Driver AI está funcionando');
          } else if (parsed.message?.includes('demo')) {
            console.log('\n⚠️ MOCK: Usando datos de demostración');
          }
          
        } catch (e) {
          console.log('⚠️ Respuesta no es JSON válido');
        }
        
        resolve({
          success: res.statusCode === 200,
          status: res.statusCode,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Error: ${error.message}`);
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
testFrontendAPI().then(result => {
  console.log('\n📋 RESULTADO:');
  console.log('='.repeat(40));
  
  if (result.success) {
    console.log('✅ Frontend API respondió correctamente');
  } else {
    console.log('❌ Frontend API falló');
    console.log('Error:', result.error);
  }
});
