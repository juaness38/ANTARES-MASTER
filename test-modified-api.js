#!/usr/bin/env node

import axios from 'axios';

async function testModifiedAPI() {
    console.log('🧪 Testing modified API with chat endpoint integration...\n');
    
    const baseUrl = 'http://localhost:3001';
    
    // Test 1: Consulta conversacional
    console.log('💬 Testing conversational query...');
    try {
        const response1 = await axios.post(`${baseUrl}/api/driver-ai`, {
            query: "Hola, ¿cómo estás? ¿Puedes ayudarme con mi investigación?"
        }, { timeout: 10000 });
        
        console.log('✅ Conversational response:');
        console.log('Status:', response1.status);
        console.log('Response:', JSON.stringify(response1.data, null, 2));
    } catch (error) {
        console.log('❌ Conversational test failed:', error.response?.data || error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 2: Consulta científica (BLAST)
    console.log('🔬 Testing scientific query (BLAST)...');
    try {
        const response2 = await axios.post(`${baseUrl}/api/driver-ai`, {
            query: "Haz un análisis BLAST de esta secuencia"
        }, { timeout: 10000 });
        
        console.log('✅ Scientific response:');
        console.log('Status:', response2.status);
        console.log('Response:', JSON.stringify(response2.data, null, 2));
    } catch (error) {
        console.log('❌ Scientific test failed:', error.response?.data || error.message);
    }
    
    console.log('\n' + '='.repeat(50) + '\n');
    
    // Test 3: Secuencia de proteína
    console.log('🧬 Testing protein sequence...');
    try {
        const response3 = await axios.post(`${baseUrl}/api/driver-ai`, {
            query: "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAV"
        }, { timeout: 15000 });
        
        console.log('✅ Protein sequence response:');
        console.log('Status:', response3.status);
        console.log('Response type:', response3.data.analysis_type || 'unknown');
        console.log('Has analysis_id:', !!response3.data.analysis_id);
    } catch (error) {
        console.log('❌ Protein sequence test failed:', error.response?.data || error.message);
    }
}

testModifiedAPI().catch(console.error);
