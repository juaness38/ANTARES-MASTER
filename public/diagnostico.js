/**
 * 🚨 SCRIPT DE EMERGENCIA PARA EL CHAT
 * Solución radical para problemas persistentes de scroll y cierre
 */

console.log('🚨 CARGANDO SOLUCIÓN DE EMERGENCIA...');

// SOLUCIÓN RADICAL 1: REEMPLAZAR COMPLETAMENTE EL SISTEMA DE SCROLL
function solucionRadicalScroll() {
    console.log('🔧 APLICANDO SOLUCIÓN RADICAL DE SCROLL...');
    
    const container = document.querySelector('.jarvis-messages');
    if (!container) {
        console.error('❌ Container no encontrado');
        return;
    }
    
    // Eliminar TODOS los event listeners
    const newContainer = container.cloneNode(true);
    container.parentNode.replaceChild(newContainer, container);
    
    // Aplicar estilos forzados
    newContainer.style.cssText = `
        overflow-y: auto !important;
        scroll-behavior: auto !important;
        max-height: calc(100vh - 300px) !important;
        height: auto !important;
        flex: 1 !important;
        padding: 16px !important;
    `;
    
    // Función de scroll ultra simple
    window.forceScrollDown = function() {
        const cont = document.querySelector('.jarvis-messages');
        if (cont) {
            cont.scrollTop = cont.scrollHeight;
            console.log('🚀 Scroll forzado ejecutado');
        }
    };
    
    // Auto-scroll cada vez que se agrega contenido
    const observer = new MutationObserver(() => {
        setTimeout(() => {
            window.forceScrollDown();
        }, 100);
    });
    
    observer.observe(newContainer, { childList: true, subtree: true });
    
    console.log('✅ Sistema de scroll reemplazado completamente');
}

// SOLUCIÓN RADICAL 2: REEMPLAZAR COMPLETAMENTE EL INPUT
function solucionRadicalInput() {
    console.log('🔧 APLICANDO SOLUCIÓN RADICAL DE INPUT...');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) {
        console.error('❌ Textarea no encontrado');
        return;
    }
    
    // Crear nuevo textarea desde cero
    const newTextarea = document.createElement('textarea');
    newTextarea.placeholder = 'Pregunta a Jarvis (VERSIÓN EMERGENCY)...';
    newTextarea.className = textarea.className;
    newTextarea.style.cssText = `
        flex: 1 !important;
        padding: 12px 16px !important;
        background: rgb(31 41 55) !important;
        border: 1px solid rgb(75 85 99) !important;
        border-radius: 8px !important;
        color: white !important;
        resize: none !important;
        min-height: 44px !important;
        max-height: 120px !important;
        outline: none !important;
    `;
    newTextarea.rows = 1;
    
    // Event listeners ultra simples
    let currentValue = '';
    
    newTextarea.addEventListener('input', function(e) {
        currentValue = this.value;
        console.log('📝 Input value:', currentValue);
    });
    
    newTextarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (currentValue.trim()) {
                console.log('🚀 Enviando mensaje:', currentValue);
                // Llamar directamente a la función de envío
                enviarMensajeEmergencia(currentValue.trim());
                this.value = '';
                currentValue = '';
            }
        }
    });
    
    // Reemplazar el textarea
    textarea.parentNode.replaceChild(newTextarea, textarea);
    
    console.log('✅ Input reemplazado completamente');
}

// FUNCIÓN DE ENVÍO DE EMERGENCIA
function enviarMensajeEmergencia(mensaje) {
    console.log('📤 ENVIANDO MENSAJE DE EMERGENCIA:', mensaje);
    
    // Buscar el contenedor de mensajes
    const container = document.querySelector('.jarvis-messages');
    if (!container) return;
    
    // Crear mensaje del usuario
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex justify-end mb-4';
    messageDiv.innerHTML = `
        <div class="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-blue-600 text-white">
            <div class="flex items-center mb-2">
                <div class="text-lg mr-2">👤</div>
                <div class="text-sm opacity-75">Usuario (Emergency)</div>
            </div>
            <div class="whitespace-pre-wrap text-sm">${mensaje}</div>
            <div class="text-xs opacity-50 mt-2">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    
    // Scroll inmediato
    setTimeout(() => {
        window.forceScrollDown();
    }, 50);
    
    // Simular respuesta de Jarvis
    setTimeout(() => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'flex justify-start mb-4';
        responseDiv.innerHTML = `
            <div class="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700">
                <div class="flex items-center mb-2">
                    <div class="text-lg mr-2">🤖</div>
                    <div class="text-sm opacity-75">Jarvis (Emergency Mode)</div>
                </div>
                <div class="whitespace-pre-wrap text-sm">Mensaje recibido en modo de emergencia: "${mensaje}". El sistema está funcionando en modo de respaldo.</div>
                <div class="text-xs opacity-50 mt-2">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        
        container.appendChild(responseDiv);
        
        setTimeout(() => {
            window.forceScrollDown();
        }, 50);
    }, 1000);
}

// CREAR PANEL DE CONTROL DE EMERGENCIA
function crearPanelEmergencia() {
    console.log('🆘 CREANDO PANEL DE EMERGENCIA...');
    
    const panel = document.createElement('div');
    panel.id = 'emergency-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: linear-gradient(45deg, #ff4444, #ff6666);
        color: white;
        padding: 15px;
        border-radius: 10px;
        border: 2px solid #ff0000;
        box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
        font-family: monospace;
        font-size: 12px;
        max-width: 300px;
    `;
    
    panel.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
            🚨 MODO EMERGENCIA ACTIVADO 🚨
        </div>
        <div style="margin-bottom: 8px;">
            <button onclick="window.forceScrollDown()" style="width: 100%; padding: 5px; margin: 2px 0; background: #333; color: white; border: none; border-radius: 3px; cursor: pointer;">
                ⬇️ FORZAR SCROLL
            </button>
            <button onclick="solucionRadicalScroll()" style="width: 100%; padding: 5px; margin: 2px 0; background: #333; color: white; border: none; border-radius: 3px; cursor: pointer;">
                🔧 ARREGLAR SCROLL
            </button>
            <button onclick="solucionRadicalInput()" style="width: 100%; padding: 5px; margin: 2px 0; background: #333; color: white; border: none; border-radius: 3px; cursor: pointer;">
                📝 ARREGLAR INPUT
            </button>
            <button onclick="aplicarTodasLasSoluciones()" style="width: 100%; padding: 5px; margin: 2px 0; background: #ff0000; color: white; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;">
                🚀 ARREGLAR TODO
            </button>
        </div>
        <div style="font-size: 10px; text-align: center; margin-top: 10px; opacity: 0.8;">
            Si nada funciona, recarga la página
        </div>
    `;
    
    document.body.appendChild(panel);
    console.log('✅ Panel de emergencia creado');
}

// APLICAR TODAS LAS SOLUCIONES
function aplicarTodasLasSoluciones() {
    console.log('🚀 APLICANDO TODAS LAS SOLUCIONES DE EMERGENCIA...');
    
    solucionRadicalScroll();
    setTimeout(() => {
        solucionRadicalInput();
    }, 500);
    
    setTimeout(() => {
        console.log('✅ TODAS LAS SOLUCIONES APLICADAS');
        console.log('🎯 Prueba escribir un mensaje ahora');
    }, 1000);
}

// HACER FUNCIONES GLOBALES
window.solucionRadicalScroll = solucionRadicalScroll;
window.solucionRadicalInput = solucionRadicalInput;
window.enviarMensajeEmergencia = enviarMensajeEmergencia;
window.aplicarTodasLasSoluciones = aplicarTodasLasSoluciones;

// AUTO-EJECUTAR
setTimeout(() => {
    crearPanelEmergencia();
    console.log('🆘 MODO EMERGENCIA LISTO');
    console.log('🎯 Usa el panel rojo en la esquina superior derecha');
}, 1000);
