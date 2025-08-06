/**
 * 🧪 SCRIPT DE PRUEBA RÁPIDA - FRONTEND + BACKEND
 * Verifica la conectividad completa desde la consola del navegador
 */

console.log('🚀 Iniciando pruebas de conectividad ANTARES...')

// Test 1: Salud del backend
async function testBackendHealth() {
  try {
    console.log('🔍 Probando salud del backend...')
    const response = await fetch('http://3.85.5.222:8001/api/health')
    const data = await response.json()
    console.log('✅ Backend HEALTH:', data)
    return true
  } catch (error) {
    console.error('❌ Error de salud:', error)
    return false
  }
}

// Test 2: Chat directo
async function testBackendChat() {
  try {
    console.log('💬 Probando chat del backend...')
    const response = await fetch('http://3.85.5.222:8001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: '¿Qué puedes hacer por mí?',
        session_id: `test_${Date.now()}`
      })
    })
    
    const data = await response.json()
    console.log('✅ Backend CHAT:', data)
    return true
  } catch (error) {
    console.error('❌ Error de chat:', error)
    return false
  }
}

// Test 3: API service del frontend
async function testFrontendAPI() {
  try {
    console.log('🌐 Probando API service del frontend...')
    
    // Importar dinámicamente el módulo
    const { default: api } = await import('/src/services/api.js')
    
    const healthStatus = await api.getHealthStatus()
    console.log('✅ Frontend API Health:', healthStatus)
    
    const chatResponse = await api.processChat('¿Funciona la conexión?')
    console.log('✅ Frontend API Chat:', chatResponse)
    
    return true
  } catch (error) {
    console.error('❌ Error de API frontend:', error)
    return false
  }
}

// Test 4: Chat service completo
async function testChatService() {
  try {
    console.log('🤖 Probando chat service completo...')
    
    const { default: chatService } = await import('/src/services/chatService.js')
    
    const response = await chatService.processMessage('Hola Astroflora, ¿todo bien?')
    console.log('✅ Chat Service:', response)
    
    return true
  } catch (error) {
    console.error('❌ Error de chat service:', error)
    return false
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('\n🎯 === PRUEBAS DE CONECTIVIDAD ANTARES === 🎯\n')
  
  const results = {
    backendHealth: await testBackendHealth(),
    backendChat: await testBackendChat(),
    frontendAPI: await testFrontendAPI(),
    chatService: await testChatService()
  }
  
  console.log('\n📊 === RESULTADOS === 📊')
  console.log('Backend Health:', results.backendHealth ? '✅' : '❌')
  console.log('Backend Chat:', results.backendChat ? '✅' : '❌')
  console.log('Frontend API:', results.frontendAPI ? '✅' : '❌')
  console.log('Chat Service:', results.chatService ? '✅' : '❌')
  
  const allPassed = Object.values(results).every(result => result)
  
  if (allPassed) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El chat debería funcionar perfectamente.')
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.')
  }
  
  return results
}

// Auto-ejecutar si está en el navegador
if (typeof window !== 'undefined') {
  runAllTests()
}

// Exportar para uso manual
window.antaresTesting = {
  testBackendHealth,
  testBackendChat, 
  testFrontendAPI,
  testChatService,
  runAllTests
}
