import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log('🚀 AstroFlora Chat API route called');
  const { messages }: { messages: UIMessage[] } = await req.json();
  console.log('📨 Messages received:', messages.length);

  try {
    console.log('🤖 Starting streamText...');
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
      system: `You are AstroFlora AI, a plant biology expert specialized in:

🎯 EXPERTISE AREAS:
- Molecular biology and genetics
- Plant physiology and biochemistry  
- Bioinformatics and computational biology
- Environmental monitoring and agriculture
- Biotechnology and genetic engineering
- Phylogenetics and evolution
- Drug discovery from natural products

🧬 BEHAVIOR:
- Provide scientifically accurate information
- Use technical terms when appropriate but explain them clearly
- Reference current research when relevant
- Be helpful and encouraging about biological sciences
- Use emojis sparingly but effectively for visual appeal

Always maintain your scientific expertise while being conversational and accessible.`,
      temperature: 0.7,
    });

    console.log('📤 Returning stream response...');
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Fallback without streaming
    const result = streamText({
      model: openai('gpt-4o'),
      messages: convertToModelMessages(messages),
      system: `You are AstroFlora AI, an advanced biological intelligence assistant specializing in plant biology, genetics, biotechnology, environmental monitoring, and agricultural sciences.

Note: Advanced tools are currently unavailable. You can still provide general biological expertise and advice.

Always be helpful, accurate, and maintain your biology and environmental expertise focus.`,
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  }
}

// --- CONFIGURACIÓN BACKEND (RESTORED API GATEWAY) ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev';
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev'; // Restored to API Gateway
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'https://qmoyxt3015.execute-api.us-east-1.amazonaws.com/dev'; // Restored API Gateway

// --- INTERFACES ---
interface CommandResponse {
  type: 'command';
  action: string;
  parameters: any;
  message: string;
  files?: FileAttachment[];
  status: 'success' | 'error' | 'info';
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string;
}

interface ChatResponse {
  type: 'chat';
  message: string;
  files?: FileAttachment[];
}

// --- CONEXIÓN AL MCP SERVER ---
async function sendToDriverAI(message: string) {
  try {
    console.log(`🚀 Sending to Driver AI: ${MCP_SERVER_URL}/mayahuelin/analyze`);
    console.log(`📤 Message: ${message}`);
    console.log(`🔧 MCP_SERVER_URL: ${MCP_SERVER_URL}`);
    
    const response = await fetch(`${MCP_SERVER_URL}/mayahuelin/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'AstroFlora-Frontend/1.0.0',
        'Accept': 'application/json',
        'Origin': 'https://antares-master-gzl8-k77hna6p6-juaness38s-projects.vercel.app'
      },
      body: JSON.stringify({ 
        query: message,
        context: { 
          source: 'enhanced_chat',
          timestamp: new Date().toISOString(),
          user_id: 'frontend_user'
        }
      }),
      signal: AbortSignal.timeout(30000)
    });

    console.log(`📡 Response status: ${response.status}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Driver AI success:`, result);
      return { success: true, data: result };
    }
    
    const errorText = await response.text();
    console.error(`❌ MCP Server error: ${response.status} - ${errorText}`);
    throw new Error(`MCP Server error: ${response.status} - ${errorText}`);
  } catch (error) {
    console.error(`💥 Driver AI connection error:`, error);
    
    // FALLBACK: Provide helpful error message with backend status
    return { 
      success: false, 
      error: String(error),
      fallbackMessage: `🚨 **Backend Status: Desconectado**
      
El backend de AstroFlora (${MCP_SERVER_URL}) no está disponible actualmente.

**Posibles causas:**
• 🔌 Instancia de Lightsail apagada o con problemas
• 🌐 Error de conectividad del API Gateway
• ⚙️ Servicios backend no iniciados

**Comandos disponibles en modo demo:**
• \`driver pasame los pdb\` - Ver archivos PDB de demostración
• \`load pdb 1crn\` - Cargar estructura proteica
• \`blast\` - Información sobre análisis BLAST

**Para restaurar conectividad:**
1. Verificar instancia de Lightsail
2. Reiniciar servicios Docker
3. Comprobar configuración del API Gateway`
    };
  }
}

// --- CONEXIÓN AL BACKEND API ---
async function fetchBackendFiles(fileType: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/files?type=${fileType}`, {
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'AstroFlora-Frontend/1.0.0',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, files: data.files || [] };
    }
    
    // Log the error for debugging
    console.error(`Backend API error: ${response.status} - ${response.statusText}`);
    const errorText = await response.text();
    console.error('Error response:', errorText);
    
    throw new Error(`Backend API error: ${response.status} - ${errorText}`);
  } catch (error) {
    console.error('fetchBackendFiles error:', error);
    return { 
      success: false, 
      files: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// --- DETECCIÓN DE COMANDOS DRIVER ---
function isDriverCommand(text: string): boolean {
  const input = text.toLowerCase().trim();
  const driverKeywords = ['driver', 'pasame', 'muestra', 'dame', 'carga', 'load', 'blast', 'analiza'];
  
  return driverKeywords.some(keyword => input.includes(keyword)) ||
         input.startsWith('driver ') ||
         input.includes('driver ');
}

// --- PARSEO DE COMANDOS ---
async function parseDriverCommand(text: string): Promise<CommandResponse | null> {
  const input = text.toLowerCase().trim();
  
  // Comando PDB
  if (input.includes('pdb') && (input.includes('pasame') || input.includes('muestra'))) {
    const backendFiles = await fetchBackendFiles('pdb');
    
    const files = backendFiles.success && backendFiles.files.length > 0 
      ? backendFiles.files.slice(0, 3).map((file: any, i: number) => ({
          id: `pdb-${i}`,
          name: file.name || `protein_${i}.pdb`,
          type: 'application/x-pdb',
          size: file.size || 1024,
          data: btoa(generateMockPDB(`pdb_${i}`))
        }))
      : [
          {
            id: 'pdb-1',
            name: '1crn.pdb',
            type: 'application/x-pdb',
            size: 1024,
            data: btoa(generateMockPDB('1crn'))
          },
          {
            id: 'pdb-2', 
            name: '3zik.pdb',
            type: 'application/x-pdb',
            size: 2048,
            data: btoa(generateMockPDB('3zik'))
          }
        ];

    return {
      type: 'command',
      action: 'SHOW_FILES',
      parameters: { fileType: 'pdb' },
      message: `🧬 Archivos PDB disponibles (${backendFiles.success ? 'backend' : 'demo'}):`,
      files,
      status: backendFiles.success ? 'success' : 'info'
    };
  }

  // Comando BLAST
  if (input.includes('blast')) {
    const files = [{
      id: 'blast-1',
      name: 'blast_results.csv',
      type: 'text/csv',
      size: 2048,
      data: btoa(generateMockBlast())
    }];

    return {
      type: 'command',
      action: 'SHOW_FILES',
      parameters: { fileType: 'blast' },
      message: '📊 Resultados BLAST disponibles:',
      files,
      status: 'success'
    };
  }

  // Comando Load PDB
  if (input.includes('load') && input.includes('pdb')) {
    const pdbMatch = input.match(/(?:pdb\s+)(\w+)/);
    const pdbId = pdbMatch ? pdbMatch[1] : '1crn';
    
    return {
      type: 'command',
      action: 'LOAD_PDB',
      parameters: { pdbId },
      message: `🔬 Cargando estructura ${pdbId.toUpperCase()}...`,
      status: 'success'
    };
  }

  return null;
}

// --- GENERADORES MOCK ---
function generateMockPDB(id: string): string {
  return `HEADER    PROTEIN                             ${new Date().toISOString().slice(0,10)}   ${id.toUpperCase()}
ATOM      1  N   MET A   1      20.154  16.967  22.293  1.00 20.00           N
ATOM      2  CA  MET A   1      19.032  16.866  23.220  1.00 20.00           C
END`;
}

function generateMockBlast(): string {
  return `Query,Subject,Identity,E-value,Score
PROTEIN_1,sp|P12345|EXAMPLE,95.2,2e-156,562
PROTEIN_1,sp|Q67890|SAMPLE,87.3,1e-142,489`;
}

// --- ENDPOINT PRINCIPAL ---
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ 
        type: 'chat',
        message: 'Por favor escribe un mensaje o comando.'
      }, { status: 400 });
    }

    console.log('🔍 Procesando mensaje:', message);

    // 1. Detectar si es comando del driver
    const isDriverMsg = isDriverCommand(message);
    console.log('🤖 Es comando del driver?', isDriverMsg);

    // 2. Si es comando del driver, intentar MCP Server primero
    if (isDriverMsg) {
      const mcpResponse = await sendToDriverAI(message);
      if (mcpResponse.success) {
        // Formatear respuesta científica del backend
        const data = mcpResponse.data;
        const analysisResult = formatScientificResponse(data);
        
        const chatResponse: ChatResponse = {
          type: 'chat',
          message: `🤖 **AstroFlora Driver AI**\n\n${analysisResult}\n\n*Analysis ID: ${data.analysis_id}*\n*Powered by AstroFlora MCP Server*`
        };
        return NextResponse.json(chatResponse);
      }
      
      // Si MCP falla, verificar si hay mensaje de fallback específico
      if (mcpResponse.fallbackMessage) {
        const chatResponse: ChatResponse = {
          type: 'chat',
          message: mcpResponse.fallbackMessage
        };
        return NextResponse.json(chatResponse);
      }
    }

    // 3. Intentar comando driver tradicional (fallback)
    const commandResponse = await parseDriverCommand(message);
    if (commandResponse) {
      console.log('✅ Comando fallback reconocido:', commandResponse.action);
      return NextResponse.json(commandResponse);
    }

    // 4. Si no es comando del driver, usar OpenAI directamente como ChatGPT
    if (!isDriverMsg) {
      console.log('💬 Usando OpenAI Chat directo...');
      
      try {
        const result = await streamText({
          model: openai('gpt-4o-mini'),
          messages: [
            {
              role: 'system',
              content: `Eres AstroFlora Driver AI, un asistente científico especializado en biología molecular, bioinformática y análisis de datos científicos. 
              
Responde de manera conversacional y directa como ChatGPT, pero con expertise científico en:
- Análisis de secuencias de ADN/ARN/proteínas
- Estructuras moleculares y PDB
- Bioinformática y herramientas como BLAST
- Genómica y proteómica
- Análisis filogenético
- Modelado molecular

Mantén un tono científico pero accesible. Si te preguntan sobre comandos específicos del driver, menciona que puedes usar "driver pasame los pdb" para obtener datos del backend.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
        });

        // Convertir el stream a texto
        let fullResponse = '';
        for await (const chunk of result.textStream) {
          fullResponse += chunk;
        }

        const chatResponse: ChatResponse = {
          type: 'chat',
          message: `🤖 **AstroFlora Driver AI**\n\n${fullResponse}\n\n*Powered by OpenAI GPT-4*`
        };
        return NextResponse.json(chatResponse);
        
      } catch (error) {
        console.error('❌ OpenAI Error:', error);
        // Fallback a respuesta científica básica si no hay OpenAI disponible
        console.log('⚠️ OpenAI no disponible, usando respuesta científica básica');
        const fallbackResponse = generateScientificResponse(message);
        const chatResponse: ChatResponse = {
          type: 'chat',
          message: `🤖 **AstroFlora Driver AI** *(Modo Local)*\n\n${fallbackResponse}\n\n*Nota: Para chat completo, configura OPENAI_API_KEY*`
        };
        return NextResponse.json(chatResponse);
      }
    }

    // 5. Si todo falla, respuesta científica básica
    console.log('⚠️ Usando respuesta científica básica');
    
    const scientificResponse = generateScientificResponse(message);
    const chatResponse: ChatResponse = {
      type: 'chat',
      message: scientificResponse + (isDriverMsg ? '\n\n🔧 **Nota**: El Driver AI no está disponible. Intenta más tarde.' : '')
    };
    
    return NextResponse.json(chatResponse);
    
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ 
      type: 'chat',
      message: 'Error procesando solicitud. Intenta un comando como "driver pasame los pdb".'
    }, { status: 500 });
  }
}

// --- GENERADOR DE RESPUESTAS CIENTÍFICAS ---
function generateScientificResponse(message: string): string {
  const input = message.toLowerCase();
  
  if (input.includes('blast')) {
    return `🧬 **BLAST (Basic Local Alignment Search Tool)**

BLAST es una herramienta fundamental en bioinformática que permite:

• **Búsqueda de homología**: Comparar secuencias de ADN/proteínas
• **Identificación de genes**: Encontrar genes similares en bases de datos
• **Análisis evolutivo**: Estudiar relaciones filogenéticas
• **Anotación funcional**: Predecir funciones de nuevas secuencias

**Tipos principales:**
- **BLASTn**: Secuencias de nucleótidos
- **BLASTp**: Secuencias de proteínas  
- **BLASTx**: Traducción de nucleótidos a proteínas

💡 *Prueba: "driver dame los resultados blast" para ver análisis reales*`;
  }

  if (input.includes('pdb') || input.includes('proteína') || input.includes('estructura')) {
    return `🔬 **Estructuras Proteicas y PDB**

El **Protein Data Bank (PDB)** es la base de datos mundial de estructuras 3D:

• **Resolución atómica**: Estructuras determinadas por cristalografía, NMR, criomicroscopía
• **Análisis funcional**: Sitios activos, dominios, interacciones
• **Drug design**: Modelado molecular para desarrollo de fármacos
• **Evolución molecular**: Comparación de estructuras homólogas

**Formatos importantes:**
- **.pdb**: Formato estándar con coordenadas atómicas
- **.cif**: Formato moderno con más información
- **.mol2**: Para modelado molecular

💡 *Prueba: "driver pasame los pdb" para obtener estructuras reales*`;
  }

  if (input.includes('análisis') || input.includes('bioinformática')) {
    return `📊 **Análisis Bioinformático en ANTARES**

La plataforma ANTARES integra múltiples herramientas científicas:

• **Análisis de secuencias**: BLAST, alineamientos múltiples
• **Estructura proteica**: Visualización 3D, predicción de pliegues  
• **Filogenética**: Árboles evolutivos, análisis de diversidad
• **Genómica**: Anotación, expresión génica, variantes

**Flujos de trabajo típicos:**
1. Obtener secuencias → BLAST → Identificación
2. Estructuras PDB → Visualización → Análisis funcional
3. Múltiples secuencias → Alineamiento → Filogenia

💡 *Comandos disponibles: "driver pasame los pdb", "muéstrame blast", "load pdb 1crn"*`;
  }

  return `🤖 **AstroFlora AI - Asistente Científico**

Especializado en biología molecular y bioinformática. 

**Comandos disponibles:**
• \`driver pasame los pdb\` - Obtener estructuras proteicas
• \`muéstrame blast\` - Ver resultados de homología  
• \`load pdb 1crn\` - Cargar estructura en visor
• \`muéstrame fasta\` - Obtener secuencias

**Temas de expertise:**
🧬 Genómica y proteómica
🔬 Análisis estructural  
📊 Bioinformática
🌱 Biología molecular

*El backend MCP está configurándose. Usando modo demo.*`;
}

// --- FORMATEADOR DE RESPUESTA CIENTÍFICA ---
function formatScientificResponse(data: any): string {
  if (!data || !data.results) {
    return 'Análisis completado - Datos no disponibles';
  }

  const { results, recommendations, quality_metrics } = data;
  
  let response = `📊 **Análisis Científico Completado**\n\n`;
  
  // Análisis de secuencia
  if (results.sequence_analysis) {
    const seq = results.sequence_analysis;
    response += `🧬 **Análisis de Secuencia:**\n`;
    response += `• Validación de longitud: ${seq.length_validation}\n`;
    response += `• Análisis de composición: ${seq.composition_analysis}\n`;
    response += `• Búsqueda de homología: ${seq.homology_search}\n`;
    response += `• Predicción de dominio: ${seq.domain_prediction}\n`;
    response += `• Péptido señal: ${seq.signal_peptide}\n\n`;
  }
  
  // Predicción estructural
  if (results.structural_prediction) {
    const struct = results.structural_prediction;
    response += `🔬 **Predicción Estructural:**\n`;
    response += `• Nivel de confianza: ${struct.confidence_level}\n`;
    response += `• Clasificación de pliegue: ${struct.fold_classification}\n`;
    response += `• Sitio activo: ${struct.active_site_prediction}\n`;
    response += `• Puntuación de estabilidad: ${struct.stability_score}\n`;
    response += `• Confianza AlphaFold: ${struct.alphafold_confidence}\n\n`;
  }
  
  // Predicción funcional
  if (results.functional_prediction) {
    const func = results.functional_prediction;
    response += `⚡ **Predicción Funcional:**\n`;
    response += `• Defensa contra patógenos: ${(func.pathogen_defense_likelihood * 100).toFixed(1)}%\n`;
    response += `• Actividad enzimática: ${func.enzymatic_activity}\n`;
    response += `• Localización celular: ${func.cellular_localization}\n`;
    response += `• Respuesta al estrés: ${(func.stress_responsiveness * 100).toFixed(1)}%\n\n`;
  }
  
  // Recomendaciones
  if (recommendations && recommendations.length > 0) {
    response += `💡 **Recomendaciones:**\n`;
    recommendations.slice(0, 3).forEach((rec: string, i: number) => {
      response += `${i + 1}. ${rec}\n`;
    });
    response += `\n`;
  }
  
  // Métricas de calidad
  if (quality_metrics) {
    response += `📈 **Métricas de Calidad:**\n`;
    response += `• Completitud: ${(quality_metrics.data_completeness * 100).toFixed(1)}%\n`;
    response += `• Confianza: ${(quality_metrics.analysis_confidence * 100).toFixed(1)}%\n`;
    response += `• Reproducibilidad: ${(quality_metrics.reproducibility_score * 100).toFixed(1)}%\n`;
  }
  
  return response;
}
