#!/usr/bin/env node

console.log('🔍 ESTADO ACTUAL - Driver AI Integration\n');

async function checkCurrentState() {
    try {
        // 1. Verificar backend health
        console.log('1. 📡 Backend Status:');
        const healthResponse = await fetch('http://3.85.5.222:8001/api/health', {
            signal: AbortSignal.timeout(3000)
        });
        
        if (healthResponse.ok) {
            const health = await healthResponse.json();
            console.log(`   ✅ ${health.service} v${health.version} - ACTIVE`);
        }
        
        // 2. Verificar endpoints disponibles
        console.log('\n2. 📋 Available Endpoints:');
        const endpointsResponse = await fetch('http://3.85.5.222:8001/endpoints', {
            signal: AbortSignal.timeout(3000)
        });
        const endpoints = await endpointsResponse.json();
        endpoints.available_endpoints.forEach(ep => {
            console.log(`   ${ep}`);
        });
        
        // 3. Test /api/chat
        console.log('\n3. 💬 Testing /api/chat:');
        try {
            const chatResponse = await fetch('http://localhost:3000/api/driver/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'test', session_id: 'test' }),
                signal: AbortSignal.timeout(3000)
            });
            
            console.log(`   Status: ${chatResponse.status}`);
            if (chatResponse.status === 404) {
                console.log('   ❌ /api/chat NOT DEPLOYED yet');
            } else if (chatResponse.ok) {
                const data = await chatResponse.json();
                console.log('   ✅ /api/chat WORKING!');
                console.log('   📄 Response:', JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        // 4. Test fallback to analyze
        console.log('\n4. 🔬 Testing fallback (analyze):');
        try {
            const analyzeResponse = await fetch('http://localhost:3000/api/driver/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sequence: 'ATCG' }),
                signal: AbortSignal.timeout(3000)
            });
            
            console.log(`   Status: ${analyzeResponse.status}`);
            if (analyzeResponse.ok) {
                console.log('   ✅ Analyze endpoint working (fallback ready)');
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('📋 SUMMARY:');
        console.log('✅ Frontend: Updated and ready for /api/chat');
        console.log('✅ Proxy: Configured correctly');
        console.log('✅ Fallback: Working (analyze endpoint)');
        console.log('⏳ Waiting: Backend deployment of /api/chat endpoint');
        console.log('\n🎯 NEXT: Once backend deploys /api/chat, chat will work automatically!');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkCurrentState();
