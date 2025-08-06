#!/usr/bin/env node

console.log('🚀 CONEXIÓN DEFINITIVA - Driver AI Integration Test\n');

async function finalConnectionTest() {
    const tests = [
        {
            name: 'Health Check Directo',
            url: 'http://3.85.5.222:8001/api/health',
            method: 'GET'
        },
        {
            name: 'Health Check Proxy',
            url: 'http://localhost:3000/api/driver/health',
            method: 'GET'
        },
        {
            name: 'Analyze Directo',
            url: 'http://3.85.5.222:8001/api/analyze',
            method: 'POST',
            body: { sequence: 'ATCG' }
        },
        {
            name: 'Analyze Proxy',
            url: 'http://localhost:3000/api/driver/analyze',
            method: 'POST',
            body: { sequence: 'ATCG' }
        },
        {
            name: 'Chat Proxy (→ analyze)',
            url: 'http://localhost:3000/api/driver/chat',
            method: 'POST',
            body: { sequence: 'MKTVRQERLK' }
        }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        console.log(`\n${i + 1}. 🧪 ${test.name}`);
        
        try {
            const options = {
                method: test.method,
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(8000)
            };
            
            if (test.body) {
                options.body = JSON.stringify(test.body);
            }
            
            const response = await fetch(test.url, options);
            const status = response.status;
            
            if (response.ok) {
                const data = await response.json();
                console.log(`   ✅ Status: ${status} - OK`);
                
                if (data.service) {
                    console.log(`   📡 Service: ${data.service} v${data.version}`);
                } else if (data.analysis_id) {
                    console.log(`   🔬 Analysis ID: ${data.analysis_id}`);
                    console.log(`   📊 Engine: ${data.engine}`);
                } else {
                    console.log(`   📄 Response type: ${typeof data}`);
                }
                passedTests++;
            } else {
                console.log(`   ❌ Status: ${status} - FAILED`);
                const text = await response.text();
                console.log(`   📄 Error: ${text.substring(0, 100)}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        // Pequeña pausa entre tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`🎯 RESULTADOS FINALES: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 ¡CONEXIÓN DEFINITIVA EXITOSA!');
        console.log('✅ Backend Driver AI completamente integrado');
        console.log('✅ Proxy configuration funcionando');
        console.log('✅ Frontend ready para producción');
    } else {
        console.log('⚠️  Algunos tests fallaron, revisar configuración');
    }
    
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('1. Probar chat interface en http://localhost:3000');
    console.log('2. Verificar página de test en http://localhost:3000/driver-test.html');
    console.log('3. Confirmar análisis de secuencias reales');
}

finalConnectionTest().catch(console.error);
