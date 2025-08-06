const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    console.log(`📥 ${req.method} ${path}`);
    
    if (path === '/api/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('� Chat request:', data);
                
                const { message, session_id } = data;
                
                if (!message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Message is required' }));
                    return;
                }
                
                const responses = [
                    `¡Hola! Recibí tu mensaje: "${message}". Soy Driver AI y estoy funcionando correctamente como CHAT.`,
                    `✅ El endpoint /api/chat está funcionando! Tu mensaje: "${message}" fue procesado como CONVERSACIÓN.`,
                    `🎉 Driver AI Chat activo! Consulta "${message}" procesada correctamente. No es análisis de proteína.`,
                    `💬 Chat endpoint working! Mensaje: "${message}". Esta es una respuesta conversacional real.`
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                const response = {
                    response: randomResponse,
                    type: 'chat',
                    session_id: session_id,
                    timestamp: new Date().toISOString(),
                    service: 'Driver AI Chat Mock',
                    version: '1.0.0'
                };
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
                
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        
    } else if (path === '/api/health' && req.method === 'GET') {
        const health = {
            status: 'healthy',
            service: 'Driver AI Chat Mock',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health));
        
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

const PORT = 8001;
server.listen(PORT, () => {
    console.log('🚀 MOCK DRIVER AI CHAT SERVER');
    console.log(`📡 Listening on http://localhost:${PORT}`);
    console.log('🧪 Testing frontend chat integration');
    console.log('💬 Endpoint: POST /api/chat');
    console.log('📋 Expected format: {"message": "text", "session_id": "id"}');
    console.log('\n🎯 To test:');
    console.log('1. This mock server is running');
    console.log('2. Use the chat in http://localhost:3000');
    console.log('3. Messages should be processed as CHAT, not protein analysis');
    console.log('\n⚠️  Remember to revert proxy config when real backend is ready!');
});
