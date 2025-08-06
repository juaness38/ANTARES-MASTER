/**
 * 🧪 PRUEBA DIRECTA DEL NUEVO CLIENTE DRIVER AI
 * Test para verificar que el cliente funciona correctamente
 */

import { jarvisClient } from './lib/jarvis-client.js';

async function testDriverAI() {
  console.log('🚀 Iniciando prueba del Driver AI Client...');
  
  try {
    // 1. Probar conversación simple
    console.log('\n💬 TEST 1: Conversación simple');
    const response1 = await jarvisClient.process('hola driver');
    console.log('Respuesta 1:', response1);
    
    // 2. Probar consulta científica
    console.log('\n🔬 TEST 2: Consulta científica');
    const response2 = await jarvisClient.process('analiza esta proteína');
    console.log('Respuesta 2:', response2);
    
    // 3. Probar secuencia de proteína
    console.log('\n🧬 TEST 3: Secuencia de proteína');
    const response3 = await jarvisClient.process('MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAV');
    console.log('Respuesta 3:', response3);
    
    // 4. Estadísticas
    console.log('\n📊 ESTADÍSTICAS:');
    console.log(jarvisClient.getStats());
    
  } catch (error) {
    console.error('❌ Error en prueba:', error);
  }
}

// Ejecutar prueba
testDriverAI();
