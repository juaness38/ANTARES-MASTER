/**
 * 🧪 TEST CLIENTE INTELIGENTE ASTROFLORA
 * Prueba el nuevo cliente que detecta automáticamente intenciones
 */

const { AstrofloraDriverAI } = require('./lib/astroflora-driver-ai.js');

console.log('🧪 Testing Astroflora Intelligent Driver AI Client...\n');

// Inicializar cliente en modo Jarvis
const jarvis = new AstrofloraDriverAI({
  mode: 'jarvis',
  baseUrl: 'http://3.85.5.222:8001'
});

// Contexto de conversación
const context = {
  user_id: 'frontend-user',
  session_id: 'session_test',
  scientific_domain: 'general'
};

// Test 1: Mensaje conversacional general
async function testConversationalMessage() {
  console.log('💬 Test 1: Conversación general...');
  try {
    const response = await jarvis.chat('esta conectado tu backend?', context);
    console.log('✅ Respuesta:', response.message.substring(0, 100) + '...');
    console.log('🎯 Intención detectada:', response.intention);
    console.log('💡 Sugerencias:', response.suggestions);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test 2: Secuencia de proteína
async function testProteinAnalysis() {
  console.log('🧬 Test 2: Análisis de proteína...');
  try {
    const response = await jarvis.chat(
      'MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVV',
      context
    );
    console.log('✅ Respuesta:', response.message.substring(0, 100) + '...');
    console.log('🎯 Intención detectada:', response.intention);
    console.log('🔬 Datos científicos:', !!response.scientific_data);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test 3: Ayuda con protocolo
async function testProtocolHelp() {
  console.log('🧪 Test 3: Ayuda con protocolo...');
  try {
    const response = await jarvis.chat('necesito ayuda con un protocolo de PCR', context);
    console.log('✅ Respuesta:', response.message.substring(0, 100) + '...');
    console.log('🎯 Intención detectada:', response.intention);
    console.log('� Sugerencias:', response.suggestions);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Test 4: Guía experimental
async function testExperimentGuidance() {
  console.log('🔬 Test 4: Guía experimental...');
  try {
    const response = await jarvis.chat('como diseño un experimento de western blot?', context);
    console.log('✅ Respuesta:', response.message.substring(0, 100) + '...');
    console.log('🎯 Intención detectada:', response.intention);
    console.log('� Sugerencias:', response.suggestions);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Iniciando tests del cliente inteligente Astroflora...');
  
  await testConversationalMessage();
  await testProteinAnalysis(); 
  await testProtocolHelp();
  await testExperimentGuidance();
  
  console.log('📊 Estadísticas del cliente:');
  console.log(jarvis.getStats());
  
  console.log('✅ Tests completados!');
  console.log('🎯 El cliente inteligente está listo para integrarse con Astroflora Frontend');
}

// Ejecutar en Node.js
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}

// Exportar para uso en browser
if (typeof window !== 'undefined') {
  window.testAstrofloraClient = runAllTests;
}

// Test 2: Protein sequence
async function testProteinSequence() {
    console.log('\n2️⃣ Testing protein sequence analysis...');
    try {
        const response = await fetch('http://localhost:3000/api/driver-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sequence: 'MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVV',
                analysis_type: 'blast'
            })
        });
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Protein analysis received successfully');
            console.log('📝 Analysis ID:', data.analysis_id);
            return true;
        } else {
            const errorText = await response.text();
            console.log('❌ Protein analysis failed:', errorText);
            return false;
        }
        
    } catch (error) {
        console.error('🚨 Network error:', error);
        return false;
    }
}

// Test 3: Health check
async function testHealthCheck() {
    console.log('\n3️⃣ Testing health check...');
    try {
        const response = await fetch('http://localhost:3000/api/driver-ai', {
            method: 'GET'
        });
        
        const result = await response.json();
        console.log('✅ Health check:', result.status);
        return response.ok;
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
        return false;
    }
}

// Run all tests
async function runIntelligentChatTests() {
    const results = [];
    
    results.push(await testHealthCheck());
    results.push(await testConversationalMessage());
    results.push(await testProteinSequence());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`\n📊 Intelligent Chat Test Results: ${passed}/${total} passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Intelligent chat is working correctly.');
        console.log('💬 The chat can now handle both conversational messages and protein analysis!');
    } else {
        console.log('❌ Some tests failed. Check the implementation.');
    }
}

runIntelligentChatTests().catch(console.error);
