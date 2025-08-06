/**
 * 💬 ENHANCED CHAT SERVICE - DRIVER AI INTEGRATION
 * Servicio que orquesta entre Driver     if (this.config.enableDriverAI) {
      
      if (this.driverAIAvailable) {
        console.log('🚀 Using Driver AI (available)');
        console.log('📞 CALLING callDriverAI...');
        response = await this.callDriverAI(message, classification, userId);
        console.log('✅ callDriverAI completed successfully');
      } else {
        console.log('💥 Driver AI not available - providing error message');enAI
 */

import { DriverAIClient, DriverAIResponse, DriverAIContext } from './driver-ai-client';
import { queryClassifier, QueryClassification } from './query-classifier';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  source?: 'driver-ai' | 'openai';
  confidence?: number;
  recommendations?: string[];
  processing_time?: number;
  classification?: QueryClassification;
}

export interface ChatServiceConfig {
  openaiApiKey: string;
  fallbackToOpenAI: boolean;
  maxRetries: number;
  enableDriverAI: boolean;
}

export class ChatService {
  private config: ChatServiceConfig;
  private driverAIAvailable: boolean = false;
  private driverAIClient: DriverAIClient;

  constructor(openaiApiKey: string, options: Partial<ChatServiceConfig> = {}) {
    this.config = {
      openaiApiKey,
      fallbackToOpenAI: true,
      maxRetries: 2,
      enableDriverAI: true,
      ...options
    };
    
    // Inicializar cliente Driver AI
    this.driverAIClient = new DriverAIClient();
  }

  async checkDriverAIHealth(): Promise<boolean> {
    console.log('🔧 ChatService.checkDriverAIHealth() called');
    console.log('🔧 enableDriverAI:', this.config.enableDriverAI);
    
    if (!this.config.enableDriverAI) {
      console.log('🔧 Driver AI disabled in config');
      return false;
    }
    
    console.log('🔧 Calling driverAIClient.healthCheck()...');
    const healthResult = await this.driverAIClient.healthCheck();
    console.log('🔧 Health check result:', healthResult);
    
    this.driverAIAvailable = healthResult;
    console.log('🔧 Set driverAIAvailable to:', this.driverAIAvailable);
    
    return this.driverAIAvailable;
  }

  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[] = [],
    userId: string = 'user'
  ): Promise<ChatMessage> {
    
    console.log('🚀🚀🚀 ChatService.sendMessage() INICIADO');
    console.log('📝 Message:', message.substring(0, 50) + '...');
    console.log('👤 User ID:', userId);
    
    const startTime = Date.now();
    
    // Verificar salud del Driver AI SIEMPRE antes de procesar
    console.log('🏥 Checking Driver AI health before processing message...');
    const healthCheck = await this.checkDriverAIHealth();
    console.log('🏥 Health check completed. Result:', healthCheck);
    console.log('🏥 this.driverAIAvailable after health check:', this.driverAIAvailable);
    
    // Clasificar el query
    const classification = queryClassifier.classify(message);
    
    console.log('🔍 Query classification:', classification);
    console.log('🔧 Driver AI available:', this.driverAIAvailable);
    console.log('🎯 Driver AI enabled:', this.config.enableDriverAI);

    // SIEMPRE usar Driver AI si está habilitado
    let response: ChatMessage;
    
    console.log('⚡ STARTING DRIVER AI ROUTING...');
    
    if (this.config.enableDriverAI) {
      
      if (this.driverAIAvailable) {
        console.log('🚀 Using Driver AI (available)');
        response = await this.callDriverAI(message, classification, userId);
      } else {
        console.log('� Driver AI not available - providing error message');
        response = {
          id: Date.now().toString(),
          content: `🚨 **Driver AI Backend Offline**\n\nEl backend Driver AI no está disponible actualmente.\n\n**Estado:** ${this.driverAIAvailable ? 'Online' : 'Offline'}\n\n**Para consultas científicas como:**\n- Análisis de secuencias de proteínas\n- Búsquedas BLAST\n- Docking molecular\n- Consultas PDB/UniProt\n\n**Necesitas Driver AI activo en 3.85.5.222:8001**\n\nPor favor verifica la conectividad e intenta nuevamente.`,
          role: 'assistant',
          timestamp: new Date(),
          source: 'driver-ai',
          confidence: 0
        };
      }
      
    } else {
      console.log('🔄 Driver AI disabled');
      response = {
        id: Date.now().toString(),
        content: `⚙️ **Driver AI Deshabilitado**\n\nEl Driver AI está deshabilitado en la configuración.\n\nPara usar análisis científicos avanzados, habilita Driver AI en las configuraciones.`,
        role: 'assistant',
        timestamp: new Date(),
        source: 'driver-ai',
        confidence: 0
      };
    }

    response.processing_time = Date.now() - startTime;
    response.classification = classification;

    return response;
  }

  private async callDriverAI(
    message: string,
    classification: QueryClassification,
    userId: string
  ): Promise<ChatMessage> {
    
    try {
      const response = await this.driverAIClient.analyze(message, {
        user_id: userId,
        session_id: `session_${Date.now()}`,
        domain: classification.domain,
        analysis_type: 'scientific_research'
      });

      // Driver AI 7.0 siempre devuelve resultados válidos
      console.log('✅ Driver AI response received:', response);
      
      return {
        id: Date.now().toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
        source: 'driver-ai',
        confidence: response.confidence,
        recommendations: response.recommendations,
        processing_time: response.processing_time_ms
      };

    } catch (error) {
      console.error('🚨 Driver AI connection failed completely:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // NO usar fallback a OpenAI - mostrar error claro
      return {
        id: Date.now().toString(),
        content: `🚨 **Error de Conexión con Driver AI**\n\n${errorMessage}\n\n**Para resolver:**\n1. Verificar que Driver AI esté ejecutándose en 3.85.5.222:8001\n2. Comprobar conectividad de red\n3. Revisar logs del backend\n\n*Driver AI es necesario para análisis científicos completos.*`,
        role: 'assistant',
        timestamp: new Date(),
        source: 'driver-ai',
        confidence: 0
      };
    }
  }

  // Método para obtener estadísticas
  async getSystemStats() {
    const stats: any = {
      driverAIAvailable: this.driverAIAvailable,
      lastHealthCheck: new Date().toISOString(),
      config: {
        enableDriverAI: this.config.enableDriverAI,
        fallbackToOpenAI: this.config.fallbackToOpenAI
      }
    };

    if (this.driverAIAvailable) {
      const driverStats = await this.driverAIClient.getSystemStats();
      if (driverStats) {
        stats.driverAIStats = driverStats;
      }
    }

    return stats;
  }
}
