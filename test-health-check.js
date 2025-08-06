// Test ChatService health check
async function testChatServiceHealthCheck() {
  console.log('🧪 Testing ChatService health check...');
  
  try {
    // Simular lo que hace el componente
    const response = await fetch('/api/driver-ai', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health data:', data);
      console.log('Should be healthy:', data.status === 'healthy');
    }
    
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

testChatServiceHealthCheck();
