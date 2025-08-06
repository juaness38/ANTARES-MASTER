#!/usr/bin/env node

import axios from 'axios';

async function testLightsailBackend() {
    console.log('🔍 Testing Lightsail 3.85.5.222:8001 backend...\n');
    
    const baseUrl = 'http://3.85.5.222:8001';
    
    const endpoints = [
        { name: 'Health', url: `${baseUrl}/api/health`, method: 'GET' },
        { name: 'Chat', url: `${baseUrl}/api/chat`, method: 'POST' },
        { name: 'Analyze', url: `${baseUrl}/api/analyze`, method: 'POST' }
    ];
    
    // Test GET endpoints first
    for (const endpoint of endpoints.filter(e => e.method === 'GET')) {
        try {
            console.log(`📡 Testing ${endpoint.name} endpoint (${endpoint.method})...`);
            const response = await axios.get(endpoint.url, { timeout: 5000 });
            console.log(`✅ ${endpoint.name}: ${response.status} - ${JSON.stringify(response.data)}`);
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log(`❌ ${endpoint.name}: Connection refused`);
            } else if (error.response) {
                console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`);
            } else {
                console.log(`❌ ${endpoint.name}: ${error.message}`);
            }
        }
        console.log('');
    }
    
    // Test Chat endpoint specifically
    try {
        console.log('🧪 Testing /api/chat endpoint with POST...');
        const chatResponse = await axios.post(`${baseUrl}/api/chat`, {
            message: "Hello, this is a test chat message",
            session_id: "test-session-lightsail"
        }, { 
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Chat endpoint test SUCCESSFUL!');
        console.log('📊 Response status:', chatResponse.status);
        console.log('📄 Response data:', JSON.stringify(chatResponse.data, null, 2));
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Chat endpoint: Connection refused');
        } else if (error.response) {
            console.log(`❌ Chat endpoint: ${error.response.status} - ${error.response.statusText}`);
            if (error.response.status === 404) {
                console.log('🔍 /api/chat endpoint not found - server might still be running old version');
            }
            if (error.response.data) {
                console.log('📄 Error details:', JSON.stringify(error.response.data, null, 2));
            }
        } else {
            console.log('❌ Chat endpoint:', error.message);
        }
    }
    
    console.log('\n');
    
    // Test Analyze endpoint as backup
    try {
        console.log('🧪 Testing /api/analyze endpoint for comparison...');
        const analyzeResponse = await axios.post(`${baseUrl}/api/analyze`, {
            message: "Hello, this is a test analyze message",
            session_id: "test-session-analyze"
        }, { 
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Analyze endpoint working:');
        console.log('📊 Response status:', analyzeResponse.status);
        console.log('📄 Response data:', JSON.stringify(analyzeResponse.data, null, 2));
        
    } catch (error) {
        if (error.response) {
            console.log(`❌ Analyze endpoint: ${error.response.status} - ${error.response.statusText}`);
        } else {
            console.log('❌ Analyze endpoint:', error.message);
        }
    }
}

testLightsailBackend().catch(console.error);
