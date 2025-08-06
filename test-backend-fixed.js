#!/usr/bin/env node

console.log('🚀 TESTING BACKEND FIXED - Chat Endpoint Verification\n');

async function testBackendFixed() {
    const ports = [8000, 8001];
    const baseIP = '3.85.5.222';
    
    console.log('🔍 Scanning for backend services...\n');
    
    for (const port of ports) {
        console.log(`\n📡 Testing port ${port}:`);
        
        try {
            // Test health endpoint
            const healthResponse = await fetch(`http://${baseIP}:${port}/api/health`, {
                signal: AbortSignal.timeout(3000)
            });
            
            if (healthResponse.ok) {
                const healthData = await healthResponse.json();
                console.log(`   ✅ Health OK - ${healthData.service} v${healthData.version}`);
                
                // Test available endpoints
                try {
                    const endpointsResponse = await fetch(`http://${baseIP}:${port}/nonexistent`, {
                        signal: AbortSignal.timeout(3000)
                    });
                    const endpointsData = await endpointsResponse.json();
                    console.log(`   📋 Available endpoints: ${endpointsData.available_endpoints?.join(', ')}`);
                    
                    // Test if /api/chat exists
                    if (endpointsData.available_endpoints?.some(ep => ep.includes('/api/chat'))) {
                        console.log('   🎉 /api/chat endpoint FOUND!');
                        
                        // Test chat endpoint
                        console.log('   🧪 Testing chat endpoint...');
                        try {
                            const chatResponse = await fetch(`http://${baseIP}:${port}/api/chat`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ message: 'Hello Driver AI' }),
                                signal: AbortSignal.timeout(5000)
                            });
                            
                            if (chatResponse.ok) {
                                const chatData = await chatResponse.json();
                                console.log('   ✅ Chat endpoint working!');
                                console.log('   📄 Response:', JSON.stringify(chatData, null, 2));
                            } else {
                                console.log(`   ❌ Chat endpoint error: ${chatResponse.status}`);
                                const errorText = await chatResponse.text();
                                console.log('   📄 Error:', errorText);
                            }
                        } catch (chatError) {
                            console.log(`   ❌ Chat test failed: ${chatError.message}`);
                        }
                    } else {
                        console.log('   ⚠️  /api/chat endpoint NOT FOUND');
                    }
                    
                } catch (error) {
                    console.log(`   ⚠️  Could not check endpoints: ${error.message}`);
                }
                
            } else {
                console.log(`   ❌ Health check failed: ${healthResponse.status}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Port ${port} not responding: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎯 BACKEND STATUS SUMMARY:');
    console.log('If /api/chat was found and working → Update frontend');
    console.log('If /api/chat NOT found → Backend deployment pending');
    console.log('='.repeat(60));
}

testBackendFixed().catch(console.error);
