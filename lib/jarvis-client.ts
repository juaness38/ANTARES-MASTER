/**
 * 🤖 DRIVER AI CLIENT - JARVIS INTEGRATION
 * Cliente simplificado y corregido para apuntar al proxy API de Next.js
 */

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
  intention?: string;
}

export class DriverAIClientJarvis {
  // Apuntar al endpoint del proxy API de Next.js que ya existe
  private baseUrl: string = '/api/driver-ai';
  private timeout: number = 30000;

  constructor() {
    console.log('🤖 Jarvis Driver AI Client inicializado. Conectando a:', this.baseUrl);
  }

  /**
   * 🎯 Método principal para procesar la entrada del usuario
   */
  async process(input: string): Promise<DriverAIResponse> {
    console.log('🤖 Enviando a Jarvis a través del proxy de Next.js:', input);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // CORREGIDO: Se envía 'message' que es el formato esperado por el backend.
          message: input 
        }),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error del Driver AI: ${response.status}`, errorText);
        throw new Error(`El Driver AI devolvió un error: ${response.status}.`);
      }

      const data = await response.json();
      
      // Adaptar la respuesta del backend al formato que espera el frontend
      const jarvisResponse: DriverAIResponse = {
        message: data.response || data.message || data.analysis || 'Respuesta recibida.',
        confidence: data.confidence || 0.9,
        commands: data.commands || [],
        data: data,
        suggestions: data.suggestions || [],
        intention: data.intention || 'analysis'
      };
      
      console.log('✅ Respuesta de Jarvis recibida:', jarvisResponse);
      return jarvisResponse;
      
    } catch (error) {
      console.error('🚨 Error procesando la solicitud de Jarvis:', error);
      return this.handleError(error as Error);
    }
  }

  /**
   * � Verificar la salud del backend a través del proxy
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Usamos GET para el health check, como está definido en el route.ts
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Fallo el health check de Jarvis:', error);
      return false;
    }
  }

  /**
   * ❌ Manejo de errores centralizado
   */
  private handleError(error: Error): DriverAIResponse {
    return {
      message: `❌ Lo siento, no puedo conectar con el Driver AI en este momento. ${error.message}`,
      confidence: 0,
      commands: [],
      suggestions: ['Reintentar en unos segundos', 'Verificar el estado del sistema'],
      intention: 'error'
    };
  }
}

// Exportar una instancia única del cliente
export const jarvisClient = new DriverAIClientJarvis();
