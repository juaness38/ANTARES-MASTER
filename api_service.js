// Servicio de API para AstroFlora Driver AI con manejo robusto de errores
class AstrofloraAPI {
  constructor() {
    this.config = window.ASTROFLORA_CONFIG || ASTROFLORA_CONFIG;
    this.baseURL = this.config.API_URL;
    this.sessionId = this.generateSessionId();
  }

  /**
   * Generar ID de sesión único
   */
  generateSessionId() {
    return `astroflora_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Verificar salud del backend con múltiples endpoints
   */
  async checkHealth() {
    const endpoints = [
      this.config.ENDPOINTS.HEALTH,
      this.config.ENDPOINTS.API_HEALTH,
      '/'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Probando endpoint: ${this.baseURL}${endpoint}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.TIMEOUT);

        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'GET',
          headers: this.config.DEFAULT_HEADERS,
          signal: controller.signal,
          mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await this.safeJsonParse(response);
          return {
            status: 'online',
            endpoint: endpoint,
            statusCode: response.status,
            data: data,
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.warn(`❌ Error en ${endpoint}:`, error.message);
        continue;
      }
    }

    return this.config.FALLBACK_RESPONSES.HEALTH_CHECK;
  }

  /**
   * Enviar mensaje al chat con manejo robusto de errores
   */
  async sendMessage(message, options = {}) {
    if (!message || typeof message !== 'string' || message.trim() === '') {
      throw new Error('Mensaje no válido');
    }

    const payload = {
      message: message.trim(),
      session_id: options.sessionId || this.sessionId,
      user_id: options.userId || 'frontend_user',
      context: options.context || 'astroflora_chat',
      timestamp: new Date().toISOString(),
      ...options.additionalData
    };

    const endpoints = [
      this.config.ENDPOINTS.CHAT,
      this.config.ENDPOINTS.API_CHAT,
      this.config.ENDPOINTS.DRIVER_AI
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
        try {
          console.log(`🚀 Enviando mensaje a ${endpoint} (intento ${attempt})`);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), this.config.TIMEOUT);

          const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: this.config.DEFAULT_HEADERS,
            body: JSON.stringify(payload),
            signal: controller.signal,
            mode: 'cors'
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await this.safeJsonParse(response);
            return this.processResponse(data, endpoint);
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

        } catch (error) {
          lastError = error;
          console.warn(`❌ Error en ${endpoint} (intento ${attempt}):`, error.message);
          
          if (attempt < this.config.RETRY_ATTEMPTS) {
            await this.delay(1000 * attempt); // Backoff exponencial
          }
        }
      }
    }

    // Si todos los endpoints fallan, devolver respuesta fallback
    return {
      ...this.config.FALLBACK_RESPONSES.CHAT_ERROR,
      originalError: lastError?.message || 'Error desconocido',
      attempts: this.config.RETRY_ATTEMPTS * endpoints.length
    };
  }

  /**
   * Procesar respuesta del backend de forma segura
   */
  processResponse(data, endpoint) {
    // Verificar que data no sea null o undefined
    if (!data || typeof data !== 'object') {
      return {
        response: 'Respuesta inválida del servidor',
        error: true,
        endpoint: endpoint,
        timestamp: new Date().toISOString()
      };
    }

    // Extraer mensaje de respuesta de diferentes formatos posibles
    let responseMessage = '';
    
    if (data.response && typeof data.response === 'string') {
      responseMessage = data.response;
    } else if (data.message && typeof data.message === 'string') {
      responseMessage = data.message;
    } else if (data.text && typeof data.text === 'string') {
      responseMessage = data.text;
    } else if (data.content && typeof data.content === 'string') {
      responseMessage = data.content;
    } else if (typeof data === 'string') {
      responseMessage = data;
    } else {
      responseMessage = JSON.stringify(data, null, 2);
    }

    return {
      response: responseMessage,
      endpoint: endpoint,
      timestamp: new Date().toISOString(),
      metadata: {
        hasError: false,
        originalData: data,
        processingSuccess: true
      }
    };
  }

  /**
   * Parse JSON de forma segura
   */
  async safeJsonParse(response) {
    try {
      const text = await response.text();
      if (!text || text.trim() === '') {
        return null;
      }
      return JSON.parse(text);
    } catch (error) {
      console.warn('Error parsing JSON:', error);
      const text = await response.text();
      return { raw_response: text };
    }
  }

  /**
   * Delay para reintentos
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtener estado de conectividad
   */
  async getConnectionStatus() {
    try {
      const health = await this.checkHealth();
      return {
        isOnline: health.status === 'online',
        lastCheck: new Date().toISOString(),
        endpoint: health.endpoint || 'none',
        details: health
      };
    } catch (error) {
      return {
        isOnline: false,
        lastCheck: new Date().toISOString(),
        error: error.message,
        details: this.config.FALLBACK_RESPONSES.HEALTH_CHECK
      };
    }
  }

  /**
   * Test de conectividad completo
   */
  async runConnectivityTest() {
    const results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    const endpoints = [
      { name: 'Health Check', endpoint: this.config.ENDPOINTS.HEALTH },
      { name: 'API Health', endpoint: this.config.ENDPOINTS.API_HEALTH },
      { name: 'Chat Endpoint', endpoint: this.config.ENDPOINTS.CHAT },
      { name: 'API Chat', endpoint: this.config.ENDPOINTS.API_CHAT }
    ];

    for (const test of endpoints) {
      results.summary.total++;
      try {
        const startTime = Date.now();
        const response = await fetch(`${this.baseURL}${test.endpoint}`, {
          method: 'GET',
          headers: this.config.DEFAULT_HEADERS,
          signal: AbortSignal.timeout(5000)
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;

        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          status: response.ok ? 'PASS' : 'FAIL',
          statusCode: response.status,
          latency: latency,
          timestamp: new Date().toISOString()
        });

        if (response.ok) results.summary.passed++;
        else results.summary.failed++;

      } catch (error) {
        results.tests.push({
          name: test.name,
          endpoint: test.endpoint,
          status: 'ERROR',
          error: error.message,
          timestamp: new Date().toISOString()
        });
        results.summary.failed++;
      }
    }

    return results;
  }
}

// Exportar para uso en diferentes entornos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AstrofloraAPI;
} else if (typeof window !== 'undefined') {
  window.AstrofloraAPI = AstrofloraAPI;
}
