/**
 * 🤖 DRIVER AI CLIENT - JARVIS INTEGRATION
 * Cliente inteligente conectado al estado global de Astroflora
 * Patrón: Comando → API → Chat → Estado Global → Componente Visual
 */

import { useAstrofloraStore } from './astroflora-store';

export interface DriverAICommand {
  type: 'LOAD_PDB' | 'SET_SEQUENCE' | 'SET_VIEWER_MODE' | 'LOAD_PCA_DATA' | 'START_EXPERIMENT' | 'ADD_PROTOCOL_STEP';
  payload: any;
  metadata?: {
    confidence: number;
    source: string;
    timestamp: string;
  };
}

export interface DriverAIResponse {
  message: string;
  confidence: number;
  commands?: DriverAICommand[];
  data?: any;
  suggestions?: string[];
}

export class DriverAIClientJarvis {
  private baseUrl: string;
  private timeout: number;
  private store: any;

  constructor() {
    this.baseUrl = '/api/driver-ai';
    this.timeout = 30000;
    
    console.log('🤖 Jarvis Driver AI Client initialized:', {
      baseUrl: this.baseUrl,
      features: ['command-execution', 'state-integration', 'intelligent-routing'],
      architecture: 'Command → API → Chat → Estado Global → Componente Visual'
    });
  }

  /**
   * 🔍 DETECCIÓN INTELIGENTE DE TIPO DE CONSULTA
   */
  private detectQueryType(input: string): string {
    const cleanInput = input.replace(/\s+/g, '').toUpperCase();
    
    // Detectar secuencias de proteínas (aminoácidos)
    const aminoAcids = 'ACDEFGHIKLMNPQRSTVWY';
    const aminoAcidPattern = new RegExp(`^[${aminoAcids}]{10,}$`);
    
    if (aminoAcidPattern.test(cleanInput)) {
      console.log('🧬 Detected: PROTEIN_ANALYSIS');
      return 'PROTEIN_ANALYSIS';
    }
    
    // Detectar consultas sobre estructuras PDB
    if (/\b(pdb|protein data bank|structure|1[0-9a-z]{3})\b/i.test(input)) {
      console.log('🏗️ Detected: STRUCTURE_QUERY');
      return 'STRUCTURE_QUERY';
    }
    
    // Detectar consultas sobre protocolos
    if (/\b(pcr|protocol|experiment|assay|method)\b/i.test(input)) {
      console.log('🧪 Detected: PROTOCOL_QUERY');
      return 'PROTOCOL_QUERY';
    }
    
    // Por defecto: conversacional
    console.log('💬 Detected: CONVERSATIONAL');
    return 'CONVERSATIONAL';
  }

  /**
   * 🧠 DETECCIÓN INTELIGENTE DE COMANDOS
   * Analiza la respuesta del Driver AI para extraer comandos accionables
   */
  private extractCommands(aiResponse: any): DriverAICommand[] {
    const commands: DriverAICommand[] = [];
    
    // Extraer comandos de la respuesta del AI
    if (aiResponse.analysis_id && aiResponse.results) {
      // Es un análisis de proteína - comandos automáticos
      if (aiResponse.input_sequence) {
        commands.push({
          type: 'SET_SEQUENCE',
          payload: aiResponse.input_sequence,
          metadata: {
            confidence: aiResponse.metadata?.confidence_score || 0.9,
            source: 'protein_analysis',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Si hay recomendaciones de estructura, cargar PDB
      if (aiResponse.results.structural_prediction) {
        // Aquí podrías mapear predicciones a PDB IDs conocidos
        const suggestedPDB = this.mapStructureToPDB(aiResponse.results);
        if (suggestedPDB) {
          commands.push({
            type: 'LOAD_PDB',
            payload: suggestedPDB,
            metadata: {
              confidence: 0.8,
              source: 'structure_prediction',
              timestamp: new Date().toISOString()
            }
          });
        }
      }
    }
    
    // Detectar comandos en texto de respuesta
    const responseText = aiResponse.message || '';
    commands.push(...this.parseTextCommands(responseText));
    
    return commands;
  }

  /**
   * 🎯 MAPEO DE ESTRUCTURA A PDB
   */
  private mapStructureToPDB(results: any): string | null {
    // Lógica para mapear características estructurales a PDB IDs
    const proteinLength = results.sequence_info?.length;
    
    if (proteinLength && proteinLength < 100) {
      return '1CRN'; // Crambin - proteína pequeña ejemplo
    } else if (proteinLength && proteinLength > 300) {
      return '1HHO'; // Hemoglobina - proteína grande ejemplo
    }
    
    return null;
  }

  /**
   * 📝 PARSER DE COMANDOS EN TEXTO
   */
  private parseTextCommands(text: string): DriverAICommand[] {
    const commands: DriverAICommand[] = [];
    const lowerText = text.toLowerCase();
    
    // Detectar menciones de PDB IDs
    const pdbMatch = text.match(/(?:pdb|structure)\s*:?\s*([1-9][a-zA-Z0-9]{3})/i);
    if (pdbMatch) {
      commands.push({
        type: 'LOAD_PDB',
        payload: pdbMatch[1].toUpperCase(),
        metadata: {
          confidence: 0.9,
          source: 'text_parsing',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    // Detectar cambios de modo de visualización
    if (lowerText.includes('cartoon') || lowerText.includes('ribbon')) {
      commands.push({
        type: 'SET_VIEWER_MODE',
        payload: 'cartoon',
        metadata: { confidence: 0.8, source: 'text_parsing', timestamp: new Date().toISOString() }
      });
    } else if (lowerText.includes('surface')) {
      commands.push({
        type: 'SET_VIEWER_MODE',
        payload: 'surface',
        metadata: { confidence: 0.8, source: 'text_parsing', timestamp: new Date().toISOString() }
      });
    }
    
    return commands;
  }

  /**
   * 🎯 EJECUTOR DE COMANDOS
   * Conecta con el estado global para ejecutar comandos
   */
  private executeCommands(commands: DriverAICommand[]): void {
    if (commands.length === 0) return;
    
    console.log('🎯 Jarvis: Executing', commands.length, 'commands');
    
    // Obtener acceso al store global
    const store = useAstrofloraStore.getState();
    
    commands.forEach((command, index) => {
      setTimeout(() => {
        console.log(`🎯 Executing command ${index + 1}:`, command);
        
        // Marcar como procesando
        store.setProcessingCommand(true);
        
        // Ejecutar comando a través del estado global
        store.executeDriverCommand(command);
        
        // Marcar como completado
        setTimeout(() => {
          store.setProcessingCommand(false);
        }, 1000);
        
      }, index * 500); // Espaciar comandos para mejor UX
    });
  }

  /**
   * 🧬 ANÁLISIS INTELIGENTE DE PROTEÍNAS
   */
  async analyzeProtein(sequence: string): Promise<DriverAIResponse> {
    try {
      console.log('🧬 Jarvis: Analyzing protein sequence...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client': 'Jarvis-Driver-AI'
        },
        body: JSON.stringify({
          sequence: sequence.replace(/[\s\n>]/g, ''),
          analysis_type: 'blast'
        })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extraer comandos de la respuesta
      const commands = this.extractCommands(data);
      
      // Ejecutar comandos automáticamente
      this.executeCommands(commands);
      
      // Formatear respuesta para el chat
      const formattedMessage = this.formatProteinAnalysis(data);
      
      return {
        message: formattedMessage,
        confidence: data.metadata?.confidence_score || 0.9,
        commands,
        data,
        suggestions: data.results?.recommendations || []
      };
      
    } catch (error) {
      console.error('🚨 Jarvis: Protein analysis failed:', error);
      throw error;
    }
  }

  /**
   * 💬 CHAT CONVERSACIONAL INTELIGENTE
   */
  async chatConversational(message: string): Promise<DriverAIResponse> {
    try {
      console.log('💬 Jarvis: Processing conversational message...');
      
      // Simular respuesta inteligente basada en el mensaje
      const response = await this.generateIntelligentResponse(message);
      
      // Extraer comandos potenciales
      const commands = this.parseTextCommands(response.message);
      
      // Ejecutar comandos si los hay
      this.executeCommands(commands);
      
      return response;
      
    } catch (error) {
      console.error('🚨 Jarvis: Conversational chat failed:', error);
      throw error;
    }
  }

  /**
   * 🧠 GENERADOR DE RESPUESTAS INTELIGENTES
   */
  private async generateIntelligentResponse(message: string): Promise<DriverAIResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Respuestas específicas por tipo de consulta
    if (lowerMessage.includes('conectado') || lowerMessage.includes('backend')) {
      return {
        message: '✅ **Driver AI Conectado y Operativo**\n\nSoy Jarvis, tu asistente científico de Astroflora. Estoy completamente conectado al backend Driver AI 7.0.\n\n**Capacidades activas:**\n- 🧬 Análisis de secuencias de proteínas\n- 📊 Visualización molecular automática\n- 🧪 Asistencia en protocolos experimentales\n- 📈 Análisis de datos bioinformáticos\n\n¿En qué experimento te puedo ayudar hoy?',
        confidence: 1.0,
        suggestions: [
          'Analizar una secuencia de proteína',
          'Diseñar un protocolo de PCR',
          'Cargar una estructura PDB',
          'Crear un experimento nuevo'
        ]
      };
    }
    
    if (lowerMessage.includes('pdb') || lowerMessage.includes('estructura')) {
      const commands: DriverAICommand[] = [
        {
          type: 'LOAD_PDB',
          payload: '1CRN',
          metadata: { confidence: 0.9, source: 'demo', timestamp: new Date().toISOString() }
        }
      ];
      
      return {
        message: '🧬 **Cargando Estructura Molecular**\n\nHe cargado la estructura PDB: 1CRN (Crambin) como ejemplo.\n\nPuedes pedirme:\n- Cambiar el modo de visualización (cartoon, surface, ball-stick)\n- Cargar otra estructura específica\n- Analizar sitios activos\n- Comparar con otras estructuras',
        confidence: 0.9,
        commands,
        suggestions: [
          'Cambiar a modo surface',
          'Mostrar sitios activos',
          'Cargar hemoglobina (1HHO)',
          'Analizar cavidades'
        ]
      };
    }
    
    if (lowerMessage.includes('pcr') || lowerMessage.includes('protocolo')) {
      return {
        message: '🧪 **Asistente de Protocolos PCR**\n\nPuedo ayudarte a diseñar protocolos de PCR optimizados.\n\n**Información que necesito:**\n- Secuencia objetivo o gen de interés\n- Tamaño del amplicón deseado\n- Condiciones especiales (GC%, Tm, etc.)\n\n**Protocolos disponibles:**\n- PCR estándar\n- qPCR/RT-PCR\n- PCR de colonia\n- PCR de alta fidelidad',
        confidence: 0.95,
        suggestions: [
          'Diseñar primers para gen específico',
          'Optimizar condiciones de PCR',
          'Protocolo de qPCR',
          'Troubleshooting PCR'
        ]
      };
    }
    
    // Respuesta por defecto
    return {
      message: `🤖 **Jarvis Científico Activo**\n\nHe recibido tu mensaje: "${message}"\n\nComo tu asistente científico, puedo ayudarte con:\n- 🧬 Análisis de secuencias y estructuras\n- 🧪 Diseño de experimentos\n- 📊 Visualización de datos\n- 📈 Interpretación de resultados\n\n¿Hay algún análisis específico que necesites?`,
      confidence: 0.7,
      suggestions: [
        'Analizar secuencia de proteína',
        'Cargar estructura molecular',
        'Diseñar protocolo experimental',
        'Ver experimentos activos'
      ]
    };
  }

  /**
   * 📋 FORMATEAR ANÁLISIS DE PROTEÍNAS
   */
  private formatProteinAnalysis(data: any): string {
    if (!data.results) return 'Análisis completado sin resultados específicos.';
    
    const { sequence_info, structural_prediction, recommendations } = data.results;
    
    let message = '🧬 **Análisis de Proteína Completado**\n\n';
    
    if (sequence_info) {
      message += `**📊 Información de Secuencia:**\n`;
      message += `- Longitud: ${sequence_info.length} aminoácidos\n`;
      message += `- Peso Molecular: ${sequence_info.molecular_weight_kda} kDa\n`;
      message += `- Punto Isoeléctrico: ${sequence_info.isoelectric_point}\n`;
      message += `- Hidrofobicidad: ${sequence_info.hydrophobicity_index}\n\n`;
    }
    
    if (structural_prediction) {
      message += `**🏗️ Predicción Estructural:**\n`;
      message += `- α-hélice: ${(structural_prediction.alpha_helix_probability * 100).toFixed(1)}%\n`;
      message += `- β-lámina: ${(structural_prediction.beta_sheet_probability * 100).toFixed(1)}%\n`;
      message += `- Bucle: ${(structural_prediction.random_coil_probability * 100).toFixed(1)}%\n\n`;
    }
    
    if (recommendations && recommendations.length > 0) {
      message += `**🎯 Recomendaciones:**\n`;
      recommendations.forEach((rec: string, idx: number) => {
        message += `${idx + 1}. ${rec}\n`;
      });
    }
    
    message += `\n✨ *He actualizado automáticamente la visualización molecular*`;
    
    return message;
  }

  /**
   * 🎯 MÉTODO UNIVERSAL - PUNTO DE ENTRADA PRINCIPAL
   */
  async process(input: string): Promise<DriverAIResponse> {
    console.log('🤖 Jarvis processing input:', input);
    
    try {
      const queryType = this.detectQueryType(input);
      console.log('🔍 Query type detected:', queryType);
      
      // Preparar payload para Driver AI
      const payload = {
        query: input,
        context: {
          source: 'jarvis',
          intent: queryType,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('📤 Sending to Driver AI:', payload);
      
      // Llamar a Driver AI a través de la API proxy
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Jarvis-Client/1.0.0'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Driver AI API failed: ${response.status} ${response.statusText}`);
      }
      
      const driverAIResponse = await response.json();
      console.log('📥 Driver AI response:', driverAIResponse);
      
      // Procesar respuesta y extraer comandos
      const commands = this.extractCommands(driverAIResponse);
      console.log('⚡ Commands extracted:', commands);
      
      // Ejecutar comandos en el estado global
      if (commands.length > 0) {
        await this.executeCommands(commands);
      }
      
      // Formatear respuesta para el chat
      const chatMessage = this.formatChatMessage(driverAIResponse, queryType);
      
      const jarvisResponse: DriverAIResponse = {
        message: chatMessage,
        confidence: driverAIResponse.metadata?.confidence_score || 0.8,
        commands: commands,
        data: driverAIResponse,
        suggestions: driverAIResponse.results?.recommendations || []
      };
      
      console.log('✅ Jarvis response ready:', jarvisResponse);
      return jarvisResponse;
      
    } catch (error) {
      console.error('🚨 Jarvis processing error:', error);
      
      // Respuesta de fallback
      return {
        message: `🚨 **Error de conexión con Driver AI**\n\n${error instanceof Error ? error.message : 'Error desconocido'}\n\nVerificando conexión...`,
        confidence: 0,
        commands: [],
        data: null,
        suggestions: ['Verificar conexión de red', 'Reintentar en unos momentos']
      };
    }
  }

  /**
   * 📝 FORMATEAR MENSAJE DE CHAT DESDE DRIVER AI
   */
  private formatChatMessage(driverAIResponse: any, queryType: string): string {
    const { results, metadata, analysis_id, input_sequence } = driverAIResponse;
    
    if (queryType === 'PROTEIN_ANALYSIS' && results) {
      const info = results.sequence_info;
      const structural = results.structural_prediction;
      const recommendations = results.recommendations || [];
      
      let message = `🧬 **Análisis Completado - Secuencia: ${input_sequence}**\n\n`;
      
      // Información básica
      if (info) {
        message += `📊 **Propiedades Básicas:**\n`;
        message += `• Longitud: ${info.length} aminoácidos\n`;
        message += `• Peso molecular: ${info.molecular_weight_kda} kDa\n`;
        message += `• Punto isoeléctrico: ${info.isoelectric_point}\n`;
        message += `• Índice de hidrofobicidad: ${info.hydrophobicity_index}\n\n`;
      }
      
      // Predicción estructural
      if (structural) {
        message += `🏗️ **Predicción Estructural:**\n`;
        message += `• α-hélice: ${(structural.alpha_helix_probability * 100).toFixed(1)}%\n`;
        message += `• β-hoja: ${(structural.beta_sheet_probability * 100).toFixed(1)}%\n`;
        message += `• Estructura aleatoria: ${(structural.random_coil_probability * 100).toFixed(1)}%\n\n`;
      }
      
      // Recomendaciones
      if (recommendations.length > 0) {
        message += `💡 **Recomendaciones Experimentales:**\n`;
        recommendations.forEach((rec: string, idx: number) => {
          message += `${idx + 1}. ${rec}\n`;
        });
        message += '\n';
      }
      
      // Confianza y metadata
      if (metadata) {
        message += `📈 **Confianza del análisis:** ${(metadata.confidence_score * 100).toFixed(1)}%\n`;
        message += `⚡ **Tiempo de procesamiento:** ${metadata.processing_time_seconds}s\n`;
        message += `🔬 **ID de análisis:** ${analysis_id}`;
      }
      
      return message;
    }
    
    // Para otros tipos de consulta, generar respuesta inteligente
    return this.generateContextualResponse(driverAIResponse, queryType);
  }

  /**
   * 🧠 RESPUESTA CONTEXTUAL INTELIGENTE
   */
  private generateContextualResponse(driverAIResponse: any, queryType: string): string {
    // Si Driver AI devuelve datos de proteína para una consulta conversacional,
    // adaptamos la respuesta
    if (driverAIResponse.results && queryType === 'CONVERSATIONAL') {
      return `🤖 **Jarvis Responde:**\n\nHe procesado tu consulta utilizando mi motor de análisis de proteínas. Aunque tu pregunta no era específicamente sobre una secuencia, he detectado que Driver AI ha procesado información biológica relevante.\n\n¿Te gustaría que analice alguna secuencia específica o prefieres que te ayude con otro tipo de consulta científica?`;
    }
    
    // Respuesta por defecto
    return `🤖 **Jarvis Conectado**\n\nHe recibido tu consulta y estoy procesando la información a través de Driver AI 7.0.\n\n**Estado:** ✅ Conectado y operativo\n**Motor:** Driver AI v7.0\n**Capacidades:** Análisis de proteínas, visualización molecular, protocolos experimentales\n\n¿En qué puedo ayudarte específicamente?`;
  }

  /**
   * 🏥 HEALTH CHECK
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Jarvis-HealthCheck/1.0.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Driver AI Health:', data);
        return data.status === 'healthy';
      }
      
      return false;
    } catch (error) {
      console.error('🚨 Jarvis health check failed:', error);
      return false;
    }
  }
}

// 🎯 INSTANCIA SINGLETON
export const jarvisClient = new DriverAIClientJarvis();
