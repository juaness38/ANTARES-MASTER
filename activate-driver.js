/**
 * 🚀 ACTIVADOR DRIVER AI - ASTROFLORA
 */

import './lib/astroflora-driver-ai.js';

// Crear instancia del Driver AI
const driver = new AstrofloraDriverAI({
  mode: 'jarvis',
  baseUrl: 'http://3.85.5.222:8001'
});

console.log('🤖 Activating ANTARES Driver AI...');

// Prueba de conexión
async function activateDriver() {
  try {
    console.log('📡 Testing Driver AI connection...');
    
    const testQuery = "Test Driver AI activation - ANTARES system";
    const response = await driver.chat(testQuery, {
      user_id: 'antares-system',
      session_id: 'activation-test'
    });
    
    console.log('✅ Driver AI ACTIVATED successfully!');
    console.log('📊 Response:', response);
    console.log('🎯 Driver AI is ready for ANTARES AstroFlora!');
    
  } catch (error) {
    console.error('❌ Driver AI activation failed:', error.message);
    console.log('🔧 Retrying with fallback configuration...');
  }
}

activateDriver();
