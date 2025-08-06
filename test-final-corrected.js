/**
 * 🧪 TEST FINAL CORREGIDO - DRIVER AI 7.0 INTEGRATION
 * Verificar que el ChatService funciona correctamente sin OpenAI
 */

console.log('🧪 Testing Driver AI integration after corrections...\n');

// Test 1: Health Check
async function testHealthCheck() {
    console.log('1️⃣ Testing health check...');
    try {
        const response = await fetch('http://localhost:3000/api/driver-ai', {
            method: 'GET'
        });
        
        const result = await response.json();
        console.log('✅ Health check:', result);
        return true;
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
        return false;
    }
}

// Test 2: Direct Analysis
async function testAnalysis() {
    console.log('\n2️⃣ Testing protein analysis...');
    try {
        const response = await fetch('http://localhost:3000/api/driver-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sequence: 'MALVRDPEPAAGSSRWLPTHVQVTVLRASGLRGKSSGAGSTSDAYTVIQVGREKYSTSVV',
                analysis_type: 'blast'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('🚀 Analysis response status:', response.status);
        console.log('🔬 Driver AI Analysis Result:', result);
        return true;
    } catch (error) {
        console.log('❌ Analysis failed:', error.message);
        return false;
    }
}

// Test 3: Verificar que NO se llama a OpenAI
async function testNoOpenAI() {
    console.log('\n3️⃣ Testing that OpenAI is NOT called...');
    try {
        // Intentar llamar directamente a /api/chat para verificar que falla
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'user', content: 'test message' }
                ]
            })
        });
        
        if (response.ok) {
            console.log('⚠️ OpenAI endpoint is still working (unexpected)');
            return false;
        } else {
            console.log('✅ OpenAI endpoint correctly fails with status:', response.status);
            return true;
        }
    } catch (error) {
        console.log('✅ OpenAI endpoint correctly fails:', error.message);
        return true;
    }
}

// Run all tests
async function runTests() {
    const results = [];
    
    results.push(await testHealthCheck());
    results.push(await testAnalysis());
    results.push(await testNoOpenAI());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`\n📊 Test Results: ${passed}/${total} passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! Driver AI integration is working correctly.');
    } else {
        console.log('❌ Some tests failed. Check the implementation.');
    }
}

runTests().catch(console.error);
