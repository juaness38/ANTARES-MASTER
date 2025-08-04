// Test directo del Driver AI
async function testDriverDirectly() {
    console.log('🤖 Testing Driver AI directly...');
    
    const tests = [
        {
            name: 'Driver AI Basic Test',
            url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/driver-ai/analyze',
            payload: {
                query: 'driver pasame los pdb del análisis',
                context: { source: 'direct_test' }
            }
        },
        {
            name: 'Health Check',
            url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/health',
            method: 'GET'
        },
        {
            name: 'API v1 Files',
            url: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev/api/v1/files',
            method: 'GET'
        }
    ];
    
    for (const test of tests) {
        try {
            console.log(`\n📡 Testing: ${test.name}`);
            console.log(`URL: ${test.url}`);
            
            const options = {
                method: test.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'AstroFlora-DirectTest/1.0.0',
                    'Accept': 'application/json'
                }
            };
            
            if (test.payload) {
                options.body = JSON.stringify(test.payload);
            }
            
            const response = await fetch(test.url, options);
            
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
            
            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
                console.log('JSON Response:', responseData);
            } else {
                responseData = await response.text();
                console.log('Text Response:', responseData);
            }
            
            if (response.ok) {
                console.log('✅ SUCCESS');
            } else {
                console.log('❌ FAILED');
            }
            
        } catch (error) {
            console.error(`💥 Error testing ${test.name}:`, error);
        }
    }
}

// Ejecutar test
testDriverDirectly();
