/**
 * 🚨 DIAGNÓSTICO INTERACTIVO DEL CHAT DE JARVIS
 * Script para detectar y solucionar problemas específicos de scroll y cierre
 */

console.log('🔍 INICIANDO DIAGNÓSTICO DEL CHAT DE JARVIS...');

// 1. VERIFICAR ELEMENTOS DEL CHAT
function verificarElementosChat() {
    console.log('\n📋 1. VERIFICANDO ELEMENTOS DEL CHAT...');
    
    const chatContainer = document.querySelector('.jarvis-chat-container');
    const messagesContainer = document.querySelector('.jarvis-messages');
    const inputElement = document.querySelector('textarea');
    const submitButton = document.querySelector('button[type="submit"]');
    
    console.log({
        chatContainer: !!chatContainer,
        messagesContainer: !!messagesContainer,
        inputElement: !!inputElement,
        submitButton: !!submitButton
    });
    
    if (messagesContainer) {
        console.log('📏 Dimensiones del contenedor de mensajes:', {
            scrollHeight: messagesContainer.scrollHeight,
            clientHeight: messagesContainer.clientHeight,
            scrollTop: messagesContainer.scrollTop
        });
    }
    
    return { chatContainer, messagesContainer, inputElement, submitButton };
}

// 2. PROBAR COMPORTAMIENTO DEL SCROLL
function probarScroll(messagesContainer) {
    console.log('\n🔄 2. PROBANDO COMPORTAMIENTO DEL SCROLL...');
    
    if (!messagesContainer) {
        console.error('❌ No se encontró el contenedor de mensajes');
        return;
    }
    
    // Probar scroll al final
    console.log('⬇️ Intentando scroll al final...');
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        console.log('📍 Posición después del scroll:', {
            scrollTop: messagesContainer.scrollTop,
            scrollHeight: messagesContainer.scrollHeight,
            clientHeight: messagesContainer.clientHeight,
            distanciaDelFinal: messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight
        });
    }, 1000);
}

// 3. PROBAR FUNCIONALIDAD DEL INPUT
function probarInput(inputElement) {
    console.log('\n⌨️ 3. PROBANDO FUNCIONALIDAD DEL INPUT...');
    
    if (!inputElement) {
        console.error('❌ No se encontró el elemento input');
        return;
    }
    
    console.log('📝 Estado del input:', {
        disabled: inputElement.disabled,
        value: inputElement.value,
        placeholder: inputElement.placeholder
    });
    
    // Simular escritura
    console.log('✍️ Simulando escritura...');
    inputElement.focus();
    inputElement.value = 'Mensaje de prueba';
    
    // Disparar evento de cambio
    const changeEvent = new Event('change', { bubbles: true });
    inputElement.dispatchEvent(changeEvent);
    
    setTimeout(() => {
        console.log('📤 Valor después de la simulación:', inputElement.value);
    }, 500);
}

// 4. VERIFICAR EVENT LISTENERS
function verificarEventListeners() {
    console.log('\n🎯 4. VERIFICANDO EVENT LISTENERS...');
    
    const elementos = [
        '.jarvis-chat-container',
        '.jarvis-messages',
        'textarea',
        'form'
    ];
    
    elementos.forEach(selector => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            console.log(`✅ ${selector}: Encontrado`);
            
            // Verificar si tiene event listeners problemáticos
            const rect = elemento.getBoundingClientRect();
            console.log(`   Dimensiones: ${rect.width}x${rect.height}`);
            console.log(`   Z-index: ${getComputedStyle(elemento).zIndex}`);
        } else {
            console.log(`❌ ${selector}: No encontrado`);
        }
    });
}

// 5. APLICAR SOLUCIÓN DIRECTA
function aplicarSolucionDirecta() {
    console.log('\n🔧 5. APLICANDO SOLUCIÓN DIRECTA...');
    
    // Forzar estabilidad del scroll
    const messagesContainer = document.querySelector('.jarvis-messages');
    if (messagesContainer) {
        console.log('🔄 Forzando estabilidad del scroll...');
        
        // Eliminar cualquier event listener problemático
        messagesContainer.onscroll = null;
        
        // Aplicar estilo directo
        messagesContainer.style.overflowY = 'auto';
        messagesContainer.style.scrollBehavior = 'smooth';
        messagesContainer.style.height = 'auto';
        messagesContainer.style.maxHeight = 'calc(100vh - 300px)';
        
        // Función de scroll simple y directa
        window.scrollToBottom = function() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };
        
        console.log('✅ Función scrollToBottom() disponible globalmente');
    }
    
    // Estabilizar el input
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
        console.log('📝 Estabilizando input...');
        
        // Eliminar event listeners problemáticos
        inputElement.onkeydown = null;
        inputElement.onchange = null;
        
        // Aplicar event listener simple
        inputElement.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const form = this.closest('form');
                if (form) {
                    form.dispatchEvent(new Event('submit', { bubbles: true }));
                }
            }
        });
        
        console.log('✅ Input estabilizado con event listener simple');
    }
    
    // Crear botón de emergencia para scroll
    if (!document.getElementById('emergency-scroll-btn')) {
        const emergencyBtn = document.createElement('button');
        emergencyBtn.id = 'emergency-scroll-btn';
        emergencyBtn.innerHTML = '⬇️ SCROLL FORZADO';
        emergencyBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #ff4444;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        emergencyBtn.onclick = function() {
            const container = document.querySelector('.jarvis-messages');
            if (container) {
                container.scrollTop = container.scrollHeight;
                console.log('🚀 Scroll forzado ejecutado');
            }
        };
        
        document.body.appendChild(emergencyBtn);
        console.log('🆘 Botón de emergencia agregado');
    }
}

// EJECUTAR DIAGNÓSTICO COMPLETO
function ejecutarDiagnostico() {
    const elementos = verificarElementosChat();
    probarScroll(elementos.messagesContainer);
    probarInput(elementos.inputElement);
    verificarEventListeners();
    aplicarSolucionDirecta();
    
    console.log('\n✅ DIAGNÓSTICO COMPLETADO');
    console.log('🔧 Prueba las siguientes funciones:');
    console.log('   - scrollToBottom() para forzar scroll');
    console.log('   - Botón rojo de emergencia en la esquina');
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ejecutarDiagnostico);
} else {
    ejecutarDiagnostico();
}

// Hacer funciones disponibles globalmente
window.diagnosticoChat = {
    verificarElementosChat,
    probarScroll,
    probarInput,
    verificarEventListeners,
    aplicarSolucionDirecta,
    ejecutarDiagnostico
};

console.log('🎯 Script de diagnóstico cargado. Usa window.diagnosticoChat para acceder a las funciones.');
