// Test directo del Driver AI - BACKEND REAL POST-REDESPLIEGUE
const sequence = "MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVV";

async function testDriverAI() {
  console.log('🧪 Testing Driver AI connection - NUEVO BACKEND REAL...');
  
  try {
    // Test health
    const healthResponse = await fetch('http://localhost:3000/api/driver-ai');
    console.log('✅ Health check (should show real backend):', await healthResponse.json());
    
    // Test analysis con el NUEVO endpoint del Driver AI 7.0
    const analysisResponse = await fetch('http://localhost:3000/api/driver-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sequence: sequence,
        analysis_type: 'blast'
      })
    });
    
    console.log('🚀 Analysis response status:', analysisResponse.status);
    const result = await analysisResponse.json();
    console.log('🎯 REAL Driver AI Analysis:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDriverAI();
