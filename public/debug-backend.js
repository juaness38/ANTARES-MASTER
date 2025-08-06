// Debug script para interceptar la respuesta real
const testBackend = async () => {
  try {
    console.log('🔍 Probando backend directo...');
    
    const response = await fetch('http://localhost:3000/api/driver/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: 'DEBUG: ¿Puedes procesar este mensaje específico?',
        session_id: 'debug_copilot_' + Date.now()
      })
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📦 Respuesta completa del backend:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    return null;
  }
};

console.log('🧪 Ejecuta testBackend() en la consola para debug');
window.testBackend = testBackend;
