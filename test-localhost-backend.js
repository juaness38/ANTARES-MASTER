#!/usr/bin/env node

import axios from 'axios';

async function testLocalBackend() {
    console.log('🔍 Testing localhost:8001 backend...\n');
    
    const endpoints = [
        { name: 'Health', url: 'http://localhost:8001/api/health' },
        { name: 'Chat', url: 'http://localhost:8001/api/chat' },
        { name: 'Analyze', url: 'http://localhost:8001/api/analyze' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`📡 Testing ${endpoint.name} endpoint...`);
            const response = await axios.get(endpoint.url, { timeout: 3000 });
            console.log(`✅ ${endpoint.name}: ${response.status} - ${JSON.stringify(response.data)}`);
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log(`❌ ${endpoint.name}: Server not running on localhost:8001`);
            } else {
                console.log(`❌ ${endpoint.name}: ${error.response?.status || error.message}`);
            }
        }
        console.log('');
    }
    
    // Test with a simple chat message
    try {
        console.log('🧪 Testing chat functionality...');
        const chatResponse = await axios.post('http://localhost:8001/api/chat', {
            message: "Hello, this is a test message",
            session_id: "test-session-123"
        }, { timeout: 5000 });
        
        console.log('✅ Chat test successful:', chatResponse.status);
        console.log('📄 Response:', JSON.stringify(chatResponse.data, null, 2));
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Chat test: Server not running on localhost:8001');
        } else {
            console.log('❌ Chat test:', error.response?.status || error.message);
            if (error.response?.data) {
                console.log('📄 Error details:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
}

testLocalBackend().catch(console.error);
