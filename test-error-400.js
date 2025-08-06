/**
 * 🧪 TEST ERROR 400 - Probar mensaje que está fallando
 */

console.log('🧪 Testing failing message: "esta conectado tu backend?"');

async function testFailingMessage() {
    try {
        console.log('📤 Sending failing message...');
        
        const response = await fetch('http://localhost:3000/api/driver-ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: 'esta conectado tu backend?',
                context: {
                    user_id: 'frontend-user',
                    session_id: 'session_test',
                    domain: 'general',
                    analysis_type: 'scientific'
                }
            })
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success response:', data);
        } else {
            const errorText = await response.text();
            console.log('❌ Error response:', errorText);
        }
        
    } catch (error) {
        console.error('🚨 Network error:', error);
    }
}

async function testWorkingMessage() {
    try {
        console.log('\n📤 Testing working protein sequence...');
        
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
        
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Success response keys:', Object.keys(data));
        } else {
            const errorText = await response.text();
            console.log('❌ Error response:', errorText);
        }
        
    } catch (error) {
        console.error('🚨 Network error:', error);
    }
}

async function runTests() {
    await testFailingMessage();
    await testWorkingMessage();
    console.log('\n📊 Test completed!');
}

runTests().catch(console.error);
