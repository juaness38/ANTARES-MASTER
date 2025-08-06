// Test simple para verificar que el cliente funciona
console.log('🧪 Probando cliente Driver AI...');

// Simular lo que hace el ChatPanel
window.testDriverAI = async function() {
  try {
    const { jarvisClient } = await import('/src/../lib/jarvis-client.ts');
    
    console.log('🤖 Cliente importado exitosamente');
    
    // Probar conversación simple
    console.log('💬 Probando: "hola driver"');
    const response = await jarvisClient.process('hola driver');
    console.log('✅ Respuesta:', response);
    
    return response;
  } catch (error) {
    console.error('❌ Error:', error);
    return { error: error.message };
  }
};

console.log('✅ Test cargado. Ejecuta testDriverAI() en la consola del navegador');
