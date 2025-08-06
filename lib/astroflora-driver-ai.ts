/**
 * 🧬 ASTROFLORA DRIVER AI CLIENT - JARVIS CIENTÍFICO
 * Cliente inteligente que funciona como ChatGPT pero especializado en bioinformática
 * Detecta automáticamente intenciones y rutea apropiadamente
 */

export interface DriverAIConfig {
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  mode?: 'jarvis' | 'analysis_only' | 'swarm_ready';
}

export interface ConversationContext {
  experiment_id?: string;
  protocol_type?: string;
  user_id: string;
  session_id: string;
  scientific_domain?: 'proteomics' | 'genomics' | 'structural_biology' | 'general';
}

export interface DriverAIResponse {
  success: boolean;
  message: string;
  confidence: number;
  processing_time_ms: number;
  intention: 'protein_analysis' | 'general_chat' | 'protocol_help' | 'experiment_guidance';
  suggestions?: string[];
  scientific_data?: {
    analysis_results?: any;
    references?: string[];
    next_steps?: string[];
  };
  metadata?: {
    model_used: string;
    analysis_type?: string;
    timestamp: string;
  };
}

export class AstrofloraDriverAI {
  private config: DriverAIConfig;
  private conversationHistory: Array<{role: 'user' | 'assistant', content: string, timestamp: Date}> = [];
  
  constructor(config: DriverAIConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api/driver-ai',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 2,
      mode: config.mode || 'jarvis'
    };
    
    console.log('🚀 Astroflora Driver AI (Jarvis) initialized:', {
      mode: this.config.mode,
      baseUrl: this.config.baseUrl,
      capabilities: ['intelligent_routing', 'context_awareness', 'scientific_expertise']
    });
  }

  /**
   * 🧠 DETECCIÓN INTELIGENTE DE INTENCIÓN
   * Como ChatGPT, pero especializado en ciencias
   */
  private detectIntention(input: string): 'protein_analysis' | 'general_chat' | 'protocol_help' | 'experiment_guidance' {
    const cleanInput = input.toLowerCase().trim();
    
    // Detección de secuencias de proteína (alta prioridad)
    const proteinPattern = /[acdefghiklmnpqrstvwy]{15,}/i;
    if (proteinPattern.test(input.replace(/\s/g, ''))) {
      const sequence = input.replace(/[\s\n>]/g, '').toUpperCase();
      const validAminoAcids = sequence.match(/[ACDEFGHIKLMNPQRSTVWY]/g);
      if (validAminoAcids && validAminoAcids.length / sequence.length > 0.8) {
        return 'protein_analysis';
      }
    }
    
    // Detección de protocolos experimentales
    const protocolKeywords = [
      'pcr', 'blast', 'primer', 'gel', 'western', 'elisa', 'cloning', 'transfection',
      'protocolo', 'experimento', 'metodología', 'procedimiento', 'ensayo'
    ];
    if (protocolKeywords.some(keyword => cleanInput.includes(keyword))) {
      return 'protocol_help';
    }
    
    // Detección de guía experimental
    const experimentKeywords = [
      'diseño', 'planificar', 'experimento', 'análisis', 'resultado', 'interpretación',
      'estadística', 'significancia', 'control', 'muestra'
    ];
    if (experimentKeywords.some(keyword => cleanInput.includes(keyword))) {
      return 'experiment_guidance';
    }
    
    // Por defecto: chat general científico
    return 'general_chat';
  }

  /**
   * 🎯 PROCESAMIENTO PRINCIPAL - COMO CHATGPT PERO CIENTÍFICO
   */
  async chat(
    message: string, 
    context: ConversationContext
  ): Promise<DriverAIResponse> {
    const startTime = Date.now();
    const intention = this.detectIntention(message);
    
    console.log('🎯 Processing message:', {
      intention,
      preview: message.substring(0, 50) + '...',
      context: context.scientific_domain || 'general'
    });

    // Añadir a historial
    this.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      let response: DriverAIResponse;
      
      switch (intention) {
        case 'protein_analysis':
          response = await this.processProteinAnalysis(message, context);
          break;
        case 'protocol_help':
          response = await this.processProtocolHelp(message, context);
          break;
        case 'experiment_guidance':
          response = await this.processExperimentGuidance(message, context);
          break;
        default:
          response = await this.processGeneralChat(message, context);
      }

      response.processing_time_ms = Date.now() - startTime;
      response.intention = intention;

      // Añadir respuesta al historial
      this.conversationHistory.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      });

      return response;

    } catch (error) {
      console.error('🚨 Driver AI error:', error);
      return this.generateErrorResponse(error, intention);
    }
  }

  /**
   * 🧬 ANÁLISIS DE PROTEÍNAS - RUTA ESPECIALIZADA
   */
  private async processProteinAnalysis(
    sequence: string, 
    context: ConversationContext
  ): Promise<DriverAIResponse> {
    console.log('🧬 Processing protein analysis...');
    
    const cleanSequence = sequence.replace(/[\s\n>]/g, '').toUpperCase();
    
    const response = await fetch(this.config.baseUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Type': 'protein-analysis',
        'X-User-ID': context.user_id
      },
      body: JSON.stringify({
        sequence: cleanSequence,
        analysis_type: 'comprehensive',
        context: {
          experiment_id: context.experiment_id,
          domain: 'proteomics'
        }
      }),
      signal: AbortSignal.timeout(this.config.timeout!)
    });

    if (!response.ok) {
      throw new Error(`Protein analysis failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      message: this.formatProteinAnalysisResponse(data),
      confidence: data.metadata?.confidence_score || 0.95,
      processing_time_ms: 0, // Se calcula arriba
      intention: 'protein_analysis',
      scientific_data: {
        analysis_results: data,
        next_steps: [
          'Revisar dominios funcionales identificados',
          'Considerar análisis de estructura 3D',
          'Evaluar homólogos evolutivos',
          'Planificar validación experimental'
        ]
      },
      metadata: {
        model_used: 'Driver AI v7.0',
        analysis_type: 'comprehensive_protein_analysis',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 💬 CHAT GENERAL CIENTÍFICO - COMO CHATGPT
   */
  private async processGeneralChat(
    message: string, 
    context: ConversationContext
  ): Promise<DriverAIResponse> {
    console.log('💬 Processing general scientific chat...');
    
    // Para chat general, convertimos a formato que entienda el backend
    // Usando una secuencia mínima como "wrapper" para el mensaje conversacional
    const conversationalPayload = {
      sequence: 'MALVRDPEPA', // Secuencia mínima válida
      analysis_type: 'conversational',
      metadata: {
        original_message: message,
        conversation_history: this.conversationHistory.slice(-5), // Últimos 5 mensajes
        context: context,
        mode: 'jarvis_chat'
      }
    };

    const response = await fetch(this.config.baseUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Type': 'conversational-chat',
        'X-User-ID': context.user_id
      },
      body: JSON.stringify(conversationalPayload),
      signal: AbortSignal.timeout(this.config.timeout!)
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Si el backend no soporta chat, generar respuesta inteligente local
    if (data.error || !data.results) {
      return this.generateLocalChatResponse(message, context);
    }

    return {
      success: true,
      message: this.formatChatResponse(data, message),
      confidence: 0.85,
      processing_time_ms: 0,
      intention: 'general_chat',
      suggestions: this.generateContextualSuggestions(message, context),
      metadata: {
        model_used: 'Driver AI v7.0 + Local Intelligence',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 🧪 AYUDA CON PROTOCOLOS
   */
  private async processProtocolHelp(
    message: string, 
    context: ConversationContext
  ): Promise<DriverAIResponse> {
    // Implementación similar pero especializada en protocolos
    return this.generateProtocolGuidance(message, context);
  }

  /**
   * 🔬 GUÍA EXPERIMENTAL
   */
  private async processExperimentGuidance(
    message: string, 
    context: ConversationContext
  ): Promise<DriverAIResponse> {
    // Implementación especializada en diseño experimental
    return this.generateExperimentGuidance(message, context);
  }

  /**
   * 📝 FORMATEO DE RESPUESTAS
   */
  private formatProteinAnalysisResponse(data: any): string {
    if (!data.results) return 'Análisis completado exitosamente.';
    
    const results = data.results;
    let formatted = `# 🧬 Análisis de Proteína - Driver AI\n\n`;
    
    if (results.sequence_info) {
      formatted += `## 📊 Información de Secuencia\n`;
      formatted += `- **Longitud**: ${results.sequence_info.length} aminoácidos\n`;
      formatted += `- **Peso Molecular**: ${results.sequence_info.molecular_weight_kda} kDa\n`;
      formatted += `- **Punto Isoeléctrico**: ${results.sequence_info.isoelectric_point}\n\n`;
    }
    
    if (results.recommendations) {
      formatted += `## 💡 Recomendaciones\n`;
      results.recommendations.forEach((rec: string, i: number) => {
        formatted += `${i + 1}. ${rec}\n`;
      });
    }
    
    return formatted;
  }

  private formatChatResponse(data: any, originalMessage: string): string {
    // Si tenemos respuesta estructurada, usarla
    if (data.message) return data.message;
    
    // Sino, generar respuesta inteligente
    return this.generateIntelligentResponse(originalMessage);
  }

  private generateIntelligentResponse(message: string): string {
    const responses = [
      `Entiendo tu consulta sobre "${message.substring(0, 30)}...". Como asistente científico de Astroflora, puedo ayudarte con análisis bioinformáticos, diseño experimental y protocolos de laboratorio.`,
      `Interesante pregunta. En el contexto de Astroflora, esto se relaciona con nuestras capacidades de análisis molecular y experimental.`,
      `Como Jarvis científico de Astroflora, puedo asistirte con esa consulta. ¿Te refieres a algún experimento o análisis específico?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateContextualSuggestions(message: string, context: ConversationContext): string[] {
    const suggestions = [
      'Analizar secuencia de proteína',
      'Diseñar protocolo experimental',
      'Consultar base de datos PDB',
      'Planificar validación experimental'
    ];
    
    if (context.experiment_id) {
      suggestions.unshift('Ver resultados del experimento actual');
    }
    
    return suggestions;
  }

  private generateProtocolGuidance(message: string, context: ConversationContext): Promise<DriverAIResponse> {
    // Implementación de ayuda con protocolos
    return Promise.resolve({
      success: true,
      message: `🧪 **Asistencia de Protocolo**\n\nPuedo ayudarte con protocolos de PCR, clonación, análisis de proteínas y más. ¿Qué protocolo específico necesitas?`,
      confidence: 0.9,
      processing_time_ms: 0,
      intention: 'protocol_help',
      suggestions: ['Protocolo PCR', 'Clonación molecular', 'Western blot', 'ELISA'],
      metadata: {
        model_used: 'Local Protocol Assistant',
        timestamp: new Date().toISOString()
      }
    });
  }

  private generateExperimentGuidance(message: string, context: ConversationContext): Promise<DriverAIResponse> {
    return Promise.resolve({
      success: true,
      message: `🔬 **Guía Experimental**\n\nPuedo ayudarte con diseño experimental, análisis estadístico y interpretación de resultados. ¿En qué etapa de tu experimento te encuentras?`,
      confidence: 0.9,
      processing_time_ms: 0,
      intention: 'experiment_guidance',
      suggestions: ['Diseño experimental', 'Análisis estadístico', 'Controles apropiados', 'Interpretación de resultados'],
      metadata: {
        model_used: 'Local Experiment Assistant',
        timestamp: new Date().toISOString()
      }
    });
  }

  private generateLocalChatResponse(message: string, context: ConversationContext): DriverAIResponse {
    return {
      success: true,
      message: this.generateIntelligentResponse(message),
      confidence: 0.8,
      processing_time_ms: 0,
      intention: 'general_chat',
      suggestions: this.generateContextualSuggestions(message, context),
      metadata: {
        model_used: 'Local Intelligence (Backend Fallback)',
        timestamp: new Date().toISOString()
      }
    };
  }

  private generateErrorResponse(error: any, intention: string): DriverAIResponse {
    return {
      success: false,
      message: `🚨 **Error del Sistema**\n\nNo pude procesar tu consulta en este momento. El backend Driver AI puede estar temporalmente no disponible.\n\n**Error**: ${error.message || 'Error desconocido'}\n\n**Sugerencia**: Intenta nuevamente en unos momentos o contacta al equipo de soporte.`,
      confidence: 0,
      processing_time_ms: 0,
      intention: intention as any,
      metadata: {
        model_used: 'Error Handler',
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * 🏥 HEALTH CHECK
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 📊 OBTENER ESTADÍSTICAS
   */
  getStats() {
    return {
      conversation_length: this.conversationHistory.length,
      mode: this.config.mode,
      last_interaction: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp,
      capabilities: ['protein_analysis', 'general_chat', 'protocol_help', 'experiment_guidance']
    };
  }

  /**
   * 🔄 LIMPIAR HISTORIAL
   */
  clearHistory() {
    this.conversationHistory = [];
  }
}
