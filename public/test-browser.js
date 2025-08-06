// 🧪 TEST DRIVER AI DESDE BROWSER
console.log('🧪 Testing Driver AI from browser console...');

// Test directo del health check
async function testBrowserHealthCheck() {
    console.log('🔍 Testing health check from browser...');
    try {
        const response = await fetch('/api/driver-ai', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ANTARES-Frontend/1.0.0'
            }
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Health check data:', data);
        } else {
            const text = await response.text();
            console.log('❌ Health check failed:', text);
        }
        
        return response.ok;
    } catch (error) {
        console.error('🚨 Health check exception:', error);
        return false;
    }
}

// Test del ChatService
async function testChatService() {
    console.log('🔍 Testing ChatService...');
    try {
        // Esto simulará lo que hace el componente
        const ChatServiceModule = await import('/lib/chat-service.ts');
        const chatService = new ChatServiceModule.ChatService('test-key', {
            enableDriverAI: true,
            fallbackToOpenAI: false
        });
        
        console.log('🔧 ChatService created:', chatService);
        
        const healthResult = await chatService.checkDriverAIHealth();
        console.log('🏥 Health check result:', healthResult);
        
        return healthResult;
    } catch (error) {
        console.error('🚨 ChatService test failed:', error);
        return false;
    }
}

// Ejecutar tests
(async () => {
    console.log('🚀 Starting browser tests...\n');
    
    const healthResult = await testBrowserHealthCheck();
    console.log('\n📊 Browser health check result:', healthResult);
    
    const chatServiceResult = await testChatService();
    console.log('\n📊 ChatService test result:', chatServiceResult);
    
    console.log('\n✅ Browser tests completed!');
})();
