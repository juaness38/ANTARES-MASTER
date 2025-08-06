/**
 * 🚀 ACTIVADOR DRIVER AI - ANTARES SIMPLE
 */

console.log('🤖 Activating ANTARES Driver AI...');

const DRIVER_AI_URL = 'http://3.85.5.222:8001';

async function activateDriver() {
  try {
    console.log('📡 Testing Driver AI connection at:', DRIVER_AI_URL);
    
    const response = await fetch(`${DRIVER_AI_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Driver AI HEALTH CHECK PASSED!');
      console.log('📊 Health Data:', data);
      
      // Realizar prueba de chat
      console.log('🧪 Testing chat functionality...');
      
      const chatResponse = await fetch(`${DRIVER_AI_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: "Driver AI activation test for ANTARES AstroFlora system",
          context: {
            user_id: "antares-system",
            session_id: "activation-" + Date.now(),
            analysis_type: "system_test"
          }
        })
      });
      
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        console.log('🎯 DRIVER AI FULLY ACTIVATED!');
        console.log('💬 Chat Response:', chatData.message);
        console.log('🚀 ANTARES AstroFlora Driver AI is READY!');
      } else {
        console.log('⚠️  Health OK but chat failed. Driver AI partially active.');
      }
      
    } else {
      console.log('❌ Driver AI connection failed:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Driver AI activation error:', error.message);
    console.log('🔧 Check network connection to:', DRIVER_AI_URL);
  }
}

activateDriver();
