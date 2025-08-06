// Test final del ChatService para verificar el flujo completo
async function testChatServiceComplete() {
  console.log('🧪 Testing ChatService with Driver AI 7.0...');
  
  try {
    // Test 1: Health check directo
    const healthResponse = await fetch('http://localhost:3000/api/driver-ai');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test 2: Análisis con secuencia de proteína (debería usar Driver AI)
    const proteinSequence = "MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVV";
    
    const analysisResponse = await fetch('http://localhost:3000/api/driver-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sequence: proteinSequence,
        analysis_type: 'blast'
      })
    });
    
    console.log('🚀 Analysis response status:', analysisResponse.status);
    const result = await analysisResponse.json();
    console.log('🔬 Driver AI Analysis Result:', result);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testChatServiceComplete();
