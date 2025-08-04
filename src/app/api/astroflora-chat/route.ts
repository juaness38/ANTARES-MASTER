import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';

export const maxDuration = 30;

// Configuración del cliente MCP
const mcpConfig = {
  baseURL: 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev', // Updated to use API Gateway
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Astroflora-Frontend/1.0.0',
    'Accept': 'application/json',
    'Origin': 'https://antares-master-gzl8-k77hna6p6-juaness38s-projects.vercel.app'
  }
};

// Función para enviar al Driver AI del MCP Server
async function sendToDriverAI(message: string, userId: string = 'user123') {
  const payload = {
    query: message,
    context: {
      user_id: userId,
      session_id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'frontend_chat'
    }
  };

  try {
    console.log('🚀 Enviando al MCP Server:', payload);
    
    const response = await fetch(`${mcpConfig.baseURL}/driver-ai/analyze`, {
      method: 'POST',
      headers: mcpConfig.headers,
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Respuesta del MCP Server:', result);
      
      return {
        success: true,
        message: result.analysis.result,
        confidence: result.analysis.confidence,
        processingTime: result.analysis.processing_time_ms,
        recommendations: result.analysis.recommendations || []
      };
    } else {
      throw new Error(`MCP Server HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Error conectando al MCP Server:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      message: 'Error de conexión con el servidor MCP'
    };
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Intentar usar MCP Server primero
    const mcpResponse = await sendToDriverAI(lastMessage.content);
    
    if (mcpResponse.success) {
      // Respuesta directa del MCP Server (Driver AI)
      const responseText = `${mcpResponse.message}

📊 **Análisis completado por Driver AI**
- Confianza: ${Math.round(mcpResponse.confidence * 100)}%
- Tiempo de procesamiento: ${mcpResponse.processingTime}ms

${mcpResponse.recommendations.length > 0 ? `
🔬 **Recomendaciones:**
${mcpResponse.recommendations.map((rec: string) => `• ${rec}`).join('\n')}
` : ''}

*Powered by AstroFlora MCP Server v1.0.0*`;

      return new Response(responseText, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      // Fallback a OpenAI si MCP Server no está disponible
      console.log('⚠️ MCP Server no disponible, usando fallback OpenAI');
      
      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertToModelMessages(messages),
        system: `Eres AstroFlora AI, un asistente especializado en biología molecular, genética, bioinformática y biotecnología.

CONTEXTO ANTARES:
- Estás integrado en la plataforma ANTARES para experimentos científicos
- Los usuarios trabajan con análisis BLAST, predicción de estructuras proteicas, y anotación de proteínas
- El MCP Server principal no está disponible, funcionando en modo fallback
- Proporciona respuestas técnicas precisas y actionables

ESPECIALIDADES:
🧬 Análisis BLAST (homología de secuencias)
🔬 Predicción de estructura proteica (AlphaFold, modelado molecular) 
📊 Anotación funcional de proteínas
🌱 Biología molecular y celular
🧪 Técnicas de laboratorio
📈 Análisis bioinformático

Responde de forma concisa pero completa. Indica que estás en modo fallback.`,
        temperature: 0.1,
      });

      return result.toTextStreamResponse();
    }
    
  } catch (error) {
    console.error('❌ Chat API error:', error);
    return new Response('Error en el chat de AstroFlora', { status: 500 });
  }
}
