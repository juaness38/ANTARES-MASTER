/**
 * 🧪 ASTROFLORA DRIVER AI - CLIENTE INTELIGENTE JARVIS
 * Cliente conversacional que detecta automáticamente intenciones
 */

class AstrofloraDriverAI {
  constructor(config = {}) {
    this.config = {
      mode: config.mode || 'jarvis',
      baseUrl: config.baseUrl || 'http://3.85.5.222:8001',
      timeoutMs: config.timeoutMs || 30000,
      retryAttempts: config.retryAttempts || 3,
      ...config
    };
    
    this.stats = {
      totalRequests: 0,
      proteinAnalyses: 0,
      conversations: 0,
      errors: 0
    };
  }

  /**
   * 🎯 Detectar intención del usuario
   */
  detectIntention(query) {
    const cleanQuery = query.toLowerCase().trim();
    
    // Detección de secuencias de proteínas
    const proteinPattern = /^[ACDEFGHIKLMNPQRSTVWY\s]+$/i;
    const hasProteinSequence = proteinPattern.test(cleanQuery.replace(/\s+/g, '')) && 
                               cleanQuery.replace(/\s+/g, '').length > 10;
    
    if (hasProteinSequence) {
      return {
        type: 'protein_analysis',
        confidence: 0.9,
        handler: 'processProteinAnalysis'
      };
    }
    
    // Detección de consultas experimentales
    const experimentKeywords = ['protocolo', 'experiment', 'pcr', 'western', 'blot', 'ensayo', 'método'];
    if (experimentKeywords.some(keyword => cleanQuery.includes(keyword))) {
      return {
        type: 'experimental_guidance',
        confidence: 0.8,
        handler: 'processExperimentalGuidance'
      };
    }
    
    // Detección de consultas de backend/estado
    const statusKeywords = ['conectado', 'backend', 'estado', 'online', 'offline', 'status'];
    if (statusKeywords.some(keyword => cleanQuery.includes(keyword))) {
      return {
        type: 'system_status',
        confidence: 0.7,
        handler: 'processSystemStatus'
      };
    }
    
    // Por defecto: conversación general
    return {
      type: 'general_conversation',
      confidence: 0.6,
      handler: 'processGeneralChat'
    };
  }

  /**
   * 🧬 Procesar análisis de proteínas
   */
  async processProteinAnalysis(query, context) {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sequence: query.replace(/\s+/g, ''),
          user_id: context.user_id,
          session_id: context.session_id
        })
      });

      if (!response.ok) {
        throw new Error(`Driver AI Error: ${response.status}`);
      }

      const data = await response.json();
      this.stats.proteinAnalyses++;

      return {
        intention: 'protein_analysis',
        message: data.analysis || 'Análisis de proteína completado',
        scientific_data: data,
        confidence: data.confidence || 0.94,
        suggestions: [
          'Ver detalles estructurales',
          'Análisis comparativo',
          'Predecir función'
        ]
      };
    } catch (error) {
      console.error('❌ Error en análisis de proteína:', error);
      return this.handleError(error, 'protein_analysis');
    }
  }

  /**
   * 🔬 Procesar guía experimental
   */
  async processExperimentalGuidance(query, context) {
    const responses = {
      pcr: 'Para PCR: 1) Diseñar primers específicos, 2) Preparar mix de reacción, 3) Programa térmico optimizado',
      western: 'Western Blot: 1) Extracción proteínas, 2) SDS-PAGE, 3) Transferencia, 4) Bloqueo, 5) Incubación anticuerpos',
      protocolo: 'Puedo ayudarte con protocolos específicos. ¿Qué tipo de experimento necesitas realizar?'
    };

    const matchedProtocol = Object.keys(responses).find(key => 
      query.toLowerCase().includes(key)
    );

    return {
      intention: 'experimental_guidance',
      message: responses[matchedProtocol] || responses.protocolo,
      suggestions: [
        'Ver protocolo completo',
        'Troubleshooting común',
        'Optimización de condiciones'
      ]
    };
  }

  /**
   * 💬 Procesar conversación general
   */
  async processGeneralChat(query, context) {
    const responses = {
      saludo: '¡Hola! Soy el asistente científico de Astroflora. ¿En qué puedo ayudarte hoy?',
      ayuda: 'Puedo ayudarte con análisis de proteínas, protocolos experimentales, y consultas científicas.',
      default: 'Entiendo tu consulta. ¿Podrías ser más específico sobre lo que necesitas?'
    };

    const saludos = ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes'];
    const ayudaWords = ['ayuda', 'help', 'qué puedes hacer'];

    let responseKey = 'default';
    if (saludos.some(word => query.toLowerCase().includes(word))) {
      responseKey = 'saludo';
    } else if (ayudaWords.some(word => query.toLowerCase().includes(word))) {
      responseKey = 'ayuda';
    }

    this.stats.conversations++;

    return {
      intention: 'general_conversation',
      message: responses[responseKey],
      suggestions: [
        'Analizar secuencia de proteína',
        'Ayuda con protocolos',
        'Estado del sistema'
      ]
    };
  }

  /**
   * 🔧 Procesar estado del sistema
   */
  async processSystemStatus(query, context) {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });

      const isOnline = response.ok;
      
      return {
        intention: 'system_status',
        message: isOnline ? 
          '✅ Driver AI Backend está conectado y funcionando correctamente' :
          '❌ Driver AI Backend no responde. Verificando conexión...',
        system_status: {
          backend_online: isOnline,
          response_time: Date.now(),
          version: '7.0'
        },
        suggestions: [
          'Probar análisis de proteína',
          'Ver estadísticas del sistema',
          'Diagnóstico completo'
        ]
      };
    } catch (error) {
      return {
        intention: 'system_status',
        message: '⚠️ No se pudo conectar con Driver AI Backend. Usando modo offline.',
        system_status: {
          backend_online: false,
          error: error.message
        },
        suggestions: [
          'Reintentar conexión',
          'Modo offline disponible',
          'Contactar soporte'
        ]
      };
    }
  }

  /**
   * 🎯 Método principal de chat
   */
  async chat(query, context = {}) {
    this.stats.totalRequests++;
    
    // Detectar intención
    const intention = this.detectIntention(query);
    
    // Procesar según intención
    try {
      const result = await this[intention.handler](query, context);
      return {
        ...result,
        intention_details: intention,
        processed_at: new Date().toISOString()
      };
    } catch (error) {
      this.stats.errors++;
      return this.handleError(error, intention.type);
    }
  }

  /**
   * ❌ Manejo de errores
   */
  handleError(error, intentionType) {
    return {
      intention: intentionType,
      message: '❌ Error procesando consulta. Usando respuesta de emergencia.',
      error: error.message,
      suggestions: [
        'Reintentar consulta',
        'Verificar conexión',
        'Usar modo básico'
      ]
    };
  }

  /**
   * 📊 Obtener estadísticas
   */
  getStats() {
    return {
      ...this.stats,
      success_rate: ((this.stats.totalRequests - this.stats.errors) / this.stats.totalRequests * 100).toFixed(1) + '%'
    };
  }
}

module.exports = { AstrofloraDriverAI };
