/**
 * 🚨 SOLUCIÓN EMERGENCIA - DETENER SCROLL INFINITO
 * Script para ejecutar en consola del navegador si el problema persiste
 */

console.log('🛑 DETENIENDO SCROLL INFINITO DEL CHAT');

// Función de emergencia para detener scroll loops
function stopScrollLoop() {
  // Encontrar el contenedor de mensajes
  const messagesContainer = document.querySelector('.jarvis-messages');
  
  if (messagesContainer) {
    console.log('📦 Contenedor de mensajes encontrado');
    
    // Detener temporalmente el scroll
    messagesContainer.style.overflowY = 'hidden';
    
    // Remover todos los event listeners de scroll
    const newContainer = messagesContainer.cloneNode(true);
    messagesContainer.parentNode.replaceChild(newContainer, messagesContainer);
    
    // Reactivar scroll después de 1 segundo
    setTimeout(() => {
      newContainer.style.overflowY = 'auto';
      newContainer.style.scrollBehavior = 'auto'; // Disable smooth scrolling temporarily
      console.log('✅ Scroll restaurado sin smooth behavior');
    }, 1000);
    
    return 'Scroll loop detenido temporalmente';
  }
  
  return 'No se encontró el contenedor de mensajes';
}

// Función para desactivar auto-scroll globalmente
function disableAutoScroll() {
  // Buscar todos los useEffect que causan scroll automático
  const allDivs = document.querySelectorAll('div[style*="scroll"]');
  
  allDivs.forEach(div => {
    div.style.scrollBehavior = 'auto';
    console.log('🔧 Scroll behavior cambiado a auto en:', div);
  });
  
  // Interceptar scrollIntoView calls
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function(options) {
    console.log('🚫 scrollIntoView interceptado y bloqueado');
    // No hacer nada - bloquear el scroll automático
  };
  
  return 'Auto-scroll desactivado globalmente';
}

// Función para restaurar scroll normal
function restoreNormalScroll() {
  // Restaurar scrollIntoView original
  delete Element.prototype.scrollIntoView;
  
  const messagesContainer = document.querySelector('.jarvis-messages');
  if (messagesContainer) {
    messagesContainer.style.scrollBehavior = 'smooth';
    console.log('✅ Scroll normal restaurado');
  }
  
  return 'Scroll normal restaurado';
}

// Ejecutar automáticamente la solución
console.log('🔧 Ejecutando solución automática...');
const result = stopScrollLoop();
console.log('📊 Resultado:', result);

// Exponer funciones globalmente para uso manual
window.stopScrollLoop = stopScrollLoop;
window.disableAutoScroll = disableAutoScroll;
window.restoreNormalScroll = restoreNormalScroll;

console.log(`
🎯 FUNCIONES DISPONIBLES:
- stopScrollLoop() - Detener loop de scroll temporalmente
- disableAutoScroll() - Desactivar auto-scroll completamente
- restoreNormalScroll() - Restaurar comportamiento normal

💡 INSTRUCCIONES:
1. Si el scroll sigue buggeado, ejecuta: disableAutoScroll()
2. Para restaurar después: restoreNormalScroll()
3. Para una parada de emergencia: stopScrollLoop()
`);
