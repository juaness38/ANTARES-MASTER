// Configuración del frontend para conectar con el backend de AstroFlora
const ASTROFLORA_CONFIG = {
  API_URL: 'http://3.85.5.222:8001',
  ENDPOINTS: {
    CHAT: '/chat',
    HEALTH: '/health',
    DRIVER_AI: '/driver-ai',
    API_CHAT: '/api/chat',
    API_HEALTH: '/api/health'
  },
  TIMEOUT: 15000, // 15 segundos
  RETRY_ATTEMPTS: 3,
  DEFAULT_SESSION_ID: 'astroflora_frontend_session',
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  
  // Configuración de respuestas fallback
  FALLBACK_RESPONSES: {
    HEALTH_CHECK: { status: 'offline', message: 'Backend no disponible' },
    CHAT_ERROR: { 
      response: 'Lo siento, hay un problema de conectividad con el backend. El equipo técnico ha sido notificado.',
      error: true,
      timestamp: new Date().toISOString()
    }
  }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ASTROFLORA_CONFIG;
} else if (typeof window !== 'undefined') {
  window.ASTROFLORA_CONFIG = ASTROFLORA_CONFIG;
}
