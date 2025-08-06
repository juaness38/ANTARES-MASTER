/**
 * 🧪 PRUEBA FINAL - VERIFICACIÓN DE LOS DOS PROBLEMAS ESPECÍFICOS
 * Para ejecutar en la consola del navegador
 */

console.log('🧪 PRUEBA FINAL - Verificando los dos problemas específicos...');

// PROBLEMA 1: Scroll que se queda crasheado arriba
function probarScrollCrasheado() {
    console.log('\n🔍 PROBLEMA 1: Scroll crasheado arriba');
    
    const container = document.querySelector('.jarvis-messages');
    if (!container) {
        console.error('❌ No se encontró el contenedor de mensajes');
        return false;
    }
    
    console.log('📊 Estado inicial del scroll:', {
        scrollTop: container.scrollTop,
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight
    });
    
    // Intentar scroll hacia arriba (simular el problema)
    console.log('⬆️ Simulando scroll hacia arriba...');
    container.scrollTop = 0;
    
    setTimeout(() => {
        console.log('📍 Después de scroll arriba:', {
            scrollTop: container.scrollTop,
            scrollHeight: container.scrollHeight
        });
        
        // Intentar scroll al final
        console.log('⬇️ Intentando volver al final...');
        container.scrollTop = container.scrollHeight;
        
        setTimeout(() => {
            const finalPosition = container.scrollTop;
            const maxScroll = container.scrollHeight - container.clientHeight;
            const scrolledCorrectly = finalPosition >= maxScroll - 10;
            
            console.log('📊 Resultado final:', {
                finalPosition,
                maxScroll,
                scrolledCorrectly,
                status: scrolledCorrectly ? '✅ SCROLL FUNCIONA' : '❌ SCROLL CRASHEADO'
            });
            
            return scrolledCorrectly;
        }, 500);
    }, 500);
}

// PROBLEMA 2: Chat se cierra después de escribir una palabra
function probarChatSeCierra() {
    console.log('\n🔍 PROBLEMA 2: Chat se cierra al escribir');
    
    const textarea = document.querySelector('textarea');
    if (!textarea) {
        console.error('❌ No se encontró el textarea');
        return false;
    }
    
    console.log('📝 Estado inicial del textarea:', {
        disabled: textarea.disabled,
        value: textarea.value,
        focused: document.activeElement === textarea
    });
    
    // Simular escritura de múltiples palabras
    console.log('✍️ Simulando escritura palabra por palabra...');
    
    const palabras = ['primera', 'segunda', 'tercera', 'cuarta', 'quinta'];
    let problemaDetectado = false;
    
    const escribirPalabras = async () => {
        for (let i = 0; i < palabras.length; i++) {
            // Enfocar antes de escribir
            textarea.focus();
            
            const textoCompleto = palabras.slice(0, i + 1).join(' ');
            textarea.value = textoCompleto;
            
            // Disparar evento input
            const inputEvent = new Event('input', { bubbles: true });
            textarea.dispatchEvent(inputEvent);
            
            // Verificar si sigue enfocado
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const aEnfocado = document.activeElement === textarea;
            console.log(`📝 Palabra ${i + 1} (${palabras[i]}): Texto="${textoCompleto}", Enfocado=${aEnfocado}`);
            
            if (!aEnfocado) {
                console.error(`❌ PROBLEMA DETECTADO: Perdió el foco en la palabra ${i + 1}`);
                problemaDetectado = true;
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (!problemaDetectado) {
            console.log('✅ CHAT NO SE CIERRA - Problema resuelto');
        }
        
        return !problemaDetectado;
    };
    
    return escribirPalabras();
}

// APLICAR SOLUCIÓN DE EMERGENCIA SI LOS PROBLEMAS PERSISTEN
function aplicarSolucionEmergencia() {
    console.log('\n🚨 APLICANDO SOLUCIÓN DE EMERGENCIA...');
    
    // Cargar script de emergencia
    if (!document.getElementById('script-emergencia')) {
        const script = document.createElement('script');
        script.id = 'script-emergencia';
        script.src = '/diagnostico.js';
        script.onload = () => {
            console.log('✅ Script de emergencia cargado');
            if (window.aplicarTodasLasSoluciones) {
                setTimeout(() => {
                    window.aplicarTodasLasSoluciones();
                }, 1000);
            }
        };
        document.head.appendChild(script);
    }
}

// EJECUTAR PRUEBAS COMPLETAS
async function ejecutarPruebasCompletas() {
    console.log('🚀 EJECUTANDO PRUEBAS COMPLETAS...');
    
    // Esperar un momento para que el DOM esté listo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prueba 1: Scroll
    console.log('\n=== PRUEBA 1: SCROLL ===');
    probarScrollCrasheado();
    
    // Esperar antes de la segunda prueba
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Prueba 2: Input
    console.log('\n=== PRUEBA 2: INPUT ===');
    const inputFunciona = await probarChatSeCierra();
    
    // Evaluación final
    setTimeout(() => {
        console.log('\n📊 EVALUACIÓN FINAL:');
        console.log('1. Scroll: Verificar visualmente si funciona');
        console.log('2. Input:', inputFunciona ? '✅ FUNCIONA' : '❌ PROBLEMA PERSISTE');
        
        if (!inputFunciona) {
            console.log('\n🚨 ACTIVANDO SOLUCIÓN DE EMERGENCIA...');
            aplicarSolucionEmergencia();
        } else {
            console.log('\n✅ CHAT FUNCIONANDO CORRECTAMENTE');
        }
    }, 3000);
}

// Hacer funciones disponibles globalmente
window.pruebaFinal = {
    probarScrollCrasheado,
    probarChatSeCierra,
    aplicarSolucionEmergencia,
    ejecutarPruebasCompletas
};

console.log('✅ Prueba final lista');
console.log('🎯 Ejecuta: window.pruebaFinal.ejecutarPruebasCompletas()');

// Auto-ejecutar
setTimeout(() => {
    ejecutarPruebasCompletas();
}, 2000);
