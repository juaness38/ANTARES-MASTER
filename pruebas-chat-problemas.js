/**
 * 🧪 SCRIPT DE PRUEBA ESPECÍFICO PARA LOS PROBLEMAS DEL CHAT
 * Para copiar y pegar en la consola del navegador
 */

console.log('🧪 INICIANDO PRUEBAS ESPECÍFICAS DEL CHAT...');

// PRUEBA 1: Problema de scroll que se queda arriba
function probarScrollProblema() {
    console.log('\n🔍 PRUEBA 1: Problema de scroll');
    
    const container = document.querySelector('.jarvis-messages');
    if (!container) {
        console.error('❌ No se encontró el contenedor de mensajes');
        return;
    }
    
    console.log('📊 Estado inicial:', {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight
    });
    
    // Intentar scroll manual
    console.log('⬇️ Intentando scroll manual...');
    container.scrollTop = container.scrollHeight;
    
    setTimeout(() => {
        console.log('📊 Estado después del scroll:', {
            scrollTop: container.scrollTop,
            scrollHeight: container.scrollHeight,
            clientHeight: container.clientHeight,
            scrolledToBottom: container.scrollTop >= (container.scrollHeight - container.clientHeight - 1)
        });
        
        if (container.scrollTop < (container.scrollHeight - container.clientHeight - 10)) {
            console.warn('⚠️ PROBLEMA DETECTADO: El scroll no llegó al final');
            aplicarSolucionScroll();
        } else {
            console.log('✅ Scroll funcionando correctamente');
        }
    }, 500);
}

// PRUEBA 2: Problema del input que se cierra
function probarInputProblema() {
    console.log('\n🔍 PRUEBA 2: Problema del input que se cierra');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) {
        console.error('❌ No se encontró el textarea');
        return;
    }
    
    console.log('📝 Estado inicial del textarea:', {
        disabled: textarea.disabled,
        value: textarea.value,
        focused: document.activeElement === textarea
    });
    
    // Simular escritura
    console.log('✍️ Simulando escritura de varias palabras...');
    
    // Enfocar el textarea
    textarea.focus();
    
    // Simular escritura palabra por palabra
    const palabras = ['hola', 'jarvis', 'como', 'estas'];
    let indice = 0;
    
    const escribirPalabra = () => {
        if (indice < palabras.length) {
            textarea.value = palabras.slice(0, indice + 1).join(' ');
            
            // Disparar evento de cambio
            const event = new Event('input', { bubbles: true });
            textarea.dispatchEvent(event);
            
            console.log(`📝 Palabra ${indice + 1}: "${textarea.value}"`);
            console.log(`📍 Textarea aún enfocado: ${document.activeElement === textarea}`);
            
            indice++;
            setTimeout(escribirPalabra, 1000);
        } else {
            console.log('✅ Prueba de escritura completada');
            
            if (document.activeElement !== textarea) {
                console.warn('⚠️ PROBLEMA DETECTADO: El textarea perdió el foco');
                aplicarSolucionInput();
            } else {
                console.log('✅ Input funcionando correctamente');
            }
        }
    };
    
    escribirPalabra();
}

// SOLUCIÓN PARA EL SCROLL
function aplicarSolucionScroll() {
    console.log('\n🔧 APLICANDO SOLUCIÓN PARA EL SCROLL...');
    
    const container = document.querySelector('.jarvis-messages');
    if (!container) return;
    
    // Eliminar todos los event listeners de scroll
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);
    
    // Aplicar estilos forzados
    newContainer.style.overflowY = 'scroll';
    newContainer.style.scrollBehavior = 'auto';
    
    // Función de scroll simple
    window.scrollChatToBottom = function() {
        const cont = document.querySelector('.jarvis-messages');
        if (cont) {
            cont.scrollTop = cont.scrollHeight;
            console.log('🚀 Scroll forzado ejecutado');
        }
    };
    
    console.log('✅ Solución de scroll aplicada. Usa scrollChatToBottom() para probar');
}

// SOLUCIÓN PARA EL INPUT
function aplicarSolucionInput() {
    console.log('\n🔧 APLICANDO SOLUCIÓN PARA EL INPUT...');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    // Eliminar todos los event listeners
    const newTextarea = textarea.cloneNode(true);
    textarea.parentNode.replaceChild(newTextarea, textarea);
    
    // Agregar event listener simple y robusto
    newTextarea.addEventListener('input', function(e) {
        // No hacer nada especial, solo mantener el foco
        console.log('📝 Input detectado:', this.value);
    });
    
    newTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('🚀 Enter presionado, enviando mensaje');
            
            // Encontrar y disparar el form
            const form = this.closest('form');
            if (form) {
                const submitEvent = new Event('submit', { bubbles: true });
                form.dispatchEvent(submitEvent);
            }
        }
    });
    
    // Asegurar que mantenga el foco
    newTextarea.addEventListener('blur', function(e) {
        console.log('⚠️ Textarea perdió el foco, recuperándolo...');
        setTimeout(() => {
            this.focus();
        }, 10);
    });
    
    console.log('✅ Solución de input aplicada');
}

// EJECUTAR TODAS LAS PRUEBAS
function ejecutarTodasLasPruebas() {
    console.log('🧪 EJECUTANDO TODAS LAS PRUEBAS...');
    
    probarScrollProblema();
    
    setTimeout(() => {
        probarInputProblema();
    }, 2000);
    
    // Crear botón de diagnóstico permanente
    if (!document.getElementById('boton-diagnostico')) {
        const btn = document.createElement('button');
        btn.id = 'boton-diagnostico';
        btn.innerHTML = '🧪 DIAGNÓSTICO';
        btn.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            z-index: 9999;
            background: #00ff00;
            color: black;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        `;
        
        btn.onclick = ejecutarTodasLasPruebas;
        document.body.appendChild(btn);
    }
}

// Hacer funciones disponibles globalmente
window.pruebasChat = {
    probarScrollProblema,
    probarInputProblema,
    aplicarSolucionScroll,
    aplicarSolucionInput,
    ejecutarTodasLasPruebas,
    scrollChatToBottom: () => {
        const cont = document.querySelector('.jarvis-messages');
        if (cont) {
            cont.scrollTop = cont.scrollHeight;
            console.log('🚀 Scroll manual ejecutado');
        }
    }
};

console.log('✅ Script de pruebas cargado');
console.log('🎯 Usa window.pruebasChat.ejecutarTodasLasPruebas() para comenzar');

// Auto-ejecutar si no hay problemas detectados
setTimeout(ejecutarTodasLasPruebas, 1000);
