#!/usr/bin/env node

console.log('🔍 DRIVER AI CHAT ENDPOINT MONITOR');
console.log('Waiting for /api/chat deployment...\n');

const BACKEND_URL = 'http://3.85.5.222:8001';
const CHECK_INTERVAL = 10000; // 10 segundos
let checkCount = 0;

async function checkChatEndpoint() {
    checkCount++;
    const timestamp = new Date().toLocaleTimeString();
    
    try {
        // 1. Verificar que el backend esté activo
        const healthResponse = await fetch(`${BACKEND_URL}/api/health`, {
            signal: AbortSignal.timeout(3000)
        });
        
        if (!healthResponse.ok) {
            console.log(`❌ [${timestamp}] Backend no disponible`);
            return false;
        }
        
        const health = await healthResponse.json();
        
        // 2. Verificar endpoints disponibles
        const endpointsResponse = await fetch(`${BACKEND_URL}/nonexistent`, {
            signal: AbortSignal.timeout(3000)
        });
        
        const endpoints = await endpointsResponse.json();
        const availableEndpoints = endpoints.available_endpoints || [];
        
        // 3. Buscar /api/chat
        const hasChatEndpoint = availableEndpoints.some(ep => ep.includes('/api/chat'));
        
        if (hasChatEndpoint) {
            console.log(`🎉 [${timestamp}] ¡/api/chat ENDPOINT FOUND!`);
            console.log(`📡 Backend: ${health.service} v${health.version}`);
            console.log(`📋 Available endpoints: ${availableEndpoints.join(', ')}`);
            
            // 4. Probar el endpoint de chat
            console.log('\n🧪 Testing /api/chat endpoint...');
            try {
                const chatTestResponse = await fetch(`${BACKEND_URL}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: 'Test from monitor', 
                        session_id: 'monitor_test' 
                    }),
                    signal: AbortSignal.timeout(5000)
                });
                
                if (chatTestResponse.ok) {
                    const chatData = await chatTestResponse.json();
                    console.log('✅ Chat endpoint is working!');
                    console.log('📄 Response:', JSON.stringify(chatData, null, 2));
                    
                    console.log('\n' + '='.repeat(60));
                    console.log('🚀 CHAT ENDPOINT IS READY!');
                    console.log('✅ Frontend will now use /api/chat automatically');
                    console.log('✅ No more fallback to /api/analyze needed');
                    console.log('✅ Chat conversations will work as expected');
                    console.log('\n🎯 Go to http://localhost:3000 and test the chat!');
                    console.log('='.repeat(60));
                    
                    return true; // Endpoint funcionando
                } else {
                    console.log(`❌ Chat endpoint error: ${chatTestResponse.status}`);
                    const errorText = await chatTestResponse.text();
                    console.log(`📄 Error: ${errorText}`);
                }
            } catch (chatError) {
                console.log(`❌ Chat test failed: ${chatError.message}`);
            }
        } else {
            console.log(`⏳ [${timestamp}] Check #${checkCount} - /api/chat not yet available`);
            console.log(`   Backend: ${health.service} v${health.version}`);
            console.log(`   Available: ${availableEndpoints.join(', ')}`);
        }
        
        return false;
        
    } catch (error) {
        console.log(`❌ [${timestamp}] Error checking backend: ${error.message}`);
        return false;
    }
}

async function startMonitoring() {
    console.log(`🔄 Checking every ${CHECK_INTERVAL/1000} seconds...`);
    console.log(`🎯 Target: ${BACKEND_URL}/api/chat`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
    
    // Check inicial
    const isReady = await checkChatEndpoint();
    if (isReady) {
        process.exit(0);
    }
    
    // Monitoring continuo
    const interval = setInterval(async () => {
        const isReady = await checkChatEndpoint();
        if (isReady) {
            clearInterval(interval);
            process.exit(0);
        }
    }, CHECK_INTERVAL);
    
    // Cleanup en caso de interrupción
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Monitoring stopped');
        console.log('💡 Run again when you want to check for /api/chat availability');
        clearInterval(interval);
        process.exit(0);
    });
}

startMonitoring().catch(console.error);
